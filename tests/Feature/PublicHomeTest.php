<?php

use App\Models\Setting;
use Inertia\Testing\AssertableInertia as Assert;

test('beranda menampilkan halaman publik dengan pengaturan kontak', function () {
    Setting::query()->create([
        'key' => 'whatsapp_number',
        'value' => '6281234567890',
        'group' => 'whatsapp',
        'type' => 'string',
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/home')
            ->where('settings.whatsapp_number', '6281234567890')
            ->where('auth.user', null)
            ->has('flash')
        );
});

test('beranda tetap tampil tanpa pengaturan tersimpan', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/home')
            ->where('settings', [])
        );
});
