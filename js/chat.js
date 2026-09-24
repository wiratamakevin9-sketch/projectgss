/* ==========================================================================
   MCM MAHKOTA: MCM ASSISTANT (CHAT)
   - chat.endpoint kosong  : mode demo (jawaban otomatis dari config)
   - chat.endpoint terisi  : kirim percakapan ke backend, balasan berupa
                             JSON { reply: "..." }
   Pesanan selalu diteruskan ke tim melalui WhatsApp.
   ========================================================================== */
(function () {
  "use strict";
  var M = window.MCM, C = M.config, esc = M.esc;
  var $ = function (s) { return document.querySelector(s); };

  var chat = $("#chat"), body = $("#chatBody"), form = $("#chatForm"), input = $("#chatInput"), quick = $("#chatQuick");
  var history = [];          // { role: "user" | "assistant", content }
  var started = false, busy = false, lastFocus = null;

  $("#chatTitle").textContent = C.chat.assistantName;
  $("#chatSub").textContent = C.chat.subtitle;

  /* ---------- UI ---------- */
  function scrollDown() { body.scrollTop = body.scrollHeight; }

  function buildCard(card) {
    var el = document.createElement("div");
    el.className = "ordercard";
    var html = "<h4>" + esc(card.title) + "</h4><dl>";
    card.rows.forEach(function (r) { html += "<div><dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd></div>"; });
    el.innerHTML = html + "</dl>";
    return el;
  }

  function addMsg(role, text, actions, card) {
    var el = document.createElement("div");
    el.className = "msg msg--" + role;
    var p = document.createElement("span");
    p.className = "msg__text";
    p.textContent = text;
    el.appendChild(p);
    if (card) el.appendChild(buildCard(card));
    if (actions && actions.length) {
      var box = document.createElement("div");
      box.className = "msg__actions";
      actions.forEach(function (a) {
        var b;
        if (a.wa) {
          b = document.createElement("a");
          b.href = "#"; b.className = "wa";
          b.innerHTML = '<svg><use href="#wa"/></svg>' + esc(a.label);
          b.addEventListener("click", function (e) { e.preventDefault(); M.openWhatsApp(a.wa); });
        } else {
          b = document.createElement("button");
          b.type = "button"; b.className = "ghost"; b.textContent = a.label;
          b.addEventListener("click", function () { send(a.send || a.label); });
        }
        box.appendChild(b);
      });
      el.appendChild(box);
    }
    body.appendChild(el);
    if (role !== "note") history.push({ role: role === "user" ? "user" : "assistant", content: text });
    scrollDown();
  }

  function typing(on) {
    var t = $("#typing");
    if (on && !t) {
      t = document.createElement("div");
      t.id = "typing"; t.className = "typing"; t.setAttribute("aria-label", "Asisten sedang mengetik");
      t.innerHTML = "<span></span><span></span><span></span>";
      body.appendChild(t); scrollDown();
    } else if (!on && t) { t.remove(); }
  }

  function renderQuick() {
    quick.innerHTML = "";
    C.chat.quickReplies.forEach(function (q) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = q;
      b.addEventListener("click", function () { send(q); });
      quick.appendChild(b);
    });
  }

  function open(prefill) {
    lastFocus = document.activeElement;
    chat.hidden = false;
    M.fab.classList.add("is-hidden");
    var first = !started;
    if (first) {
      started = true;
      renderQuick();
      typing(true);
      setTimeout(function () { typing(false); addMsg("bot", C.chat.greeting); }, 650);
    }
    if (prefill) setTimeout(function () { send(prefill); }, first ? 800 : 0);
    setTimeout(function () { input.focus(); }, 60);
  }
  function close() {
    chat.hidden = true;
    M.fab.classList.remove("is-hidden");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ---------- Data bantu ---------- */
  function pkgFromText(t) {
    var m = t.match(/(\d+)\s*botol/i) || t.match(/paket\s*(\d+)/i);
    if (!m) return null;
    var n = parseInt(m[1], 10);
    return C.pricing.packages.filter(function (p) { return p.bottles === n; })[0] || null;
  }
  var exampleNote = C.pricing.isExample ? "\n\nHarga masih contoh dan akan dikonfirmasi tim MCM Mahkota." : "";
  var pkgButtons = C.pricing.packages.map(function (p) { return { label: p.name, send: "Saya pilih " + p.name }; });

  function orderReply(p) {
    return {
      text: "Berikut ringkasan pesanan Anda. Periksa kembali, lalu lanjutkan ke WhatsApp untuk konfirmasi dengan tim kami.",
      card: { title: "Ringkasan Pesanan", rows: M.orderRows(p) },
      actions: [
        { label: "Lanjutkan ke WhatsApp", wa: M.orderMessage(p) },
        { label: "Ganti Paket", send: "Pesan Sekarang" }
      ]
    };
  }

  /* ---------- Mesin jawaban demo ---------- */
  var MEDICAL = /(sakit|penyakit|obat|sembuh|diabetes|gula darah|kanker|tumor|hipertensi|darah tinggi|stroke|jantung|ginjal|asam urat|kolesterol|hamil|menyusui|alergi|diagnos|terapi|kemo|leukemia|maag|asma|gejala|dokter)/i;

  function demoReply(text) {
    var t = text.toLowerCase().trim();

    if (MEDICAL.test(t)) {
      return {
        text: "Untuk pertanyaan yang berkaitan dengan kondisi kesehatan tertentu, silakan konsultasikan dengan tenaga kesehatan yang berkualifikasi. " +
          C.brand.name + " merupakan produk mineral dan bukan pengganti obat, diagnosis, atau perawatan medis.\n\nSaya tetap bisa membantu soal informasi produk, dosis pada kemasan, atau pemesanan.",
        actions: [{ label: "Apa itu MCM?" }, { label: "Cara Penggunaan" }]
      };
    }

    var chosen = pkgFromText(t);
    if (chosen && /(pilih|pesan|order|beli|mau|ingin)/.test(t)) return orderReply(chosen);

    if (/(pesan sekarang|pesan|order|beli|checkout)/.test(t)) {
      return { text: "Silakan pilih paket yang ingin dipesan:", actions: pkgButtons };
    }

    if (/(harga|paket|berapa|biaya|promo|murah)/.test(t)) {
      return {
        text: "Pilihan paket " + C.brand.name + ":\n" + C.pricing.packages.map(function (p) { return "• " + p.name + ": " + M.money(p.price); }).join("\n") + exampleNote,
        actions: [{ label: "Pesan Sekarang" }]
      };
    }

    if (/(dosis|cara|pakai|penggunaan|tetes|minum|anak|dewasa)/.test(t)) {
      return {
        text: "Cara penggunaan: teteskan ke air minum atau makanan sesuai petunjuk pada kemasan, aduk, lalu konsumsi.\n\nDosis menurut informasi produk:\n• Anak-anak: " + C.dosage.children +
          "\n• Dewasa: " + C.dosage.adult + "\n\nUntuk anak-anak, ibu hamil, ibu menyusui, atau pengguna obat tertentu, konsultasikan dahulu dengan tenaga kesehatan.",
        actions: [{ label: "Lihat Paket" }]
      };
    }

    if (/(manfaat|khasiat|fungsi|guna)/.test(t)) {
      return {
        text: "Menurut informasi produk, " + C.brand.name + " dapat mendukung:\n" +
          C.benefits.map(function (b) { return "• " + b.title; }).join("\n") +
          "\n\nInformasi ini bukan jaminan hasil kesehatan dan hasil dapat berbeda pada setiap orang.",
        actions: [{ label: "Cara Penggunaan" }, { label: "Lihat Paket" }]
      };
    }

    if (/(ongkir|kirim|pengiriman|ekspedisi|cod|sampai)/.test(t)) {
      return { text: C.contact.shippingNote, actions: [{ label: "Tanya ongkir via WhatsApp", wa: "Halo, saya ingin menanyakan ongkos kirim " + C.brand.name + " ke kota saya." }] };
    }

    if (/(stok|ready|tersedia|ketersediaan)/.test(t)) {
      return { text: "Ketersediaan stok dikonfirmasi langsung oleh tim agar informasinya selalu akurat.", actions: [{ label: "Cek stok via WhatsApp", wa: "Halo, apakah " + C.brand.name + " sedang tersedia?" }] };
    }

    if (/(bpom|izin|legal|resmi|terdaftar)/.test(t)) {
      return { text: "Nomor registrasi BPOM yang tercantum: " + C.product.bpom + ". Nomor ini adalah izin edar produk dan bukan klaim bahwa produk dapat mengobati penyakit." };
    }

    if (/(komposisi|kandungan|isi mineral|sumber|danau|berasal|salt lake)/.test(t)) {
      return {
        text: "Menurut informasi produk yang tersedia, mineral " + C.brand.name + " diekstrak dari " + C.product.mineralSource + ". Detail komposisi mengikuti label resmi pada kemasan.",
        actions: [{ label: "Apa itu MCM?" }]
      };
    }

    if (/(admin|manusia|\bcs\b|customer|hubungi|kontak|telepon|\bwa\b|whatsapp)/.test(t)) {
      return { text: "Baik, saya sambungkan ke tim kami di WhatsApp.", actions: [{ label: "Chat tim di WhatsApp", wa: "Halo, saya ingin bertanya tentang " + C.brand.fullName + "." }] };
    }

    if (/(info|produk|apa itu|mcm|mahkota|tentang)/.test(t)) {
      return {
        text: C.brand.fullName + " adalah produk mineral dalam bentuk tetes dari " + C.brand.company + ".\n\n• Isi: " + C.product.volume +
          "\n• BPOM: " + C.product.bpom + "\n• Penggunaan: " + C.product.usage + "\n• Sumber mineral: " + C.product.mineralSource + " (menurut informasi produk)",
        actions: [{ label: "Manfaat Produk" }, { label: "Cara Penggunaan" }, { label: "Lihat Paket" }]
      };
    }

    if (/^(halo|hai|hi|pagi|siang|sore|malam|assalamualaikum|om swastiastu)\b/.test(t)) {
      return { text: "Halo. Ada yang bisa saya bantu? Anda bisa bertanya soal produk, cara penggunaan, paket, atau langsung memesan." };
    }

    return {
      text: "Maaf, saya belum menemukan jawaban yang tepat untuk itu. Anda bisa memilih topik di bawah atau langsung bertanya ke tim kami.",
      actions: [{ label: "Apa itu MCM?" }, { label: "Lihat Paket" }, { label: "Chat tim di WhatsApp", wa: "Halo, saya ingin bertanya tentang " + C.brand.fullName + "." }]
    };
  }

  /* ---------- Kirim ke backend AI ---------- */
  function aiReply() {
    return fetch(C.chat.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history.slice(-20) })
    }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (data) {
      var text = String(data.reply || "");
      var actions = [];
      // Backend menambahkan [[WHATSAPP: pesan]] saat perlu diteruskan ke tim
      text = text.replace(/\[\[WHATSAPP:?\s*([^\]]*)\]\]/g, function (_, msg) {
        actions.push({ label: "Lanjut ke WhatsApp", wa: msg.trim() || "Halo, saya ingin bertanya tentang " + C.brand.fullName + "." });
        return "";
      }).trim();
      return { text: text, actions: actions };
    });
  }

  /* ---------- Kirim pesan ---------- */
  function send(text) {
    text = (text || "").trim();
    if (!text || busy) return;
    addMsg("user", text);
    busy = true; typing(true);

    var delay = 600 + Math.min(text.length * 12, 700);
    var job = C.chat.endpoint
      ? aiReply().catch(function () {
        addMsg("note", "Koneksi sedang bermasalah. Menampilkan jawaban otomatis.");
        return demoReply(text);
      })
      : new Promise(function (res) { setTimeout(function () { res(demoReply(text)); }, delay); });

    job.then(function (r) {
      typing(false); busy = false;
      addMsg("bot", r.text, r.actions, r.card);
    });
  }

  /* ---------- Event ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = input.value; input.value = "";
    send(v);
  });
  $("#chatClose").addEventListener("click", close);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !chat.hidden) close(); });

  document.addEventListener("click", function (e) {
    var opener = e.target.closest("[data-open-chat]");
    if (opener) {
      e.preventDefault();
      open(opener.getAttribute("data-open-chat") || null);
    }
  });

  window.MCM.openChat = open;
})();
