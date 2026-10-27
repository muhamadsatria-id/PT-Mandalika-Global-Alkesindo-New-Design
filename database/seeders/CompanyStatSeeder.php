<?php

namespace Database\Seeders;

use App\Models\CompanyStat;
use Illuminate\Database\Seeder;

class CompanyStatSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['label' => 'Produk katalog', 'value' => '50+', 'is_published' => true, 'sort_order' => 10],
            ['label' => 'Rumah sakit & klinik mitra', 'value' => '100+', 'is_published' => true, 'sort_order' => 20],
            ['label' => 'Layanan servis', 'value' => '24/7', 'is_published' => true, 'sort_order' => 30],
        ];

        foreach ($items as $item) {
            CompanyStat::query()->updateOrCreate(
                ['label' => $item['label']],
                $item,
            );
        }
    }
}
