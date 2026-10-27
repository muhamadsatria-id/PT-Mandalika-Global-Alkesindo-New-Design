<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ServiceStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateServiceRequest;
use App\Models\ServiceAttachment;
use App\Models\ServiceRequest;
use App\Models\Setting;
use App\Models\User;
use App\Services\WhatsAppLinkService;
use App\Support\Permissions;
use App\Support\Roles;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Throwable;

class ServiceController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        $search = trim((string) $request->query('q', ''));
        $status = (string) $request->query('status', '');
        $technician = (string) $request->query('technician', '');

        $services = ServiceRequest::query()
            ->with(['customer:id,name,phone,institution,city', 'technician:id,name'])
            ->when($search !== '', function (Builder $query) use ($search): void {
                $like = '%'.$search.'%';

                $query->where(function (Builder $query) use ($like): void {
                    $query->where('code', 'like', $like)
                        ->orWhere('equipment_name', 'like', $like)
                        ->orWhere('brand', 'like', $like)
                        ->orWhere('model', 'like', $like)
                        ->orWhere('serial_number', 'like', $like)
                        ->orWhereHas('customer', function (Builder $query) use ($like): void {
                            $query->where('name', 'like', $like)
                                ->orWhere('phone', 'like', $like)
                                ->orWhere('institution', 'like', $like);
                        });
                });
            })
            ->when(ServiceStatus::tryFrom($status) !== null, fn (Builder $query) => $query->where('status', $status))
            ->when(ctype_digit($technician), fn (Builder $query) => $query->where('technician_id', (int) $technician))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $services->through(fn (ServiceRequest $service): array => [
            'id' => $service->id,
            'code' => $service->code,
            'status' => $service->status->value,
            'equipment_name' => $service->equipment_name,
            'brand' => $service->brand,
            'model' => $service->model,
            'customer' => $service->customer->name,
            'institution' => $service->customer->institution,
            'city' => $service->customer->city,
            'phone' => $service->customer->phone,
            'technician' => $service->technician?->name,
            'preference' => $service->preference->label(),
            'estimated_cost' => $service->estimated_cost,
            'scheduled_at' => $service->scheduled_at?->toIso8601String(),
            'created_at' => $service->created_at?->toIso8601String(),
        ]);

        return Inertia::render('admin/services/index', [
            'services' => $services,
            'filters' => [
                'q' => $search,
                'status' => $status,
                'technician' => $technician,
            ],
            'statuses' => $this->statusOptions(),
            'technicians' => $this->technicians(),
            'stats' => [
                'total' => ServiceRequest::query()->count(),
                'active' => ServiceRequest::query()->open()->count(),
                'scheduled' => ServiceRequest::query()
                    ->where('status', ServiceStatus::Dijadwalkan)
                    ->count(),
                'completed' => ServiceRequest::query()
                    ->whereIn('status', [ServiceStatus::Selesai, ServiceStatus::Diambil, ServiceStatus::Dikirim])
                    ->count(),
            ],
        ]);
    }

    public function show(ServiceRequest $service): InertiaResponse
    {
        $service->load(['customer', 'technician', 'logs.user', 'attachments']);

        return Inertia::render('admin/services/show', [
            'service' => [
                'id' => $service->id,
                'code' => $service->code,
                'status' => $service->status->value,
                'equipment_name' => $service->equipment_name,
                'brand' => $service->brand,
                'model' => $service->model,
                'serial_number' => $service->serial_number,
                'issue' => $service->issue,
                'location' => $service->location,
                'preference' => $service->preference->value,
                'preference_label' => $service->preference->label(),
                'technician_id' => $service->technician_id,
                'technician' => $service->technician?->name,
                'estimated_cost' => $service->estimated_cost,
                'scheduled_at' => $service->scheduled_at?->toIso8601String(),
                'scheduled_at_local' => $service->scheduled_at?->format('Y-m-d\TH:i'),
                'completed_at' => $service->completed_at?->toIso8601String(),
                'notes' => $service->notes,
                'created_at' => $service->created_at?->toIso8601String(),
                'updated_at' => $service->updated_at?->toIso8601String(),
                'customer' => [
                    'id' => $service->customer->id,
                    'name' => $service->customer->name,
                    'institution' => $service->customer->institution,
                    'city' => $service->customer->city,
                    'phone' => $service->customer->phone,
                    'email' => $service->customer->email,
                ],
                'timeline' => $service->logs->map(fn ($log): array => [
                    'id' => $log->id,
                    'status' => $log->status->value,
                    'note' => $log->note,
                    'user' => $log->user?->name,
                    'created_at' => $log->created_at?->toIso8601String(),
                ])->all(),
                'attachments' => $service->attachments->map(fn (ServiceAttachment $attachment): array => [
                    'id' => $attachment->id,
                    'name' => basename($attachment->file),
                    'type' => $attachment->type,
                    'is_image' => $attachment->type === 'image',
                    'is_video' => $attachment->type === 'video',
                    'url' => route('admin.services.attachment', [
                        'service' => $service,
                        'attachment' => $attachment,
                    ]),
                ])->all(),
            ],
            'statuses' => $this->statusOptions(),
            'technicians' => $this->technicians(),
            'whatsappUrl' => $this->whatsappReplyUrl($service),
            'receiptUrl' => route('admin.services.receipt', $service),
        ]);
    }

    public function update(UpdateServiceRequest $request, ServiceRequest $service): RedirectResponse
    {
        /** @var array{
         *     status: string,
         *     technician_id?: int|null,
         *     estimated_cost?: int|null,
         *     scheduled_at?: string|null,
         *     notes?: string|null,
         *     status_note?: string|null,
         *     attachments?: array<int, UploadedFile>,
         *     removed_attachments?: array<int, int>
         * } $data
         */
        $data = $request->validated();
        $newStatus = ServiceStatus::from($data['status']);
        $oldStatus = $service->status;
        $storedFiles = [];

        try {
            DB::transaction(function () use ($service, $data, $newStatus, $oldStatus, $request, &$storedFiles): void {
                $service->fill([
                    'status' => $newStatus,
                    'technician_id' => $data['technician_id'] ?? null,
                    'estimated_cost' => $data['estimated_cost'] ?? null,
                    'scheduled_at' => $data['scheduled_at'] ?? null,
                    'notes' => $data['notes'] ?? null,
                    'completed_at' => $newStatus->isFinal()
                        ? ($service->completed_at ?? now())
                        : null,
                ])->save();

                if ($newStatus !== $oldStatus) {
                    $service->logs()->create([
                        'status' => $newStatus,
                        'note' => filled($data['status_note'] ?? null)
                            ? $data['status_note']
                            : 'Status diperbarui menjadi '.$newStatus->label().'.',
                        'user_id' => $request->user()?->id,
                    ]);
                }

                $removedIds = $data['removed_attachments'] ?? [];

                if ($removedIds !== []) {
                    $attachments = $service->attachments()
                        ->whereIn('id', $removedIds)
                        ->get();

                    foreach ($attachments as $attachment) {
                        Storage::disk('local')->delete($attachment->file);
                        $attachment->delete();
                    }
                }

                foreach ($data['attachments'] ?? [] as $file) {
                    $path = $file->store('service-attachments/'.$service->id, 'local');

                    if (! is_string($path)) {
                        continue;
                    }

                    $storedFiles[] = $path;

                    $service->attachments()->create([
                        'file' => $path,
                        'type' => $this->attachmentType($file),
                    ]);
                }
            });
        } catch (Throwable $exception) {
            Storage::disk('local')->delete($storedFiles);

            throw $exception;
        }

        return redirect()
            ->route('admin.services.show', $service)
            ->with('success', 'Tiket '.$service->code.' diperbarui menjadi '.$newStatus->label().'.');
    }

    public function receipt(ServiceRequest $service): HttpResponse
    {
        $service->load(['customer', 'technician']);

        $company = [
            'name' => Setting::get('company_name') ?? 'PT. Mandalika Global Alkesindo',
            'address' => Setting::get('company_address'),
            'city' => Setting::get('company_city'),
            'phone' => Setting::get('whatsapp_service') ?? Setting::get('whatsapp_number'),
            'email' => Setting::get('company_email'),
            'hours' => Setting::get('company_hours'),
        ];

        $pdf = Pdf::loadView('pdf.service-receipt', [
            'service' => $service,
            'company' => $company,
        ])->setPaper('a4');

        return $pdf->download($service->code.'.pdf');
    }

    public function attachment(ServiceRequest $service, ServiceAttachment $attachment): BinaryFileResponse
    {
        abort_unless($attachment->service_request_id === $service->id, 404);

        $disk = Storage::disk('local');

        abort_unless($disk->exists($attachment->file), 404);

        return response()->file($disk->path($attachment->file));
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function statusOptions(): array
    {
        return collect(ServiceStatus::cases())
            ->map(fn (ServiceStatus $status): array => [
                'value' => $status->value,
                'label' => $status->label(),
            ])
            ->all();
    }

    /**
     * @return array<int, array{id: int, name: string}>
     */
    private function technicians(): array
    {
        return User::query()
            ->where('is_active', true)
            ->where(function (Builder $query): void {
                $query->whereHas('roles', fn (Builder $query) => $query->whereIn('name', [
                    Roles::Teknisi,
                    Roles::SuperAdmin,
                ]))->orWhereHas('permissions', fn (Builder $query) => $query->where('name', Permissions::ServicesManage));
            })
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
            ])
            ->all();
    }

    private function whatsappReplyUrl(ServiceRequest $service): string
    {
        $message = 'Halo '.$service->customer->name.', kami dari PT. Mandalika Global Alkesindo menindaklanjuti tiket servis '
            .$service->code.' untuk '.$service->equipment_name.'. Status saat ini: '.$service->status->label().'.';

        return app(WhatsAppLinkService::class)->link($service->customer->phone, $message);
    }

    private function attachmentType(UploadedFile $file): string
    {
        $mime = (string) $file->getMimeType();

        if (str_starts_with($mime, 'video/')) {
            return 'video';
        }

        if ($mime === 'application/pdf') {
            return 'document';
        }

        return 'image';
    }
}
