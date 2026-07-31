<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\{Unit, InventoryItem, Recipe, RecipeItem, RecipeVersion, Meal};
use Illuminate\Database\Seeder;

class RecipeSeeder extends Seeder
{
    public function run(): void
    {
        $units = $this->seedUnits();
        $items = $this->seedInventoryItems($units);
        $recipes = $this->seedRecipes($items, $units);
        $this->seedRecipeVersions($recipes);

        $this->command->info('Recipe seeder completed successfully.');
    }

    private function seedUnits(): \Illuminate\Support\Collection
    {
        $unitData = [
            ['name' => 'Kilogram', 'symbol' => 'kg', 'type' => 'weight', 'sort_order' => 1],
            ['name' => 'Gram', 'symbol' => 'g', 'type' => 'weight', 'sort_order' => 2, 'base_unit_id' => null, 'conversion_factor' => 0.001],
            ['name' => 'Litre', 'symbol' => 'L', 'type' => 'volume', 'sort_order' => 3],
            ['name' => 'Millilitre', 'symbol' => 'ml', 'type' => 'volume', 'sort_order' => 4, 'base_unit_id' => null, 'conversion_factor' => 0.001],
            ['name' => 'Pieces', 'symbol' => 'pcs', 'type' => 'count', 'sort_order' => 5],
            ['name' => 'Packet', 'symbol' => 'pkt', 'type' => 'count', 'sort_order' => 6],
            ['name' => 'Bottle', 'symbol' => 'btl', 'type' => 'count', 'sort_order' => 7],
            ['name' => 'Box', 'symbol' => 'box', 'type' => 'count', 'sort_order' => 8],
            ['name' => 'Dozen', 'symbol' => 'dz', 'type' => 'count', 'sort_order' => 9],
            ['name' => 'Custom', 'symbol' => 'cstm', 'type' => 'custom', 'sort_order' => 10],
        ];

        $units = collect();
        foreach ($unitData as $data) {
            $unit = Unit::firstOrCreate(
                ['symbol' => $data['symbol']],
                [
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'name' => $data['name'],
                    'type' => $data['type'],
                    'base_unit_id' => $data['base_unit_id'] ?? null,
                    'conversion_factor' => $data['conversion_factor'] ?? 1,
                    'sort_order' => $data['sort_order'],
                    'status' => 'active',
                ]
            );
            $units->push($unit);
        }

        $kg = $units->firstWhere('symbol', 'kg');
        $g = $units->firstWhere('symbol', 'g');
        $l = $units->firstWhere('symbol', 'L');
        $ml = $units->firstWhere('symbol', 'ml');

        if ($kg && $g) {
            $g->update(['base_unit_id' => $kg->id, 'conversion_factor' => 0.001]);
        }
        if ($l && $ml) {
            $ml->update(['base_unit_id' => $l->id, 'conversion_factor' => 0.001]);
        }

        return $units;
    }

