<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AuditLog>
 */
class AuditLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'action' => 'created',
            'resource_type' => 'User',
            'resource_id' => $this->faker->randomNumber(),
            'before' => null,
            'after' => null,
            'user_id' => 1,
            'user_name' => 'Test User',
            'user_role' => 'admin',
            'session_id' => $this->faker->uuid
        ];
    }
}
