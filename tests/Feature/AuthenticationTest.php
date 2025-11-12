<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    // Create a Super Admin role for testing
    $this->superAdminRole = Role::create(['name' => 'Super Admin']);

    // Create a Super Admin user
    $this->superAdmin = User::factory()->create();
    $this->superAdmin->assignRole('Super Admin');

    // Create a regular user without any roles
    $this->regularUser = User::factory()->create();
});

describe('Authentication', function () {
    test('login page is accessible to guests', function () {
        $this->get(route('login'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('auth/login'));
    });

    test('login form displays username and password fields', function () {
        $this->get(route('login'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('auth/login')
                ->has('canRegister')
            );
    });

    test('authentication fails show error messages', function () {
        $this->post(route('login'), [
            'username' => 'nonexistent',
            'password' => 'wrongpassword',
        ])
            ->assertSessionHasErrors(['username']);
    });

    test('successful authentication redirects appropriately', function () {
        $user = User::factory()->create([
            'username' => 'testuser',
            'password' => Hash::make('password123'),
            'two_factor_secret' => null, // Disable 2FA for this test user
        ]);

        $response = $this->post(route('login'), [
            'username' => 'testuser',
            'password' => 'password123',
        ]);

        // With 2FA disabled, should redirect to dashboard
        $response->assertRedirect(route('dashboard'));
        $this->assertAuthenticatedAs($user);
    });

    test('authenticated users are redirected to dashboard when accessing login page', function () {
        $this->actingAs($this->regularUser)
            ->get(route('login'))
            ->assertRedirect(route('dashboard'));
    });

    test('logout functionality works and redirects to login page', function () {
        $this->actingAs($this->regularUser)
            ->post(route('logout'))
            ->assertRedirect('/');

        $this->assertGuest();
    });
});
