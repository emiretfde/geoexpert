// Generiše statički sajt (ME u korijenu, EN u /en). Pokretanje: node _build/build.mjs
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { firma, me, en } from "./content.mjs";
import { de, tr, ru } from "./prevodi.mjs";
import { dodajDron } from "./dron.mjs";
import { dodajDopune } from "./dopune.mjs";
import { dodajPravno } from "./pravno.mjs";
const JEZICI = [me, en, de, tr, ru].map(dodajDron).map(dodajDopune).map(dodajPravno);

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE_URL = process.env.SITE_URL || "https://geoexpert.me";
const PREVIEW = process.argv.includes("--preview"); // izlaz za pregled u Claude artifactu
const OUT = PREVIEW ? join(ROOT, "_preview") : ROOT;

const ver = (f) => createHash("sha1").update(readFileSync(join(ROOT, "assets", f))).digest("hex").slice(0, 8);
const V = { css: ver("site.css"), js: ver("site.js") };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const prefiks = (L) => (L.dir ? "../" : "");
const putanja = (L, kljuc) => L.dir + L.stranice[kljuc];
const cist = (u) => u.replace(/index\.html$/, "").replace(/\.html$/, "");

const logoSvg = readFileSync(join(ROOT, "assets", "logo", "geoexpert-logo-bijeli.svg"), "utf8")
  .replace(/<title>.*?<\/title>/, "").replace(' role="img" aria-label="GeoExpert"', ' aria-hidden="true" focusable="false"').trim();
const logo = (L) => `<a class="znak" href="${L.stranice.pocetna}" aria-label="GeoExpert">${logoSvg}</a>`;

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
  const W = 1000, H = 600;
  let s = `<svg class="plan" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(P.glava)}: ${esc(P.dioba)}">`;
  s += `<defs><pattern id="srafura" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" style="stroke:rgba(236,232,223,.35);stroke-width:1"/></pattern></defs>`;
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


