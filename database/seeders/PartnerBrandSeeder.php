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
                'name' => 'BISOND',
                'slug' => 'bisond',
                'logo' => null,
                'url' => null,
                'is_active' => true,
                'sort_order' => 10,
            ],
            [
                'name' => 'BOSKA',
                'slug' => 'boska',
                'logo' => null,
                'url' => null,
                'is_active' => true,
                'sort_order' => 20,
            ],
            [
                'name' => 'VINNO',
                'slug' => 'vinno',
                'logo' => null,
                'url' => null,
                'is_active' => true,
                'sort_order' => 30,
            ],
            [
                'name' => 'DENKI',
                'slug' => 'denki',
                'logo' => null,
                'url' => null,
                'is_active' => true,
                'sort_order' => 40,
            ],
            [
                'name' => 'TAKTVOLL',
                'slug' => 'taktvoll',
                'logo' => null,
                'url' => null,
                'is_active' => true,
                'sort_order' => 50,
            ],
            [
                'name' => 'DMS',
                'slug' => 'dms',
                'logo' => null,
                'url' => null,
                'is_active' => true,
                'sort_order' => 60,
            ],
            [
                'name' => 'PROSOND',
                'slug' => 'prosond',
                'logo' => null,
                'url' => null,
                'is_active' => true,
                'sort_order' => 70,
            ],
            [
                'name' => 'LIQIAN',
                'slug' => 'liqian',
                'logo' => null,
                'url' => null,
                'is_active' => true,
                'sort_order' => 80,
            ],
            [
                'name' => 'MINSTON',
                'slug' => 'minston',
                'logo' => null,
                'url' => null,
                'is_active' => true,
                'sort_order' => 90,
            ],
            [
                'name' => 'Z9 PREMIUM',
                'slug' => 'z9-premium',
                'logo' => null,
                'url' => null,
                'is_active' => true,
                'sort_order' => 100,
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
