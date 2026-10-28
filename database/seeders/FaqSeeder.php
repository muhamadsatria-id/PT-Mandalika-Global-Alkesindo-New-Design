<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'question' => 'Apakah produk memiliki izin edar Kemenkes RI?',
                'answer' => 'Izin edar melekat pada setiap produk. Nomor izin edar dapat dilihat di halaman detail produk atau diminta melalui tim kami. Dokumen perusahaan tersedia di halaman Legalitas.',
                'sort_order' => 1,
                'is_published' => true,
            ],
            [
                'question' => 'Bagaimana cara mengajukan servis alat?',
                'answer' => 'Hubungi kami lewat WhatsApp dan sebutkan jenis alat, brand, model, nomor seri, serta foto atau video kendala. Tim akan menentukan langkah pengecekan berikutnya.',
                'sort_order' => 2,
                'is_published' => true,
            ],
            [
                'question' => 'Apakah tersedia pengiriman ke luar pulau?',
                'answer' => 'Ya, kami melayani pengiriman ke seluruh Indonesia. Biaya dan waktu dibahas saat penawaran.',
                'sort_order' => 3,
                'is_published' => true,
            ],
            [
                'question' => 'Apakah harga sudah termasuk instalasi?',
                'answer' => 'Rincian termasuk/tidak termasuk instalasi dicantumkan dalam penawaran.',
                'sort_order' => 4,
                'is_published' => true,
            ],
            [
                'question' => 'Bagaimana cara meminta penawaran?',
                'answer' => 'Tambahkan produk ke daftar penawaran, lalu kirim lewat formulir atau WhatsApp. Sebutkan nama instansi, kota, dan jumlah unit.',
                'sort_order' => 5,
                'is_published' => true,
            ],
            [
                'question' => 'Apakah ada pembayaran online?',
                'answer' => 'Kami tidak memproses pembayaran online. Penawaran dan transaksi disepakati langsung bersama tim kami.',
                'sort_order' => 6,
                'is_published' => true,
            ],
            [
                'question' => 'Apakah harga di katalog dapat berubah?',
                'answer' => 'Harga mengikuti price list yang berlaku dan dapat berubah. Harga belum termasuk PPN dan ongkos kirim.',
                'sort_order' => 7,
                'is_published' => true,
            ],
        ];

        foreach ($items as $item) {
            Faq::query()->updateOrCreate(
                ['question' => $item['question']],
                $item,
            );
        }
    }
}
