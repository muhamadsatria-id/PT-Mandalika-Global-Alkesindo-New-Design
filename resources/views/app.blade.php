@php
    $pageProps = $page['props'] ?? [];
    $seo = is_array($pageProps['seo'] ?? null) ? $pageProps['seo'] : [];
    $siteSettings = is_array($pageProps['settings'] ?? null) ? $pageProps['settings'] : [];
    $appName = config('app.name', 'PT. Mandalika Global Alkesindo');

    $baseTitle = filled($seo['title'] ?? null) ? $seo['title'] : null;
    $titleWithSuffix = $baseTitle ? $baseTitle.' — '.$appName : null;
    $pageTitle = $baseTitle === null
        ? $appName
        : (str_contains($baseTitle, 'Mandalika') || mb_strlen($titleWithSuffix) > 62
            ? $baseTitle
            : $titleWithSuffix);

    $metaDescription = $seo['description']
        ?? ($siteSettings['seo_description'] ?? null)
        ?? 'Pengadaan alat kesehatan, layanan servis, dan pendampingan teknis untuk rumah sakit, klinik, dan dinas kesehatan di Indonesia.';

    $canonical = $seo['canonical'] ?? url()->current();
    $component = $page['component'] ?? '';
    $isPublicPage = str_starts_with($component, 'public/');
    $noindex = ! $isPublicPage || in_array($component, [
        'public/quote-sent',
        'public/service-sent',
        'public/service-status',
    ], true);

    $siteLogo = $siteSettings['site_logo'] ?? null;
    $ogImage = $siteLogo
        ? (str_starts_with($siteLogo, 'http') ? $siteLogo : url($siteLogo))
        : url('/mga.png');

    $siteIcon = $siteSettings['site_icon'] ?? null;
    $favicon32 = $siteSettings['favicon_32'] ?? null;
    $faviconWebp = $siteSettings['favicon_webp'] ?? null;
    $appleTouchIcon = $siteSettings['apple_touch_icon'] ?? null;
@endphp
<!DOCTYPE html>
<html lang="id">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#f2470c">
        <meta name="format-detection" content="telephone=no">

        <title data-inertia="title">{{ $pageTitle }}</title>
        <meta data-inertia="description" name="description" content="{{ $metaDescription }}">
        <meta data-inertia="robots" name="robots" content="{{ $noindex ? 'noindex,nofollow' : 'index,follow' }}">
        <link data-inertia="canonical" rel="canonical" href="{{ $canonical }}">

        <meta data-inertia="og:type" property="og:type" content="website">
        <meta data-inertia="og:site_name" property="og:site_name" content="{{ $appName }}">
        <meta data-inertia="og:title" property="og:title" content="{{ $baseTitle ?? $appName }}">
        <meta data-inertia="og:description" property="og:description" content="{{ $metaDescription }}">
        <meta data-inertia="og:url" property="og:url" content="{{ $canonical }}">
        <meta data-inertia="og:image" property="og:image" content="{{ $ogImage }}">
        <meta data-inertia="og:locale" property="og:locale" content="id_ID">

        <meta data-inertia="twitter:card" name="twitter:card" content="summary_large_image">
        <meta data-inertia="twitter:title" name="twitter:title" content="{{ $baseTitle ?? $appName }}">
        <meta data-inertia="twitter:description" name="twitter:description" content="{{ $metaDescription }}">
        <meta data-inertia="twitter:image" name="twitter:image" content="{{ $ogImage }}">

        <link rel="icon" href="{{ $favicon32 ?: '/favicon.ico' }}" sizes="32x32">
        <link rel="shortcut icon" href="{{ $favicon32 ?: '/favicon.ico' }}" type="image/png">
        @if ($faviconWebp)
            <link rel="icon" href="{{ $faviconWebp }}" type="image/webp" sizes="32x32">
        @endif
        <link rel="icon" href="{{ $siteIcon ?: '/mga.png' }}" type="image/png" sizes="512x512">
        <link rel="icon" href="/mga.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="{{ $appleTouchIcon ?: '/mga.png' }}">

        @if ($isPublicPage)
            @php
                $companyName = $siteSettings['company_name'] ?? $appName;
                $organization = array_filter([
                    '@context' => 'https://schema.org',
                    '@type' => 'Organization',
                    'name' => $companyName,
                    'url' => route('home'),
                    'logo' => $ogImage,
                    'description' => $metaDescription,
                    'email' => $siteSettings['company_email'] ?? null,
                    'telephone' => filled($siteSettings['whatsapp_number'] ?? null)
                        ? '+'.$siteSettings['whatsapp_number']
                        : null,
                    'address' => filled($siteSettings['company_address'] ?? null)
                        ? array_filter([
                            '@type' => 'PostalAddress',
                            'streetAddress' => $siteSettings['company_address'],
                            'addressLocality' => $siteSettings['company_city'] ?? null,
                            'addressCountry' => 'ID',
                        ])
                        : null,
                    'sameAs' => filled($siteSettings['company_instagram'] ?? null)
                        ? [$siteSettings['company_instagram']]
                        : null,
                ]);

                $website = [
                    '@context' => 'https://schema.org',
                    '@type' => 'WebSite',
                    'name' => $companyName,
                    'url' => route('home'),
                    'inLanguage' => 'id-ID',
                    'potentialAction' => [
                        '@type' => 'SearchAction',
                        'target' => route('catalog.index').'?q={search_term_string}',
                        'query-input' => 'required name=search_term_string',
                    ],
                ];
            @endphp
            <script type="application/ld+json">{!! json_encode($organization, JSON_HEX_TAG | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>
            <script type="application/ld+json">{!! json_encode($website, JSON_HEX_TAG | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>
        @endif

        <script>
            (function () {
                var stored = localStorage.getItem('theme');
                var dark = stored
                    ? stored === 'dark'
                    : window.matchMedia('(prefers-color-scheme: dark)').matches;

                document.documentElement.classList.toggle('dark', dark);
                document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
            })();
        </script>

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    </head>
    <body class="font-sans antialiased">
        <script data-page="app" type="application/json">{!! json_encode($page, JSON_HEX_TAG) !!}</script>
        <div id="app">
            @if ($isPublicPage)
                @include('partials.seo-fallback')
            @endif
        </div>
    </body>
</html>
