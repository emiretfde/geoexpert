// Generiše statički sajt (ME u korijenu, EN u /en). Pokretanje: node _build/build.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { firma, me, en } from "./content.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE_URL = process.env.SITE_URL || "https://geoexpert.pages.dev";
const PREVIEW = process.argv.includes("--preview"); // izlaz za pregled u Claude artifactu
const OUT = PREVIEW ? join(ROOT, "_preview") : ROOT;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const jezici = { me, en };
const prefiks = (L) => (L.lang === "en" ? "../" : "");
const putanja = (L, kljuc) => (L.lang === "en" ? "en/" : "") + L.stranice[kljuc];
const drugi = (L) => (L.lang === "en" ? me : en);

const znak = `<svg viewBox="0 0 26 26" aria-hidden="true"><path d="M13 3.2 23.6 21.6H2.4Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="13" cy="15.4" r="2.5" fill="var(--novo)"/></svg>`;
const logo = (L) => `<a class="znak" href="${L.stranice.pocetna}" aria-label="GeoExpert">${znak}<span>Geo<b>Expert</b></span></a>`;

/* ---------- katastarski plan (SVG) ---------- */
const parcele = [
  { br: "1841", p: [[40,60],[300,40],[320,250],[60,280]], t: [170,170] },
  { br: "1842", p: [[300,40],[560,30],[570,230],[320,250]], t: [420,135] },
  { br: "1843", p: [[560,30],[820,50],[800,240],[570,230]], t: [680,140] },
  { br: "1844/1", p: [[820,50],[960,70],[950,260],[800,240]], t: [862,160] },
  { br: "1852", p: [[60,280],[320,250],[330,500],[80,510]], t: [170,478] },
  { br: "1853", p: [[320,250],[570,230],[590,490],[330,500]], t: null },
  { br: "1854/2", p: [[570,230],[800,240],[820,480],[590,490]], t: [664,445] },
  { br: "1850", p: [[800,240],[950,260],[940,470],[820,480]], t: [862,370] },
];
const objekti = [
  { br: "S1", p: [[350,300],[450,294],[455,372],[355,378]] },
  { br: "S2", p: [[120,330],[246,320],[252,420],[126,428]] },
  { br: "S1", p: [[640,280],[740,284],[738,350],[638,346]] },
];
const put = [[80,510],[330,500],[590,490],[820,480],[940,470],[948,532],[84,574]];
const pts = (p) => p.map((x) => x.join(",")).join(" ");

function planSvg(L) {
  const P = L.plan;
  const W = 1000, H = 680;
  let s = `<svg class="plan" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(P.glava)}: ${esc(P.dioba)}">`;
  s += `<defs><pattern id="srafura" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" style="stroke:var(--tus);stroke-width:1"/></pattern></defs>`;
  // mreža krstova i oznake koordinata
  s += `<g class="mreza-krst">`;
  for (let x = 100; x < W; x += 100) for (let y = 100; y < H; y += 100)
    s += `<path class="krst" d="M${x - 6} ${y}h12M${x} ${y - 6}v12"/>`;
  s += `</g><g class="oznaka-mreze-g">`;
  for (let x = 100; x < W; x += 200) s += `<text class="oznaka-mreze" x="${x + 4}" y="16">${(6603400 + x * 0.12).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</text>`;
  for (let y = 200; y < H - 100; y += 200) s += `<text class="oznaka-mreze" x="6" y="${y - 4}">${(4700300 - y * 0.12).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</text>`;
  s += `</g>`;
  s += `<polygon class="put" points="${pts(put)}"/>`;
  s += `<text class="br" x="170" y="548" transform="rotate(-2.4 170 548)">${esc(P.put)}</text>`;
  for (const p of parcele) s += `<polygon class="parcela" data-br="${p.br}" points="${pts(p.p)}"/>`;
  for (const o of objekti) s += `<polygon class="objekat" points="${pts(o.p)}"/>`;
  for (const p of parcele) if (p.t) s += `<text class="br" x="${p.t[0]}" y="${p.t[1]}">${p.br}</text>`;
  s += `<text class="br-obj" x="392" y="392">S1</text><text class="br-obj" x="178" y="444">S2</text><text class="br-obj" x="680" y="368">S1</text>`;
  // prelomne tačke
  const set = new Set();
  for (const p of parcele) for (const q of p.p) set.add(q.join(","));
  for (const k of set) { const [x, y] = k.split(","); s += `<circle class="tacka" cx="${x}" cy="${y}" r="3.2"/>`; }
  // novo stanje: dioba 1853
  s += `<line class="dioba" x1="470" y1="238" x2="480" y2="494"/>`;
  s += `<g class="novo">`;
  s += `<text class="br" x="510" y="300">1853</text><line x1="506" y1="295" x2="550" y2="295" style="stroke:var(--novo);stroke-width:1.6"/>`;
  s += `<text class="novo-br" x="382" y="455">1853/1</text><text class="novo-br" x="508" y="455">1853/2</text>`;
  s += `<circle class="nova-tacka" cx="470" cy="238" r="5.5"/><circle class="nova-tacka" cx="480" cy="494" r="5.5"/>`;
  const dec = L.lang === "en" ? "." : ",";
  const k = (v) => v.toFixed(2).replace(".", dec).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const tk = (n, x, y, cx, cy) => `<text class="novo-txt" x="${x}" y="${y}">${n}</text><text class="novo-txt" x="${x + 26}" y="${y}">Y ${k(6603400 + cx * 0.12)}</text><text class="novo-txt" x="${x + 26}" y="${y + 17}">X ${k(4700300 - cy * 0.12)}</text>`;
  s += tk("T1", 486, 196, 470, 238);
  s += tk("T2", 496, 552, 480, 494);
  s += `</g>`;
  s += `<g class="nisan"><line class="h" x1="0" x2="${W}" y1="0" y2="0"/><line class="v" x1="0" x2="0" y1="0" y2="${H}"/></g>`;
  s += `</svg>`;
  return s;
}

