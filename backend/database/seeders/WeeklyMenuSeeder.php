<?php
declare(strict_types=1);
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
class WeeklyMenuSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();
        $currentMonday = now()->startOfWeek();
        $nextMonday = $currentMonday->copy()->addWeek();
        $currentMenuId = DB::table('weekly_menus')->insertGetId([
            'uuid' => Str::uuid()->toString(),
            'kitchen_id' => 1,
            'title' => 'Weekly Menu - ' . $currentMonday->format('M d, Y'),
            'description' => 'Published menu for the current week with a curated selection of meals.',
            'week_start_date' => $currentMonday->toDateString(),
            'week_end_date' => $currentMonday->copy()->addDays(6)->toDateString(),
            'status' => 'published',
            'published_at' => $now,
            'published_by' => null,
            'cut_off_hours' => 12,
            'created_by' => null,
            'updated_by' => null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
        $nextMenuId = DB::table('weekly_menus')->insertGetId([
            'uuid' => Str::uuid()->toString(),
            'kitchen_id' => 1,
            'title' => 'Weekly Menu - ' . $nextMonday->format('M d, Y'),
            'description' => 'Draft menu for the upcoming week. Awaiting final review.',
            'week_start_date' => $nextMonday->toDateString(),
            'week_end_date' => $nextMonday->copy()->addDays(6)->toDateString(),
            'status' => 'draft',
            'published_at' => null,
            'published_by' => null,
            'cut_off_hours' => 12,
            'created_by' => null,
            'updated_by' => null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
        $currentItems = [
            ['day_offset' => 0, 'meal_category_id' => 1, 'meal_id' => 2, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_recommended' => true],
            ['day_offset' => 0, 'meal_category_id' => 2, 'meal_id' => 1, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_recommended' => true],
            ['day_offset' => 0, 'meal_category_id' => 3, 'meal_id' => 7, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 40, 'is_default' => false, 'is_optional' => true, 'is_recommended' => false],
            ['day_offset' => 0, 'meal_category_id' => 4, 'meal_id' => 3, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 30, 'is_default' => false, 'is_optional' => false, 'is_recommended' => true],
            ['day_offset' => 1, 'meal_category_id' => 1, 'meal_id' => 2, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_recommended' => false],
            ['day_offset' => 1, 'meal_category_id' => 2, 'meal_id' => 5, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_recommended' => true],
            ['day_offset' => 1, 'meal_category_id' => 3, 'meal_id' => 7, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 40, 'is_default' => false, 'is_optional' => true, 'is_recommended' => false],
            ['day_offset' => 1, 'meal_category_id' => 4, 'meal_id' => 4, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 30, 'is_default' => false, 'is_optional' => false, 'is_recommended' => true],
            ['day_offset' => 2, 'meal_category_id' => 1, 'meal_id' => 2, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_recommended' => false],
            ['day_offset' => 2, 'meal_category_id' => 2, 'meal_id' => 1, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_recommended' => false],
            ['day_offset' => 2, 'meal_category_id' => 4, 'meal_id' => 8, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 30, 'is_default' => false, 'is_optional' => false, 'is_recommended' => true],
            ['day_offset' => 3, 'meal_category_id' => 1, 'meal_id' => 2, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_recommended' => false],
            ['day_offset' => 3, 'meal_category_id' => 2, 'meal_id' => 5, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_recommended' => true],
            ['day_offset' => 3, 'meal_category_id' => 4, 'meal_id' => 3, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 30, 'is_default' => false, 'is_optional' => false, 'is_recommended' => true],
            ['day_offset' => 4, 'meal_category_id' => 1, 'meal_id' => 2, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_recommended' => false],
            ['day_offset' => 4, 'meal_category_id' => 2, 'meal_id' => 1, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_recommended' => true],
            ['day_offset' => 4, 'meal_category_id' => 4, 'meal_id' => 4, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 30, 'is_default' => false, 'is_optional' => true, 'is_recommended' => false],
            ['day_offset' => 5, 'meal_category_id' => 1, 'meal_id' => 2, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_recommended' => false],
            ['day_offset' => 5, 'meal_category_id' => 2, 'meal_id' => 5, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_recommended' => false],
            ['day_offset' => 5, 'meal_category_id' => 4, 'meal_id' => 8, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 30, 'is_default' => false, 'is_optional' => false, 'is_recommended' => true],
        ];
        $nextItems = [
            ['day_offset' => 0, 'meal_category_id' => 1, 'meal_id' => 2, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_recommended' => true],
            ['day_offset' => 0, 'meal_category_id' => 2, 'meal_id' => 1, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_recommended' => false],
            ['day_offset' => 0, 'meal_category_id' => 4, 'meal_id' => 3, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 30, 'is_default' => false, 'is_optional' => false, 'is_recommended' => true],
            ['day_offset' => 1, 'meal_category_id' => 1, 'meal_id' => 2, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_recommended' => false],
            ['day_offset' => 1, 'meal_category_id' => 2, 'meal_id' => 5, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_recommended' => true],
            ['day_offset' => 1, 'meal_category_id' => 4, 'meal_id' => 8, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 30, 'is_default' => false, 'is_optional' => false, 'is_recommended' => true],
            ['day_offset' => 2, 'meal_category_id' => 1, 'meal_id' => 2, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_recommended' => false],
            ['day_offset' => 2, 'meal_category_id' => 2, 'meal_id' => 1, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_recommended' => true],
            ['day_offset' => 2, 'meal_category_id' => 4, 'meal_id' => 4, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 30, 'is_default' => false, 'is_optional' => true, 'is_recommended' => false],
        ];
        $inserted = 0;
        foreach ($currentItems as $item) {
            DB::table('weekly_menu_items')->insert([
                'uuid' => Str::uuid()->toString(),
                'weekly_menu_id' => $currentMenuId,
                'menu_date' => $currentMonday->copy()->addDays($item['day_offset'])->toDateString(),
                'meal_category_id' => $item['meal_category_id'],
                'meal_id' => $item['meal_id'],
                'meal_type_id' => $item['meal_type_id'],
                'display_order' => $item['display_order'],
                'meal_limit' => $item['meal_limit'],
                'remaining_quantity' => $item['meal_limit'],
                'is_default' => $item['is_default'] ? 1 : 0,
                'is_optional' => $item['is_optional'] ? 1 : 0,
                'is_recommended' => $item['is_recommended'] ? 1 : 0,
                'is_active' => 1,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
            $inserted++;
        }
        foreach ($nextItems as $item) {
            DB::table('weekly_menu_items')->insert([
                'uuid' => Str::uuid()->toString(),
                'weekly_menu_id' => $nextMenuId,
                'menu_date' => $nextMonday->copy()->addDays($item['day_offset'])->toDateString(),
                'meal_category_id' => $item['meal_category_id'],
                'meal_id' => $item['meal_id'],
                'meal_type_id' => $item['meal_type_id'],
                'display_order' => $item['display_order'],
                'meal_limit' => $item['meal_limit'],
                'remaining_quantity' => $item['meal_limit'],
                'is_default' => $item['is_default'] ? 1 : 0,
                'is_optional' => $item['is_optional'] ? 1 : 0,
                'is_recommended' => $item['is_recommended'] ? 1 : 0,
                'is_active' => 1,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
            $inserted++;
        }
        $this->command?->info("2 weekly menus with {$inserted} items seeded successfully.");
    }
}
