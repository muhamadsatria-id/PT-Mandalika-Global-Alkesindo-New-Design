<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class GalleryCategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/gallery-categories/index', [
            'categories' => GalleryCategory::query()
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get()
                ->map(fn (GalleryCategory $category): array => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'sort_order' => $category->sort_order,
                    'is_active' => $category->is_active,
                ])
                ->all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/gallery-categories/form', ['category' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_active' => ['boolean'],
        ]);

        $category = GalleryCategory::query()->create([
            'name' => $validated['name'],
            'slug' => $this->uniqueSlug($validated['name']),
            'sort_order' => $request->integer('sort_order'),
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()
            ->route('admin.gallery-categories.index')
            ->with('success', 'Kategori "'.$category->name.'" ditambahkan.');
    }

    public function edit(GalleryCategory $galleryCategory): Response
    {
        return Inertia::render('admin/gallery-categories/form', [
            'category' => [
                'id' => $galleryCategory->id,
                'name' => $galleryCategory->name,
                'slug' => $galleryCategory->slug,
                'sort_order' => $galleryCategory->sort_order,
                'is_active' => $galleryCategory->is_active,
            ],
        ]);
    }

    public function update(Request $request, GalleryCategory $galleryCategory): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_active' => ['boolean'],
        ]);

        $galleryCategory->update([
            'name' => $validated['name'],
            'sort_order' => $request->integer('sort_order'),
            'is_active' => $request->boolean('is_active'),
        ]);

        return redirect()
            ->route('admin.gallery-categories.index')
            ->with('success', 'Kategori "'.$galleryCategory->name.'" diperbarui.');
    }

    public function destroy(GalleryCategory $galleryCategory): RedirectResponse
    {
        $name = $galleryCategory->name;
        $galleryCategory->delete();

        return redirect()
            ->route('admin.gallery-categories.index')
            ->with('success', 'Kategori "'.$name.'" dihapus.');
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $counter = 2;

        while (GalleryCategory::query()->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$counter;
            $counter++;
        }

        return $slug;
    }
}
