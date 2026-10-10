// Cloudflare Pages Function: POST /api/contact
// Šalje poruku sa forme na e-mail preko Resend API-ja.
// U Cloudflare Pages → Settings → Variables podesiti:
//   RESEND_API_KEY  (obavezno, tajna)
//   CONTACT_TO      (npr. geoexpertpg@gmail.com)
//   CONTACT_FROM    (npr. "GeoExpert sajt <forma@vas-domen.me>", domen verifikovan u Resendu)
export async function onRequestPost({ request, env }) {
  let d;
  try { d = await request.json(); } catch { return json({ ok: false, error: "bad_request" }, 400); }
  if (d.web) return json({ ok: true }); // zamka za botove
  const ime = clean(d.ime, 120), email = clean(d.email, 160), poruka = clean(d.poruka, 5000);
  if (!ime || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !poruka) return json({ ok: false, error: "invalid" }, 422);
  if (!env.RESEND_API_KEY) return json({ ok: false, error: "not_configured" }, 503);
  const text = [`Ime: ${ime}`, `E-pošta: ${email}`, `Telefon: ${clean(d.telefon, 60) || "-"}`, `Usluga: ${clean(d.usluga, 120) || "-"}`, `Jezik: ${d.jezik === "en" ? "EN" : "ME"}`, "", poruka].join("\n");
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.CONTACT_FROM || "GeoExpert sajt <onboarding@resend.dev>", to: [env.CONTACT_TO || "geoexpertpg@gmail.com"], reply_to: email, subject: `Upit sa sajta: ${ime}`, text }),
  });
  return r.ok ? json({ ok: true }) : json({ ok: false, error: "send_failed" }, 502);
}
const clean = (v, n) => String(v ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, n);
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json" } });
