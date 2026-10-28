<?php

return [
    'nama_resmi' => env('COMPANY_NAME', 'PT. Mandalika Global Alkesindo'),
    'nama_singkat' => env('COMPANY_SHORT_NAME', 'MGA'),
    'tagline_pendek' => env('COMPANY_TAGLINE_SHORT', 'Distributor alat kesehatan: penjualan, instalasi, dan servis.'),

    'alamat_lengkap' => [
        'jalan' => env('COMPANY_ADDRESS_LINE1', 'Jalan Mawar 6 No. 4 Unitex, Kel. Sindangrasa'),
        'kelurahan' => env('COMPANY_ADDRESS_KELURAHAN', 'Sindangrasa'),
        'kecamatan' => env('COMPANY_ADDRESS_KECAMATAN', 'Bogor Timur'),
        'kota' => env('COMPANY_ADDRESS_CITY', 'Kota Bogor'),
        'provinsi' => env('COMPANY_ADDRESS_PROVINCE', 'Jawa Barat'),
        'kode_pos' => env('COMPANY_ADDRESS_POSTAL_CODE', '16145'),
    ],
    'latitude' => env('COMPANY_LATITUDE', '-6.633778'),
    'longitude' => env('COMPANY_LONGITUDE', '106.8284662'),
    'google_maps_url' => env('COMPANY_GOOGLE_MAPS_URL'),
    'google_maps_embed_url' => env('COMPANY_GOOGLE_MAPS_EMBED_URL'),

    'telepon_kantor' => env('COMPANY_PHONE', '+62 878-2850-3881'),
    'whatsapp_sales' => env('COMPANY_WHATSAPP_SALES', '6287828503881'),
    'whatsapp_servis' => env('COMPANY_WHATSAPP_SERVICE', '6287828503881'),
    'email_sales' => env('COMPANY_EMAIL_SALES', 'info@mga.my.id'),
    'email_servis' => env('COMPANY_EMAIL_SERVICE', 'info@mga.my.id'),
    'email_umum' => env('COMPANY_EMAIL', 'info@mga.my.id'),

    'jam_operasional' => env('COMPANY_HOURS', 'Senin - Jumat, 08.00 - 17.00 WIB'),
    'waktu_respons' => env('COMPANY_RESPONSE_TIME', 'maksimal 1 hari kerja'),
    'layanan_darurat' => env('COMPANY_EMERGENCY_SERVICE', null),

    'cakupan_servis' => env('COMPANY_SERVICE_COVERAGE', 'Meliputi pengadaan, instalasi, pelatihan, servis & kalibrasi alat kesehatan.'),
    'area_layanan' => env('COMPANY_SERVICE_AREA', 'Seluruh Indonesia'),

    'tahun_berdiri' => env('COMPANY_FOUNDED_YEAR', '2026'),
    'jumlah_unit_terpasang' => env('COMPANY_UNITS_INSTALLED', '1200'),
    'jumlah_faskes' => env('COMPANY_HEALTH_FACILITIES', '321'),
    'jumlah_brand' => env('COMPANY_BRAND_COUNT', '9'),

    'nib_nomor' => env('COMPANY_NIB', '1410260025514'),
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
