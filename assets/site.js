(function () {
  "use strict";
  var doc = document.documentElement;
  var lang = (doc.lang || "me").slice(0, 2); if (lang === "sr") lang = "me";
  var redukovano = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SVI = {
    me: { dioba: "1853 dijeli se na 1853/1 i 1853/2", saljem: "Šaljem…", poslato: "Hvala. Poruka je poslata, javićemo vam se u toku radnog dana.", greska: "Poruka nije poslata. Pišite direktno na geoexpertpg@gmail.com ili pozovite +382 68 007 108.", fali: "Popunite ime, e-poštu i poruku." },
    en: { dioba: "1853 is split into 1853/1 and 1853/2", saljem: "Sending…", poslato: "Thank you. Your message was sent and we will reply within one working day.", greska: "The message was not sent. Write to geoexpertpg@gmail.com or call +382 68 007 108.", fali: "Fill in your name, email and message." },
    de: { dioba: "1853 wird in 1853/1 und 1853/2 geteilt", saljem: "Wird gesendet…", poslato: "Danke. Ihre Nachricht wurde gesendet, wir melden uns innerhalb eines Werktags.", greska: "Die Nachricht wurde nicht gesendet. Schreiben Sie an geoexpertpg@gmail.com oder rufen Sie +382 68 007 108 an.", fali: "Bitte Name, E-Mail und Nachricht ausfüllen." },
    tr: { dioba: "1853, 1853/1 ve 1853/2 olarak ifraz ediliyor", saljem: "Gönderiliyor…", poslato: "Teşekkürler. Mesajınız gönderildi, bir iş günü içinde dönüş yapacağız.", greska: "Mesaj gönderilemedi. geoexpertpg@gmail.com adresine yazın veya +382 68 007 108 numarasını arayın.", fali: "Adınızı, e-postanızı ve mesajınızı yazın." },
    ru: { dioba: "1853 делится на 1853/1 и 1853/2", saljem: "Отправка…", poslato: "Спасибо. Сообщение отправлено, мы ответим в течение рабочего дня.", greska: "Сообщение не отправлено. Напишите на geoexpertpg@gmail.com или позвоните +382 68 007 108.", fali: "Заполните имя, эл. почту и сообщение." }
  };
  var T = SVI[lang] || SVI.en;
  var fmt = function (n, dec) {
    var s = n.toFixed(dec === undefined ? 2 : dec).split(".");
    var c = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return s[1] ? c + (lang === "en" ? "." : ",") + s[1] : c;
  };

  /* ---------- šum (zajednički za teren i izohipse) ---------- */
  var seed = 11;
  var rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  var G = 128, grid = new Float32Array(G * G);
  for (var gi = 0; gi < G * G; gi++) grid[gi] = rnd();
  var gl = function (t) { return t * t * (3 - 2 * t); };
  var sum = function (x, y) {
    var xi = Math.floor(x), yi = Math.floor(y), xf = gl(x - xi), yf = gl(y - yi);
    var g = function (a, b) { return grid[((b % G + G) % G) * G + ((a % G + G) % G)]; };
    var a = g(xi, yi) + (g(xi + 1, yi) - g(xi, yi)) * xf;
    var b = g(xi, yi + 1) + (g(xi + 1, yi + 1) - g(xi, yi + 1)) * xf;
    return a + (b - a) * yf;
  };
  var fbm = function (x, y) { return sum(x, y) * 0.5 + sum(x * 2.03 + 17, y * 2.03 + 9) * 0.27 + sum(x * 4.1 + 31, y * 4.1 + 5) * 0.15 + sum(x * 8.3 + 3, y * 8.3 + 41) * 0.08; };

  /* ---------- zaglavlje ---------- */
  var zag = document.querySelector(".zaglavlje");
  if (zag) {
    var naSkrol = function () { zag.classList.toggle("skrol", window.scrollY > 24); };
    window.addEventListener("scroll", naSkrol, { passive: true }); naSkrol();
  }
  var dugme = document.querySelector(".meni-dugme");
  var nav = document.querySelector(".nav");
  if (dugme && nav) {
    dugme.addEventListener("click", function () {
      var o = nav.classList.toggle("otvoren");
      zag.classList.toggle("otvoren-meni", o);
      dugme.setAttribute("aria-expanded", o ? "true" : "false");
    });
  }

  /* ---------- izbor jezika na telefonu ---------- */
  var jd = document.querySelector(".jezik-dugme"), jl = document.getElementById("jezik-lista");
  if (jd && jl) {
    var zatvoriJ = function () { jl.hidden = true; jd.setAttribute("aria-expanded", "false"); };
    jd.addEventListener("click", function (e) {
      e.stopPropagation();
      var otvori = jl.hidden;
      jl.hidden = !otvori; jd.setAttribute("aria-expanded", otvori ? "true" : "false");
      if (otvori && nav && nav.classList.contains("otvoren")) dugme.click();
    });
    document.addEventListener("click", function (e) { if (!jl.hidden && !jl.contains(e.target)) zatvoriJ(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !jl.hidden) { zatvoriJ(); jd.focus(); } });
    if (dugme) dugme.addEventListener("click", zatvoriJ);
  }

  /* ---------- hero: naslov uvijek staje na prvi ekran ---------- */
  var hero = document.querySelector(".hero"), heroH1 = hero && hero.querySelector("h1");
  var uklopi = function () {
    if (!heroH1) return;
    heroH1.style.fontSize = "";
    var fs = parseFloat(getComputedStyle(heroH1).fontSize), min = window.innerWidth < 600 ? 26 : 32, n = 0;
    var dno = function () { var d = hero.querySelector(".hero-dole"); return d.getBoundingClientRect().bottom + window.scrollY; };
    var granica = function () { return Math.max(window.innerHeight, 520) - 12; };
    while (dno() > granica() && fs > min && n++ < 40) { fs -= 2; heroH1.style.fontSize = fs + "px"; }
  };
  if (heroH1) {
    uklopi();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(uklopi);
    var tU; window.addEventListener("resize", function () { clearTimeout(tU); tU = setTimeout(uklopi, 120); });
  }

  /* ---------- hero: 3D oblak tačaka terena ---------- */
  var platno = document.querySelector("canvas.oblak");
  var pokreniOblak = function () {
    if (!platno || !window.THREE) return;
    var THREE = window.THREE;
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: platno, antialias: false, alpha: true, powerPreference: "high-performance" }); }
    catch (e) { return; }
    var mobilni = window.innerWidth < 760;
    var N = mobilni ? 170 : 250, VEL = 220;
    var visina = function (x, z) {
      var r = Math.sqrt((x / 1.35) * (x / 1.35) + (z - 12) * (z - 12));
      var basen = Math.min(1, Math.max(0, (r - 22) / 72)); basen = basen * basen * (3 - 2 * basen);
      var n = fbm(x * 0.018 + 3, z * 0.018 + 7);
      var gr = 1 - Math.abs(2 * fbm(x * 0.04 + 11, z * 0.04 + 2) - 1);
      return basen * (14 + 38 * n + 26 * gr * gr) + 2.4 * fbm(x * 0.09, z * 0.09);
    };
    var ukupno = N * N;
    var poz = new Float32Array(ukupno * 3), boje = new Float32Array(ukupno * 3), slucajno = new Float32Array(ukupno);
    var rampa = [[0, [0.16, 0.32, 0.36]], [0.15, [0.24, 0.44, 0.46]], [0.42, [0.48, 0.56, 0.50]], [0.7, [0.82, 0.68, 0.42]], [1, [0.95, 0.93, 0.88]]];
    var boja = function (t, out, o) {
      for (var i = 1; i < rampa.length; i++) if (t <= rampa[i][0]) {
        var a = rampa[i - 1], b = rampa[i], k = (t - a[0]) / (b[0] - a[0]);
        out[o] = a[1][0] + (b[1][0] - a[1][0]) * k; out[o + 1] = a[1][1] + (b[1][1] - a[1][1]) * k; out[o + 2] = a[1][2] + (b[1][2] - a[1][2]) * k; return;
      }
    };
    var i3 = 0, maxH = 70;
    for (var iz = 0; iz < N; iz++) for (var ix = 0; ix < N; ix++) {
      var x = (ix / (N - 1) - 0.5) * VEL + (rnd() - 0.5) * 0.25;
      var z = (iz / (N - 1) - 0.5) * VEL + (rnd() - 0.5) * 0.6;
      var h = visina(x, z);
      poz[i3] = x; poz[i3 + 1] = h; poz[i3 + 2] = z;
      boja(Math.min(1, h / maxH), boje, i3);
      slucajno[i3 / 3] = rnd();
      i3 += 3;
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(poz, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(boje, 3));
    geo.setAttribute("rnd", new THREE.BufferAttribute(slucajno, 1));
    var pr = Math.min(window.devicePixelRatio || 1, 1.75);
    var uni = { uScan: { value: -110 }, uSize: { value: mobilni ? 2.6 : 2.5 }, uPR: { value: pr } };
    var mat = new THREE.ShaderMaterial({
      uniforms: uni, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true,
      vertexShader: [
        "attribute float rnd; uniform float uScan; uniform float uSize; uniform float uPR;",
        "varying vec3 vC; varying float vA;",
        "void main(){",
        " vec4 mv = modelViewMatrix * vec4(position, 1.0);",
        " float d = abs(position.z - uScan);",
        " float sjaj = smoothstep(3.5, 0.0, d);",
        " float trag = smoothstep(26.0, 0.0, uScan - position.z) * step(position.z, uScan);",
        " vC = mix(color, vec3(0.95, 0.86, 0.64), sjaj * 0.9);",
        " float dist = -mv.z;",
        " vA = clamp(1.35 - dist / 280.0, 0.18, 1.0) * (0.55 + 0.45 * rnd) + sjaj * 0.9 + trag * 0.18;",
        " vA *= smoothstep(95.0, 165.0, dist);",
        " gl_PointSize = min(uSize * uPR * (1.0 + sjaj * 1.2) * (170.0 / dist), 3.4 * uPR);",
        " gl_Position = projectionMatrix * mv;",
        "}"].join("\n"),
      fragmentShader: [
        "varying vec3 vC; varying float vA;",
        "void main(){ vec2 c = gl_PointCoord - 0.5; float r = dot(c, c); if (r > 0.25) discard;",
        " gl_FragColor = vec4(vC * vA, 1.0) * (1.0 - smoothstep(0.08, 0.25, r)); }"].join("\n")
    });
    var scena = new THREE.Scene();
    var oblak = new THREE.Points(geo, mat);
    scena.add(oblak);

    // katastarske parcele prebačene na teren
    var lin = function (tacke, bojaHex, prozirnost) {
      var arr = [];
      for (var i = 0; i < tacke.length - 1; i++) {
        var a = tacke[i], b = tacke[i + 1];
        for (var s = 0; s <= 12; s++) {
          var t = s / 12, px = a[0] + (b[0] - a[0]) * t, pz = a[1] + (b[1] - a[1]) * t;
          arr.push(px, visina(px, pz) + 0.35, pz);
        }
      }
      var g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(arr), 3));
      var l = new THREE.Line(g, new THREE.LineBasicMaterial({ color: bojaHex, transparent: true, opacity: prozirnost, blending: THREE.AdditiveBlending, depthWrite: false }));
      scena.add(l); return l;
    };
    var kx = [6, 19, 31, 44, 55], kz = [-6, 6, 17, 29];
    var tacka = function (i, j) { return [kx[i] + Math.sin(i * 3.1 + j) * 1.6, kz[j] + Math.cos(i * 1.7 + j * 2.3) * 1.4]; };
    for (var j = 0; j < kz.length; j++) { var red = []; for (var i = 0; i < kx.length; i++) red.push(tacka(i, j)); lin(red, 0xcbaa6b, 0.9); }
    for (var i2 = 0; i2 < kx.length; i2++) { var kol = []; for (var j2 = 0; j2 < kz.length; j2++) kol.push(tacka(i2, j2)); lin(kol, 0xcbaa6b, 0.9); }
    var a1 = tacka(1, 1), a2 = tacka(2, 1), b1 = tacka(1, 2), b2 = tacka(2, 2);
    var dioba = lin([[a1[0] + (a2[0] - a1[0]) * 0.55, a1[1] + (a2[1] - a1[1]) * 0.55], [b1[0] + (b2[0] - b1[0]) * 0.48, b1[1] + (b2[1] - b1[1]) * 0.48]], 0xe2574c, 1);

    var kamera = new THREE.PerspectiveCamera(36, 1, 1, 600);
    var cilj = new THREE.Vector3(18, 6, -6);
    var mis = { x: 0, y: 0, tx: 0, ty: 0 };
    var velicina = function () {
      var w = platno.clientWidth, h = platno.clientHeight;
      renderer.setPixelRatio(pr); renderer.setSize(w, h, false);
      kamera.aspect = w / h;
      kamera.fov = w / h < 1 ? 52 : 36;
      kamera.updateProjectionMatrix();
    };
    velicina();
    window.addEventListener("resize", velicina);
    window.addEventListener("pointermove", function (e) { mis.tx = e.clientX / window.innerWidth - 0.5; mis.ty = e.clientY / window.innerHeight - 0.5; }, { passive: true });

    var oT = document.getElementById("o-t"), oY = document.getElementById("o-y"), oX = document.getElementById("o-x"), oH = document.getElementById("o-h");
    var zadnje = 0, brT = 427;
    var ocitaj = function (scan) {
      for (var p = 0; p < 40; p++) {
        var k = Math.floor(rnd() * ukupno) * 3;
        if (Math.abs(poz[k + 2] - scan) < 3 && Math.abs(poz[k]) < 70) {
          brT = (brT % 9999) + 1;
          if (oT) oT.textContent = String(brT).padStart(4, "0");
          if (oY) oY.textContent = fmt(6603400 + poz[k] * 1.8);
          if (oX) oX.textContent = fmt(4700250 - poz[k + 2] * 1.8);
          if (oH) oH.textContent = fmt(41 + poz[k + 1] * 4.2) + " m";
          return;
        }
      }
    };

    var aktivan = true, t0 = performance.now();
    var kadar = function (sad) {
      var t = (sad - t0) / 1000;
      mis.x += (mis.tx - mis.x) * 0.04; mis.y += (mis.ty - mis.y) * 0.04;
      var ug = -0.32 + Math.sin(t * 0.045) * 0.22 + mis.x * 0.18;
      var r = 205;
      kamera.position.set(cilj.x + Math.sin(ug) * r, 74 - mis.y * 14, cilj.z + Math.cos(ug) * r);
      kamera.lookAt(cilj);
      var scan = ((t * 16) % 240) - 120;
      uni.uScan.value = scan;
      dioba.material.opacity = 0.65 + Math.sin(t * 2.2) * 0.35;
      renderer.render(scena, kamera);
      if (sad - zadnje > 140) { zadnje = sad; ocitaj(scan); }
      if (aktivan && !redukovano) requestAnimationFrame(kadar);
    };
    if (redukovano) { uni.uScan.value = 20; kadar(t0); ocitaj(20); return; }
    requestAnimationFrame(kadar);
    var vidljivo = true, pokaziStr = true;
    var osvjezi = function () {
      var treba = vidljivo && pokaziStr;
      if (treba && !aktivan) { aktivan = true; requestAnimationFrame(kadar); } else if (!treba) aktivan = false;
    };
    if ("IntersectionObserver" in window) new IntersectionObserver(function (u) { vidljivo = u[0].isIntersecting; osvjezi(); }).observe(platno);
    document.addEventListener("visibilitychange", function () { pokaziStr = !document.hidden; osvjezi(); });
  };
  if (platno) {
    if (window.THREE) pokreniOblak();
    else window.addEventListener("load", pokreniOblak);
  }

  /* ---------- katastarski plan ---------- */
  var plan = document.querySelector(".plan");
  if (plan) {
    if (!redukovano) {
      plan.classList.add("crta");
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (u) { if (u[0].isIntersecting) { plan.classList.add("vidljiv"); io.disconnect(); } }, { threshold: 0.35 });
        io.observe(plan);
      } else plan.classList.add("vidljiv");
    } else plan.classList.add("vidljiv");
    var M = 0.12, Y0 = 6603400, X0 = 4700300;
    var outY = document.getElementById("kursor-y"), outX = document.getElementById("kursor-x"), outP = document.getElementById("parcela-info");
    var nisan = plan.querySelector(".nisan");
    var hl = nisan && nisan.querySelector(".h"), vl = nisan && nisan.querySelector(".v");
    var pt = plan.createSVGPoint();
    plan.addEventListener("pointermove", function (e) {
      pt.x = e.clientX; pt.y = e.clientY;
      var p = pt.matrixTransform(plan.getScreenCTM().inverse());
      if (outY) outY.textContent = "Y " + fmt(Y0 + p.x * M);
      if (outX) outX.textContent = "X " + fmt(X0 - p.y * M);
      if (hl) { hl.setAttribute("y1", p.y); hl.setAttribute("y2", p.y); vl.setAttribute("x1", p.x); vl.setAttribute("x2", p.x); }
      plan.classList.add("nisani");
    });
    plan.addEventListener("pointerleave", function () {
      plan.classList.remove("nisani");
      plan.querySelectorAll(".parcela.aktivna").forEach(function (el) { el.classList.remove("aktivna"); });
      if (outP) outP.textContent = T.dioba;
    });
    var povrsina = function (poly) {
      var a = 0, pts = poly.points;
      for (var i = 0; i < pts.numberOfItems; i++) {
        var p1 = pts.getItem(i), p2 = pts.getItem((i + 1) % pts.numberOfItems);
        a += p1.x * p2.y - p2.x * p1.y;
      }
      return Math.abs(a / 2) * M * M;
    };
    plan.querySelectorAll(".parcela").forEach(function (el) {
      el.addEventListener("pointerenter", function () {
        plan.querySelectorAll(".parcela.aktivna").forEach(function (x) { x.classList.remove("aktivna"); });
        el.classList.add("aktivna");
        if (outP) outP.textContent = el.getAttribute("data-br") + "   P = " + fmt(povrsina(el), 0) + " m²";
      });
    });
  }

  /* ---------- plan leta: animacija kad se pojavi ---------- */
  var pl = document.querySelector(".plan-leta");
  if (pl && !redukovano && "IntersectionObserver" in window) {
    var ioL = new IntersectionObserver(function (u) { if (u[0].isIntersecting) { pl.classList.add("leti"); ioL.disconnect(); } }, { threshold: 0.4 });
    ioL.observe(pl);
  }

  /* ---------- izohipse u pozivu na kontakt ---------- */
  var platna = document.querySelectorAll("canvas.izohipse");
  if (platna.length) {
    var nacrtaj = function (c) {
      var r = c.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (!r.width) return;
      c.width = r.width * dpr; c.height = r.height * dpr;
      var ctx = c.getContext("2d"); ctx.scale(dpr, dpr);
      ctx.strokeStyle = getComputedStyle(c).color; ctx.lineJoin = "round";
      var korak = 9, nx = Math.ceil(r.width / korak) + 1, ny = Math.ceil(r.height / korak) + 1;
      var v = new Float32Array(nx * ny);
      for (var y = 0; y < ny; y++) for (var x = 0; x < nx; x++) v[y * nx + x] = fbm(x * korak / 320 + 4, y * korak / 320 + 2);
      for (var n = 0; n < 26; n++) {
        var nivo = 0.22 + n * 0.022;
        ctx.lineWidth = n % 5 === 0 ? 1 : 0.5; ctx.globalAlpha = n % 5 === 0 ? 0.7 : 0.35;
        ctx.beginPath();
        for (var yy = 0; yy < ny - 1; yy++) for (var xx = 0; xx < nx - 1; xx++) {
          var a = v[yy * nx + xx], b = v[yy * nx + xx + 1], cc = v[(yy + 1) * nx + xx + 1], d = v[(yy + 1) * nx + xx];
          var k = (a > nivo ? 8 : 0) | (b > nivo ? 4 : 0) | (cc > nivo ? 2 : 0) | (d > nivo ? 1 : 0);
          if (k === 0 || k === 15) continue;
          var X = xx * korak, Y = yy * korak;
          var t = function (p, q) { return (nivo - p) / (q - p); };
          var top = [X + korak * t(a, b), Y], right = [X + korak, Y + korak * t(b, cc)];
          var bot = [X + korak * t(d, cc), Y + korak], left = [X, Y + korak * t(a, d)];
          var seg = function (p, q) { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); };
          switch (k) {
            case 1: case 14: seg(left, bot); break;
            case 2: case 13: seg(bot, right); break;
            case 3: case 12: seg(left, right); break;
            case 4: case 11: seg(top, right); break;
            case 6: case 9: seg(top, bot); break;
            case 7: case 8: seg(left, top); break;
            case 5: seg(left, top); seg(bot, right); break;
            case 10: seg(top, right); seg(left, bot); break;
          }
        }
        ctx.stroke();
      }
    };
    var sve = function () { platna.forEach(nacrtaj); };
    sve();
    var tajmer;
    window.addEventListener("resize", function () { clearTimeout(tajmer); tajmer = setTimeout(sve, 200); });
  }

  /* ---------- kontakt forma ---------- */
  var forma = document.querySelector("form.forma");
  if (forma) {
    var status = forma.querySelector(".status");
    forma.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(forma);
      if (!fd.get("ime") || !fd.get("email") || !fd.get("poruka")) { status.textContent = T.fali; status.classList.add("greska"); return; }
      status.classList.remove("greska"); status.textContent = T.saljem;
      var btn = forma.querySelector("button"); btn.disabled = true;
      var podaci = {}; fd.forEach(function (v, k) { podaci[k] = v; }); podaci.jezik = lang;
      fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(podaci) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function () { status.textContent = T.poslato; forma.reset(); })
        .catch(function () { status.textContent = T.greska; status.classList.add("greska"); })
        .then(function () { btn.disabled = false; });
    });
  }
})();
