<?php

require_once __DIR__.'/../Helpers/TestHelpers.php';

use App\Models\User;

describe('Settings > Users', function () {
    describe('Access Control', function () {
        test('index page is accessible by Super Admin', function () {
            $superAdmin = createSuperAdmin();

            $this->actingAs($superAdmin)
                ->get(route('users.index'))
                ->assertOk()
                ->assertInertia(fn ($page) => $page->component('settings/users/index'));
        });

        test('index page is forbidden for regular users', function () {
            $regularUser = createRegularUser();

            $this->actingAs($regularUser)
                ->get(route('users.index'))
                ->assertForbidden();
        });

        test('create page is accessible by Super Admin', function () {
            $superAdmin = createSuperAdmin();

            $this->actingAs($superAdmin)
                ->get(route('users.create'))
                ->assertOk()
                ->assertInertia(fn ($page) => $page->component('settings/users/create'));
        });

        test('create page is forbidden for regular users', function () {
            $regularUser = createRegularUser();

            $this->actingAs($regularUser)
                ->get(route('users.create'))
                ->assertForbidden();
        });

        test('edit page is accessible by Super Admin', function () {
            $superAdmin = createSuperAdmin();
            $user = User::factory()->create();

            $this->actingAs($superAdmin)
                ->get(route('users.edit', $user))
                ->assertOk()
                ->assertInertia(fn ($page) => $page->component('settings/users/edit'));
        });

        test('edit page is forbidden for regular users', function () {
            $regularUser = createRegularUser();
            $user = User::factory()->create();

            $this->actingAs($regularUser)
                ->get(route('users.edit', $user))
                ->assertForbidden();
        });
    });

    describe('Actions', function () {
        test('Super Admin can create user', function () {
            $superAdmin = createSuperAdmin();

            $userData = [
                'name' => 'Test User',
                'username' => 'testuser',
                'email' => 'test@example.com',
                'password' => 'password',
                'password_confirmation' => 'password',
            ];

            $this->actingAs($superAdmin)
                ->post(route('users.store'), $userData)
                ->assertRedirect(route('users.index'))
                ->assertSessionHas('success', 'User created successfully.');

            $this->assertDatabaseHas('users', [
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        });

        test('regular users cannot create user', function () {
            $regularUser = createRegularUser();

            $userData = [
                'name' => 'Test User',
                'username' => 'testuser2',
                'email' => 'test@example.com',
                'password' => 'password',
                'password_confirmation' => 'password',
            ];

            $this->actingAs($regularUser)
                ->post(route('users.store'), $userData)
                ->assertForbidden();

            $this->assertDatabaseMissing('users', ['email' => 'test@example.com']);
        });

        test('Super Admin can update user', function () {
            $superAdmin = createSuperAdmin();
            $user = User::factory()->create(['name' => 'Original Name']);

            $updateData = ['name' => 'Updated Name', 'username' => $user->username, 'email' => $user->email];

            $this->actingAs($superAdmin)
                ->put(route('users.update', $user), $updateData)
                ->assertRedirect(route('users.index'))
                ->assertSessionHas('success', 'User updated successfully.');

            $this->assertDatabaseHas('users', ['name' => 'Updated Name']);
        });

        test('regular users cannot update user', function () {
            $regularUser = createRegularUser();
            $user = User::factory()->create(['name' => 'Original Name']);

            $updateData = ['name' => 'Updated Name', 'username' => $user->username, 'email' => $user->email];

            $this->actingAs($regularUser)
                ->put(route('users.update', $user), $updateData)
                ->assertForbidden();

            $this->assertDatabaseHas('users', ['name' => 'Original Name']);
        });

        test('Super Admin can delete user', function () {
            $superAdmin = createSuperAdmin();
            $user = User::factory()->create();

            $this->actingAs($superAdmin)
                ->delete(route('users.destroy', $user))
                ->assertRedirect(route('users.index'))
                ->assertSessionHas('success', 'User deleted successfully.');

            $this->assertDatabaseMissing('users', ['id' => $user->id]);
        });

        test('regular users cannot delete user', function () {
            $regularUser = createRegularUser();
            $user = User::factory()->create();

            $this->actingAs($regularUser)
                ->delete(route('users.destroy', $user))
                ->assertForbidden();

            $this->assertDatabaseHas('users', ['id' => $user->id]);
        });
    });

    describe('Role Assignment', function () {
        test('Super Admin can assign roles to user', function () {
            $superAdmin = createSuperAdmin();
            $user = User::factory()->create();
            $role = createTestRole();

            $userData = [
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'roles' => [$role->id],
            ];

            $this->actingAs($superAdmin)
                ->put(route('users.update', $user), $userData)
                ->assertRedirect(route('users.index'));

            expect($user->refresh()->hasRole($role->name))->toBeTrue();
        });

        test('Super Admin can remove roles from user', function () {
            $superAdmin = createSuperAdmin();
            $user = User::factory()->create();
            $role = createTestRole();
            $user->assignRole($role);

            $userData = [
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'roles' => [],
            ];

            $this->actingAs($superAdmin)
                ->put(route('users.update', $user), $userData)
                ->assertRedirect(route('users.index'));

            expect($user->refresh()->hasRole($role->name))->toBeFalse();
        });
    });

    describe('Validation', function () {
        test('user name is required', function () {
            $superAdmin = createSuperAdmin();

            $this->actingAs($superAdmin)
                ->post(route('users.store'), [
                    'name' => '',
                    'email' => 'test@example.com',
                    'password' => 'password',
                    'password_confirmation' => 'password',
                ])
                ->assertSessionHasErrors(['name']);
        });

        test('user email is required', function () {
            $superAdmin = createSuperAdmin();

            $this->actingAs($superAdmin)
                ->post(route('users.store'), [
                    'name' => 'Test User',
                    'email' => '',
                    'password' => 'password',
                    'password_confirmation' => 'password',
                ])
                ->assertSessionHasErrors(['email']);
        });

        test('user email must be unique', function () {
            $superAdmin = createSuperAdmin();
            $existingUser = User::factory()->create();

            $this->actingAs($superAdmin)
                ->post(route('users.store'), [
                    'name' => 'Test User',
                    'email' => $existingUser->email,
                    'password' => 'password',
                    'password_confirmation' => 'password',
                ])
                ->assertSessionHasErrors(['email']);
        });

        test('password is required for new users', function () {
            $superAdmin = createSuperAdmin();

            $this->actingAs($superAdmin)
                ->post(route('users.store'), [
                    'name' => 'Test User',
                    'email' => 'test@example.com',
                    'password' => '',
                ])
                ->assertSessionHasErrors(['password']);
        });

        test('password confirmation must match', function () {
            $superAdmin = createSuperAdmin();

            $this->actingAs($superAdmin)
                ->post(route('users.store'), [
                    'name' => 'Test User',
                    'email' => 'test@example.com',
                    'password' => 'password',
                    'password_confirmation' => 'different-password',
                ])
                ->assertSessionHasErrors(['password']);
        });
    });
});
