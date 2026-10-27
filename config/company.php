<?php

return [
    'nama_resmi' => env('COMPANY_NAME', 'PT. Mandalika Global Alkesindo'),
    'nama_singkat' => env('COMPANY_SHORT_NAME', 'MGA'),
    'tagline_pendek' => env('COMPANY_TAGLINE_SHORT', 'Distributor alat kesehatan, pengadaan, instalasi & servis untuk rumah sakit, klinik dan dinas kesehatan.'),

    'alamat_lengkap' => [
        'jalan' => env('COMPANY_ADDRESS_LINE1', 'TODO: Alamat lengkap belum diisi'),
        'kelurahan' => env('COMPANY_ADDRESS_KELURAHAN', null),
        'kecamatan' => env('COMPANY_ADDRESS_KECAMATAN', null),
        'kota' => env('COMPANY_ADDRESS_CITY', 'Mataram'),
        'provinsi' => env('COMPANY_ADDRESS_PROVINCE', 'Nusa Tenggara Barat'),
        'kode_pos' => env('COMPANY_ADDRESS_POSTAL_CODE', null),
    ],
    'latitude' => env('COMPANY_LATITUDE'),
    'longitude' => env('COMPANY_LONGITUDE'),
    'google_maps_url' => env('COMPANY_GOOGLE_MAPS_URL'),
    'google_maps_embed_url' => env('COMPANY_GOOGLE_MAPS_EMBED_URL'),

    'telepon_kantor' => env('COMPANY_PHONE', null),
    'whatsapp_sales' => env('COMPANY_WHATSAPP_SALES', null),
    'whatsapp_servis' => env('COMPANY_WHATSAPP_SERVICE', null),
    'email_sales' => env('COMPANY_EMAIL_SALES', null),
    'email_servis' => env('COMPANY_EMAIL_SERVICE', null),
    'email_umum' => env('COMPANY_EMAIL', null),

    'jam_operasional' => env('COMPANY_HOURS', 'TODO: Jam operasional belum diisi'),
    'waktu_respons' => env('COMPANY_RESPONSE_TIME', 'TODO: Waktu respons belum diisi'),
    'layanan_darurat' => env('COMPANY_EMERGENCY_SERVICE', null),

    'cakupan_servis' => env('COMPANY_SERVICE_COVERAGE', 'Meliputi pengadaan, instalasi, pelatihan, servis & kalibrasi alat kesehatan.'),
    'area_layanan' => env('COMPANY_SERVICE_AREA', 'Mataram, NTB dan seluruh Indonesia'),

    'tahun_berdiri' => env('COMPANY_FOUNDED_YEAR'),
    'jumlah_unit_terpasang' => env('COMPANY_UNITS_INSTALLED'),
    'jumlah_faskes' => env('COMPANY_HEALTH_FACILITIES'),
    'jumlah_brand' => env('COMPANY_BRAND_COUNT'),

    'nib_nomor' => env('COMPANY_NIB'),
    'npwp' => env('COMPANY_NPWP'),
    'kbli' => env('COMPANY_KBLI'),
    'penanggung_jawab_teknis' => env('COMPANY_TECHNICAL_RESPONSIBLE'),

    'link_profil_lkpp' => env('COMPANY_LKPP_PROFILE_URL'),
    'link_google_business_profile' => env('COMPANY_GBP_URL'),
    'social_media' => [
        'instagram' => env('COMPANY_INSTAGRAM'),
        'facebook' => env('COMPANY_FACEBOOK'),
        'tiktok' => env('COMPANY_TIKTOK'),
        'youtube' => env('COMPANY_YOUTUBE'),
        'linkedin' => env('COMPANY_LINKEDIN'),
    ],

    'trust' => [
        'lkpp' => filter_var(env('COMPANY_TRUST_LKPP', false), FILTER_VALIDATE_BOOLEAN),
        'distributor_resmi' => filter_var(env('COMPANY_TRUST_DISTRIBUTOR_RESMI', false), FILTER_VALIDATE_BOOLEAN),
    ],
];
