<!DOCTYPE html>
<html lang="id">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#f2470c">

        @php
            $settings = \App\Models\Setting::allAsArray();
            $siteIcon = $settings['site_icon'] ?? null;
            $favicon32 = $settings['favicon_32'] ?? null;
            $faviconWebp = $settings['favicon_webp'] ?? null;
            $appleTouchIcon = $settings['apple_touch_icon'] ?? null;
            $siteLogo = $settings['site_logo'] ?? null;
        @endphp
        <link rel="icon" href="{{ $favicon32 ?: '/favicon.ico' }}" sizes="32x32">
        <link rel="shortcut icon" href="{{ $favicon32 ?: '/favicon.ico' }}" type="image/png">
        @if ($faviconWebp)
            <link rel="icon" href="{{ $faviconWebp }}" type="image/webp" sizes="32x32">
        @endif
        <link rel="icon" href="{{ $siteIcon ?: '/mga.png' }}" type="image/png" sizes="512x512">
        <link rel="icon" href="/mga.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="{{ $appleTouchIcon ?: '/mga.png' }}">

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
        <x-inertia::head>
            <title>{{ config('app.name', 'PT. Mandalika Global Alkesindo') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
