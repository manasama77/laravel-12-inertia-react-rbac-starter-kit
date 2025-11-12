<?php

use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

if (! function_exists('createSuperAdmin')) {
    function createSuperAdmin(): User
    {
        Role::firstOrCreate(['name' => 'Super Admin']);
        $superAdmin = User::factory()->create();
        $superAdmin->assignRole('Super Admin');

        return $superAdmin;
    }
}

if (! function_exists('createOwner')) {
    function createOwner(): User
    {
        Role::firstOrCreate(['name' => 'Owner']);
        $owner = User::factory()->create();
        $owner->assignRole('Owner');

        return $owner;
    }
}

if (! function_exists('createRegularUser')) {
    function createRegularUser(): User
    {
        return User::factory()->create();
    }
}

if (! function_exists('createTestRole')) {
    function createTestRole(?string $name = null): Role
    {
        $name = $name ?? 'test-role-'.uniqid();

        return Role::create(['name' => $name, 'guard_name' => 'web']);
    }
}

if (! function_exists('createTestPermission')) {
    function createTestPermission(?string $name = null): Permission
    {
        $name = $name ?? 'test-permission-'.uniqid();

        return Permission::create(['name' => $name, 'guard_name' => 'web']);
    }
}
