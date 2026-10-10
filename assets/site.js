(function () {
  "use strict";
  var doc = document.documentElement;
  var lang = doc.lang === "en" ? "en" : "me";
  var T = {
    me: { parcela: "Parcela", povrsina: "Površina", dioba: "1853 dijeli se na 1853/1 i 1853/2", saljem: "Šaljem…", poslato: "Hvala. Poruka je poslata, javićemo vam se u toku radnog dana.", greska: "Poruka nije poslata. Pišite direktno na geoexpertpg@gmail.com ili pozovite +382 68 007 108.", fali: "Popunite ime, e-poštu i poruku." },
    en: { parcela: "Parcel", povrsina: "Area", dioba: "1853 is split into 1853/1 and 1853/2", saljem: "Sending…", poslato: "Thank you. Your message was sent and we will reply within one working day.", greska: "The message was not sent. Write to geoexpertpg@gmail.com or call +382 68 007 108.", fali: "Fill in your name, email and message." }
  }[lang];

  /* zaglavlje */
  var zag = document.querySelector(".zaglavlje");
  if (zag) {
    var naSkrol = function () { zag.classList.toggle("skrol", window.scrollY > 8); };
    window.addEventListener("scroll", naSkrol, { passive: true }); naSkrol();
  }
  var dugme = document.querySelector(".meni-dugme");
  var nav = document.querySelector(".nav");
  if (dugme && nav) {
    dugme.addEventListener("click", function () {
      var o = nav.classList.toggle("otvoren");
      dugme.setAttribute("aria-expanded", o ? "true" : "false");
    });
  }

  /* katastarski plan */
  var plan = document.querySelector(".plan");
  if (plan) {
    var redukovano = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!redukovano) plan.classList.add("crta");
    var M = 0.12, Y0 = 6603400, X0 = 4700300; // 1 jedinica = 0,12 m; Gauss-Krüger zona 6
    var fmt = function (n) {
      var s = n.toFixed(2).split(".");
      var c = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      return c + (lang === "en" ? "." : ",") + s[1];
    };
    var outY = document.getElementById("kursor-y");
    var outX = document.getElementById("kursor-x");
    var outP = document.getElementById("parcela-info");
    var nisan = plan.querySelector(".nisan");
    var hl = nisan && nisan.querySelector(".h"), vl = nisan && nisan.querySelector(".v");
    var pt = plan.createSVGPoint();
    var tacka = function (e) {
      pt.x = e.clientX; pt.y = e.clientY;
      return pt.matrixTransform(plan.getScreenCTM().inverse());
    };
    plan.addEventListener("pointermove", function (e) {
      var p = tacka(e);
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
        if (outP) outP.textContent = el.getAttribute("data-br") + " · P = " + Math.round(povrsina(el)).toLocaleString(lang === "en" ? "en-GB" : "de-DE") + " m²";
      });
    });
  }

  /* izohipse na tamnoj podlozi */
  var platna = document.querySelectorAll("canvas.izohipse");
  if (platna.length) {
    var seed = 7;
    var rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    var G = 64, grid = [];
    for (var i = 0; i < G * G; i++) grid.push(rnd());
    var glatko = function (t) { return t * t * (3 - 2 * t); };
    var sum = function (x, y) {
      var xi = Math.floor(x), yi = Math.floor(y), xf = glatko(x - xi), yf = glatko(y - yi);
      var g = function (a, b) { return grid[((b % G + G) % G) * G + ((a % G + G) % G)]; };
      var a = g(xi, yi) + (g(xi + 1, yi) - g(xi, yi)) * xf;
      var b = g(xi, yi + 1) + (g(xi + 1, yi + 1) - g(xi, yi + 1)) * xf;
      return a + (b - a) * yf;
    };
    var visina = function (x, y) {
      return sum(x * 0.9, y * 0.9) * 0.6 + sum(x * 2.1 + 5, y * 2.1 + 3) * 0.28 + sum(x * 4.3 + 9, y * 4.3 + 1) * 0.12;
    };
    var nacrtaj = function (c) {
      var r = c.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (!r.width) return;
      c.width = r.width * dpr; c.height = r.height * dpr;
      var ctx = c.getContext("2d"); ctx.scale(dpr, dpr);
      var boja = getComputedStyle(c).color;
      var korak = 10, nx = Math.ceil(r.width / korak) + 1, ny = Math.ceil(r.height / korak) + 1;
      var v = new Float32Array(nx * ny);
      for (var y = 0; y < ny; y++) for (var x = 0; x < nx; x++) v[y * nx + x] = visina(x * korak / 260, y * korak / 260);
      ctx.strokeStyle = boja; ctx.lineJoin = "round";
      for (var n = 0; n < 22; n++) {
        var nivo = 0.2 + n * 0.028;
        ctx.lineWidth = n % 5 === 0 ? 1.2 : 0.6;
        ctx.globalAlpha = n % 5 === 0 ? 0.55 : 0.3;
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
    if (window.matchMedia) window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", sve);
  }

  /* kontakt forma */
  var forma = document.querySelector("form.forma");
  if (forma) {
    var status = forma.querySelector(".status");
    forma.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(forma);
      if (!fd.get("ime") || !fd.get("email") || !fd.get("poruka")) {
        status.textContent = T.fali; status.classList.add("greska"); return;
      }
      status.classList.remove("greska"); status.textContent = T.saljem;
      var btn = forma.querySelector("button"); btn.disabled = true;
      var podaci = {}; fd.forEach(function (v, k) { podaci[k] = v; });
      podaci.jezik = lang;
      fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(podaci) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function () { status.textContent = T.poslato; forma.reset(); })
        .catch(function () { status.textContent = T.greska; status.classList.add("greska"); })
        .then(function () { btn.disabled = false; });
    });
  }
})();
