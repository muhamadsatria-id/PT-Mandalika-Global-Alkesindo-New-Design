<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Support\Roles;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);

    $this->admin = User::factory()->create();
    $this->admin->assignRole(Roles::AdminKatalog);
});

function productAdminPayload(int $categoryId, int $brandId, array $overrides = []): array
{
    return [
        'category_id' => $categoryId,
        'brand_id' => $brandId,
        'name' => 'Patient Monitor Pro',
        'model' => 'PM-12',
        'sku' => 'MGA-PM-001',
        'short_description' => 'Monitor tanda vital untuk ruang perawatan.',
        'description' => 'Layar 12 inci dengan alarm dan mode tampilan lengkap.',
        'price' => 25000000,
        'price_mode' => 'show',
        'stock_status' => 'Ready',
        'is_featured' => true,
        'is_published' => true,
        'seo_title' => null,
        'seo_description' => null,
        'specs' => [
            ['label' => 'Layar', 'value' => '12 inci'],
            ['label' => 'Kosong', 'value' => ''],
        ],
        ...$overrides,
    ];
}

test('admin katalog dapat membuat produk dengan spesifikasi dan lima foto', function () {
    Storage::fake('public');
    $category = Category::factory()->create();
    $brand = Brand::factory()->create();

    $media = collect(range(1, 5))
        ->map(fn (int $index) => UploadedFile::fake()->image("monitor-{$index}.jpg", 800, 600))
        ->all();

    $this->actingAs($this->admin)
        ->post(route('admin.products.store'), productAdminPayload(
            $category->id,
            $brand->id,
            ['media' => $media],
        ))
        ->assertRedirect();

    $product = Product::query()->sole();
    expect($product->name)->toBe('Patient Monitor Pro')
        ->and($product->category_id)->toBe($category->id)
        ->and($product->price)->toBe(25000000)
        ->and($product->is_published)->toBeTrue()
        ->and($product->slug)->not->toBe('');

    expect($product->specs()->count())->toBe(1)
        ->and($product->specs()->sole()->value)->toBe('12 inci');

    $media = $product->media()->orderBy('sort_order')->get();
    expect($media)->toHaveCount(5)
        ->and($media->first()->is_primary)->toBeTrue()
        ->and($media->first()->alt)->toBe('Patient Monitor Pro');

    $media->each(fn ($item) => Storage::disk('public')->assertExists($item->path));

    $this->actingAs($this->admin)
        ->get(route('admin.products.edit', $product))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/form')
            ->where('product.id', $product->id)
            ->has('product.specs', 1)
            ->has('product.media', 5)
            ->has('categories')
            ->has('brands')
        );
});

test('admin dapat memperbarui produk, mengganti spesifikasi, dan menghapus foto', function () {
    Storage::fake('public');
    $category = Category::factory()->create();
    $brand = Brand::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'price' => 1000000,
        'price_mode' => 'show',
    ]);
    $media = $product->media()->create([
        'path' => 'products/'.$product->id.'/lama.jpg',
        'alt' => 'Foto lama',
        'is_primary' => true,
        'sort_order' => 1,
    ]);
    Storage::disk('public')->put($media->path, 'konten');

    $this->actingAs($this->admin)
        ->put(route('admin.products.update', $product), productAdminPayload(
            $category->id,
            $brand->id,
            [
                'name' => 'Patient Monitor Lite',
                'sku' => 'MGA-PM-002',
                'price' => 500000,
                'price_mode' => 'contact',
                'is_published' => false,
                'specs' => [['label' => 'Berat', 'value' => '5 kg']],
                'removed_media' => [$media->id],
                'documents' => [UploadedFile::fake()->create('brosur.pdf', 500, 'application/pdf')],
            ],
        ))
        ->assertRedirect(route('admin.products.edit', $product));

    $product->refresh();
    expect($product->name)->toBe('Patient Monitor Lite')
        ->and($product->price)->toBeNull()
        ->and($product->is_published)->toBeFalse()
        ->and($product->specs()->count())->toBe(1)
        ->and($product->specs()->sole()->label)->toBe('Berat')
        ->and($product->media()->count())->toBe(0)
        ->and($product->documents()->count())->toBe(1);

    Storage::disk('public')->assertMissing($media->path);
});

test('produk diarsipkan tanpa menghapus data secara permanen', function () {
    $product = Product::factory()->create();

    $this->actingAs($this->admin)
        ->delete(route('admin.products.destroy', $product))
        ->assertRedirect(route('admin.products.index'));

    $this->assertSoftDeleted('products', ['id' => $product->id]);
});

test('daftar produk dapat difilter berdasarkan status terbit', function () {
    $published = Product::factory()->create([
        'name' => 'Produk Terbit',
        'is_published' => true,
    ]);
    Product::factory()->create([
        'name' => 'Produk Draf',
        'is_published' => false,
    ]);

    $this->actingAs($this->admin)
        ->get(route('admin.products.index', ['status' => 'published']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/index')
            ->where('products.total', 1)
            ->where('products.data.0.id', $published->id)
            ->where('stats.total', 2)
            ->where('stats.published', 1)
            ->where('stats.draft', 1)
        );
});

test('permission produk memisahkan lihat dan kelola', function () {
    $sales = User::factory()->create();
    $sales->assignRole(Roles::Sales);
    $technician = User::factory()->create();
    $technician->assignRole(Roles::Teknisi);

    $this->actingAs($sales)
        ->get(route('admin.products.index'))
        ->assertOk();

    $this->actingAs($sales)
        ->get(route('admin.products.create'))
        ->assertOk();

    $this->actingAs($sales)
        ->post(route('admin.products.store'), [])
        ->assertForbidden();

    $this->actingAs($technician)
        ->get(route('admin.products.index'))
        ->assertForbidden();
});
