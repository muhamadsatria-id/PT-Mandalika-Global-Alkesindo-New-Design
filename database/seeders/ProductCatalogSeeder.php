<?php

namespace Database\Seeders;

use App\Enums\PriceMode;
use App\Enums\StockStatus;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductCatalogSeeder extends Seeder
{
    /**
     * Mengisi kategori, brand, dan 70 produk awal dari data/products.json.
     */
    public function run(): void
    {
        $path = database_path('seeders/data/products.json');
        $contents = file_get_contents($path);

        if ($contents === false) {
            $this->command?->error('Berkas data produk tidak ditemukan: '.$path);

            return;
        }

        /** @var array{
         *     categories: array<int, array{name: string, slug: string, description: string, icon: string}>,
         *     brands: array<int, array{name: string, slug: string, description: string}>,
         *     products: array<int, array{
         *         name: string, model: string, brand: string, category: string, sku: string,
         *         price: int|null, price_mode: string, stock_status: string, is_featured: bool,
         *         short_description: string, description: string,
         *         specs: array<int, array{label: string, value: string}>
         *     }>
         * } $data
         */
        $data = json_decode($contents, true, 512, JSON_THROW_ON_ERROR);

        DB::transaction(function () use ($data): void {
            $categorySlugs = [];
            $brandSlugs = [];

            foreach ($data['categories'] as $categoryData) {
                Category::query()->updateOrCreate(
                    ['slug' => $categoryData['slug']],
                    [
                        'name' => $categoryData['name'],
                        'description' => $categoryData['description'],
                        'icon' => $categoryData['icon'],
                        'is_active' => true,
                    ],
                );

                $categorySlugs[$categoryData['name']] = $categoryData['slug'];
            }

            foreach ($data['brands'] as $brandData) {
                Brand::query()->updateOrCreate(
                    ['slug' => $brandData['slug']],
                    [
                        'name' => $brandData['name'],
                        'description' => $brandData['description'],
                        'is_active' => true,
                    ],
                );

                $brandSlugs[$brandData['name']] = $brandData['slug'];
            }

            foreach ($data['products'] as $productData) {
                $category = Category::query()
                    ->where('slug', $categorySlugs[$productData['category']] ?? '')
                    ->firstOrFail();

                $brand = Brand::query()
                    ->where('slug', $brandSlugs[$productData['brand']] ?? '')
                    ->firstOrFail();

                $priceMode = PriceMode::from($productData['price_mode']);
                $stockStatus = StockStatus::from($productData['stock_status']);

                $product = Product::query()->updateOrCreate(
                    ['sku' => $productData['sku']],
                    [
                        'category_id' => $category->id,
                        'brand_id' => $brand->id,
                        'name' => $productData['name'],
                        'model' => $productData['model'],
                        'slug' => Str::slug($productData['name'].' '.$productData['model']),
                        'short_description' => $productData['short_description'],
                        'description' => $productData['description'],
                        'price' => $productData['price'],
                        'price_mode' => $priceMode,
                        'stock_status' => $stockStatus,
                        'is_featured' => $productData['is_featured'],
                        'is_published' => true,
                    ],
                );

                $product->specs()->delete();

                foreach (array_values($productData['specs']) as $index => $spec) {
                    $product->specs()->create([
                        'label' => $spec['label'],
                        'value' => $spec['value'],
                        'sort_order' => $index + 1,
                    ]);
                }
            }
        });

        $this->command?->info('Katalog awal dimuat: '.count($data['products']).' produk.');
    }
}
