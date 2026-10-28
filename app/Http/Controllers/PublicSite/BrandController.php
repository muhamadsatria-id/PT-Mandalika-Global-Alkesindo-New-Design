<?php

namespace App\Http\Controllers\PublicSite;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function __invoke(): Response
    {
        $brands = Brand::query()
            ->where('is_active', true)
            ->orderByDesc('status')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn (Brand $brand): array => [
                'id' => $brand->id,
                'name' => $brand->name,
                'slug' => $brand->slug,
                'logo' => $brand->logo_url ?? $brand->logo,
                'url' => $brand->website_url ?? null,
                'status' => $brand->status ?? 'tersedia',
                'short_description' => $brand->short_description,
            ])
            ->all();

        return Inertia::render('public/brands', [
            'seo' => [
                'title' => 'Brand Alat Kesehatan',
                'description' => 'Daftar brand principal dan partner yang didistribusikan oleh PT. Mandalika Global Alkesindo.',
                'canonical' => route('brand'),
            ],
            'brands' => $brands,
        ]);
    }
}
