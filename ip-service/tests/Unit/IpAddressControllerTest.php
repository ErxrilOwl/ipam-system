<?php

namespace Tests\Feature;

use App\Models\IpAddress;
use App\Services\AuditLogger;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;

class IpAddressControllerTest extends TestCase
{
    use RefreshDatabase;

    protected array $adminHeaders;
    protected array $userHeaders;

    protected function setUp(): void
    {
        parent::setUp();

        Mockery::mock('alias:' . AuditLogger::class)
            ->shouldReceive('log')
            ->byDefault();

        $this->adminHeaders = [
            'x-user-id' => '1',
            'x-user-name' => 'Admin User',
            'x-user-role' => 'admin',
        ];

        $this->userHeaders = [
            'x-user-id' => '2',
            'x-user-name' => 'Regular User',
            'x-user-role' => 'user',
        ];
    }

    /**
     * Test index lists IP addresses with pagination and filtering.
     */
    public function test_index_returns_paginated_ip_addresses(): void
    {
        IpAddress::factory()->count(5)->create();

        $response = $this->getJson('/api/ip-addresses?limit=2', $this->adminHeaders);

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data')
            ->assertJsonStructure(['data', 'links', 'meta']);
    }

    /**
     * Test storing a new IP address.
     */
    public function test_store_creates_new_ip_address_successfully(): void
    {
        $payload = [
            'ip_address' => '192.168.1.1',
            'label' => 'Primary Gateway',
            'comment' => 'Main office router'
        ];

        $response = $this->postJson('/api/ip-addresses', $payload, $this->adminHeaders);

        $response->assertStatus(201)
            ->assertJsonPath('message', 'IP Address successfully created');

        $this->assertDatabaseHas('ip_addresses', [
            'ip_address' => '192.168.1.1',
            'created_by' => '1'
        ]);
    }

    /**
     * Test showing a single IP address.
     */
    public function test_get_returns_ip_address_resource(): void
    {
        $ipAddress = IpAddress::factory()->create();

        // Pass headers to bypass 401 Unauthorized if the route is protected
        $response = $this->getJson("/api/ip-addresses/{$ipAddress->id}", $this->adminHeaders);

        $response->assertStatus(200)
            ->assertJsonFragment(['ip_address' => $ipAddress->ip_address]);
    }

    /**
     * Test updating an IP address as the owner.
     */
    public function test_update_modifies_ip_address_if_user_is_owner(): void
    {
        $ipAddress = IpAddress::factory()->create(['created_by' => '2']);

        $payload = ['label' => 'Updated Label', 'comment' => 'New Comment'];

        $response = $this->putJson("/api/ip-addresses/{$ipAddress->id}", $payload, $this->userHeaders);

        $response->assertStatus(200)
            ->assertJsonPath('message', 'IP Address successfully updated');

        $this->assertDatabaseHas('ip_addresses', [
            'id' => $ipAddress->id,
            'label' => 'Updated Label'
        ]);
    }

    /**
     * Test updating an IP address is forbidden for non-owners (non-admin).
     */
    public function test_update_is_forbidden_for_non_owner(): void
    {
        $ipAddress = IpAddress::factory()->create(['created_by' => '999']);

        $payload = ['label' => 'Unauthorized Change'];

        $response = $this->putJson("/api/ip-addresses/{$ipAddress->id}", $payload, $this->userHeaders);

        $response->assertStatus(403);
    }

    /**
     * Test deleting an IP address as an admin.
     */
    public function test_destroy_deletes_ip_address_for_admin(): void
    {
        $ipAddress = IpAddress::factory()->create();

        $response = $this->deleteJson("/api/ip-addresses/{$ipAddress->id}", [], $this->adminHeaders);

        $response->assertStatus(200)
            ->assertJson(['message' => 'IP Adresses successfully deleted.']);

        $this->assertDatabaseMissing('ip_addresses', ['id' => $ipAddress->id]);
    }

    /**
     * Test deleting an IP address is forbidden for non-admins.
     */
    public function test_destroy_is_forbidden_for_non_admin(): void
    {
        $ipAddress = IpAddress::factory()->create();

        $response = $this->deleteJson("/api/ip-addresses/{$ipAddress->id}", [], $this->userHeaders);

        $response->assertStatus(403);
    }
}
