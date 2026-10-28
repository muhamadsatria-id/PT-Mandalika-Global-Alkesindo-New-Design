<?php

namespace App\Services;

use App\Enums\ServicePreference;
use App\Models\Setting;
use App\Models\WaTemplate;
use Illuminate\Support\Str;

class WhatsAppLinkService
{
    /**
     * Nomor WhatsApp dari tabel settings, sudah dinormalisasi.
     */
    public function number(string $key = 'whatsapp_number'): ?string
    {
        $value = Setting::get($key);

        if ($value === null) {
            return null;
        }

        return $this->normalize($value);
    }

    /**
     * Normalisasi nomor ke format 62xxxxxxxxxx tanpa simbol.
     * Contoh: 0812-3456-7890 -> 6281234567890, +62 812 3456 7890 -> 6281234567890.
     */
    public function normalize(string $number): string
    {
        $digits = preg_replace('/\D+/', '', $number) ?? '';

        if (Str::startsWith($digits, '0')) {
            return '62'.substr($digits, 1);
        }

        if (! Str::startsWith($digits, '62')) {
            return '62'.$digits;
        }

        return $digits;
    }

    /**
     * Bangun URL wa.me untuk nomor tertentu.
     */
    public function link(string $number, string $text): string
    {
        return 'https://wa.me/'.$this->normalize($number).'?text='.rawurlencode($text);
    }

    /**
     * Bangun URL wa.me memakai nomor dari settings.
     * Mengembalikan null bila nomor belum diatur admin.
     */
    public function url(string $text, string $key = 'whatsapp_number'): ?string
    {
        $number = $this->number($key);

        if ($number === null) {
            return null;
        }

        return $this->link($number, $text);
    }

    /**
     * Template pesan inquiry produk sesuai PRD bagian 8.
     *
     * @param  array{code: string, nama: string, instansi: string, kota: string, items: array<int, array{product_name: string, brand: string, qty: int}>, catatan?: string|null, source_url: string}  $data
     */
    public function inquiryMessage(array $data): string
    {
        $lines = [
            'Halo PT. Mandalika Global Alkesindo, saya ingin meminta penawaran alat kesehatan.'
            'Kode: '.$data['code'],
            'Nama: '.$data['nama'].' | Instansi: '.$data['instansi'].' | Kota: '.$data['kota'],
            'Produk:',
        ];

        foreach (array_values($data['items']) as $index => $item) {
            $lines[] = ($index + 1).'. '.$item['product_name'].' ('.$item['brand'].') x'.$item['qty'];
        }

        if (filled($data['catatan'] ?? null)) {
            $lines[] = 'Catatan: '.$data['catatan'];
        }

        $lines[] = 'Sumber: '.$data['source_url'];

        return implode("\n", $lines);
    }

    /**
     * Template permintaan servis sesuai PRD bagian 8.
     *
     * @param  array{code: string, equipment_name: string, brand?: string|null, model?: string|null, serial_number?: string|null, issue: string, location?: string|null, preference: ServicePreference|string}  $data
     */
    public function serviceMessage(array $data): string
    {
        $preference = $data['preference'] instanceof ServicePreference
            ? $data['preference']->label()
            : $data['preference'];

        $brandModel = trim(implode(' ', array_filter([
            $data['brand'] ?? null,
            $data['model'] ?? null,
        ])));

        return implode("\n", [
            'Halo, saya ingin mengajukan servis alat.',
            'Kode: '.$data['code'],
            'Alat: '.$data['equipment_name'].' | Brand/Model: '.($brandModel !== '' ? $brandModel : '-').' | No. seri: '.($data['serial_number'] ?? '-'),
            'Keluhan: '.$data['issue'],
            'Lokasi: '.($data['location'] ?? '-').' | Preferensi: '.$preference,
        ]);
    }

    /**
     * Isi variabel pada template balasan sales/teknisi.
     *
     * @param  array<string, string|int|null>  $variables
     */
    public function replyTemplate(string $body, array $variables = []): string
    {
        foreach ($variables as $key => $value) {
            $body = str_replace('{'.$key.'}', (string) $value, $body);
        }

        return $body;
    }

    /**
     * Ambil template tersimpan (wa_templates) lalu isi variabelnya.
     *
     * @param  array<string, string|int|null>  $variables
     */
    public function storedTemplate(string $key, array $variables = []): ?string
    {
        $template = WaTemplate::query()->where('key', $key)->first();

        if ($template === null) {
            return null;
        }

        return $this->replyTemplate($template->body, $variables);
    }
}
