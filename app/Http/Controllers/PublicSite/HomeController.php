<?php

namespace App\Http\Controllers\PublicSite;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\CompanyStat;
use App\Models\Faq;
use App\Models\PartnerBrand;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Testimonial;
use App\Support\ProductPresenter;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $featured = Product::query()
            ->published()
            ->with(['brand', 'category', 'media'])
            ->where('is_featured', true)
            ->orderByRaw('price is not null desc')
            ->orderByDesc('id')
            ->take(10)
            ->get();

        if ($featured->isEmpty()) {
            $featured = Product::query()
                ->published()
                ->with(['brand', 'category', 'media'])
                ->orderByRaw('price is not null desc')
                ->orderByDesc('id')
                ->take(10)
                ->get();
        }

        $brands = Brand::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn (Brand $brand): array => [
                'id' => $brand->id,
                'name' => $brand->name,
                'slug' => $brand->slug,
                'logo' => $brand->logo_url,
            ])
            ->all();

        $partnerBrands = PartnerBrand::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (PartnerBrand $brand): array => [
                'id' => $brand->id,
                'name' => $brand->name,
                'logo' => $brand->logo_url,
                'website' => $brand->website,
            ])
            ->all();

        $categories = Category::query()
            ->where('is_active', true)
            ->whereHas('products', fn ($query) => $query->published())
            ->withCount(['products' => fn ($query) => $query->published()])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->limit(8)
            ->get()
            ->map(fn (Category $category): array => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'products_count' => $category->products_count,
            ])
            ->all();

        $companyStats = CompanyStat::query()
            ->where(function ($query) {
                if (Schema::hasColumn('company_stats', 'is_active')) {
                    $query->where('is_active', true);
                } elseif (Schema::hasColumn('company_stats', 'is_published')) {
                    $query->where('is_published', true);
                }
            })
            ->orderBy('sort_order')
            ->get()
            ->map(fn (CompanyStat $stat): array => [
                'id' => $stat->id,
                'label' => $stat->label,
                'value' => $stat->value,
                'suffix' => $stat->suffix,
            ])
            ->all();

        $testimonials = Testimonial::query()
            ->where('is_published', true)
            ->where(function ($query) {
                if (Schema::hasColumn('testimonials', 'is_active')) {
                    $query->where('is_active', true);
                }
            })
            ->whereNotNull('name')
            ->where('name', '!=', '')
            ->orderBy('sort_order')
            ->get()
            ->filter(function (Testimonial $testimonial): bool {
                $name = strtolower((string) $testimonial->name);
                $institution = strtolower((string) $testimonial->institution);

                return ! str_contains($name, 'mitra') && ! str_contains($institution, 'mitra');
            })
            ->values()
            ->map(fn (Testimonial $testimonial): array => [
                'id' => $testimonial->id,
                'name' => $testimonial->name,
                'role' => $testimonial->role,
                'institution' => $testimonial->institution,
                'quote' => $testimonial->quote,
                'rating' => $testimonial->rating,
            ])
            ->all();

        $faqs = Faq::query()
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get()
            ->filter(fn (Faq $faq): bool => filled($faq->answer))
            ->values()
            ->map(fn (Faq $faq): array => [
                'id' => $faq->id,
                'question' => $faq->question,
                'answer' => $faq->answer,
            ])
            ->all();

        return Inertia::render('public/home', [
            'seo' => [
                'title' => 'Alat kesehatan & layanan servis',
                'description' => Setting::get('seo_description') ?? 'Pengadaan alat kesehatan, layanan servis, dan pendampingan teknis untuk rumah sakit, klinik, dan dinas kesehatan di Indonesia.',
                'canonical' => route('home'),
            ],
            'featuredProducts' => $featured
                ->map(fn (Product $product): array => ProductPresenter::card($product))
                ->all(),
            'brands' => $brands,
            'partnerBrands' => $partnerBrands,
            'categories' => $categories,
            'companyStats' => $companyStats,
            'testimonials' => $testimonials,
            'faqs' => $faqs,
            'trustFlags' => [
                'lkpp' => (bool) config('company.trust.lkpp', false),
                'distributor_resmi' => (bool) config('company.trust.distributor_resmi', false),
            ],
        ]);
    }
}
