@php
    /*
     * Server-rendered fallback untuk crawler dan pengunjung tanpa JavaScript.
     * Konten ini digantikan oleh aplikasi Inertia/React saat JavaScript aktif.
     */
    $props = $page['props'] ?? [];
    $seo = is_array($props['seo'] ?? null) ? $props['seo'] : [];
    $settings = is_array($props['settings'] ?? null) ? $props['settings'] : [];
    $component = $page['component'] ?? '';

    $companyName = $settings['company_name'] ?? 'PT. Mandalika Global Alkesindo';
    $companyTagline = $settings['company_tagline'] ?? null;
    $companyAddress = $settings['company_address'] ?? null;
    $companyEmail = $settings['company_email'] ?? null;
    $companyHours = $settings['company_hours'] ?? null;
    $whatsappNumber = $settings['whatsapp_number'] ?? null;

    $headline = match ($component) {
        'public/home' => 'Alat medis yang siap dipakai, bukan sekadar dikirim',
        'public/about' => 'Tentang '.$companyName,
        'public/catalog' => 'Katalog alat kesehatan',
        'public/brands' => 'Brand alat kesehatan yang kami distribusikan',
        'public/layanan/index' => 'Layanan pengadaan, instalasi, dan servis alat kesehatan',
        'public/legal' => 'Legalitas dan dokumen perusahaan',
        'public/contact' => 'Hubungi '.$companyName,
        'public/gallery' => 'Galeri kegiatan',
        'public/privacy' => 'Kebijakan privasi',
        'public/quote' => 'Daftar penawaran alat kesehatan',
        'public/service' => 'Layanan servis alat kesehatan',
        'public/product' => $props['product']['name'] ?? 'Detail produk',
        default => $seo['title'] ?? $companyName,
    };

    $intro = $seo['description']
        ?? ($settings['seo_description'] ?? null)
        ?? 'Pengadaan alat kesehatan, layanan servis, dan pendampingan teknis untuk rumah sakit, klinik, dan dinas kesehatan di Indonesia.';

    $product = is_array($props['product'] ?? null) ? $props['product'] : null;
    $products = $props['featuredProducts'] ?? ($props['related'] ?? ($props['products']['data'] ?? null));
    $categories = is_array($props['categories'] ?? null) ? $props['categories'] : [];
    $brands = array_merge(
        is_array($props['brands'] ?? null) ? $props['brands'] : [],
        is_array($props['partnerBrands'] ?? null) ? $props['partnerBrands'] : [],
    );
    $brandNames = collect($brands)->pluck('name')->filter()->unique()->values()->all();
    $faqs = is_array($props['faqs'] ?? null) ? $props['faqs'] : [];
    $documents = is_array($props['documents'] ?? null) ? $props['documents'] : [];
    $galleryItems = is_array($props['items'] ?? null) ? $props['items'] : [];
    $stats = is_array($props['companyStats'] ?? null) ? $props['companyStats'] : [];
    $contact = is_array($props['contact'] ?? null) ? $props['contact'] : [];

    $navItems = [
        ['label' => 'Beranda', 'url' => route('home')],
        ['label' => 'Tentang', 'url' => route('about')],
        ['label' => 'Katalog', 'url' => route('catalog.index')],
        ['label' => 'Brand', 'url' => route('brand')],
        ['label' => 'Legalitas', 'url' => route('legal')],
        ['label' => 'Layanan', 'url' => route('layanan')],
        ['label' => 'Kontak', 'url' => route('contact')],
    ];

    $footerLinks = [
        ['label' => 'Katalog alat kesehatan', 'url' => route('catalog.index')],
        ['label' => 'Layanan servis', 'url' => route('service.index')],
        ['label' => 'Galeri kegiatan', 'url' => route('gallery')],
        ['label' => 'Daftar penawaran', 'url' => route('quote.index')],
        ['label' => 'Kebijakan privasi', 'url' => route('privacy')],
    ];
@endphp

