<?php

namespace Tests\Feature;

use App\Models\RefreshToken;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $password = 'password123';

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'password' => Hash::make($this->password),
        ]);
    }

    /** @test */
    public function user_can_login_with_correct_credentials()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => $this->user->email,
            'password' => $this->password,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'access_token',
                'refresh_token',
                'auth_type',
                'expires_in',
                'user',
                'session_id'
            ]);

        $this->assertDatabaseHas('refresh_tokens', [
            'user_id' => $this->user->id,
        ]);
    }

    /** @test */
    public function login_fails_with_invalid_credentials()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => $this->user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Invalid credentials']);
    }

    /** @test */
    public function user_can_refresh_token_with_valid_refresh_token()
    {

        $accessToken = auth('api')->login($this->user);

        $refreshTokenString = 'sample-refresh-token';
        RefreshToken::create([
            'user_id'    => $this->user->id,
            'token'      => $refreshTokenString,
            'expires_at' => now()->addDays(7),
        ]);

        $response = $this->withHeader('Authorization', "Bearer $accessToken")
            ->postJson('/api/auth/refresh', [
                'refresh_token' => $refreshTokenString,
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'access_token',
                'refresh_token',
                'user',
                'expires_in'
            ]);
    }

    /** @test */
    public function refresh_fails_with_expired_or_invalid_token()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'api')
            ->postJson('/api/auth/refresh', [
                'refresh_token' => 'non-existent-token',
            ]);

        $response->assertStatus(401)
            ->assertJson(['error' => 'Invalid refresh token']);
    }

    /** @test */
    public function user_can_logout()
    {
        $token = auth('api')->login($this->user);

        RefreshToken::create([
            'user_id' => $this->user->id,
            'token' => 'delete-me',
            'expires_at' => now()->addDays(1),
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/auth/logout');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Successfully logged out!']);

        $this->assertDatabaseMissing('refresh_tokens', [
            'user_id' => $this->user->id,
        ]);
    }

    /** @test */
    public function user_can_get_their_own_profile()
    {
        $response = $this->actingAs($this->user, 'api')
            ->getJson('/api/auth/me');

        $response->assertStatus(200)
            ->assertJson([
                'id' => $this->user->id,
                'email' => $this->user->email,
            ]);
    }
}
