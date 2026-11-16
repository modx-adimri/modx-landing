$(function () {
  "use strict";

  /* ==========================================================================
     THEME TOGGLE
     ========================================================================== */
  var root = document.documentElement;
  function applyTheme(t) { root.setAttribute("data-theme", t); }
  applyTheme(localStorage.getItem("modx-theme-c") || "light");
  $("#themeToggle").on("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("modx-theme-c", next);
  });

  /* ==========================================================================
     MOBILE NAVIGATION
     ========================================================================== */
  $("#navToggle").on("click", function () {
    var open = $("#navLinks").toggleClass("is-open").hasClass("is-open");
    $(this).attr("aria-expanded", open);
  });
  $("#navLinks a").on("click", function () {
    $("#navLinks").removeClass("is-open");
    $("#navToggle").attr("aria-expanded", false);
  });

  /* ==========================================================================
     DASHBOARD BAR CHART
     ========================================================================== */
  var hs = [30, 45, 38, 60, 52, 70, 64, 80, 58, 90, 76, 100];
  var $bars = $("#dashBars");
  hs.forEach(function (v, i) {
    var o = i === hs.length - 1 ? 1 : 0.35 + i * 0.05;
    $('<span></span>').css({ height: v + "%", opacity: o }).appendTo($bars);
  });

  /* ==========================================================================
     SCROLL REVEAL
     ========================================================================== */
  var revealTargets = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    $(revealTargets).addClass("is-visible");
  }

  /* ==========================================================================
     CONTACT FORM (front-end only)
     ========================================================================== */
  $("#contactForm").on("submit", function (e) {
    e.preventDefault();
    $("#formNote").addClass("is-visible");
    this.reset();
  });

  /* ==========================================================================
     HERO CANVAS: soft beams + grid (cursor-reactive)
     ========================================================================== */
  var canvas = document.getElementById("hero-canvas");
  var heroSection = document.getElementById("top");
  var ctx = canvas.getContext("2d");
  var raf;

  var mouseTarget = { x: 0.5, y: 0.35 };
  var mouseCur = { x: 0.5, y: 0.35 };
  heroSection.addEventListener("mousemove", function (e) {
    var r = heroSection.getBoundingClientRect();
    mouseTarget.x = (e.clientX - r.left) / r.width;
    mouseTarget.y = (e.clientY - r.top) / r.height;
  });
  heroSection.addEventListener("mouseleave", function () {
    mouseTarget.x = 0.5; mouseTarget.y = 0.35;
  });

  function draw(t) {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    mouseCur.x += (mouseTarget.x - mouseCur.x) * 0.04;
    mouseCur.y += (mouseTarget.y - mouseCur.y) * 0.04;

    var s = t * 0.0003;
    var drift = (mouseCur.x - 0.5) * w * 0.05;
    for (var i = 0; i < 3; i++) {
      var x = w * (0.2 + i * 0.3) + Math.sin(s + i * 2) * w * 0.08 + drift;
      var g = ctx.createLinearGradient(x - 200, 0, x + 200, 0);
      g.addColorStop(0, "rgba(155,227,184,0)");
      g.addColorStop(0.5, "rgba(155,227,184," + (0.10 + 0.05 * Math.sin(s * 1.5 + i)) + ")");
      g.addColorStop(1, "rgba(155,227,184,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - 200, 0, 400, h);
    }

    var spot = ctx.createRadialGradient(
      mouseCur.x * w, mouseCur.y * h, 0,
      mouseCur.x * w, mouseCur.y * h, Math.max(w, h) * 0.32
    );
    spot.addColorStop(0, "rgba(155,227,184,.10)");
    spot.addColorStop(1, "rgba(155,227,184,0)");
    ctx.fillStyle = spot;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(255,255,255,.05)";
    ctx.lineWidth = 1;
    for (var x2 = 0; x2 < w; x2 += 72) { ctx.beginPath(); ctx.moveTo(x2, 0); ctx.lineTo(x2, h); ctx.stroke(); }
    for (var y2 = 0; y2 < h; y2 += 72) { ctx.beginPath(); ctx.moveTo(0, y2); ctx.lineTo(w, y2); ctx.stroke(); }

    var fade = ctx.createLinearGradient(0, 0, 0, h);
    fade.addColorStop(0, "rgba(11,59,42,0)");
    fade.addColorStop(1, "rgba(11,59,42,.9)");
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, w, h);

    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    cancelAnimationFrame(raf);
    draw(0);
  }

  /* ==========================================================================
     AI SECTION CANVAS: futuristic grid + scan pulses
     ========================================================================== */
  var aiCanvas = document.getElementById("ai-canvas");
  if (aiCanvas) {
    var aiCtx = aiCanvas.getContext("2d");
    var aiRaf, aiStep = 40, aiBlips = [];

    function aiDraw(t) {
      var w = aiCanvas.clientWidth, h = aiCanvas.clientHeight;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (aiCanvas.width !== w * dpr || aiCanvas.height !== h * dpr) {
        aiCanvas.width = w * dpr;
        aiCanvas.height = h * dpr;
      }
      aiCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      aiCtx.clearRect(0, 0, w, h);

      aiCtx.strokeStyle = "rgba(155,227,184,.08)";
      aiCtx.lineWidth = 1;
      for (var x = 0; x < w; x += aiStep) { aiCtx.beginPath(); aiCtx.moveTo(x, 0); aiCtx.lineTo(x, h); aiCtx.stroke(); }
      for (var y = 0; y < h; y += aiStep) { aiCtx.beginPath(); aiCtx.moveTo(0, y); aiCtx.lineTo(w, y); aiCtx.stroke(); }

      var scanY = ((t * 0.05) % (h + 200)) - 100;
      var scan = aiCtx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
      scan.addColorStop(0, "rgba(155,227,184,0)");
      scan.addColorStop(0.5, "rgba(155,227,184,.12)");
      scan.addColorStop(1, "rgba(155,227,184,0)");
      aiCtx.fillStyle = scan;
      aiCtx.fillRect(0, scanY - 60, w, 120);

      if (Math.random() < 0.06) {
        var cols = Math.floor(w / aiStep), rows = Math.floor(h / aiStep);
        aiBlips.push({
          x: Math.floor(Math.random() * cols) * aiStep,
          y: Math.floor(Math.random() * rows) * aiStep,
          born: t
        });
      }
      aiBlips = aiBlips.filter(function (b) { return t - b.born < 1200; });
      aiBlips.forEach(function (b) {
        var age = (t - b.born) / 1200;
        var alpha = Math.sin(age * Math.PI) * 0.8;
        aiCtx.fillStyle = "rgba(155,227,184," + alpha + ")";
        aiCtx.beginPath();
        aiCtx.arc(b.x, b.y, 2.5 + age * 3, 0, Math.PI * 2);
        aiCtx.fill();
      });

      aiRaf = requestAnimationFrame(aiDraw);
    }
    aiRaf = requestAnimationFrame(aiDraw);

    if (reduceMotion) {
      cancelAnimationFrame(aiRaf);
      aiDraw(0);
    }
  }
});