/* ---------- dijelovi ---------- */
function head(L, kljuc) {
  const [naslov, opis] = L.meta[kljuc];
  const p = prefiks(L);
  const url = SITE_URL + "/" + putanja(L, kljuc).replace(/index\.html$/, "");
  const alt = SITE_URL + "/" + putanja(drugi(L), kljuc).replace(/index\.html$/, "");
  const meUrl = L.lang === "me" ? url : alt, enUrl = L.lang === "en" ? url : alt;
  return `<title>${esc(naslov)}</title>
<meta name="description" content="${esc(opis)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="sr-Latn-ME" href="${meUrl}">
<link rel="alternate" hreflang="en" href="${enUrl}">
<meta property="og:title" content="${esc(naslov)}">
<meta property="og:description" content="${esc(opis)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta name="theme-color" content="#1C2B3A">
<link rel="icon" href="${p}assets/favicon.svg" type="image/svg+xml">
${PREVIEW ? `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&display=swap">` : `<link rel="preload" href="${p}assets/fonts/archivo-latin-wdth-normal.woff2" as="font" type="font/woff2" crossorigin>`}
<link rel="stylesheet" href="${p}assets/site.css">
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "ProfessionalService", name: "GeoExpert",
    description: L.meta.pocetna[1], url: SITE_URL, telephone: firma.tel1href, email: firma.email,
    address: { "@type": "PostalAddress", streetAddress: "13. jul br. 9", postalCode: "81000", addressLocality: "Podgorica", addressCountry: "ME" },
    geo: { "@type": "GeoCoordinates", latitude: 42.4450711, longitude: 19.2553269 },
    openingHours: "Mo-Fr 08:00-16:00", areaServed: "Montenegro",
  })}</script>`;
}

function zaglavlje(L, kljuc) {
  const d = drugi(L);
  const drugiHref = (L.lang === "en" ? "../" : "en/") + d.stranice[kljuc];
  const cur = (k) => (k === kljuc ? ` aria-current="page"` : "");
  return `<a class="skip" href="#sadrzaj">${L.nav.preskoci}</a>
<header class="zaglavlje"><div class="omot">
${logo(L)}
<button class="meni-dugme" type="button" aria-expanded="false" aria-controls="nav">${L.nav.meni}</button>
<nav class="nav" id="nav" aria-label="${L.lang === "en" ? "Main" : "Glavna"}">
<a href="${L.stranice.usluge}"${cur("usluge")}>${L.nav.usluge}</a>
<a href="${L.stranice.onama}"${cur("onama")}>${L.nav.onama}</a>
<a href="${L.stranice.kontakt}"${cur("kontakt")}>${L.nav.kontakt}</a>
<a class="jezik" href="${drugiHref}" hreflang="${d.htmlLang}" lang="${d.htmlLang}">${L.nav.drugiJezik}</a>
<a class="tel" href="tel:${firma.tel1href}">${firma.tel1}</a>
</nav></div></header>`;
}

function podnozje(L) {
  const F = L.footer;
  return `<footer class="podnozje"><div class="omot">
