<?php

use App\Enums\ServiceStatus;
use App\Enums\WaEventType;
use App\Models\Customer;
use App\Models\ServiceRequest;
use App\Models\Setting;
use App\Models\WaEvent;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Setting::query()->create([
        'key' => 'whatsapp_number',
        'value' => '6281234567890',
        'group' => 'whatsapp',
        'type' => 'string',
    ]);
});

function serviceRequestPayload(array $overrides = []): array
{
    return [
        'nama' => 'Rina Lestari',
        'instansi' => 'RSUD Kota Mataram',
        'kota' => 'Mataram',
        'phone' => '0812-3456-7890',
        'email' => 'rina@example.com',
        'equipment_name' => 'Patient Monitor',
        'brand' => 'Mindray',
        'model' => 'uMEC12',
        'serial_number' => 'SN-2026-001',
        'issue' => 'Layar menyala tetapi hasil pengukuran tidak muncul.',
        'location' => 'Ruang ICU lantai 2',
        'preference' => 'teknisi_datang',
        'consent' => true,
        'website' => '',
        ...$overrides,
    ];
}

test('halaman layanan servis menampilkan pilihan preferensi', function () {
    $this->get(route('service.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/service')
            ->has('preferences', 3)
            ->where('preferences.0.value', 'teknisi_datang')
            ->where('preferences.0.label', 'Teknisi datang')
            ->where('seo.canonical', route('service.index'))
        );
});

test('pengajuan servis valid menyimpan tiket, pelanggan, lampiran, dan event WhatsApp', function () {
    Storage::fake('local');
    $photo = UploadedFile::fake()->image('monitor.jpg', 800, 600);

    $this->post(route('service.store'), serviceRequestPayload([
        'media' => [$photo],
        'utm_source' => 'google',
        'utm_medium' => 'cpc',
        'utm_campaign' => 'servis-alkes',
        'referrer' => 'https://www.google.com/search?q=servis+alkes',
        'landing_url' => route('service.index'),
        'source_url' => route('service.index'),
    ]))
        ->assertRedirect(route('service.sent'));
    $service = ServiceRequest::query()->sole();

    expect($service->code)->toMatch('/^SRV-\d{4}-\d{5}$/')
        ->and($service->status)->toBe(ServiceStatus::Diterima)
        ->and($service->preference->value)->toBe('teknisi_datang')
        ->and($service->technician_id)->toBeNull()
        ->and($service->customer->name)->toBe('Rina Lestari')
        ->and($service->customer->phone)->toBe('6281234567890')
        ->and($service->customer->institution)->toBe('RSUD Kota Mataram');

    expect($service->logs()->count())->toBe(1)
        ->and($service->logs()->sole()->status)->toBe(ServiceStatus::Diterima);

    $attachment = $service->attachments()->sole();
    expect($attachment->type)->toBe('image')
        ->and($attachment->file)->toContain('service-attachments/'.$service->id);

    Storage::disk('local')->assertExists($attachment->file);

    $event = WaEvent::query()->sole();
    expect($event->type)->toBe(WaEventType::Service)
        ->and($event->utm_source)->toBe('google')
        ->and($event->utm_medium)->toBe('cpc')
        ->and($event->ip_hash)->not->toBe('');

    $this->get(route('service.sent'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/service-sent')
            ->where('ticket.code', $service->code)
            ->where('ticket.equipment_name', 'Patient Monitor')
            ->where('ticket.preference', 'Teknisi datang')
            ->where('whatsappUrl', fn (?string $url): bool => is_string($url)
                && str_contains($url, 'wa.me/6281234567890')
                && str_contains($url, $service->code))
        );
});

test('pengajuan servis menolak honeypot, persetujuan kosong, dan preferensi tidak valid', function () {
    $this->post(route('service.store'), serviceRequestPayload([
        'consent' => false,
        'website' => 'https://spam.example',
        'preference' => 'tidak_ada',
    ]))->assertSessionHasErrors(['consent', 'website', 'preference']);

    expect(ServiceRequest::query()->count())->toBe(0);
});

test('pengajuan servis menolak format nomor dan keluhan yang terlalu pendek', function () {
    $this->post(route('service.store'), serviceRequestPayload([
        'phone' => '12345',
        'issue' => 'rusak',
    ]))->assertSessionHasErrors(['phone', 'issue']);

    expect(ServiceRequest::query()->count())->toBe(0);
});

test('halaman cek status membutuhkan kode tiket dan empat digit terakhir nomor', function () {
    $customer = Customer::factory()->create([
        'name' => 'Rina Lestari',
        'phone' => '6281234567890',
    ]);
    $service = ServiceRequest::factory()->create([
        'code' => 'SRV-2026-00045',
        'customer_id' => $customer->id,
    ]);
    $service->logs()->create([
        'status' => ServiceStatus::Diagnosa,
        'note' => 'Catatan internal yang tidak boleh tampil.',
        'user_id' => null,
    ]);

    $this->get(route('service.status'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/service-status')
            ->where('ticket', null)
        );

    $this->post(route('service.check'), [
        'code' => 'srv-2026-00045',
        'phone4' => '7890',
    ])
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/service-status')
            ->where('ticket.code', 'SRV-2026-00045')
            ->where('ticket.customer.name', 'Rina Lestari')
            ->where('ticket.customer.phone_last4', '7890')
            ->where('ticket.timeline.0.status', 'Diterima')
            ->where('ticket.timeline.1.status', 'Diagnosa')
            ->missing('ticket.notes')
            ->missing('ticket.customer.phone')
            ->missing('ticket.timeline.0.note')
        );
});

test('cek status menolak nomor yang tidak cocok tanpa membocorkan tiket', function () {
    $customer = Customer::factory()->create(['phone' => '6281234567890']);
    ServiceRequest::factory()->create([
        'code' => 'SRV-2026-00045',
        'customer_id' => $customer->id,
    ]);

    $this->from(route('service.status'))
        ->post(route('service.check'), [
            'code' => 'SRV-2026-00045',
            'phone4' => '0000',
        ])
        ->assertRedirect(route('service.status'))
        ->assertSessionHasErrors('code');

    $this->from(route('service.status'))
        ->post(route('service.check'), [
            'code' => 'BUKAN-TIKET',
            'phone4' => '7890',
        ])
        ->assertRedirect(route('service.status'))
        ->assertSessionHasErrors('code');
});

test('halaman tiket terkirim mengarahkan kembali bila sesi tidak ada', function () {
    $this->get(route('service.sent'))
        ->assertRedirect(route('service.index'));
});
