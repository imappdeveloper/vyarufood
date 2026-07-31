<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DeliveryZoneSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        DB::table('delivery_slots')->delete();
        DB::table('pincodes')->delete();
        DB::table('delivery_zones')->delete();

        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $now = now();

        $indiaId = DB::table('countries')->where('iso2', 'IN')->value('id');
        $chennaiStateId = DB::table('states')->where('name', 'Tamil Nadu')->value('id');
        $chennaiId = DB::table('cities')->where('name', 'Chennai')->value('id');

        $zones = [
            [
                'zone_name' => 'Central Chennai Zone',
                'zone_code' => 'CCZ',
                'city_id' => $chennaiId,
                'state_id' => $chennaiStateId,
                'country_id' => $indiaId,
                'priority' => 1,
                'is_default' => true,
                'delivery_radius' => 10.00,
                'minimum_order_amount' => 100.00,
                'delivery_charge' => 30.00,
                'free_delivery_above' => 500.00,
                'estimated_delivery_time' => 45,
                'maximum_orders_per_slot' => 100,
                'status' => 'active',
                'created_by' => 1,
            ],
            [
                'zone_name' => 'North Chennai Zone',
                'zone_code' => 'NCZ',
                'city_id' => $chennaiId,
                'state_id' => $chennaiStateId,
                'country_id' => $indiaId,
                'priority' => 2,
                'is_default' => false,
                'delivery_radius' => 15.00,
                'minimum_order_amount' => 150.00,
                'delivery_charge' => 40.00,
                'free_delivery_above' => 750.00,
                'estimated_delivery_time' => 60,
                'maximum_orders_per_slot' => 80,
                'status' => 'active',
                'created_by' => null,
            ],
            [
                'zone_name' => 'South Chennai Zone',
                'zone_code' => 'SCZ',
                'city_id' => $chennaiId,
                'state_id' => $chennaiStateId,
                'country_id' => $indiaId,
                'priority' => 3,
                'is_default' => false,
                'delivery_radius' => 12.00,
                'minimum_order_amount' => 120.00,
                'delivery_charge' => 35.00,
                'free_delivery_above' => 600.00,
                'estimated_delivery_time' => 50,
                'maximum_orders_per_slot' => 90,
                'status' => 'active',
                'created_by' => null,
            ],
        ];

        $zoneIds = [];

        foreach ($zones as $z) {
            $uuid = Str::uuid()->toString();
            $id = DB::table('delivery_zones')->insertGetId(array_merge($z, [
                'uuid' => $uuid,
                'description' => $z['zone_name'] . ' - covers major areas',
                'remarks' => null,
                'updated_by' => null,
                'deleted_by' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ]));
            $zoneIds[$z['zone_code']] = $id;
        }

        $pincodeData = [
            $zoneIds['CCZ'] => [
                ['pincode' => '600001', 'office_name' => 'George Town', 'district' => 'Chennai'],
                ['pincode' => '600002', 'office_name' => 'Chintadripet', 'district' => 'Chennai'],
                ['pincode' => '600003', 'office_name' => 'Triplicane', 'district' => 'Chennai'],
                ['pincode' => '600005', 'office_name' => 'Purasawalkam', 'district' => 'Chennai'],
            ],
            $zoneIds['NCZ'] => [
                ['pincode' => '600019', 'office_name' => 'Tondiarpet', 'district' => 'Chennai'],
                ['pincode' => '600021', 'office_name' => 'Royapuram', 'district' => 'Chennai'],
                ['pincode' => '600030', 'office_name' => 'Washermanpet', 'district' => 'Chennai'],
            ],
            $zoneIds['SCZ'] => [
                ['pincode' => '600004', 'office_name' => 'Mylapore', 'district' => 'Chennai'],
                ['pincode' => '600006', 'office_name' => 'Mandaveli', 'district' => 'Chennai'],
                ['pincode' => '600018', 'office_name' => 'Adyar', 'district' => 'Chennai'],
                ['pincode' => '600041', 'office_name' => 'Velachery', 'district' => 'Chennai'],
            ],
        ];

        $pincodes = [];

        foreach ($pincodeData as $zoneId => $entries) {
            foreach ($entries as $p) {
                $pincodes[] = [
                    'uuid' => Str::uuid()->toString(),
                    'delivery_zone_id' => $zoneId,
                    'pincode' => $p['pincode'],
                    'office_name' => $p['office_name'],
                    'district' => $p['district'],
                    'city_id' => $chennaiId,
                    'state_id' => $chennaiStateId,
                    'country_id' => $indiaId,
                    'is_serviceable' => true,
                    'status' => 'active',
                    'created_by' => null,
                    'updated_by' => null,
                    'deleted_by' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        if (! empty($pincodes)) {
            DB::table('pincodes')->insert($pincodes);
        }

        $slotData = [
            [
                'slot_name' => 'Morning Delivery',
                'start_time' => '08:00',
                'end_time' => '12:00',
                'cutoff_time' => '06:00',
                'maximum_orders' => 100,
            ],
            [
                'slot_name' => 'Afternoon Delivery',
                'start_time' => '12:00',
                'end_time' => '16:00',
                'cutoff_time' => '10:00',
                'maximum_orders' => 150,
            ],
            [
                'slot_name' => 'Evening Delivery',
                'start_time' => '16:00',
                'end_time' => '20:00',
                'cutoff_time' => '14:00',
                'maximum_orders' => 100,
            ],
        ];

        $slots = [];

        foreach ($zoneIds as $zoneId) {
            foreach ($slotData as $s) {
                $slots[] = [
                    'uuid' => Str::uuid()->toString(),
                    'delivery_zone_id' => $zoneId,
                    'slot_name' => $s['slot_name'],
                    'start_time' => $s['start_time'],
                    'end_time' => $s['end_time'],
                    'cutoff_time' => $s['cutoff_time'],
                    'maximum_orders' => $s['maximum_orders'],
                    'status' => 'active',
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        if (! empty($slots)) {
            DB::table('delivery_slots')->insert($slots);
        }
    }
}