<div class="bg-background text-foreground">
    <div class="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header class="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
            <a href="{{ route('home') }}" class="text-sm font-bold tracking-tight">
                {{ $companyName }}
            </a>
            <nav aria-label="Navigasi utama" class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                @foreach ($navItems as $item)
                    <a href="{{ $item['url'] }}" class="transition-colors hover:text-foreground">
                        {{ $item['label'] }}
                    </a>
                @endforeach
            </nav>
        </header>

        <main class="py-8">
            <h1 class="max-w-4xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                {{ $headline }}
            </h1>
            <p class="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {{ $intro }}
            </p>
            @if ($companyTagline)
                <p class="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {{ $companyTagline }}
                </p>
            @endif

            @if ($product !== null)
                <section class="mt-8">
                    <h2 class="text-2xl font-semibold tracking-tight">Deskripsi produk</h2>
                    @if (! empty($product['short_description']))
                        <p class="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                            {{ $product['short_description'] }}
                        </p>
                    @endif
                    @if (! empty($product['description']))
                        <p class="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                            {{ $product['description'] }}
                        </p>
                    @endif
                    @if (! empty($product['specs']))
                        <h3 class="mt-6 text-lg font-semibold tracking-tight">Spesifikasi</h3>
                        <dl class="mt-3 grid max-w-3xl gap-2 text-sm sm:grid-cols-2">
                            @foreach ($product['specs'] as $spec)
                                <div class="flex justify-between gap-4 border-b border-border py-2">
                                    <dt class="text-muted-foreground">{{ $spec['label'] ?? '' }}</dt>
                                    <dd class="text-right font-medium">{{ $spec['value'] ?? '' }}</dd>
                                </div>
                            @endforeach
                        </dl>
                    @endif
                </section>
            @endif

            @if (! empty($categories))
                <section class="mt-10">
                    <h2 class="text-2xl font-semibold tracking-tight">Kategori produk</h2>
                    <ul class="mt-4 flex flex-wrap gap-2">
                        @foreach ($categories as $category)
                            @if (! empty($category['slug']))
                                <li>
                                    <a
                                        href="{{ route('catalog.index', ['kategori' => $category['slug']]) }}"
                                        class="inline-flex rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {{ $category['name'] ?? '' }}
                                    </a>
                                </li>
                            @endif
                        @endforeach
                    </ul>
                </section>
            @endif

            @if (is_array($products) && count($products) > 0)
                <section class="mt-10">
                    <h2 class="text-2xl font-semibold tracking-tight">Produk alat kesehatan</h2>
                    <ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        @foreach ($products as $item)
                            <li class="rounded-xl border border-border p-4">
                                <h3 class="text-base font-semibold tracking-tight">
                                    @if (! empty($item['url']))
                                        <a href="{{ $item['url'] }}" class="hover:underline">
                                            {{ $item['name'] ?? '' }}
                                        </a>
                                    @else
                                        {{ $item['name'] ?? '' }}
                                    @endif
                                </h3>
                                <p class="mt-1 text-sm text-muted-foreground">
                                    {{ collect([$item['brand'] ?? null, $item['category'] ?? null, $item['model'] ?? null])->filter()->implode(' • ') }}
                                </p>
                            </li>
                        @endforeach
                    </ul>
                </section>
            @endif

            @if (! empty($brandNames))
                <section class="mt-10">
                    <h2 class="text-2xl font-semibold tracking-tight">Brand yang didistribusikan</h2>
                    <p class="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {{ implode(', ', $brandNames) }}.
                    </p>
                    <p class="mt-2 text-sm">
                        <a href="{{ route('brand') }}" class="font-medium text-primary hover:underline">
                            Lihat semua brand
                        </a>
                    </p>
                </section>
            @endif

            @if (! empty($stats))
                <section class="mt-10">
                    <h2 class="text-2xl font-semibold tracking-tight">Ringkasan perusahaan</h2>
                    <ul class="mt-4 grid gap-3 sm:grid-cols-3">
                        @foreach ($stats as $stat)
                            <li class="rounded-xl border border-border p-4">
                                <p class="text-xl font-semibold tracking-tight">
                                    {{ $stat['value'] ?? '' }}{{ $stat['suffix'] ?? '' }}
                                </p>
                                <p class="mt-1 text-sm text-muted-foreground">{{ $stat['label'] ?? '' }}</p>
                            </li>
                        @endforeach
                    </ul>
                </section>
            @endif

            @if (! empty($documents))
                <section class="mt-10">
                    <h2 class="text-2xl font-semibold tracking-tight">Dokumen legalitas</h2>
                    <ul class="mt-4 space-y-3">
                        @foreach ($documents as $document)
                            <li class="border-b border-border pb-3">
                                <h3 class="text-base font-semibold tracking-tight">{{ $document['title'] ?? '' }}</h3>
                                @if (! empty($document['description']))
                                    <p class="mt-1 text-sm leading-relaxed text-muted-foreground">
                                        {{ $document['description'] }}
                                    </p>
                                @endif
                                @if (! empty($document['issued_by']))
                                    <p class="mt-1 text-sm text-muted-foreground">
                                        Diterbitkan oleh {{ $document['issued_by'] }}
                                    </p>
                                @endif
                            </li>
                        @endforeach
                    </ul>
                </section>
            @endif

            @if (! empty($galleryItems))
                <section class="mt-10">
                    <h2 class="text-2xl font-semibold tracking-tight">Galeri kegiatan</h2>
                    <ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        @foreach ($galleryItems as $item)
                            <li class="rounded-xl border border-border p-4">
                                <h3 class="text-base font-semibold tracking-tight">{{ $item['title'] ?? '' }}</h3>
                                @if (! empty($item['description']))
                                    <p class="mt-1 text-sm leading-relaxed text-muted-foreground">
                                        {{ $item['description'] }}
                                    </p>
                                @endif
                            </li>
                        @endforeach
                    </ul>
                </section>
            @endif

            @if (! empty($faqs))
                <section class="mt-10">
                    <h2 class="text-2xl font-semibold tracking-tight">Pertanyaan umum</h2>
                    <div class="mt-4 space-y-4">
                        @foreach ($faqs as $faq)
                            <article class="border-b border-border pb-4">
                                <h3 class="text-base font-semibold tracking-tight">{{ $faq['question'] ?? '' }}</h3>
                                <p class="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                    {{ $faq['answer'] ?? '' }}
                                </p>
                            </article>
                        @endforeach
                    </div>
                </section>
            @endif

            @if (! empty($contact))
                <section class="mt-10">
                    <h2 class="text-2xl font-semibold tracking-tight">Informasi kontak</h2>
                    <ul class="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        @if (! empty($contact['address']))
                            <li>Alamat: {{ $contact['address'] }}</li>
                        @endif
                        @if (! empty($contact['hours']))
                            <li>Jam operasional: {{ $contact['hours'] }}</li>
                        @endif
                        @if (! empty($contact['email']))
                            <li>Email: {{ $contact['email'] }}</li>
                        @endif
                        @if (! empty($contact['phone']))
                            <li>Telepon/WhatsApp: {{ $contact['phone'] }}</li>
                        @endif
                    </ul>
                </section>
            @endif
        </main>

        <footer class="mt-10 border-t border-border pt-6">
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                    <h2 class="text-sm font-bold">Navigasi</h2>
                    <ul class="mt-3 space-y-2 text-sm text-muted-foreground">
                        @foreach ($navItems as $item)
                            <li>
                                <a href="{{ $item['url'] }}" class="transition-colors hover:text-foreground">
                                    {{ $item['label'] }}
                                </a>
                            </li>
                        @endforeach
                    </ul>
                </div>
                <div>
                    <h2 class="text-sm font-bold">Produk &amp; layanan</h2>
                    <ul class="mt-3 space-y-2 text-sm text-muted-foreground">
                        @foreach ($footerLinks as $item)
                            <li>
                                <a href="{{ $item['url'] }}" class="transition-colors hover:text-foreground">
                                    {{ $item['label'] }}
                                </a>
                            </li>
                        @endforeach
                    </ul>
                </div>
                <div>
                    <h2 class="text-sm font-bold">Kontak</h2>
                    <ul class="mt-3 space-y-2 text-sm text-muted-foreground">
                        @if ($companyAddress)
                            <li>{{ $companyAddress }}</li>
                        @endif
                        @if ($companyEmail)
                            <li>
                                <a href="mailto:{{ $companyEmail }}" class="hover:text-foreground">{{ $companyEmail }}</a>
                            </li>
                        @endif
                        @if ($companyHours)
                            <li>{{ $companyHours }}</li>
                        @endif
                        @if ($whatsappNumber)
                            <li>WhatsApp: +{{ $whatsappNumber }}</li>
                        @endif
                    </ul>
                </div>
            </div>
            <p class="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
                © {{ date('Y') }} {{ $companyName }}.
            </p>
        </footer>
    </div>
</div>
