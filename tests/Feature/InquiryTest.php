<?php

use App\Models\Category;
use App\Models\Customer;
use App\Models\Inquiry;
use App\Models\Product;
use App\Models\Setting;
use App\Models\WaEvent;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Setting::query()->create([
        'key' => 'whatsapp_number',
        'value' => '6281234567890',
        'group' => 'whatsapp',
        'type' => 'string',
    ]);
});

function inquiryProduct(array $attributes = []): Product
{
    return Product::factory()->create([
        'category_id' => Category::factory()->create(['is_active' => true])->id,
        'is_published' => true,
        'price' => 1500000,
        'price_mode' => 'show',
        ...$attributes,
    ]);
}

function validInquiryPayload(Product $product, array $overrides = []): array
{
    return [
        'nama' => 'Rina Lestari',
        'instansi' => 'RSUD Kota Mataram',
        'kota' => 'Mataram',
        'phone' => '0812-3456-7890',
        'email' => 'rina@example.com',
        'catatan' => 'Butuh dua unit untuk ruang ICU.',
        'items' => [
            ['product_id' => $product->id, 'qty' => 2],
        ],
        'consent' => true,
        ...$overrides,
    ];
}

test('pengajuan penawaran valid menyimpan lead, item, dan event WhatsApp', function () {
    $product = inquiryProduct(['name' => 'Patient Monitor', 'model' => 'PM-12']);

    $this->post(route('quote.store'), validInquiryPayload($product, [
        'utm_source' => 'google',
        'utm_medium' => 'cpc',
        'utm_campaign' => 'alkes',
        'referrer' => 'https://www.google.com/search?q=monitor',
        'landing_url' => route('catalog.index'),
        'source_url' => route('quote.index'),
    ]))
        ->assertRedirect(route('quote.sent'))
        ->assertSessionHas('last_inquiry_id');

    $customer = Customer::query()->sole();
    expect($customer->name)->toBe('Rina Lestari')
        ->and($customer->phone)->toBe('6281234567890')
        ->and($customer->institution)->toBe('RSUD Kota Mataram');

    $inquiry = Inquiry::query()->sole();
    expect($inquiry->customer_id)->toBe($customer->id)
        ->and($inquiry->status->value)->toBe('Baru')
        ->and($inquiry->code)->toMatch('/^INQ-\d{4}-\d{5}$/')
        ->and($inquiry->notes)->toBe('Butuh dua unit untuk ruang ICU.')
        ->and($inquiry->utm_source)->toBe('google')
        ->and($inquiry->utm_medium)->toBe('cpc')
        ->and($inquiry->landing_url)->toBe(route('catalog.index'))
        ->and($inquiry->ip_hash)->not->toBeNull();

    $item = $inquiry->items()->sole();
    expect($item->product_id)->toBe($product->id)
        ->and($item->product_name_snapshot)->toBe('Patient Monitor')
        ->and($item->qty)->toBe(2)
        ->and($item->price_snapshot)->toBe(1500000);

    $event = WaEvent::query()->sole();
    expect($event->type->value)->toBe('inquiry')
        ->and($event->utm_source)->toBe('google')
        ->and($event->page_url)->toContain('/penawaran');
});

test('pengajuan penawaran mendukung tiga produk sekaligus', function () {
    $products = collect([
        inquiryProduct(['name' => 'Patient Monitor']),
        inquiryProduct(['name' => 'Infusion Pump']),
        inquiryProduct(['name' => 'Syringe Pump']),
    ]);

    $payload = validInquiryPayload($products->first(), [
        'items' => $products
            ->map(fn (Product $product): array => [
                'product_id' => $product->id,
                'qty' => 2,
            ])
            ->all(),
        'utm_source' => 'google',
        'utm_medium' => 'cpc',
    ]);

    $this->post(route('quote.store'), $payload)
        ->assertRedirect(route('quote.sent'));

    $inquiry = Inquiry::query()->sole();

    expect($inquiry->items()->count())->toBe(3)
        ->and($inquiry->utm_source)->toBe('google');

    $this->get(route('quote.sent'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('inquiry.items', 3)
            ->where('whatsappUrl', fn (string $url): bool => str_contains(urldecode($url), 'Patient Monitor')
                && str_contains(urldecode($url), 'Infusion Pump')
                && str_contains(urldecode($url), 'Syringe Pump'))
        );
});

test('halaman terkirim menampilkan ringkasan dan tautan WhatsApp', function () {
    $product = inquiryProduct(['name' => 'Infusion Pump']);
    $this->post(route('quote.store'), validInquiryPayload($product));

    $inquiry = Inquiry::query()->sole();

    $this->get(route('quote.sent'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/quote-sent')
            ->where('inquiry.code', $inquiry->code)
            ->where('inquiry.customer_name', 'Rina Lestari')
            ->has('inquiry.items', 1)
            ->where('inquiry.items.0.name', 'Infusion Pump')
            ->where('whatsappUrl', fn (string $url): bool => str_starts_with($url, 'https://wa.me/'))
        );
});

test('halaman terkirim dialihkan bila belum ada pengajuan', function () {
    $this->get(route('quote.sent'))
        ->assertRedirect(route('quote.index'));
});

test('validasi menolak data wajib yang kosong dan nomor tidak valid', function () {
    $product = inquiryProduct();

    $this->post(route('quote.store'), [
        'nama' => '',
        'instansi' => '',
        'kota' => '',
        'phone' => '0812',
        'items' => [],
        'consent' => false,
    ])->assertSessionHasErrors(['nama', 'instansi', 'kota', 'phone', 'items', 'consent']);

    expect(Inquiry::query()->count())->toBe(0)
        ->and(Customer::query()->count())->toBe(0)
        ->and($product->fresh())->not->toBeNull();
});

test('honeypot dan produk tidak terbit ditolak tanpa menyimpan data', function () {
    $draft = inquiryProduct(['is_published' => false]);

    $this->post(route('quote.store'), validInquiryPayload($draft, [
        'website' => 'https://spam.example',
    ]))->assertSessionHasErrors(['website', 'items.0.product_id']);

    expect(Inquiry::query()->count())->toBe(0);
});

test('produk dengan mode hubungi kami menyimpan harga snapshot kosong', function () {
    $product = inquiryProduct([
        'name' => 'USG Portable',
        'price_mode' => 'contact',
        'price' => 99000000,
    ]);

    $this->post(route('quote.store'), validInquiryPayload($product))
        ->assertRedirect(route('quote.sent'));

    expect(Inquiry::query()->sole()->items()->sole()->price_snapshot)->toBeNull();
});

test('pelanggan dengan nomor sama memakai data pelanggan yang sudah ada', function () {
    $product = inquiryProduct();
    $customer = Customer::factory()->create([
        'phone' => '6281234567890',
        'name' => 'Nama Lama',
    ]);

    $this->post(route('quote.store'), validInquiryPayload($product))
        ->assertRedirect(route('quote.sent'));

    expect(Customer::query()->count())->toBe(1)
        ->and($customer->fresh()?->name)->toBe('Rina Lestari')
        ->and(Inquiry::query()->where('customer_id', $customer->id)->count())->toBe(1);
});
