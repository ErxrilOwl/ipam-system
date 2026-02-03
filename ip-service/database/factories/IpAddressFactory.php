<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\IpAddress>
 */
class IpAddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ip_address' => $this->faker->ipv4,
            'label'      => $this->faker->word . ' Server',
            'comment'    => $this->faker->sentence,
            'created_by' => (string) $this->faker->numberBetween(1, 100),
            'user_name'  => $this->faker->name,
        ];
    }
}
