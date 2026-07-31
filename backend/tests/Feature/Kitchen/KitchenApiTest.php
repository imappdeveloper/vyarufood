<?php

declare(strict_types=1);

namespace Tests\Feature\Kitchen;

use App\Models\Auth\Admin;
use App\Models\Kitchen;
use App\Models\Master\Country;
use App\Models\Master\State;
use App\Models\Master\City;
use App\Models\Master\DeliveryZone;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KitchenApiTest extends TestCase
{
    use RefreshDatabase;

    protected Admin $admin;
    protected Country $country;
    protected State $state;
    protected City $city;
    protected DeliveryZone $zone;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = Admin::factory()->create([
            'email' => 'superadmin@tiffin.local',
            'password' => 'Admin@1234',
            'status' => 'active',
        ]);

        $this->country = Country::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'iso2' => 'IN',
            'iso3' => 'IND',
            'name' => 'India',
            'status' => 'active',
        ]);

        $this->state = State::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'country_id' => $this->country->id,
            'name' => 'Tamil Nadu',
            'state_code' => 'TN',
            'status' => 'active',
        ]);

        $this->city = City::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'name' => 'Chennai',
            'city_code' => 'CHN',
            'status' => 'active',
        ]);

        $this->zone = DeliveryZone::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'zone_name' => 'South Chennai Zone',
            'zone_code' => 'SCZ',
            'city_id' => $this->city->id,
            'delivery_radius' => 10,
            'delivery_charge' => 30,
            'free_delivery_above' => 200,
            'minimum_order_amount' => 100,
            'estimated_delivery_time' => 30,
            'status' => 'active',
        ]);
    }

    protected function createKitchen(array $overrides = []): Kitchen
    {
        return Kitchen::create(array_merge([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'kitchen_code' => 'KIT-' . strtoupper(\Illuminate\Support\Str::random(4)),
            'name' => 'Test Kitchen ' . uniqid(),
            'kitchen_type' => 'main_kitchen',
            'manager_name' => 'Test Manager',
            'manager_mobile' => '9876543210',
            'manager_email' => 'manager@test.local',
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'city_id' => $this->city->id,
            'delivery_zone_id' => $this->zone->id,
            'address_line_1' => '123 Test Street',
            'latitude' => 13.0827,
            'longitude' => 80.2707,
            'opening_time' => '06:00',
            'closing_time' => '22:00',
            'preparation_start_time' => '05:00',
            'accept_order_start_time' => '07:00',
            'accept_order_end_time' => '21:00',
            'daily_capacity' => 500,
            'maximum_orders' => 200,
            'status' => 'active',
            'is_default' => false,
        ], $overrides));
    }

    protected function actingAsAdmin(): void
    {
        $this->actingAs($this->admin, 'admin');
    }

    public function test_can_list_kitchens(): void
    {
        $this->actingAsAdmin();
        $this->createKitchen(['kitchen_code' => 'KIT-001']);
        $this->createKitchen(['kitchen_code' => 'KIT-002']);

        $response = $this->getJson('/api/v1/admin/kitchens');

        $response->assertOk();
        $response->assertJsonStructure([
            'success',
            'data' => [
                'data' => [
                    ['uuid', 'kitchen_code', 'name'],
                ],
            ],
        ]);
    }

    public function test_can_create_kitchen(): void
    {
        $this->actingAsAdmin();

        $data = [
            'kitchen_code' => 'KIT-NEW',
            'name' => 'New Kitchen',
            'kitchen_type' => 'main_kitchen',
            'manager_name' => 'New Manager',
            'manager_mobile' => '9876543299',
            'manager_email' => 'new@tiffin.local',
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'city_id' => $this->city->id,
            'delivery_zone_id' => $this->zone->id,
            'address_line_1' => '456 New Street',
            'latitude' => 13.0827,
            'longitude' => 80.2707,
            'opening_time' => '06:00',
            'closing_time' => '22:00',
            'preparation_start_time' => '05:00',
            'daily_capacity' => 300,
            'maximum_orders' => 150,
            'status' => 'active',
        ];

        $response = $this->postJson('/api/v1/admin/kitchens', $data);

        $response->assertCreated();
        $this->assertDatabaseHas('kitchens', ['kitchen_code' => 'KIT-NEW', 'name' => 'New Kitchen']);
    }

    public function test_cannot_create_kitchen_without_required_fields(): void
    {
        $this->actingAsAdmin();

        $response = $this->postJson('/api/v1/admin/kitchens', []);

        $response->assertUnprocessable();
    }

    public function test_cannot_create_kitchen_with_duplicate_code(): void
    {
        $this->actingAsAdmin();
        $this->createKitchen(['kitchen_code' => 'KIT-DUP']);

        $response = $this->postJson('/api/v1/admin/kitchens', [
            'kitchen_code' => 'KIT-DUP',
            'name' => 'Different Kitchen',
            'kitchen_type' => 'main_kitchen',
            'status' => 'active',
        ]);

        $response->assertUnprocessable();
    }

    public function test_cannot_create_kitchen_with_duplicate_name(): void
    {
        $this->actingAsAdmin();
        $this->createKitchen(['name' => 'Duplicate Kitchen']);

        $response = $this->postJson('/api/v1/admin/kitchens', [
            'kitchen_code' => 'KIT-NEW',
            'name' => 'Duplicate Kitchen',
            'kitchen_type' => 'main_kitchen',
            'status' => 'active',
        ]);

        $response->assertUnprocessable();
    }

    public function test_can_show_kitchen(): void
    {
        $this->actingAsAdmin();
        $kitchen = $this->createKitchen();

        $response = $this->getJson("/api/v1/admin/kitchens/{$kitchen->uuid}");

        $response->assertOk();
        $response->assertJson([
            'data' => [
                'uuid' => $kitchen->uuid,
                'kitchen_code' => $kitchen->kitchen_code,
                'name' => $kitchen->name,
            ],
        ]);
    }

    public function test_can_update_kitchen(): void
    {
        $this->actingAsAdmin();
        $kitchen = $this->createKitchen();

        $response = $this->putJson("/api/v1/admin/kitchens/{$kitchen->uuid}", [
            'name' => 'Updated Kitchen Name',
            'description' => 'Updated description',
        ]);

        $response->assertOk();
        $this->assertDatabaseHas('kitchens', ['id' => $kitchen->id, 'name' => 'Updated Kitchen Name']);
    }

    public function test_can_delete_kitchen(): void
    {
        $this->actingAsAdmin();
        $kitchen = $this->createKitchen();

        $response = $this->deleteJson("/api/v1/admin/kitchens/{$kitchen->uuid}");

        $response->assertOk();
        $this->assertSoftDeleted('kitchens', ['id' => $kitchen->id]);
    }

    public function test_cannot_delete_default_kitchen(): void
    {
        $this->actingAsAdmin();
        $kitchen = $this->createKitchen(['is_default' => true]);

        $response = $this->deleteJson("/api/v1/admin/kitchens/{$kitchen->uuid}");

        $response->assertStatus(422);
    }

    public function test_can_restore_kitchen(): void
    {
        $this->actingAsAdmin();
        $kitchen = $this->createKitchen();
        $kitchen->delete();

        $response = $this->postJson("/api/v1/admin/kitchens/{$kitchen->uuid}/restore");

        $response->assertOk();
        $this->assertNotSoftDeleted('kitchens', ['id' => $kitchen->id]);
    }

    public function test_can_force_delete_kitchen(): void
    {
        $this->actingAsAdmin();
        $kitchen = $this->createKitchen();
        $kitchenId = $kitchen->id;
        $kitchen->delete();

        $response = $this->deleteJson("/api/v1/admin/kitchens/{$kitchen->uuid}/force-delete");

        $response->assertOk();
        $this->assertDatabaseMissing('kitchens', ['id' => $kitchenId]);
    }

    public function test_can_set_default_kitchen(): void
    {
        $this->actingAsAdmin();
        $kitchen = $this->createKitchen();

        $response = $this->patchJson("/api/v1/admin/kitchens/{$kitchen->uuid}/default");

        $response->assertOk();
        $this->assertDatabaseHas('kitchens', ['id' => $kitchen->id, 'is_default' => true]);
    }

    public function test_set_default_unsets_other_defaults(): void
    {
        $this->actingAsAdmin();
        $kitchen1 = $this->createKitchen(['is_default' => true]);
        $kitchen2 = $this->createKitchen(['is_default' => false]);

        $this->patchJson("/api/v1/admin/kitchens/{$kitchen2->uuid}/default");

        $this->assertDatabaseHas('kitchens', ['id' => $kitchen1->id, 'is_default' => false]);
        $this->assertDatabaseHas('kitchens', ['id' => $kitchen2->id, 'is_default' => true]);
    }

    public function test_can_set_status(): void
    {
        $this->actingAsAdmin();
        $kitchen = $this->createKitchen(['status' => 'active']);

        $response = $this->patchJson("/api/v1/admin/kitchens/{$kitchen->uuid}/status", ['status' => 'inactive']);

        $response->assertOk();
        $this->assertDatabaseHas('kitchens', ['id' => $kitchen->id, 'status' => 'inactive']);
    }

    public function test_can_bulk_delete(): void
    {
        $this->actingAsAdmin();
        $k1 = $this->createKitchen();
        $k2 = $this->createKitchen();

        $response = $this->postJson('/api/v1/admin/kitchens/bulk-delete', [
            'ids' => [$k1->id, $k2->id],
        ]);

        $response->assertOk();
        $this->assertSoftDeleted('kitchens', ['id' => $k1->id]);
        $this->assertSoftDeleted('kitchens', ['id' => $k2->id]);
    }

    public function test_can_bulk_set_status(): void
    {
        $this->actingAsAdmin();
        $k1 = $this->createKitchen(['status' => 'active']);
        $k2 = $this->createKitchen(['status' => 'active']);

        $response = $this->postJson('/api/v1/admin/kitchens/bulk-set-status', [
            'ids' => [$k1->id, $k2->id],
            'status' => 'inactive',
        ]);

        $response->assertOk();
        $this->assertDatabaseHas('kitchens', ['id' => $k1->id, 'status' => 'inactive']);
        $this->assertDatabaseHas('kitchens', ['id' => $k2->id, 'status' => 'inactive']);
    }

    public function test_can_search_kitchens(): void
    {
        $this->actingAsAdmin();
        $this->createKitchen(['name' => 'Sunrise Kitchen', 'kitchen_code' => 'KIT-SUN']);
        $this->createKitchen(['name' => 'Moon Kitchen', 'kitchen_code' => 'KIT-MOO']);

        $response = $this->getJson('/api/v1/admin/kitchens/search?q=Sunrise');

        $response->assertOk();
    }

    public function test_can_get_stats(): void
    {
        $this->actingAsAdmin();
        $this->createKitchen(['status' => 'active']);
        $this->createKitchen(['status' => 'inactive']);

        $response = $this->getJson('/api/v1/admin/kitchens/stats');

        $response->assertOk();
        $response->assertJsonStructure([
            'data' => [
                'total_by_status',
                'default_count',
            ],
        ]);
    }

    public function test_can_filter_by_status(): void
    {
        $this->actingAsAdmin();
        $this->createKitchen(['status' => 'active']);
        $this->createKitchen(['status' => 'inactive']);

        $response = $this->getJson('/api/v1/admin/kitchens?status=active');

        $response->assertOk();
    }

    public function test_can_filter_by_kitchen_type(): void
    {
        $this->actingAsAdmin();
        $this->createKitchen(['kitchen_type' => 'main_kitchen']);
        $this->createKitchen(['kitchen_type' => 'cloud_kitchen']);

        $response = $this->getJson('/api/v1/admin/kitchens?kitchen_type=main_kitchen');

        $response->assertOk();
    }

    public function test_unauthenticated_cannot_access_kitchens(): void
    {
        $response = $this->getJson('/api/v1/admin/kitchens');

        $response->assertUnauthorized();
    }

    public function test_can_export_kitchens(): void
    {
        $this->actingAsAdmin();
        $this->createKitchen();

        $response = $this->getJson('/api/v1/admin/kitchens/export');

        $response->assertOk();
        $response->assertHeader('Content-Type', 'text/csv');
    }

    public function test_can_import_kitchens(): void
    {
        $this->actingAsAdmin();

        $csv = "kitchen_code,name,kitchen_type,manager_name,manager_mobile,status\n";
        $csv .= "KIT-IMP,Imported Kitchen,main_kitchen,Import Manager,9876543000,active\n";

        $tempFile = tempnam(sys_get_temp_dir(), 'kitchen_import');
        file_put_contents($tempFile, $csv);

        $response = $this->postJson('/api/v1/admin/kitchens/import', [
            'file' => \Illuminate\Http\UploadedFile::fake()->createWithContent(
                'kitchens.csv',
                file_get_contents($tempFile)
            ),
        ]);

        @unlink($tempFile);

        $response->assertOk();
        $this->assertDatabaseHas('kitchens', ['kitchen_code' => 'KIT-IMP']);
    }

    public function test_can_download_sample_template(): void
    {
        $this->actingAsAdmin();

        $response = $this->getJson('/api/v1/admin/kitchens/sample-template');

        $response->assertOk();
        $response->assertHeader('Content-Type', 'text/csv');
    }
}
