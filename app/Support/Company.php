<?php

namespace App\Support;

use App\Models\Setting;
use Illuminate\Support\Arr;

class Company
{
    public static function all(): array
    {
        $config = config('company', []);
        try {
            $settings = Setting::allAsArray();
        } catch (\Throwable $e) {
            $settings = [];
        }

        $overrides = [
            'nama_resmi' => $settings['company_name'] ?? ($config['nama_resmi'] ?? null),
            'tagline_pendek' => $settings['company_tagline'] ?? ($config['tagline_pendek'] ?? null),
            'alamat_lengkap' => is_array($config['alamat_lengkap'] ?? null)
                ? array_merge($config['alamat_lengkap'], ['jalan' => $settings['company_address'] ?? ($config['alamat_lengkap']['jalan'] ?? null)])
                : ['jalan' => $settings['company_address'] ?? null],
            'telepon_kantor' => $settings['company_phone'] ?? ($config['telepon_kantor'] ?? null),
            'whatsapp_sales' => $settings['whatsapp_sales'] ?? $settings['whatsapp_number'] ?? ($config['whatsapp_sales'] ?? null),
            'whatsapp_servis' => $settings['whatsapp_service'] ?? $settings['whatsapp_sales'] ?? $settings['whatsapp_number'] ?? ($config['whatsapp_servis'] ?? null),
            'email_sales' => $settings['company_email'] ?? ($config['email_sales'] ?? null),
            'email_servis' => $settings['company_email_secondary'] ?? $settings['company_email'] ?? ($config['email_servis'] ?? null),
            'email_umum' => $settings['company_email'] ?? ($config['email_umum'] ?? null),
            'jam_operasional' => $settings['company_hours'] ?? ($config['jam_operasional'] ?? null),
            'tahun_berdiri' => $settings['company_founded_year'] ?? ($config['tahun_berdiri'] ?? null),
        ];

        return static::arrayMergeDistinct($config, $overrides);
    }

    private static function arrayMergeDistinct(array $array1, array $array2): array
    {
        $merged = $array1;
        foreach ($array2 as $key => $value) {
            if (is_array($value) && isset($merged[$key]) && is_array($merged[$key])) {
                $merged[$key] = static::arrayMergeDistinct($merged[$key], $value);
            } else {
                $merged[$key] = $value;
            }
        }

        return $merged;
    }

    public static function get(string $key, $default = null)
    {
        $all = self::all();

        return Arr::get($all, $key, $default);
    }

    public static function getAddress(): ?string
    {
        $addr = self::get('alamat_lengkap');
        if (is_array($addr)) {
            $parts = array_filter([
                $addr['jalan'] ?? null,
                $addr['kelurahan'] ?? null,
                $addr['kecamatan'] ?? null,
                isset($addr['kota']) ? $addr['kota'].($addr['provinsi'] ? ', '.$addr['provinsi'] : '') : ($addr['provinsi'] ?? null),
                $addr['kode_pos'] ?? null,
            ]);

            return implode(', ', $parts) ?: null;
        }

        return is_string($addr) ? $addr : null;
    }

    public static function whatsappLink(?string $number = null, string $message = ''): string
    {
        $num = $number ?? self::get('whatsapp_sales') ?? self::get('whatsapp_number') ?? '';
        $num = preg_replace('/\D+/', '', $num);
        if (str_starts_with($num, '0')) {
            $num = '62'.substr($num, 1);
        } elseif (! str_starts_with($num, '62')) {
            $num = '62'.$num;
        }
        $text = rawurlencode($message);

        return $text !== '' ? "https://wa.me/{$num}?text={$text}" : "https://wa.me/{$num}";
    }

    public static function formatPhone(?string $number = null): ?string
    {
        $num = $number ?? self::get('telepon_kantor') ?? self::get('whatsapp_sales') ?? '';
        $num = preg_replace('/\D+/', '', $num);
        if ($num === '') {
            return null;
        }
        if (str_starts_with($num, '0')) {
            $num = '62'.substr($num, 1);
        } elseif (! str_starts_with($num, '62')) {
            $num = '62'.$num;
        }

        if (strlen($num) >= 11) {
            return '+'.$num[0].$num[1].' '.substr($num, 2, 3).'-'.substr($num, 5, 4).'-'.substr($num, 9);
        }

        return '+'.$num;
    }
}

if (! function_exists('array_merge_recursive_distinct')) {
    function array_merge_recursive_distinct(array $array1, array $array2): array
    {
        $merged = $array1;
        foreach ($array2 as $key => $value) {
            if (is_array($value) && isset($merged[$key]) && is_array($merged[$key])) {
                $merged[$key] = array_merge_recursive_distinct($merged[$key], $value);
            } else {
                $merged[$key] = $value;
            }
        }

        return $merged;
    }
}
