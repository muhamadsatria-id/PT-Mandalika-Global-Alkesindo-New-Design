<?php

namespace App\Http\Controllers\Admin;

use App\Enums\InquiryStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateInquiryRequest;
use App\Models\Inquiry;
use App\Models\User;
use App\Services\WhatsAppLinkService;
use App\Support\Roles;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InquiryController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('q', ''));
        $status = (string) $request->query('status', '');

        $inquiries = Inquiry::query()
            ->with(['customer:id,name,phone,institution,city', 'assignee:id,name', 'items'])
            ->withCount('items')
            ->when($search !== '', function (Builder $query) use ($search): void {
                $like = '%'.$search.'%';

                $query->where(function (Builder $query) use ($like): void {
                    $query->where('code', 'like', $like)
                        ->orWhereHas('customer', function (Builder $query) use ($like): void {
                            $query->where('name', 'like', $like)
                                ->orWhere('phone', 'like', $like)
                                ->orWhere('institution', 'like', $like);
                        });
                });
            })
            ->when(InquiryStatus::tryFrom($status) !== null, fn (Builder $query) => $query->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $inquiries->through(fn (Inquiry $inquiry): array => [
            'id' => $inquiry->id,
            'code' => $inquiry->code,
            'status' => $inquiry->status->value,
            'customer' => $inquiry->customer->name,
            'institution' => $inquiry->customer->institution,
            'city' => $inquiry->customer->city,
            'phone' => $inquiry->customer->phone,
            'items_count' => $inquiry->items_count,
            'assignee' => $inquiry->assignee?->name,
            'deal_value' => $inquiry->deal_value,
            'created_at' => $inquiry->created_at?->toIso8601String(),
        ]);

        return Inertia::render('admin/inquiries/index', [
            'inquiries' => $inquiries,
            'filters' => ['q' => $search, 'status' => $status],
            'statuses' => collect(InquiryStatus::cases())
                ->map(fn (InquiryStatus $case): array => ['value' => $case->value, 'label' => $case->label()])
                ->all(),
            'stats' => [
                'total' => Inquiry::query()->count(),
                'open' => Inquiry::query()->open()->count(),
                'deal' => Inquiry::query()->where('status', InquiryStatus::Deal)->count(),
            ],
        ]);
    }

    public function show(Inquiry $inquiry): Response
    {
        $inquiry->load(['customer', 'items.product', 'assignee']);

        return Inertia::render('admin/inquiries/show', [
            'inquiry' => [
                'id' => $inquiry->id,
                'code' => $inquiry->code,
                'status' => $inquiry->status->value,
                'notes' => $inquiry->notes,
                'deal_value' => $inquiry->deal_value,
                'assigned_to' => $inquiry->assigned_to,
                'closed_at' => $inquiry->closed_at?->toIso8601String(),
                'created_at' => $inquiry->created_at?->toIso8601String(),
                'updated_at' => $inquiry->updated_at?->toIso8601String(),
                'source' => [
                    'utm_source' => $inquiry->utm_source,
                    'utm_medium' => $inquiry->utm_medium,
                    'utm_campaign' => $inquiry->utm_campaign,
                    'utm_term' => $inquiry->utm_term,
                    'utm_content' => $inquiry->utm_content,
                    'referrer' => $inquiry->referrer,
                    'landing_url' => $inquiry->landing_url,
                ],
                'customer' => [
                    'id' => $inquiry->customer->id,
                    'name' => $inquiry->customer->name,
                    'institution' => $inquiry->customer->institution,
                    'city' => $inquiry->customer->city,
                    'phone' => $inquiry->customer->phone,
                    'email' => $inquiry->customer->email,
                ],
                'items' => $inquiry->items->map(fn ($item): array => [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'name' => $item->product_name_snapshot,
                    'brand' => $item->brand_snapshot,
                    'qty' => $item->qty,
                    'price' => $item->price_snapshot,
                ])->all(),
                'assignee' => $inquiry->assignee?->name,
            ],
            'statuses' => collect(InquiryStatus::cases())
                ->map(fn (InquiryStatus $case): array => ['value' => $case->value, 'label' => $case->label()])
                ->all(),
            'salesUsers' => User::query()
                ->whereHas('roles', fn ($query) => $query->whereIn('name', [Roles::Sales, Roles::SuperAdmin]))
                ->orderBy('name')
                ->get(['id', 'name'])
                ->all(),
            'whatsappUrl' => $this->whatsappReplyUrl($inquiry),
        ]);
    }

    public function update(UpdateInquiryRequest $request, Inquiry $inquiry): RedirectResponse
    {
        $data = $request->validated();
        $status = InquiryStatus::from($data['status']);

        $inquiry->fill([
            'status' => $status,
            'notes' => $data['notes'] ?? null,
            'assigned_to' => $data['assigned_to'] ?? null,
            'deal_value' => $data['deal_value'] ?? null,
            'closed_at' => $status->isFinal() ? ($inquiry->closed_at ?? now()) : null,
        ])->save();

        return redirect()
            ->route('admin.inquiries.show', $inquiry)
            ->with('success', 'Lead '.$inquiry->code.' diperbarui menjadi '.$status->label().'.');
    }

    private function whatsappReplyUrl(Inquiry $inquiry): string
    {
        $phone = $inquiry->customer->phone;
        $message = 'Halo '.$inquiry->customer->name.', kami dari PT. Mandalika Global Alkesindo menindaklanjuti permintaan penawaran Anda (kode '.$inquiry->code.').';

        return app(WhatsAppLinkService::class)->link($phone, $message);
    }
}
