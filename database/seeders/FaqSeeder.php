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
                'answer' => 'Ya. Dokumen legalitas dan izin edar dapat diminta melalui halaman Legalitas atau tim penjualan.',
                'is_published' => true,
                'sort_order' => 10,
            ],
            [
                'question' => 'Bagaimana cara mengajukan servis alat?',
                'answer' => 'Isi formulir layanan servis, lalu pantau status tiket menggunakan kode tiket dan 4 digit terakhir nomor WhatsApp.',
                'is_published' => true,
                'sort_order' => 20,
            ],
            [
                'question' => 'Apakah tersedia pengiriman ke luar pulau?',
                'answer' => 'Ya. Kami melayani pengiriman dan instalasi ke seluruh Indonesia sesuai kesepakatan jadwal.',
                'is_published' => true,
                'sort_order' => 30,
            ],
            [
                'question' => 'Apakah harga sudah termasuk instalasi?',
                'answer' => 'Ruang lingkup instalasi dan pendampingan teknis akan dijelaskan dalam penawaran sesuai unit dan lokasi.',
                'is_published' => true,
                'sort_order' => 40,
            ],
            [
                'question' => 'Bagaimana cara meminta penawaran?',
                'answer' => 'Gunakan tombol minta penawaran atau hubungi tim kami lewat WhatsApp untuk menyusun penawaran yang sesuai.',
                'is_published' => true,
                'sort_order' => 50,
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