    private function seedInventoryItems(\Illuminate\Support\Collection $units): \Illuminate\Support\Collection
    {
        $kg = $units->firstWhere('symbol', 'kg');
        $l = $units->firstWhere('symbol', 'L');
        $g = $units->firstWhere('symbol', 'g');

        $itemData = [
            ['name' => 'Basmati Rice', 'unit_id' => $kg?->id, 'cost_price' => 120, 'current_stock' => 500, 'category' => 'Grains'],
            ['name' => 'Toor Dal', 'unit_id' => $kg?->id, 'cost_price' => 150, 'current_stock' => 200, 'category' => 'Pulses'],
            ['name' => 'Cooking Oil', 'unit_id' => $l?->id, 'cost_price' => 180, 'current_stock' => 100, 'category' => 'Oils'],
            ['name' => 'Onion', 'unit_id' => $kg?->id, 'cost_price' => 40, 'current_stock' => 150, 'category' => 'Vegetables'],
            ['name' => 'Tomato', 'unit_id' => $kg?->id, 'cost_price' => 60, 'current_stock' => 100, 'category' => 'Vegetables'],
            ['name' => 'Ginger', 'unit_id' => $kg?->id, 'cost_price' => 200, 'current_stock' => 50, 'category' => 'Vegetables'],
            ['name' => 'Garlic', 'unit_id' => $kg?->id, 'cost_price' => 180, 'current_stock' => 50, 'category' => 'Vegetables'],
            ['name' => 'Turmeric Powder', 'unit_id' => $g?->id ?? $kg?->id, 'cost_price' => 50, 'current_stock' => 30, 'category' => 'Spices'],
            ['name' => 'Red Chili Powder', 'unit_id' => $g?->id ?? $kg?->id, 'cost_price' => 80, 'current_stock' => 25, 'category' => 'Spices'],
            ['name' => 'Salt', 'unit_id' => $kg?->id, 'cost_price' => 20, 'current_stock' => 100, 'category' => 'Seasonings'],
            ['name' => 'Curry Leaves', 'unit_id' => $kg?->id, 'cost_price' => 100, 'current_stock' => 10, 'category' => 'Herbs'],
            ['name' => 'Mustard Seeds', 'unit_id' => $g?->id ?? $kg?->id, 'cost_price' => 60, 'current_stock' => 20, 'category' => 'Spices'],
            ['name' => 'Coconut', 'unit_id' => $kg?->id, 'cost_price' => 80, 'current_stock' => 40, 'category' => 'Other'],
            ['name' => 'Jaggery', 'unit_id' => $kg?->id, 'cost_price' => 90, 'current_stock' => 30, 'category' => 'Sweeteners'],
            ['name' => 'Garam Masala', 'unit_id' => $g?->id ?? $kg?->id, 'cost_price' => 120, 'current_stock' => 15, 'category' => 'Spices'],
        ];

        $items = collect();
        foreach ($itemData as $index => $data) {
            $item = InventoryItem::firstOrCreate(
                ['name' => $data['name']],
                [
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'item_code' => 'INV-' . str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT),
                    'description' => $data['name'] . ' for tiffin preparation',
                    'category' => $data['category'],
                    'unit_id' => $data['unit_id'] ?? $kg?->id,
                    'current_stock' => $data['current_stock'],
                    'minimum_stock' => 10,
                    'maximum_stock' => 1000,
                    'cost_price' => $data['cost_price'],
                    'status' => 'active',
                ]
            );
            $items->push($item);
        }

