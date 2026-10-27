# PRD: Website Penjualan, Servis & Company Profile

**PT. Mandalika Global Alkesindo** | Medical Equipment Sales And Service | www.mga.my.id Versi 1.0 (draft untuk dibangun dengan Laravel + React + opencode)

## 1. Ringkasan

Website ini punya tiga fungsi sekaligus: (1) **e-catalogue dan penjualan alat kesehatan**, (2) **layanan perbaikan dan servis alat kesehatan**, (3) **company profile dan marketing**. Semua kesepakatan, negosiasi harga, dan pembayaran terjadi **di luar sistem, lewat WhatsApp**. Website berperan sebagai etalase, pengumpul lead yang rapi, dan alat kerja tim internal lewat panel admin.

**Prinsip utama**

- **WhatsApp-first.** Tidak ada payment gateway, keranjang bayar, atau checkout online. Pengunjung memilih produk atau mengisi form servis, lalu website menyiapkan pesan WhatsApp yang sudah terisi dan mencatat lead-nya ke database.
- **Setiap interaksi tercatat.** Semua klik WhatsApp, form inquiry, dan permintaan servis masuk ke panel admin sebagai lead atau tiket.
- **SEO dan mobile-first.** Mayoritas calon pembeli (rumah sakit, klinik, dinas) mencari lewat Google dan membuka dari ponsel.
- **Mudah dikelola non-teknis.** Admin bisa mengubah produk, harga, promo, artikel, dan nomor WhatsApp tanpa programmer.

## 2. Tujuan dan Metrik Keberhasilan

| Tujuan | Metrik (3 bulan setelah rilis) |
| --- | --- |
| Menghasilkan lead penjualan | Jumlah inquiry dan klik WhatsApp per bulan; target awal disepakati bersama tim sales |
| Menghasilkan permintaan servis | Jumlah tiket servis per bulan; waktu respon pertama < 1 jam jam kerja |
| Membangun kepercayaan | Halaman Legalitas, Brand Partner, Testimoni, dan Galeri terisi lengkap |
| Ditemukan di Google | Produk dan layanan terindeks; kata kunci utama masuk halaman 1-2 untuk pencarian lokal |
| Efisiensi tim | Semua lead dan tiket dikelola di satu panel, tanpa catatan manual terpisah |

## 3. Ruang Lingkup

**Termasuk (In scope)**

- Website publik: beranda, tentang, katalog, detail produk, layanan servis, legalitas, galeri, blog, promo, kontak, FAQ.
- Daftar penawaran (inquiry cart) dan pemesanan via WhatsApp.
- Form permintaan servis dengan kode tiket dan halaman cek status.
- Panel admin lengkap: produk, lead, tiket servis, konten, marketing, pengguna, pengaturan.
- SEO teknis, analitik, dan pelacakan sumber lead (UTM).

**Tidak termasuk (Out of scope, tahap awal)**

- Pembayaran online, keranjang bayar, dan integrasi gateway.
- Manajemen stok gudang detail, akuntansi, dan faktur pajak (dikerjakan di luar sistem).
- Aplikasi mobile native.
- Integrasi WhatsApp Business API resmi (opsional di Fase 4).

## 4. Pengguna dan Peran

| Peran | Deskripsi | Akses |
| --- | --- | --- |
| Pengunjung / calon pembeli | RS, klinik, dinas, distributor, dokter praktik | Situs publik; tidak wajib login |
| Super Admin | Pemilik atau manajer | Semua fitur, pengguna, peran, pengaturan |
| Admin Katalog | Mengelola produk | Produk, kategori, brand, media, dokumen |
| Sales / CS | Menindaklanjuti lead | Inquiry, pelanggan, template WhatsApp, laporan lead |
| Teknisi / Service | Menangani perbaikan | Tiket servis, jadwal, catatan teknisi |
| Marketing / Konten | Konten dan promosi | Blog, banner, promo, halaman, SEO, galeri, testimoni |

Akun pelanggan **tidak wajib** di MVP. Pelanggan cukup mengisi nama dan nomor WhatsApp. Login pelanggan bisa dipertimbangkan di fase lanjutan.

## 5. Alur Bisnis Utama

### 5.1 Pembelian lewat WhatsApp

