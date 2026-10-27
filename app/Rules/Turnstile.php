<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;

class Turnstile implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $secret = config('services.turnstile.secret');

        if (! is_string($secret) || $secret === '') {
            return;
        }

        if (! is_string($value) || $value === '') {
            $fail('Selesaikan verifikasi keamanan terlebih dahulu.');

            return;
        }

        $response = Http::asForm()
            ->timeout(5)
            ->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
                'secret' => $secret,
                'response' => $value,
                'remoteip' => request()->ip(),
            ]);

        if (! $response->ok() || $response->json('success') !== true) {
            $fail('Verifikasi keamanan tidak berhasil. Muat ulang halaman lalu coba lagi.');
        }
    }
}
