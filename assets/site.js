(function () {
  "use strict";
  var doc = document.documentElement;
  var lang = (doc.lang || "me").slice(0, 2); if (lang === "sr") lang = "me";
  var redukovano = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SVI = {
    me: { dioba: "1853 dijeli se na 1853/1 i 1853/2", saljem: "Šaljem…", poslato: "Hvala. Poruka je poslata, javićemo vam se u toku radnog dana.", greska: "Poruka nije poslata. Pišite direktno na info@geoexpert.me ili pozovite +382 68 007 108.", fali: "Popunite ime, e-poštu i poruku." },
    en: { dioba: "1853 is split into 1853/1 and 1853/2", saljem: "Sending…", poslato: "Thank you. Your message was sent and we will reply within one working day.", greska: "The message was not sent. Write to info@geoexpert.me or call +382 68 007 108.", fali: "Fill in your name, email and message." },
    de: { dioba: "1853 wird in 1853/1 und 1853/2 geteilt", saljem: "Wird gesendet…", poslato: "Danke. Ihre Nachricht wurde gesendet, wir melden uns innerhalb eines Werktags.", greska: "Die Nachricht wurde nicht gesendet. Schreiben Sie an info@geoexpert.me oder rufen Sie +382 68 007 108 an.", fali: "Bitte Name, E-Mail und Nachricht ausfüllen." },
    tr: { dioba: "1853, 1853/1 ve 1853/2 olarak ifraz ediliyor", saljem: "Gönderiliyor…", poslato: "Teşekkürler. Mesajınız gönderildi, bir iş günü içinde dönüş yapacağız.", greska: "Mesaj gönderilemedi. info@geoexpert.me adresine yazın veya +382 68 007 108 numarasını arayın.", fali: "Adınızı, e-postanızı ve mesajınızı yazın." },
    ru: { dioba: "1853 делится на 1853/1 и 1853/2", saljem: "Отправка…", poslato: "Спасибо. Сообщение отправлено, мы ответим в течение рабочего дня.", greska: "Сообщение не отправлено. Напишите на info@geoexpert.me или позвоните +382 68 007 108.", fali: "Заполните имя, эл. почту и сообщение." }
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

  /* ---------- Viber: format linka po uređaju (provjereno na pravim telefonima) ----------
     iPhone: viber://contact?number=%2B...  |  Android: viber://chat?number=... (bez +)  |  računar: chat?number=%2B... */
  (function () {
    var ua = navigator.userAgent || "";
    var ios = /iPad|iPhone|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    var android = /Android/i.test(ua);
    if (!ios && !android) return;
    document.querySelectorAll('a[href^="viber://"]').forEach(function (a) {
      var broj = decodeURIComponent(a.getAttribute("href").split("number=")[1] || "").replace(/[^0-9]/g, "");
      if (!broj) return;
      a.setAttribute("href", ios ? "viber://contact?number=%2B" + broj : "viber://chat?number=" + broj);
    });
  })();

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
    // nijedna riječ ne smije biti šira od ekrana (naslov se ne dijeli crticom)
    while (heroH1.scrollWidth > heroH1.clientWidth + 1 && fs > 20 && n++ < 60) { fs -= 1; heroH1.style.fontSize = fs + "px"; }
  };
  if (heroH1) {
    uklopi();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(uklopi);
    var tU; window.addEventListener("resize", function () { clearTimeout(tU); tU = setTimeout(uklopi, 120); });
  }

  /* ---------- hero: 3D oblak tačaka terena ---------- */
  // Tri nivoa: puni WebGL; lakši WebGL na softverskom renderu; 2D crtanje bez WebGL-a ili kad je WebGL prespor.
  var platno = document.querySelector("canvas.oblak");
  var dijag = { webgl: "?", gpu: "-", nacin: "-", fps: 0 };
  var infoGPU = function () {
    try {
      var c = document.createElement("canvas");
      var gl = c.getContext("webgl") || c.getContext("experimental-webgl");
      if (!gl) return null;
      var ext = gl.getExtension("WEBGL_debug_renderer_info");
      var r = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
      var lose = gl.getExtension("WEBGL_lose_context"); if (lose) lose.loseContext();
      return String(r || "WebGL");
    } catch (e) { return null; }
  };
  var visinaT = function (x, z) {
    var r = Math.sqrt((x / 1.35) * (x / 1.35) + (z - 12) * (z - 12));
    var basen = Math.min(1, Math.max(0, (r - 22) / 72)); basen = basen * basen * (3 - 2 * basen);
    var n = fbm(x * 0.018 + 3, z * 0.018 + 7);
    var gr = 1 - Math.abs(2 * fbm(x * 0.04 + 11, z * 0.04 + 2) - 1);
    return basen * (14 + 38 * n + 26 * gr * gr) + 2.4 * fbm(x * 0.09, z * 0.09);
  };
  var RAMPA = [[0, [0.16, 0.32, 0.36]], [0.15, [0.24, 0.44, 0.46]], [0.42, [0.48, 0.56, 0.50]], [0.7, [0.82, 0.68, 0.42]], [1, [0.95, 0.93, 0.88]]];
  var bojaT = function (t) {
    for (var i = 1; i < RAMPA.length; i++) if (t <= RAMPA[i][0]) {
      var a = RAMPA[i - 1], b = RAMPA[i], k = (t - a[0]) / (b[0] - a[0]);
      return [a[1][0] + (b[1][0] - a[1][0]) * k, a[1][1] + (b[1][1] - a[1][1]) * k, a[1][2] + (b[1][2] - a[1][2]) * k];
    }
    return RAMPA[RAMPA.length - 1][1];
  };
  var oT = document.getElementById("o-t"), oY = document.getElementById("o-y"), oX = document.getElementById("o-x"), oH = document.getElementById("o-h");

  /* 2D verzija: ista scena, projekcija računata ručno */
  var oblak2D = function (zamijeni) {
    if (!platno) return;
    if (zamijeni) { var novi = platno.cloneNode(false); platno.parentNode.replaceChild(novi, platno); platno = novi; }
    var ctx = platno.getContext("2d");
    if (!ctx) { dijag.nacin = "bez prikaza"; return; }
    if (dijag.nacin === "-") dijag.nacin = "2d";
    var N = window.innerWidth < 760 ? 95 : 125, VEL = 220, n = N * N;
    var px = new Float32Array(n), py = new Float32Array(n), pz = new Float32Array(n), rr = new Float32Array(n), cr = new Uint8Array(n * 3);
    for (var iz = 0, i = 0; iz < N; iz++) for (var ix = 0; ix < N; ix++, i++) {
      var x = (ix / (N - 1) - 0.5) * VEL, z = (iz / (N - 1) - 0.5) * VEL, h = visinaT(x, z), c = bojaT(Math.min(1, h / 70));
      px[i] = x; py[i] = h; pz[i] = z; rr[i] = rnd();
      cr[i * 3] = c[0] * 255; cr[i * 3 + 1] = c[1] * 255; cr[i * 3 + 2] = c[2] * 255;
    }
    var kx = [6, 19, 31, 44, 55], kz = [-6, 6, 17, 29];
    var tacka = function (a, b) { return [kx[a] + Math.sin(a * 3.1 + b) * 1.6, kz[b] + Math.cos(a * 1.7 + b * 2.3) * 1.4]; };
    var linije = [];
    var gusto = function (tacke) {
      var out = [];
      for (var q = 0; q < tacke.length - 1; q++) for (var s2 = 0; s2 <= 10; s2++) {
        var t = s2 / 10, lx = tacke[q][0] + (tacke[q + 1][0] - tacke[q][0]) * t, lz = tacke[q][1] + (tacke[q + 1][1] - tacke[q][1]) * t;
        out.push([lx, visinaT(lx, lz) + 0.35, lz]);
      }
      return out;
    };
    for (var b = 0; b < kz.length; b++) { var red = []; for (var a = 0; a < kx.length; a++) red.push(tacka(a, b)); linije.push({ p: gusto(red), c: "203,170,107" }); }
    for (var a2 = 0; a2 < kx.length; a2++) { var kol = []; for (var b2 = 0; b2 < kz.length; b2++) kol.push(tacka(a2, b2)); linije.push({ p: gusto(kol), c: "203,170,107" }); }
    var d1 = tacka(1, 1), d2 = tacka(2, 1), e1 = tacka(1, 2), e2 = tacka(2, 2);
    linije.push({ p: gusto([[d1[0] + (d2[0] - d1[0]) * 0.55, d1[1] + (d2[1] - d1[1]) * 0.55], [e1[0] + (e2[0] - e1[0]) * 0.48, e1[1] + (e2[1] - e1[1]) * 0.48]]), c: "226,87,76" });

    var W = 0, H = 0;
    var vel = function () {
      var r = platno.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = r.width; H = r.height; platno.width = W * dpr; platno.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    vel(); window.addEventListener("resize", vel);
    var mis = { x: 0, y: 0, tx: 0, ty: 0 };
    window.addEventListener("pointermove", function (e) { mis.tx = e.clientX / window.innerWidth - 0.5; mis.ty = e.clientY / window.innerHeight - 0.5; }, { passive: true });

    var brT = 427, zadnje = 0;
    var crtaj = function (t) {
      mis.x += (mis.tx - mis.x) * 0.08; mis.y += (mis.ty - mis.y) * 0.08;
      var ug = -0.32 + Math.sin(t * 0.045) * 0.22 + mis.x * 0.18, R = 205, cx = 18, cy = 6, cz = -6;
      var ex = cx + Math.sin(ug) * R, ey = 74 - mis.y * 14, ez = cz + Math.cos(ug) * R;
      var fx = cx - ex, fy = cy - ey, fz = cz - ez, fl = Math.sqrt(fx * fx + fy * fy + fz * fz); fx /= fl; fy /= fl; fz /= fl;
      var rx = -fz, rz = fx, rl = Math.sqrt(rx * rx + rz * rz); rx /= rl; rz /= rl;
      var ux = -rz * fy, uy = rz * fx - rx * fz, uz = rx * fy;
      var F = (H / 2) / Math.tan((W / H < 1 ? 52 : 36) * Math.PI / 360);
      var scan = ((t * 16) % 240) - 120;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      for (var k = 0; k < n; k++) {
        var dx = px[k] - ex, dy = py[k] - ey, dz = pz[k] - ez;
        var zc = dx * fx + dy * fy + dz * fz;
        if (zc < 95) continue;
        var sx = W / 2 + (dx * rx + dz * rz) / zc * F, sy = H / 2 - (dx * ux + dy * uy + dz * uz) / zc * F;
        if (sx < -4 || sx > W + 4 || sy < -4 || sy > H + 4) continue;
        var fade = Math.min(1, (zc - 95) / 70); fade = fade * fade * (3 - 2 * fade);
        var sj = Math.max(0, 1 - Math.abs(pz[k] - scan) / 3.5);
        var al = (Math.min(1, Math.max(0.18, 1.35 - zc / 280)) * (0.55 + 0.45 * rr[k]) + sj * 0.9) * fade;
        if (al < 0.03) continue;
        var o = k * 3, rC = cr[o], gC = cr[o + 1], bC = cr[o + 2];
        if (sj > 0) { rC += (242 - rC) * sj; gC += (219 - gC) * sj; bC += (163 - bC) * sj; }
        ctx.fillStyle = "rgba(" + (rC | 0) + "," + (gC | 0) + "," + (bC | 0) + "," + Math.min(1, al).toFixed(2) + ")";
        var sz = Math.min(3.2, 2.3 * (170 / zc) * (1 + sj));
        ctx.fillRect(sx - sz / 2, sy - sz / 2, sz, sz);
      }
      ctx.lineWidth = 1;
      for (var L = 0; L < linije.length; L++) {
        var p = linije[L].p; ctx.beginPath(); var poceo = false;
        for (var m = 0; m < p.length; m++) {
          var qx = p[m][0] - ex, qy = p[m][1] - ey, qz = p[m][2] - ez, qc = qx * fx + qy * fy + qz * fz;
          if (qc < 1) continue;
          var X = W / 2 + (qx * rx + qz * rz) / qc * F, Y = H / 2 - (qx * ux + qy * uy + qz * uz) / qc * F;
          if (poceo) ctx.lineTo(X, Y); else { ctx.moveTo(X, Y); poceo = true; }
        }
        ctx.strokeStyle = "rgba(" + linije[L].c + ",.85)"; ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";
      if (t * 1000 - zadnje > 140) {
        zadnje = t * 1000;
        for (var pk = 0; pk < 40; pk++) {
          var kk = Math.floor(rnd() * n);
          if (Math.abs(pz[kk] - scan) < 3 && Math.abs(px[kk]) < 70) {
            brT = (brT % 9999) + 1;
            if (oT) oT.textContent = String(brT).padStart(4, "0");
            if (oY) oY.textContent = fmt(6603400 + px[kk] * 1.8);
            if (oX) oX.textContent = fmt(4700250 - pz[kk] * 1.8);
            if (oH) oH.textContent = fmt(41 + py[kk] * 4.2) + " m";
            break;
          }
        }
      }
    };
    if (redukovano) { crtaj(8.4); return; }
    var t0 = performance.now(), aktivan = true, vidljivo = true, br = 0, tFps = t0;
    var petlja = function () {
      if (!aktivan) return;
      var sad = performance.now();
      crtaj((sad - t0) / 1000);
      br++; if (sad - tFps > 1000) { dijag.fps = br; br = 0; tFps = sad; }
      setTimeout(function () { requestAnimationFrame(petlja); }, 1000 / 28);
    };
    petlja();
    var osvjezi2 = function () { var treba = vidljivo && !document.hidden; if (treba && !aktivan) { aktivan = true; petlja(); } else if (!treba) aktivan = false; };
    if ("IntersectionObserver" in window) new IntersectionObserver(function (u) { vidljivo = u[0].isIntersecting; osvjezi2(); }).observe(platno);
    document.addEventListener("visibilitychange", osvjezi2);
  };

  /* WebGL verzija (puna ili lakša na softverskom renderu) */
  var webglOblak = function (softver) {
    var THREE = window.THREE;
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: platno, antialias: false, alpha: true, powerPreference: "high-performance" }); }
    catch (e) { return false; }
    dijag.nacin = softver ? "webgl (softverski, lakši)" : "webgl";
    var mobilni = window.innerWidth < 760;
    var N = softver ? 110 : (mobilni ? 170 : 250), VEL = 220;
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
    var pr = softver ? 1 : Math.min(window.devicePixelRatio || 1, 1.75);
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
    var mjere = [], prosloV = 0, presao = false;
    var kadar = function (sad) {
      if (presao) return;
      if (prosloV) { mjere.push(sad - prosloV); if (mjere.length > 30) mjere.shift(); }
      prosloV = sad;
      if (mjere.length >= 30) {
        var pros = mjere.reduce(function (a, b) { return a + b; }, 0) / mjere.length;
        dijag.fps = Math.round(1000 / pros);
        if (pros > 55 && sad - t0 > 2500) { presao = true; aktivan = false; dijag.nacin = "2d (WebGL prespor)"; try { renderer.dispose(); } catch (e) {} oblak2D(true); return; }
      }
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
      else prosloV = 0;
    };
    if (redukovano) { uni.uScan.value = 20; kadar(t0); ocitaj(20); return true; }
    requestAnimationFrame(kadar);
    var vidljivo = true, pokaziStr = true;
    var osvjezi = function () {
      var treba = vidljivo && pokaziStr;
      if (presao) return;
      if (treba && !aktivan) { aktivan = true; prosloV = 0; mjere = []; requestAnimationFrame(kadar); } else if (!treba) aktivan = false;
    };
    if ("IntersectionObserver" in window) new IntersectionObserver(function (u) { vidljivo = u[0].isIntersecting; osvjezi(); }).observe(platno);
    document.addEventListener("visibilitychange", function () { pokaziStr = !document.hidden; osvjezi(); });
    return true;
  };

  /* ---------- hero: zeleni teren, plac sa međama i 3D geodetski dron (slabiji uređaji: oblak tačaka) ---------- */
  var webglPlac = function () {
    var THREE = window.THREE;
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: platno, antialias: true, alpha: true, powerPreference: "high-performance" }); }
    catch (e) { return false; }
    dijag.nacin = "webgl (plac + dron)";
    var mobilni = window.innerWidth < 760;
    var pr = Math.min(window.devicePixelRatio || 1, mobilni ? 1.75 : 1.5);
    var sjene = !mobilni;
    renderer.shadowMap.enabled = sjene;
    if (sjene) renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    var scena = new THREE.Scene();
    var POZ = 0x0b1820;
    scena.fog = new THREE.FogExp2(POZ, mobilni ? 0.0062 : 0.0055);

    // plac (u metrima, 1 jedinica = 1 m)
    var PLAC = [[-22, -15], [21, -19], [26, 11], [-3, 20], [-24, 8]];
    var unutra = function (x, z) {
      var c = false;
      for (var i = 0, j = PLAC.length - 1; i < PLAC.length; j = i++) {
        var xi = PLAC[i][0], zi = PLAC[i][1], xj = PLAC[j][0], zj = PLAC[j][1];
        if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) c = !c;
      }
      return c;
    };
    var dalj = function (x, z) {
      var m = 1e9;
      for (var i = 0, j = PLAC.length - 1; i < PLAC.length; j = i++) {
        var ax = PLAC[j][0], az = PLAC[j][1], bx = PLAC[i][0], bz = PLAC[i][1];
        var dx = bx - ax, dz = bz - az, t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
        var ex = ax + dx * t - x, ez = az + dz * t - z; m = Math.min(m, Math.sqrt(ex * ex + ez * ez));
      }
      return m;
    };

    // teren: blago brdovit, ravniji oko placa
    var visina = function (x, z) {
      var r = Math.sqrt(x * x + z * z);
      var ravno = Math.min(1, Math.max(0, (r - 30) / 90)); ravno = ravno * ravno * (3 - 2 * ravno);
      return ravno * (22 * fbm(x * 0.006 + 4, z * 0.006 + 9) + 10 * fbm(x * 0.017 + 1, z * 0.017 + 3)) + 1.2 * fbm(x * 0.05 + 7, z * 0.05 + 2) - 4;
    };
    // njive: zarotirana mreža parcela različitih kultura
    var KUT = 0.28, cK = Math.cos(KUT), sK = Math.sin(KUT);
    var NIJANSE = [[0.20, 0.36, 0.12], [0.26, 0.42, 0.15], [0.33, 0.45, 0.17], [0.42, 0.46, 0.20], [0.17, 0.30, 0.11], [0.38, 0.33, 0.20], [0.29, 0.40, 0.14]];
    var hash = function (a, b) { var s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
    var njiva = function (x, z) {
      var u = x * cK - z * sK, v = x * sK + z * cK;
      var su = 58, sv = 34;
      var iu = Math.floor(u / su), iv = Math.floor(v / sv + hash(iu, 3) * 0.6);
      var fu = u / su - iu, fv = (v / sv + hash(iu, 3) * 0.6) - iv;
      var rub = Math.min(fu, 1 - fu, fv, 1 - fv);
      return { id: hash(iu, iv), rub: rub, u: u, v: v };
    };

    var SEG = mobilni ? 150 : 220, VEL = 760;
    var tg = new THREE.PlaneGeometry(VEL, VEL, SEG, SEG);
    tg.rotateX(-Math.PI / 2);
    var tp = tg.attributes.position, tb = new Float32Array(tp.count * 3);
    var PUT_Z = 34; // seoski put pored placa
    for (var i = 0; i < tp.count; i++) {
      var x = tp.getX(i), z = tp.getZ(i), y = visina(x, z);
      tp.setY(i, y);
      var n = njiva(x, z), boja = NIJANSE[Math.floor(n.id * NIJANSE.length)];
      var sum = 0.82 + 0.36 * fbm(x * 0.09 + 5, z * 0.09 + 8);
      var redovi = 0.94 + 0.06 * Math.sin(n.v * 2.4);
      var r = boja[0] * sum * redovi, g = boja[1] * sum * redovi, b = boja[2] * sum * redovi;
      if (n.rub < 0.035) { r *= 0.62; g *= 0.72; b *= 0.6; } // međe njiva (živica)
      var d = dalj(x, z);
      if (unutra(x, z) || d < 1.2) { var s2 = (0.92 + 0.16 * fbm(x * 0.4, z * 0.4)) * (Math.floor((x + 40) / 3.2) % 2 ? 1.1 : 0.9); r = 0.34 * s2; g = 0.56 * s2; b = 0.2 * s2; } // pokošena trava na placu, u prugama
      var dpr = Math.abs(x - 6 - (z - 20) * 0.1); if (z > 18 && z < PUT_Z && dpr < 1.6) { var p0 = 0.42 + 0.05 * fbm(x * 0.6, z * 0.6); r = p0; g = p0 * 0.93; b = p0 * 0.8; } // prilaz od puta
      var dp = Math.abs(z - PUT_Z - Math.sin(x * 0.02) * 6);
      if (dp < 3.2) { var p = 0.38 + 0.06 * fbm(x * 0.5, z * 0.5); r = p; g = p * 0.95; b = p * 0.85; } // makadam
      else if (dp < 4.2) { r *= 0.8; g *= 0.85; b *= 0.75; }
      tb[i * 3] = r; tb[i * 3 + 1] = g; tb[i * 3 + 2] = b;
    }
    tg.setAttribute("color", new THREE.BufferAttribute(tb, 3));
    tg.computeVertexNormals();
    var travaTex = (function () {
      var c = document.createElement("canvas"); c.width = c.height = 256; var g = c.getContext("2d");
      g.fillStyle = "#b9b9b9"; g.fillRect(0, 0, 256, 256);
      for (var k = 0; k < 9000; k++) { var l = 120 + Math.floor(rnd() * 135); g.fillStyle = "rgb(" + l + "," + l + "," + l + ")"; var x = rnd() * 256, y = rnd() * 256; g.fillRect(x, y, 1 + rnd() * 1.5, 2 + rnd() * 4); }
      var tx = new THREE.CanvasTexture(c); tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(140, 140); tx.anisotropy = 8; tx.encoding = THREE.sRGBEncoding; return tx;
    })();
    var teren = new THREE.Mesh(tg, new THREE.MeshStandardMaterial({ vertexColors: true, map: travaTex, roughness: 0.97, metalness: 0 }));
    teren.receiveShadow = sjene;
    scena.add(teren);

    // drveće uz međe njiva i put
    var BR_DRV = mobilni ? 160 : 320;
    var drvG = new THREE.IcosahedronGeometry(1, 1);
    var drvM = new THREE.MeshStandardMaterial({ color: 0x1f3a1a, roughness: 1, flatShading: true });
    var drvo = new THREE.InstancedMesh(drvG, drvM, BR_DRV);
    var mt = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), ps = new THREE.Vector3();
    var postavljeno = 0, pokusaj = 0;
    while (postavljeno < BR_DRV && pokusaj++ < 20000) {
      var tx = (rnd() - 0.5) * 520, tz = (rnd() - 0.5) * 520;
      var nn = njiva(tx, tz);
      var uzPut = Math.abs(tz - PUT_Z - Math.sin(tx * 0.02) * 6) - 6.5;
      if (!(nn.rub < 0.03 || (uzPut > 0 && uzPut < 2.2 && rnd() < 0.6))) continue;
      if (dalj(tx, tz) < 24 || unutra(tx, tz)) continue;
      var vel = 1.8 + rnd() * 2.0;
      ps.set(tx, visina(tx, tz) + vel * 0.9, tz);
      sc.set(vel, vel * (1.1 + rnd() * 0.5), vel);
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rnd() * 6.28);
      mt.compose(ps, q, sc); drvo.setMatrixAt(postavljeno++, mt);
    }
    drvo.count = postavljeno;
    drvo.castShadow = sjene;
    scena.add(drvo);

    // svjetlo: kasno popodne
    scena.add(new THREE.HemisphereLight(0x9fb7c9, 0x1b2a14, 0.55));
    var sunce = new THREE.DirectionalLight(0xffd9a3, 1.6);
    sunce.position.set(-120, 140, 80);
    if (sjene) {
      sunce.castShadow = true;
      sunce.shadow.mapSize.set(2048, 2048);
      var sc2 = sunce.shadow.camera; sc2.left = -90; sc2.right = 90; sc2.top = 90; sc2.bottom = -90; sc2.near = 10; sc2.far = 420;
      sunce.shadow.bias = -0.0008; sunce.shadow.radius = 4;
    }
    scena.add(sunce);
    var kontra = new THREE.DirectionalLight(0xbcd3ff, 0.55); kontra.position.set(90, 60, -120); scena.add(kontra);

    // plac: prozirna zlatna površina sa mrežom, skeniranjem i otiskom kamere
    var minX = -24, maxX = 26, minZ = -19, maxZ = 20;
    var RED_K = 7, REDOVA = Math.ceil((maxZ - minZ) / RED_K) + 1, VIS = 17;
    var pg = new THREE.PlaneGeometry(maxX - minX + 4, maxZ - minZ + 4, 90, 70);
    pg.rotateX(-Math.PI / 2); pg.translate((minX + maxX) / 2, 0, (minZ + maxZ) / 2);
    var pp = pg.attributes.position;
    for (i = 0; i < pp.count; i++) pp.setY(i, visina(pp.getX(i), pp.getZ(i)) + 0.12);
    var polyU = []; for (i = 0; i < 5; i++) polyU.push(new THREE.Vector2(PLAC[i][0], PLAC[i][1]));
    var uniP = { uPoly: { value: polyU }, uDX: { value: 0 }, uDZ: { value: 0 }, uRed: { value: 0 }, uSmjer: { value: 1 }, uSken: { value: 1 }, uT: { value: 0 } };
    var placMat = new THREE.ShaderMaterial({
      uniforms: uniP, transparent: true, depthWrite: false,
      vertexShader: "varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",
      fragmentShader: [
        "uniform vec2 uPoly[5]; uniform float uDX, uDZ, uRed, uSmjer, uSken, uT; varying vec3 vW;",
        "bool unutra(vec2 p){ bool c=false; for(int i=0;i<5;i++){ int j = i==0?4:i-1; vec2 a=uPoly[i], b=uPoly[j];",
        "  if(((a.y>p.y)!=(b.y>p.y)) && (p.x < (b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)) c=!c; } return c; }",
        "void main(){ vec2 p = vW.xz; if(!unutra(p)) discard;",
        " float red = floor((p.y - (" + minZ.toFixed(1) + ")) / " + RED_K.toFixed(1) + " + 0.5);",
        " float preso = step(red + 0.5, uRed); float isti = step(abs(red-uRed),0.5);",
        " float prosao = uSmjer>0.0 ? step(p.x,uDX) : step(uDX,p.x);",
        " float snim = max(preso, isti*prosao*uSken);",
        " vec2 g = abs(fract(p/5.0)-0.5); float mreza = 1.0 - smoothstep(0.0, 0.06, min(g.x,g.y));",
        " float otisak = (1.0-smoothstep(4.5,5.5,abs(p.x-uDX))) * (1.0-smoothstep(3.5,4.5,abs(p.y-uDZ))) * uSken;",
        " vec3 zlato = vec3(0.86,0.70,0.42);",
        " float a = 0.03 + snim*0.09 + mreza*(0.02+snim*0.26) + otisak*0.26;",
        " gl_FragColor = vec4(mix(zlato, vec3(1.0,0.95,0.8), otisak), a); }"].join("\n")
    });
    scena.add(new THREE.Mesh(pg, placMat));

    // međe: zlatna linija po terenu + međni kamenovi
    var linija = [];
    for (i = 0; i < PLAC.length; i++) {
      var a = PLAC[i], b = PLAC[(i + 1) % PLAC.length];
      for (var s = 0; s < 24; s++) { var f = s / 24, lx = a[0] + (b[0] - a[0]) * f, lz = a[1] + (b[1] - a[1]) * f; linija.push(lx, visina(lx, lz) + 0.25, lz); }
    }
    linija.push(linija[0], linija[1], linija[2]);
    var lg = new THREE.BufferGeometry(); lg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linija), 3));
    scena.add(new THREE.Line(lg, new THREE.LineBasicMaterial({ color: 0xe9c98c })));
    var kamMat = new THREE.MeshStandardMaterial({ color: 0xeeeae2, roughness: 0.7 });
    var crvMat = new THREE.MeshBasicMaterial({ color: 0xe2574c });
    var prsteni = [];
    PLAC.forEach(function (t) {
      var y0 = visina(t[0], t[1]);
      var k = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.3, 0.28), new THREE.MeshStandardMaterial({ color: 0x9a7650, roughness: 0.9 })); k.position.set(t[0], y0 + 0.6, t[1]); k.castShadow = sjene; scena.add(k);
      var v = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), crvMat); v.position.set(t[0], y0 + 1.25, t[1]); scena.add(v);
      var pr2 = new THREE.Mesh(new THREE.RingGeometry(1.4, 1.65, 40), new THREE.MeshBasicMaterial({ color: 0xe9c98c, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false }));
      pr2.rotation.x = -Math.PI / 2; pr2.position.set(t[0], y0 + 0.2, t[1]); scena.add(pr2); prsteni.push(pr2);
    });

    // GNSS prijemnik na štapu (rover) kod jedne međe
    (function () {
      var rx = PLAC[1][0] - 1.6, rz = PLAC[1][1] + 1.2, ry = visina(rx, rz);
      var bijeM = new THREE.MeshStandardMaterial({ color: 0xe8e6e0, roughness: 0.5 }), zutM = new THREE.MeshStandardMaterial({ color: 0xd8a93a, roughness: 0.5 });
      for (var sgm = 0; sgm < 4; sgm++) { var st = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 8), sgm % 2 ? zutM : bijeM); st.position.set(rx, ry + 0.25 + sgm * 0.5, rz); st.castShadow = sjene; scena.add(st); }
      var pr = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.26, 24), new THREE.MeshStandardMaterial({ color: 0xd9dcdf, roughness: 0.4 })); pr.position.set(rx, ry + 2.15, rz); pr.castShadow = sjene; scena.add(pr);
      var kontr = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.45, 0.08), new THREE.MeshStandardMaterial({ color: 0x23282c, roughness: 0.5 })); kontr.position.set(rx + 0.1, ry + 1.35, rz - 0.12); scena.add(kontr);
      [0, 2.1, 4.2].forEach(function (u) { var n = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 6), zutM); n.position.set(rx + Math.cos(u) * 0.35, ry + 0.65, rz + Math.sin(u) * 0.35); n.rotation.set(Math.sin(u) * 0.45, 0, -Math.cos(u) * 0.45); scena.add(n); });
    })();

    // natpisi: dužine strana i površina (sprite sa platnom)
    var natpis = function (tekst, x, y, z, vel, istaknut) {
      var c = document.createElement("canvas"), cx = c.getContext("2d"), font = "500 44px Archivo, system-ui, sans-serif";
      cx.font = font; var w = Math.ceil(cx.measureText(tekst).width) + 40; c.width = w; c.height = 72;
      cx.font = font; cx.fillStyle = istaknut ? "rgba(203,170,107,.92)" : "rgba(9,17,23,.72)";
      var rr = 36; cx.beginPath(); cx.moveTo(rr, 0); cx.arcTo(w, 0, w, 72, rr); cx.arcTo(w, 72, 0, 72, rr); cx.arcTo(0, 72, 0, 0, rr); cx.arcTo(0, 0, w, 0, rr); cx.fill();
      cx.fillStyle = istaknut ? "#0b1820" : "#ece8df"; cx.textBaseline = "middle"; cx.fillText(tekst, 20, 38);
      var tex = new THREE.CanvasTexture(c); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 4;
      var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthWrite: false, transparent: true }));
      var vm = mobilni ? vel * 1.5 : vel; sp.scale.set(vm * w / 72, vm, 1); sp.position.set(x, y, z); scena.add(sp); return sp;
    };
    var fmtM = function (v) { return v.toFixed(2).replace(".", ",") + " m"; };
    var povrsina = 0;
    for (i = 0; i < PLAC.length; i++) {
      var p1 = PLAC[i], p2 = PLAC[(i + 1) % PLAC.length];
      povrsina += p1[0] * p2[1] - p2[0] * p1[1];
      var dx = p2[0] - p1[0], dz = p2[1] - p1[1], duz = Math.sqrt(dx * dx + dz * dz) * 1.0137;
      var mx = (p1[0] + p2[0]) / 2, mz = (p1[1] + p2[1]) / 2, nx = -dz / duz, nz = dx / duz;
      natpis(fmtM(duz), mx - nx * 4.2, visina(mx, mz) + 1.6, mz - nz * 4.2, 1.7, false);
    }
    povrsina = Math.abs(povrsina) / 2 * 1.0275;
    var pNatpis = natpis("P = " + Math.round(povrsina).toLocaleString("de-DE") + " m²", 1, visina(1, 1) + 2.2, 2, 2.3, true);

    // dron: originalni geodetski kvadrokopter (detaljniji model)
    var dron = new THREE.Group();
    var tijM = new THREE.MeshStandardMaterial({ color: 0x2f353b, roughness: 0.5, metalness: 0.25 });
    var tamM = new THREE.MeshStandardMaterial({ color: 0x1b1f23, roughness: 0.55, metalness: 0.3 });
    var karbonM = new THREE.MeshStandardMaterial({ color: 0x15181b, roughness: 0.35, metalness: 0.2 });
    var metM = new THREE.MeshStandardMaterial({ color: 0x8b939b, roughness: 0.3, metalness: 0.9 });
    var svM = new THREE.MeshStandardMaterial({ color: 0xdfe3e6, roughness: 0.4, metalness: 0.05 });
    var stakloM = new THREE.MeshStandardMaterial({ color: 0x0b1622, roughness: 0.08, metalness: 0.6, emissive: 0x0a1a2a });
    var dio = function (geo, mat, x, y, z, rod) { var m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = sjene; (rod || dron).add(m); return m; };
    // zaobljeno tijelo (izvučen zaobljeni pravougaonik sa zakošenim ivicama)
    var zaobljen = function (w, d, r) { var s = new THREE.Shape(), x = -w / 2, y = -d / 2;
      s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + d - r); s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
      s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; };
    var tijG = new THREE.ExtrudeGeometry(zaobljen(2.3, 3.6, 0.75), { depth: 0.55, bevelEnabled: true, bevelThickness: 0.22, bevelSize: 0.22, bevelSegments: 5, curveSegments: 10 });
    tijG.rotateX(-Math.PI / 2); tijG.translate(0, -0.3, 0);
    dio(tijG, tijM, 0, 0, 0);
    var donjiG = new THREE.ExtrudeGeometry(zaobljen(2.0, 3.2, 0.6), { depth: 0.25, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 3 });
    donjiG.rotateX(-Math.PI / 2); dio(donjiG, tamM, 0, -0.62, 0);
    // ventilacioni prorezi na vrhu
    for (var vi = 0; vi < 5; vi++) dio(new THREE.BoxGeometry(1.1, 0.04, 0.07), tamM, 0, 0.49, 0.85 + vi * 0.18);
    // GNSS antena (RTK) na stubiću
    dio(new THREE.CylinderGeometry(0.12, 0.14, 0.32, 10), tamM, 0, 0.62, 0.05);
    dio(new THREE.CylinderGeometry(0.88, 0.95, 0.24, 36), svM, 0, 0.86, 0.05);
    var kapa = dio(new THREE.SphereGeometry(0.88, 36, 10, 0, Math.PI * 2, 0, Math.PI / 2), svM, 0, 0.98, 0.05); kapa.scale.y = 0.28;
    var bljesak = dio(new THREE.SphereGeometry(0.09, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }), 0, 0.52, 1.35);
    // ruke, motori, elise
    var elise = [], navSvjetla = [];
    var diskTex = (function () { var c = document.createElement("canvas"); c.width = c.height = 128; var g = c.getContext("2d");
      var gr = g.createRadialGradient(64, 64, 6, 64, 64, 63); gr.addColorStop(0, "rgba(220,226,232,0)"); gr.addColorStop(0.25, "rgba(220,226,232,.10)"); gr.addColorStop(0.85, "rgba(220,226,232,.20)"); gr.addColorStop(1, "rgba(220,226,232,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
    var lopataS = new THREE.Shape(); lopataS.moveTo(0, -0.1); lopataS.bezierCurveTo(0.6, -0.22, 1.4, -0.2, 1.95, -0.06); lopataS.bezierCurveTo(2.0, 0, 2.0, 0.05, 1.9, 0.08); lopataS.bezierCurveTo(1.3, 0.14, 0.6, 0.16, 0, 0.1); lopataS.lineTo(0, -0.1);
    var lopataG = new THREE.ExtrudeGeometry(lopataS, { depth: 0.03, bevelEnabled: false }); lopataG.rotateX(-Math.PI / 2);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (sm, k) {
      var kx = sm[0] * 3.15, kz = sm[1] * 2.75, duz = Math.sqrt(kx * kx + kz * kz);
      var ruka = dio(new THREE.CylinderGeometry(0.14, 0.24, duz - 0.9, 14), tamM, kx * 0.53, 0.0, kz * 0.53);
      ruka.rotation.z = Math.PI / 2; ruka.rotation.y = -Math.atan2(kz, kx); ruka.rotateZ(-0.04);
      var motor = new THREE.Group(); motor.position.set(kx, 0.08, kz); dron.add(motor);
      dio(new THREE.CylinderGeometry(0.42, 0.48, 0.5, 24), tamM, 0, 0, 0, motor);
      for (var fi = 0; fi < 3; fi++) dio(new THREE.TorusGeometry(0.475, 0.012, 4, 24), tamM, 0, -0.12 + fi * 0.12, 0, motor).rotation.x = Math.PI / 2;
      dio(new THREE.CylinderGeometry(0.2, 0.2, 0.18, 16), metM, 0, 0.32, 0, motor);
      var el = new THREE.Group(); el.position.set(0, 0.42, 0); motor.add(el);
      for (var li = 0; li < 2; li++) { var lp = new THREE.Mesh(lopataG, karbonM); lp.rotation.y = li * Math.PI; lp.rotation.x = 0.12 * (li ? -1 : 1); el.add(lp); }
      var disk = new THREE.Mesh(new THREE.CircleGeometry(2.0, 40), new THREE.MeshBasicMaterial({ map: diskTex, transparent: true, depthWrite: false, side: THREE.DoubleSide }));
      disk.rotation.x = -Math.PI / 2; disk.position.y = 0.02; el.add(disk);
      elise.push(el);
      // navigaciona svjetla na krajevima ruku: naprijed zeleno, nazad crveno
      var nav = dio(new THREE.SphereGeometry(0.1, 8, 6), new THREE.MeshBasicMaterial({ color: sm[1] < 0 ? 0x5dff9a : 0xff4a3d }), 0, -0.3, 0, motor); navSvjetla.push(nav);
    });
    // nogari u obliku slova T
    [-1, 1].forEach(function (sx) {
      var n1 = dio(new THREE.CylinderGeometry(0.07, 0.09, 1.5, 8), tamM, sx * 1.05, -1.25, -0.9); n1.rotation.z = sx * 0.28;
      var n2 = dio(new THREE.CylinderGeometry(0.07, 0.09, 1.5, 8), tamM, sx * 1.05, -1.25, 0.9); n2.rotation.z = sx * 0.28;
      var sk = dio(new THREE.CylinderGeometry(0.09, 0.09, 3.2, 10), tamM, sx * 1.3, -1.95, 0); sk.rotation.x = Math.PI / 2;
    });
    // gimbal sa tri senzora
    var gimbal = new THREE.Group(); gimbal.position.set(0, -0.85, -1.55); gimbal.scale.setScalar(1.25); dron.add(gimbal);
    dio(new THREE.CylinderGeometry(0.12, 0.12, 0.35, 10), metM, 0, 0.25, 0, gimbal);
    var vil = dio(new THREE.BoxGeometry(1.25, 0.1, 0.4), tamM, 0, 0.05, 0, gimbal);
    var kuc = dio(new THREE.SphereGeometry(0.62, 24, 18), tijM, 0, -0.45, 0, gimbal); kuc.scale.set(1.05, 0.9, 0.95);
    dio(new THREE.CircleGeometry(0.42, 28), tamM, 0, -0.45, -0.6, gimbal).rotation.y = Math.PI;
    [[-0.18, -0.36, 0.15], [0.18, -0.36, 0.11], [0, -0.6, 0.09]].forEach(function (s) {
      var obod = dio(new THREE.CylinderGeometry(s[2] + 0.04, s[2] + 0.04, 0.08, 20), metM, s[0], s[1], -0.62, gimbal); obod.rotation.x = Math.PI / 2;
      var st = dio(new THREE.SphereGeometry(s[2], 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), stakloM, s[0], s[1], -0.65, gimbal); st.rotation.x = -Math.PI / 2; st.scale.y = 0.45;
    });
    var ledP = navSvjetla[0], ledZ = navSvjetla[2];
    dron.scale.setScalar(mobilni ? 1.95 : 1.45);
    scena.add(dron);

    // snop kamere
    var snopG = new THREE.BufferGeometry(); snopG.setAttribute("position", new THREE.BufferAttribute(new Float32Array(16 * 3), 3));
    var snop = new THREE.LineSegments(snopG, new THREE.LineBasicMaterial({ color: 0xe9c98c, transparent: true, opacity: 0.55 })); scena.add(snop);
    var piramG = new THREE.BufferGeometry(); piramG.setAttribute("position", new THREE.BufferAttribute(new Float32Array(4 * 3 * 3), 3));
    var piram = new THREE.Mesh(piramG, new THREE.MeshBasicMaterial({ color: 0xe9c98c, transparent: true, opacity: 0.07, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })); scena.add(piram);
    var snopP = snopG.attributes.position.array, piramP = piramG.attributes.position.array;
    var postaviSnop = function (sx, sy, sz, cx, cz, vidi) {
      var ug = [[-5, -4], [5, -4], [5, 4], [-5, 4]], k2 = [], o = 0, o2 = 0;
      ug.forEach(function (u) { k2.push([cx + u[0], visina(cx + u[0], cz + u[1]) + 0.3, cz + u[1]]); });
      for (var n2 = 0; n2 < 4; n2++) { var A = k2[n2], B = k2[(n2 + 1) % 4];
        snopP[o++] = sx; snopP[o++] = sy; snopP[o++] = sz; snopP[o++] = A[0]; snopP[o++] = A[1]; snopP[o++] = A[2];
        snopP[o++] = A[0]; snopP[o++] = A[1]; snopP[o++] = A[2]; snopP[o++] = B[0]; snopP[o++] = B[1]; snopP[o++] = B[2];
        piramP[o2++] = sx; piramP[o2++] = sy; piramP[o2++] = sz; piramP[o2++] = A[0]; piramP[o2++] = A[1]; piramP[o2++] = A[2]; piramP[o2++] = B[0]; piramP[o2++] = B[1]; piramP[o2++] = B[2]; }
      snopG.attributes.position.needsUpdate = true; piramG.attributes.position.needsUpdate = true;
      snop.visible = piram.visible = vidi;
    };

    // tok leta iznad placa (serpentina) + kratka pauza
    var RED_T = 3.4, OKRET_T = 1.0, CIKLUS = REDOVA * RED_T + (REDOVA - 1) * OKRET_T, PAUZA = 2.4;
    var X1 = minX + 3, X2 = maxX - 3;
    var stanje = function (t) {
      if (t >= CIKLUS) { var kr2 = (t - CIKLUS) / PAUZA, zz = minZ + (REDOVA - 1) * RED_K; var xx = ((REDOVA - 1) % 2 ? X1 : X2); return { x: xx + (0 - xx) * kr2, z: zz + (0 - zz) * kr2, red: REDOVA, sken: 0, smjer: 1, nagib: 0 }; }
      var per = RED_T + OKRET_T, rr = Math.floor(t / per), u = t - rr * per, lijevo = rr % 2 === 0;
      var a1 = lijevo ? X1 : X2, a2 = lijevo ? X2 : X1, zr = minZ + rr * RED_K;
      if (u < RED_T) { var f = u / RED_T; f = f * f * (3 - 2 * f) * 0.25 + f * 0.75; return { x: a1 + (a2 - a1) * f, z: zr, red: rr, sken: 1, smjer: lijevo ? 1 : -1, nagib: 1 }; }
      var g = (u - RED_T) / OKRET_T, ug2 = Math.PI * g;
      return { x: a2 + (lijevo ? 1 : -1) * Math.sin(ug2) * 3.5, z: zr + RED_K * (1 - Math.cos(ug2)) / 2, red: rr + 1, sken: 0, smjer: lijevo ? 1 : -1, nagib: 0.3 };
    };

    var kamera = new THREE.PerspectiveCamera(34, 1, 1, 900);
    var mis = { x: 0, y: 0, tx: 0, ty: 0 };
    var velicina = function () {
      var w = platno.clientWidth, h = platno.clientHeight; if (!w || !h) return;
      renderer.setPixelRatio(pr); renderer.setSize(w, h, false);
      kamera.aspect = w / h; kamera.fov = w / h < 1 ? 46 : 30;
      // scena gore desno (desktop) / gore (telefon), da tekst i dugmad ostanu na čistoj podlozi
      if (w / h >= 1) kamera.setViewOffset(w, h, -0.17 * w, 0.13 * h, w, h); else kamera.setViewOffset(w, h, 0, 0.17 * h, w, h);
      kamera.updateProjectionMatrix();
    };
    velicina(); window.addEventListener("resize", velicina);
    window.addEventListener("pointermove", function (e) { mis.tx = e.clientX / window.innerWidth - 0.5; mis.ty = e.clientY / window.innerHeight - 0.5; }, { passive: true });

    var oT = document.getElementById("o-t"), oY = document.getElementById("o-y"), oX = document.getElementById("o-x"), oH = document.getElementById("o-h");
    var brT = 427, zadnje = 0;
    var aktivan = true, t0 = performance.now(), pomak = new THREE.Vector3(), cilj = new THREE.Vector3();
    var kadar = function (sad) {
      var t = (sad - t0) / 1000, tc = t % (CIKLUS + PAUZA);
      var st = stanje(tc);
      var lebdi = Math.sin(t * 1.6) * 0.35;
      var dx2 = st.x, dz2 = st.z, dy = visina(dx2, dz2) + VIS + lebdi;
      dron.position.set(dx2, dy, dz2);
      dron.rotation.set(-0.06 * st.nagib, -Math.PI / 2 * st.smjer + Math.PI, 0);
      dron.rotation.z = 0; dron.rotation.x = 0;
      dron.rotateX(-0.05 * st.nagib);
      elise.forEach(function (e, k) { e.rotation.y = t * 9.3 * (k % 2 ? 1 : -1); });
      bljesak.visible = (t % 1.4) < 0.08 || ((t - 0.18) % 1.4 >= 0 && (t - 0.18) % 1.4 < 0.06);
      ledP.visible = ledZ.visible = true;
      uniP.uDX.value = dx2; uniP.uDZ.value = dz2; uniP.uRed.value = st.red; uniP.uSmjer.value = st.smjer; uniP.uSken.value = st.sken;
      postaviSnop(dx2, dy - 1.0, dz2, dx2, dz2, st.sken > 0);
      prsteni.forEach(function (p3, k) { var s3 = 1 + 0.25 * Math.sin(t * 2.4 + k); p3.scale.set(s3, s3, s3); p3.material.opacity = 0.9 - 0.5 * (s3 - 0.75); });
      pNatpis.material.opacity = 0.75 + 0.25 * Math.min(1, st.red / REDOVA);
      // kamera: kosi pogled, polako kruži, prati dron
      mis.x += (mis.tx - mis.x) * 0.04; mis.y += (mis.ty - mis.y) * 0.04;
      var siroko = kamera.aspect >= 1;
      var ug = 0.55 + Math.sin(t * 0.05) * 0.18 + mis.x * 0.15;
      var R = siroko ? 118 : 165;
      cilj.set(dx2 * 0.25, visina(0, 0) + 9, dz2 * 0.25);
      pomak.set(cilj.x + Math.sin(ug) * R, cilj.y + (siroko ? 66 : 105) - mis.y * 8, cilj.z + Math.cos(ug) * R);
      kamera.position.lerp(pomak, t < 0.1 ? 1 : 0.06);
      kamera.lookAt(cilj);
      renderer.render(scena, kamera);
      if (sad - zadnje > 160 && st.sken) {
        zadnje = sad; brT = (brT % 9999) + 1;
        if (oT) oT.textContent = String(brT).padStart(4, "0");
        if (oY) oY.textContent = fmt(6603400 + dx2 * 1.0);
        if (oX) oX.textContent = fmt(4700250 - dz2 * 1.0);
        if (oH) oH.textContent = fmt(41 + visina(dx2, dz2)) + " m";
      }
      if (aktivan && !redukovano) requestAnimationFrame(kadar);
    };
    if (redukovano) { t0 -= 6000; aktivan = false; kadar(performance.now()); return true; }
    requestAnimationFrame(kadar);
    var vidljivo = true, pokaziStr = true;
    var osvjezi = function () { var treba = vidljivo && pokaziStr; if (treba && !aktivan) { aktivan = true; requestAnimationFrame(kadar); } else if (!treba) aktivan = false; };
    if ("IntersectionObserver" in window) new IntersectionObserver(function (u) { vidljivo = u[0].isIntersecting; osvjezi(); }).observe(platno);
    document.addEventListener("visibilitychange", function () { pokaziStr = !document.hidden; osvjezi(); });
    return true;
  };

  var pokreniOblak = function () {
    if (!platno) return;
    var gpu = infoGPU();
    dijag.webgl = gpu === null ? "ne" : "da"; dijag.gpu = gpu || "-";
    var softver = !!gpu && /swiftshader|llvmpipe|softpipe|software|basic render/i.test(gpu);
    var dozvoliSoft = location.hash === "#dijag";
    if (gpu === null || !window.THREE) { oblak2D(false); return; }
    if ((!softver || dozvoliSoft) && webglPlac()) { document.documentElement.classList.add("hero-plac"); return; }
    if (!webglOblak(softver)) oblak2D(false);
  };
  /* ---------- dron: 3D snimanje terena (zamjenjuje 2D plan leta kad WebGL radi) ---------- */
  var dronOkvir = document.querySelector(".dron-plan .unutra");
  var pokreniDron = function () {
    if (!dronOkvir || redukovano || !window.THREE) return;
    var gpu = infoGPU();
    if (!gpu || (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(gpu) && location.hash !== "#dijag")) return; // slabiji uređaji zadržavaju 2D plan
    var THREE = window.THREE;
    var c = document.createElement("canvas");
    c.className = "dron-3d"; c.setAttribute("aria-hidden", "true");
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: c, antialias: true, alpha: true }); } catch (e) { return; }
    dronOkvir.appendChild(c);
    var hud = document.createElement("div");
    hud.className = "dron-hud"; hud.setAttribute("aria-hidden", "true");
    hud.innerHTML = '<span class="rec"></span>REC <b>0 %</b>';
    dronOkvir.appendChild(hud);
    var hudB = hud.querySelector("b");
    dronOkvir.parentNode.classList.add("ima-3d");

    var mob = window.innerWidth < 760;
    var NX = mob ? 110 : 150, NZ = mob ? 76 : 104, SX = 220, SZ = 152;
    var REDOVA = 7, S = 20, Z0 = -60, XA = -100, XB = 100, VIS = 36;
    var teren = function (x, z) {
      var n = fbm(x * 0.012 + 5, z * 0.012 + 1);
      var gr = 1 - Math.abs(2 * fbm(x * 0.03 + 8, z * 0.03 + 3) - 1);
      return 22 * n + 12 * gr * gr + 1.6 * fbm(x * 0.08, z * 0.08) - 14;
    };
    var uk = NX * NZ, poz = new Float32Array(uk * 3), boje = new Float32Array(uk * 3), sl = new Float32Array(uk);
    var rampa = [[0, [0.20, 0.40, 0.44]], [0.35, [0.30, 0.52, 0.52]], [0.6, [0.62, 0.62, 0.50]], [0.82, [0.86, 0.71, 0.44]], [1, [0.96, 0.93, 0.86]]];
    var k = 0, mn = 1e9, mx = -1e9, hs = new Float32Array(uk);
    for (var iz = 0; iz < NZ; iz++) for (var ix = 0; ix < NX; ix++) {
      var x = (ix / (NX - 1) - 0.5) * SX + (rnd() - 0.5) * 0.5, z = (iz / (NZ - 1) - 0.5) * SZ + (rnd() - 0.5) * 0.5;
      var h = teren(x, z); hs[k] = h; mn = Math.min(mn, h); mx = Math.max(mx, h);
      poz[k * 3] = x; poz[k * 3 + 1] = h; poz[k * 3 + 2] = z; sl[k] = rnd(); k++;
    }
    for (k = 0; k < uk; k++) {
      var tt = (hs[k] - mn) / (mx - mn);
      for (var r = 1; r < rampa.length; r++) if (tt <= rampa[r][0]) {
        var a = rampa[r - 1], b = rampa[r], q = (tt - a[0]) / (b[0] - a[0]);
        for (var cc = 0; cc < 3; cc++) boje[k * 3 + cc] = a[1][cc] + (b[1][cc] - a[1][cc]) * q;
        break;
      }
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(poz, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(boje, 3));
    geo.setAttribute("rnd", new THREE.BufferAttribute(sl, 1));
    var pr = Math.min(window.devicePixelRatio || 1, 1.75);
    var uni = { uRed: { value: 0 }, uDX: { value: XA }, uDZ: { value: Z0 }, uSmjer: { value: 1 }, uSkenira: { value: 1 }, uFade: { value: 1 }, uPR: { value: pr } };
    var mat = new THREE.ShaderMaterial({
      uniforms: uni, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true,
      vertexShader: [
        "attribute float rnd; uniform float uRed, uDX, uDZ, uSmjer, uSkenira, uFade, uPR;",
        "varying vec3 vC; varying float vA;",
        "void main(){",
        " vec4 mv = modelViewMatrix * vec4(position, 1.0);",
        " float red = floor((position.z - " + Z0.toFixed(1) + ") / " + S.toFixed(1) + " + 0.5);",
        " float preso = step(red + 0.5, uRed);",
        " float isti = step(abs(red - uRed), 0.5);",
        " float prosao = uSmjer > 0.0 ? step(position.x, uDX) : step(uDX, position.x);",
        " float snimljeno = max(preso, isti * prosao * uSkenira);",
        " float otisak = (1.0 - smoothstep(8.0, 11.0, abs(position.x - uDX))) * (1.0 - smoothstep(12.0, 15.0, abs(position.z - uDZ))) * uSkenira;",
        " vec3 sivo = vec3(0.34, 0.44, 0.48);",
        " vC = mix(sivo, color, snimljeno);",
        " vC = mix(vC * (1.0 + snimljeno * 0.25), vec3(1.0, 0.9, 0.66), otisak * 0.6);",
        " vA = (mix(0.2, 0.95, snimljeno) * (0.62 + 0.38 * rnd) + otisak * 0.45) * uFade;",
        " gl_PointSize = (1.6 + snimljeno * 0.7 + otisak * 0.8) * uPR * (250.0 / -mv.z);",
        " gl_Position = projectionMatrix * mv;",
        "}"].join("\n"),
      fragmentShader: [
        "varying vec3 vC; varying float vA;",
        "void main(){ vec2 c = gl_PointCoord - 0.5; float r = dot(c, c); if (r > 0.25) discard;",
        " gl_FragColor = vec4(vC * vA, 1.0) * (1.0 - smoothstep(0.06, 0.25, r)); }"].join("\n")
    });
    var scena = new THREE.Scene();
    scena.add(new THREE.Points(geo, mat));
    var linMat = function (boja, op) { return new THREE.LineBasicMaterial({ color: boja, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false }); };
    var linija = function (niz, mat, petlja) {
      var g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(niz), 3));
      var l = petlja ? new THREE.LineLoop(g, mat) : new THREE.Line(g, mat); scena.add(l); return l;
    };

    // putanja leta (serpentina) na visini leta
    var put = [], TURN = 8;
    for (var rr = 0; rr < REDOVA; rr++) {
      var zr = Z0 + rr * S, lijevo = rr % 2 === 0, x1 = lijevo ? XA : XB, x2 = lijevo ? XB : XA;
      for (var s = 0; s <= 40; s++) put.push(x1 + (x2 - x1) * s / 40, VIS, zr);
      if (rr < REDOVA - 1) for (var s2 = 1; s2 < TURN; s2++) { var ug = Math.PI * s2 / TURN, rx = x2 + (lijevo ? 1 : -1) * Math.sin(ug) * 7; put.push(rx, VIS, zr + S * (1 - Math.cos(ug)) / 2); }
    }
    linija(put, linMat(0xcbaa6b, 0.16));
    var trag = linija(put, linMat(0xcbaa6b, 0.75));
    var ukTacaka = put.length / 3;

    // kontrolne tačke na terenu
    [[-78, -48], [74, -40], [0, 4], [-70, 46], [80, 50]].forEach(function (p) {
      var tri = [], y = teren(p[0], p[1]) + 0.6;
      for (var i = 0; i < 3; i++) { var u = -Math.PI / 2 + i * 2 * Math.PI / 3; tri.push(p[0] + Math.cos(u) * 4.5, y, p[1] + Math.sin(u) * 4.5); }
      linija(tri, linMat(0xe2574c, 0.95), true);
    });

    // dron
    var dron = new THREE.Group(), dMat = linMat(0xece8df, 0.95);
    var ruke = [], krug = function (cx, cz, r) { var a = []; for (var i = 0; i < 24; i++) { var u = i / 24 * Math.PI * 2; a.push(cx + Math.cos(u) * r, 0, cz + Math.sin(u) * r); } return a; };
    var dodaj = function (niz, m, petlja) { var g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(niz), 3)); var l = petlja ? new THREE.LineLoop(g, m) : new THREE.Line(g, m); dron.add(l); return l; };
    dodaj([-6, 0, -6, 6, 0, 6], dMat); dodaj([6, 0, -6, -6, 0, 6], dMat);
    var elise = [];
    [[-6, -6], [6, -6], [-6, 6], [6, 6]].forEach(function (p) {
      dodaj(krug(p[0], p[1], 3.6), linMat(0xece8df, 0.55), true);
      var e = dodaj([-3.2, 0.2, 0, 3.2, 0.2, 0], linMat(0xece8df, 0.8)); e.position.set(p[0], 0, p[1]); e.geometry.translate(0, 0, 0); elise.push(e);
    });
    var tijelo = new THREE.Mesh(new THREE.BoxGeometry(5, 1.8, 5), new THREE.MeshBasicMaterial({ color: 0xcbaa6b }));
    dron.add(tijelo);
    scena.add(dron);

    // snop kamere: od drona do otiska na terenu
    var snopG = new THREE.BufferGeometry(); snopG.setAttribute("position", new THREE.BufferAttribute(new Float32Array(16 * 3), 3));
    var snop = new THREE.LineSegments(snopG, linMat(0xcbaa6b, 0.5)); scena.add(snop);
    var snopP = snopG.attributes.position.array;
    var postaviSnop = function (dx, dz, dy, vidi) {
      var ug = [[-10, -13], [10, -13], [10, 13], [-10, 13]], i = 0, kraj = [];
      ug.forEach(function (u) { kraj.push([dx + u[0], teren(dx + u[0], dz + u[1]) + 0.4, dz + u[1]]); });
      for (var n = 0; n < 4; n++) { var p = kraj[n], q = kraj[(n + 1) % 4];
        snopP[i++] = dx; snopP[i++] = dy - 1; snopP[i++] = dz; snopP[i++] = p[0]; snopP[i++] = p[1]; snopP[i++] = p[2];
        snopP[i++] = p[0]; snopP[i++] = p[1]; snopP[i++] = p[2]; snopP[i++] = q[0]; snopP[i++] = q[1]; snopP[i++] = q[2]; }
      snopG.attributes.position.needsUpdate = true; snop.visible = vidi;
    };

    var kamera = new THREE.PerspectiveCamera(34, 1, 1, 900);
    var velicina = function () {
      var w = c.clientWidth, h = c.clientHeight; if (!w || !h) return;
      renderer.setPixelRatio(pr); renderer.setSize(w, h, false);
      kamera.aspect = w / h; kamera.updateProjectionMatrix();
      udalj = w / h < 1.2 ? 300 : 258;
    };
    var udalj = 258;
    velicina(); window.addEventListener("resize", velicina);

    // tok misije: red = 2,6 s pravo + 0,7 s okret; na kraju pauza pa iznova
    var RED_T = 2.6, OKRET_T = 0.7, CIKLUS = REDOVA * RED_T + (REDOVA - 1) * OKRET_T, PAUZA = 2.6, FADE = 0.8;
    var stanje = function (t) {
      if (t >= CIKLUS) return { red: REDOVA, x: XB * (REDOVA % 2 ? 1 : -1) , z: Z0 + (REDOVA - 1) * S, sken: 0, napredak: 1, idx: ukTacaka, smjer: 1 };
      var per = RED_T + OKRET_T, rr = Math.floor(t / per), u = t - rr * per, lijevo = rr % 2 === 0;
      var x1 = lijevo ? XA : XB, x2 = lijevo ? XB : XA, zr = Z0 + rr * S;
      var baza = rr * (41 + TURN - 1);
      if (u < RED_T) {
        var f = u / RED_T; f = f * f * (3 - 2 * f) * 0.15 + f * 0.85;
        return { red: rr, x: x1 + (x2 - x1) * f, z: zr, sken: 1, napredak: (rr + f) / REDOVA, idx: baza + Math.round(f * 40), smjer: lijevo ? 1 : -1 };
      }
      var g = (u - RED_T) / OKRET_T, ug = Math.PI * g;
      return { red: rr, x: x2 + (lijevo ? 1 : -1) * Math.sin(ug) * 7, z: zr + S * (1 - Math.cos(ug)) / 2, sken: 0, napredak: (rr + 1) / REDOVA, idx: baza + 41 + Math.round(g * (TURN - 1)), smjer: lijevo ? 1 : -1, okret: true };
    };

    var aktivan = false, t0 = 0, pom = 0, prosli = 0;
    var kadar = function (sad) {
      if (!aktivan) return;
      if (!t0) t0 = sad;
      var t = ((sad - t0) / 1000) % (CIKLUS + PAUZA);
      var st = stanje(t);
      uni.uRed.value = st.okret ? st.red + 1 : st.red;
      uni.uDX.value = st.x; uni.uDZ.value = st.z; uni.uSmjer.value = st.smjer; uni.uSkenira.value = st.sken;
      uni.uFade.value = t > CIKLUS + PAUZA - FADE ? Math.max(0, (CIKLUS + PAUZA - t) / FADE) : (t < FADE * 0.6 ? 0.4 + 0.6 * t / (FADE * 0.6) : 1);
      trag.geometry.setDrawRange(0, Math.min(ukTacaka, st.idx + 1));
      var lebdi = Math.sin(sad / 420) * 0.6;
      dron.position.set(st.x, VIS + lebdi, st.z);
      dron.rotation.z = -st.smjer * 0.08 * st.sken; dron.rotation.y = st.okret ? 0 : 0;
      var sk = mob ? 1.25 : 1.1; dron.scale.set(sk, sk, sk);
      dron.visible = t < CIKLUS + 0.4;
      elise.forEach(function (e, i) { e.rotation.y = sad / 28 * (i % 2 ? 1 : -1); });
      postaviSnop(st.x, st.z, VIS + lebdi, st.sken > 0);
      var ug = 0.32 + Math.sin(sad / 1000 * 0.06) * 0.12;
      kamera.position.set(Math.sin(ug) * udalj, udalj * 0.95, Math.cos(ug) * udalj);
      kamera.lookAt(0, -12, 2);
      renderer.render(scena, kamera);
      if (sad - prosli > 120) { prosli = sad; hudB.textContent = Math.round(st.napredak * 100) + " %"; hud.classList.toggle("gotovo", st.napredak >= 1); }
      requestAnimationFrame(kadar);
    };
    var vidljivo = false, pokazi = !document.hidden;
    var osvjezi = function () { var treba = vidljivo && pokazi; if (treba && !aktivan) { aktivan = true; requestAnimationFrame(kadar); } else if (!treba) aktivan = false; };
    if ("IntersectionObserver" in window) new IntersectionObserver(function (u) { vidljivo = u[0].isIntersecting; osvjezi(); }, { threshold: 0.15 }).observe(c);
    else { vidljivo = true; osvjezi(); }
    document.addEventListener("visibilitychange", function () { pokazi = !document.hidden; osvjezi(); });
  };

  // three.js se učitava tek kad je stranica učitana i preglednik slobodan, da ne usporava prvi prikaz
  if (platno || dronOkvir) {
    var obaPokreni = function () { if (platno) pokreniOblak(); try { pokreniDron(); } catch (e) {} };
    var ucitajOblak = function () {
      if (window.THREE || !window.TRI_URL) { obaPokreni(); return; }
      var s = document.createElement("script");
      s.src = window.TRI_URL; s.async = true;
      s.onload = s.onerror = obaPokreni;
      document.head.appendChild(s);
    };
    var kadSlobodno = function () { (window.requestIdleCallback || function (f) { setTimeout(f, 300); })(ucitajOblak, { timeout: 2000 }); };
    if (document.readyState === "complete") kadSlobodno(); else window.addEventListener("load", kadSlobodno);
  }

  /* dijagnostika: otvoriti stranicu s #dijag na kraju adrese */
  if (location.hash === "#dijag") {
    var dp = document.createElement("div");
    dp.style.cssText = "position:fixed;left:12px;bottom:12px;z-index:99;max-width:min(92vw,520px);padding:12px 14px;background:rgba(9,17,23,.94);color:#ECE8DF;border:1px solid #CBAA6B;border-radius:10px;font:13px/1.5 monospace;white-space:pre-wrap";
    document.body.appendChild(dp);
    var pisi = function () {
      dp.textContent = "WebGL: " + dijag.webgl + "\nGPU: " + dijag.gpu + "\nNačin: " + dijag.nacin + "\nFPS: " + dijag.fps +
        "\nSmanjene animacije (OS): " + (redukovano ? "DA" : "ne") + "\nEkran: " + window.innerWidth + "x" + window.innerHeight + " @" + (window.devicePixelRatio || 1) +
        "\nPregledač: " + navigator.userAgent;
    };
    pisi(); setInterval(pisi, 1000);
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
    // crta se tek kad se korisnik približi, da ne opterećuje učitavanje stranice
    var nacrtano = new Set();
    var sve = function () { nacrtano.forEach(nacrtaj); };
    if ("IntersectionObserver" in window) {
      var ioI = new IntersectionObserver(function (u) {
        u.forEach(function (e) { if (e.isIntersecting && !nacrtano.has(e.target)) { nacrtano.add(e.target); nacrtaj(e.target); ioI.unobserve(e.target); } });
      }, { rootMargin: "400px 0px" });
      platna.forEach(function (c) { ioI.observe(c); });
    } else { platna.forEach(function (c) { nacrtano.add(c); }); sve(); }
    var tajmer;
    window.addEventListener("resize", function () { clearTimeout(tajmer); tajmer = setTimeout(sve, 200); });
  }

  /* ---------- mjerenje konverzija (za Google Analytics / Ads kad se uključe) ---------- */
  // Događaji idu u dataLayer; bez Google taga ništa se ne šalje i ne postavljaju se kolačići.
  var mjeri = function (dogadjaj, detalji) {
    try {
      var d = { event: dogadjaj, jezik: lang };
      for (var k in detalji) d[k] = detalji[k];
      (window.dataLayer = window.dataLayer || []).push(d);
      if (typeof window.gtag === "function") window.gtag("event", dogadjaj, detalji || {});
    } catch (e) {}
  };
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var h = a.getAttribute("href") || "", kanal = "";
    if (h.indexOf("tel:") === 0) kanal = "telefon";
    else if (h.indexOf("viber:") === 0) kanal = "viber";
    else if (h.indexOf("wa.me") > -1 || h.indexOf("whatsapp") > -1) kanal = "whatsapp";
    else if (h.indexOf("mailto:") === 0) kanal = "email";
    if (kanal) mjeri("kontakt_klik", { kanal: kanal, mjesto: a.closest(".hero") ? "hero" : a.closest(".poziv") ? "poziv" : a.closest(".zaglavlje") ? "zaglavlje" : a.closest(".podnozje") ? "podnozje" : "stranica" });
  }, true);

})();
