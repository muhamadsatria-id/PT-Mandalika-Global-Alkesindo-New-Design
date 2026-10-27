<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use Inertia\Testing\AssertableInertia as Assert;

function catalogProduct(array $attributes = []): Product
{
    $category = isset($attributes['category_id'])
        ? null
        : Category::factory()->create(['is_active' => true]);

    return Product::factory()->create([
        'category_id' => $category?->id,
        'is_published' => true,
        ...$attributes,
    ]);
}

test('katalog hanya menampilkan produk terbit sesuai kategori', function () {
    $category = Category::factory()->create([
        'name' => 'Monitoring',
        'slug' => 'monitoring',
        'is_active' => true,
    ]);
    $otherCategory = Category::factory()->create(['is_active' => true]);

    $published = catalogProduct([
        'category_id' => $category->id,
        'name' => 'Patient Monitor',
        'is_published' => true,
    ]);
    catalogProduct([
        'category_id' => $category->id,
        'name' => 'Draft Monitor',
        'is_published' => false,
    ]);
    catalogProduct([
        'category_id' => $otherCategory->id,
        'name' => 'USG Portable',
        'is_published' => true,
    ]);

    $this->get(route('catalog.index', ['kategori' => 'monitoring']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/catalog')
            ->where('filters.kategori', 'monitoring')
            ->where('products.total', 1)
            ->has('products.data', 1)
            ->where('products.data.0.id', $published->id)
            ->where('products.data.0.name', 'Patient Monitor')
        );
});

test('katalog dapat dicari berdasarkan nama, brand, dan status stok', function () {
    $brand = Brand::factory()->create(['name' => 'Mindray']);
    $category = Category::factory()->create(['is_active' => true]);

    $matching = catalogProduct([
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'name' => 'Patient Monitor Pro',
        'stock_status' => 'Ready',
    ]);
    catalogProduct([
        'category_id' => $category->id,
        'name' => 'Infusion Pump',
        'stock_status' => 'Indent',
    ]);

    $this->get(route('catalog.index', ['q' => 'mindray', 'stok' => 'Ready']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('products.total', 1)
            ->where('products.data.0.id', $matching->id)
            ->where('filters.q', 'mindray')
            ->where('filters.stok', 'Ready')
        );
});

test('katalog menampilkan opsi filter hanya dari kategori dan brand aktif', function () {
    $activeCategory = Category::factory()->create([
        'name' => 'Aktif',
        'is_active' => true,
    ]);
    $inactiveCategory = Category::factory()->create([
        'name' => 'Nonaktif',
        'is_active' => false,
    ]);
    $activeBrand = Brand::factory()->create([
        'name' => 'Brand Aktif',
        'is_active' => true,
    ]);
    $inactiveBrand = Brand::factory()->create([
        'name' => 'Brand Nonaktif',
        'is_active' => false,
    ]);

    catalogProduct([
        'category_id' => $activeCategory->id,
        'brand_id' => $activeBrand->id,
    ]);
    catalogProduct([
        'category_id' => $inactiveCategory->id,
        'brand_id' => $inactiveBrand->id,
    ]);

    $this->get(route('catalog.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('categories', 1)
            ->where('categories.0.name', 'Aktif')
            ->where('categories.0.count', 1)
            ->has('brands', 1)
            ->where('brands.0.name', 'Brand Aktif')
        );
});

test('detail produk menghitung kunjungan dan menampilkan produk terkait', function () {
    $category = Category::factory()->create([
        'slug' => 'monitoring',
        'is_active' => true,
    ]);
    $product = catalogProduct([
        'category_id' => $category->id,
        'name' => 'Patient Monitor',
        'view_count' => 0,
    ]);
    $related = catalogProduct([
        'category_id' => $category->id,
        'name' => 'Bedside Monitor',
    ]);
    catalogProduct([
        'category_id' => Category::factory()->create(['is_active' => true])->id,
        'name' => 'Produk Lain',
    ]);

    $this->get(route('catalog.show', [
        'category' => $category->slug,
        'product' => $product->slug,
    ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/product')
            ->where('product.id', $product->id)
            ->where('product.name', 'Patient Monitor')
            ->has('related', 1)
            ->where('related.0.id', $related->id)
            ->has('jsonLd')
            ->has('seo')
        );

    expect($product->fresh()?->view_count)->toBe(1);
});

test('produk draf, kategori nonaktif, dan kategori tidak cocok menghasilkan 404', function () {
    $category = Category::factory()->create([
        'slug' => 'monitoring',
        'is_active' => true,
    ]);
    $inactiveCategory = Category::factory()->create([
        'slug' => 'nonaktif',
        'is_active' => false,
    ]);
    $draft = catalogProduct([
        'category_id' => $category->id,
        'is_published' => false,
    ]);
    $active = catalogProduct(['category_id' => $category->id]);
    $hidden = catalogProduct(['category_id' => $inactiveCategory->id]);

    $this->get(route('catalog.show', [
        'category' => $category->slug,
        'product' => $draft->slug,
    ]))->assertNotFound();

    $this->get(route('catalog.show', [
        'category' => $category->slug,
        'product' => $hidden->slug,
    ]))->assertNotFound();

    $this->get(route('catalog.show', [
        'category' => $inactiveCategory->slug,
        'product' => $hidden->slug,
    ]))->assertNotFound();

    $this->get(route('catalog.show', [
        'category' => $category->slug,
        'product' => $active->slug,
    ]))->assertOk();
});

test('beranda menampilkan produk unggulan lalu jatuh ke produk terbaru', function () {
    $category = Category::factory()->create(['is_active' => true]);
    $featured = catalogProduct([
        'category_id' => $category->id,
        'name' => 'Produk Unggulan',
        'is_featured' => true,
    ]);
    catalogProduct([
        'category_id' => $category->id,
        'name' => 'Produk Biasa',
        'is_featured' => false,
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/home')
            ->has('featuredProducts', 1)
            ->where('featuredProducts.0.id', $featured->id)
        );

    $featured->update(['is_featured' => false]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('featuredProducts', 2)
        );
});

test('katalog memakai SEO kategori bila tersedia', function () {
    $category = Category::factory()->create([
        'slug' => 'monitoring',
        'is_active' => true,
        'seo_description' => 'Deskripsi SEO khusus monitoring.',
    ]);
    Setting::query()->create([
        'key' => 'seo_description',
        'value' => 'Deskripsi SEO umum.',
        'group' => 'seo',
        'type' => 'string',
    ]);
    catalogProduct(['category_id' => $category->id]);

    $this->get(route('catalog.index', ['kategori' => 'monitoring']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('seo.description', 'Deskripsi SEO khusus monitoring.')
        );
});
