<?php

use App\Models\User;
use App\Support\Roles;
use Database\Seeders\RolePermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('tamu dapat melihat halaman masuk', function () {
    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('auth/login'));
});

test('pengguna aktif dapat masuk dan diarahkan ke dashboard', function () {
    $user = User::factory()->create([
        'email' => 'sales@mga.my.id',
        'password' => 'Rahasia#123',
        'is_active' => true,
    ]);
    $user->assignRole(Roles::Sales);

    $this->post(route('login.store'), [
        'email' => 'sales@mga.my.id',
        'password' => 'Rahasia#123',
    ])->assertRedirect(route('admin.dashboard'));

    $this->assertAuthenticatedAs($user);
});

test('kata sandi salah ditolak tanpa membocorkan akun mana yang ada', function () {
    User::factory()->create([
        'email' => 'sales@mga.my.id',
        'password' => 'Rahasia#123',
    ]);

    $this->from(route('login'))
        ->post(route('login.store'), [
            'email' => 'sales@mga.my.id',
            'password' => 'salah-total',
        ])
        ->assertRedirect(route('login'))
        ->assertSessionHasErrors([
            'email' => 'Email atau kata sandi tidak sesuai.',
        ]);

    $this->assertGuest();
});

test('akun yang dinonaktifkan tidak dapat masuk', function () {
    $user = User::factory()->create([
        'email' => 'nonaktif@mga.my.id',
        'password' => 'Rahasia#123',
        'is_active' => false,
    ]);

    $this->from(route('login'))
        ->post(route('login.store'), [
            'email' => 'nonaktif@mga.my.id',
            'password' => 'Rahasia#123',
        ])
        ->assertRedirect(route('login'))
        ->assertSessionHasErrors([
            'email' => 'Akun ini sedang dinonaktifkan. Hubungi admin.',
        ]);

    $this->assertGuest();
    expect($user->fresh()?->is_active)->toBeFalse();
});

test('percobaan masuk dibatasi setelah lima kegagalan', function () {
    $user = User::factory()->create([
        'email' => 'sales@mga.my.id',
        'password' => 'Rahasia#123',
    ]);

    foreach (range(1, 5) as $attempt) {
        $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'salah-'.$attempt,
        ])->assertSessionHasErrors('email');
    }

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'Rahasia#123',
    ])->assertSessionHasErrors('email');

    expect(session('errors')->getBag('default')->first('email'))
        ->toContain('Terlalu banyak percobaan masuk');

    $this->assertGuest();
});

test('pengguna dapat keluar dan kembali ke beranda', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('logout'))
        ->assertRedirect(route('home'));

    $this->assertGuest();
});

test('tamu diarahkan ke halaman masuk saat membuka dashboard', function () {
    $this->get(route('admin.dashboard'))
        ->assertRedirect(route('login'));
});

test('pengguna tanpa peran ditolak dari dashboard', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertForbidden();
});

test('peran sales dapat membuka dashboard dengan statistik', function () {
    $user = User::factory()->create();
    $user->assignRole(Roles::Sales);

    $this->actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->has('stats')
            ->has('latestProducts')
            ->where('stats.products', 0)
            ->where('auth.user.role', Roles::Sales)
        );
});
