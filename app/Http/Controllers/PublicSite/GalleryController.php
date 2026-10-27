<?php

namespace App\Http\Controllers\PublicSite;

use App\Http\Controllers\Controller;
use App\Models\GalleryCategory;
use App\Models\GalleryItem;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function __invoke(): Response
    {
        $categories = GalleryCategory::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn (GalleryCategory $category): array => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
            ])
            ->all();

        $items = GalleryItem::query()
            ->with('category')
            ->where('is_published', true)
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
                'category_slug' => $item->category?->slug,
            ])
            ->all();

        return Inertia::render('public/gallery', [
            'seo' => [
                'title' => 'Galeri kegiatan',
                'description' => 'Dokumentasi instalasi, pameran, pelatihan, dan kegiatan PT. Mandalika Global Alkesindo.',
                'canonical' => route('gallery'),
            ],
            'categories' => $categories,
            'items' => $items,
        ]);
    }
}
