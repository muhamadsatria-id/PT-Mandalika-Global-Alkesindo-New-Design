<?php

namespace App\Http\Controllers\PublicSite;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function __invoke(): Response
    {
        $address = Setting::get('company_address');
        $phone = Setting::get('whatsapp_number') ?? Setting::get('company_phone');
        $servicePhone = Setting::get('service_whatsapp_number') ?? $phone;

        return Inertia::render('public/contact', [
            'seo' => [
                'title' => 'Kontak & Lokasi',
                'description' => 'Hubungi tim PT. Mandalika Global Alkesindo untuk pengadaan alat kesehatan, penawaran, dan layanan servis.',
                'canonical' => route('contact'),
            ],
            'contact' => [
                'address' => $address,
                'city' => Setting::get('company_city'),
                'hours' => Setting::get('company_hours'),
                'email' => Setting::get('company_email'),
                'phone' => $phone,
                'service_phone' => $servicePhone,
                'instagram' => Setting::get('company_instagram'),
                'emergency_note' => Setting::get('service_emergency_note'),
                'response_time' => Setting::get('service_response_time'),
                'map_url' => $this->mapUrl($address),
            ],
        ]);
    }

    private function mapUrl(?string $address): ?string
    {
        if ($address === null || trim($address) === '') {
            return null;
        }

        return 'https://www.google.com/maps/search/?api=1&query='.rawurlencode($address);
    }
}