1. Pengunjung membuka katalog, mencari atau memfilter produk (kategori, brand, kata kunci).
2. Di detail produk, pengunjung menekan **"Tanya via WhatsApp"** (satu produk) atau **"Tambah ke Daftar Penawaran"** (beberapa produk).
3. Pengunjung mengisi data singkat: nama, instansi, kota, nomor WhatsApp, catatan (opsional).
4. Sistem menyimpan **inquiry** (kode unik, mis. INQ-2026-00123, status Baru) lalu membuka WhatsApp ke nomor CS dengan pesan terisi (lihat bagian 8).
5. Sales menindaklanjuti lewat WhatsApp: penawaran, negosiasi, kesepakatan, pembayaran.
6. Sales memperbarui status inquiry di panel admin: **Baru > Dihubungi > Penawaran Terkirim > Negosiasi > Deal / Batal**, dengan catatan dan nilai deal (opsional, manual).

### 5.2 Servis dan perbaikan

1. Pengunjung membuka halaman Layanan Servis dan mengisi form: data kontak, nama alat, brand, model, nomor seri (opsional), keluhan, foto/video (opsional), lokasi alat, preferensi (teknisi datang / kirim alat / antar sendiri).
2. Sistem membuat **tiket servis** (mis. SRV-2026-00045) dan membuka WhatsApp dengan ringkasan tiket.
3. Teknisi dan CS memproses di panel admin dengan status: **Diterima > Dijadwalkan > Diagnosa > Menunggu Persetujuan (via WA) > Dikerjakan > Pengujian > Selesai > Diambil / Dikirim**.
4. Pelanggan dapat memantau status lewat halaman **Cek Status Servis** (kode tiket + 4 digit terakhir nomor WhatsApp).

### 5.3 Marketing dan lead

- Setiap kunjungan membawa data sumber (UTM, referrer, halaman awal) yang disimpan bersama lead.
- Tombol WhatsApp melayang, tombol di detail produk, dan CTA di artikel semuanya dicatat sebagai **klik WhatsApp** (event) meski pengunjung belum mengisi form.
- Promo, banner, dan artikel dikelola dari admin dan memiliki halaman SEO sendiri.

## 6. Fitur Website Publik

| Halaman | Isi dan kebutuhan |
| --- | --- |
| Beranda | Hero, trust bar (izin edar, servis, pengiriman, brand resmi), kategori, produk unggulan, statistik, alur kerja, testimoni, FAQ, brand partner, CTA, footer |
| Tentang Kami | Profil, visi misi, nilai, tim (opsional), jangkauan layanan |
| Legalitas | Daftar dokumen (NIB, izin distribusi, surat penunjukan brand) yang diunggah admin; tampil sebagai kartu dengan pratinjau |
| Katalog | Grid produk, pencarian, filter kategori/brand, urutan, paginasi, URL ramah SEO |
| Detail Produk | Galeri foto, nama, brand, model, deskripsi, spesifikasi lengkap, dokumen/brosur (PDF), produk terkait, tombol WhatsApp, tambah ke daftar penawaran, data terstruktur (JSON-LD) |
| Kategori / Brand | Halaman landing per kategori dan brand dengan teks SEO |
| Daftar Penawaran | Daftar produk terpilih, ubah jumlah, form data kontak, kirim via WhatsApp, salin daftar |
| Layanan Servis | Penjelasan layanan, alat yang dilayani, alur, form permintaan servis, FAQ servis |
| Cek Status Servis | Input kode tiket dan verifikasi, tampilkan timeline status |
| Promo | Daftar promo aktif dengan periode dan syarat singkat |
| Blog / Artikel | Artikel edukasi dan berita, kategori, tag, artikel terkait, CTA WhatsApp |
| Galeri | Foto proyek, instalasi, dan kegiatan |
| Kontak | Alamat, peta, jam kerja, tombol WhatsApp per departemen, form pesan |
| FAQ, Kebijakan Privasi, Syarat | Konten dikelola admin |

**Perilaku umum**

- Seluruh teks dan bahasa Indonesia; struktur siap multi-bahasa.
- Tombol WhatsApp melayang di semua halaman publik.
- Harga bisa **ditampilkan** atau diganti **"Hubungi untuk harga"** per produk atau global.
- Status ketersediaan produk: Ready, Indent, Pre-order, Habis (opsional ditampilkan).
- Formulir dilindungi anti-spam (honeypot + Cloudflare Turnstile atau reCAPTCHA) dan rate limit.

## 7. Fitur Panel Admin

Panel berada di `/admin`, dibangun dengan komponen React yang sama dengan tema situs (konsisten dan satu codebase).

