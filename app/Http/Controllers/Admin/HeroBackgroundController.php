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
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\ImageManager;

class HeroBackgroundController extends Controller
{
    public function upload(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'hero_background' => ['required', File::types(['jpg', 'jpeg', 'png', 'webp', 'avif'])->max(5120)],
        ]);

        $file = $validated['hero_background'];
        $manager = new ImageManager(new Driver);
        $image = $manager->decode(file_get_contents($file->getRealPath()));
        if (method_exists($image, 'scaleDown')) {
            $image = $image->scaleDown(width: 1920);
        } elseif (method_exists($image, 'resize')) {
            $image = $image->resize(1920);
        }

        $filename = 'hero-background-'.Str::uuid().'.webp';
        $path = 'hero/'.$filename;

        $encoded = $image->encode(new WebpEncoder(quality: 82));
        Storage::disk('public')->put($path, (string) $encoded);

        Setting::set('hero_background', '/storage/'.$path, 'hero', 'string');

        return back()->with('success', 'Background hero berhasil diupload dan dikonversi ke WebP.');
    }

    public function reset(): RedirectResponse
    {
        Setting::set('hero_background', '', 'hero', 'string');

        return back()->with('success', 'Background hero dikembalikan ke default random.');
    }
}