/* ---------- plan leta drona (SVG) ---------- */
function planLeta(L) {
  const W = 600, H = 420;
  const oblast = [[70,92],[318,58],[540,104],[552,300],[404,372],[120,350],[52,232]];
  const pts2 = oblast.map((p) => p.join(",")).join(" ");
  let s = `<svg class="plan-leta" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(L.dron.plan)}">`;
  s += `<defs><clipPath id="oblast-leta"><polygon points="${pts2}"/></clipPath></defs>`;
  // mreža
  for (let x = 50; x < W; x += 50) s += `<line class="pl-mreza" x1="${x}" y1="0" x2="${x}" y2="${H}"/>`;
  for (let y = 50; y < H; y += 50) s += `<line class="pl-mreza" x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;
  // otisci snimaka (preklop)
  s += `<g clip-path="url(#oblast-leta)">`;
  for (let i = 0, y = 70; y < 380; y += 34, i++) for (let x = 40 + (i % 2) * 14; x < 570; x += 40)
    s += `<rect class="pl-otisak" x="${x - 22}" y="${y - 15}" width="44" height="30"/>`;
  s += `</g>`;
  s += `<polygon class="pl-oblast" points="${pts2}"/>`;
  // serpentinska putanja
  let d = "", tacke = "", smjer = 1, prvi = true;
  for (let y = 70; y < 380; y += 34) {
    const x1 = 40, x2 = 565;
    const [a, b] = smjer > 0 ? [x1, x2] : [x2, x1];
    d += prvi ? `M${a} ${y} L${b} ${y}` : ` L${a} ${y} L${b} ${y}`;
    for (let x = 40 + 6; x < 565; x += 40) tacke += `<circle class="pl-snimak" cx="${x}" cy="${y}" r="2.2"/>`;
    smjer *= -1; prvi = false;
  }
  s += `<g clip-path="url(#oblast-leta)"><path class="pl-putanja" d="${d}"/>${tacke}</g>`;
  // kontrolne tačke
  for (const [x, y] of [[92,112],[500,122],[520,284],[150,330],[300,214]])
    s += `<g class="pl-gcp" transform="translate(${x} ${y})"><path d="M0 -9 L8 5 L-8 5 Z"/><circle r="1.8" cy="0.5"/></g>`;
  // dron
  s += `<g class="pl-dron" transform="translate(470 342)"><path d="M-14 -14 L14 14 M14 -14 L-14 14"/><circle cx="-14" cy="-14" r="7"/><circle cx="14" cy="-14" r="7"/><circle cx="-14" cy="14" r="7"/><circle cx="14" cy="14" r="7"/><rect x="-6" y="-6" width="12" height="12" rx="3"/></g>`;
  s += `</svg>`;
  return s;
}

function dronBlok(L) {
  const D = L.dron;
  const imena = L.grupe.find((g) => g.dron).usluge.map((k) => `<li><a href="${L.stranice.usluge}#${k}">${L.usluge[k].naziv}</a></li>`).join("");
  return `<section class="sekcija dron" aria-labelledby="dron-n"><div class="omot dron-mreza">
<div class="dron-tekst">
<h2 id="dron-n">${D.naslov}</h2>
<p class="uvod">${D.uvod}</p>
<ul class="dron-usluge">${imena}</ul>
<p><a class="veza" href="${L.stranice.usluge}#ortofoto">${D.vise}</a></p>
</div>
<figure class="list-plana dron-plan"><div class="unutra">${planLeta(L)}</div>
<div class="naslovni-blok">
<div>${D.plan}</div><div class="vrijednost siroko">${D.primjer}</div>
<div>${D.visina}</div><div class="vrijednost">80 m</div>
<div>${D.preklop}</div><div class="vrijednost">75 / 65 %</div>
<div>${D.gsd}</div><div class="vrijednost">2 cm/px</div>
<div>${D.gcp}</div><div class="vrijednost">5</div>
</div></figure>
</div></section>`;
}

/* ---------- pravni podaci firme (CRPS / CompanyWall) ---------- */
const PRAVNO = { naziv: "GEO EXPERT d.o.o. Podgorica", pib: "02934094", pdv: "30/31-15825-6", reg: "5-0662458/003", osnovano: "2013-05-29" };
const PRAVNO_OZNAKE = {
  me: ["PIB", "PDV", "Reg. br."], en: ["Tax ID", "VAT", "Reg. no."], de: ["Steuer-Nr.", "USt-Nr.", "Reg.-Nr."],
  tr: ["Vergi no", "KDV no", "Sicil no"], ru: ["ИНН", "НДС", "Рег. №"],
};
const pravniRed = (L) => { const o = PRAVNO_OZNAKE[L.lang] || PRAVNO_OZNAKE.en;
  return `<span class="pravno">${PRAVNO.naziv} <i>·</i> ${o[0]} ${PRAVNO.pib} <i>·</i> ${o[1]} ${PRAVNO.pdv} <i>·</i> ${o[2]} ${PRAVNO.reg}</span>`; };

/* ---------- dijelovi ---------- */
const ikViber = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C7 3 3.5 5.9 3.5 10.6c0 2.6 1.1 4.5 3 5.7V20l3.1-2.4c.8.1 1.6.2 2.4.2 5 0 8.5-2.9 8.5-7.2S17 3 12 3z" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.3 7.9c.3-.3.7-.3.9 0l.8 1.1c.2.3.2.6-.1.9l-.4.4c.4.9 1.1 1.6 2 2l.4-.4c.3-.3.6-.3.9-.1l1.1.8c.3.2.3.6 0 .9l-.5.5c-.5.5-1.3.6-2 .3-1.7-.8-3-2.1-3.8-3.8-.3-.7-.2-1.5.3-2z" fill="#fff"/></svg>`;
const ikWa = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5z" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.3 7.9c.3-.3.7-.3.9 0l.8 1.1c.2.3.2.6-.1.9l-.4.4c.4.9 1.1 1.6 2 2l.4-.4c.3-.3.6-.3.9-.1l1.1.8c.3.2.3.6 0 .9l-.5.5c-.5.5-1.3.6-2 .3-1.7-.8-3-2.1-3.8-3.8-.3-.7-.2-1.5.3-2z" fill="#fff"/></svg>`;
const ikMail = `<svg class="ikona-mail" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3.8 7l8.2 6 8.2-6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
const poruke = `<a class="glasnik viber" href="${firma.viber}"><i>${ikViber}</i>Viber</a><a class="glasnik whatsapp" href="${firma.whatsapp}" target="_blank" rel="noopener"><i>${ikWa}</i>WhatsApp</a>`;
const ikonaTel = `<svg class="ikona-tel" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" fill="currentColor"/></svg>`;
const strelica = `<svg viewBox="0 0 14 14" fill="none" stroke-width="1.4" aria-hidden="true"><path d="M2 7h10M8 3l4 4-4 4"/></svg>`;

function head(L, kljuc) {
  const [naslov, opis] = L.meta[kljuc];
  const p = prefiks(L);
  const url = SITE_URL + "/" + cist(putanja(L, kljuc));
  return `<title>${esc(naslov)}</title>
<meta name="description" content="${esc(opis)}">
<link rel="canonical" href="${url}">
${JEZICI.map((J) => `<link rel="alternate" hreflang="${J.htmlLang}" href="${SITE_URL}/${cist(putanja(J, kljuc))}">`).join("\n")}
<link rel="alternate" hreflang="x-default" href="${SITE_URL}/${cist(putanja(me, kljuc))}">
<meta property="og:title" content="${esc(naslov)}">
<meta property="og:description" content="${esc(opis)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE_URL}/assets/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="GeoExpert">
<meta name="twitter:card" content="summary_large_image">
<meta property="og:locale" content="${L.htmlLang.replace(/-/g, "_")}">
<meta name="theme-color" content="#091117">
<link rel="icon" href="${p}assets/favicon.svg" type="image/svg+xml">
<link rel="icon" href="${p}assets/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="${p}assets/apple-touch-icon.png">
${PREVIEW ? `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap">` : `<link rel="preload" href="${p}assets/fonts/archivo-latin-wdth-normal.woff2" as="font" type="font/woff2" crossorigin>`}
<link rel="stylesheet" href="${p}assets/site.css?v=${V.css}">
<script>document.documentElement.classList.add("js")</script>
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "ProfessionalService", name: "GeoExpert", legalName: "GEO EXPERT d.o.o.", taxID: "02934094", vatID: "30/31-15825-6", foundingDate: "2013-05-29",
    description: L.meta.pocetna[1], url: SITE_URL, telephone: firma.tel1href, email: firma.email,
    address: { "@type": "PostalAddress", streetAddress: "13. jul br. 9", postalCode: "81000", addressLocality: "Podgorica", addressCountry: "ME" },
    geo: { "@type": "GeoCoordinates", latitude: 42.4450711, longitude: 19.2553269 },
    openingHours: "Mo-Fr 08:00-16:00", areaServed: "Montenegro",
  })}</script>`;
}

/* ---------- zastavice (pojednostavljene, kružne) ---------- */
const ZASTAVE = {
  ME: `<rect width="20" height="20" fill="#C40308"/><circle cx="10" cy="10" r="8.6" fill="none" stroke="#D3AE3B" stroke-width="1.6"/><path d="M10 5.6c-1 .9-2.6 1-3.4.4.2 1.4.9 2.4 1.9 2.9-.6.6-.9 1.4-.8 2.3.9-.5 1.6-.4 2.3.3.7-.7 1.4-.8 2.3-.3.1-.9-.2-1.7-.8-2.3 1-.5 1.7-1.5 1.9-2.9-.8.6-2.4.5-3.4-.4z" fill="#D3AE3B"/><path d="M8.4 11.6h3.2l-.3 2.6-1.3.9-1.3-.9z" fill="#D3AE3B"/>`,
  EN: `<rect width="20" height="20" fill="#012169"/><path d="M0 0l20 20M20 0L0 20" stroke="#fff" stroke-width="4"/><path d="M0 0l20 20M20 0L0 20" stroke="#C8102E" stroke-width="1.6"/><path d="M10 0v20M0 10h20" stroke="#fff" stroke-width="6"/><path d="M10 0v20M0 10h20" stroke="#C8102E" stroke-width="3.4"/>`,
  DE: `<rect width="20" height="6.7" fill="#000"/><rect y="6.6" width="20" height="6.8" fill="#DD0000"/><rect y="13.3" width="20" height="6.7" fill="#FFCE00"/>`,
  TR: `<rect width="20" height="20" fill="#E30A17"/><circle cx="8.4" cy="10" r="4.6" fill="#fff"/><circle cx="9.6" cy="10" r="3.7" fill="#E30A17"/><path d="M12.2 10l3.9-1.27-2.41 3.32V7.95l2.41 3.32z" fill="#fff"/>`,
  RU: `<rect width="20" height="6.7" fill="#fff"/><rect y="6.6" width="20" height="6.8" fill="#0039A6"/><rect y="13.3" width="20" height="6.7" fill="#D52B1E"/>`,
};
const zastava = (kod) => `<svg class="zastava" viewBox="0 0 20 20" aria-hidden="true" focusable="false">${ZASTAVE[kod]}</svg>`;

function izborJezika(L, kljuc) {
  return `<div class="jezici" role="group" aria-label="${L.jezikLabel}">${JEZICI.map((J) => J === L
    ? `<span aria-current="true" lang="${J.htmlLang}" title="${J.ime}">${zastava(J.kod)}${J.kod}</span>`
    : `<a href="${prefiks(L)}${putanja(J, kljuc)}" hreflang="${J.htmlLang}" lang="${J.htmlLang}" title="${J.ime}">${zastava(J.kod)}${J.kod}</a>`).join("")}</div>`;
}

function jezikMob(L, kljuc) {
  const ostali = JEZICI.filter((J) => J !== L).map((J) =>
    `<li><a href="${prefiks(L)}${putanja(J, kljuc)}" hreflang="${J.htmlLang}" lang="${J.htmlLang}">${zastava(J.kod)}<span>${J.ime}</span></a></li>`).join("");
  return `<div class="jezik-mob">