        return $items;
    }

    private function seedRecipes(\Illuminate\Support\Collection $items, \Illuminate\Support\Collection $units): \Illuminate\Support\Collection
    {
        $kg = $units->firstWhere('symbol', 'kg');
        $l = $units->firstWhere('symbol', 'L');

        $rice = $items->firstWhere('name', 'Basmati Rice');
        $oil = $items->firstWhere('name', 'Cooking Oil');
        $salt = $items->firstWhere('name', 'Salt');
        $toorDal = $items->firstWhere('name', 'Toor Dal');
        $tomato = $items->firstWhere('name', 'Tomato');
        $onion = $items->firstWhere('name', 'Onion');
        $jaggery = $items->firstWhere('name', 'Jaggery');
        $adminId = \App\Models\Auth\Admin::first()?->id;

        $meals = Meal::limit(6)->get();
        if ($meals->isEmpty()) {
            $this->command->warn('No meals found. Skipping recipe seeding.');
            return collect();
        }

        $recipesData = [
            [
                'meal' => $meals->get(0),
                'recipe_name' => 'Masala Dosa',
                'yield_quantity' => 10,
                'yield_unit' => 'pcs',
                'preparation_time' => 30,
                'cooking_time' => 20,
                'serving_size' => 1,
                'items' => [
                    ['item' => $rice, 'qty' => 0.5, 'unit' => $kg, 'wastage' => 2],
                    ['item' => $oil, 'qty' => 0.1, 'unit' => $l, 'wastage' => 0],
                    ['item' => $salt, 'qty' => 0.01, 'unit' => $kg, 'wastage' => 0],
                ],
            ],
            [
                'meal' => $meals->get(1),
                'recipe_name' => 'Sambar Rice',
                'yield_quantity' => 20,
                'yield_unit' => 'pcs',
                'preparation_time' => 20,
                'cooking_time' => 30,
                'serving_size' => 1,
                'items' => [
                    ['item' => $rice, 'qty' => 0.3, 'unit' => $kg, 'wastage' => 2],
                    ['item' => $toorDal, 'qty' => 0.1, 'unit' => $kg, 'wastage' => 3],
                    ['item' => $tomato, 'qty' => 0.05, 'unit' => $kg, 'wastage' => 5],
                    ['item' => $onion, 'qty' => 0.03, 'unit' => $kg, 'wastage' => 5],
                ],
            ],
            [
                'meal' => $meals->get(2),
                'recipe_name' => 'Idli',
                'yield_quantity' => 15,
                'yield_unit' => 'pcs',
                'preparation_time' => 60,
                'cooking_time' => 15,
                'serving_size' => 1,
                'items' => [
                    ['item' => $rice, 'qty' => 0.4, 'unit' => $kg, 'wastage' => 2],
                    ['item' => $salt, 'qty' => 0.01, 'unit' => $kg, 'wastage' => 0],
                ],
            ],
            [
                'meal' => $meals->get(3),
                'recipe_name' => 'Fried Rice',
                'yield_quantity' => 10,
                'yield_unit' => 'pcs',
                'preparation_time' => 15,
                'cooking_time' => 15,
                'serving_size' => 1,
                'items' => [
                    ['item' => $rice, 'qty' => 0.3, 'unit' => $kg, 'wastage' => 2],
                    ['item' => $oil, 'qty' => 0.05, 'unit' => $l, 'wastage' => 0],
                    ['item' => $onion, 'qty' => 0.02, 'unit' => $kg, 'wastage' => 5],
                ],
            ],
            [
                'meal' => $meals->get(4),
                'recipe_name' => 'Chapati',
                'yield_quantity' => 12,
                'yield_unit' => 'pcs',
                'preparation_time' => 20,
                'cooking_time' => 20,
                'serving_size' => 1,
                'items' => [
                    ['item' => $jaggery, 'qty' => 0.2, 'unit' => $kg, 'wastage' => 1],
                    ['item' => $oil, 'qty' => 0.02, 'unit' => $l, 'wastage' => 0],
                ],
            ],
            [
                'meal' => $meals->get(5),
                'recipe_name' => 'Curd Rice',
                'yield_quantity' => 10,
                'yield_unit' => 'pcs',
                'preparation_time' => 10,
                'cooking_time' => 15,
                'serving_size' => 1,
                'items' => [
                    ['item' => $rice, 'qty' => 0.3, 'unit' => $kg, 'wastage' => 2],
                    ['item' => $salt, 'qty' => 0.01, 'unit' => $kg, 'wastage' => 0],
                ],
            ],
        ];

        $recipes = collect();
        $datePrefix = now()->format('Ymd');

        foreach ($recipesData as $index => $data) {
            $meal = $data['meal'];
            if (! $meal) {
                continue;
            }

            $totalCost = 0;
            foreach ($data['items'] as $itemData) {
                $itemCost = $itemData['item']->cost_price * $itemData['qty'];
                $totalCost += $itemCost;
            }

            $recipe = Recipe::create([
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'recipe_code' => 'RCP-' . $datePrefix . '-' . str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT),
                'meal_id' => $meal->id,
                'recipe_name' => $data['recipe_name'],
                'version' => 1,
                'yield_quantity' => $data['yield_quantity'],
                'yield_unit' => $data['yield_unit'],
                'preparation_time' => $data['preparation_time'],
                'cooking_time' => $data['cooking_time'],
                'serving_size' => $data['serving_size'],
                'recipe_cost' => round($totalCost, 2),
                'food_cost_percentage' => round(($totalCost / max($meal->price ?? 1, 1)) * 100, 2),
                'status' => 'active',
                'remarks' => 'Seeded recipe for ' . $data['recipe_name'],
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            foreach ($data['items'] as $order => $itemData) {
                $itemCost = $itemData['item']->cost_price * $itemData['qty'];
                RecipeItem::create([
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'recipe_id' => $recipe->id,
                    'inventory_item_id' => $itemData['item']->id,
                    'unit_id' => $itemData['unit']->id,
                    'required_quantity' => $itemData['qty'],
                    'wastage_percentage' => $itemData['wastage'],
                    'actual_quantity' => $itemData['qty'] * (1 + $itemData['wastage'] / 100),
                    'cost' => round($itemCost, 2),
                    'display_order' => $order + 1,
                ]);
            }

            $recipes->push($recipe);
        }

        return $recipes;
    }

    private function seedRecipeVersions(\Illuminate\Support\Collection $recipes): void
    {
        foreach ($recipes as $recipe) {
            RecipeVersion::create([
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'recipe_id' => $recipe->id,
                'version' => 1,
                'change_notes' => 'Initial recipe creation',
            ]);
        }
    }
}
