<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Support\Roles;
use Database\Seeders\RolePermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);

    $this->admin = User::factory()->create();
    $this->admin->assignRole(Roles::AdminKatalog);
});

test('admin dapat membuat dan memperbarui kategori', function () {
    $parent = Category::factory()->create(['name' => 'Induk']);

    $this->actingAs($this->admin)
        ->post(route('admin.categories.store'), [
            'name' => 'Monitoring Pasien',
            'parent_id' => $parent->id,
            'description' => 'Alat pemantau tanda vital.',
            'icon' => 'activity',
            'seo_title' => 'Monitoring Pasien',
            'seo_description' => 'Katalog monitoring pasien.',
            'is_active' => true,
            'sort_order' => 3,
        ])
        ->assertRedirect(route('admin.categories.index'));

    $category = Category::query()->where('name', 'Monitoring Pasien')->sole();
    expect($category->slug)->toBe('monitoring-pasien')
        ->and($category->parent_id)->toBe($parent->id)
        ->and($category->is_active)->toBeTrue()
        ->and($category->sort_order)->toBe(3);

    $this->actingAs($this->admin)
        ->put(route('admin.categories.update', $category), [
            'name' => 'Monitoring Pasien Baru',
            'parent_id' => null,
            'description' => null,
            'icon' => null,
            'seo_title' => null,
            'seo_description' => null,
            'is_active' => false,
            'sort_order' => 5,
        ])
        ->assertRedirect(route('admin.categories.index'));

    $category->refresh();
    expect($category->name)->toBe('Monitoring Pasien Baru')
        ->and($category->slug)->toBe('monitoring-pasien')
        ->and($category->parent_id)->toBeNull()
        ->and($category->is_active)->toBeFalse()
        ->and($category->sort_order)->toBe(5);
});

test('kategori tidak dapat menjadi induk dirinya sendiri', function () {
    $category = Category::factory()->create();

    $this->actingAs($this->admin)
        ->put(route('admin.categories.update', $category), [
            'name' => $category->name,
            'parent_id' => $category->id,
            'is_active' => true,
            'sort_order' => 0,
        ])
        ->assertSessionHasErrors('parent_id');

    expect($category->fresh()?->parent_id)->toBeNull();
});

test('kategori yang dipakai produk atau punya subkategori tidak dapat dihapus', function () {
    $used = Category::factory()->create();
    Product::factory()->create(['category_id' => $used->id]);
    $parent = Category::factory()->create();
    Category::factory()->create(['parent_id' => $parent->id]);
    $empty = Category::factory()->create();

    $this->actingAs($this->admin)
        ->delete(route('admin.categories.destroy', $used))
        ->assertRedirect(route('admin.categories.index'))
        ->assertSessionHas('error');

    $this->actingAs($this->admin)
        ->delete(route('admin.categories.destroy', $parent))
        ->assertRedirect(route('admin.categories.index'))
        ->assertSessionHas('error');

    $this->actingAs($this->admin)
        ->delete(route('admin.categories.destroy', $empty))
        ->assertRedirect(route('admin.categories.index'))
        ->assertSessionHas('success');

    expect(Category::query()->whereKey($used->id)->exists())->toBeTrue()
        ->and(Category::query()->whereKey($parent->id)->exists())->toBeTrue();
    $this->assertSoftDeleted('categories', ['id' => $empty->id]);
});

test('daftar kategori menampilkan jumlah produk dan induk', function () {
    $parent = Category::factory()->create([
        'name' => 'Induk',
        'sort_order' => 0,
    ]);
    $category = Category::factory()->create([
        'name' => 'Anak',
        'parent_id' => $parent->id,
        'sort_order' => 1,
    ]);
    Product::factory()->create(['category_id' => $category->id]);

    $this->actingAs($this->admin)
        ->get(route('admin.categories.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/categories/index')
            ->has('categories', 2)
            ->where('categories.1.name', 'Anak')
            ->where('categories.1.parent', 'Induk')
            ->where('categories.1.products_count', 1)
        );
});

test('admin dapat membuat dan menghapus brand yang belum dipakai', function () {
    $this->actingAs($this->admin)
        ->post(route('admin.brands.store'), [
            'name' => 'Mindray',
            'logo' => null,
            'description' => 'Produsen perangkat monitoring.',
            'seo_title' => null,
            'seo_description' => null,
            'is_active' => true,
            'sort_order' => 1,
        ])
        ->assertRedirect(route('admin.brands.index'));

    $brand = Brand::query()->where('name', 'Mindray')->sole();
    expect($brand->slug)->toBe('mindray');

    $this->actingAs($this->admin)
        ->put(route('admin.brands.update', $brand), [
            'name' => 'Mindray Indonesia',
            'logo' => '/storage/brands/mindray.png',
            'description' => null,
            'seo_title' => null,
            'seo_description' => null,
            'is_active' => false,
            'sort_order' => 2,
        ])
        ->assertRedirect(route('admin.brands.index'));

    $brand->refresh();
    expect($brand->name)->toBe('Mindray Indonesia')
        ->and($brand->logo)->toBe('/storage/brands/mindray.png')
        ->and($brand->is_active)->toBeFalse();

    $this->actingAs($this->admin)
        ->delete(route('admin.brands.destroy', $brand))
        ->assertRedirect(route('admin.brands.index'))
        ->assertSessionHas('success');

    $this->assertSoftDeleted('brands', ['id' => $brand->id]);
});

test('brand yang dipakai produk tidak dapat dihapus', function () {
    $brand = Brand::factory()->create();
    Product::factory()->create(['brand_id' => $brand->id]);

    $this->actingAs($this->admin)
        ->delete(route('admin.brands.destroy', $brand))
        ->assertRedirect(route('admin.brands.index'))
        ->assertSessionHas('error');

    expect(Brand::query()->whereKey($brand->id)->exists())->toBeTrue();
});

test('permission konten mengatur akses kategori dan brand', function () {
    $sales = User::factory()->create();
    $sales->assignRole(Roles::Sales);
    $marketing = User::factory()->create();
    $marketing->assignRole(Roles::Marketing);

    $this->actingAs($sales)
        ->get(route('admin.categories.index'))
        ->assertForbidden();

    $this->actingAs($sales)
        ->get(route('admin.brands.index'))
        ->assertForbidden();

    $this->actingAs($marketing)
        ->get(route('admin.categories.index'))
        ->assertOk();

    $this->actingAs($marketing)
        ->get(route('admin.brands.index'))
        ->assertOk();
});