<button class="jezik-dugme" type="button" aria-expanded="false" aria-controls="jezik-lista" aria-label="${L.jezikLabel}: ${L.ime}">${zastava(L.kod)}<span>${L.kod}</span><svg class="strelica-dolje" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></button>
<ul class="jezik-lista" id="jezik-lista" hidden>${ostali}</ul>
</div>`;
}

function zaglavlje(L, kljuc) {
  const cur = (k) => (k === kljuc ? ` aria-current="page"` : "");
  return `<a class="skip" href="#sadrzaj">${L.nav.preskoci}</a>
<header class="zaglavlje"><div class="omot">
${logo(L)}
${jezikMob(L, kljuc)}
<button class="meni-dugme" type="button" aria-expanded="false" aria-controls="nav">${L.nav.meni}</button>
<nav class="nav" id="nav" aria-label="${L.navLabel}">
<a href="${L.stranice.usluge}"${cur("usluge")}>${L.nav.usluge}</a>
<a href="${L.stranice.onama}"${cur("onama")}>${L.nav.onama}</a>
<a href="${L.stranice.kontakt}"${cur("kontakt")}>${L.nav.kontakt}</a>
${izborJezika(L, kljuc)}
<a class="tel" href="tel:${firma.tel1href}">${firma.tel1}</a>
</nav></div></header>`;
}

function podnozje(L) {
  const F = L.footer;
  return `<footer class="podnozje"><div class="omot">
