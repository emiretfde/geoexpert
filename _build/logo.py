# Generiše GeoExpert logo (redizajn originala): slova iz fonta Archivo Expanded pretvorena u krivulje,
# "o" je nišan s končanicom, a ispod njega kraci šestara.
# Pokretanje: python3 _build/logo.py   (traži: pip install fonttools brotli)
import io, os, sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
FONT = os.path.join(ROOT, "assets", "fonts", "archivo-latin-wdth-normal.woff2")
OUT = os.path.join(ROOT, "assets", "logo")
os.makedirs(OUT, exist_ok=True)

NAVY, BIJELA, NARANDZ = "#10243A", "#ECE8DF", "#D9581B"

def font(wght, wdth=125):
    f = TTFont(FONT)
    return instantiateVariableFont(f, {"wght": wght, "wdth": wdth}, inplace=False)

def tekst(f, s, x0, base, size, tracking=0.0):
    """Vrati (svg path d, x poslije zadnjeg slova)."""
    upm = f["head"].unitsPerEm; k = size / upm
    gs = f.getGlyphSet(); cmap = f.getBestCmap(); hmtx = f["hmtx"]
    dio, x = [], x0
    for ch in s:
        g = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        gs[g].draw(TransformPen(pen, (k, 0, 0, -k, x, base)))
        dio.append(pen.getCommands())
        x += hmtx[g][0] * k + tracking * size
    return " ".join(dio), x

def granice(f, s, size):
    upm = f["head"].unitsPerEm; k = size / upm
    gs = f.getGlyphSet(); cmap = f.getBestCmap()
    bp = BoundsPen(gs); gs[cmap[ord(s)]].draw(bp)
    xmin, ymin, xmax, ymax = bp.bounds
    return xmin * k, ymin * k, xmax * k, ymax * k

def nisan(cx, cy, R, s, boja, akcent, noge=True, ruckica=True, oznake=True):
    """Prsten s končanicom; s = debljina prstena."""
    e = []
    e.append(f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{R - s/2:.2f}" fill="none" stroke="{boja}" stroke-width="{s:.2f}"/>')
    h = s * 0.32; praz = R * 0.30  # končanica: tanke linije s prazninom oko centra
    for (dx, dy) in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
        x1, y1 = cx + dx * praz, cy + dy * praz
        x2, y2 = cx + dx * (R - s * 0.95), cy + dy * (R - s * 0.95)
        e.append(f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{boja}" stroke-width="{h:.2f}"/>')
    # oznake podjele izvan prstena (lijevo, desno)
    for dx in ((1, -1) if oznake else ()):
        x1 = cx + dx * (R + s * 0.35); x2 = cx + dx * (R + s * 1.55)
        e.append(f'<line x1="{x1:.2f}" y1="{cy:.2f}" x2="{x2:.2f}" y2="{cy:.2f}" stroke="{boja}" stroke-width="{s*0.8:.2f}"/>')
    e.append(f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{s*0.62:.2f}" fill="{akcent}"/>')
    if ruckica:
        w = s * 1.15; y2 = cy - R - s * 0.35
        e.append(f'<rect x="{cx - w/2:.2f}" y="{y2 - s*1.9:.2f}" width="{w:.2f}" height="{s*1.9:.2f}" rx="{w*0.32:.2f}" fill="{akcent}"/>')
    if noge:
        # kraci šestara: počinju na dnu prstena, sužavaju se do vrha
        dno = cy + R - s * 0.3; vrh_y = cy + R * 2.45; raspon = R * 0.98
        for dx in (1, -1):
            a = (cx + dx * R * 0.16, dno); b = (cx + dx * R * 0.52, dno - s * 0.25)
            c = (cx + dx * raspon + dx * s * 0.05, vrh_y); d = (cx + dx * raspon - dx * s * 0.30, vrh_y)
            e.append(f'<path d="M{a[0]:.2f} {a[1]:.2f} L{b[0]:.2f} {b[1]:.2f} L{c[0]:.2f} {c[1]:.2f} L{d[0]:.2f} {d[1]:.2f}Z" fill="{akcent}"/>')
        # osovina između krakova
        e.append(f'<rect x="{cx - s*0.42:.2f}" y="{cy + R - s*0.25:.2f}" width="{s*0.84:.2f}" height="{s*1.15:.2f}" fill="{boja}"/>')
    return "\n".join(e)

def logo(boja, akcent, pozadina=None, wght=560):
    f = font(wght)
    S = 100; base = 120
    _, _, _, cap = granice(f, "E", S)          # visina verzala
    tr = -0.012
    d1, x = tekst(f, "Ge", 0, base, S, tr)
    R = cap * 0.64; s = cap * 0.135
    razmak = S * 0.035
    cx = x + razmak + R; cy = base - cap / 2
    d2, x2 = tekst(f, "Expert", cx + R + razmak + s * 0.4, base, S, tr)
    W = x2 + 6; top = cy - R - s * 2.6; bottom = cy + R * 2.45 + 4
    vb = f"-4 {top - 4:.2f} {W + 8:.2f} {bottom - top + 8:.2f}"
    poz = f'<rect x="-4" y="{top - 4:.2f}" width="{W + 8:.2f}" height="{bottom - top + 8:.2f}" fill="{pozadina}"/>' if pozadina else ""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="GeoExpert"><title>GeoExpert</title>{poz}
<path fill="{boja}" d="{d1}"/>
<path fill="{boja}" d="{d2}"/>
{nisan(cx, cy, R, s, boja, akcent, oznake=False)}
</svg>
'''

def znak(boja, akcent, pozadina=None, rx=0):
    R = 27; s = R * 0.21; cx = 50; cy = 36
    poz = f'<rect width="100" height="100" rx="{rx}" fill="{pozadina}"/>' if pozadina else ""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="GeoExpert"><title>GeoExpert</title>{poz}
{nisan(cx, cy, R, s, boja, akcent)}
</svg>
'''

def znak_mali(boja, akcent, pozadina, rx=22):
    """Favicon: samo nišan (bez krakova), čitljiv na 16 px."""
    R = 33; s = 9.5; cx = cy = 50
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="{rx}" fill="{pozadina}"/>
{nisan(cx, cy, R, s, boja, akcent, noge=False, ruckica=False, oznake=False)}
</svg>
'''

fajlovi = {
    "geoexpert-logo.svg": logo(NAVY, NARANDZ),
    "geoexpert-logo-bijeli.svg": logo(BIJELA, NARANDZ),
    "geoexpert-znak.svg": znak(NAVY, NARANDZ),
    "geoexpert-znak-bijeli.svg": znak(BIJELA, NARANDZ),
}
for ime, svg in fajlovi.items():
    open(os.path.join(OUT, ime), "w").write(svg)
open(os.path.join(ROOT, "assets", "favicon.svg"), "w").write(znak_mali(BIJELA, NARANDZ, "#10243A"))
print("Gotovo:", ", ".join(fajlovi))