<div>${logo(L)}<p>${F.opis}</p></div>
<div><h4>${F.stranice}</h4><a href="${L.stranice.pocetna}">GeoExpert</a><a href="${L.stranice.usluge}">${L.nav.usluge}</a><a href="${L.stranice.onama}">${L.nav.onama}</a><a href="${L.stranice.kontakt}">${L.nav.kontakt}</a></div>
<div><h4>${F.kontakt}</h4><a href="${firma.mapa}" target="_blank" rel="noopener">${L.lang === "en" ? firma.adresaEn : firma.adresa}</a><a href="mailto:${firma.email}">${firma.email}</a><a class="broj" href="tel:${firma.tel1href}">${firma.tel1}</a><a class="broj" href="tel:${firma.tel2href}">${firma.tel2}</a></div>
<div><h4>${F.radno}</h4><span>${F.radno1}</span><br><span>${F.radno2}</span></div>
<div class="dno"><span>© 2026 GeoExpert</span><span>${L.lang === "en" ? "Podgorica, Montenegro" : "Podgorica, Crna Gora"}</span></div>
</div></footer>`;
}

function kontaktBlok(L) {
  const C = L.cta;
  return `<section class="tamno sekcija" aria-labelledby="cta-n"><canvas class="izohipse" aria-hidden="true"></canvas><div class="omot kontakt-mreza">
<div><h2 id="cta-n">${C.naslov}</h2><p style="margin-top:20px">${C.tekst}</p>
<div class="telefoni"><a href="tel:${firma.tel1href}">${firma.tel1}</a><a href="tel:${firma.tel2href}">${firma.tel2}</a></div></div>
<div style="display:grid;gap:28px">
<dl class="podaci">
<div><dt>${C.email}</dt><dd><a href="mailto:${firma.email}">${firma.email}</a></dd></div>
<div><dt>${C.adresa}</dt><dd>${L.lang === "en" ? firma.adresaEn : firma.adresa}</dd></div>
<div><dt>${C.radno}</dt><dd>${C.radnoV}</dd></div>
</dl>
<div class="akcije"><a class="dugme" href="${L.stranice.kontakt}">${C.pisite}</a><a class="dugme prazno" href="viber://chat?number=%2B${firma.tel1href.slice(1)}">${C.viber}</a><a class="veza" href="${firma.mapa}" target="_blank" rel="noopener">${C.mapa}</a></div>
</div></div></section>`;
}

function strana(L, kljuc, telo) {
  const p = prefiks(L);
  const sadrzaj = `${zaglavlje(L, kljuc)}
<main id="sadrzaj">${telo}</main>
${podnozje(L)}
<script src="${p}assets/site.js" defer></script>`;
  if (PREVIEW && L.lang === "me" && kljuc === "pocetna") {
    // artifact omotava stranicu sam; ovdje samo head-sadržaj + tijelo
    return `${head(L, kljuc)}\n<script>document.documentElement.lang="${L.htmlLang}"</script>\n${sadrzaj}`;
  }
  return `<!doctype html>
<html lang="${L.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${head(L, kljuc)}
</head>
<body>
${sadrzaj}
</body>
</html>
`;
}

/* ---------- stranice ---------- */
function pocetna(L) {
  const H = L.hero, P = L.plan, S = L.stav;
  const indeks = L.grupe.map((g) => `<div class="grupa"><h3>${g.naziv}</h3><ul>${g.usluge.map((k) => {
    const u = L.usluge[k];
    return `<li><a href="${L.stranice.usluge}#${k}"><strong>${u.naziv}</strong><span>${u.kratko}</span><em>${L.detaljnije}</em></a></li>`;
  }).join("")}</ul></div>`).join("");
  return `
