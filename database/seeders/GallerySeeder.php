<?php

namespace Database\Seeders;

use App\Models\GalleryCategory;
use App\Models\GalleryItem;
use Illuminate\Database\Seeder;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Instalasi', 'slug' => 'instalasi', 'sort_order' => 10, 'is_active' => true],
            ['name' => 'Pameran', 'slug' => 'pameran', 'sort_order' => 20, 'is_active' => true],
            ['name' => 'Pelatihan', 'slug' => 'pelatihan', 'sort_order' => 30, 'is_active' => true],
            ['name' => 'Gudang', 'slug' => 'gudang', 'sort_order' => 40, 'is_active' => true],
        ];

        foreach ($categories as $category) {
            GalleryCategory::query()->updateOrCreate(
                ['slug' => $category['slug']],
                $category,
            );
        }

        $items = [
            [
                'category' => 'instalasi',
                'title' => 'Instalasi peralatan di klinik mitra',
                'slug' => 'instalasi-klinik-mitra',
                'description' => 'Dokumentasi instalasi dan uji fungsi alat kesehatan.',
                'file' => '/storage/gallery/instalasi-1.jpg',
                'type' => 'photo',
                'alt' => 'Instalasi alat kesehatan di klinik',
                'is_published' => true,
                'sort_order' => 10,
            ],
            [
                'category' => 'pameran',
                'title' => 'Pameran alat kesehatan',
                'slug' => 'pameran-alkes',
                'description' => 'Kegiatan pameran dan demo produk.',
                'file' => '/storage/gallery/pameran-1.jpg',
                'type' => 'photo',
                'alt' => 'Booth pameran alat kesehatan',
                'is_published' => true,
                'sort_order' => 20,
            ],
            [
                'category' => 'pelatihan',
                'title' => 'Pelatihan penggunaan alat',
                'slug' => 'pelatihan-penggunaan-alat',
                'description' => 'Pelatihan teknis untuk tenaga kesehatan.',
                'file' => '/storage/gallery/pelatihan-1.jpg',
                'type' => 'photo',
                'alt' => 'Pelatihan penggunaan alat kesehatan',
                'is_published' => true,
                'sort_order' => 30,
            ],
        ];

        foreach ($items as $item) {
            $category = GalleryCategory::query()->where('slug', $item['category'])->first();

            GalleryItem::query()->updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'gallery_category_id' => $category?->id,
                    'title' => $item['title'],
                    'slug' => $item['slug'],
                    'description' => $item['description'],
                    'file' => $item['file'],
                    'type' => $item['type'],
                    'alt' => $item['alt'],
                    'is_published' => $item['is_published'],
                    'sort_order' => $item['sort_order'],
                ],
            );
        }
    }
}
