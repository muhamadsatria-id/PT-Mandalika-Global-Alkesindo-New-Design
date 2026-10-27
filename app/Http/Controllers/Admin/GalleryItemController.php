<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryCategory;
use App\Models\GalleryItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class GalleryItemController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/gallery-items/index', [
            'items' => GalleryItem::query()
                ->with('category')
                ->orderBy('sort_order')
                ->orderBy('title')
                ->get()
                ->map(fn (GalleryItem $item): array => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'slug' => $item->slug,
                    'description' => $item->description,
                    'file' => $item->file,
                    'type' => $item->type,
                    'alt' => $item->alt,
                    'category' => $item->category?->name,
                    'category_id' => $item->gallery_category_id,
                    'is_published' => $item->is_published,
                    'sort_order' => $item->sort_order,
                ])
                ->all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/gallery-items/form', [
            'item' => null,
            'categories' => GalleryCategory::query()->orderBy('name')->get(['id', 'name'])->all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'min:2', 'max:150'],
            'description' => ['nullable', 'string', 'max:2000'],
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,webp,mp4,mov,webm', 'max:20480'],
            'type' => ['required', 'in:photo,video'],
            'alt' => ['nullable', 'string', 'max:255'],
            'gallery_category_id' => ['nullable', 'integer', 'exists:gallery_categories,id'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ]);

        $file = $request->file('file')->store('gallery', 'public');

        $item = GalleryItem::query()->create([
            'title' => $validated['title'],
            'slug' => $this->uniqueSlug($validated['title']),
            'description' => $validated['description'] ?? null,
            'file' => '/storage/'.$file,
            'type' => $validated['type'],
            'alt' => $validated['alt'] ?? null,
            'gallery_category_id' => $validated['gallery_category_id'] ?? null,
            'is_published' => $request->boolean('is_published', true),
            'sort_order' => $request->integer('sort_order'),
        ]);

        return redirect()
            ->route('admin.gallery-items.index')
            ->with('success', 'Item galeri "'.$item->title.'" ditambahkan.');
    }

    public function edit(GalleryItem $galleryItem): Response
    {
        return Inertia::render('admin/gallery-items/form', [
            'item' => [
                'id' => $galleryItem->id,
                'title' => $galleryItem->title,
                'slug' => $galleryItem->slug,
                'description' => $galleryItem->description,
                'file' => $galleryItem->file,
                'type' => $galleryItem->type,
                'alt' => $galleryItem->alt,
                'gallery_category_id' => $galleryItem->gallery_category_id,
                'is_published' => $galleryItem->is_published,
                'sort_order' => $galleryItem->sort_order,
            ],
            'categories' => GalleryCategory::query()->orderBy('name')->get(['id', 'name'])->all(),
        ]);
    }

    public function update(Request $request, GalleryItem $galleryItem): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'min:2', 'max:150'],
            'description' => ['nullable', 'string', 'max:2000'],
            'file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,mp4,mov,webm', 'max:20480'],
            'type' => ['required', 'in:photo,video'],
            'alt' => ['nullable', 'string', 'max:255'],
            'gallery_category_id' => ['nullable', 'integer', 'exists:gallery_categories,id'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ]);

        $data = [
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'type' => $validated['type'],
            'alt' => $validated['alt'] ?? null,
            'gallery_category_id' => $validated['gallery_category_id'] ?? null,
            'is_published' => $request->boolean('is_published'),
            'sort_order' => $request->integer('sort_order'),
        ];

        if ($request->hasFile('file')) {
            $file = $request->file('file')->store('gallery', 'public');
            $data['file'] = '/storage/'.$file;
        }

        $galleryItem->update($data);

        return redirect()
            ->route('admin.gallery-items.index')
            ->with('success', 'Item galeri "'.$galleryItem->title.'" diperbarui.');
    }

    public function destroy(GalleryItem $galleryItem): RedirectResponse
    {
        $title = $galleryItem->title;
        $galleryItem->delete();

        return redirect()
            ->route('admin.gallery-items.index')
            ->with('success', 'Item galeri "'.$title.'" dihapus.');
    }

    private function uniqueSlug(string $title): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $counter = 2;

        while (GalleryItem::query()->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$counter;
            $counter++;
        }

        return $slug;
    }
}
