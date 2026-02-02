<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($this->admin);
    }

    /**
     * Test index lists users and excludes the current auth user.
     */
    public function test_index_returns_paginated_users_excluding_self(): void
    {
        User::factory()->count(3)->create();

        $response = $this->getJson('/api/users?limit=2');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data')
            ->assertJsonStructure(['data', 'links', 'meta']);

        $response->assertJsonMissing(['id' => $this->admin->id]);
    }

    /**
     * Test storing a new user with password hashing.
     */
    public function test_store_creates_new_user_with_hashed_password(): void
    {
        $payload = [
            'name' => 'John Doe',
            'email' => 'johndoe@mail.com',
            'password' => 'password',
            'role' => 'admin'
        ];

        $response = $this->postJson('/api/users', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('message', 'User created successfully');

        $this->assertDatabaseHas('users', ['email' => 'johndoe@mail.com']);

        $user = User::where('email', 'johndoe@mail.com')->first();
        $this->assertTrue(Hash::check('password', $user->password));
    }

    /**
     * Test showing a single user.
     */
    public function test_show_returns_user_resource(): void
    {
        $user = User::factory()->create();

        $response = $this->getJson("/api/users/{$user->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['email' => $user->email]);
    }

    /**
     * Test updating a user, specifically checking optional password hashing.
     */
    public function test_update_modifies_user_and_hashes_password_if_present(): void
    {
        $user = User::factory()->create(['name' => 'Old Name']);

        $payload = [
            'name' => 'New Name',
            'password' => 'new-password-789'
        ];

        $response = $this->putJson("/api/users/{$user->id}", $payload);

        $response->assertStatus(200);

        $user->refresh();
        $this->assertEquals('New Name', $user->name);
        $this->assertTrue(Hash::check('new-password-789', $user->password));
    }

    /**
     * Test deleting a user.
     */
    public function test_destroy_deletes_user_from_database(): void
    {
        $user = User::factory()->create();

        $response = $this->deleteJson("/api/users/{$user->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'User deleted successfully']);

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}
