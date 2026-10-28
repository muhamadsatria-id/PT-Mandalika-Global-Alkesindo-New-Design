<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\File;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\PngEncoder;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\ImageManager;

class BrandingController extends Controller
{
    public function uploadFavicon(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'favicon' => ['required', File::types(['jpg', 'jpeg', 'png', 'webp', 'avif', 'ico'])->max(5120)],
        ]);

        $file = $validated['favicon'];
        $manager = new ImageManager(new Driver());

        // Generate favicon.ico (multi-size fallback) and PNG versions
        $image = $manager->decode(file_get_contents($file->getRealPath()));
        
        // Create favicon.ico equivalent as PNG 32x32 for simplicity
        $favicon32 = clone $image;
        if (method_exists($favicon32, 'cover')) {
            $favicon32 = $favicon32->cover(32, 32);
        } elseif (method_exists($favicon32, 'resize')) {
            $favicon32 = $favicon32->resize(32, 32);
        }
        $favicon32Path = 'branding/favicon-32.png';
        Storage::disk('public')->put($favicon32Path, (string) $favicon32->encode(new PngEncoder()));
        Setting::set('favicon_32', '/storage/'.$favicon32Path, 'branding', 'string');

        // Apple touch icon 180x180
        $apple = clone $image;
        if (method_exists($apple, 'cover')) {
            $apple = $apple->cover(180, 180);
        } elseif (method_exists($apple, 'resize')) {
            $apple = $apple->resize(180, 180);
        }
        $applePath = 'branding/apple-touch-icon.png';
        Storage::disk('public')->put($applePath, (string) $apple->encode(new PngEncoder()));
        Setting::set('apple_touch_icon', '/storage/'.$applePath, 'branding', 'string');

        // Site icon / general 512x512
        $siteIcon = clone $image;
        if (method_exists($siteIcon, 'scaleDown')) {
            $siteIcon = $siteIcon->scaleDown(width: 512);
        } elseif (method_exists($siteIcon, 'resize')) {
            $siteIcon = $siteIcon->resize(512, 512);
        }
        $siteIconPath = 'branding/site-icon-512.png';
        Storage::disk('public')->put($siteIconPath, (string) $siteIcon->encode(new PngEncoder()));
        Setting::set('site_icon', '/storage/'.$siteIconPath, 'branding', 'string');

        // Also save as webp for modern browsers
        $faviconWebp = clone $image;
        if (method_exists($faviconWebp, 'cover')) {
            $faviconWebp = $faviconWebp->cover(32, 32);
        }
        $faviconWebpPath = 'branding/favicon-32.webp';
        Storage::disk('public')->put($faviconWebpPath, (string) $faviconWebp->encode(new WebpEncoder(quality: 90)));
        Setting::set('favicon_webp', '/storage/'.$faviconWebpPath, 'branding', 'string');

        return back()->with('success', 'Favicon, shortcut icon, dan Apple Touch Icon berhasil diupdate.');
    }

    public function resetFavicon(): RedirectResponse
    {
        Setting::set('favicon_32', '', 'branding', 'string');
        Setting::set('apple_touch_icon', '', 'branding', 'string');
        Setting::set('site_icon', '', 'branding', 'string');
        Setting::set('favicon_webp', '', 'branding', 'string');

        return back()->with('success', 'Ikon situs dikembalikan ke default.');
    }

    public function uploadLogo(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'site_logo' => ['required', File::types(['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg'])->max(5120)],
        ]);

        $file = $validated['site_logo'];
        $extension = strtolower($file->getClientOriginalExtension());

        if ($extension === 'svg') {
            $contents = file_get_contents($file->getRealPath());
            $filename = 'site-logo-'.Str::uuid().'.svg';
            $path = 'branding/'.$filename;
            Storage::disk('public')->put($path, $contents);
            Setting::set('site_logo', '/storage/'.$path, 'branding', 'string');
        } else {
            $manager = new ImageManager(new Driver());
            $image = $manager->decode(file_get_contents($file->getRealPath()));
            if (method_exists($image, 'scaleDown')) {
                $image = $image->scaleDown(width: 512);
            }
            $filename = 'site-logo-'.Str::uuid().'.webp';
            $path = 'branding/'.$filename;
            $encoded = $image->encode(new WebpEncoder(quality: 90));
            Storage::disk('public')->put($path, (string) $encoded);
            Setting::set('site_logo', '/storage/'.$path, 'branding', 'string');
        }

        return back()->with('success', 'Logo situs berhasil diupload.');
    }

    public function resetLogo(): RedirectResponse
    {
        Setting::set('site_logo', '', 'branding', 'string');

        return back()->with('success', 'Logo situs dikembalikan ke default.');
    }
}