| Modul | Fungsi utama |
| --- | --- |
| Dashboard | Lead hari ini/bulan ini, tiket aktif, lead per status, produk paling dilihat, klik WhatsApp, grafik per sumber trafik |
| Produk | CRUD produk, duplikasi, impor/ekspor CSV, banyak foto (urutkan, foto utama), spesifikasi (daftar poin), dokumen PDF, status terbit/draf, unggulan, SEO per produk |
| Kategori & Brand | CRUD, urutan, ikon/logo, teks SEO, hierarki kategori |
| Inquiry (Lead Penjualan) | Daftar dan filter, detail dengan item produk, penugasan ke sales, status, catatan internal, riwayat, tombol "Balas via WhatsApp", ekspor CSV |
| Pelanggan | Data pelanggan otomatis dari inquiry/servis, riwayat interaksi, catatan, tag |
| Servis | Daftar tiket, penugasan teknisi, status, estimasi biaya (manual), catatan diagnosa, lampiran foto, riwayat status, cetak tanda terima/PDF |
| Konten | Halaman statis, blog, banner/hero, promo, testimoni, FAQ, galeri, dokumen legalitas |
| Marketing | Template pesan WhatsApp, kampanye/UTM builder, kode promo informasional, pengaturan pixel (GA4, Meta, TikTok), laporan sumber lead |
| Media Library | Unggah gambar/PDF, otomatis kompres dan buat WebP |
| Pengguna & Peran | CRUD pengguna, peran dan izin granular, 2FA, riwayat login |
| Pengaturan | Profil perusahaan, nomor WhatsApp (banyak, per departemen), jam kerja, alamat, sosmed, SEO default, tampilan harga, logo, tema |
| Log Aktivitas | Siapa mengubah apa dan kapan (produk, status lead, tiket) |

**Fitur lanjutan yang disarankan**

- Generator **Surat Penawaran (PDF)** dari inquiry, dengan kop surat perusahaan, untuk dikirim lewat WhatsApp.
- Pengingat tindak lanjut (follow-up) untuk lead yang lama tidak disentuh.
- Laporan bulanan (lead, deal, servis) dan ekspor.

## 8. Template Pesan WhatsApp

Nomor tujuan diambil dari Pengaturan (bukan ditulis permanen di kode). Format nomor dinormalisasi ke `62xxxxxxxxxx`. Pesan dikodekan dengan `encodeURIComponent` dan memakai `https://wa.me/{nomor}?text=...`.

**Inquiry produk**

```
Halo PT. Mandalika Global Alkesindo, saya ingin meminta penawaran.
Kode: INQ-2026-00123
Nama: {nama} | Instansi: {instansi} | Kota: {kota}
Produk:
1. {nama produk} ({brand}) x{qty}
2. ...
Catatan: {catatan}
Sumber: {url halaman}
```

**Permintaan servis**

```
Halo, saya ingin mengajukan servis alat.
Kode: SRV-2026-00045
Alat: {nama} | Brand/Model: {brand} {model} | No. seri: {sn}
Keluhan: {keluhan}
Lokasi: {kota} | Preferensi: {teknisi datang / kirim alat}
```

Template balasan untuk sales dan teknisi dapat diedit di admin (variabel: `{nama}`, `{kode}`, `{produk}`, `{status}`).

## 9. Model Data (ringkas)

Semua tabel memakai `id`, `created_at`, `updated_at`; konten publik memakai `slug` unik dan soft delete.

| Tabel | Kolom penting |
| --- | --- |
| users | name, email, password, role (spatie), phone, is\_active, 2FA |
| brands | name, slug, logo, description, seo\_\* |
| categories | parent\_id, name, slug, description, icon, sort\_order, seo\_\* |
| products | category\_id, brand\_id, name (jenis), model, slug, sku, short\_description, description, price (nullable, integer Rupiah), price\_mode (show/contact), stock\_status, is\_featured, is\_published, view\_count, seo\_\* |
| product\_specs | product\_id, label (opsional), value, sort\_order (deskripsi/spesifikasi berupa daftar poin) |
| product\_media | product\_id, path, alt, is\_primary, sort\_order |
| product\_documents | product\_id, title, file, type (brosur/izin edar/manual) |
| customers | name, institution, city, phone (E.164), email, notes |
| inquiries | code, customer\_id, source (utm\_\*, referrer, landing\_url), status, assigned\_to, deal\_value, closed\_at, notes |
| inquiry\_items | inquiry\_id, product\_id, product\_name\_snapshot, qty |
| service\_requests | code, customer\_id, equipment\_name, brand, model, serial\_number, issue, location, preference, status, technician\_id, estimated\_cost, scheduled\_at, completed\_at |
| service\_logs / service\_attachments | request\_id, status, note, user\_id, file |
| wa\_events | type (click/inquiry/service), product\_id, page\_url, utm\_\*, ip\_hash, created\_at |
| pages, posts, post\_categories, tags | konten, status, published\_at, seo\_\* |
| banners, promos, testimonials, faqs, galleries, legal\_documents | konten kelola admin dengan urutan dan status |
| settings | key-value (grup: company, whatsapp, seo, tracking, display) |
| wa\_templates | key, title, body |
| activity\_log | spatie/laravel-activitylog |

