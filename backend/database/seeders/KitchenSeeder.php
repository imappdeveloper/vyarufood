<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class KitchenSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $countryId = DB::table('countries')->where('iso2', 'IN')->value('id');
        $stateId = DB::table('states')->where('name', 'Tamil Nadu')->value('id');
        $cityId = DB::table('cities')->where('name', 'Chennai')->value('id');

        $zoneIds = DB::table('delivery_zones')
            ->pluck('id', 'zone_code')
            ->toArray();

        $kitchens = [
            [
                'kitchen_code' => 'KIT-001',
                'name' => 'Main Kitchen - Velachery',
                'description' => 'Primary kitchen serving South Chennai tiffin orders. Equipped with modern appliances for breakfast, lunch, and dinner preparation.',
                'kitchen_type' => 'main_kitchen',
                'manager_name' => 'Rajesh Kumar',
                'manager_mobile' => '9876543210',
                'manager_email' => 'rajesh.velachery@tiffin.local',
                'city_id' => $cityId,
                'area_id' => null,
                'delivery_zone_id' => $zoneIds['SCZ'] ?? null,
                'address_line_1' => '42, Velachery Main Road, Balaji Nagar',
                'address_line_2' => 'Velachery, Chennai 600041',
                'landmark' => 'Near Phoenix Mall',
                'latitude' => 12.9815,
                'longitude' => 80.2180,
                'opening_time' => '05:00',
                'closing_time' => '23:00',
                'preparation_start_time' => '04:30',
                'accept_order_start_time' => '06:00',
                'accept_order_end_time' => '21:30',
                'daily_capacity' => 500,
                'maximum_orders' => 200,
                'emergency_contact' => '9876543211',
                'license_number' => 'TN-FSSAI-2024-001',
                'fssai_number' => '10012011000001',
                'gst_number' => '33AAACT1234F1Z5',
                'logo' => null,
                'status' => 'active',
                'is_default' => true,
                'remarks' => 'Primary kitchen, fully operational.',
            ],
            [
                'kitchen_code' => 'KIT-002',
                'name' => 'Central Kitchen - T Nagar',
                'description' => 'Central kitchen for North Chennai and T Nagar area. Handles bulk preparation and distribution.',
                'kitchen_type' => 'central_kitchen',
                'manager_name' => 'Suresh Babu',
                'manager_mobile' => '9876543220',
                'manager_email' => 'suresh.tnagar@tiffin.local',
                'city_id' => $cityId,
                'area_id' => null,
                'delivery_zone_id' => $zoneIds['CCZ'] ?? null,
                'address_line_1' => '15, Usman Road, Near Pondy Bazaar',
                'address_line_2' => 'T Nagar, Chennai 600017',
                'landmark' => 'Opposite Saravana Stores',
                'latitude' => 13.0418,
                'longitude' => 80.2341,
                'opening_time' => '06:00',
                'closing_time' => '22:00',
                'preparation_start_time' => '05:00',
                'accept_order_start_time' => '07:00',
                'accept_order_end_time' => '21:00',
                'daily_capacity' => 400,
                'maximum_orders' => 150,
                'emergency_contact' => '9876543221',
                'license_number' => 'TN-FSSAI-2024-002',
                'fssai_number' => '10012011000002',
                'gst_number' => '33BBBCT5678G1Z6',
                'logo' => null,
                'status' => 'active',
                'is_default' => false,
                'remarks' => 'Central kitchen for bulk orders.',
            ],
            [
                'kitchen_code' => 'KIT-003',
                'name' => 'Cloud Kitchen - OMR',
                'description' => 'Cloud kitchen for OMR IT corridor. Delivery-only model serving tech park employees.',
                'kitchen_type' => 'cloud_kitchen',
                'manager_name' => 'Priya Mehta',
                'manager_mobile' => '9876543230',
                'manager_email' => 'priya.omr@tiffin.local',
                'city_id' => $cityId,
                'area_id' => null,
                'delivery_zone_id' => $zoneIds['SCZ'] ?? null,
                'address_line_1' => '101, OMR IT Corridor, Sholinganallur',
                'address_line_2' => 'Sholinganallur, Chennai 600119',
                'landmark' => 'Near Sholinganallur Junction',
                'latitude' => 12.9010,
                'longitude' => 80.2279,
                'opening_time' => '07:00',
                'closing_time' => '22:00',
                'preparation_start_time' => '06:00',
                'accept_order_start_time' => '08:00',
                'accept_order_end_time' => '21:00',
                'daily_capacity' => 300,
                'maximum_orders' => 120,
                'emergency_contact' => '9876543231',
                'license_number' => 'TN-FSSAI-2024-003',
                'fssai_number' => '10012011000003',
                'gst_number' => '33CCCDT9012H1Z7',
                'logo' => null,
                'status' => 'inactive',
                'is_default' => false,
                'remarks' => 'Planned expansion to OMR IT corridor. Currently inactive.',
            ],
        ];

        $inserted = 0;

        foreach ($kitchens as $kitchen) {
            DB::table('kitchens')->insert([
                'uuid' => Str::uuid()->toString(),
                'kitchen_code' => $kitchen['kitchen_code'],
                'name' => $kitchen['name'],
                'description' => $kitchen['description'],
                'kitchen_type' => $kitchen['kitchen_type'],
                'manager_name' => $kitchen['manager_name'],
                'manager_mobile' => $kitchen['manager_mobile'],
                'manager_email' => $kitchen['manager_email'],
                'country_id' => $countryId,
                'state_id' => $stateId,
                'city_id' => $kitchen['city_id'],
                'area_id' => $kitchen['area_id'],
                'delivery_zone_id' => $kitchen['delivery_zone_id'],
                'address_line_1' => $kitchen['address_line_1'],
                'address_line_2' => $kitchen['address_line_2'],
                'landmark' => $kitchen['landmark'],
                'latitude' => $kitchen['latitude'],
                'longitude' => $kitchen['longitude'],
                'opening_time' => $kitchen['opening_time'],
                'closing_time' => $kitchen['closing_time'],
                'preparation_start_time' => $kitchen['preparation_start_time'],
                'accept_order_start_time' => $kitchen['accept_order_start_time'],
                'accept_order_end_time' => $kitchen['accept_order_end_time'],
                'daily_capacity' => $kitchen['daily_capacity'],
                'maximum_orders' => $kitchen['maximum_orders'],
                'emergency_contact' => $kitchen['emergency_contact'],
                'license_number' => $kitchen['license_number'],
                'fssai_number' => $kitchen['fssai_number'],
                'gst_number' => $kitchen['gst_number'],
                'logo' => $kitchen['logo'],
                'status' => $kitchen['status'],
                'is_default' => $kitchen['is_default'],
                'remarks' => $kitchen['remarks'],
                'created_by' => null,
                'updated_by' => null,
                'deleted_by' => null,
                'created_at' => $now->copy()->subDays(mt_rand(1, 30)),
                'updated_at' => $now->copy()->subDays(mt_rand(0, 5)),
            ]);

            $inserted++;
        }

        $this->command?->info("{$inserted} kitchens seeded successfully.");
    }
}
