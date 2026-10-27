<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Nilai awal pengaturan. Semua nomor dan alamat di bawah adalah placeholder
     * dan wajib diperbarui admin lewat menu Pengaturan sebelum situs digunakan.
     *
     * @var array<int, array{key: string, value: string, group: string, type: string}>
     */
    private array $settings = [
        ['key' => 'company_name', 'value' => 'PT. Mandalika Global Alkesindo', 'group' => 'company', 'type' => 'string'],
        ['key' => 'company_tagline', 'value' => 'Alat kesehatan, layanan servis, dan pendampingan teknis untuk fasilitas kesehatan Indonesia.', 'group' => 'company', 'type' => 'string'],
        ['key' => 'company_email', 'value' => 'info@mga.my.id', 'group' => 'company', 'type' => 'string'],
        ['key' => 'company_email_secondary', 'value' => 'sales@mga.my.id', 'group' => 'company', 'type' => 'string'],
        ['key' => 'company_address', 'value' => 'Mataram, Nusa Tenggara Barat', 'group' => 'company', 'type' => 'text'],
        ['key' => 'company_city', 'value' => 'Mataram', 'group' => 'company', 'type' => 'string'],
        ['key' => 'company_hours', 'value' => 'Senin - Jumat, 08.00 - 17.00 WITA', 'group' => 'company', 'type' => 'string'],
        ['key' => 'company_instagram', 'value' => '', 'group' => 'company', 'type' => 'string'],
        ['key' => 'company_facebook', 'value' => '', 'group' => 'company', 'type' => 'string'],
        ['key' => 'company_tiktok', 'value' => '', 'group' => 'company', 'type' => 'string'],
        ['key' => 'company_youtube', 'value' => '', 'group' => 'company', 'type' => 'string'],
        ['key' => 'company_linkedin', 'value' => '', 'group' => 'company', 'type' => 'string'],
        ['key' => 'developer_email', 'value' => '', 'group' => 'developer', 'type' => 'string'],
        ['key' => 'developer_whatsapp', 'value' => '6285789483844', 'group' => 'developer', 'type' => 'string'],
        ['key' => 'whatsapp_number', 'value' => '6281234567890', 'group' => 'whatsapp', 'type' => 'string'],
        ['key' => 'whatsapp_sales', 'value' => '6281234567890', 'group' => 'whatsapp', 'type' => 'string'],
        ['key' => 'whatsapp_service', 'value' => '6281234567890', 'group' => 'whatsapp', 'type' => 'string'],
        ['key' => 'service_enabled', 'value' => 'true', 'group' => 'features', 'type' => 'boolean'],
        ['key' => 'hero_background', 'value' => '', 'group' => 'hero', 'type' => 'string'],
        ['key' => 'default_price_mode', 'value' => 'show', 'group' => 'display', 'type' => 'string'],
        ['key' => 'seo_title', 'value' => 'PT. Mandalika Global Alkesindo | Alat Kesehatan & Servis', 'group' => 'seo', 'type' => 'string'],
        ['key' => 'seo_description', 'value' => 'Pengadaan alat kesehatan, layanan servis, dan pendampingan teknis untuk rumah sakit, klinik, dan dinas di Indonesia.', 'group' => 'seo', 'type' => 'text'],
    ];

    public function run(): void
    {
        foreach ($this->settings as $setting) {
            Setting::query()->updateOrCreate(
                ['key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'group' => $setting['group'],
                    'type' => $setting['type'],
                ],
            );
        }
    }
}
