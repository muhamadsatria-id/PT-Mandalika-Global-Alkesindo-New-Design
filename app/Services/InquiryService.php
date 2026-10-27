<?php

namespace App\Services;

use App\Enums\InquiryStatus;
use App\Enums\PriceMode;
use App\Enums\WaEventType;
use App\Models\Customer;
use App\Models\Inquiry;
use App\Models\Product;
use App\Models\WaEvent;
use Illuminate\Support\Facades\DB;

class InquiryService
{
    public function __construct(private WhatsAppLinkService $whatsApp) {}

    /**
     * Simpan pelanggan, inquiry, item, dan event WhatsApp dalam satu transaksi.
     *
     * @param  array{
     *     nama: string,
     *     instansi: string,
     *     kota: string,
     *     phone: string,
     *     email?: string|null,
     *     catatan?: string|null,
     *     items: array<int, array{product_id: int, qty: int}>,
     *     utm_source?: string|null,
     *     utm_medium?: string|null,
     *     utm_campaign?: string|null,
     *     utm_term?: string|null,
     *     utm_content?: string|null,
     *     referrer?: string|null,
     *     landing_url?: string|null,
     *     source_url?: string|null
     * }  $data
     */
    public function create(array $data, ?string $ipAddress = null, ?string $pageUrl = null): Inquiry
    {
        return DB::transaction(function () use ($data, $ipAddress, $pageUrl): Inquiry {
            $customer = Customer::query()->firstOrNew(['phone' => $data['phone']]);

            $customer->fill([
                'name' => $data['nama'],
                'institution' => $data['instansi'],
                'city' => $data['kota'],
                'email' => $data['email'] ?? null,
            ])->save();

            $products = Product::query()
                ->whereIn('id', array_column($data['items'], 'product_id'))
                ->get()
                ->keyBy('id');

            $ipHash = hash('sha256', ($ipAddress ?? '').'|'.config('app.key'));

            $inquiry = Inquiry::query()->create([
                'code' => $this->nextCode(),
                'customer_id' => $customer->id,
                'status' => InquiryStatus::Baru,
                'notes' => $data['catatan'] ?? null,
                'utm_source' => $data['utm_source'] ?? null,
                'utm_medium' => $data['utm_medium'] ?? null,
                'utm_campaign' => $data['utm_campaign'] ?? null,
                'utm_term' => $data['utm_term'] ?? null,
                'utm_content' => $data['utm_content'] ?? null,
                'referrer' => $data['referrer'] ?? null,
                'landing_url' => $data['landing_url'] ?? $data['source_url'] ?? null,
                'ip_hash' => $ipHash,
            ]);

            foreach (array_values($data['items']) as $item) {
                $product = $products->get($item['product_id']);

                if (! $product instanceof Product) {
                    continue;
                }

                $inquiry->items()->create([
                    'product_id' => $product->id,
                    'product_name_snapshot' => $product->name,
                    'brand_snapshot' => $product->brand?->name,
                    'qty' => $item['qty'],
                    'price_snapshot' => $product->price_mode === PriceMode::Show
                        ? $product->price
                        : null,
                ]);
            }

            WaEvent::query()->create([
                'type' => WaEventType::Inquiry,
                'product_id' => null,
                'page_url' => $pageUrl,
                'utm_source' => $data['utm_source'] ?? null,
                'utm_medium' => $data['utm_medium'] ?? null,
                'utm_campaign' => $data['utm_campaign'] ?? null,
                'utm_term' => $data['utm_term'] ?? null,
                'utm_content' => $data['utm_content'] ?? null,
                'ip_hash' => $ipHash,
            ]);

            return $inquiry->load(['customer', 'items.product']);
        });
    }

    public function whatsappUrl(Inquiry $inquiry): ?string
    {
        $inquiry->loadMissing(['customer', 'items']);

        $items = $inquiry->items->map(fn ($item): array => [
            'product_name' => $item->product_name_snapshot,
            'brand' => $item->brand_snapshot ?? '-',
            'qty' => $item->qty,
        ])->all();

        $message = $this->whatsApp->inquiryMessage([
            'code' => $inquiry->code,
            'nama' => $inquiry->customer->name,
            'instansi' => $inquiry->customer->institution ?? '-',
            'kota' => $inquiry->customer->city ?? '-',
            'items' => $items,
            'catatan' => $inquiry->notes,
            'source_url' => $inquiry->landing_url ?? route('quote.index'),
        ]);

        return $this->whatsApp->url($message, 'whatsapp_sales')
            ?? $this->whatsApp->url($message);
    }

    private function nextCode(): string
    {
        $year = (int) now()->format('Y');
        $sequence = Inquiry::query()
            ->whereYear('created_at', $year)
            ->count() + 1;

        do {
            $code = sprintf('INQ-%d-%05d', $year, $sequence);
            $sequence++;
        } while (Inquiry::query()->where('code', $code)->exists());

        return $code;
    }
}
