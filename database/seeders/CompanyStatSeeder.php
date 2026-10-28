<?php

namespace DatabaseSeeders;

use AppModelsCompanyStat;
use IlluminateDatabaseSeeder;

class CompanyStatSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['label' => 'Tahun Berdiri', 'value' => '2026', 'sort_order' => 1, 'is_active' => true],
            ['label' => 'Unit Terpasang', 'value' => '1200', 'sort_order' => 2, 'is_active' => true],
            ['label' => 'Fasilitas Kesehatan Dilayani', 'value' => '321', 'sort_order' => 3, 'is_active' => true],
            ['label' => 'Jumlah Brand', 'value' => '9', 'sort_order' => 4, 'is_active' => true],
            ['label' => 'Jumlah Produk', 'value' => '70', 'sort_order' => 5, 'is_active' => true],
        ];

        foreach ($items as $item) {
            CompanyStat::query()->updateOrCreate(
                ['label' => $item['label']],
                $item,
            );
        }
    }
}
