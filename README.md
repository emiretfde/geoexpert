# GeoExpert sajt

Statički, dvojezični sajt (crnogorski + engleski) za geodetsku firmu GeoExpert iz Podgorice.

## Struktura

- `index.html`, `usluge.html`, `o-nama.html`, `kontakt.html`: crnogorska verzija
- `en/`, `de/`, `tr/`, `ru/`: engleska, njemačka, turska i ruska verzija
- `assets/`: CSS, JS, favicon i fontovi (Archivo, OFL licenca, hostovan lokalno)
- `functions/api/contact.js`: Cloudflare Pages funkcija za kontakt formu
- `404.html`: stranica za nepostojeće adrese
- `assets/og-image.jpg`: slika koja se prikazuje kad se link podijeli
- `functions/_middleware.js`: preusmjerava www.geoexpert.me i geoexpert-aes.pages.dev na geoexpert.me
- `_build/`: izvor sadržaja (`content.mjs`, `prevodi.mjs`, `dron.mjs`, `dopune.mjs`, `pravno.mjs` za politiku privatnosti) i generator stranica (`build.mjs`)

## Izmjena teksta

Tekst je u `_build/content.mjs` (ME, EN) i `_build/prevodi.mjs` (DE, TR, RU). Nakon izmjene:

```
node _build/build.mjs   # adresa sajta: https://geoexpert.me (SITE_URL u build.mjs)
```

pa commit generisanih HTML fajlova.

## Objava na Cloudflare Pages

Workers & Pages → Create → Pages → Connect to Git → izabrati ovaj repo.
- Framework preset: None
- Build command: prazno
- Build output directory: `/`

Svaki push na `main` objavljuje sajt automatski.

## Kontakt forma

Forma šalje na `/api/contact`, koja prosljeđuje poruku na e-mail preko [Resend](https://resend.com).
U Pages → Settings → Variables and Secrets dodati:

- `RESEND_API_KEY`: tajna
- `CONTACT_TO`: `geoexpertpg@gmail.com`
- `CONTACT_FROM`: npr. `GeoExpert sajt <forma@vas-domen.me>` (domen verifikovan u Resendu)

Bez ključa forma prikazuje telefon i e-mail kao rezervni kontakt.