## 10. Arsitektur dan Tech Stack

| Lapisan | Pilihan |
| --- | --- |
| Backend | Laravel versi stabil terbaru (12.x atau lebih baru), PHP 8.3+ |
| Frontend | React + TypeScript lewat **Inertia.js** (Laravel React starter kit) |
| UI | Tailwind CSS v4 + **shadcn/ui** (basis komponen 21st.dev) + lucide-react |
| SEO rendering | **Inertia SSR** untuk halaman publik (agar konten terbaca Google), admin cukup CSR |
| Database | MySQL 8 / MariaDB (alternatif PostgreSQL); FULLTEXT untuk pencarian awal |
| Auth & peran | Laravel Fortify/starter kit auth, `spatie/laravel-permission`, 2FA untuk admin |
| Media | `spatie/laravel-medialibrary` + konversi WebP, thumbnail, lazy loading |
| Log | `spatie/laravel-activitylog` |
| Antrean & jadwal | Queue (database/Redis) + scheduler untuk laporan dan pembersihan |
| Cache | Redis atau file cache; cache halaman katalog dan sitemap |
| PDF | `barryvdh/laravel-dompdf` atau Browsershot untuk surat penawaran dan tanda terima |
| Analitik | GA4, Meta Pixel (opsional), event WhatsApp dikirim server dan client |
| Anti-spam | Cloudflare Turnstile + honeypot + `throttle` |
| Kualitas | Pest (test), Laravel Pint, ESLint/Prettier, Larastan |
| Deploy | VPS Ubuntu, Nginx, PHP-FPM, Supervisor (queue + SSR), Cloudflare, backup harian database dan storage |

**Struktur kode yang disarankan**

- `app/Models`, `app/Http/Controllers/{Public,Admin}`, `app/Http/Requests`, `app/Services` (WhatsAppLinkService, InquiryService, ServiceTicketService), `app/Policies`.
- `resources/js/pages/{public,admin}`, `resources/js/components/{ui,site,admin}`, `resources/js/lib`.
- Satu `WhatsAppLinkService` terpusat agar format nomor dan pesan konsisten di seluruh situs.

## 11. Desain dan Tema (21st.dev)

Tema memakai token yang Anda ambil dari 21st.dev (file CSS). Ketentuan penerapan:

- Simpan token (`:root`, `.dark`, `@theme inline`) di `resources/css/app.css`. Warna utama `--primary: #f2470c` (oranye), radius `--radius: 1.4rem`, font `Plus Jakarta Sans` (heading dan body). Mode gelap memakai kelas `.dark` dengan tombol pengganti tema.
- Gunakan semantic token (`bg-background`, `text-foreground`, `bg-primary`, `border-border`), **jangan menulis hex langsung** di komponen.
- Oranye tema selaras dengan oranye pada logo. Warna teal/biru logo boleh dipakai terbatas sebagai aksen sekunder (ikon kepercayaan, badge brand), bukan warna utama.
- Pakai **MCP 21st.dev** untuk menemukan dan menyesuaikan komponen (hero, navbar, bento/feature section, FAQ, testimonial, footer, tabel admin, form). Setiap komponen yang diambil harus disesuaikan ke token tema dan konten Indonesia.
- Gaya: bersih, lapang, kartu bersudut besar, tipografi tegas. Foto produk di latar putih.
- Aksesibilitas: kontras AA, fokus terlihat, label form, `alt` pada semua gambar, navigasi keyboard.

## 12. SEO dan Marketing

**SEO teknis**

