# MCM Mahkota — Landing Page

Website profil & pemesanan produk **MCM Mahkota Concentrated Mineral Drops** (PT. Global Star Success).

Website statis: HTML, CSS, dan JavaScript murni, tanpa build step dan tanpa dependency.

## Struktur

```
.
├── index.html      # Halaman utama
├── css/
│   └── style.css   # Seluruh styling (warna tema di :root)
└── js/
    ├── config.js   # Konten situs: produk, harga, kontak, FAQ, chat
    ├── main.js     # Render konten & logika pemesanan via WhatsApp
    └── chat.js     # Widget asisten chat
```

## Menjalankan secara lokal

Buka `index.html` langsung di browser, atau jalankan server lokal:

```bash
npx serve .
# atau
python -m http.server 8000
```

## Mengubah konten

Hampir semua konten diatur di [`js/config.js`](js/config.js). Sebelum live:

- Ganti `contact.whatsapp` dengan nomor asli (format `628xxxxxxxxxx`).
- Set `demoMode: false`.
- Konfirmasi harga (`pricing`) dan nomor BPOM.

## Catatan keamanan

Jangan menaruh API key di file JavaScript frontend. Jika chat memakai model AI,
arahkan `chat.endpoint` ke backend/serverless function yang menyimpan key di environment variable.
