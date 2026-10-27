<?php

use App\Enums\ServiceStatus;
use App\Models\ServiceRequest;
use App\Models\User;
use App\Support\Roles;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);

    $this->technician = User::factory()->create(['name' => 'Teknisi Andi']);
    $this->technician->assignRole(Roles::Teknisi);

    $this->sales = User::factory()->create();
    $this->sales->assignRole(Roles::Sales);

    $this->marketing = User::factory()->create();
    $this->marketing->assignRole(Roles::Marketing);

    $this->katalog = User::factory()->create();
    $this->katalog->assignRole(Roles::AdminKatalog);
});

test('daftar servis menampilkan statistik dan filter status', function () {
    ServiceRequest::factory()->create(['status' => ServiceStatus::Diterima]);
    ServiceRequest::factory()->create(['status' => ServiceStatus::Dijadwalkan]);
    ServiceRequest::factory()->create(['status' => ServiceStatus::Selesai]);

    $this->actingAs($this->technician)
        ->get(route('admin.services.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/services/index')
            ->has('services.data', 3)
            ->has('statuses', 10)
            ->has('technicians')
            ->where('stats.total', 3)
            ->where('stats.active', 2)
            ->where('stats.scheduled', 1)
            ->where('stats.completed', 1)
        );

    $this->actingAs($this->technician)
        ->get(route('admin.services.index', ['status' => 'Dijadwalkan']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('services.data', 1)
            ->where('services.data.0.status', 'Dijadwalkan')
        );

    $this->actingAs($this->technician)
        ->get(route('admin.services.index', ['q' => 'tidak-ada-hasil']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('services.data', 0)
        );
});

test('detail servis menampilkan pelanggan, timeline, lampiran, dan tautan aksi', function () {
    Storage::fake('local');

    $service = ServiceRequest::factory()->create([
        'code' => 'SRV-2026-00045',
        'status' => ServiceStatus::Diterima,
        'scheduled_at' => '2026-11-02 09:00:00',
    ]);
    $path = 'service-attachments/'.$service->id.'/monitor.jpg';
    Storage::disk('local')->put($path, 'fake-image');

    $service->attachments()->create([
        'file' => $path,
        'type' => 'image',
    ]);

    $this->actingAs($this->technician)
        ->get(route('admin.services.show', $service))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/services/show')
            ->where('service.code', 'SRV-2026-00045')
            ->where('service.status', 'Diterima')
            ->where('service.scheduled_at_local', '2026-11-02T09:00')
            ->where('service.customer.name', $service->customer->name)
            ->has('service.timeline', 1)
            ->where('service.timeline.0.status', 'Diterima')
            ->has('service.attachments', 1)
            ->where('service.attachments.0.type', 'image')
            ->where('whatsappUrl', fn (string $url): bool => str_contains($url, 'wa.me/')
                && str_contains($url, $service->code))
            ->where('receiptUrl', route('admin.services.receipt', $service))
            ->has('statuses', 10)
            ->has('technicians')
        );
});

test('teknisi dapat memperbarui status, penugasan, biaya, jadwal, catatan, dan lampiran', function () {
    Storage::fake('local');

    $service = ServiceRequest::factory()->create([
        'status' => ServiceStatus::Diterima,
    ]);
    $photo = UploadedFile::fake()->image('kerusakan.jpg', 1200, 900);

    $this->actingAs($this->technician)
        ->put(route('admin.services.update', $service), [
            'status' => 'Dijadwalkan',
            'technician_id' => $this->technician->id,
            'estimated_cost' => 750000,
            'scheduled_at' => '2026-11-02 09:00',
            'notes' => 'Ganti modul sensor dan kalibrasi ulang.',
            'status_note' => 'Kunjungan dijadwalkan setelah konfirmasi pelanggan.',
            'attachments' => [$photo],
        ])
        ->assertRedirect(route('admin.services.show', $service))
        ->assertSessionHas('success');

    $service->refresh();

    expect($service->status)->toBe(ServiceStatus::Dijadwalkan)
        ->and($service->technician_id)->toBe($this->technician->id)
        ->and($service->estimated_cost)->toBe(750000)
        ->and($service->scheduled_at?->format('Y-m-d H:i'))->toBe('2026-11-02 09:00')
        ->and($service->completed_at)->toBeNull()
        ->and($service->notes)->toBe('Ganti modul sensor dan kalibrasi ulang.');

    $log = $service->logs()
        ->where('status', ServiceStatus::Dijadwalkan)
        ->sole();
    expect($log->user_id)->toBe($this->technician->id)
        ->and($log->note)->toBe('Kunjungan dijadwalkan setelah konfirmasi pelanggan.');

    $attachment = $service->attachments()->sole();
    expect($attachment->type)->toBe('image')
        ->and($attachment->file)->toContain('service-attachments/'.$service->id);

    Storage::disk('local')->assertExists($attachment->file);
});

test('status akhir mengisi waktu selesai dan status aktif kembali mengosongkannya', function () {
    $service = ServiceRequest::factory()->create([
        'status' => ServiceStatus::Dikerjakan,
        'technician_id' => $this->technician->id,
        'estimated_cost' => 500000,
    ]);

    $this->actingAs($this->technician)
        ->put(route('admin.services.update', $service), [
            'status' => 'Selesai',
            'technician_id' => $this->technician->id,
            'estimated_cost' => 500000,
        ])
        ->assertRedirect(route('admin.services.show', $service));

    expect($service->refresh()->completed_at)->not->toBeNull();

    $this->actingAs($this->technician)
        ->put(route('admin.services.update', $service), [
            'status' => 'Dikerjakan',
            'technician_id' => $this->technician->id,
            'estimated_cost' => 500000,
        ])
        ->assertRedirect(route('admin.services.show', $service));

    expect($service->refresh()->completed_at)->toBeNull()
        ->and($service->status)->toBe(ServiceStatus::Dikerjakan)
        ->and($service->logs()->count())->toBe(3);
});

test('lampiran dapat dihapus dari penyimpanan privat saat tiket diperbarui', function () {
    Storage::fake('local');

    $service = ServiceRequest::factory()->create();
    $path = 'service-attachments/'.$service->id.'/lama.jpg';
    Storage::disk('local')->put($path, 'isi');

    $attachment = $service->attachments()->create([
        'file' => $path,
        'type' => 'image',
    ]);

    $this->actingAs($this->technician)
        ->put(route('admin.services.update', $service), [
            'status' => $service->status->value,
            'removed_attachments' => [$attachment->id],
        ])
        ->assertRedirect(route('admin.services.show', $service));

    expect($service->attachments()->count())->toBe(0)
        ->and($service->logs()->count())->toBe(1);

    Storage::disk('local')->assertMissing($path);
});

test('hanya pengguna dengan izin servis yang dapat membuka modul servis', function () {
    $service = ServiceRequest::factory()->create();

    $this->actingAs($this->sales)
        ->get(route('admin.services.index'))
        ->assertForbidden();

    $this->actingAs($this->marketing)
        ->get(route('admin.services.index'))
        ->assertForbidden();

    $this->actingAs($this->katalog)
        ->get(route('admin.services.show', $service))
        ->assertForbidden();

    $this->actingAs($this->sales)
        ->put(route('admin.services.update', $service), [
            'status' => 'Dijadwalkan',
        ])
        ->assertForbidden();

    $this->actingAs($this->technician)
        ->get(route('admin.services.index'))
        ->assertOk();
});

test('teknisi yang tidak aktif tidak dapat ditugaskan', function () {
    $inactive = User::factory()->create(['is_active' => false]);
    $inactive->assignRole(Roles::Teknisi);

    $service = ServiceRequest::factory()->create();

    $this->actingAs($this->technician)
        ->put(route('admin.services.update', $service), [
            'status' => 'Dijadwalkan',
            'technician_id' => $inactive->id,
        ])
        ->assertSessionHasErrors('technician_id');
});

test('tanda terima PDF dapat diunduh oleh pengguna dengan izin servis', function () {
    $service = ServiceRequest::factory()->create([
        'code' => 'SRV-2026-00999',
        'brand' => null,
        'model' => null,
        'serial_number' => null,
        'location' => null,
        'estimated_cost' => null,
        'scheduled_at' => null,
    ]);

    $this->actingAs($this->technician)
        ->get(route('admin.services.receipt', $service))
        ->assertOk()
        ->assertHeader('content-type', 'application/pdf')
        ->assertDownload('SRV-2026-00999.pdf');
});

test('lampiran privat hanya dapat diakses oleh pengguna berizin pada tiket yang benar', function () {
    Storage::fake('local');

    $service = ServiceRequest::factory()->create();
    $path = 'service-attachments/'.$service->id.'/bukti.jpg';
    Storage::disk('local')->put($path, 'isi-gambar');

    $attachment = $service->attachments()->create([
        'file' => $path,
        'type' => 'image',
    ]);

    $otherService = ServiceRequest::factory()->create();

    $this->actingAs($this->technician)
        ->get(route('admin.services.attachment', [
            'service' => $service,
            'attachment' => $attachment,
        ]))
        ->assertOk();

    $this->actingAs($this->technician)
        ->get(route('admin.services.attachment', [
            'service' => $otherService,
            'attachment' => $attachment,
        ]))
        ->assertNotFound();

    $this->actingAs($this->sales)
        ->get(route('admin.services.attachment', [
            'service' => $service,
            'attachment' => $attachment,
        ]))
        ->assertForbidden();
});