<div class="kolone">
<div>${logo(L)}<p style="margin-top:18px">${F.opis}</p></div>
<div><h4>${F.stranice}</h4><a href="${L.stranice.pocetna}">GeoExpert</a><a href="${L.stranice.usluge}">${L.nav.usluge}</a><a href="${L.stranice.onama}">${L.nav.onama}</a><a href="${L.stranice.kontakt}">${L.nav.kontakt}</a><a href="${L.stranice.privatnost}">${L.privatnost.link}</a></div>
<div><h4>${F.kontakt}</h4><a href="${firma.mapa}" target="_blank" rel="noopener">${L.adresa}</a><a href="mailto:${firma.email}">${firma.email}</a><a class="broj" href="tel:${firma.tel1href}">${firma.tel1}</a><a class="broj" href="tel:${firma.tel2href}">${firma.tel2}</a></div>
<div><h4>${F.radno}</h4><span>${F.radno1}</span><br><span>${F.radno2}</span></div>
</div>
<div class="veliki-znak" aria-hidden="true">${logoSvg}</div>
<div class="dno"><span>© 2026 GeoExpert</span>${pravniRed(L)}<span>${L.drzava}</span></div>
</div></footer>`;
}

function kontaktDugmad(L, forma = true) {
  const H = L.hero;
  return `<div class="hero-kontakt">
