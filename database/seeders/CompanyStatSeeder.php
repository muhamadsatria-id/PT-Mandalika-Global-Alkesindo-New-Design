<?php

namespace Database\Seeders;

use App\Models\CompanyStat;
use Illuminate\Database\Seeder;

class CompanyStatSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['label' => 'Tahun Berdiri', 'value' => '2026', 'sort_order' => 1, 'is_published' => true],
            ['label' => 'Unit Terpasang', 'value' => '1200', 'sort_order' => 2, 'is_published' => true],
            ['label' => 'Fasilitas Kesehatan Dilayani', 'value' => '321', 'sort_order' => 3, 'is_published' => true],
            ['label' => 'Jumlah Brand', 'value' => '9', 'sort_order' => 4, 'is_published' => true],
            ['label' => 'Jumlah Produk', 'value' => '70', 'sort_order' => 5, 'is_published' => true],
        ];

        foreach ($items as $item) {
            CompanyStat::query()->updateOrCreate(
                ['label' => $item['label']],
                $item,
            );
        }
    }
}
