<?php

use App\Models\Customer;
use App\Models\Inquiry;
use App\Models\InquiryItem;
use App\Models\ServiceRequest;
use App\Models\User;
use App\Support\Roles;
use Database\Seeders\RolePermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);

    $this->sales = User::factory()->create();
    $this->sales->assignRole(Roles::Sales);
});

test('daftar lead menampilkan statistik dan filter status', function () {
    Inquiry::factory()->create(['status' => 'Baru']);
    Inquiry::factory()->create(['status' => 'Deal']);
    Inquiry::factory()->create(['status' => 'Batal']);

    $this->actingAs($this->sales)
        ->get(route('admin.inquiries.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/inquiries/index')
            ->has('inquiries.data', 3)
            ->has('statuses', 6)
            ->where('stats.total', 3)
            ->where('stats.open', 1)
            ->where('stats.deal', 1)
        );

    $this->actingAs($this->sales)
        ->get(route('admin.inquiries.index', ['status' => 'Deal']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('inquiries.data', 1)
            ->where('inquiries.data.0.status', 'Deal')
        );
});

test('detail lead menampilkan pelanggan, item, dan tautan WhatsApp', function () {
    $inquiry = Inquiry::factory()->create([
        'code' => 'INQ-2026-00001',
        'notes' => 'Perlu instalasi.',
    ]);
    InquiryItem::factory()->create([
        'inquiry_id' => $inquiry->id,
        'product_name_snapshot' => 'Patient Monitor',
        'qty' => 2,
        'price_snapshot' => 1500000,
    ]);

    $this->actingAs($this->sales)
        ->get(route('admin.inquiries.show', $inquiry))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/inquiries/show')
            ->where('inquiry.code', 'INQ-2026-00001')
            ->where('inquiry.notes', 'Perlu instalasi.')
            ->where('inquiry.customer.id', $inquiry->customer_id)
            ->has('inquiry.items', 1)
            ->where('inquiry.items.0.name', 'Patient Monitor')
            ->where('inquiry.items.0.qty', 2)
            ->where('whatsappUrl', fn (string $url): bool => str_starts_with($url, 'https://wa.me/'))
        );
});

test('sales dapat memperbarui status, PIC, nilai deal, dan catatan lead', function () {
    $inquiry = Inquiry::factory()->create(['status' => 'Baru']);

    $this->actingAs($this->sales)
        ->put(route('admin.inquiries.update', $inquiry), [
            'status' => 'Deal',
            'assigned_to' => $this->sales->id,
            'deal_value' => 12500000,
            'notes' => 'PO diterima.',
        ])
        ->assertRedirect(route('admin.inquiries.show', $inquiry));

    $inquiry->refresh();
    expect($inquiry->status->value)->toBe('Deal')
        ->and($inquiry->assigned_to)->toBe($this->sales->id)
        ->and($inquiry->deal_value)->toBe(12500000)
        ->and($inquiry->notes)->toBe('PO diterima.')
        ->and($inquiry->closed_at)->not->toBeNull();
});

test('lead yang dibuka kembali menghapus tanggal tutup', function () {
    $inquiry = Inquiry::factory()->create([
        'status' => 'Deal',
        'closed_at' => now(),
    ]);

    $this->actingAs($this->sales)
        ->put(route('admin.inquiries.update', $inquiry), [
            'status' => 'Dihubungi',
            'notes' => 'Pelanggan minta revisi.',
        ])
        ->assertRedirect(route('admin.inquiries.show', $inquiry));

    expect($inquiry->fresh()?->closed_at)->toBeNull();
});

test('status dan PIC yang tidak valid ditolak', function () {
    $inquiry = Inquiry::factory()->create();

    $this->actingAs($this->sales)
        ->put(route('admin.inquiries.update', $inquiry), [
            'status' => 'Tidak Ada',
            'assigned_to' => 99999,
            'deal_value' => -1,
        ])
        ->assertSessionHasErrors(['status', 'assigned_to', 'deal_value']);

    expect($inquiry->fresh()?->status->value)->toBe('Baru');
});

test('permission lead memisahkan lihat dan kelola', function () {
    $inquiry = Inquiry::factory()->create();
    $marketing = User::factory()->create();
    $marketing->assignRole(Roles::Marketing);
    $technician = User::factory()->create();
    $technician->assignRole(Roles::Teknisi);

    $this->actingAs($marketing)
        ->get(route('admin.inquiries.index'))
        ->assertOk();

    $this->actingAs($marketing)
        ->get(route('admin.inquiries.show', $inquiry))
        ->assertOk();

    $this->actingAs($marketing)
        ->put(route('admin.inquiries.update', $inquiry), ['status' => 'Deal'])
        ->assertForbidden();

    $this->actingAs($technician)
        ->get(route('admin.inquiries.index'))
        ->assertForbidden();
});

test('halaman pelanggan menampilkan riwayat lead dan servis', function () {
    $customer = Customer::factory()->create([
        'name' => 'Rina Lestari',
        'institution' => 'RSUD Kota Mataram',
        'city' => 'Mataram',
        'tags' => ['prioritas'],
    ]);
    $inquiry = Inquiry::factory()->create([
        'customer_id' => $customer->id,
        'status' => 'Negosiasi',
    ]);
    InquiryItem::factory()->create(['inquiry_id' => $inquiry->id]);
    ServiceRequest::factory()->create([
        'customer_id' => $customer->id,
        'equipment_name' => 'Patient Monitor',
    ]);

    $this->actingAs($this->sales)
        ->get(route('admin.customers.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/customers/index')
            ->has('customers.data', 1)
            ->where('customers.data.0.name', 'Rina Lestari')
            ->where('stats.total', 1)
            ->where('stats.withInquiries', 1)
        );

    $this->actingAs($this->sales)
        ->get(route('admin.customers.show', $customer))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/customers/show')
            ->where('customer.name', 'Rina Lestari')
            ->where('customer.tags', ['prioritas'])
            ->has('inquiries', 1)
            ->where('inquiries.0.code', $inquiry->code)
            ->has('services', 1)
            ->where('services.0.device', 'Patient Monitor')
        );
});

test('pengguna tanpa izin pelanggan ditolak', function () {
    $marketing = User::factory()->create();
    $marketing->assignRole(Roles::Marketing);

    $this->actingAs($marketing)
        ->get(route('admin.customers.index'))
        ->assertForbidden();
});
