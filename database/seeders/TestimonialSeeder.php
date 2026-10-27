<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'name' => 'Tim Rumah Sakit Mitra',
                'role' => 'Manajer Pengadaan',
                'institution' => 'Rumah Sakit Mitra',
                'quote' => 'Pendampingan pengadaan dan servis alat berjalan rapi, responsif, dan sesuai kebutuhan fasilitas kami.',
                'avatar' => null,
                'rating' => 5,
                'is_published' => true,
                'sort_order' => 10,
            ],
        ];

        foreach ($items as $item) {
            Testimonial::query()->updateOrCreate(
                ['name' => $item['name'], 'institution' => $item['institution']],
                $item,
            );
        }
    }
}
