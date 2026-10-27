<?php

use App\Enums\ServicePreference;
use App\Models\Setting;
use App\Models\WaTemplate;
use App\Services\WhatsAppLinkService;

it('menormalkan beragam format nomor WhatsApp', function (string $input, string $expected) {
    $service = app(WhatsAppLinkService::class);

    expect($service->normalize($input))->toBe($expected);
})->with([
    'awalan nol' => ['0812-3456-7890', '6281234567890'],
    'format internasional berspasi' => ['+62 812 3456 7890', '6281234567890'],
    'sudah format 62' => ['6281234567890', '6281234567890'],
    'tanpa awalan' => ['812 3456 7890', '6281234567890'],
]);

it('membangun tautan wa.me dengan pesan terenkode', function () {
    $service = app(WhatsAppLinkService::class);

    expect($service->link('0812-3456-7890', 'Halo & tes'))
        ->toBe('https://wa.me/6281234567890?text=Halo%20%26%20tes');
});

it('mengambil nomor dari pengaturan dan mengembalikan null bila kosong', function () {
    $service = app(WhatsAppLinkService::class);

    expect($service->number())->toBeNull();

    Setting::query()->create([
        'key' => 'whatsapp_number',
        'value' => '0812-3456-7890',
        'group' => 'whatsapp',
        'type' => 'string',
    ]);

    expect($service->number())->toBe('6281234567890')
        ->and($service->url('Halo'))->toBe('https://wa.me/6281234567890?text=Halo');
});

it('memakai nomor sales khusus untuk tautan sales', function () {
    $service = app(WhatsAppLinkService::class);

    Setting::query()->create([
        'key' => 'whatsapp_sales',
        'value' => '0813 1111 2222',
        'group' => 'whatsapp',
        'type' => 'string',
    ]);

    expect($service->url('Penawaran', 'whatsapp_sales'))
        ->toBe('https://wa.me/6281311112222?text=Penawaran');
});

it('menyusun pesan permintaan penawaran lengkap dengan item', function () {
    $service = app(WhatsAppLinkService::class);

    $message = $service->inquiryMessage([
        'code' => 'INQ-001',
        'nama' => 'Rina',
        'instansi' => 'RS Mataram',
        'kota' => 'Mataram',
        'items' => [
            ['product_name' => 'Patient Monitor', 'brand' => 'Mindray', 'qty' => 2],
            ['product_name' => 'USG Portable', 'brand' => 'GE', 'qty' => 1],
        ],
        'catatan' => 'Kirim ke gudang belakang.',
        'source_url' => 'https://mga.my.id/katalog/patient-monitor',
    ]);

    expect($message)
        ->toContain('Kode: INQ-001')
        ->toContain('Nama: Rina | Instansi: RS Mataram | Kota: Mataram')
        ->toContain('1. Patient Monitor (Mindray) x2')
        ->toContain('2. USG Portable (GE) x1')
        ->toContain('Catatan: Kirim ke gudang belakang.')
        ->toContain('Sumber: https://mga.my.id/katalog/patient-monitor');
});

it('menyusun pesan servis dengan label preferensi', function () {
    $service = app(WhatsAppLinkService::class);

    $message = $service->serviceMessage([
        'code' => 'SRV-001',
        'equipment_name' => 'Patient Monitor',
        'brand' => 'Mindray',
        'model' => 'uMEC12',
        'serial_number' => 'SN-123',
        'issue' => 'Layar berkedip',
        'location' => 'RS Mataram',
        'preference' => ServicePreference::TeknisiDatang,
    ]);

    expect($message)
        ->toContain('Kode: SRV-001')
        ->toContain('Alat: Patient Monitor | Brand/Model: Mindray uMEC12 | No. seri: SN-123')
        ->toContain('Keluhan: Layar berkedip')
        ->toContain('Lokasi: RS Mataram | Preferensi: Teknisi datang');
});

it('mengisi variabel pada template balasan tersimpan', function () {
    $service = app(WhatsAppLinkService::class);

    WaTemplate::query()->create([
        'key' => 'follow_up_inquiry',
        'title' => 'Tindak lanjut penawaran',
        'body' => 'Halo {nama}, penawaran {kode} sudah kami kirim.',
    ]);

    expect($service->storedTemplate('follow_up_inquiry', [
        'nama' => 'Rina',
        'kode' => 'INQ-001',
    ]))->toBe('Halo Rina, penawaran INQ-001 sudah kami kirim.')
        ->and($service->storedTemplate('tidak_ada'))->toBeNull();
});
