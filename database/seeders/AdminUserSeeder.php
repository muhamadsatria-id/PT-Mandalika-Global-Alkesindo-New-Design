<?php

namespace Database\Seeders;

use App\Models\User;
use App\Support\Roles;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Membuat akun Super Admin awal.
     *
     * Ganti kata sandi default lewat ADMIN_INITIAL_PASSWORD di .env
     * sebelum menjalankan seeder di server produksi.
     */
    public function run(): void
    {
        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@mga.my.id'],
            [
                'name' => 'Super Admin',
                'password' => (string) config('app.admin_initial_password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ],
        );

        $admin->syncRoles([Roles::SuperAdmin]);
    }
}
