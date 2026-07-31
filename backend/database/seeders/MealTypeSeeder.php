<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MealTypeSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $types = [
            [
                'type_code' => 'MTYPE-001',
                'name' => 'Veg',
                'slug' => 'veg',
                'description' => 'Vegetarian meals',
                'display_order' => 1,
                'icon' => 'eco',
                'image' => null,
                'color_code' => '#4CAF50',
                'status' => 'active',
                'is_default' => true,
                'remarks' => 'Standard vegetarian category',
            ],
            [
                'type_code' => 'MTYPE-002',
                'name' => 'Jain',
                'slug' => 'jain',
                'description' => 'Jain meals without root vegetables',
                'display_order' => 2,
                'icon' => 'local_florist',
                'image' => null,
                'color_code' => '#8BC34A',
                'status' => 'active',
                'is_default' => false,
                'remarks' => 'Jain dietary category',
            ],
            [
                'type_code' => 'MTYPE-003',
                'name' => 'Vegan',
                'slug' => 'vegan',
                'description' => 'Vegan meals without any animal products',
                'display_order' => 3,
                'icon' => 'grass',
                'image' => null,
                'color_code' => '#009688',
                'status' => 'active',
                'is_default' => false,
                'remarks' => 'Vegan dietary category',
            ],
            [
                'type_code' => 'MTYPE-004',
                'name' => 'High Protein',
                'slug' => 'high-protein',
                'description' => 'High protein meals for fitness',
                'display_order' => 4,
                'icon' => 'fitness_center',
                'image' => null,
                'color_code' => '#FF5722',
                'status' => 'active',
                'is_default' => false,
                'remarks' => 'High protein dietary category',
            ],
            [
                'type_code' => 'MTYPE-005',
                'name' => 'Low Carb',
                'slug' => 'low-carb',
                'description' => 'Low carbohydrate meals',
                'display_order' => 5,
                'icon' => 'trending_down',
                'image' => null,
                'color_code' => '#FF9800',
                'status' => 'active',
                'is_default' => false,
                'remarks' => 'Low carb dietary category',
            ],
            [
                'type_code' => 'MTYPE-006',
                'name' => 'Diabetic Friendly',
                'slug' => 'diabetic-friendly',
                'description' => 'Meals suitable for diabetic patients',
                'display_order' => 6,
                'icon' => 'medical_services',
                'image' => null,
                'color_code' => '#3F51B5',
                'status' => 'active',
                'is_default' => false,
                'remarks' => 'Diabetic-friendly dietary category',
            ],
            [
                'type_code' => 'MTYPE-007',
                'name' => 'Kids Meal',
                'slug' => 'kids-meal',
                'description' => 'Meals designed for children',
                'display_order' => 7,
                'icon' => 'child_care',
                'image' => null,
                'color_code' => '#E91E63',
                'status' => 'active',
                'is_default' => false,
                'remarks' => 'Kids meal category',
            ],
            [
                'type_code' => 'MTYPE-008',
                'name' => 'Senior Citizen Meal',
                'slug' => 'senior-citizen-meal',
                'description' => 'Meals designed for senior citizens',
                'display_order' => 8,
                'icon' => 'elderly',
                'image' => null,
                'color_code' => '#795548',
                'status' => 'active',
                'is_default' => false,
                'remarks' => 'Senior citizen meal category',
            ],
            [
                'type_code' => 'MTYPE-009',
                'name' => 'Gluten Free',
                'slug' => 'gluten-free',
                'description' => 'Gluten-free meals',
                'display_order' => 9,
                'icon' => 'block',
                'image' => null,
                'color_code' => '#607D8B',
                'status' => 'active',
                'is_default' => false,
                'remarks' => 'Gluten-free dietary category',
            ],
        ];

        $inserted = 0;

        foreach ($types as $type) {
            DB::table('meal_types')->insert([
                'uuid' => Str::uuid()->toString(),
                'type_code' => $type['type_code'],
                'name' => $type['name'],
                'slug' => $type['slug'],
                'description' => $type['description'],
                'display_order' => $type['display_order'],
                'icon' => $type['icon'],
                'image' => $type['image'],
                'color_code' => $type['color_code'],
                'status' => $type['status'],
                'is_default' => $type['is_default'],
                'remarks' => $type['remarks'],
                'created_by' => null,
                'updated_by' => null,
                'deleted_by' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            $inserted++;
        }

        $this->command?->info("{$inserted} meal types seeded successfully.");
    }
}
