<?php

namespace Database\Seeders;

use App\Support\Permissions;
use App\Support\Roles;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach (Permissions::all() as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        /** @var array<string, array<int, string>> $matrix */
        $matrix = [
            Roles::SuperAdmin => Permissions::all(),
            Roles::AdminKatalog => [
                Permissions::ProductsView,
                Permissions::ProductsManage,
                Permissions::ContentManage,
            ],
            Roles::Sales => [
                Permissions::ProductsView,
                Permissions::InquiriesView,
                Permissions::InquiriesManage,
                Permissions::CustomersView,
                Permissions::CustomersManage,
            ],
            Roles::Teknisi => [
                Permissions::ServicesView,
                Permissions::ServicesManage,
                Permissions::CustomersView,
            ],
            Roles::Marketing => [
                Permissions::ProductsView,
                Permissions::InquiriesView,
                Permissions::ContentManage,
            ],
        ];

        foreach ($matrix as $roleName => $permissions) {
            $role = Role::findOrCreate($roleName, 'web');
            $role->syncPermissions($permissions);
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
