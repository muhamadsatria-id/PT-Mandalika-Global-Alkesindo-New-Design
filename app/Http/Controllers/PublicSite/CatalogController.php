<?php

namespace App\Http\Controllers\PublicSite;

use App\Enums\StockStatus;
use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use App\Support\ProductPresenter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $search = trim((string) $request->query('q', ''));
        $categorySlug = (string) $request->query('kategori', '');
        $brandSlug = (string) $request->query('brand', '');
        $stock = (string) $request->query('stok', '');
        $sort = (string) $request->query('urutkan', 'terbaru');

        $selectedCategory = $categorySlug !== ''
            ? Category::query()->where('slug', $categorySlug)->where('is_active', true)->first()
            : null;

        $selectedBrand = $brandSlug !== ''
            ? Brand::query()->where('slug', $brandSlug)->where('is_active', true)->first()
            : null;

        $products = Product::query()
            ->published()
            ->with([
                'brand:id,name,slug',
                'category:id,name,slug',
                'media',
            ])
            ->when($search !== '', function (Builder $query) use ($search): void {
                $like = '%'.$search.'%';

                $query->where(function (Builder $query) use ($like): void {
                    $query->where('name', 'like', $like)
                        ->orWhere('model', 'like', $like)
                        ->orWhere('sku', 'like', $like)
                        ->orWhere('short_description', 'like', $like)
                        ->orWhereHas('brand', fn (Builder $query) => $query->where('name', 'like', $like));
                });
            })
            ->when($selectedCategory !== null, fn (Builder $query) => $query->where('category_id', $selectedCategory->id))
            ->when($selectedBrand !== null, fn (Builder $query) => $query->where('brand_id', $selectedBrand->id))
            ->when(
                StockStatus::tryFrom($stock) !== null,
                fn (Builder $query) => $query->where('stock_status', $stock),
            )
            ->when($sort === 'nama', fn (Builder $query) => $query->orderBy('name'))
            ->when($sort === 'harga-rendah', fn (Builder $query) => $query->orderByRaw('price is null')->orderBy('price'))
            ->when($sort === 'harga-tinggi', fn (Builder $query) => $query->orderByRaw('price is null')->orderByDesc('price'))
            ->when(
                ! in_array($sort, ['nama', 'harga-rendah', 'harga-tinggi'], true),
                fn (Builder $query) => $query->latest(),
            )
            ->paginate(12)
            ->withQueryString();

        $products->through(fn (Product $product): array => ProductPresenter::card($product));

        $seoDescription = Setting::get('seo_description')
            ?? 'Katalog alat kesehatan untuk rumah sakit, klinik, dan fasilitas kesehatan di Indonesia.';

        if ($selectedCategory !== null && $selectedCategory->seo_description !== null) {
            $seoDescription = $selectedCategory->seo_description;
        } elseif ($selectedBrand !== null && $selectedBrand->seo_description !== null) {
            $seoDescription = $selectedBrand->seo_description;
        }

        return Inertia::render('public/catalog', [
            'products' => $products,
            'filters' => [
                'q' => $search,
                'kategori' => $selectedCategory?->slug,
                'brand' => $selectedBrand?->slug,
                'stok' => StockStatus::tryFrom($stock)?->value,
                'urutkan' => $sort,
            ],
            'categories' => Category::query()
                ->where('is_active', true)
                ->withCount(['products' => fn (Builder $query) => $query->where('is_published', true)])
                ->orderBy('sort_order')
                ->get()
                ->map(fn (Category $category): array => [
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'count' => $category->products_count,
                ])
                ->all(),
            'brands' => Brand::query()
                ->where('is_active', true)
                ->withCount(['products' => fn (Builder $query) => $query->where('is_published', true)])
                ->orderBy('name')
                ->get()
                ->map(fn (Brand $brand): array => [
                    'name' => $brand->name,
                    'slug' => $brand->slug,
                    'count' => $brand->products_count,
                ])
                ->all(),
            'stockOptions' => collect(StockStatus::cases())
                ->map(fn (StockStatus $status): array => ['value' => $status->value, 'label' => $status->label()])
                ->all(),
            'seo' => [
                'title' => $this->seoTitle($selectedCategory, $selectedBrand, $search),
                'description' => $seoDescription,
                'canonical' => $request->url(),
            ],
        ]);
    }

    private function seoTitle(?Category $category, ?Brand $brand, string $search): string
    {
        if ($search !== '') {
            return 'Hasil pencarian "'.$search.'"';
        }

        if ($category !== null) {
            return $category->seo_title ?? 'Katalog '.$category->name;
        }

        if ($brand !== null) {
            return $brand->seo_title ?? 'Produk '.$brand->name;
        }

        return 'Katalog alat kesehatan';
    }
}
