<?php

namespace App\Http\Controllers\PublicSite;

use App\Enums\ServicePreference;
use App\Http\Controllers\Controller;
use App\Http\Requests\CheckServiceStatusRequest;
use App\Http\Requests\StoreServiceRequest;
use App\Models\ServiceRequest;
use App\Services\ServiceRequestService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('public/service', [
            'seo' => [
                'title' => 'Layanan servis alat kesehatan',
                'description' => 'Ajukan perbaikan alat kesehatan, pantau status tiket, dan koordinasikan teknisi PT. Mandalika Global Alkesindo.',
                'canonical' => route('service.index'),
            ],
            'preferences' => collect(ServicePreference::cases())
                ->map(fn (ServicePreference $preference): array => [
                    'value' => $preference->value,
                    'label' => $preference->label(),
                ])
                ->all(),
        ]);
    }

    public function store(StoreServiceRequest $request, ServiceRequestService $service): RedirectResponse
    {
        /** @var array{nama: string, instansi: string, kota: string, phone: string, email?: string|null, equipment_name: string, brand?: string|null, model?: string|null, serial_number?: string|null, issue: string, location: string, preference: string, utm_source?: string|null, utm_medium?: string|null, utm_campaign?: string|null, utm_term?: string|null, utm_content?: string|null, referrer?: string|null, landing_url?: string|null, source_url?: string|null} $data */
        $data = $request->validated();

        $serviceRequest = $service->create(
            $data,
            $request->file('media', []),
            $request->ip(),
            $request->fullUrl(),
        );

        $request->session()->put('last_service_id', $serviceRequest->id);

        return redirect()->route('service.sent');
    }

    public function sent(Request $request, ServiceRequestService $service): Response|RedirectResponse
    {
        $serviceId = $request->session()->get('last_service_id');

        if (! is_int($serviceId) && ! ctype_digit((string) $serviceId)) {
            return redirect()->route('service.index');
        }

        $serviceRequest = ServiceRequest::query()
            ->with('customer')
            ->find($serviceId);

        if (! $serviceRequest instanceof ServiceRequest) {
            return redirect()->route('service.index');
        }

        return Inertia::render('public/service-sent', [
            'ticket' => [
                'code' => $serviceRequest->code,
                'equipment_name' => $serviceRequest->equipment_name,
                'customer_name' => $serviceRequest->customer->name,
                'institution' => $serviceRequest->customer->institution,
                'preference' => $serviceRequest->preference->label(),
                'created_at' => $serviceRequest->created_at?->toIso8601String(),
            ],
            'whatsappUrl' => $service->whatsappUrl($serviceRequest),
            'seo' => [
                'title' => 'Tiket servis dibuat',
                'description' => 'Tiket servis Anda sudah tercatat.',
                'canonical' => route('service.sent'),
            ],
        ]);
    }

    public function status(): Response
    {
        return Inertia::render('public/service-status', [
            'ticket' => null,
            'lookup' => ['code' => ''],
            'seo' => [
                'title' => 'Cek status servis',
                'description' => 'Pantau perkembangan tiket servis alat kesehatan dengan kode tiket dan 4 digit terakhir nomor WhatsApp.',
                'canonical' => route('service.status'),
            ],
        ]);
    }

    public function check(CheckServiceStatusRequest $request): Response|RedirectResponse
    {
        /** @var array{code: string, phone4: string} $data */
        $data = $request->validated();

        $serviceRequest = ServiceRequest::query()
            ->with('customer')
            ->where('code', $data['code'])
            ->whereHas('customer', fn (Builder $query): Builder => $query->whereRaw(
                'SUBSTR(phone, -4) = ?',
                [$data['phone4']],
            ))
            ->first();

        if (! $serviceRequest instanceof ServiceRequest) {
            return back()
                ->withErrors([
                    'code' => 'Kode tiket dan 4 digit nomor WhatsApp tidak cocok. Periksa kembali data Anda.',
                ])
                ->withInput();
        }

        return Inertia::render('public/service-status', [
            'ticket' => $this->publicTicket($serviceRequest),
            'lookup' => ['code' => $serviceRequest->code],
            'seo' => [
                'title' => 'Status tiket '.$serviceRequest->code,
                'description' => 'Pantau perkembangan tiket servis alat kesehatan.',
                'canonical' => route('service.status'),
            ],
        ]);
    }

    /**
     * Data tiket yang aman ditampilkan ke publik.
     *
     * @return array{
     *     code: string,
     *     status: string,
     *     equipment_name: string,
     *     brand: string|null,
     *     model: string|null,
     *     serial_number: string|null,
     *     preference: string,
     *     location: string|null,
     *     created_at: string|null,
     *     scheduled_at: string|null,
     *     completed_at: string|null,
     *     customer: array{name: string, institution: string|null, city: string|null, phone_last4: string},
     *     timeline: array<int, array{status: string, created_at: string|null}>
     * }
     */
    private function publicTicket(ServiceRequest $serviceRequest): array
    {
        $logs = $serviceRequest->logs()
            ->reorder('created_at')
            ->orderBy('id')
            ->get();

        $timeline = $logs->map(fn ($log): array => [
            'status' => $log->status->value,
            'created_at' => $log->created_at?->toIso8601String(),
        ])->all();

        if ($timeline === []) {
            $timeline = [[
                'status' => $serviceRequest->status->value,
                'created_at' => $serviceRequest->created_at?->toIso8601String(),
            ]];
        }

        return [
            'code' => $serviceRequest->code,
            'status' => $serviceRequest->status->value,
            'equipment_name' => $serviceRequest->equipment_name,
            'brand' => $serviceRequest->brand,
            'model' => $serviceRequest->model,
            'serial_number' => $serviceRequest->serial_number,
            'preference' => $serviceRequest->preference->label(),
            'location' => $serviceRequest->location,
            'created_at' => $serviceRequest->created_at?->toIso8601String(),
            'scheduled_at' => $serviceRequest->scheduled_at?->toIso8601String(),
            'completed_at' => $serviceRequest->completed_at?->toIso8601String(),
            'customer' => [
                'name' => $serviceRequest->customer->name,
                'institution' => $serviceRequest->customer->institution,
                'city' => $serviceRequest->customer->city,
                'phone_last4' => substr($serviceRequest->customer->phone, -4),
            ],
            'timeline' => $timeline,
        ];
    }
}
