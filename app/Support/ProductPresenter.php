<?php

namespace App\Support;

use App\Models\Product;
use Illuminate\Support\Facades\Storage;

final class ProductPresenter
{
    /**
     * Bentuk ringkas produk untuk kartu katalog dan bagian unggulan.
     *
     * @return array<string, mixed>
     */
    public static function card(Product $product): array
    {
        $path = $product->media->isEmpty()
            ? null
            : $product->media->first()->path;

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'model' => $product->model,
            'sku' => $product->sku,
            'brand' => $product->brand?->name,
            'brand_slug' => $product->brand?->slug,
            'category' => $product->category?->name,
            'category_slug' => $product->category?->slug,
            'price' => $product->displayPrice(),
            'price_value' => $product->price,
            'price_mode' => $product->price_mode->value,
            'stock_status' => $product->stock_status->value,
            'stock_label' => $product->stock_status->label(),
            'is_featured' => $product->is_featured,
            'image' => $path !== null ? Storage::disk('public')->url($path) : null,
            'url' => route('catalog.show', [
                'category' => $product->category?->slug,
                'product' => $product->slug,
            ]),
        ];
    }
}
