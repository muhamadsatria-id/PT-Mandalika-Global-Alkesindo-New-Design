<?php

namespace App\Http\Controllers\PublicSite;

use App\Http\Controllers\Controller;
use App\Models\PartnerBrand;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function __invoke(): Response
    {
        $brands = PartnerBrand::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn (PartnerBrand $brand): array => [
                'id' => $brand->id,
                'name' => $brand->name,
                'slug' => $brand->slug,
                'logo' => $brand->logo,
                'url' => $brand->url,
            ])
            ->all();

        return Inertia::render('public/brands', [
            'seo' => [
                'title' => 'Brand principal',
                'description' => 'Daftar brand principal dan mitra resmi PT. Mandalika Global Alkesindo.',
                'canonical' => route('brands'),
            ],
            'brands' => $brands,
        ]);
    }
}
