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
        return Inertia::render('public/contact', [
            'seo' => [
                'title' => 'Kontak',
                'description' => 'Hubungi tim PT. Mandalika Global Alkesindo untuk pengadaan alat kesehatan dan layanan servis.',
                'canonical' => route('contact'),
            ],
            'contact' => [
                'address' => Setting::get('company_address'),
                'city' => Setting::get('company_city'),
                'hours' => Setting::get('company_hours'),
                'email' => Setting::get('company_email'),
                'instagram' => Setting::get('company_instagram'),
                'map_url' => $this->mapUrl(Setting::get('company_address')),
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
