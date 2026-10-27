<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductSpec;
use Database\Seeders\ProductCatalogSeeder;

test('seeder katalog memuat 70 produk unik yang terbit', function () {
    $this->seed(ProductCatalogSeeder::class);

    expect(Product::query()->count())->toBe(70)
        ->and(Product::query()->where('is_published', true)->count())->toBe(70)
        ->and(Category::query()->count())->toBe(8)
        ->and(Brand::query()->count())->toBe(15)
        ->and(ProductSpec::query()->count())->toBe(210)
        ->and(Product::query()->distinct()->count('slug'))->toBe(70)
        ->and(Product::query()->distinct()->count('sku'))->toBe(70);
});

test('seeder katalog aman dijalankan ulang tanpa duplikasi', function () {
    $this->seed(ProductCatalogSeeder::class);
    $this->seed(ProductCatalogSeeder::class);

    expect(Product::query()->count())->toBe(70)
        ->and(Category::query()->count())->toBe(8)
        ->and(Brand::query()->count())->toBe(15)
        ->and(ProductSpec::query()->count())->toBe(210);
});

test('produk bermode contact menyembunyikan harga', function () {
    $this->seed(ProductCatalogSeeder::class);

    $contactProduct = Product::query()->where('price_mode', 'contact')->firstOrFail();
    $pricedProduct = Product::query()->where('price_mode', 'show')->firstOrFail();

    expect($contactProduct->displayPrice())->toBeNull()
        ->and($pricedProduct->displayPrice())->toBeString()
        ->and($pricedProduct->displayPrice())->toStartWith('Rp ');
});
