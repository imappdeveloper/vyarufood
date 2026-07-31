<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MealCategorySeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $categories = [
            [
                'category_code' => 'MCAT-001',
                'name' => 'Breakfast',
                'slug' => 'breakfast',
                'description' => 'Early morning breakfast meals',
                'display_order' => 1,
                'icon' => 'free_breakfast',
                'image' => null,
                'color_code' => '#FF9800',
                'status' => 'active',
                'is_default' => true,
                'remarks' => 'Primary breakfast category',
            ],
            [
                'category_code' => 'MCAT-002',
                'name' => 'Lunch',
                'slug' => 'lunch',
                'description' => 'Midday lunch meals',
                'display_order' => 2,
                'icon' => 'restaurant',
                'image' => null,
                'color_code' => '#4CAF50',
                'status' => 'active',
                'is_default' => false,
                'remarks' => 'Standard lunch category',
            ],
            [
                'category_code' => 'MCAT-003',
                'name' => 'Dinner',
                'slug' => 'dinner',
                'description' => 'Evening dinner meals',
                'display_order' => 3,
                'icon' => 'dinner_dining',
                'image' => null,
                'color_code' => '#2196F3',
                'status' => 'active',
                'is_default' => false,
                'remarks' => 'Standard dinner category',
            ],
            [
                'category_code' => 'MCAT-004',
                'name' => 'Healthy Meals',
                'slug' => 'healthy-meals',
                'description' => 'Healthy and nutritious meal options',
                'display_order' => 4,
                'icon' => 'spa',
                'image' => null,
                'color_code' => '#00BCD4',
                'status' => 'active',
                'is_default' => false,
                'remarks' => 'Health-focused meal category',
            ],
            [
                'category_code' => 'MCAT-005',
                'name' => 'Snacks',
                'slug' => 'snacks',
                'description' => 'Light snack items',
                'display_order' => 5,
                'icon' => 'cookie',
                'image' => null,
                'color_code' => '#FF5722',
                'status' => 'active',
                'is_default' => false,
                'remarks' => 'Snack items category',
            ],
            [
                'category_code' => 'MCAT-006',
                'name' => 'Special Meals',
                'slug' => 'special-meals',
                'description' => 'Special occasion meal packages',
                'display_order' => 6,
                'icon' => 'star',
                'image' => null,
                'color_code' => '#9C27B0',
                'status' => 'active',
                'is_default' => false,
                'remarks' => 'Special occasion category',
            ],
            [
                'category_code' => 'MCAT-007',
                'name' => 'Festival Meals',
                'slug' => 'festival-meals',
                'description' => 'Festival and celebration meal packages',
                'display_order' => 7,
                'icon' => 'celebration',
                'image' => null,
                'color_code' => '#F44336',
                'status' => 'active',
                'is_default' => false,
                'remarks' => 'Festival celebration category',
            ],
        ];

        $inserted = 0;

        foreach ($categories as $category) {
            DB::table('meal_categories')->insert([
                'uuid' => Str::uuid()->toString(),
                'category_code' => $category['category_code'],
                'name' => $category['name'],
                'slug' => $category['slug'],
                'description' => $category['description'],
                'display_order' => $category['display_order'],
                'icon' => $category['icon'],
                'image' => $category['image'],
                'color_code' => $category['color_code'],
                'status' => $category['status'],
                'is_default' => $category['is_default'],
                'remarks' => $category['remarks'],
                'created_by' => null,
                'updated_by' => null,
                'deleted_by' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            $inserted++;
        }

        $this->command?->info("{$inserted} meal categories seeded successfully.");
    }
}
