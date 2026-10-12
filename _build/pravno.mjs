// Politika privatnosti (5 jezika). Spaja se u build.mjs: dodaje stranicu "privatnost" svakom jeziku.
// Napomena: opšti tekst za kontakt formu bez kolačića; kad se uključe analitika/oglasi, dopuniti i dodati baner za saglasnost.

const F = { naziv: "GEO EXPERT d.o.o. Podgorica", adresa: "13. jul br. 9, 81000 Podgorica", pib: "02934094", email: "geoexpertpg@gmail.com" };

const D = {
  me: {
    fajl: "privatnost.html", link: "Politika privatnosti",
    meta: ["Politika privatnosti | GeoExpert", "Kako GEO EXPERT d.o.o. obrađuje podatke koje pošaljete putem sajta."],
    naslov: "Politika privatnosti",
    uvod: "Kako obrađujemo podatke koje nam pošaljete putem ovog sajta.",
    azurirano: "Ažurirano: oktobar 2026.",
    odjeljci: [
      ["Ko obrađuje podatke", `${F.naziv}, ${F.adresa}, PIB ${F.pib}. Za sva pitanja o podacima pišite na ${F.email}.`],
      ["Koje podatke prikupljamo", "Samo ono što unesete u kontakt formu: ime i prezime, e-poštu, telefon (ako ga navedete), izabranu uslugu i poruku. Ako nas pozovete ili pišete putem Vibera ili WhatsAppa, vidimo vaš broj telefona i poruku."],
      ["Zašto ih koristimo", "Isključivo da odgovorimo na vaš upit, pripremimo ponudu i, ako se dogovorimo, izvršimo posao. Podatke ne koristimo za reklamne poruke i ne prodajemo ih nikome."],
      ["Koliko ih čuvamo", "Upite na koje ne uslijedi posao brišemo najkasnije dvije godine nakon posljednjeg kontakta. Podatke vezane za izvršen posao čuvamo onoliko koliko propisi o računovodstvu i katastru zahtijevaju."],
      ["Ko još ima pristup", "Sajt je smješten na Cloudflare mreži, a poruke sa forme stižu nam e-poštom preko servisa za slanje e-pošte. Ti servisi podatke obrađuju samo da bi poruka stigla do nas."],
      ["Kolačići", "Sajt trenutno ne koristi kolačiće za praćenje ni oglašavanje. Ako to promijenimo, prvo ćemo vas pitati za saglasnost."],
      ["Vaša prava", "Možete tražiti uvid u svoje podatke, njihovu ispravku ili brisanje, kao i povući saglasnost. Pišite nam na " + F.email + ". Ako smatrate da su vam prava povrijeđena, možete se obratiti Agenciji za zaštitu ličnih podataka i slobodan pristup informacijama."],
    ],
  },
  en: {
    fajl: "privacy.html", link: "Privacy policy",
    meta: ["Privacy policy | GeoExpert", "How GEO EXPERT d.o.o. handles the information you send through this website."],
    naslov: "Privacy policy",
    uvod: "How we handle the information you send us through this website.",
    azurirano: "Updated: October 2026.",
    odjeljci: [
      ["Who handles your data", `${F.naziv}, 13. jul 9, 81000 Podgorica, Montenegro, tax ID ${F.pib}. For any question about your data, write to ${F.email}.`],
      ["What we collect", "Only what you enter in the contact form: name, email, phone (if given), the selected service and your message. If you call us or write via Viber or WhatsApp, we see your phone number and message."],
      ["Why we use it", "Only to reply to your enquiry, prepare a quote and, if agreed, carry out the work. We do not use your data for advertising messages and never sell it."],
      ["How long we keep it", "Enquiries that do not lead to work are deleted no later than two years after the last contact. Data related to completed work is kept as long as accounting and cadastral rules require."],
      ["Who else has access", "The website is hosted on the Cloudflare network, and form messages reach us by email through an email delivery service. These services process the data only to deliver the message to us."],
      ["Cookies", "The website currently uses no tracking or advertising cookies. If that changes, we will ask for your consent first."],
      ["Your rights", "You can ask to see, correct or delete your data, and withdraw your consent, by writing to " + F.email + ". If you believe your rights have been violated, you can contact Montenegro's Agency for Personal Data Protection and Free Access to Information."],
    ],
  },
  de: {
    fajl: "datenschutz.html", link: "Datenschutz",
    meta: ["Datenschutz | GeoExpert", "Wie GEO EXPERT d.o.o. die Daten verarbeitet, die Sie über diese Website senden."],
    naslov: "Datenschutzerklärung",
    uvod: "Wie wir die Daten verarbeiten, die Sie uns über diese Website senden.",
    azurirano: "Stand: Oktober 2026.",
    odjeljci: [
      ["Verantwortlicher", `${F.naziv}, 13. jul 9, 81000 Podgorica, Montenegro, Steuer-Nr. ${F.pib}. Bei Fragen zu Ihren Daten schreiben Sie an ${F.email}.`],
      ["Welche Daten wir erheben", "Nur die Angaben im Kontaktformular: Name, E-Mail, Telefon (falls angegeben), gewählte Leistung und Ihre Nachricht. Wenn Sie anrufen oder über Viber oder WhatsApp schreiben, sehen wir Ihre Telefonnummer und Nachricht."],
      ["Wofür wir sie nutzen", "Ausschließlich, um Ihre Anfrage zu beantworten, ein Angebot zu erstellen und den Auftrag auszuführen. Wir nutzen Ihre Daten nicht für Werbung und verkaufen sie nicht."],
      ["Speicherdauer", "Anfragen ohne Auftrag löschen wir spätestens zwei Jahre nach dem letzten Kontakt. Daten zu ausgeführten Aufträgen bewahren wir so lange auf, wie es Buchhaltungs- und Katastervorschriften verlangen."],
      ["Empfänger", "Die Website wird im Cloudflare-Netz betrieben; Formularnachrichten erreichen uns per E-Mail über einen E-Mail-Versanddienst. Diese Dienste verarbeiten die Daten nur zur Zustellung der Nachricht."],
      ["Cookies", "Die Website verwendet derzeit keine Tracking- oder Werbe-Cookies. Sollte sich das ändern, bitten wir Sie vorher um Ihre Einwilligung."],
      ["Ihre Rechte", "Sie können Auskunft, Berichtigung oder Löschung Ihrer Daten verlangen und Ihre Einwilligung widerrufen: " + F.email + ". Beschwerden können Sie an die montenegrinische Datenschutzbehörde richten."],
    ],
  },
  tr: {
    fajl: "gizlilik.html", link: "Gizlilik politikası",
    meta: ["Gizlilik politikası | GeoExpert", "GEO EXPERT d.o.o.'nun bu site üzerinden gönderdiğiniz verileri nasıl işlediği."],
    naslov: "Gizlilik politikası",
    uvod: "Bu site üzerinden bize gönderdiğiniz verileri nasıl işlediğimiz.",
    azurirano: "Güncelleme: Ekim 2026.",
    odjeljci: [
      ["Veri sorumlusu", `${F.naziv}, 13. jul 9, 81000 Podgorica, Karadağ, vergi no ${F.pib}. Verilerinizle ilgili sorular için ${F.email} adresine yazın.`],
      ["Hangi verileri topluyoruz", "Yalnızca iletişim formuna girdikleriniz: ad soyad, e-posta, telefon (verildiyse), seçilen hizmet ve mesajınız. Bizi arar veya Viber ya da WhatsApp üzerinden yazarsanız telefon numaranızı ve mesajınızı görürüz."],
      ["Neden kullanıyoruz", "Yalnızca talebinize yanıt vermek, teklif hazırlamak ve anlaşırsak işi yapmak için. Verilerinizi reklam amacıyla kullanmaz ve kimseye satmayız."],
      ["Ne kadar saklıyoruz", "İşe dönüşmeyen talepleri son temastan en geç iki yıl sonra sileriz. Yapılan işe ait verileri muhasebe ve kadastro mevzuatının gerektirdiği süre boyunca saklarız."],
      ["Başka kimler erişebilir", "Site Cloudflare ağında barındırılır; form mesajları bize bir e-posta gönderim hizmeti aracılığıyla ulaşır. Bu hizmetler verileri yalnızca mesajı iletmek için işler."],
      ["Çerezler", "Site şu anda takip veya reklam çerezi kullanmamaktadır. Bu değişirse önce onayınızı isteriz."],
      ["Haklarınız", "Verilerinize erişim, düzeltme veya silme talep edebilir ve onayınızı geri alabilirsiniz: " + F.email + ". Haklarınızın ihlal edildiğini düşünüyorsanız Karadağ Kişisel Verileri Koruma Ajansı'na başvurabilirsiniz."],
    ],
  },
  ru: {
    fajl: "konfidencialnost.html", link: "Политика конфиденциальности",
    meta: ["Политика конфиденциальности | GeoExpert", "Как GEO EXPERT d.o.o. обрабатывает данные, которые вы отправляете через сайт."],
    naslov: "Политика конфиденциальности",
    uvod: "Как мы обрабатываем данные, которые вы отправляете нам через этот сайт.",
    azurirano: "Обновлено: октябрь 2026.",
    odjeljci: [
      ["Кто обрабатывает данные", `${F.naziv}, 13. jul 9, 81000 Подгорица, Черногория, ИНН ${F.pib}. По вопросам о ваших данных пишите на ${F.email}.`],
      ["Какие данные мы собираем", "Только то, что вы указали в форме: имя, эл. почту, телефон (если указан), выбранную услугу и сообщение. Если вы звоните или пишете в Viber или WhatsApp, мы видим ваш номер и сообщение."],
      ["Зачем мы их используем", "Только чтобы ответить на запрос, подготовить предложение и, по договорённости, выполнить работу. Мы не используем данные для рекламы и никому их не продаём."],
      ["Сколько храним", "Запросы, не перешедшие в заказ, удаляем не позднее двух лет после последнего контакта. Данные по выполненным работам храним столько, сколько требуют правила бухгалтерского учёта и кадастра."],
      ["Кто ещё имеет доступ", "Сайт размещён в сети Cloudflare, сообщения из формы приходят нам по эл. почте через сервис отправки писем. Эти сервисы обрабатывают данные только для доставки сообщения."],
      ["Файлы cookie", "Сайт сейчас не использует cookie для отслеживания или рекламы. Если это изменится, мы сначала спросим ваше согласие."],
      ["Ваши права", "Вы можете запросить доступ к данным, их исправление или удаление, а также отозвать согласие: " + F.email + ". Жалобу можно подать в Агентство по защите персональных данных Черногории."],
    ],
  },
};

export function dodajPravno(L) {
  const d = D[L.lang];
  if (!d || L.stranice.privatnost) return L;
  L.stranice = { ...L.stranice, privatnost: d.fajl };
  L.meta = { ...L.meta, privatnost: d.meta };
  L.privatnost = d;
  return L;
}
