<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define permissions
        $permissions = [
            // General
            'Application Settings',

            // User Management
            'View Users',
            'Create Users',
            'Edit Users',
            'Delete Users',

            // Role Management
            'View Roles',
            'Create Roles',
            'Edit Roles',
            'Delete Roles',

            // Permission Management
            'View Permissions',
            'Create Permissions',
            'Edit Permissions',
            'Delete Permissions',
        ];

        // Create all permissions
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Assign all permissions to Super Admin role
        $superAdminRole = Role::where('name', 'Super Admin')->first();
        if ($superAdminRole) {
            $superAdminRole->syncPermissions(Permission::all());
        }
    }
}
