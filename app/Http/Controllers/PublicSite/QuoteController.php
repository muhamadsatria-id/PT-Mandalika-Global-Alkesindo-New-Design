<?php

namespace App\Http\Controllers\PublicSite;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInquiryRequest;
use App\Models\Inquiry;
use App\Services\InquiryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuoteController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('public/quote', [
            'seo' => [
                'title' => 'Daftar penawaran',
                'description' => 'Susun daftar alat kesehatan lalu minta penawaran langsung lewat WhatsApp.',
                'canonical' => route('quote.index'),
            ],
        ]);
    }

    public function store(StoreInquiryRequest $request, InquiryService $service): RedirectResponse
    {
        /** @var array{nama: string, instansi: string, kota: string, phone: string, email?: string|null, catatan?: string|null, items: array<int, array{product_id: int, qty: int}>, utm_source?: string|null, utm_medium?: string|null, utm_campaign?: string|null, utm_term?: string|null, utm_content?: string|null, referrer?: string|null, landing_url?: string|null, source_url?: string|null} $data */
        $data = $request->validated();

        $inquiry = $service->create(
            $data,
            $request->ip(),
            $request->fullUrl(),
        );

        $request->session()->put('last_inquiry_id', $inquiry->id);

        return redirect()->route('quote.sent');
    }

    public function sent(Request $request, InquiryService $service): Response|RedirectResponse
    {
        $inquiryId = $request->session()->get('last_inquiry_id');

        if (! is_int($inquiryId) && ! ctype_digit((string) $inquiryId)) {
            return redirect()->route('quote.index');
        }

        $inquiry = Inquiry::query()
            ->with(['customer', 'items'])
            ->find($inquiryId);

        if (! $inquiry instanceof Inquiry) {
            return redirect()->route('quote.index');
        }

        return Inertia::render('public/quote-sent', [
            'inquiry' => [
                'code' => $inquiry->code,
                'customer_name' => $inquiry->customer->name,
                'institution' => $inquiry->customer->institution,
                'city' => $inquiry->customer->city,
                'notes' => $inquiry->notes,
                'items' => $inquiry->items->map(fn ($item): array => [
                    'name' => $item->product_name_snapshot,
                    'brand' => $item->brand_snapshot,
                    'qty' => $item->qty,
                ])->all(),
            ],
            'whatsappUrl' => $service->whatsappUrl($inquiry),
            'seo' => [
                'title' => 'Permintaan penawaran terkirim',
                'description' => 'Permintaan penawaran Anda sudah kami terima.',
                'canonical' => route('quote.sent'),
            ],
        ]);
    }
}
