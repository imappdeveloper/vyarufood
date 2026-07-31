<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StateSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('states')->delete();

        $now = now();

        $indiaId = DB::table('countries')->where('iso2', 'IN')->value('id');
        $usId = DB::table('countries')->where('iso2', 'US')->value('id');
        $ukId = DB::table('countries')->where('iso2', 'GB')->value('id');

        $states = [];

        if ($indiaId) {
            $indianStates = [
                ['name' => 'Maharashtra', 'state_code' => 'MH', 'abbreviation' => 'MH', 'gst_code' => '27', 'latitude' => 19.7515, 'longitude' => 75.7139, 'sort_order' => 0, 'is_default' => true],
                ['name' => 'Karnataka', 'state_code' => 'KA', 'abbreviation' => 'KA', 'gst_code' => '29', 'latitude' => 15.3173, 'longitude' => 75.7139, 'sort_order' => 1, 'is_default' => false],
                ['name' => 'Tamil Nadu', 'state_code' => 'TN', 'abbreviation' => 'TN', 'gst_code' => '33', 'latitude' => 11.1271, 'longitude' => 78.6569, 'sort_order' => 2, 'is_default' => false],
                ['name' => 'Gujarat', 'state_code' => 'GJ', 'abbreviation' => 'GJ', 'gst_code' => '24', 'latitude' => 22.2587, 'longitude' => 71.1924, 'sort_order' => 3, 'is_default' => false],
                ['name' => 'Rajasthan', 'state_code' => 'RJ', 'abbreviation' => 'RJ', 'gst_code' => '08', 'latitude' => 27.0238, 'longitude' => 74.2179, 'sort_order' => 4, 'is_default' => false],
                ['name' => 'Uttar Pradesh', 'state_code' => 'UP', 'abbreviation' => 'UP', 'gst_code' => '09', 'latitude' => 26.8467, 'longitude' => 80.9462, 'sort_order' => 5, 'is_default' => false],
                ['name' => 'West Bengal', 'state_code' => 'WB', 'abbreviation' => 'WB', 'gst_code' => '19', 'latitude' => 22.9871, 'longitude' => 87.8550, 'sort_order' => 6, 'is_default' => false],
                ['name' => 'Madhya Pradesh', 'state_code' => 'MP', 'abbreviation' => 'MP', 'gst_code' => '23', 'latitude' => 22.9734, 'longitude' => 78.6569, 'sort_order' => 7, 'is_default' => false],
                ['name' => 'Andhra Pradesh', 'state_code' => 'AP', 'abbreviation' => 'AP', 'gst_code' => '37', 'latitude' => 15.9129, 'longitude' => 79.7400, 'sort_order' => 8, 'is_default' => false],
                ['name' => 'Kerala', 'state_code' => 'KL', 'abbreviation' => 'KL', 'gst_code' => '32', 'latitude' => 10.8505, 'longitude' => 76.2711, 'sort_order' => 9, 'is_default' => false],
                ['name' => 'Telangana', 'state_code' => 'TS', 'abbreviation' => 'TS', 'gst_code' => '36', 'latitude' => 18.1124, 'longitude' => 79.0193, 'sort_order' => 10, 'is_default' => false],
                ['name' => 'Bihar', 'state_code' => 'BR', 'abbreviation' => 'BR', 'gst_code' => '10', 'latitude' => 25.0961, 'longitude' => 85.3131, 'sort_order' => 11, 'is_default' => false],
                ['name' => 'Punjab', 'state_code' => 'PB', 'abbreviation' => 'PB', 'gst_code' => '03', 'latitude' => 31.1471, 'longitude' => 75.3412, 'sort_order' => 12, 'is_default' => false],
                ['name' => 'Haryana', 'state_code' => 'HR', 'abbreviation' => 'HR', 'gst_code' => '06', 'latitude' => 29.0588, 'longitude' => 76.0856, 'sort_order' => 13, 'is_default' => false],
                ['name' => 'Odisha', 'state_code' => 'OR', 'abbreviation' => 'OR', 'gst_code' => '21', 'latitude' => 20.9517, 'longitude' => 85.0985, 'sort_order' => 14, 'is_default' => false],
            ];

            foreach ($indianStates as $s) {
                $states[] = array_merge($s, [
                    'uuid' => Str::uuid()->toString(),
                    'country_id' => $indiaId,
                    'status' => 'active',
                    'remarks' => null,
                    'created_by' => null,
                    'updated_by' => null,
                    'deleted_by' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }

        if ($usId) {
            $usStates = [
                ['name' => 'California', 'state_code' => 'CA', 'abbreviation' => 'CA', 'gst_code' => null, 'latitude' => 36.7783, 'longitude' => -119.4179, 'sort_order' => 0, 'is_default' => true],
                ['name' => 'New York', 'state_code' => 'NY', 'abbreviation' => 'NY', 'gst_code' => null, 'latitude' => 42.1657, 'longitude' => -74.9481, 'sort_order' => 1, 'is_default' => false],
                ['name' => 'Texas', 'state_code' => 'TX', 'abbreviation' => 'TX', 'gst_code' => null, 'latitude' => 31.9686, 'longitude' => -99.9018, 'sort_order' => 2, 'is_default' => false],
                ['name' => 'Florida', 'state_code' => 'FL', 'abbreviation' => 'FL', 'gst_code' => null, 'latitude' => 27.6648, 'longitude' => -81.5158, 'sort_order' => 3, 'is_default' => false],
                ['name' => 'Illinois', 'state_code' => 'IL', 'abbreviation' => 'IL', 'gst_code' => null, 'latitude' => 40.6331, 'longitude' => -89.3985, 'sort_order' => 4, 'is_default' => false],
            ];

            foreach ($usStates as $s) {
                $states[] = array_merge($s, [
                    'uuid' => Str::uuid()->toString(),
                    'country_id' => $usId,
                    'status' => 'active',
                    'remarks' => null,
                    'created_by' => null,
                    'updated_by' => null,
                    'deleted_by' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }

        if ($ukId) {
            $ukStates = [
                ['name' => 'England', 'state_code' => 'ENG', 'abbreviation' => 'ENG', 'gst_code' => null, 'latitude' => 52.3555, 'longitude' => -1.1743, 'sort_order' => 0, 'is_default' => true],
                ['name' => 'Scotland', 'state_code' => 'SCT', 'abbreviation' => 'SCT', 'gst_code' => null, 'latitude' => 56.4907, 'longitude' => -4.2026, 'sort_order' => 1, 'is_default' => false],
                ['name' => 'Wales', 'state_code' => 'WLS', 'abbreviation' => 'WLS', 'gst_code' => null, 'latitude' => 52.1307, 'longitude' => -3.7837, 'sort_order' => 2, 'is_default' => false],
                ['name' => 'Northern Ireland', 'state_code' => 'NIR', 'abbreviation' => 'NIR', 'gst_code' => null, 'latitude' => 54.7877, 'longitude' => -6.4923, 'sort_order' => 3, 'is_default' => false],
            ];

            foreach ($ukStates as $s) {
                $states[] = array_merge($s, [
                    'uuid' => Str::uuid()->toString(),
                    'country_id' => $ukId,
                    'status' => 'active',
                    'remarks' => null,
                    'created_by' => null,
                    'updated_by' => null,
                    'deleted_by' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }

        if (!empty($states)) {
            DB::table('states')->insert($states);
        }
    }
}
