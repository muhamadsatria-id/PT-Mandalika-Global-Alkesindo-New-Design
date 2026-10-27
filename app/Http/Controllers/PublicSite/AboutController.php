<?php

namespace App\Http\Controllers\PublicSite;

use App\Http\Controllers\Controller;
use App\Models\CompanyStat;
use App\Models\PartnerBrand;
use App\Models\Setting;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function __invoke(): Response
    {
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

        return Inertia::render('public/about', [
            'seo' => [
                'title' => 'Tentang kami',
                'description' => 'Profil PT. Mandalika Global Alkesindo - distributor alat kesehatan, pengadaan, instalasi, servis, dan pendampingan teknis untuk rumah sakit, klinik, dan dinas kesehatan di Indonesia.',
                'canonical' => route('about'),
            ],
            'profile' => [
                'name' => Setting::get('company_name') ?? 'PT. Mandalika Global Alkesindo',
                'tagline' => Setting::get('company_tagline'),
                'address' => Setting::get('company_address'),
                'hours' => Setting::get('company_hours'),
                'email' => Setting::get('company_email'),
                'phone' => Setting::get('whatsapp_number'),
                'founded_year' => Setting::get('company_founded_year'),
            ],
            'partnerBrands' => $partnerBrands,
            'companyStats' => $companyStats,
        ]);
    }
}
