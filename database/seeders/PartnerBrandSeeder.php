<?php

namespace Database\Seeders;

use App\Models\PartnerBrand;
use Illuminate\Database\Seeder;

class PartnerBrandSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'name' => 'Omron',
                'slug' => 'omron',
                'logo' => null,
                'url' => 'https://www.omron.com',
                'is_active' => true,
                'sort_order' => 10,
            ],
            [
                'name' => 'Yuwell',
                'slug' => 'yuwell',
                'logo' => null,
                'url' => 'https://www.yuwell.com',
                'is_active' => true,
                'sort_order' => 20,
            ],
        ];

        foreach ($items as $item) {
            PartnerBrand::query()->updateOrCreate(
                ['slug' => $item['slug']],
                $item,
            );
        }
    }
}
