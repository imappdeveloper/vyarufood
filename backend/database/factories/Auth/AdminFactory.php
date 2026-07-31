<?php

declare(strict_types=1);

namespace Database\Factories\Auth;

use App\Models\Auth\Admin;
use App\Enums\StatusEnum;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminFactory extends Factory
{
    protected $model = Admin::class;

    public function definition(): array
    {
        return [
            'uuid' => Str::uuid()->toString(),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'mobile' => fake()->numerify('##########'),
            'password' => Hash::make('password'),
            'status' => StatusEnum::Active,
            'email_verified_at' => now(),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => ['status' => StatusEnum::Inactive]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => ['status' => StatusEnum::Pending]);
    }
}