<section class="hero"><div class="omot">
<div class="hero-tekst">
<h1>${H.naslov}</h1>
<div class="desno"><p class="uvod">${H.uvod}</p>
<div class="akcije"><a class="dugme" href="${L.stranice.kontakt}">${H.ponuda}</a><a class="veza broj" href="tel:${firma.tel1href}">${H.pozovite} ${firma.tel1}</a></div></div>
</div>
<figure class="list-plana" style="margin-inline:0;margin-bottom:0"><div class="unutra">
<span class="uputa">${P.uputa}</span>
${planSvg(L)}
<div class="naslovni-blok">
<div class="glava">${P.glava}<span>${P.glavaDesno}</span></div>
<div>${P.parcela}</div><div class="vrijednost" id="parcela-info" aria-live="polite">${P.dioba}</div>
<div>${P.kursor}</div><div class="vrijednost"><span id="kursor-y">Y 6 603 456,40</span><br><span id="kursor-x">X 4 700 271,44</span></div>
<div>${P.razmjera}</div><div class="vrijednost">${P.razmjeraV}</div>
<div>${P.sistem}</div><div class="vrijednost">${P.sistemV}</div>
<div>${P.izradio}</div><div class="vrijednost">${P.izradioV}</div>
</div></div></figure>
</div></section>

<section class="sekcija" aria-labelledby="stav-n"><div class="omot stav">
<div style="display:grid;gap:28px;align-content:start"><h2 id="stav-n">${S.naslov}</h2><p class="izjava">${S.izjava}</p><p><a class="veza" href="${L.stranice.onama}">${S.vise}</a></p></div>
<dl class="principi">${S.principi.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join("")}</dl>
</div></section>

<section class="sekcija" aria-labelledby="usl-n"><div class="omot">
<div class="glava-sekcije"><h2 id="usl-n">${L.uslugeNaslov}</h2><p>${L.uslugeUvod}</p></div>
<div class="indeks">${indeks}</div>
</div></section>

<section class="sekcija" aria-labelledby="pro-n"><div class="omot">
<div class="glava-sekcije"><h2 id="pro-n">${L.proces.naslov}</h2><p>${L.proces.uvod}</p></div>
<ol class="vlak">${L.proces.koraci.map(([a, b], i) => `<li><span class="st">${L.proces.st} ${i + 1}</span><h3>${a}</h3><p>${b}</p></li>`).join("")}</ol>
</div></section>

<section class="sekcija" aria-labelledby="kl-n"><div class="omot" style="display:grid;gap:28px">
<h2 id="kl-n" style="font-size:var(--t1);color:var(--tiho);font-weight:500">${L.klijentiNaslov}</h2>
<ul class="klijenti">${firma.klijenti.map((k) => `<li>${k}</li>`).join("")}</ul>
</div></section>
${kontaktBlok(L)}`;
}

function usluge(L) {
  const nav = L.grupe.map((g) => `<b>${g.naziv}</b>${g.usluge.map((k) => `<a href="#${k}">${L.usluge[k].naziv}</a>`).join("")}`).join("");
  const sve = L.grupe.flatMap((g) => g.usluge).map((k) => {
    const u = L.usluge[k];
    return `<article class="usluga" id="${k}"><header><h2>${u.naziv}</h2><p>${u.opis}</p></header>
<div><h3>${L.kada}</h3><ul>${u.kada.map((x) => `<li>${x}</li>`).join("")}</ul></div>
<div><h3>${L.dobijate}</h3><ul>${u.dobijate.map((x) => `<li>${x}</li>`).join("")}</ul></div></article>`;
  }).join("");
  return `<section class="naslov-strane"><div class="omot"><h1>${L.uslugeNaslov}</h1><p class="uvod">${L.uslugeUvod}</p></div></section>
<section style="padding-bottom:clamp(64px,9vw,128px)"><div class="omot sadrzaj-usluga"><nav aria-label="${L.uslugeNaslov}">${nav}</nav><div>${sve}</div></div></section>
${kontaktBlok(L)}`;
}

function onama(L) {
  const O = L.onama, S = L.stav;
  return `<section class="naslov-strane"><div class="omot"><h1>${O.naslov}</h1><p class="uvod">${O.uvod}</p></div></section>