<a class="dugme tel-dugme broj" href="tel:${firma.tel1href}">${ikonaTel}<span>${H.pozovite} ${firma.tel1}</span></a>
<div class="glasnici">${poruke}</div>
${forma ? `<a class="hero-forma" href="mailto:${firma.email}">${ikMail}<span>${H.forma} ${firma.email}</span></a>` : ""}
</div>`;
}

function kontaktBlok(L) {
  const C = L.cta;
  return `<section class="poziv sekcija" aria-labelledby="cta-n"><canvas class="izohipse" aria-hidden="true"></canvas><div class="omot kontakt-mreza">
<div><h2 id="cta-n">${C.naslov}</h2><p class="uvod" style="margin-top:24px">${C.tekst}</p>
<div class="telefoni"><a href="tel:${firma.tel1href}">${firma.tel1}</a><a href="tel:${firma.tel2href}">${firma.tel2}</a></div></div>
<div style="display:grid;gap:32px">
<dl class="podaci">
<div><dt>${C.email}</dt><dd><a href="mailto:${firma.email}">${firma.email}</a></dd></div>
<div><dt>${C.adresa}</dt><dd>${L.adresa}<br><a class="veza" href="${firma.mapa}" target="_blank" rel="noopener">${C.mapa}</a></dd></div>
<div><dt>${C.radno}</dt><dd>${C.radnoV}</dd></div>
</dl>
${kontaktDugmad(L)}
</div></div></section>`;
}

function strana(L, kljuc, telo, skripte = "") {
  const p = prefiks(L);
  const sadrzaj = `${zaglavlje(L, kljuc)}
<main id="sadrzaj">${telo}</main>
${podnozje(L)}
${skripte}<script src="${p}assets/site.js?v=${V.js}" defer></script>`;
  if (PREVIEW && L.lang === "me" && kljuc === "pocetna") {
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

const vlak = (L, klasa = "") => `<ol class="vlak ${klasa}">${L.proces.koraci.map(([a, b], i) => `<li><span class="st">${L.proces.st} ${i + 1}</span><h3>${a}</h3><p>${b}</p></li>`).join("")}</ol>`;
const principi = (L) => `<dl class="principi">${L.stav.principi.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join("")}</dl>`;
const klijenti = (L) => `<section class="sekcija" aria-labelledby="kl-n"><div class="omot klijenti-blok"><h2 id="kl-n">${L.klijentiNaslov}</h2><ul class="klijenti">${firma.klijenti.map((k) => `<li>${k}</li>`).join("")}</ul></div></section>`;

function planBlok(L) {
  const P = L.plan;
  return `<figure class="list-plana"><div class="unutra">
<span class="uputa">${P.uputa}</span>
${planSvg(L)}
</div>
<div class="naslovni-blok">
<div>${P.parcela}</div><div class="vrijednost siroko" id="parcela-info" aria-live="polite">${P.dioba}</div>
<div>${P.kursor}</div><div class="vrijednost"><span id="kursor-y">Y 6 603 456,40</span> &nbsp; <span id="kursor-x">X 4 700 271,44</span></div>
<div>${P.razmjera}</div><div class="vrijednost">${P.razmjeraV}</div>
<div>${P.sistem}</div><div class="vrijednost">${P.sistemV}</div>
<div>${P.izradio}</div><div class="vrijednost">${P.izradioV}</div>
</div></figure>`;
}

/* ---------- stranice ---------- */
function pocetna(L) {
  const H = L.hero, S = L.stav;
  const indeks = L.grupe.filter((g) => !g.dron).map((g) => `<div class="grupa"><h3>${g.naziv}</h3><ul>${g.usluge.map((k) => {
    const u = L.usluge[k];
    return `<li><a href="${L.stranice.usluge}#${k}"><strong>${u.naziv}</strong><span>${u.kratko}</span><i>${strelica}</i></a></li>`;
  }).join("")}</ul></div>`).join("");
  return `
