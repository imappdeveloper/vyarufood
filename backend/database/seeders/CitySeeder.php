<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('cities')->delete();

        $now = now();

        $indiaId = DB::table('countries')->where('iso2', 'IN')->value('id');
        $usId = DB::table('countries')->where('iso2', 'US')->value('id');

        $states = DB::table('states')->pluck('id', 'name')->toArray();
        $mhId = $states['Maharashtra'] ?? null;
        $kaId = $states['Karnataka'] ?? null;
        $tnId = $states['Tamil Nadu'] ?? null;
        $gjId = $states['Gujarat'] ?? null;
        $rjId = $states['Rajasthan'] ?? null;
        $caId = $states['California'] ?? null;

        $cities = [];

        $cityData = [
            ['state_id' => $mhId, 'country_id' => $indiaId, 'data' => [
                ['name' => 'Mumbai', 'city_code' => 'MUM', 'pincode' => '400001', 'latitude' => 19.0760, 'longitude' => 72.8777, 'timezone' => 'Asia/Kolkata', 'population' => 12442373, 'area' => 603.40, 'display_order' => 0, 'is_metro' => true, 'is_default' => true],
                ['name' => 'Pune', 'city_code' => 'PUN', 'pincode' => '411001', 'latitude' => 18.5204, 'longitude' => 73.8567, 'timezone' => 'Asia/Kolkata', 'population' => 3124458, 'area' => 331.23, 'display_order' => 1, 'is_metro' => false, 'is_default' => false],
                ['name' => 'Nagpur', 'city_code' => 'NGP', 'pincode' => '440001', 'latitude' => 21.1458, 'longitude' => 79.0882, 'timezone' => 'Asia/Kolkata', 'population' => 2497772, 'area' => 227.36, 'display_order' => 2, 'is_metro' => false, 'is_default' => false],
                ['name' => 'Nashik', 'city_code' => 'NSK', 'pincode' => '422001', 'latitude' => 19.9975, 'longitude' => 73.7898, 'timezone' => 'Asia/Kolkata', 'population' => 1486053, 'area' => 264.53, 'display_order' => 3, 'is_metro' => false, 'is_default' => false],
                ['name' => 'Aurangabad', 'city_code' => 'AUR', 'pincode' => '431001', 'latitude' => 19.8762, 'longitude' => 75.3433, 'timezone' => 'Asia/Kolkata', 'population' => 1175116, 'area' => 138.59, 'display_order' => 4, 'is_metro' => false, 'is_default' => false],
            ]],
            ['state_id' => $kaId, 'country_id' => $indiaId, 'data' => [
                ['name' => 'Bangalore', 'city_code' => 'BLR', 'pincode' => '560001', 'latitude' => 12.9716, 'longitude' => 77.5946, 'timezone' => 'Asia/Kolkata', 'population' => 8443675, 'area' => 741.00, 'display_order' => 0, 'is_metro' => true, 'is_default' => true],
                ['name' => 'Mysore', 'city_code' => 'MYS', 'pincode' => '570001', 'latitude' => 12.2958, 'longitude' => 76.6394, 'timezone' => 'Asia/Kolkata', 'population' => 887446, 'area' => 155.00, 'display_order' => 1, 'is_metro' => false, 'is_default' => false],
                ['name' => 'Hubli', 'city_code' => 'HBL', 'pincode' => '580001', 'latitude' => 15.3647, 'longitude' => 75.1240, 'timezone' => 'Asia/Kolkata', 'population' => 943788, 'area' => 191.22, 'display_order' => 2, 'is_metro' => false, 'is_default' => false],
            ]],
            ['state_id' => $tnId, 'country_id' => $indiaId, 'data' => [
                ['name' => 'Chennai', 'city_code' => 'CHN', 'pincode' => '600001', 'latitude' => 13.0827, 'longitude' => 80.2707, 'timezone' => 'Asia/Kolkata', 'population' => 7088000, 'area' => 426.00, 'display_order' => 0, 'is_metro' => true, 'is_default' => true],
                ['name' => 'Coimbatore', 'city_code' => 'CJB', 'pincode' => '641001', 'latitude' => 11.0168, 'longitude' => 76.9558, 'timezone' => 'Asia/Kolkata', 'population' => 1601438, 'area' => 246.88, 'display_order' => 1, 'is_metro' => false, 'is_default' => false],
                ['name' => 'Madurai', 'city_code' => 'MDU', 'pincode' => '625001', 'latitude' => 9.9252, 'longitude' => 78.1198, 'timezone' => 'Asia/Kolkata', 'population' => 1017865, 'area' => 147.97, 'display_order' => 2, 'is_metro' => false, 'is_default' => false],
            ]],
            ['state_id' => $gjId, 'country_id' => $indiaId, 'data' => [
                ['name' => 'Ahmedabad', 'city_code' => 'AMD', 'pincode' => '380001', 'latitude' => 23.0225, 'longitude' => 72.5714, 'timezone' => 'Asia/Kolkata', 'population' => 5570585, 'area' => 505.00, 'display_order' => 0, 'is_metro' => true, 'is_default' => true],
                ['name' => 'Surat', 'city_code' => 'STV', 'pincode' => '395001', 'latitude' => 21.1702, 'longitude' => 72.8311, 'timezone' => 'Asia/Kolkata', 'population' => 4467797, 'area' => 465.00, 'display_order' => 1, 'is_metro' => false, 'is_default' => false],
                ['name' => 'Vadodara', 'city_code' => 'VAD', 'pincode' => '390001', 'latitude' => 22.3072, 'longitude' => 73.1812, 'timezone' => 'Asia/Kolkata', 'population' => 1822221, 'area' => 235.78, 'display_order' => 2, 'is_metro' => false, 'is_default' => false],
            ]],
            ['state_id' => $rjId, 'country_id' => $indiaId, 'data' => [
                ['name' => 'Jaipur', 'city_code' => 'JAI', 'pincode' => '302001', 'latitude' => 26.9124, 'longitude' => 75.7873, 'timezone' => 'Asia/Kolkata', 'population' => 3073350, 'area' => 484.64, 'display_order' => 0, 'is_metro' => true, 'is_default' => true],
                ['name' => 'Jodhpur', 'city_code' => 'JDH', 'pincode' => '342001', 'latitude' => 26.2389, 'longitude' => 73.0243, 'timezone' => 'Asia/Kolkata', 'population' => 1138052, 'area' => 228.57, 'display_order' => 1, 'is_metro' => false, 'is_default' => false],
            ]],
        ];

        foreach ($cityData as $group) {
            if (! $group['state_id'] || ! $group['country_id']) {
                continue;
            }
            foreach ($group['data'] as $c) {
                $cities[] = array_merge($c, [
                    'uuid' => Str::uuid()->toString(),
                    'country_id' => $group['country_id'],
                    'state_id' => $group['state_id'],
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

        if ($usId && $caId) {
            $usCities = [
                ['state_id' => $caId, 'country_id' => $usId, 'data' => [
                    ['name' => 'Los Angeles', 'city_code' => 'LA', 'pincode' => '90001', 'latitude' => 34.0522, 'longitude' => -118.2437, 'timezone' => 'America/Los_Angeles', 'population' => 3898747, 'area' => 1302.00, 'display_order' => 0, 'is_metro' => true, 'is_default' => true],
                    ['name' => 'San Francisco', 'city_code' => 'SF', 'pincode' => '94102', 'latitude' => 37.7749, 'longitude' => -122.4194, 'timezone' => 'America/Los_Angeles', 'population' => 873965, 'area' => 121.48, 'display_order' => 1, 'is_metro' => false, 'is_default' => false],
                ]],
            ];
            foreach ($usCities as $group) {
                foreach ($group['data'] as $c) {
                    $cities[] = array_merge($c, [
                        'uuid' => Str::uuid()->toString(),
                        'country_id' => $group['country_id'],
                        'state_id' => $group['state_id'],
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
        }

        if (! empty($cities)) {
            DB::table('cities')->insert($cities);
        }
    }
}
