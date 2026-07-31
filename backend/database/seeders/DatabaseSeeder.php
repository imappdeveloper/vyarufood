<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CountrySeeder::class,
            StateSeeder::class,
            CitySeeder::class,
            PermissionSeeder::class,
            RoleSeeder::class,
            AdminSeeder::class,
            AreaSeeder::class,
            DeliveryZoneSeeder::class,
            CustomerSeeder::class,
            CustomerAddressSeeder::class,
            KitchenSeeder::class,
            MealCategorySeeder::class,
            MealTypeSeeder::class,
            MealSeeder::class,
            WeeklyMenuSeeder::class,
            CustomerSubscriptionSeeder::class,
            OrderSeeder::class,
            SystemSettingSeeder::class,
            CmsPageSeeder::class,
        ]);
    }
}
