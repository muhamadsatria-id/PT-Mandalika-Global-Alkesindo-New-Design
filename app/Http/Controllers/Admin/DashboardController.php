<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\Product;
use App\Models\ServiceRequest;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'products' => Product::query()->count(),
                'publishedProducts' => Product::query()->where('is_published', true)->count(),
                'openInquiries' => Inquiry::query()->open()->count(),
                'activeServices' => ServiceRequest::query()->open()->count(),
            ],
            'latestProducts' => Product::query()
                ->with('brand')
                ->latest()
                ->take(5)
                ->get()
                ->map(fn (Product $product): array => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'brand' => $product->brand?->name,
                    'price' => $product->displayPrice(),
                    'stock_status' => $product->stock_status->value,
                    'is_published' => $product->is_published,
                    'edit_url' => route('admin.products.edit', $product),
                ])
                ->all(),
        ]);
    }
}
