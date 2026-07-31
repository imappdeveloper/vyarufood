<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AreaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('areas')->delete();

        $now = now();

        $indiaId = DB::table('countries')->where('iso2', 'IN')->value('id');
        $states = DB::table('states')->pluck('id', 'name')->toArray();
        $mhId = $states['Maharashtra'] ?? null;
        $kaId = $states['Karnataka'] ?? null;

        $cities = DB::table('cities')->pluck('id', 'name')->toArray();
        $mumbaiId = $cities['Mumbai'] ?? null;
        $puneId = $cities['Pune'] ?? null;
        $bangaloreId = $cities['Bangalore'] ?? null;

        $areas = [];

        $areaData = [
            $mumbaiId => [
                ['name' => 'Andheri West', 'area_code' => 'AND-W', 'postal_zone' => '400058', 'latitude' => 19.1364, 'longitude' => 72.8296, 'delivery_radius' => 5.0, 'minimum_order_amount' => 150.00, 'delivery_charge' => 20.00, 'estimated_delivery_time' => 30, 'is_serviceable' => true, 'is_default' => true, 'display_order' => 0],
                ['name' => 'Bandra East', 'area_code' => 'BND-E', 'postal_zone' => '400051', 'latitude' => 19.0596, 'longitude' => 72.8295, 'delivery_radius' => 3.0, 'minimum_order_amount' => 200.00, 'delivery_charge' => 15.00, 'estimated_delivery_time' => 25, 'is_serviceable' => true, 'is_default' => false, 'display_order' => 1],
                ['name' => 'Borivali West', 'area_code' => 'BRV-W', 'postal_zone' => '400092', 'latitude' => 19.2307, 'longitude' => 72.8567, 'delivery_radius' => 4.0, 'minimum_order_amount' => 150.00, 'delivery_charge' => 25.00, 'estimated_delivery_time' => 35, 'is_serviceable' => true, 'is_default' => false, 'display_order' => 2],
                ['name' => 'Dadar', 'area_code' => 'DDR', 'postal_zone' => '400014', 'latitude' => 19.0178, 'longitude' => 72.8478, 'delivery_radius' => 3.0, 'minimum_order_amount' => 150.00, 'delivery_charge' => 15.00, 'estimated_delivery_time' => 25, 'is_serviceable' => true, 'is_default' => false, 'display_order' => 3],
                ['name' => 'Powai', 'area_code' => 'POW', 'postal_zone' => '400076', 'latitude' => 19.1176, 'longitude' => 72.9060, 'delivery_radius' => 4.0, 'minimum_order_amount' => 200.00, 'delivery_charge' => 20.00, 'estimated_delivery_time' => 30, 'is_serviceable' => true, 'is_default' => false, 'display_order' => 4],
            ],
            $puneId => [
                ['name' => 'Kothrud', 'area_code' => 'KTR', 'postal_zone' => '411038', 'latitude' => 18.5074, 'longitude' => 73.8077, 'delivery_radius' => 4.0, 'minimum_order_amount' => 120.00, 'delivery_charge' => 15.00, 'estimated_delivery_time' => 25, 'is_serviceable' => true, 'is_default' => true, 'display_order' => 0],
                ['name' => 'Hinjewadi', 'area_code' => 'HNJ', 'postal_zone' => '411057', 'latitude' => 18.5913, 'longitude' => 73.7389, 'delivery_radius' => 5.0, 'minimum_order_amount' => 150.00, 'delivery_charge' => 20.00, 'estimated_delivery_time' => 30, 'is_serviceable' => true, 'is_default' => false, 'display_order' => 1],
                ['name' => 'Viman Nagar', 'area_code' => 'VMN', 'postal_zone' => '411014', 'latitude' => 18.5679, 'longitude' => 73.9143, 'delivery_radius' => 3.0, 'minimum_order_amount' => 150.00, 'delivery_charge' => 15.00, 'estimated_delivery_time' => 25, 'is_serviceable' => true, 'is_default' => false, 'display_order' => 2],
            ],
            $bangaloreId => [
                ['name' => 'Koramangala', 'area_code' => 'KRM', 'postal_zone' => '560034', 'latitude' => 12.9352, 'longitude' => 77.6245, 'delivery_radius' => 4.0, 'minimum_order_amount' => 150.00, 'delivery_charge' => 20.00, 'estimated_delivery_time' => 30, 'is_serviceable' => true, 'is_default' => true, 'display_order' => 0],
                ['name' => 'HSR Layout', 'area_code' => 'HSR', 'postal_zone' => '560102', 'latitude' => 12.9116, 'longitude' => 77.6389, 'delivery_radius' => 4.0, 'minimum_order_amount' => 150.00, 'delivery_charge' => 20.00, 'estimated_delivery_time' => 30, 'is_serviceable' => true, 'is_default' => false, 'display_order' => 1],
                ['name' => 'Whitefield', 'area_code' => 'WFD', 'postal_zone' => '560066', 'latitude' => 12.9698, 'longitude' => 77.7500, 'delivery_radius' => 5.0, 'minimum_order_amount' => 200.00, 'delivery_charge' => 25.00, 'estimated_delivery_time' => 40, 'is_serviceable' => true, 'is_default' => false, 'display_order' => 2],
            ],
        ];

        foreach ($areaData as $cityId => $cityAreas) {
            if (! $cityId) {
                continue;
            }
            foreach ($cityAreas as $a) {
                $city = DB::table('cities')->where('id', $cityId)->first();
                $areas[] = array_merge($a, [
                    'uuid' => Str::uuid()->toString(),
                    'country_id' => $indiaId,
                    'state_id' => $city->state_id ?? $mhId,
                    'city_id' => $cityId,
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

        if (! empty($areas)) {
            DB::table('areas')->insert($areas);
        }
    }
}
