"""
DRK object harvester.

Re-derives the 12 named DRK brand objects (plus supporting props) from the deck's own
full-page renders, where each object already sits on a genuinely black ground.
Alpha is a luminance-derived matte with a soft knee -> preserves glow falloff.
"""
import fitz, os, json
from PIL import Image, ImageFilter

SRC = r"C:\Users\rtayl\Desktop\drk\Pitch deck.pdf"
SCR = r"C:\Users\rtayl\AppData\Local\Temp\claude\C--Users-rtayl-Desktop-drk\c556905a-fb0c-4fdf-ae6f-12a165e66c03\scratchpad"
OUT = os.path.join(SCR, "objects")
os.makedirs(OUT, exist_ok=True)

RENDER_DPI = 220  # 2x the inspection render -> ~2934x1650 per page

# name: (page, (x0,y0,x1,y1) normalised, knee_lo, knee_hi)
OBJECTS = {
    # --- the named brand objects (best isolated instance in the deck) ---
    "liquidity-vault":   (3,  (0.575, 0.255, 0.860, 0.800), 0.030, 0.190),
    "execution-beacon":  (15, (0.588, 0.090, 0.772, 0.515), 0.022, 0.165),
    "execution-engine":  (12, (0.330, 0.328, 0.556, 0.668), 0.026, 0.185),
    "network-nodes":     (9,  (0.643, 0.372, 0.772, 0.642), 0.030, 0.200),
    "routing-path":      (9,  (0.352, 0.395, 0.482, 0.672), 0.028, 0.190),
    "market-chart":      (13, (0.588, 0.070, 0.925, 0.487), 0.028, 0.200),
    "security-shield":   (7,  (0.895, 0.403, 0.973, 0.567), 0.030, 0.200),
    # --- lifecycle row: one matched scale, one lighting setup, rail excluded ---
    "lc-lock":           (10, (0.048, 0.430, 0.183, 0.726), 0.030, 0.200),
    "lc-beacon":         (10, (0.238, 0.430, 0.387, 0.726), 0.030, 0.200),
    "lc-wave":           (10, (0.408, 0.430, 0.585, 0.726), 0.030, 0.200),
    "lc-chart":          (10, (0.605, 0.430, 0.765, 0.726), 0.030, 0.200),
    "lc-depth":          (10, (0.795, 0.430, 0.958, 0.726), 0.030, 0.200),
    # --- supporting props ---
    "wallet":            (2,  (0.523, 0.498, 0.626, 0.672), 0.030, 0.200),
    "falling-chart":     (6,  (0.600, 0.215, 0.955, 0.665), 0.028, 0.200),
    "raise-ring":        (14, (0.390, 0.300, 0.620, 0.712), 0.030, 0.210),
    "raise-droplet":     (14, (0.092, 0.352, 0.180, 0.508), 0.030, 0.200),
    "raise-servers":     (14, (0.090, 0.572, 0.182, 0.752), 0.030, 0.200),
    "raise-puzzle":      (14, (0.382, 0.722, 0.483, 0.862), 0.030, 0.200),
    "raise-people":      (14, (0.686, 0.350, 0.782, 0.492), 0.030, 0.200),
    "raise-dashboard":   (14, (0.677, 0.575, 0.782, 0.748), 0.030, 0.200),
}
# security-lock / liquidity-wave alias to their clean lifecycle-row instances
ALIASES = {"security-lock": "lc-lock", "liquidity-wave": "lc-wave",
           "depth-sculpture": "lc-depth"}

doc = fitz.open(SRC)
pages = {}


def page_img(pno):
    if pno not in pages:
        pix = doc[pno - 1].get_pixmap(dpi=RENDER_DPI)
        pages[pno] = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    return pages[pno]


def matte(img, lo, hi):
    """Luminance-derived alpha with a smooth knee. RGB is left as rendered
    (premultiplied-on-black), which is correct over a near-black ground and
    avoids amplifying JPEG noise in the glow halo."""
    g = img.convert("L").filter(ImageFilter.GaussianBlur(0.6))
    L, H = int(lo * 255), int(hi * 255)
    lut = []
    for i in range(256):
        if i <= L:
            a = 0.0
        elif i >= H:
            a = 1.0
        else:
            t = (i - L) / float(H - L)
            a = t * t * (3 - 2 * t)  # smoothstep
        lut.append(int(round(a * 255)))
    alpha = g.point(lut)
    out = img.convert("RGBA")
    out.putalpha(alpha)
    return out


def trim(rgba, thresh=6):
    a = rgba.getchannel("A")
    bbox = a.point(lambda v: 255 if v > thresh else 0).getbbox()
    return rgba.crop(bbox) if bbox else rgba


manifest = {}
tiles = []
for name, (pno, (x0, y0, x1, y1), lo, hi) in OBJECTS.items():
    im = page_img(pno)
    W, H = im.size
    box = (int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H))
    crop = im.crop(box)
    rgba = trim(matte(crop, lo, hi))
    rgba.save(os.path.join(OUT, f"{name}.png"))
    manifest[name] = {"page": pno, "box": [round(v, 4) for v in (x0, y0, x1, y1)],
                      "px": list(rgba.size), "knee": [lo, hi]}
    tiles.append((name, rgba))
    print(f"{name:20s} p{pno:2d} {rgba.size[0]:4d}x{rgba.size[1]:4d}")

for alias, target in ALIASES.items():
    src = Image.open(os.path.join(OUT, f"{target}.png"))
    src.save(os.path.join(OUT, f"{alias}.png"))
    manifest[alias] = dict(manifest[target], alias_of=target)
    tiles.append((alias, src))
    print(f"{alias:20s} <- alias of {target}")

with open(os.path.join(OUT, "_manifest.json"), "w") as f:
    json.dump(manifest, f, indent=1)

# --- contact sheet on the real page ground, for visual verification ---
COLS, CELL, PAD = 5, 300, 18
rows = (len(tiles) + COLS - 1) // COLS
sheet = Image.new("RGB", (COLS * (CELL + PAD) + PAD, rows * (CELL + PAD + 26) + PAD), (6, 9, 12))
for i, (name, t) in enumerate(tiles):
    c, r = i % COLS, i // COLS
    s = t.copy()
    s.thumbnail((CELL, CELL), Image.LANCZOS)
    x = PAD + c * (CELL + PAD) + (CELL - s.size[0]) // 2
    y = PAD + r * (CELL + PAD + 26) + (CELL - s.size[1]) // 2
    sheet.paste(s, (x, y), s)
sheet.save(os.path.join(SCR, "contact_sheet.png"))
print("\ncontact sheet ->", os.path.join(SCR, "contact_sheet.png"), sheet.size)