<section class="hero" aria-labelledby="hero-n">
<canvas class="oblak" aria-hidden="true"></canvas>
<div class="omot">
<div class="hero-gore">
<p class="oznaka">${H.mjesto}</p>
<dl class="ocitavanje" aria-hidden="true">
<dt>${H.tacka}</dt><dd id="o-t">0427</dd>
<dt>Y</dt><dd id="o-y">6 603 456,40</dd>
<dt>X</dt><dd id="o-x">4 700 271,44</dd>
<dt>${H.visina}</dt><dd id="o-h" class="hv">48,62 m</dd>
</dl>
</div>
<div class="hero-dole">
<h1 id="hero-n">${H.naslov}</h1>
<div class="desno"><p class="uvod">${H.uvod}</p>
${kontaktDugmad(L, false)}</div>
</div>
</div>
<span class="potpis">${H.ilustracija}</span>
</section>

${dronBlok(L)}

<section class="sekcija" aria-labelledby="stav-n"><div class="omot">
<div class="izjava-blok">
<div class="lijevo"><h2 id="stav-n" style="font-size:var(--t0);color:var(--pijesak);font-weight:420;font-stretch:112%;letter-spacing:0;max-width:24ch">${S.naslov}</h2></div>
<div style="display:grid;gap:36px;align-content:start"><p class="izjava">${S.izjava}</p><p><a class="veza" href="${L.stranice.onama}">${S.vise}</a></p></div>
</div>
<div class="brojke">${L.brojke.map(([b, t]) => `<div><b>${b}</b><span>${t}</span></div>`).join("")}</div>
</div></section>

<section class="sekcija dubina" aria-labelledby="usl-n"><div class="omot">
<div class="glava-sekcije"><h2 id="usl-n">${L.uslugeNaslov}</h2><p>${L.uslugeUvod}</p></div>
<div class="indeks">${indeks}</div>
</div></section>

<section class="sekcija" aria-labelledby="ter-n"><div class="omot">
<div class="glava-sekcije"><h2 id="ter-n">${L.teren.naslov}</h2><p>${L.teren.uvod}</p></div>
<div class="teren">${vlak(L)}${planBlok(L)}</div>
</div></section>

<section class="sekcija dubina" aria-labelledby="pr-n"><div class="omot dvije">
<h2 id="pr-n">${L.principiNaslov}</h2>
${principi(L)}
</div></section>
${klijenti(L)}
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
  return `<section class="naslov-strane"><div class="omot"><p class="oznaka">GeoExpert</p><h1>${L.uslugeNaslov}</h1><p class="uvod">${L.uslugeUvod}</p></div></section>
<section class="sekcija" style="padding-top:clamp(56px,7vw,96px)"><div class="omot sadrzaj-usluga"><nav aria-label="${L.uslugeNaslov}">${nav}</nav><div>${sve}</div></div></section>
${kontaktBlok(L)}`;
}

function onama(L) {
  const O = L.onama;
  return `<section class="naslov-strane"><div class="omot"><p class="oznaka">${L.nav.onama}</p><h1>${O.naslov}</h1><p class="uvod">${O.uvod}</p></div></section>
<section class="sekcija"><div class="omot dvije">
<div class="kol">${O.tekst.map((t) => `<p>${t}</p>`).join("")}</div>
${principi(L)}
</div>
<div class="omot"><div class="brojke">${L.brojke.map(([b, t]) => `<div><b>${b}</b><span>${t}</span></div>`).join("")}</div></div></section>
<section class="sekcija dubina"><div class="omot dvije">
<h2>${O.zaKoga}</h2>
<ul class="za-koga">${O.zaKogaLista.map((x) => `<li>${x}</li>`).join("")}</ul>
</div></section>
<section class="sekcija"><div class="omot"><div class="glava-sekcije"><h2>${L.proces.naslov}</h2><p>${L.proces.uvod}</p></div>
${vlak(L, "vodoravno")}</div></section>
${klijenti(L)}
${kontaktBlok(L)}`;
}

