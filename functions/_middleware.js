// Jedna kanonska adresa: www i stara pages.dev adresa trajno se preusmjeravaju na geoexpert.me.
// Preview build-ovi (npr. abc123.geoexpert-aes.pages.dev) ostaju dostupni za provjeru.
const GLAVNI = "geoexpert.me";
const PREUSMJERI = new Set(["www.geoexpert.me", "geoexpert-aes.pages.dev"]);

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (PREUSMJERI.has(url.hostname)) {
    url.hostname = GLAVNI;
    url.protocol = "https:";
    url.port = "";
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
