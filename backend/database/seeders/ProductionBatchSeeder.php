<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\{ProductionBatch, ProductionBatchItem, MealPackingList, ProductionStatusHistory};
use App\Models\{Kitchen, Meal, Order, OrderItem};
use Illuminate\Database\Seeder;

class ProductionBatchSeeder extends Seeder
{
    public function run(): void
    {
        $kitchen = Kitchen::first();
        $meals = Meal::all();

        if (! $kitchen || $meals->isEmpty()) {
            $this->command->warn('No kitchen or meals found. Skipping production batch seeding.');
            return;
        }

        $statuses = ['draft', 'planned', 'cooking', 'prepared', 'packing', 'packed', 'completed'];
        $batchCount = ProductionBatch::count();

        for ($day = 0; $day < 7; $day++) {
            $date = now()->subDays($day)->toDateString();
            $status = $statuses[array_rand($statuses)];
            $numMeals = min($meals->count(), rand(3, 8));
            $selectedMeals = $meals->random($numMeals);
            $totalMeals = 0;
            $batchCount++;

            $batch = ProductionBatch::create([
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'batch_number' => 'PB-' . str_replace('-', '', $date) . '-' . str_pad((string) $batchCount, 4, '0', STR_PAD_LEFT),
                'production_date' => $date,
                'kitchen_id' => $kitchen->id,
                'batch_name' => 'Auto Batch - ' . $date,
                'batch_type' => 'regular',
                'total_orders' => rand(5, 25),
                'total_meals' => 0,
                'planned_start_time' => '06:00',
                'planned_end_time' => '10:00',
                'actual_start_time' => in_array($status, ['cooking', 'prepared', 'packing', 'packed', 'completed']) ? now()->subHours(rand(1, 5)) : null,
                'actual_end_time' => in_array($status, ['completed']) ? now()->subHours(rand(0, 2)) : null,
                'production_status' => $status,
                'remarks' => 'Seeded production batch',
            ]);

            foreach ($selectedMeals as $meal) {
                $planned = rand(5, 30);
                $prepared = in_array($status, ['prepared', 'packing', 'packed', 'completed']) ? $planned - rand(0, 2) : 0;
                $packed = in_array($status, ['packing', 'packed', 'completed']) ? max(0, $prepared - rand(0, 1)) : 0;
                $wastage = $prepared > 0 ? min(rand(0, 3), $prepared - $packed) : 0;
                $remaining = max(0, $prepared - $packed - $wastage);
                $totalMeals += $planned;

                ProductionBatchItem::create([
                    'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                    'production_batch_id' => $batch->id,
                    'meal_id' => $meal->id,
                    'meal_category_id' => $meal->meal_category_id,
                    'meal_type_id' => $meal->meal_type_id,
                    'planned_quantity' => $planned,
                    'prepared_quantity' => $prepared,
                    'packed_quantity' => $packed,
                    'wastage_quantity' => $wastage,
                    'remaining_quantity' => $remaining,
                    'status' => $status === 'completed' ? 'packed' : ($status === 'draft' ? 'pending' : 'cooking'),
                ]);
            }

            $batch->update(['total_meals' => $totalMeals]);

            ProductionStatusHistory::create([
                'uuid' => \Illuminate\Support\Str::uuid()->toString(),
                'production_batch_id' => $batch->id,
                'from_status' => null,
                'to_status' => $status,
                'reason' => 'Batch created via seeder',
            ]);

        }

        $this->command->info("Production batches seeded ({$batchCount} total).");
    }
}
