<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/settings/index', [
            'settings' => Setting::allAsArray(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'company_name' => ['nullable', 'string', 'max:150'],
            'company_tagline' => ['nullable', 'string', 'max:255'],
            'company_email' => ['nullable', 'email', 'max:150'],
            'company_email_secondary' => ['nullable', 'email', 'max:150'],
            'company_address' => ['nullable', 'string', 'max:500'],
            'company_city' => ['nullable', 'string', 'max:120'],
            'company_hours' => ['nullable', 'string', 'max:255'],
            'company_instagram' => ['nullable', 'url', 'max:255'],
            'company_facebook' => ['nullable', 'url', 'max:255'],
            'company_tiktok' => ['nullable', 'url', 'max:255'],
            'company_youtube' => ['nullable', 'url', 'max:255'],
            'company_linkedin' => ['nullable', 'url', 'max:255'],
            'developer_email' => ['nullable', 'email', 'max:150'],
            'developer_whatsapp' => ['nullable', 'string', 'max:30'],
            'whatsapp_number' => ['nullable', 'string', 'max:30'],
            'whatsapp_sales' => ['nullable', 'string', 'max:30'],
            'whatsapp_service' => ['nullable', 'string', 'max:30'],
            'service_enabled' => ['nullable', 'boolean'],
            'hero_background' => ['nullable', 'string', 'max:1000'],
            'default_price_mode' => ['nullable', 'in:show,contact'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:500'],
        ]);

        $groups = [
            'company_name' => 'company',
            'company_tagline' => 'company',
            'company_email' => 'company',
            'company_email_secondary' => 'company',
            'company_address' => 'company',
            'company_city' => 'company',
            'company_hours' => 'company',
            'company_instagram' => 'company',
            'company_facebook' => 'company',
            'company_tiktok' => 'company',
            'company_youtube' => 'company',
            'company_linkedin' => 'company',
            'developer_email' => 'developer',
            'developer_whatsapp' => 'developer',
            'whatsapp_number' => 'whatsapp',
            'whatsapp_sales' => 'whatsapp',
            'whatsapp_service' => 'whatsapp',
            'service_enabled' => 'features',
            'hero_background' => 'hero',
            'default_price_mode' => 'display',
            'seo_title' => 'seo',
            'seo_description' => 'seo',
        ];

        $serviceGroup = 'features';

        $data = $request->all();
        $data['service_enabled'] = $request->boolean('service_enabled') ? 'true' : 'false';

        foreach ($validated as $key => $value) {
            if ((string) $key === 'service_enabled') {
                Setting::set('service_enabled', $data['service_enabled'], $serviceGroup, 'boolean');

                continue;
            }

            Setting::set($key, $value, $groups[$key] ?? 'general', 'string');
        }

        if (! array_key_exists('service_enabled', $validated)) {
            Setting::set('service_enabled', 'false', $serviceGroup, 'boolean');
        }

        return redirect()
            ->route('admin.settings.index')
            ->with('success', 'Pengaturan diperbarui.');
    }
}
