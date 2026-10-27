<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BrandRequest;
use App\Models\Brand;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/brands/index', [
            'brands' => Brand::query()
                ->withCount('products')
                ->orderBy('name')
                ->get()
                ->map(fn (Brand $brand): array => [
                    'id' => $brand->id,
                    'name' => $brand->name,
                    'slug' => $brand->slug,
                    'description' => $brand->description,
                    'logo' => $brand->logo,
                    'seo_title' => $brand->seo_title,
                    'seo_description' => $brand->seo_description,
                    'is_active' => $brand->is_active,
                    'sort_order' => $brand->sort_order,
                    'products_count' => $brand->products_count,
                ])
                ->all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/brands/form', ['brand' => null]);
    }

    public function store(BrandRequest $request): RedirectResponse
    {
        $brand = Brand::query()->create([
            ...$request->validated(),
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => $request->integer('sort_order'),
        ]);

        return redirect()
            ->route('admin.brands.index')
            ->with('success', 'Brand "'.$brand->name.'" ditambahkan.');
    }

    public function show(Brand $brand): RedirectResponse
    {
        return redirect()->route('admin.brands.edit', $brand);
    }

    public function edit(Brand $brand): Response
    {
        return Inertia::render('admin/brands/form', [
            'brand' => [
                'id' => $brand->id,
                'name' => $brand->name,
                'slug' => $brand->slug,
                'description' => $brand->description,
                'logo' => $brand->logo,
                'seo_title' => $brand->seo_title,
                'seo_description' => $brand->seo_description,
                'is_active' => $brand->is_active,
                'sort_order' => $brand->sort_order,
            ],
        ]);
    }

    public function update(BrandRequest $request, Brand $brand): RedirectResponse
    {
        $brand->update([
            ...$request->validated(),
            'is_active' => $request->boolean('is_active'),
            'sort_order' => $request->integer('sort_order'),
        ]);

        return redirect()
            ->route('admin.brands.index')
            ->with('success', 'Brand "'.$brand->name.'" diperbarui.');
    }

    public function destroy(Brand $brand): RedirectResponse
    {
        if ($brand->products()->exists()) {
            return redirect()
                ->route('admin.brands.index')
                ->with('error', 'Brand masih dipakai produk. Pindahkan produk terlebih dahulu.');
        }

        $name = $brand->name;
        $brand->delete();

        return redirect()
            ->route('admin.brands.index')
            ->with('success', 'Brand "'.$name.'" dihapus.');
    }
}
