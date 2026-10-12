// Dopune iz Megabaza objave (potvrđeno od vlasnika): dioba i spajanje, iskolčenje, GNSS,
// "fizička i pravna lica", "bez skrivenih troškova". Spaja se u build.mjs nakon dodajDron.

const D = {
  me: {
    principTekst: "Unaprijed znate šta je potrebno, koliko traje i koliko košta, bez skrivenih troškova.",
    onamaUvod: "GeoExpert radi u Podgorici više od 13 godina. Radimo za fizička i pravna lica: vlasnike, investitore, kompanije i javne institucije, na terenu širom Crne Gore.",
    dioba: { naziv: "Dioba i spajanje parcela", kratko: "Podjela parcele na više djelova ili spajanje više parcela u jednu, sa elaboratom za katastar.",
      opis: "Kada se parcela dijeli zbog nasljeđa, prodaje dijela ili gradnje, ili se više parcela spaja u jednu cjelinu, nove granice moraju biti izmjerene, obilježene i upisane. Radimo elaborat diobe ili spajanja i pratimo ga do upisa novih parcela u list nepokretnosti.",
      kada: ["nasljeđe i razvrgnuće suvlasništva", "prodaja dijela parcele", "spajanje susjednih parcela u jednu cjelinu za gradnju"],
      dobijate: ["elaborat diobe ili spajanja za katastar", "obilježene nove prelomne tačke na terenu", "praćenje predmeta do upisa"] },
    iskolcenje: { naziv: "Iskolčenje objekata i infrastrukture", kratko: "Prenošenje projekta na teren: osovine, temelji, saobraćajnice i instalacije.",
      opis: "Prije i tokom gradnje prenosimo projektovane tačke na teren, tako da objekat stoji tačno tamo gdje ga projekat i dozvola predviđaju. Iskolčavamo osovine i temelje objekata, trase puteva i instalacija, i kontrolišemo izvedeno.",
      kada: ["početak gradnje objekta", "izgradnja puteva, vodova i instalacija", "kontrola položaja tokom izvođenja"],
      dobijate: ["obilježene tačke i osovine na terenu", "zapisnik o iskolčenju", "kontrolna mjerenja po fazama"] },
    gnss: { naziv: "GNSS mjerenja i geodetske osnove", kratko: "Satelitska mjerenja i mreža stalnih tačaka za veće projekte.",
      opis: "Za veća gradilišta, puteve i komplekse postavljamo geodetsku osnovu: mrežu stabilisanih tačaka sa preciznim koordinatama, na koju se oslanjaju sva dalja mjerenja. Koordinate određujemo satelitskim GNSS prijemnicima u državnom koordinatnom sistemu.",
      kada: ["veća gradilišta i infrastrukturni projekti", "snimanje dronom sa kontrolnim tačkama", "projekti koji traju duže i traže stalnu kontrolu"],
      dobijate: ["stabilisane tačke geodetske osnove", "koordinate u državnom sistemu", "izvještaj o mjerenju i tačnosti"] },
  },
  en: {
    principTekst: "You know in advance what is needed, how long it takes and what it costs, with no hidden fees.",
    onamaUvod: "GeoExpert has worked in Podgorica for more than 13 years. We work for individuals and businesses alike: owners, developers, companies and public institutions across Montenegro.",
    dioba: { naziv: "Parcel subdivision and merger", kratko: "Dividing a parcel into several or merging several parcels into one, with the report for the cadastre.",
      opis: "When a parcel is divided for inheritance, a partial sale or construction, or several parcels are merged into one, the new boundaries must be measured, marked and registered. We prepare the subdivision or merger report and follow it until the new parcels appear in the property sheet.",
      kada: ["inheritance and ending co-ownership", "selling part of a parcel", "merging neighbouring parcels for construction"],
      dobijate: ["subdivision or merger report for the cadastre", "new corner points marked on site", "case follow-up until registration"] },
    iskolcenje: { naziv: "Setting out buildings and infrastructure", kratko: "Transferring the design to the site: axes, foundations, roads and utilities.",
      opis: "Before and during construction we transfer the designed points to the site, so the building stands exactly where the design and permit place it. We set out building axes and foundations, road and utility alignments, and check what has been built.",
      kada: ["start of construction", "building roads, pipelines and utilities", "position checks during construction"],
      dobijate: ["points and axes marked on site", "setting-out record", "control measurements by stage"] },
    gnss: { naziv: "GNSS surveys and control networks", kratko: "Satellite positioning and permanent control points for larger projects.",
      opis: "For larger sites, roads and complexes we establish a control network: monumented points with precise coordinates that all further measurements rely on. Coordinates are determined with GNSS receivers in the national coordinate system.",
      kada: ["larger construction and infrastructure projects", "drone surveys with ground control points", "long projects that need ongoing control"],
      dobijate: ["monumented control points", "coordinates in the national system", "survey and accuracy report"] },
  },
  de: {
    principTekst: "Sie wissen vorab, was nötig ist, wie lange es dauert und was es kostet, ohne versteckte Kosten.",
    onamaUvod: "GeoExpert arbeitet seit mehr als 13 Jahren in Podgorica. Wir arbeiten für Privatpersonen und Unternehmen: Eigentümer, Bauträger, Firmen und öffentliche Einrichtungen in ganz Montenegro.",
    dioba: { naziv: "Grundstücksteilung und -verschmelzung", kratko: "Teilung eines Grundstücks oder Zusammenlegung mehrerer Grundstücke, mit Bericht für das Kataster.",
      opis: "Wird ein Grundstück wegen Erbschaft, Teilverkauf oder Bebauung geteilt oder werden mehrere Grundstücke zusammengelegt, müssen die neuen Grenzen vermessen, markiert und eingetragen werden. Wir erstellen den Teilungs- oder Verschmelzungsbericht und begleiten ihn bis zur Eintragung im Grundbuchblatt.",
      kada: ["Erbschaft und Aufhebung von Miteigentum", "Verkauf eines Grundstücksteils", "Zusammenlegung benachbarter Grundstücke für ein Bauvorhaben"],
      dobijate: ["Teilungs- oder Verschmelzungsbericht für das Kataster", "neue Grenzpunkte vor Ort markiert", "Begleitung bis zur Eintragung"] },
    iskolcenje: { naziv: "Absteckung von Gebäuden und Infrastruktur", kratko: "Übertragung der Planung ins Gelände: Achsen, Fundamente, Straßen und Leitungen.",
      opis: "Vor und während des Baus übertragen wir die geplanten Punkte ins Gelände, damit das Gebäude genau dort steht, wo Planung und Genehmigung es vorsehen. Wir stecken Gebäudeachsen und Fundamente, Straßen- und Leitungstrassen ab und kontrollieren die Ausführung.",
      kada: ["Baubeginn", "Bau von Straßen, Leitungen und Versorgungsnetzen", "Lagekontrolle während der Ausführung"],
      dobijate: ["abgesteckte Punkte und Achsen vor Ort", "Absteckungsprotokoll", "Kontrollmessungen je Bauphase"] },
    gnss: { naziv: "GNSS-Messungen und Festpunktnetze", kratko: "Satellitenvermessung und dauerhafte Festpunkte für größere Projekte.",
      opis: "Für größere Baustellen, Straßen und Anlagen richten wir ein Festpunktnetz ein: vermarkte Punkte mit genauen Koordinaten, auf die sich alle weiteren Messungen stützen. Die Koordinaten bestimmen wir mit GNSS-Empfängern im Landeskoordinatensystem.",
      kada: ["größere Bau- und Infrastrukturprojekte", "Drohnenvermessung mit Passpunkten", "langlaufende Projekte mit laufender Kontrolle"],
      dobijate: ["vermarkte Festpunkte", "Koordinaten im Landessystem", "Mess- und Genauigkeitsbericht"] },
  },
  tr: {
    principTekst: "Neyin gerektiğini, ne kadar süreceğini ve ne kadar tutacağını önceden bilirsiniz; gizli maliyet yoktur.",
    onamaUvod: "GeoExpert 13 yılı aşkın süredir Podgorica'da çalışıyor. Karadağ genelinde gerçek ve tüzel kişiler için çalışıyoruz: mülk sahipleri, müteahhitler, şirketler ve kamu kurumları.",
    dioba: { naziv: "Parsel ifrazı ve tevhidi", kratko: "Parselin birden fazla parsele bölünmesi veya parsellerin birleştirilmesi, kadastro raporu ile.",
      opis: "Parsel miras, kısmi satış veya inşaat nedeniyle bölündüğünde ya da birden fazla parsel tek parselde birleştirildiğinde yeni sınırların ölçülmesi, işaretlenmesi ve tescil edilmesi gerekir. İfraz veya tevhit raporunu hazırlar, yeni parseller tapu kaydına işlenene kadar takip ederiz.",
      kada: ["miras ve ortaklığın giderilmesi", "parselin bir kısmının satışı", "inşaat için komşu parsellerin birleştirilmesi"],
      dobijate: ["kadastro için ifraz veya tevhit raporu", "arazide işaretlenmiş yeni köşe noktaları", "tescile kadar dosya takibi"] },
    iskolcenje: { naziv: "Yapı ve altyapı aplikasyonu", kratko: "Projenin araziye aktarılması: akslar, temeller, yollar ve tesisatlar.",
      opis: "İnşaat öncesinde ve sırasında proje noktalarını araziye aktarırız; böylece yapı, projenin ve ruhsatın öngördüğü yerde durur. Yapı aksları ve temellerini, yol ve tesisat güzergâhlarını aplike eder, yapılanı kontrol ederiz.",
      kada: ["inşaatın başlangıcı", "yol, hat ve tesisat yapımı", "uygulama sırasında konum kontrolü"],
      dobijate: ["arazide işaretlenmiş nokta ve akslar", "aplikasyon tutanağı", "aşama aşama kontrol ölçümleri"] },
    gnss: { naziv: "GNSS ölçümleri ve jeodezik ağlar", kratko: "Büyük projeler için uydu ölçümü ve kalıcı nirengi noktaları.",
      opis: "Büyük şantiyeler, yollar ve tesisler için jeodezik bir ağ kurarız: sonraki tüm ölçümlerin dayandığı, hassas koordinatlı kalıcı noktalar. Koordinatları GNSS alıcılarıyla ulusal koordinat sisteminde belirleriz.",
      kada: ["büyük inşaat ve altyapı projeleri", "yer kontrol noktalı drone ölçümleri", "sürekli kontrol gerektiren uzun projeler"],
      dobijate: ["tesis edilmiş jeodezik ağ noktaları", "ulusal sistemde koordinatlar", "ölçüm ve doğruluk raporu"] },
  },
  ru: {
    principTekst: "Вы заранее знаете, что нужно, сколько это займёт и сколько стоит, без скрытых платежей.",
    onamaUvod: "GeoExpert работает в Подгорице более 13 лет. Мы работаем для частных лиц и организаций: владельцев, застройщиков, компаний и государственных учреждений по всей Черногории.",
    dioba: { naziv: "Раздел и объединение участков", kratko: "Раздел участка на несколько или объединение нескольких участков в один, с отчётом для кадастра.",
      opis: "Когда участок делят из-за наследства, продажи части или строительства, или несколько участков объединяют в один, новые границы нужно измерить, закрепить и зарегистрировать. Мы готовим отчёт о разделе или объединении и ведём его до внесения новых участков в выписку из кадастра.",
      kada: ["наследство и прекращение долевой собственности", "продажа части участка", "объединение соседних участков под строительство"],
      dobijate: ["отчёт о разделе или объединении для кадастра", "новые поворотные точки, закреплённые на местности", "сопровождение до регистрации"] },
    iskolcenje: { naziv: "Разбивка зданий и инфраструктуры", kratko: "Вынос проекта на местность: оси, фундаменты, дороги и сети.",
      opis: "До и во время строительства мы выносим проектные точки на местность, чтобы здание стояло именно там, где его предусматривают проект и разрешение. Мы разбиваем оси и фундаменты зданий, трассы дорог и инженерных сетей и контролируем выполненное.",
      kada: ["начало строительства", "строительство дорог, трубопроводов и сетей", "контроль положения в ходе работ"],
      dobijate: ["закреплённые на местности точки и оси", "акт разбивки", "контрольные измерения по этапам"] },
    gnss: { naziv: "GNSS-измерения и опорные сети", kratko: "Спутниковые измерения и постоянные опорные точки для крупных проектов.",
      opis: "Для крупных стройплощадок, дорог и комплексов мы создаём геодезическую опорную сеть: закреплённые точки с точными координатами, на которые опираются все дальнейшие измерения. Координаты определяются GNSS-приёмниками в государственной системе координат.",
      kada: ["крупные строительные и инфраструктурные проекты", "съёмка с дрона с опорными точками", "длительные проекты с постоянным контролем"],
      dobijate: ["закреплённые пункты опорной сети", "координаты в государственной системе", "отчёт об измерениях и точности"] },
  },
};

export function dodajDopune(L) {
  const d = D[L.lang];
  if (!d || L.dopune) return L;
  L.usluge = { ...L.usluge, dioba: d.dioba, iskolcenje: d.iskolcenje, gnss: d.gnss };
  L.grupe = L.grupe.map((g) => {
    if (g.usluge.includes("legalizacija")) return { ...g, usluge: [...g.usluge, "iskolcenje"] };
    if (g.usluge.includes("podloge")) return { ...g, usluge: [...g.usluge, "gnss"] };
    return g;
  });
  L.stav = { ...L.stav, principi: L.stav.principi.map((p, i) => (i === 1 ? [p[0], d.principTekst] : p)) };
  L.onama = { ...L.onama, uvod: d.onamaUvod };
  L.dopune = true;
  return L;
}
