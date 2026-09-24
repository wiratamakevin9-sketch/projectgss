/* ==========================================================================
   MCM MAHKOTA: KONFIGURASI WEBSITE
   Semua konten yang sering diganti ada di file ini.
   Untuk klien lain: cukup ubah file ini (dan warna di css/style.css :root).

   Aturan konten: semua klaim, harga, kontak, dan nomor izin harus berasal
   dari informasi bisnis yang terverifikasi. Nilai yang belum pasti ditandai
   sebagai placeholder atau contoh.
   ========================================================================== */

window.SITE_CONFIG = {
  /* Mode demo menampilkan pita info di atas halaman. Set false saat live. */
  demoMode: true,

  brand: {
    name: "MCM Mahkota",
    fullName: "MCM Mahkota Concentrated Mineral Drops",
    tagline: "Concentrated Mineral Drops",
    company: "PT. Global Star Success",
    website: "gssindo.co.id",
    websiteUrl: "https://www.gssindo.co.id"
  },

  product: {
    form: "Mineral konsentrat dalam bentuk tetes",
    volume: "65 ml",
    bpom: "SI246090301",               // cek ulang di cekbpom.pom.go.id sebelum live
    usage: "Ditambahkan ke dalam air minum atau makanan.",
    mineralSource: "The Great Salt Lake", // sesuai informasi produk yang tersedia
    /* Isi dari label resmi. Contoh format:
       { name: "Magnesium", amount: "xx", unit: "mg", note: "per 20 tetes" } */
    composition: [],
    /* Foto produk resmi. Kosongkan untuk memakai ilustrasi kemasan bawaan.
       Contoh: "img/produk.png" */
    image: "",
    imageAlt: "Kemasan MCM Mahkota Concentrated Mineral Drops 65 ml"
  },

  dosage: {
    children: "1 tetes per 2 kg berat badan",
    adult: "10 sampai 20 tetes per hari"
  },

  contact: {
    /* Isi dengan format 628123456789 (tanpa + dan tanpa 0 di depan). */
    whatsapp: "WHATSAPP_NUMBER_HERE",
    whatsappDisplay: "WHATSAPP_NUMBER_HERE",
    instagram: "",                     // isi username tanpa @
    tiktok: "",
    facebook: "",
    shippingNote: "Ongkos kirim dan estimasi pengiriman dikonfirmasi langsung oleh tim MCM Mahkota sesuai alamat Anda."
  },

  pricing: {
    isExample: true,
    note: "Harga ini masih contoh (draft) dan akan dikonfirmasi oleh tim MCM Mahkota sebelum pemesanan.",
    packages: [
      { id: "p1", name: "1 Botol", bottles: 1, price: 20000, desc: "Untuk mencoba MCM Mahkota" },
      { id: "p3", name: "3 Botol", bottles: 3, price: 55000, desc: "Pilihan hemat untuk penggunaan rutin", featured: true, badge: "Pilihan Populer" },
      { id: "p6", name: "6 Botol", bottles: 6, price: 100000, desc: "Pilihan untuk keluarga" }
    ]
  },

  /* Klaim manfaat: harus sesuai label dan dokumen registrasi BPOM. */
  benefits: [
    { icon: "water", featured: true, title: "Menyeimbangkan Elektrolit", text: "Mineral berperan dalam membantu menjaga keseimbangan cairan tubuh dan mendukung fungsi elektrolit, sesuai informasi produk." },
    { icon: "energy", title: "Mendukung Energi dan Vitalitas", text: "Membantu mendukung energi dan stamina harian." },
    { icon: "mineral", title: "Mendukung Metabolisme", text: "Mendukung proses metabolisme tubuh." },
    { icon: "shield", title: "Mendukung Imunitas", text: "Mendukung daya tahan tubuh." },
    { icon: "bone", title: "Mendukung Kesehatan Tulang dan Sendi", text: "Mendukung pemeliharaan tulang dan sendi." }
  ],

  /* Tiga poin kepercayaan yang tidak memakai testimoni. */
  trust: [
    { icon: "doc", title: "Informasi Produk Transparan", text: "Nama produk, isi, dan nomor BPOM ditampilkan dengan jelas." },
    { icon: "drop", title: "Praktis untuk Rutinitas Harian", text: "Cukup teteskan ke air minum atau makanan." },
    { icon: "chat", title: "Order Mudah melalui WhatsApp", text: "Pilih paket, periksa ringkasan, lalu lanjutkan ke WhatsApp." }
  ],

  /* Isi dengan testimoni ASLI yang sudah disetujui pelanggan.
     Selama kosong, bagian testimoni disembunyikan.
     Format: { name: "Ibu R.", city: "Denpasar", text: "..." } */
  testimonials: [],

  /* {{path}} otomatis diganti dari konfigurasi di atas. */
  faq: [
    {
      q: "Apa itu MCM Mahkota?",
      a: "{{brand.fullName}} adalah produk mineral dalam bentuk tetes dari {{brand.company}}. Produk ini dapat menjadi bagian dari rutinitas sehat sehari-hari."
    },
    {
      q: "Bagaimana cara menggunakan MCM Mahkota?",
      a: "Teteskan ke dalam air minum atau makanan sesuai petunjuk pada kemasan, aduk, lalu konsumsi."
    },
    {
      q: "Berapa dosis penggunaannya?",
      a: "Menurut informasi produk, anak-anak: {{dosage.children}}. Dewasa: {{dosage.adult}}. Ikuti petunjuk pada kemasan. Untuk anak-anak, ibu hamil, ibu menyusui, atau pengguna obat tertentu, konsultasikan dahulu dengan tenaga kesehatan."
    },
    {
      q: "Dari mana sumber mineralnya?",
      a: "Menurut informasi produk yang tersedia, mineral MCM Mahkota diekstrak dari {{product.mineralSource}}. Detail komposisi mengikuti label resmi pada kemasan."
    },
    {
      q: "Berapa harga produknya?",
      a: "Pilihan paket saat ini: {{pricing.summary}}. {{pricing.note}}"
    },
    {
      q: "Bagaimana cara melakukan pemesanan?",
      a: "Pilih paket di bagian Paket, tekan Pesan Sekarang, periksa Ringkasan Pesanan, lalu lanjutkan ke WhatsApp. Tim kami akan mengonfirmasi harga, ketersediaan, dan ongkos kirim."
    },
    {
      q: "Apakah MCM Mahkota merupakan obat?",
      a: "Bukan. MCM Mahkota merupakan produk mineral dan bukan pengganti obat, diagnosis, atau perawatan medis. Untuk kondisi kesehatan tertentu, konsultasikan dengan tenaga kesehatan yang berkualifikasi."
    }
  ],

  chat: {
    /* Kosong = mode demo (jawaban otomatis dari data di file ini).
       Isi dengan URL backend, misalnya "/api/chat", untuk memakai model AI.
       Backend harus mengembalikan JSON { reply: "..." }. */
    endpoint: "",
    assistantName: "MCM Assistant",
    subtitle: "Asisten informasi produk",
    greeting: "Halo. Saya dapat membantu Anda mengenal MCM Mahkota, memahami cara penggunaan, dan memilih paket.",
    quickReplies: ["Apa itu MCM?", "Manfaat Produk", "Cara Penggunaan", "Lihat Paket", "Pesan Sekarang"]
  }
};
