<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PartnerBrand;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PartnerBrandController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/partner-brands/index', [
            'brands' => PartnerBrand::query()
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get()
                ->map(fn (PartnerBrand $brand): array => [
                    'id' => $brand->id,
                    'name' => $brand->name,
                    'slug' => $brand->slug,
                    'logo' => $brand->logo,
                    'url' => $brand->url,
                    'is_active' => $brand->is_active,
                    'sort_order' => $brand->sort_order,
                ])
                ->all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/partner-brands/form', ['brand' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'logo' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,svg', 'max:4096'],
            'url' => ['nullable', 'url', 'max:255'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ]);

        $logo = $request->hasFile('logo')
            ? '/storage/'.$request->file('logo')->store('partner-brands', 'public')
            : null;

        $brand = PartnerBrand::query()->create([
            'name' => $validated['name'],
            'slug' => $this->uniqueSlug($validated['name']),
            'logo' => $logo,
            'url' => $validated['url'] ?? null,
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => $request->integer('sort_order'),
        ]);

        return redirect()
            ->route('admin.partner-brands.index')
            ->with('success', 'Brand "'.$brand->name.'" ditambahkan.');
    }

    public function edit(PartnerBrand $partnerBrand): Response
    {
        return Inertia::render('admin/partner-brands/form', [
            'brand' => [
                'id' => $partnerBrand->id,
                'name' => $partnerBrand->name,
                'slug' => $partnerBrand->slug,
                'logo' => $partnerBrand->logo,
                'url' => $partnerBrand->url,
                'is_active' => $partnerBrand->is_active,
                'sort_order' => $partnerBrand->sort_order,
            ],
        ]);
    }

    public function update(Request $request, PartnerBrand $partnerBrand): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'logo' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,svg', 'max:4096'],
            'url' => ['nullable', 'url', 'max:255'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ]);

        $data = [
            'name' => $validated['name'],
            'url' => $validated['url'] ?? null,
            'is_active' => $request->boolean('is_active'),
            'sort_order' => $request->integer('sort_order'),
        ];

        if ($request->hasFile('logo')) {
            $data['logo'] = '/storage/'.$request->file('logo')->store('partner-brands', 'public');
        }

        $partnerBrand->update($data);

        return redirect()
            ->route('admin.partner-brands.index')
            ->with('success', 'Brand "'.$partnerBrand->name.'" diperbarui.');
    }

    public function destroy(PartnerBrand $partnerBrand): RedirectResponse
    {
        $name = $partnerBrand->name;
        $partnerBrand->delete();

        return redirect()
            ->route('admin.partner-brands.index')
            ->with('success', 'Brand "'.$name.'" dihapus.');
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $counter = 2;

        while (PartnerBrand::query()->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$counter;
            $counter++;
        }

        return $slug;
    }
}
