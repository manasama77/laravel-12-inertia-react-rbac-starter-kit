<?php

require_once __DIR__.'/../Helpers/TestHelpers.php';

use Spatie\Permission\Models\Permission;

describe('Settings > Permissions', function () {

    describe('Access Control', function () {
        test('index page is accessible by Super Admin', function () {
            $superAdmin = createSuperAdmin();

            $this->actingAs($superAdmin)
                ->get(route('permissions.index'))
                ->assertOk()
                ->assertInertia(fn ($page) => $page->component('settings/permissions/index'));
        });

        test('index page is forbidden for regular users', function () {
            $regularUser = createRegularUser();

            $this->actingAs($regularUser)
                ->get(route('permissions.index'))
                ->assertForbidden();
        });

        test('create page is accessible by Super Admin', function () {
            $superAdmin = createSuperAdmin();

            $this->actingAs($superAdmin)
                ->get(route('permissions.create'))
                ->assertOk()
                ->assertInertia(fn ($page) => $page->component('settings/permissions/create'));
        });

        test('create page is forbidden for regular users', function () {
            $regularUser = createRegularUser();

            $this->actingAs($regularUser)
                ->get(route('permissions.create'))
                ->assertForbidden();
        });

        test('edit page is accessible by Super Admin', function () {
            $superAdmin = createSuperAdmin();
            $permission = createTestPermission();

            $this->actingAs($superAdmin)
                ->get(route('permissions.edit', $permission))
                ->assertOk()
                ->assertInertia(fn ($page) => $page->component('settings/permissions/edit'));
        });

        test('edit page is forbidden for regular users', function () {
            $regularUser = createRegularUser();
            $permission = createTestPermission();

            $this->actingAs($regularUser)
                ->get(route('permissions.edit', $permission))
                ->assertForbidden();
        });
    });

    describe('Actions', function () {
        test('Super Admin can create permission', function () {
            $superAdmin = createSuperAdmin();
            $permissionData = ['name' => 'test-permission'];

            $this->actingAs($superAdmin)
                ->post(route('permissions.store'), $permissionData)
                ->assertRedirect(route('permissions.index'))
                ->assertSessionHas('success', 'Permission created successfully.');

            $this->assertDatabaseHas('permissions', ['name' => 'test-permission']);
        });

        test('regular users cannot create permission', function () {
            $regularUser = createRegularUser();
            $permissionData = ['name' => 'test-permission'];

            $this->actingAs($regularUser)
                ->post(route('permissions.store'), $permissionData)
                ->assertForbidden();

            $this->assertDatabaseMissing('permissions', ['name' => 'test-permission']);
        });

        test('Super Admin can update permission', function () {
            $superAdmin = createSuperAdmin();
            $permission = createTestPermission('original-name');

            $updateData = ['name' => 'updated-name'];

            $this->actingAs($superAdmin)
                ->put(route('permissions.update', $permission), $updateData)
                ->assertRedirect(route('permissions.index'))
                ->assertSessionHas('success', 'Permission updated successfully.');

            $this->assertDatabaseHas('permissions', ['name' => 'updated-name']);
        });

        test('regular users cannot update permission', function () {
            $regularUser = createRegularUser();
            $permission = createTestPermission('original-name');

            $updateData = ['name' => 'updated-name'];

            $this->actingAs($regularUser)
                ->put(route('permissions.update', $permission), $updateData)
                ->assertForbidden();

            $this->assertDatabaseHas('permissions', ['name' => 'original-name']);
        });

        test('Super Admin can delete permission', function () {
            $superAdmin = createSuperAdmin();
            $permission = createTestPermission();

            $this->actingAs($superAdmin)
                ->delete(route('permissions.destroy', $permission))
                ->assertRedirect(route('permissions.index'))
                ->assertSessionHas('success', 'Permission deleted successfully.');

            $this->assertDatabaseMissing('permissions', ['id' => $permission->id]);
        });

        test('regular users cannot delete permission', function () {
            $regularUser = createRegularUser();
            $permission = createTestPermission();

            $this->actingAs($regularUser)
                ->delete(route('permissions.destroy', $permission))
                ->assertForbidden();

            $this->assertDatabaseHas('permissions', ['id' => $permission->id]);
        });
    });

    describe('Validation', function () {
        test('permission name is required', function () {
            $superAdmin = createSuperAdmin();

            $this->actingAs($superAdmin)
                ->post(route('permissions.store'), ['name' => ''])
                ->assertSessionHasErrors(['name']);
        });

        test('permission name must be unique', function () {
            $superAdmin = createSuperAdmin();
            createTestPermission('existing-permission');

            $this->actingAs($superAdmin)
                ->post(route('permissions.store'), ['name' => 'existing-permission'])
                ->assertSessionHasErrors(['name']);
        });

        test('permission name must be unique when updating except current permission', function () {
            $superAdmin = createSuperAdmin();
            $existingPermission = createTestPermission('existing-permission');
            $permissionToUpdate = createTestPermission('permission-to-update');

            // Should fail - name already exists
            $this->actingAs($superAdmin)
                ->put(route('permissions.update', $permissionToUpdate), ['name' => 'existing-permission'])
                ->assertSessionHasErrors(['name']);

            // Should pass - same name as current permission
            $this->actingAs($superAdmin)
                ->put(route('permissions.update', $permissionToUpdate), ['name' => 'permission-to-update'])
                ->assertRedirect(route('permissions.index'));
        });
    });
});
