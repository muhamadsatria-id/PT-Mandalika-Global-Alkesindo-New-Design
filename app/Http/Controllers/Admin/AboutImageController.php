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

class AboutImageController extends Controller
{
    public function upload(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'about_image' => ['required', File::types(['jpg', 'jpeg', 'png', 'webp', 'avif'])->max(5120)],
        ]);

        $file = $validated['about_image'];
        $manager = new ImageManager(new Driver());
        $image = $manager->decode(file_get_contents($file->getRealPath()));
        if (method_exists($image, 'scaleDown')) {
            $image = $image->scaleDown(width: 1600);
        } elseif (method_exists($image, 'resize')) {
            $image = $image->resize(1600);
        }

        $filename = 'about-image-'.Str::uuid().'.webp';
        $path = 'about/'.$filename;

        $encoded = $image->encode(new WebpEncoder(quality: 82));
        Storage::disk('public')->put($path, (string) $encoded);

        Setting::set('about_image', '/storage/'.$path, 'about', 'string');

        return back()->with('success', 'Gambar halaman Tentang Kami berhasil diupload.');
    }

    public function reset(): RedirectResponse
    {
        Setting::set('about_image', '', 'about', 'string');

        return back()->with('success', 'Gambar halaman Tentang Kami dihapus.');
    }
}
