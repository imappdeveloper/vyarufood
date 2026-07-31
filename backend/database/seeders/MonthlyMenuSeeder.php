<?php
declare(strict_types=1);
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
class MonthlyMenuSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $augustMenuId = DB::table('monthly_menus')->insertGetId([
            'uuid' => Str::uuid()->toString(),
            'month' => 8,
            'year' => 2026,
            'kitchen_id' => 1,
            'title' => 'August 2026 - Weekly Thali Plan',
            'description' => 'Published monthly menu for August 2026 featuring a curated weekly thali plan with rotating meals across all categories.',
            'menu_template_id' => null,
            'status' => 'published',
            'published_at' => $now,
            'published_by' => null,
            'approved_at' => null,
            'approved_by' => null,
            'created_by' => null,
            'updated_by' => null,
            'deleted_by' => null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $augustItems = [
            ['menu_date' => '2026-08-03', 'day_name' => 'monday', 'meal_category_id' => 1, 'meal_id' => 1, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_special' => false, 'is_festival' => false],
            ['menu_date' => '2026-08-03', 'day_name' => 'monday', 'meal_category_id' => 2, 'meal_id' => 2, 'meal_type_id' => 1, 'display_order' => 2, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_special' => false, 'is_festival' => false],
            ['menu_date' => '2026-08-04', 'day_name' => 'tuesday', 'meal_category_id' => 1, 'meal_id' => 3, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_special' => false, 'is_festival' => false],
            ['menu_date' => '2026-08-04', 'day_name' => 'tuesday', 'meal_category_id' => 3, 'meal_id' => 7, 'meal_type_id' => 1, 'display_order' => 2, 'meal_limit' => 40, 'is_default' => false, 'is_optional' => true, 'is_special' => false, 'is_festival' => false],
            ['menu_date' => '2026-08-05', 'day_name' => 'wednesday', 'meal_category_id' => 4, 'meal_id' => 4, 'meal_type_id' => 2, 'display_order' => 1, 'meal_limit' => 30, 'is_default' => true, 'is_optional' => false, 'is_special' => false, 'is_festival' => false],
            ['menu_date' => '2026-08-06', 'day_name' => 'thursday', 'meal_category_id' => 5, 'meal_id' => 5, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_special' => false, 'is_festival' => false],
            ['menu_date' => '2026-08-07', 'day_name' => 'friday', 'meal_category_id' => 6, 'meal_id' => 8, 'meal_type_id' => 3, 'display_order' => 1, 'meal_limit' => 40, 'is_default' => true, 'is_optional' => false, 'is_special' => false, 'is_festival' => false],
            ['menu_date' => '2026-08-07', 'day_name' => 'friday', 'meal_category_id' => 7, 'meal_id' => 9, 'meal_type_id' => 1, 'display_order' => 2, 'meal_limit' => 35, 'is_default' => false, 'is_optional' => true, 'is_special' => false, 'is_festival' => false],
            ['menu_date' => '2026-08-08', 'day_name' => 'saturday', 'meal_category_id' => 1, 'meal_id' => 10, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_special' => true, 'is_festival' => false],
            ['menu_date' => '2026-08-09', 'day_name' => 'sunday', 'meal_category_id' => 2, 'meal_id' => 12, 'meal_type_id' => 2, 'display_order' => 1, 'meal_limit' => 60, 'is_default' => true, 'is_optional' => false, 'is_special' => true, 'is_festival' => false],
        ];

        foreach ($augustItems as $item) {
            DB::table('monthly_menu_items')->insert([
                'uuid' => Str::uuid()->toString(),
                'monthly_menu_id' => $augustMenuId,
                'menu_date' => $item['menu_date'],
                'day_name' => $item['day_name'],
                'meal_category_id' => $item['meal_category_id'],
                'meal_id' => $item['meal_id'],
                'meal_type_id' => $item['meal_type_id'],
                'display_order' => $item['display_order'],
                'meal_limit' => $item['meal_limit'],
                'remaining_quantity' => $item['meal_limit'],
                'is_default' => $item['is_default'] ? 1 : 0,
                'is_optional' => $item['is_optional'] ? 1 : 0,
                'is_special' => $item['is_special'] ? 1 : 0,
                'is_festival' => $item['is_festival'] ? 1 : 0,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $septemberMenuId = DB::table('monthly_menus')->insertGetId([
            'uuid' => Str::uuid()->toString(),
            'month' => 9,
            'year' => 2026,
            'kitchen_id' => 1,
            'title' => 'September 2026 - Festival Special',
            'description' => 'Draft monthly menu for September 2026 featuring festive special meals for upcoming celebrations.',
            'menu_template_id' => null,
            'status' => 'draft',
            'published_at' => null,
            'published_by' => null,
            'approved_at' => null,
            'approved_by' => null,
            'created_by' => null,
            'updated_by' => null,
            'deleted_by' => null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $septemberItems = [
            ['menu_date' => '2026-09-01', 'day_name' => 'tuesday', 'meal_category_id' => 1, 'meal_id' => 1, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_special' => false, 'is_festival' => false],
            ['menu_date' => '2026-09-07', 'day_name' => 'monday', 'meal_category_id' => 2, 'meal_id' => 3, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 50, 'is_default' => true, 'is_optional' => false, 'is_special' => false, 'is_festival' => false],
            ['menu_date' => '2026-09-15', 'day_name' => 'tuesday', 'meal_category_id' => 5, 'meal_id' => 5, 'meal_type_id' => 2, 'display_order' => 1, 'meal_limit' => 60, 'is_default' => true, 'is_optional' => false, 'is_special' => true, 'is_festival' => true],
            ['menu_date' => '2026-09-20', 'day_name' => 'sunday', 'meal_category_id' => 6, 'meal_id' => 8, 'meal_type_id' => 1, 'display_order' => 1, 'meal_limit' => 45, 'is_default' => true, 'is_optional' => false, 'is_special' => true, 'is_festival' => true],
            ['menu_date' => '2026-09-25', 'day_name' => 'friday', 'meal_category_id' => 7, 'meal_id' => 12, 'meal_type_id' => 3, 'display_order' => 1, 'meal_limit' => 40, 'is_default' => false, 'is_optional' => true, 'is_special' => true, 'is_festival' => true],
        ];

        foreach ($septemberItems as $item) {
            DB::table('monthly_menu_items')->insert([
                'uuid' => Str::uuid()->toString(),
                'monthly_menu_id' => $septemberMenuId,
                'menu_date' => $item['menu_date'],
                'day_name' => $item['day_name'],
                'meal_category_id' => $item['meal_category_id'],
                'meal_id' => $item['meal_id'],
                'meal_type_id' => $item['meal_type_id'],
                'display_order' => $item['display_order'],
                'meal_limit' => $item['meal_limit'],
                'remaining_quantity' => $item['meal_limit'],
                'is_default' => $item['is_default'] ? 1 : 0,
                'is_optional' => $item['is_optional'] ? 1 : 0,
                'is_special' => $item['is_special'] ? 1 : 0,
                'is_festival' => $item['is_festival'] ? 1 : 0,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $templateId = DB::table('menu_templates')->insertGetId([
            'uuid' => Str::uuid()->toString(),
            'template_name' => 'Standard Weekly Template',
            'description' => 'Default weekly template with one meal per day across all categories.',
            'kitchen_id' => 1,
            'is_default' => true,
            'status' => 'active',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $templateItems = [
            ['day_name' => 'monday', 'meal_category_id' => 1, 'meal_id' => 1, 'meal_type_id' => 1, 'display_order' => 1],
            ['day_name' => 'tuesday', 'meal_category_id' => 2, 'meal_id' => 2, 'meal_type_id' => 1, 'display_order' => 1],
            ['day_name' => 'wednesday', 'meal_category_id' => 3, 'meal_id' => 3, 'meal_type_id' => 1, 'display_order' => 1],
            ['day_name' => 'thursday', 'meal_category_id' => 4, 'meal_id' => 4, 'meal_type_id' => 2, 'display_order' => 1],
            ['day_name' => 'friday', 'meal_category_id' => 5, 'meal_id' => 5, 'meal_type_id' => 1, 'display_order' => 1],
            ['day_name' => 'saturday', 'meal_category_id' => 6, 'meal_id' => 8, 'meal_type_id' => 3, 'display_order' => 1],
            ['day_name' => 'sunday', 'meal_category_id' => 7, 'meal_id' => 12, 'meal_type_id' => 1, 'display_order' => 1],
        ];

        foreach ($templateItems as $item) {
            DB::table('menu_template_items')->insert([
                'uuid' => Str::uuid()->toString(),
                'menu_template_id' => $templateId,
                'day_name' => $item['day_name'],
                'meal_category_id' => $item['meal_category_id'],
                'meal_id' => $item['meal_id'],
                'meal_type_id' => $item['meal_type_id'],
                'display_order' => $item['display_order'],
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $this->command?->info("2 monthly menus with 15 items and 1 menu template with 7 items seeded successfully.");
    }
}
