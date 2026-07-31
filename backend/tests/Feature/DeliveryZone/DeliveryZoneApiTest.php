<?php

declare(strict_types=1);

namespace Tests\Feature\DeliveryZone;

use App\Models\Auth\Admin;
use App\Models\Master\Country;
use App\Models\Master\State;
use App\Models\Master\City;
use App\Models\Master\Area;
use App\Models\Master\DeliveryZone;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeliveryZoneApiTest extends TestCase
{
    use RefreshDatabase;

    protected Admin $admin;
    protected Country $country;
    protected State $state;
    protected City $city;
    protected Area $area;

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
            'name' => 'Maharashtra',
            'state_code' => 'MH',
            'status' => 'active',
        ]);

        $this->city = City::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'name' => 'Mumbai',
            'city_code' => 'MUM',
            'status' => 'active',
        ]);

        $this->area = Area::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'city_id' => $this->city->id,
            'name' => 'Andheri West',
            'area_code' => 'AW',
            'postal_zone' => '400058',
            'latitude' => 19.1364,
            'longitude' => 72.8296,
            'delivery_radius' => 5.0,
            'minimum_order_amount' => 150.0,
            'delivery_charge' => 20.0,
            'estimated_delivery_time' => 30,
            'is_serviceable' => true,
            'is_default' => false,
            'display_order' => 0,
            'status' => 'active',
        ]);
    }

    private function authHeader(): void
    {
        $this->actingAs($this->admin, 'admin');
    }

    private function createDeliveryZone(array $overrides = []): DeliveryZone
    {
        $counter = DeliveryZone::count() + 1;

        return DeliveryZone::create(array_merge([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'city_id' => $this->city->id,
            'area_id' => $this->area->id,
            'zone_name' => "Zone {$counter}",
            'zone_code' => "ZN{$counter}",
            'description' => 'Test delivery zone',
            'delivery_radius' => 5.0,
            'minimum_order_amount' => 150.0,
            'delivery_charge' => 20.0,
            'free_delivery_above' => 500.0,
            'estimated_delivery_time' => 30,
            'maximum_orders_per_slot' => 10,
            'priority' => 0,
            'status' => 'active',
            'is_default' => false,
            'remarks' => null,
        ], $overrides));
    }

    private function createState(array $overrides = []): State
    {
        return State::create(array_merge([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'country_id' => $this->country->id,
            'name' => 'Karnataka',
            'state_code' => 'KA',
            'status' => 'active',
        ], $overrides));
    }

    private function createCity(array $overrides = []): City
    {
        return City::create(array_merge([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'name' => 'Pune',
            'city_code' => 'PUN',
            'status' => 'active',
        ], $overrides));
    }

    private function createArea(array $overrides = []): Area
    {
        return Area::create(array_merge([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'city_id' => $this->city->id,
            'name' => 'Kothrud',
            'area_code' => 'KTD',
            'postal_zone' => '411038',
            'latitude' => 18.5074,
            'longitude' => 73.8077,
            'delivery_radius' => 4.0,
            'minimum_order_amount' => 100.0,
            'delivery_charge' => 15.0,
            'estimated_delivery_time' => 25,
            'is_serviceable' => true,
            'is_default' => false,
            'display_order' => 0,
            'status' => 'active',
        ], $overrides));
    }

    public function test_can_list_delivery_zones(): void
    {
        $this->authHeader();
        $this->createDeliveryZone(['zone_name' => 'Zone A', 'zone_code' => 'ZA1']);
        $this->createDeliveryZone(['zone_name' => 'Zone B', 'zone_code' => 'ZB1']);

        $response = $this->getJson('/api/v1/admin/delivery-zones');
        $response->assertOk()->assertJsonStructure(['success', 'data', 'meta']);
    }

    public function test_can_create_delivery_zone(): void
    {
        $this->authHeader();

        $response = $this->postJson('/api/v1/admin/delivery-zones', [
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'city_id' => $this->city->id,
            'area_id' => $this->area->id,
            'zone_name' => 'Dadar Zone',
            'zone_code' => 'DZ01',
            'description' => 'Dadar delivery zone',
            'delivery_radius' => 3.0,
            'minimum_order_amount' => 100.0,
            'delivery_charge' => 15.0,
            'free_delivery_above' => 400.0,
            'estimated_delivery_time' => 25,
            'maximum_orders_per_slot' => 8,
            'priority' => 1,
            'status' => 'active',
        ]);

        $response->assertCreated()->assertJsonStructure(['success', 'data' => ['uuid', 'zone_name', 'zone_code']]);
        $this->assertDatabaseHas('delivery_zones', ['zone_name' => 'Dadar Zone', 'zone_code' => 'DZ01']);
    }

    public function test_can_show_delivery_zone(): void
    {
        $this->authHeader();
        $zone = $this->createDeliveryZone();

        $response = $this->getJson("/api/v1/admin/delivery-zones/{$zone->uuid}");
        $response->assertOk()->assertJsonPath('data.zone_name', $zone->zone_name);
    }

    public function test_can_update_delivery_zone(): void
    {
        $this->authHeader();
        $zone = $this->createDeliveryZone();

        $response = $this->putJson("/api/v1/admin/delivery-zones/{$zone->uuid}", [
            'zone_name' => 'Updated Zone',
        ]);

        $response->assertOk()->assertJsonPath('data.zone_name', 'Updated Zone');
    }

    public function test_can_delete_delivery_zone(): void
    {
        $this->authHeader();
        $zone = $this->createDeliveryZone();

        $response = $this->deleteJson("/api/v1/admin/delivery-zones/{$zone->uuid}");
        $response->assertOk();
        $this->assertSoftDeleted('delivery_zones', ['id' => $zone->id]);
    }

    public function test_can_restore_delivery_zone(): void
    {
        $this->authHeader();
        $zone = $this->createDeliveryZone();
        $zone->delete();

        $response = $this->postJson("/api/v1/admin/delivery-zones/{$zone->uuid}/restore");
        $response->assertOk();
        $this->assertDatabaseHas('delivery_zones', ['id' => $zone->id, 'deleted_at' => null]);
    }

    public function test_can_force_delete_delivery_zone(): void
    {
        $this->authHeader();
        $zone = $this->createDeliveryZone();
        $zone->delete();

        $response = $this->deleteJson("/api/v1/admin/delivery-zones/{$zone->uuid}/force-delete");
        $response->assertOk();
        $this->assertDatabaseMissing('delivery_zones', ['id' => $zone->id]);
    }

    public function test_can_bulk_delete_delivery_zones(): void
    {
        $this->authHeader();
        $z1 = $this->createDeliveryZone(['zone_name' => 'Zone 1', 'zone_code' => 'Z1']);
        $z2 = $this->createDeliveryZone(['zone_name' => 'Zone 2', 'zone_code' => 'Z2']);

        $response = $this->postJson('/api/v1/admin/delivery-zones/bulk-delete', ['ids' => [$z1->id, $z2->id]]);
        $response->assertOk();
    }

    public function test_can_bulk_set_status_delivery_zones(): void
    {
        $this->authHeader();
        $z1 = $this->createDeliveryZone(['zone_name' => 'Zone C', 'zone_code' => 'ZC1']);
        $z2 = $this->createDeliveryZone(['zone_name' => 'Zone D', 'zone_code' => 'ZD1']);

        $response = $this->postJson('/api/v1/admin/delivery-zones/bulk-set-status', [
            'ids' => [$z1->id, $z2->id],
            'status' => 'inactive',
        ]);
        $response->assertOk();
    }

    public function test_can_set_default_delivery_zone(): void
    {
        $this->authHeader();
        $zone = $this->createDeliveryZone();

        $response = $this->postJson("/api/v1/admin/delivery-zones/{$zone->uuid}/set-default");
        $response->assertOk();
        $this->assertDatabaseHas('delivery_zones', ['id' => $zone->id, 'is_default' => true]);
    }

    public function test_can_export_delivery_zones(): void
    {
        $this->authHeader();
        $this->createDeliveryZone();

        $response = $this->getJson('/api/v1/admin/delivery-zones/export');
        $response->assertOk();
    }

    public function test_cannot_create_delivery_zone_with_invalid_data(): void
    {
        $this->authHeader();

        $response = $this->postJson('/api/v1/admin/delivery-zones', []);
        $response->assertUnprocessable()->assertJsonValidationErrors([
            'country_id', 'state_id', 'city_id', 'zone_name', 'zone_code', 'status',
        ]);
    }

    public function test_cannot_create_duplicate_zone_code(): void
    {
        $this->authHeader();
        $this->createDeliveryZone(['zone_code' => 'SAME']);

        $response = $this->postJson('/api/v1/admin/delivery-zones', [
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'city_id' => $this->city->id,
            'zone_name' => 'Different Zone',
            'zone_code' => 'SAME',
            'status' => 'active',
        ]);

        $response->assertUnprocessable();
    }

    public function test_unauthenticated_user_cannot_access(): void
    {
        $response = $this->getJson('/api/v1/admin/delivery-zones');
        $response->assertUnauthorized();
    }

    public function test_can_check_service_area(): void
    {
        $this->createDeliveryZone();

        $response = $this->postJson('/api/v1/check-service-area', [
            'latitude' => 19.1364,
            'longitude' => 72.8296,
            'city_id' => $this->city->id,
        ]);

        $response->assertOk()->assertJsonStructure(['success', 'data']);
    }
}
