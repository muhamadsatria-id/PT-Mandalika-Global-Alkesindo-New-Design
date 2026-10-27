<?php

use App\Models\Category;
use App\Models\Product;
use Inertia\Testing\AssertableInertia as Assert;

test('sitemap memuat halaman publik dan produk terbit saja', function () {
    $category = Category::factory()->create([
        'slug' => 'monitoring',
        'is_active' => true,
    ]);
    $published = Product::factory()->create([
        'category_id' => $category->id,
        'is_published' => true,
    ]);
    $draft = Product::factory()->create([
        'category_id' => $category->id,
        'is_published' => false,
    ]);

    $response = $this->get(route('sitemap'));

    $response->assertOk()
        ->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
        ->assertSee(route('home'), false)
        ->assertSee(route('catalog.index'), false)
        ->assertSee(route('about'), false)
        ->assertSee(route('contact'), false)
        ->assertSee(route('quote.index'), false)
        ->assertSee(route('privacy'), false)
        ->assertSee(route('catalog.show', [
            'category' => $category->slug,
            'product' => $published->slug,
        ]), false)
        ->assertDontSee($draft->slug, false);
});

test('robots memblokir admin dan mencantumkan sitemap', function () {
    $this->get(route('robots'))
        ->assertOk()
        ->assertHeader('Content-Type', 'text/plain; charset=UTF-8')
        ->assertSee('Disallow: /admin')
        ->assertSee('Disallow: /login')
        ->assertSee('Disallow: /penawaran/terkirim')
        ->assertSee('Sitemap: '.route('sitemap'));
});

test('halaman kebijakan privasi dapat dibuka dan memakai layout publik', function () {
    $this->get(route('privacy'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/privacy')
            ->has('seo')
        );
});