- Inertia SSR untuk halaman publik; `<title>`, meta description, canonical, Open Graph, Twitter Card per halaman (dikelola dari admin dengan default otomatis).
- URL bersih: `/produk/{kategori}/{slug}`, `/brand/{slug}`, `/blog/{slug}`, `/layanan-servis`.
- **JSON-LD**: Organization/LocalBusiness (alamat, telepon, jam), Product (tanpa harga bila mode "hubungi"), BreadcrumbList, FAQPage, Article.
- `sitemap.xml` dinamis (produk, kategori, brand, artikel, halaman), `robots.txt`, redirect 301 saat slug berubah.
- Gambar WebP, `width/height`, lazy loading; target Core Web Vitals: LCP < 2,5 dtk, CLS < 0,1.
- Favicon dari `logo.ico` (disimpan sejajar `public/`), apple-touch-icon, `og:image` default.
- Google Search Console dan Google Business Profile ditautkan.

**Marketing**

- Blog edukasi (panduan memilih ventilator, perawatan alat, regulasi izin edar) dengan CTA WhatsApp.
- Halaman promo dan banner terjadwal (tanggal mulai/selesai otomatis).
- Pelacakan UTM pada semua lead; laporan sumber lead di dashboard.
- Integrasi GA4 dan Meta Pixel; event: `view_item`, `add_to_quote`, `whatsapp_click`, `inquiry_submit`, `service_submit`.
- Pesan WhatsApp broadcast dilakukan di luar sistem (fase awal); ekspor kontak berizin (opt-in).

## 13. Non-Fungsional

- **Keamanan:** validasi Form Request, CSRF, rate limit pada form dan login, 2FA admin, kebijakan akses (Policy), unggahan dibatasi tipe dan ukuran, sanitasi HTML konten, header keamanan, backup terenkripsi.
- **Privasi (UU PDP):** persetujuan pada form, kebijakan privasi, hash IP pada pelacakan, hapus data atas permintaan, batasi akses data pelanggan menurut peran.
- **Performa:** cache query katalog, eager loading, indeks database, antrean untuk tugas berat, CDN Cloudflare.
- **Ketersediaan:** monitoring uptime, log error (Sentry/Flare), pemulihan dari backup diuji.
- **Kompatibilitas:** responsif 360 px sampai desktop; browser modern (Chrome, Safari, Edge, Firefox dua versi terakhir).
- **Konten legal:** klaim seperti "izin edar Kemenkes RI" hanya ditampilkan bila dokumennya ada di halaman Legalitas.

## 14. Fase Pengembangan dan Kriteria Penerimaan

### Fase 0: Fondasi

Setup repo Laravel + React starter kit, token tema 21st.dev, layout publik dan admin, auth, peran, CI sederhana, seeder awal.

### Fase 1: MVP Katalog dan Lead (prioritas tertinggi)

- Kategori, brand, produk (CRUD admin) dan impor 70 produk awal dari CSV/JSON.
- Situs publik: beranda, tentang, katalog, detail produk, kontak.
- Daftar penawaran + inquiry via WhatsApp + tombol WhatsApp melayang.
- Admin: dashboard dasar, daftar dan detail inquiry, status, pelanggan.
- SEO dasar: meta, sitemap, robots, JSON-LD Organization dan Product.

**Kriteria penerimaan Fase 1**

- Pengunjung dapat menambahkan 3 produk ke daftar, mengisi form, dan WhatsApp terbuka dengan pesan benar; inquiry tersimpan dengan item dan sumber UTM.
- Admin dapat menambah produk lengkap dengan 5 foto dan spesifikasi, lalu produk muncul di situs dalam < 1 menit.
- Halaman katalog dan detail lulus Lighthouse mobile: Performance >= 85, SEO >= 95.

### Fase 2: Servis dan Perbaikan

- Halaman layanan, form servis (dengan unggah foto), tiket, cek status publik, modul servis di admin dengan timeline dan penugasan teknisi, cetak tanda terima PDF.

**Kriteria penerimaan Fase 2**

- Tiket tercipta dengan kode unik, WhatsApp terbuka dengan ringkasan, cek status hanya menampilkan data tiket yang benar (kode + 4 digit nomor).
- Perubahan status tercatat dengan waktu dan pelaku.

### Fase 3: Marketing dan Konten

- Blog, promo, banner terjadwal, testimoni, FAQ, galeri, legalitas, halaman kategori/brand SEO.
- Pelacakan klik WhatsApp, laporan sumber lead, integrasi GA4/Meta Pixel.

### Fase 4: Penyempurnaan

- Surat penawaran PDF, pengingat follow-up, laporan bulanan, pencarian lebih cerdas (Meilisearch), opsional WhatsApp Business API untuk notifikasi status, versi bahasa Inggris.

