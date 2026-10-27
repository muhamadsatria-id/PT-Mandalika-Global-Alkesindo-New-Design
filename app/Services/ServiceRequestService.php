<?php

namespace App\Services;

use App\Enums\ServiceStatus;
use App\Enums\WaEventType;
use App\Models\Customer;
use App\Models\ServiceRequest;
use App\Models\WaEvent;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class ServiceRequestService
{
    public function __construct(private WhatsAppLinkService $whatsApp) {}

    /**
     * Simpan pelanggan, tiket servis, lampiran, dan event WhatsApp.
     *
     * @param  array{
     *     nama: string,
     *     instansi: string,
     *     kota: string,
     *     phone: string,
     *     email?: string|null,
     *     equipment_name: string,
     *     brand?: string|null,
     *     model?: string|null,
     *     serial_number?: string|null,
     *     issue: string,
     *     location: string,
     *     preference: string,
     *     utm_source?: string|null,
     *     utm_medium?: string|null,
     *     utm_campaign?: string|null,
     *     utm_term?: string|null,
     *     utm_content?: string|null,
     *     referrer?: string|null,
     *     landing_url?: string|null,
     *     source_url?: string|null
     * }  $data
     * @param  array<int, UploadedFile>  $files
     */
    public function create(array $data, array $files = [], ?string $ipAddress = null, ?string $pageUrl = null): ServiceRequest
    {
        $storedFiles = [];

        try {
            return DB::transaction(function () use ($data, $files, $ipAddress, $pageUrl, &$storedFiles): ServiceRequest {
                $customer = Customer::query()->firstOrNew(['phone' => $data['phone']]);

                $customer->fill([
                    'name' => $data['nama'],
                    'institution' => $data['instansi'],
                    'city' => $data['kota'],
                    'email' => $data['email'] ?? null,
                ])->save();

                $ipHash = hash('sha256', ($ipAddress ?? '').'|'.config('app.key'));

                $serviceRequest = ServiceRequest::query()->create([
                    'code' => $this->nextCode(),
                    'customer_id' => $customer->id,
                    'equipment_name' => $data['equipment_name'],
                    'brand' => $data['brand'] ?? null,
                    'model' => $data['model'] ?? null,
                    'serial_number' => $data['serial_number'] ?? null,
                    'issue' => $data['issue'],
                    'location' => $data['location'],
                    'preference' => $data['preference'],
                    'status' => ServiceStatus::Diterima,
                    'technician_id' => null,
                    'estimated_cost' => null,
                    'scheduled_at' => null,
                    'completed_at' => null,
                    'notes' => null,
                ]);

                foreach ($files as $file) {
                    $path = $file->store('service-attachments/'.$serviceRequest->id, 'local');

                    if (! is_string($path)) {
                        continue;
                    }

                    $storedFiles[] = $path;

                    $serviceRequest->attachments()->create([
                        'file' => $path,
                        'type' => $this->attachmentType($file),
                    ]);
                }

                WaEvent::query()->create([
                    'type' => WaEventType::Service,
                    'product_id' => null,
                    'page_url' => $pageUrl,
                    'utm_source' => $data['utm_source'] ?? null,
                    'utm_medium' => $data['utm_medium'] ?? null,
                    'utm_campaign' => $data['utm_campaign'] ?? null,
                    'utm_term' => $data['utm_term'] ?? null,
                    'utm_content' => $data['utm_content'] ?? null,
                    'ip_hash' => $ipHash,
                ]);

                return $serviceRequest->load(['customer', 'attachments']);
            });
        } catch (Throwable $exception) {
            Storage::disk('local')->delete($storedFiles);

            throw $exception;
        }
    }

    public function whatsappUrl(ServiceRequest $serviceRequest): ?string
    {
        $serviceRequest->loadMissing('customer');

        $message = $this->whatsApp->serviceMessage([
            'code' => $serviceRequest->code,
            'equipment_name' => $serviceRequest->equipment_name,
            'brand' => $serviceRequest->brand,
            'model' => $serviceRequest->model,
            'serial_number' => $serviceRequest->serial_number,
            'issue' => $serviceRequest->issue,
            'location' => $serviceRequest->location,
            'preference' => $serviceRequest->preference,
        ]);

        return $this->whatsApp->url($message, 'whatsapp_service')
            ?? $this->whatsApp->url($message);
    }

    private function nextCode(): string
    {
        $year = (int) now()->format('Y');
        $sequence = ServiceRequest::query()
            ->whereYear('created_at', $year)
            ->count() + 1;

        do {
            $code = sprintf('SRV-%d-%05d', $year, $sequence);
            $sequence++;
        } while (ServiceRequest::query()->where('code', $code)->exists());

        return $code;
    }

    private function attachmentType(UploadedFile $file): string
    {
        $mime = (string) $file->getMimeType();

        return str_starts_with($mime, 'video/') ? 'video' : 'image';
    }
}
