<?php

require_once __DIR__.'/../Helpers/TestHelpers.php';

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

describe('Settings > Roles', function () {
    describe('Access Control', function () {
        test('index page is accessible by Super Admin', function () {
            $superAdmin = createSuperAdmin();

            $this->actingAs($superAdmin)
                ->get(route('roles.index'))
                ->assertOk()
                ->assertInertia(fn ($page) => $page->component('settings/roles/index'));
        });

        test('index page is forbidden for regular users', function () {
            $regularUser = createRegularUser();

            $this->actingAs($regularUser)
                ->get(route('roles.index'))
                ->assertForbidden();
        });

        test('create page is accessible by Super Admin', function () {
            $superAdmin = createSuperAdmin();

            $this->actingAs($superAdmin)
                ->get(route('roles.create'))
                ->assertOk()
                ->assertInertia(fn ($page) => $page->component('settings/roles/create'));
        });

        test('create page is forbidden for regular users', function () {
            $regularUser = createRegularUser();

            $this->actingAs($regularUser)
                ->get(route('roles.create'))
                ->assertForbidden();
        });

        test('edit page is accessible by Super Admin', function () {
            $superAdmin = createSuperAdmin();
            $role = createTestRole();

            $this->actingAs($superAdmin)
                ->get(route('roles.edit', $role))
                ->assertOk()
                ->assertInertia(fn ($page) => $page->component('settings/roles/edit'));
        });

        test('edit page is forbidden for regular users', function () {
            $regularUser = createRegularUser();
            $role = createTestRole();

            $this->actingAs($regularUser)
                ->get(route('roles.edit', $role))
                ->assertForbidden();
        });
    });

    describe('Actions', function () {
        test('Super Admin can create role', function () {
            $superAdmin = createSuperAdmin();
            $permissions = collect([
                createTestPermission(),
                createTestPermission(),
                createTestPermission(),
            ]);

            $roleData = [
                'name' => 'Test Role',
                'permissions' => $permissions->pluck('id')->toArray(),
            ];

            $this->actingAs($superAdmin)
                ->post(route('roles.store'), $roleData)
                ->assertRedirect(route('roles.index'))
                ->assertSessionHas('success', 'Role created successfully.');

            $this->assertDatabaseHas('roles', ['name' => 'Test Role']);

            $role = Role::where('name', 'Test Role')->first();
            expect($role->permissions->count())->toBe(3);
        });

        test('regular users cannot create role', function () {
            $regularUser = createRegularUser();
            $permissions = collect([
                createTestPermission(),
                createTestPermission(),
                createTestPermission(),
            ]);

            $roleData = [
                'name' => 'Test Role',
                'permissions' => $permissions->pluck('id')->toArray(),
            ];

            $this->actingAs($regularUser)
                ->post(route('roles.store'), $roleData)
                ->assertForbidden();

            $this->assertDatabaseMissing('roles', ['name' => 'Test Role']);
        });

        test('Super Admin can update role', function () {
            $superAdmin = createSuperAdmin();
            $permissions = collect([
                createTestPermission(),
                createTestPermission(),
                createTestPermission(),
            ]);
            $role = createTestRole('Original Role');
            $role->syncPermissions($permissions->take(2));

            $updateData = [
                'name' => 'Updated Role',
                'permissions' => [$permissions->first()->id],
            ];

            $this->actingAs($superAdmin)
                ->put(route('roles.update', $role), $updateData)
                ->assertRedirect(route('roles.index'))
                ->assertSessionHas('success', 'Role updated successfully.');

            $this->assertDatabaseHas('roles', ['name' => 'Updated Role']);

            $role->refresh();
            expect($role->permissions->count())->toBe(1);
        });

        test('regular users cannot update role', function () {
            $regularUser = createRegularUser();
            $role = createTestRole('Original Role');

            $updateData = [
                'name' => 'Updated Role',
                'permissions' => [],
            ];

            $this->actingAs($regularUser)
                ->put(route('roles.update', $role), $updateData)
                ->assertForbidden();

            $this->assertDatabaseHas('roles', ['name' => 'Original Role']);
        });

        test('Super Admin can delete role', function () {
            $superAdmin = createSuperAdmin();
            $role = createTestRole();

            $this->actingAs($superAdmin)
                ->delete(route('roles.destroy', $role))
                ->assertRedirect(route('roles.index'))
                ->assertSessionHas('success', 'Role deleted successfully.');

            $this->assertDatabaseMissing('roles', ['id' => $role->id]);
        });

        test('regular users cannot delete role', function () {
            $regularUser = createRegularUser();
            $role = createTestRole();

            $this->actingAs($regularUser)
                ->delete(route('roles.destroy', $role))
                ->assertForbidden();

            $this->assertDatabaseHas('roles', ['id' => $role->id]);
        });
    });

    describe('Validation', function () {
        test('role name is required', function () {
            $superAdmin = createSuperAdmin();

            $this->actingAs($superAdmin)
                ->post(route('roles.store'), ['name' => '', 'permissions' => []])
                ->assertSessionHasErrors(['name']);
        });

        test('role name must be unique', function () {
            $superAdmin = createSuperAdmin();
            createTestRole('Existing Role');

            $this->actingAs($superAdmin)
                ->post(route('roles.store'), ['name' => 'Existing Role', 'permissions' => []])
                ->assertSessionHasErrors(['name']);
        });

        test('role name must be unique when updating except current role', function () {
            $superAdmin = createSuperAdmin();
            $existingRole = createTestRole('Existing Role');
            $roleToUpdate = createTestRole('Role to Update');

            // Should fail - name already exists
            $this->actingAs($superAdmin)
                ->put(route('roles.update', $roleToUpdate), ['name' => 'Existing Role', 'permissions' => []])
                ->assertSessionHasErrors(['name']);

            // Should pass - same name as current role
            $this->actingAs($superAdmin)
                ->put(route('roles.update', $roleToUpdate), ['name' => 'Role to Update', 'permissions' => []])
                ->assertRedirect(route('roles.index'));
        });

        test('permissions with invalid IDs return validation errors', function () {
            $superAdmin = createSuperAdmin();

            // Should return validation errors for non-existent permission IDs
            $this->actingAs($superAdmin)
                ->post(route('roles.store'), [
                    'name' => 'Test Role',
                    'permissions' => [999, 998], // Non-existent permission IDs
                ])
                ->assertStatus(302) // Redirect back with validation errors
                ->assertSessionHasErrors(['permissions.0', 'permissions.1']);
        });
    });
});
