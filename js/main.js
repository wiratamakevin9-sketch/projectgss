/* ==========================================================================
   MCM MAHKOTA: MAIN
   Mengisi konten dari SITE_CONFIG, navigasi, ringkasan pesanan, FAQ,
   animasi, dan tautan WhatsApp.
   ========================================================================== */
(function () {
  "use strict";
  var C = window.SITE_CONFIG;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Helper ---------- */
  function get(path) {
    return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, C);
  }
  function fill(str) {
    return String(str).replace(/\{\{([\w.]+)\}\}/g, function (_, p) { var v = get(p); return v == null ? "" : v; });
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  function rupiah(n) { return new Intl.NumberFormat("id-ID").format(Math.round(n)); }
  function money(n) { return "Rp" + rupiah(n); }

  C.pricing.summary = C.pricing.packages.map(function (p) { return p.name + " " + money(p.price); }).join(", ");

  /* Nomor WhatsApp hanya dianggap valid bila berupa 8 sampai 15 digit. */
  function waNumber() {
    var n = String(C.contact.whatsapp || "").replace(/\D/g, "");
    return /^\d{8,15}$/.test(n) ? n : "";
  }
  function waLink(text) {
    return "https://wa.me/" + waNumber() + (text ? "?text=" + encodeURIComponent(text) : "");
  }

  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 4200);
  }

  function openWhatsApp(text) {
    if (!waNumber()) {
      toast(C.demoMode
        ? "Mode demo: nomor WhatsApp belum diatur. Isi contact.whatsapp di js/config.js."
        : "Nomor WhatsApp belum tersedia. Silakan coba lagi nanti.");
      return;
    }
    window.open(waLink(text || "Halo, saya ingin bertanya tentang " + C.brand.fullName + "."), "_blank", "noopener");
  }

  /* ---------- Ringkasan pesanan (dipakai modal dan chat) ---------- */
  function pkgById(id) {
    return C.pricing.packages.filter(function (p) { return p.id === id; })[0] || null;
  }
  function orderRows(p) {
    return [
      ["Produk", C.brand.fullName],
      ["Paket", p.name],
      ["Jumlah", p.bottles + " botol"],
      [C.pricing.isExample ? "Harga contoh" : "Harga", money(p.price)]
    ];
  }
  function orderNote() {
    return C.pricing.isExample
      ? "Harga masih contoh. Harga final, ketersediaan, dan ongkos kirim dikonfirmasi tim MCM Mahkota melalui WhatsApp."
      : "Ketersediaan dan ongkos kirim dikonfirmasi tim MCM Mahkota melalui WhatsApp.";
  }
  function orderMessage(p) {
    return "Halo MCM Mahkota, saya ingin memesan:\n\n" +
      "Produk: " + C.brand.fullName + "\n" +
      "Paket: " + p.name + "\n" +
      "Jumlah: " + p.bottles + " botol\n" +
      (C.pricing.isExample ? "Harga contoh: " : "Harga: ") + money(p.price) + "\n\n" +
      "Mohon konfirmasi harga, ketersediaan, dan ongkos kirim. Terima kasih.";
  }

  window.MCM = {
    waLink: waLink, openWhatsApp: openWhatsApp, toast: toast, esc: esc, rupiah: rupiah, money: money,
    fill: fill, config: C, pkgById: pkgById, orderRows: orderRows, orderNote: orderNote, orderMessage: orderMessage
  };

  /* ---------- Isi teks dari config ---------- */
  $$("[data-cfg]").forEach(function (el) {
    var v = get(el.getAttribute("data-cfg"));
    if (v != null && v !== "") el.textContent = v;
  });
  $("#demoStrip").hidden = !C.demoMode;
  $("#year").textContent = new Date().getFullYear();
  $("#companyLink").href = C.brand.websiteUrl;

  /* Media sosial: tampil sebagai placeholder saat demo, disembunyikan saat live bila kosong */
  var SOCIAL = { instagram: "https://instagram.com/", tiktok: "https://www.tiktok.com/@", facebook: "https://facebook.com/" };
  $$("[data-social]").forEach(function (a) {
    var key = a.getAttribute("data-social"), handle = C.contact[key];
    if (handle) { a.href = SOCIAL[key] + handle; return; }
    if (!C.demoMode) { a.parentNode.hidden = true; return; }
    a.href = "#";
    a.addEventListener("click", function (e) { e.preventDefault(); toast("Mode demo: akun " + key + " belum diatur."); });
  });

  /* Foto produk resmi (jika ada) menggantikan ilustrasi */
  if (C.product.image) {
    $$("[data-bottle]").forEach(function (el) {
      el.innerHTML = '<img src="' + esc(C.product.image) + '" alt="' + (el.classList.contains("bottle-reflect") ? "" : esc(C.product.imageAlt)) + '" loading="lazy" decoding="async">';
    });
    $("#heroCaption").hidden = true;
  }

  /* ---------- Ikon ---------- */
  var ICONS = {
    water: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9.5 15a2.6 2.6 0 0 0 2.5 2.5"/>',
    energy: '<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>',
    mineral: '<path d="M12 3l7 4v8l-7 4-7-4V7z"/><path d="M12 11v8M5 7l7 4 7-4"/>',
    shield: '<path d="M12 3l7 3v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6z"/><path d="M9 12l2 2 4-4"/>',
    bone: '<path d="M8.5 5.5a2.5 2.5 0 1 0-3 3l10 10a2.5 2.5 0 1 0 3-3z"/><path d="M15.5 5.5a2.5 2.5 0 1 1 3 3M5.5 15.5a2.5 2.5 0 1 1 3 3"/>',
    doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    chat: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5z"/>'
  };
  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || ICONS.drop) + "</svg>";
  }

  /* ---------- Manfaat: satu kartu utama dan empat kartu pendukung ---------- */
  $("#benefitsGrid").innerHTML = C.benefits.map(function (b) {
    if (b.featured) {
      return '<article class="benefit benefit--feature reveal">' +
        '<svg class="benefit__rings" viewBox="0 0 300 300" aria-hidden="true"><circle cx="150" cy="150" r="140" fill="none" stroke="#fff" stroke-opacity=".14"/><circle cx="150" cy="150" r="104" fill="none" stroke="#fff" stroke-opacity=".14"/><circle cx="150" cy="150" r="68" fill="none" stroke="#fff" stroke-opacity=".14"/></svg>' +
        '<div class="benefit__icon" aria-hidden="true">' + icon(b.icon) + "</div>" +
        '<p class="benefit__kicker">Manfaat utama</p>' +
        "<h3>" + esc(b.title) + "</h3><p>" + esc(b.text) + "</p></article>";
    }
    return '<article class="benefit reveal"><div class="benefit__icon" aria-hidden="true">' + icon(b.icon) +
      "</div><h3>" + esc(b.title) + "</h3><p>" + esc(b.text) + "</p></article>";
  }).join("");

  /* ---------- Komposisi ---------- */
  var comp = C.product.composition || [];
  $("#compositionBody").innerHTML = comp.length
    ? '<div class="comp-scroll"><table class="comp-table"><thead><tr><th>Mineral</th><th class="num">Jumlah</th><th>Satuan</th><th>Keterangan</th></tr></thead><tbody>' +
    comp.map(function (m) {
      return "<tr><td>" + esc(m.name) + '</td><td class="num">' + esc(m.amount) + "</td><td>" + esc(m.unit) + "</td><td>" + esc(m.note || "") + "</td></tr>";
    }).join("") + "</tbody></table></div>"
    : "<p>Komposisi lengkap mengikuti label resmi pada kemasan produk.</p>";

  /* ---------- Paket ---------- */
  $("#priceNote").hidden = !C.pricing.isExample;
  $("#pricingGrid").innerHTML = C.pricing.packages.map(function (p) {
    var bottles = "";
    for (var i = 0; i < Math.min(p.bottles, 6); i++) bottles += "<span></span>";
    return '<article class="plan reveal' + (p.featured ? " plan--featured" : "") + '">' +
      (p.badge ? '<span class="plan__badge">' + esc(p.badge) + "</span>" : "") +
      '<div class="plan__top"><div class="plan__bottles" aria-hidden="true">' + bottles + "</div>" +
      (C.pricing.isExample ? '<span class="plan__example">Harga contoh</span>' : "") + "</div>" +
      "<h3>" + esc(p.name) + "</h3>" +
      '<p class="plan__price"><small>Rp</small>' + rupiah(p.price) + "</p>" +
      '<p class="plan__desc">' + esc(p.desc) + "</p>" +
      '<button class="btn btn--primary" type="button" data-package="' + esc(p.id) + '" aria-label="Pesan Sekarang, paket ' + esc(p.name) + '">Pesan Sekarang</button></article>';
  }).join("");

  /* ---------- Kepercayaan ---------- */
  $("#whyGrid").innerHTML = C.trust.map(function (t) {
    return '<article class="why__item reveal"><span class="why__i" aria-hidden="true">' + icon(t.icon) + "</span><h3>" +
      esc(t.title) + "</h3><p>" + esc(t.text) + "</p></article>";
  }).join("");

  /* ---------- Testimoni (hanya bila ada data asli) ---------- */
  var testi = C.testimonials || [];
  if (testi.length) {
    $("#testimoni").hidden = false;
    var track = $("#testiTrack");
    track.innerHTML = testi.map(function (t) {
      return '<figure class="testi"><blockquote><p>“' + esc(t.text) + '”</p></blockquote>' +
        '<figcaption class="testi__who"><span class="testi__avatar">' + esc(t.name.charAt(0)) + "</span><span><b>" + esc(t.name) + "</b><small>" + esc(t.city || "") + "</small></span></figcaption></figure>";
    }).join("");
    var step = function (dir) { track.scrollBy({ left: dir * Math.min(track.clientWidth * 0.9, 420), behavior: "smooth" }); };
    $("#testiPrev").addEventListener("click", function () { step(-1); });
    $("#testiNext").addEventListener("click", function () { step(1); });
  }

  /* ---------- FAQ (accordion) ---------- */
  var faqList = $("#faqList");
  faqList.innerHTML = C.faq.map(function (f, i) {
    var id = "faq-a" + i, open = i === 0;
    return '<div class="faq__item reveal' + (open ? " is-open" : "") + '">' +
      '<h3><button class="faq__q" type="button" aria-expanded="' + open + '" aria-controls="' + id + '"><span>' + esc(f.q) +
      '</span><i class="faq__chev" aria-hidden="true"></i></button></h3>' +
      '<div class="faq__a" id="' + id + '" role="region"><div><p>' + esc(fill(f.a)) + "</p></div></div></div>";
  }).join("");
  faqList.addEventListener("click", function (e) {
    var q = e.target.closest(".faq__q");
    if (!q) return;
    var item = q.closest(".faq__item");
    var open = item.classList.toggle("is-open");
    q.setAttribute("aria-expanded", String(open));
  });

  /* ---------- Tautan WhatsApp ---------- */
  $$("[data-wa-link]").forEach(function (a) {
    a.href = waNumber() ? waLink("Halo, saya ingin bertanya tentang " + C.brand.fullName + ".") : "#";
    a.target = "_blank"; a.rel = "noopener";
    a.addEventListener("click", function (e) { e.preventDefault(); openWhatsApp(); });
  });

  /* ---------- Modal ringkasan pesanan ---------- */
  var order = $("#order"), orderPick = $("#orderPick"), orderList = $("#orderList"), orderGo = $("#orderGo");
  var currentPkg = null, orderFocus = null, orderTimer;

  function renderOrder() {
    orderPick.innerHTML = C.pricing.packages.map(function (p) {
      return '<button type="button" data-pick="' + esc(p.id) + '" aria-pressed="' + (p === currentPkg) + '">' + esc(p.name) + "</button>";
    }).join("");
    orderList.innerHTML = orderRows(currentPkg).map(function (r, i, all) {
      return '<div' + (i === all.length - 1 ? ' class="is-total"' : "") + "><dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd></div>";
    }).join("");
    $("#orderNote").textContent = orderNote();
  }
  function openOrder(id) {
    currentPkg = pkgById(id) || C.pricing.packages[0];
    orderFocus = document.activeElement;
    renderOrder();
    clearTimeout(orderTimer);
    order.hidden = false;
    document.body.classList.add("no-scroll");
    requestAnimationFrame(function () { order.classList.add("is-open"); });
    setTimeout(function () { orderGo.focus(); }, 60);
  }
  function closeOrder() {
    if (order.hidden) return;
    order.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    orderTimer = setTimeout(function () { order.hidden = true; }, 280);
    if (orderFocus && orderFocus.focus) orderFocus.focus();
  }
  orderPick.addEventListener("click", function (e) {
    var b = e.target.closest("[data-pick]");
    if (!b) return;
    currentPkg = pkgById(b.getAttribute("data-pick"));
    renderOrder();
  });
  orderGo.addEventListener("click", function () { openWhatsApp(orderMessage(currentPkg)); });
  order.addEventListener("click", function (e) { if (e.target.closest("[data-order-close]")) closeOrder(); });
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-package]");
    if (b) openOrder(b.getAttribute("data-package"));
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeOrder();
    if (e.key === "Tab" && !order.hidden) {
      var f = $$("button, a[href]", order.querySelector(".order__panel")).filter(function (el) { return !el.disabled; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Navigasi ---------- */
  var nav = $(".nav"), burger = $("#navBurger"), links = $("#navLinks");
  function closeMenu() { links.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Buka menu"); }
  burger.addEventListener("click", function () {
    var open = links.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  });
  $$("a", links).forEach(function (el) { el.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  document.addEventListener("click", function (e) { if (!nav.contains(e.target)) closeMenu(); });

  function onScroll() { nav.classList.toggle("is-scrolled", window.scrollY > 12); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Menu aktif sesuai section */
  var navMap = {};
  $$(".nav__links a[href^='#']").forEach(function (a) { navMap[a.getAttribute("href").slice(1)] = a; });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && navMap[en.target.id]) {
          Object.keys(navMap).forEach(function (k) { navMap[k].classList.remove("is-active"); });
          navMap[en.target.id].classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(navMap).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Animasi muncul saat scroll ----------
     Elemen di layar pertama tetap terlihat; hanya elemen di bawah lipatan yang dianimasikan. */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    var vh = window.innerHeight;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.remove("is-pre"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    $$(".reveal").forEach(function (el, i) {
      if (el.getBoundingClientRect().top > vh) {
        el.classList.add("is-pre");
        el.style.transitionDelay = (i % 3) * 70 + "ms";
        io.observe(el);
      }
    });
  }

  window.MCM.fab = $("#fab");
})();
