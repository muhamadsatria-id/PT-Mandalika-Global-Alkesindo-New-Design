<?php

namespace App\Http\Controllers\PublicSite;

use App\Enums\PriceMode;
use App\Enums\StockStatus;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use App\Services\WhatsAppLinkService;
use App\Support\ProductPresenter;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function show(Category $category, Product $product): Response
    {
        abort_unless($product->is_published, 404);
        abort_unless($product->category_id === $category->id, 404);
        abort_unless($category->is_active, 404);

        $product->increment('view_count');

        $product->load([
            'brand',
            'category',
            'specs',
            'media',
            'documents',
        ]);

        $related = Product::query()
            ->published()
            ->where('category_id', $product->category_id)
            ->whereKeyNot($product->id)
            ->with(['brand', 'category', 'media'])
            ->latest()
            ->take(4)
            ->get()
            ->map(fn (Product $related): array => ProductPresenter::card($related))
            ->all();

        $whatsapp = app(WhatsAppLinkService::class);
        $message = 'Halo PT. Mandalika Global Alkesindo, saya ingin bertanya tentang '
            .$product->name.($product->model ? ' ('.$product->model.')' : '')
            .' dari '.$product->brand->name.'.';

        $whatsappUrl = $whatsapp->url($message, 'whatsapp_sales')
            ?? $whatsapp->url($message);

        $images = $product->media
            ->map(fn ($media): string => Storage::disk('public')->url($media->path))
            ->values()
            ->all();

        return Inertia::render('public/product', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'model' => $product->model,
                'sku' => $product->sku,
                'brand' => $product->brand?->name,
                'brand_slug' => $product->brand?->slug,
                'category' => $product->category?->name,
                'category_slug' => $product->category?->slug,
                'short_description' => $product->short_description,
                'description' => $product->description,
                'price' => $product->displayPrice(),
                'price_value' => $product->price,
                'price_mode' => $product->price_mode->value,
                'stock_status' => $product->stock_status->value,
                'stock_label' => $product->stock_status->label(),
                'is_published' => $product->is_published,
                'images' => $images,
                'specs' => $product->specs->map(fn ($spec): array => [
                    'label' => $spec->label,
                    'value' => $spec->value,
                ])->all(),
                'documents' => $product->documents->map(fn ($document): array => [
                    'title' => $document->title,
                    'type' => $document->type,
                    'url' => Storage::disk('public')->url($document->file),
                ])->all(),
                'url' => route('catalog.show', [
                    'category' => $product->category?->slug,
                    'product' => $product->slug,
                ]),
            ],
            'related' => $related,
            'whatsappUrl' => $whatsappUrl,
            'seo' => [
                'title' => $product->seo_title
                    ?? trim($product->name.' '.$product->brand->name),
                'description' => $product->seo_description
                    ?? $product->short_description
                    ?? Setting::get('seo_description'),
                'canonical' => route('catalog.show', [
                    'category' => $product->category?->slug,
                    'product' => $product->slug,
                ]),
            ],
            'jsonLd' => $this->jsonLd($product, $images),
        ]);
    }

    /**
     * @param  array<int, string>  $images
     * @return array<string, mixed>
     */
    private function jsonLd(Product $product, array $images): array
    {
        $data = [
            '@context' => 'https://schema.org',
            '@type' => 'Product',
            'name' => $product->name,
            'description' => strip_tags($product->short_description ?? $product->description ?? ''),
            'sku' => $product->sku,
            'model' => $product->model,
            'brand' => [
                '@type' => 'Brand',
                'name' => $product->brand?->name,
            ],
            'category' => $product->category?->name,
            'url' => route('catalog.show', [
                'category' => $product->category?->slug,
                'product' => $product->slug,
            ]),
        ];

        if ($images !== []) {
            $data['image'] = array_map(fn (string $image): string => url($image), $images);
        }

        if ($product->price_mode === PriceMode::Show && $product->price !== null) {
            $availability = match ($product->stock_status) {
                StockStatus::Ready => 'https://schema.org/InStock',
                StockStatus::Indent, StockStatus::PreOrder => 'https://schema.org/PreOrder',
                StockStatus::Habis => 'https://schema.org/OutOfStock',
            };

            $data['offers'] = [
                '@type' => 'Offer',
                'priceCurrency' => 'IDR',
                'price' => $product->price,
                'availability' => $availability,
                'url' => $data['url'],
            ];
        }

        return $data;
    }
}