## 15. Panduan untuk Agent opencode

Simpan sebagai `AGENTS.md` di akar repo agar agent selalu membacanya.

```
# AGENTS.md
Proyek: Website jual-beli, servis, dan company profile alat kesehatan (PT. Mandalika Global Alkesindo).
Stack: Laravel (terbaru) + Inertia + React + TypeScript + Tailwind v4 + shadcn/ui. Database MySQL.
Aturan utama:
1. Tidak ada pembayaran online. Semua deal lewat WhatsApp via WhatsAppLinkService.
2. Nomor WhatsApp, alamat, jam kerja diambil dari tabel settings, jangan hardcode.
3. Pakai token tema di resources/css/app.css (semantic class), jangan hex langsung.
4. Cari komponen UI lewat MCP 21st.dev lebih dulu, lalu sesuaikan ke tema dan bahasa Indonesia.
5. Semua form: Form Request, throttle, anti-spam, persetujuan privasi.
6. Halaman publik wajib SSR-ready (tanpa window/document saat render awal) dan punya SEO meta.
7. Setiap fitur: tulis test Pest, jalankan pint dan eslint sebelum selesai.
8. Perubahan data penting wajib tercatat di activity log.
9. Bahasa antarmuka: Indonesia. Kode dan nama tabel: Inggris.
Perintah: composer dev | php artisan test | npm run lint | npm run build
Definition of Done: lolos test, responsif 360px, a11y dasar, seeder/migrasi berjalan, dokumentasi singkat di README.
```

**Urutan prompt yang disarankan**

1. "Baca PRD ini. Buat rencana Fase 0 dan Fase 1 sebagai daftar tugas, jangan menulis kode dulu."
2. "Kerjakan Fase 0: instal starter kit, pasang token tema, layout publik dan admin, peran dan izin."
3. "Buat skema database dan migrasi sesuai bagian 9, plus seeder 70 produk dari `database/seeders/data/products.json`."
4. "Bangun modul produk admin (CRUD, media, spesifikasi poin) dengan komponen dari 21st.dev."
5. "Bangun katalog publik, detail produk, daftar penawaran, dan WhatsAppLinkService."
6. Lanjutkan per fase, selalu minta test dan ringkasan perubahan di akhir tiap tugas.

## 16. Pertanyaan Terbuka dan Risiko

| Pertanyaan / Risiko | Keputusan yang dibutuhkan |
| --- | --- |
| Tampilkan harga atau "hubungi untuk harga"? | Per produk atau global |
| Berapa nomor WhatsApp dan pembagian per departemen (penjualan, servis)? | Daftar nomor + jam kerja |
| Dokumen legalitas apa yang boleh dipublikasikan (NIB, izin distribusi, surat penunjukan brand)? | Unggah dokumen; klaim hanya jika ada bukti |
| Wilayah dan syarat layanan servis (on-site, kirim alat, garansi, SLA)? | Isi halaman layanan dan FAQ |
| Apakah alat bekas/sparepart juga dijual? | Menentukan kategori dan atribut tambahan |
| Foto produk resolusi tinggi dari brand | Foto katalog saat ini beresolusi terbatas |
| Email resmi untuk notifikasi dan formulir kontak | Perlu konfigurasi SMTP dan domain |
| Risiko spam pada form dan klik WhatsApp palsu | Mitigasi: Turnstile, rate limit, peninjauan lead |
| Ketergantungan pada satu nomor WhatsApp (blokir/limit) | Siapkan beberapa nomor dan nomor cadangan |

## 17. Lampiran dan Aset Awal

- **Data produk awal:** 70 produk (jenis, brand/model, deskripsi lengkap, urutan sesuai katalog KJAP 2026) dapat diekspor ke `products.json` atau CSV untuk seeder.
- **Foto produk:** potongan foto dari katalog PDF (resolusi terbatas); ganti dengan foto brand saat tersedia.
- **Logo:** `logo.png` (dan `logo.ico` untuk favicon), palet oranye-teal-biru.
- **Tema:** token 21st.dev (primary #f2470c, radius 1.4rem, Plus Jakarta Sans, mode gelap).
- **Referensi desain sebelumnya:** prototipe e-catalogue/company profile yang sudah dibuat (struktur bagian: header, hero + trust bar, kategori, tentang, produk unggulan, statistik, alur kerja, testimoni, FAQ, brand partner, CTA, footer, tombol WhatsApp melayang).