<section class="sekcija"><div class="omot dvije">
<div class="kol">${O.tekst.map((t) => `<p>${t}</p>`).join("")}</div>
<dl class="principi">${S.principi.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join("")}</dl>
</div></section>
<section class="sekcija"><div class="omot dvije">
<h2>${O.zaKoga}</h2>
<ul class="za-koga">${O.zaKogaLista.map((x) => `<li>${x}</li>`).join("")}</ul>
</div></section>
<section class="sekcija"><div class="omot"><div class="glava-sekcije"><h2>${L.proces.naslov}</h2><p>${L.proces.uvod}</p></div>
<ol class="vlak">${L.proces.koraci.map(([a, b], i) => `<li><span class="st">${L.proces.st} ${i + 1}</span><h3>${a}</h3><p>${b}</p></li>`).join("")}</ol></div></section>
<section class="sekcija"><div class="omot" style="display:grid;gap:28px"><h2 style="font-size:var(--t1);color:var(--tiho);font-weight:500">${L.klijentiNaslov}</h2>
<ul class="klijenti">${firma.klijenti.map((k) => `<li>${k}</li>`).join("")}</ul></div></section>
${kontaktBlok(L)}`;
}

function kontakt(L) {
  const K = L.kontakt, F = K.forma, C = L.cta;
  const opcije = L.grupe.flatMap((g) => g.usluge).map((k) => `<option>${L.usluge[k].naziv}</option>`).join("");
  return `<section class="naslov-strane"><div class="omot"><h1>${K.naslov}</h1><p class="uvod">${K.uvod}</p></div></section>
<section style="padding-bottom:clamp(64px,9vw,128px)"><div class="omot dvije">
<form class="forma" novalidate>
<div class="polje"><label for="f-ime">${F.ime}</label><input id="f-ime" name="ime" autocomplete="name" required></div>
<div class="polje"><label for="f-email">${F.email}</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
<div class="polje"><label for="f-tel">${F.telefon} <small>${F.neobavezno}</small></label><input id="f-tel" name="telefon" type="tel" autocomplete="tel"></div>
<div class="polje"><label for="f-usluga">${F.usluga}</label><select id="f-usluga" name="usluga"><option value="">${F.izaberi}</option>${opcije}<option>${F.drugo}</option></select></div>
<div class="polje puno"><label for="f-poruka">${F.poruka}</label><textarea id="f-poruka" name="poruka" placeholder="${esc(F.porukaPh)}" required></textarea></div>
<div class="zamka" aria-hidden="true"><label for="f-web">Web</label><input id="f-web" name="web" tabindex="-1" autocomplete="off"></div>
<button class="dugme puno" type="submit">${F.posalji}</button>
<p class="status puno" role="status" aria-live="polite"></p>
</form>
<div class="kol">
<div class="telefoni" style="margin-top:0"><a href="tel:${firma.tel1href}" style="color:var(--tus)">${firma.tel1}</a><a href="tel:${firma.tel2href}" style="color:var(--tus)">${firma.tel2}</a></div>
<dl class="principi">
<div><dt>${C.email}</dt><dd><a href="mailto:${firma.email}">${firma.email}</a></dd></div>
<div><dt>${C.adresa}</dt><dd>${L.lang === "en" ? firma.adresaEn : firma.adresa}<br><a class="veza" href="${firma.mapa}" target="_blank" rel="noopener">${C.mapa}</a></dd></div>
<div><dt>${C.radno}</dt><dd>${C.radnoV}</dd></div>
<div><dt>${C.viber}</dt><dd><a href="viber://chat?number=%2B${firma.tel1href.slice(1)}">${firma.tel1}</a></dd></div>
</dl></div>
</div></section>`;
}

/* ---------- upis ---------- */
const upisi = (rel, html) => { const f = join(OUT, rel); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, html); };
for (const L of [me, en]) {
  const d = L.lang === "en" ? "en/" : "";
  upisi(d + L.stranice.pocetna, strana(L, "pocetna", pocetna(L)));
  upisi(d + L.stranice.usluge, strana(L, "usluge", usluge(L)));
  upisi(d + L.stranice.onama, strana(L, "onama", onama(L)));
  upisi(d + L.stranice.kontakt, strana(L, "kontakt", kontakt(L)));
}
if (!PREVIEW) {
  const urls = [];
  for (const L of [me, en]) for (const k of Object.keys(L.stranice)) urls.push(SITE_URL + "/" + putanja(L, k).replace(/index\.html$/, "").replace(/\.html$/, ""));
  upisi("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}\n</urlset>\n`);
  upisi("robots.txt", `User-agent: *\nAllow: /\nDisallow: /_build/\nSitemap: ${SITE_URL}/sitemap.xml\n`);
}
console.log("Gotovo:", OUT);
