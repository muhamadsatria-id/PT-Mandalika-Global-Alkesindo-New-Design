# PRD — PT. Mandalika Global Alkesindo (Sistem yang Sudah Diterapkan)

## 1. Ringkasan Produk

**PT. Mandalika Global Alkesindo** adalah aplikasi web full-stack untuk perusahaan distributor dan supplier alat kesehatan. Sistem menyediakan website publik, katalog produk, layanan servis alat kesehatan, permintaan penawaran, halaman legalitas, galeri, dan panel admin/CMS.

Sistem ini tidak memproses pembayaran online. Semua penawaran, servis, dan tindak lanjut dilakukan langsung bersama tim perusahaan melalui WhatsApp dan komunikasi resmi.

---

## 2. Stack Teknologi

### Backend
- PHP 8.4
- Laravel 13
- Inertia.js v3
- Pest PHP
- SQLite default / MySQL lokal
- Laravel Boost, Wayfinder

### Frontend
- React 19
- Inertia.js v3
- Tailwind CSS v4
- Vite (vite-plus)
- TypeScript strict mode
- React Compiler

### Infrastruktur & Tooling
- Pint (PHP formatter)
- PHPStan level 7
- TypeScript type check
- Pest tests
- Vite build

---

## 3. Arsitektur Aplikasi

### Layout publik
- `PublicLayout` digunakan untuk semua halaman publik.
- Header navigasi, footer, WhatsApp floating button, dan SEO global berada di layout ini.

### Layout admin
- `AdminLayout` digunakan untuk halaman admin.
- Sidebar navigasi berbasis permission.
- Admin bundle lazy-loaded agar terpisah dari bundle publik.

### Routing
- Semua URL frontend menggunakan Wayfinder (`@/routes`, `@/actions`).
- Tidak ada URL hardcoded di frontend.

---

## 4. Fitur Publik

### 4.1 Beranda (`/`)
- Hero section.
- Badge legalitas: Izin Edar AKL, E-Katalog LKPP, CDAKB, Distributor Resmi.
- Section produk unggulan.
- Section layanan: pengadaan, servis, pendampingan teknis.
- Section alur kerja 3 langkah.
- Section lokasi dan peta.
- Section CTA penawaran/servis.
- Section testimoni klien.
- Section FAQ.
- Footer global.

### 4.2 Katalog (`/katalog`)
- Filter kategori.
- Filter brand principal.
- Pencarian produk.
- Sorting.
- Grid produk.
- Pagination.
- Empty state.
- CTA alternatif.

### 4.3 Detail Produk (`/produk/{category}/{product}`)
- Informasi produk: nama, brand, model, SKU, deskripsi, harga, status stok.
- Spesifikasi produk.
- Dokumen produk: brosur, izin edar, manual.
- Produk terkait.
- CTA Tanya via WhatsApp.
- CTA Tambah ke penawaran.
- SEO meta dan JSON-LD produk.

### 4.4 Tentang Kami (`/tentang`)
- Profil perusahaan.
- Visi dan misi.
- Nilai perusahaan.
- Lingkup kerja.
- CTA siap bermitra.
- Informasi kontak dan jam operasional.

### 4.5 Legalitas (`/legalitas`)
- Grid dokumen dan sertifikasi.
- CTA permintaan dokumen tender.
- Catatan komitmen kepatuhan regulasi.

### 4.6 Galeri (`/galeri`)
- Filter kategori galeri.
- Grid foto/video dokumentasi.
- CTA jadwalkan demo.

### 4.7 Brands (`/brands`)
- Daftar brand principal dan mitra resmi.

### 4.8 Kontak (`/kontak`)
- Informasi kontak perusahaan.
- Jam operasional.
- Peta.
- Formulir interaktif yang mengarahkan ke WhatsApp.

### 4.9 Layanan Servis (`/layanan-servis`)
- Form pengajuan servis.
- Upload foto/video.
- Pilihan preferensi penanganan.
- Consent dan honeypot.
- Turnstile opsional jika dikonfigurasi.
- Tiket servis dengan format `SRV-YYYY-#####`.

### 4.10 Cek Status Servis (`/layanan-servis/status`)
- Cek status menggunakan kode tiket dan 4 digit terakhir nomor WhatsApp.
- Menampilkan status, timeline, jadwal, dan informasi aman.
- Tidak menampilkan catatan internal atau nomor telepon lengkap.

### 4.11 Halaman Tiket Terkirim (`/layanan-servis/terkirim`)
- Menampilkan kode tiket.
- Ringkasan permintaan.
- Link WhatsApp.
- CTA cek status.

### 4.12 Penawaran (`/penawaran`)
- Keranjang penawaran client-side (`localStorage` key `mga.quote.v1`).
- Tambah/kurangi/hapus produk.
- Form data pemohon.
- Consent dan honeypot.
- Turnstile opsional.
- Server merekalkulasi snapshot harga.

### 4.13 Penawaran Terkirim (`/penawaran/terkirim`)
- Menampilkan kode permintaan.
- Ringkasan permintaan.
- Link WhatsApp.

### 4.14 Kebijakan Privasi (`/kebijakan-privasi`)
- Halaman legal copy privasi.

---

## 5. Fitur Admin & CMS

### 5.1 Dashboard
- Ringkasan operasional admin.

### 5.2 Produk
- CRUD produk.
- Kategori, brand, SKU, model, harga, mode harga, status stok, featured, published.
- Media produk.
- Spesifikasi produk.
- Dokumen produk.

### 5.3 Kategori
- CRUD kategori produk.

