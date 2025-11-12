<?php

use App\Models\User;

describe('Dashboard', function () {
    test('guests are redirected to the login page', function () {
        $this->get(route('dashboard'))->assertRedirect(route('login'));
    });

    test('authenticated users can visit the dashboard', function () {
        $this->actingAs($user = User::factory()->create());

        $this->get(route('dashboard'))->assertOk();
    });

    test('is accessible only to authenticated users', function () {
        $this->get(route('dashboard'))
            ->assertRedirect(route('login'));
    });

    test('redirects unauthenticated users to login', function () {
        $this->get(route('dashboard'))
            ->assertRedirect(route('login'));
    });

    test('authenticated users can access dashboard', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('dashboard'));
    });
});
