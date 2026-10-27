<?php

use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CompanyStatController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\GalleryCategoryController;
use App\Http\Controllers\Admin\GalleryItemController;
use App\Http\Controllers\Admin\HeroBackgroundController;
use App\Http\Controllers\Admin\InquiryController;
use App\Http\Controllers\Admin\LegalDocumentController;
use App\Http\Controllers\Admin\PartnerBrandController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\PublicSite\AboutController;
use App\Http\Controllers\PublicSite\BrandController as PublicBrandController;
use App\Http\Controllers\PublicSite\CatalogController;
use App\Http\Controllers\PublicSite\ContactController;
use App\Http\Controllers\PublicSite\GalleryController;
use App\Http\Controllers\PublicSite\HomeController;
use App\Http\Controllers\PublicSite\LayananController;
use App\Http\Controllers\PublicSite\LegalController;
use App\Http\Controllers\PublicSite\PrivacyController;
use App\Http\Controllers\PublicSite\ProductController as PublicProductController;
use App\Http\Controllers\PublicSite\QuoteController;
use App\Http\Controllers\PublicSite\RobotsController;
use App\Http\Controllers\PublicSite\ServiceController as PublicServiceController;
use App\Http\Controllers\PublicSite\SitemapController;
use App\Support\Roles;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('katalog', CatalogController::class)->name('catalog.index');
Route::get('produk/{category:slug}/{product:slug}', [PublicProductController::class, 'show'])
    ->name('catalog.show');
Route::get('layanan', LayananController::class)->name('layanan');
Route::get('tentang', AboutController::class)->name('about');
Route::get('brand', PublicBrandController::class)->name('brand');
Route::get('brands', fn () => redirect()->route('brand', [], 301))->name('brands');
Route::get('legalitas', LegalController::class)->name('legal');
Route::get('galeri', GalleryController::class)->name('gallery');
Route::get('kontak', ContactController::class)->name('contact');
Route::get('kebijakan-privasi', PrivacyController::class)->name('privacy');

Route::get('penawaran', [QuoteController::class, 'index'])->name('quote.index');
Route::post('penawaran', [QuoteController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('quote.store');
Route::get('penawaran/terkirim', [QuoteController::class, 'sent'])->name('quote.sent');

Route::middleware('service.enabled')->group(function (): void {
    Route::get('layanan-servis', [PublicServiceController::class, 'index'])->name('service.index');
    Route::post('layanan-servis', [PublicServiceController::class, 'store'])
        ->middleware('throttle:5,1')
        ->name('service.store');
    Route::get('layanan-servis/terkirim', [PublicServiceController::class, 'sent'])->name('service.sent');
    Route::get('layanan-servis/status', [PublicServiceController::class, 'status'])->name('service.status');
    Route::post('layanan-servis/status', [PublicServiceController::class, 'check'])
        ->middleware('throttle:10,1')
        ->name('service.check');
});

Route::get('sitemap.xml', SitemapController::class)->name('sitemap');
Route::get('robots.txt', RobotsController::class)->name('robots');

Route::middleware('guest')->group(function (): void {
    Route::get('login', [LoginController::class, 'create'])->name('login');
    Route::post('login', [LoginController::class, 'store'])->name('login.store');
});

Route::post('logout', [LoginController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

Route::middleware(['auth', 'role:'.implode('|', Roles::all())])
    ->prefix('admin')
    ->name('admin.')
    ->group(function (): void {
        Route::get('/', DashboardController::class)->name('dashboard');

        Route::middleware('permission:products.view|products.manage')->group(function (): void {
            Route::get('products', [ProductController::class, 'index'])->name('products.index');
            Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
            Route::get('products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
        });

        Route::middleware('permission:products.manage')->group(function (): void {
            Route::post('products', [ProductController::class, 'store'])->name('products.store');
            Route::match(['put', 'patch'], 'products/{product}', [ProductController::class, 'update'])
                ->name('products.update');
            Route::delete('products/{product}', [ProductController::class, 'destroy'])
                ->name('products.destroy');
        });

        Route::middleware('permission:products.manage|content.manage')->group(function (): void {
            Route::resource('categories', CategoryController::class)->except('show');
            Route::resource('brands', BrandController::class)->except('show');
        });

        Route::middleware('permission:content.manage')->group(function (): void {
            Route::resource('legal-documents', LegalDocumentController::class)->except('show');
            Route::resource('gallery-categories', GalleryCategoryController::class)->except('show');
            Route::resource('gallery-items', GalleryItemController::class)->except('show');
            Route::resource('testimonials', TestimonialController::class)->except('show');
            Route::resource('faqs', FaqController::class)->except('show');
            Route::resource('partner-brands', PartnerBrandController::class)->except('show');
            Route::resource('company-stats', CompanyStatController::class)->except('show');
        });

        Route::middleware('permission:inquiries.view|inquiries.manage')->group(function (): void {
            Route::get('inquiries', [InquiryController::class, 'index'])->name('inquiries.index');
            Route::get('inquiries/{inquiry}', [InquiryController::class, 'show'])->name('inquiries.show');
        });

        Route::middleware('permission:inquiries.manage')->group(function (): void {
            Route::put('inquiries/{inquiry}', [InquiryController::class, 'update'])
                ->name('inquiries.update');
        });

        Route::middleware('permission:customers.view|customers.manage')->group(function (): void {
            Route::get('customers', [CustomerController::class, 'index'])->name('customers.index');
            Route::get('customers/{customer}', [CustomerController::class, 'show'])->name('customers.show');
        });

        Route::middleware('permission:services.view|services.manage')->group(function (): void {
            Route::get('services', [AdminServiceController::class, 'index'])->name('services.index');
            Route::get('services/{service}', [AdminServiceController::class, 'show'])->name('services.show');
            Route::get('services/{service}/receipt', [AdminServiceController::class, 'receipt'])
                ->name('services.receipt');
            Route::get('services/{service}/attachments/{attachment}', [AdminServiceController::class, 'attachment'])
                ->name('services.attachment');
        });

        Route::middleware('permission:services.manage')->group(function (): void {
            Route::put('services/{service}', [AdminServiceController::class, 'update'])
                ->name('services.update');
        });

        Route::middleware('permission:content.manage')->group(function (): void {
            Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
            Route::put('settings', [SettingController::class, 'update'])->name('settings.update');
            Route::post('settings/hero-background', [HeroBackgroundController::class, 'upload'])
                ->name('settings.hero-background.upload');
            Route::delete('settings/hero-background', [HeroBackgroundController::class, 'reset'])
                ->name('settings.hero-background.reset');
        });
    });
