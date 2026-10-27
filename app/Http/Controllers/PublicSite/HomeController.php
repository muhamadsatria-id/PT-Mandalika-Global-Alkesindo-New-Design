<?php

namespace App\Http\Controllers\PublicSite;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\CompanyStat;
use App\Models\Faq;
use App\Models\PartnerBrand;
use App\Models\Product;
use App\Models\Testimonial;
use App\Support\ProductPresenter;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $featured = Product::query()
            ->published()
            ->where('is_featured', true)
            ->with(['brand', 'category', 'media'])
            ->latest()
            ->take(10)
            ->get();

        if ($featured->isEmpty()) {
            $featured = Product::query()
                ->published()
                ->with(['brand', 'category', 'media'])
                ->latest()
                ->take(10)
                ->get();
        }

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
            ->withCount(['products' => fn ($query) => $query->published()])
            ->having('products_count', '>', 0)
            ->orderBy('name')
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
                if (\Illuminate\Support\Facades\Schema::hasColumn('company_stats', 'is_active')) {
                    $query->where('is_active', true);
                } elseif (\Illuminate\Support\Facades\Schema::hasColumn('company_stats', 'is_published')) {
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

        return Inertia::render('public/home', [
            'featuredProducts' => $featured
                ->map(fn (Product $product): array => ProductPresenter::card($product))
                ->all(),
            'partnerBrands' => $partnerBrands,
            'categories' => $categories,
            'companyStats' => $companyStats,
            'testimonials' => Testimonial::query()
                ->where('is_published', true)
                ->orderBy('sort_order')
                ->get()
                ->map(fn (Testimonial $testimonial): array => [
                    'id' => $testimonial->id,
                    'name' => $testimonial->name,
                    'role' => $testimonial->role,
                    'institution' => $testimonial->institution,
                    'quote' => $testimonial->quote,
                    'rating' => $testimonial->rating,
                ])
                ->all(),
            'faqs' => Faq::query()
                ->where('is_published', true)
                ->orderBy('sort_order')
                ->get()
                ->map(fn (Faq $faq): array => [
                    'id' => $faq->id,
                    'question' => $faq->question,
                    'answer' => $faq->answer,
                ])
                ->all(),
        ]);
    }
}
