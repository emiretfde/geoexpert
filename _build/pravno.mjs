// Politika privatnosti (5 jezika). Spaja se u build.mjs: dodaje stranicu "privatnost" svakom jeziku.
// Napomena: opšti tekst za kontakt formu bez kolačića; kad se uključe analitika/oglasi, dopuniti i dodati baner za saglasnost.

import { firma } from "./content.mjs";
const F = { naziv: "GEO EXPERT d.o.o. Podgorica", adresa: "13. jul br. 9, 81000 Podgorica", pib: "02934094", email: firma.email };

const D = {
  me: {
    fajl: "privatnost.html", link: "Politika privatnosti",
    meta: ["Politika privatnosti | GeoExpert", "Kako GEO EXPERT d.o.o. obrađuje podatke koje pošaljete putem sajta."],
    naslov: "Politika privatnosti",
    uvod: "Kako obrađujemo podatke koje nam pošaljete putem ovog sajta.",
    azurirano: "Ažurirano: oktobar 2026.",
    odjeljci: [
      ["Ko obrađuje podatke", `${F.naziv}, ${F.adresa}, PIB ${F.pib}. Za sva pitanja o podacima pišite na ${F.email}.`],
      ["Koje podatke prikupljamo", "Sajt ne prikuplja lične podatke i nema formu. Ako nas pozovete ili pišete e-poštom, Viberom ili WhatsAppom, vidimo vaš broj telefona ili e-adresu i ono što nam pošaljete."],
      ["Zašto ih koristimo", "Isključivo da odgovorimo na vaš upit, pripremimo ponudu i, ako se dogovorimo, izvršimo posao. Podatke ne koristimo za reklamne poruke i ne prodajemo ih nikome."],
      ["Koliko ih čuvamo", "Upite na koje ne uslijedi posao brišemo najkasnije dvije godine nakon posljednjeg kontakta. Podatke vezane za izvršen posao čuvamo onoliko koliko propisi o računovodstvu i katastru zahtijevaju."],
      ["Ko još ima pristup", "Sajt je smješten na Cloudflare mreži. E-pošta poslata na našu adresu dostavlja se u naš Gmail sandučić. Pozivi i poruke idu preko vašeg operatera i aplikacija Viber i WhatsApp."],
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
      ["What we collect", "The website collects no personal data and has no form. If you call us or write by email, Viber or WhatsApp, we see your phone number or email address and what you send us."],
      ["Why we use it", "Only to reply to your enquiry, prepare a quote and, if agreed, carry out the work. We do not use your data for advertising messages and never sell it."],
      ["How long we keep it", "Enquiries that do not lead to work are deleted no later than two years after the last contact. Data related to completed work is kept as long as accounting and cadastral rules require."],
      ["Who else has access", "The website is hosted on the Cloudflare network. Email sent to our address is delivered to our Gmail mailbox. Calls and messages go through your operator and the Viber and WhatsApp apps."],
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
      ["Welche Daten wir erheben", "Die Website erhebt keine personenbezogenen Daten und hat kein Formular. Wenn Sie anrufen oder per E-Mail, Viber oder WhatsApp schreiben, sehen wir Ihre Telefonnummer bzw. E-Mail-Adresse und Ihre Nachricht."],
      ["Wofür wir sie nutzen", "Ausschließlich, um Ihre Anfrage zu beantworten, ein Angebot zu erstellen und den Auftrag auszuführen. Wir nutzen Ihre Daten nicht für Werbung und verkaufen sie nicht."],
      ["Speicherdauer", "Anfragen ohne Auftrag löschen wir spätestens zwei Jahre nach dem letzten Kontakt. Daten zu ausgeführten Aufträgen bewahren wir so lange auf, wie es Buchhaltungs- und Katastervorschriften verlangen."],
      ["Empfänger", "Die Website wird im Cloudflare-Netz betrieben. E-Mails an unsere Adresse werden in unser Gmail-Postfach zugestellt. Anrufe und Nachrichten laufen über Ihren Anbieter sowie Viber und WhatsApp."],
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
      ["Hangi verileri topluyoruz", "Site kişisel veri toplamaz ve form içermez. Bizi arar veya e-posta, Viber ya da WhatsApp ile yazarsanız telefon numaranızı ya da e-posta adresinizi ve gönderdiklerinizi görürüz."],
      ["Neden kullanıyoruz", "Yalnızca talebinize yanıt vermek, teklif hazırlamak ve anlaşırsak işi yapmak için. Verilerinizi reklam amacıyla kullanmaz ve kimseye satmayız."],
      ["Ne kadar saklıyoruz", "İşe dönüşmeyen talepleri son temastan en geç iki yıl sonra sileriz. Yapılan işe ait verileri muhasebe ve kadastro mevzuatının gerektirdiği süre boyunca saklarız."],
      ["Başka kimler erişebilir", "Site Cloudflare ağında barındırılır. Adresimize gönderilen e-postalar Gmail kutumuza iletilir. Aramalar ve mesajlar operatörünüz ile Viber ve WhatsApp üzerinden gider."],
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
      ["Какие данные мы собираем", "Сайт не собирает персональные данные и не содержит формы. Если вы звоните или пишете по эл. почте, в Viber или WhatsApp, мы видим ваш номер или адрес и то, что вы отправили."],
      ["Зачем мы их используем", "Только чтобы ответить на запрос, подготовить предложение и, по договорённости, выполнить работу. Мы не используем данные для рекламы и никому их не продаём."],
      ["Сколько храним", "Запросы, не перешедшие в заказ, удаляем не позднее двух лет после последнего контакта. Данные по выполненным работам храним столько, сколько требуют правила бухгалтерского учёта и кадастра."],
      ["Кто ещё имеет доступ", "Сайт размещён в сети Cloudflare. Письма на наш адрес доставляются в наш ящик Gmail. Звонки и сообщения проходят через вашего оператора и приложения Viber и WhatsApp."],
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