### 5.4 Brand
- CRUD brand principal.
- Logo, deskripsi, SEO, status aktif, sort order.

### 5.5 Inquiry
- List dan detail inquiry.
- Update status, assignee, deal value, catatan.
- Lihat item penawaran.

### 5.6 Customer
- List dan detail customer.
- Riwayat inquiry dan servis.

### 5.7 Servis
- List servis dengan filter dan statistik.
- Detail servis.
- Timeline status.
- Teknisi, jadwal, estimasi biaya, catatan.
- Lampiran privat.
- PDF receipt.
- Link WhatsApp.

### 5.8 Legalitas
- CRUD dokumen legalitas.
- Upload file.
- Tipe dokumen, penerbit, tanggal terbit, status publish, sort order.

### 5.9 Galeri
- CRUD kategori galeri.
- CRUD item galeri foto/video.
- Alt text, deskripsi, status publish, sort order.

### 5.10 Testimoni
- CRUD testimoni.
- Nama, jabatan, institusi, quote, avatar, rating, status publish, sort order.

### 5.11 FAQ
- CRUD FAQ.
- Pertanyaan, jawaban, status publish, sort order.

### 5.12 Partner Brands
- CRUD brand principal untuk tampilan publik.
- Logo, URL, status aktif, sort order.

### 5.13 Statistik Perusahaan
- CRUD statistik beranda.
- Label, nilai, status publish, sort order.

### 5.14 Pengaturan Perusahaan
- Nama perusahaan.
- Tagline.
- Alamat.
- Kota.
- Jam operasional.
- Email perusahaan.
- Email sekunder.
- WhatsApp utama, sales, servis.
- Media sosial: Instagram, Facebook, TikTok, YouTube, LinkedIn.
- Mode harga default.
- SEO title dan description.

---

## 6. Model Data Utama

### Produk
- `Product`
- `Category`
- `Brand`
- `ProductMedia`
- `ProductSpec`
- `ProductDocument`

### Lead & Servis
- `Inquiry`
- `InquiryItem`
- `Customer`
- `ServiceRequest`
- `ServiceLog`
- `ServiceAttachment`

### Konten CMS
- `LegalDocument`
- `GalleryCategory`
- `GalleryItem`
- `Testimonial`
- `Faq`
- `PartnerBrand`
- `CompanyStat`

### Sistem
- `Setting`
- `User`
- `WaEvent`
- `WaTemplate`

---

## 7. SEO & Metadata

- Meta title, description, canonical URL.
- Open Graph tags.
- JSON-LD Organization.
- JSON-LD Person developer (hanya di kode, tidak tampil publik).
- Sitemap XML otomatis.
- Robots.txt.
- Auto-slug untuk produk, kategori, galeri, legalitas, partner brand.
- SEO kategori produk jika tersedia.

---

## 8. Keamanan & Validasi

- Form Request validation.
- Throttling pada form publik.
- Honeypot.
- Turnstile/reCAPTCHA opsional, hanya aktif jika secret dikonfigurasi.
- Privacy consent wajib.
- Upload file dengan validasi mime dan ukuran.
- Lampiran servis disimpan di disk privat dan diakses lewat route terautentikasi.
- Status servis publik tidak menampilkan catatan internal atau nomor telepon lengkap.

---

## 9. Flow Penawaran

1. User menambah produk ke keranjang client-side.
2. User mengisi form data pemohon.
3. Server menyimpan customer, inquiry, items, dan WA event.
4. Session menyimpan inquiry terakhir.
5. Redirect ke halaman penawaran terkirim.
6. WhatsApp dibuka otomatis setelah 1.2 detik.

---

## 10. Flow Servis

1. User mengisi form servis.
2. Server membuat `ServiceRequest` dengan kode `SRV-YYYY-#####`.
3. `ServiceLog` awal dibuat otomatis.
4. User diarahkan ke halaman tiket terkirim.
5. User dapat cek status dengan kode tiket + 4 digit terakhir nomor WhatsApp.
6. Admin mengelola status, teknisi, jadwal, biaya, catatan, dan lampiran.
7. PDF receipt dapat diunduh tanpa catatan internal.

---

## 11. Zona Waktu

- Timezone aplikasi: `Asia/Makassar` (WITA).
- Admin menggunakan `scheduled_at_local`.
- Format tanggal/waktu dipaksa ke WITA.

---

## 12. Anti-Slop UI/UX

- Tidak ada teks fungsional di bawah 11px.
- Tidak ada uppercase berlebihan pada paragraf panjang.
- Tidak ada card-in-card.
- Mono hanya untuk data teknis/status/data.
- Plus Jakarta Sans sebagai font utama.
- Responsive dari 360px hingga 1440px.
- Tidak ada horizontal overflow.

---

## 13. Verifikasi yang Telah Dilakukan

- `npm run check`
- `npm run types:check`
- `npm run build`
- `composer lint:check`
- `composer types:check`
- `php artisan test --compact`
- Audit browser di 360px dan 1440px
- Lighthouse production-like build

Hasil terakhir:
- 80 tests passed
- 777 assertions
- 0 style issues
- 0 TypeScript errors
- 0 PHPStan errors

---

## 14. Batasan & Catatan

- Tidak ada pembayaran online.
- WhatsApp-first flow.
- Data perusahaan masih placeholder pada seed awal.
- Wayfinder files gitignored dan diregenerasi oleh Vite plugin.
- SSR dinonaktifkan (`INERTIA_SSR_ENABLED=false`).
- Git branch `master` belum memiliki commit; semua file masih untracked.