function privatnost(L) {
  const P = L.privatnost;
  return `<section class="naslov-strane"><div class="omot"><p class="oznaka">${P.azurirano}</p><h1>${P.naslov}</h1><p class="uvod">${P.uvod}</p></div></section>
<section class="sekcija" style="padding-top:clamp(48px,6vw,88px)"><div class="omot"><dl class="principi pravni-tekst">
${P.odjeljci.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join("")}
</dl></div></section>`;
}

function stranica404() {
  const linkovi = JEZICI.map((J) => `<a class="dugme prazno" href="/${J.dir}" lang="${J.htmlLang}">${zastava(J.kod)}${J.ime}</a>`).join("");
  let html = strana(me, "pocetna", `<section class="naslov-strane"><div class="omot"><p class="oznaka">404</p>
<h1>Ova stranica ne postoji.</h1><p class="uvod">Adresa je možda pogrešno upisana ili je stranica premještena. <span lang="en">This page does not exist.</span></p>
<div class="akcije jezici-404">${linkovi}</div></div></section>`);
  html = html.replace(/<title>[^<]*<\/title>/, "<title>Stranica nije pronađena | GeoExpert</title>")
    .replace(/<link rel="canonical"[^>]*>\n/, "").replace(/<link rel="alternate"[^>]*>\n/g, "")
    .replace("<head>", '<head>\n<base href="/">\n<meta name="robots" content="noindex">');
  return html;
}

function kontakt(L) {
  const K = L.kontakt, F = K.forma, C = L.cta;
  return `<section class="naslov-strane"><div class="omot"><p class="oznaka">${L.nav.kontakt}</p><h1>${K.naslov}</h1><p class="uvod">${K.uvod}</p></div></section>
<section class="sekcija" style="padding-top:clamp(56px,7vw,96px)"><div class="omot dvije">
<div class="kol kontakt-kanali">
${kontaktDugmad(L, false)}
<a class="glasnik email-dugme" href="mailto:${firma.email}"><i>${ikMail}</i>${firma.email}</a>
</div>
<dl class="podaci">
<div><dt>${F.telefon}</dt><dd><a class="broj" href="tel:${firma.tel1href}">${firma.tel1}</a><br><a class="broj" href="tel:${firma.tel2href}">${firma.tel2}</a></dd></div>
<div><dt>${C.email}</dt><dd><a href="mailto:${firma.email}">${firma.email}</a></dd></div>
<div><dt>${C.adresa}</dt><dd>${L.adresa}<br><a class="veza" href="${firma.mapa}" target="_blank" rel="noopener">${C.mapa}</a></dd></div>
<div><dt>${C.radno}</dt><dd>${C.radnoV}</dd></div>
</dl>
</div></section>`;
}

/* ---------- upis ---------- */
const THREE = PREVIEW ? `<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" defer></script>\n` : null;
const upisi = (rel, html) => { const f = join(OUT, rel); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, html); };
for (const L of JEZICI) {
  const d = L.dir;
  upisi(d + L.stranice.pocetna, strana(L, "pocetna", pocetna(L), THREE || `<script src="${prefiks(L)}assets/vendor/three.min.js" defer></script>\n`));
  upisi(d + L.stranice.usluge, strana(L, "usluge", usluge(L)));
  upisi(d + L.stranice.onama, strana(L, "onama", onama(L)));
  upisi(d + L.stranice.kontakt, strana(L, "kontakt", kontakt(L)));
  upisi(d + L.stranice.privatnost, strana(L, "privatnost", privatnost(L)));
}
if (!PREVIEW) {
  upisi("404.html", stranica404());
  const urls = [];
  for (const L of JEZICI) for (const k of Object.keys(L.stranice)) urls.push(SITE_URL + "/" + putanja(L, k).replace(/index\.html$/, "").replace(/\.html$/, ""));
  upisi("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}\n</urlset>\n`);
  upisi("robots.txt", `User-agent: *\nAllow: /\nDisallow: /_build/\nSitemap: ${SITE_URL}/sitemap.xml\n`);
}
console.log("Gotovo:", OUT);
