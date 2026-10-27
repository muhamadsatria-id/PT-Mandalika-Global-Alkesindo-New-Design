<?php

namespace App\Http\Controllers\PublicSite;

use App\Http\Controllers\Controller;
use App\Support\Company;
use Inertia\Inertia;
use Inertia\Response;

class LayananController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('public/layanan/index', [
            'seo' => [
                'title' => 'Layanan Pengadaan, Instalasi & Servis Alat Kesehatan – MGA',
                'description' => 'Layanan pengadaan, instalasi & pelatihan, servis & kalibrasi, serta konsultasi teknis alat kesehatan untuk rumah sakit, klinik dan dinas kesehatan.',
                'canonical' => route('layanan'),
            ],
            'company' => [
                'whatsapp_sales' => Company::get('whatsapp_sales') ?? Company::get('whatsapp_number'),
                'whatsapp_servis' => Company::get('whatsapp_servis') ?? Company::get('whatsapp_sales') ?? Company::get('whatsapp_number'),
                'jam_operasional' => Company::get('jam_operasional'),
                'waktu_respons' => Company::get('waktu_respons'),
                'layanan_darurat' => Company::get('layanan_darurat'),
                'cakupan_servis' => Company::get('cakupan_servis'),
                'area_layanan' => Company::get('area_layanan'),
            ],
        ]);
    }
}
