<?php

declare(strict_types=1);

namespace Tests\Feature\Pincode;

use App\Models\Auth\Admin;
use App\Models\Master\Country;
use App\Models\Master\State;
use App\Models\Master\City;
use App\Models\Master\Area;
use App\Models\Master\DeliveryZone;
use App\Models\Master\Pincode;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class PincodeApiTest extends TestCase
{
    use RefreshDatabase;

    protected Admin $admin;
    protected Country $country;
    protected State $state;
    protected City $city;

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

        Auth::guard('admin')->login($this->admin);
    }

    private function createDeliveryZone(array $overrides = []): DeliveryZone
    {
        $counter = DeliveryZone::count() + 1;

        return DeliveryZone::create(array_merge([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'city_id' => $this->city->id,
            'zone_name' => "Zone {$counter}",
            'zone_code' => "ZN{$counter}",
            'description' => 'Primary delivery zone',
            'delivery_radius' => 5.00,
            'minimum_order_amount' => 150.00,
            'delivery_charge' => 20.00,
            'free_delivery_above' => 500.00,
            'estimated_delivery_time' => 30,
            'maximum_orders_per_slot' => 50,
            'priority' => 1,
            'status' => 'active',
            'is_default' => true,
        ], $overrides));
    }

    private function createPincode(?array $overrides = null): Pincode
    {
        $zone = $this->createDeliveryZone();
        $counter = Pincode::count() + 1;

        return Pincode::create(array_merge([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'delivery_zone_id' => $zone->id,
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'city_id' => $this->city->id,
            'pincode' => str_pad((string) (400000 + $counter), 6, '0', STR_PAD_LEFT),
            'office_name' => 'Area ' . $counter,
            'district' => 'Mumbai',
            'latitude' => 19.1364,
            'longitude' => 72.8296,
            'status' => 'active',
            'is_serviceable' => true,
        ], $overrides ?? []));
    }

    public function test_can_list_pincodes(): void
    {
        $this->createPincode(['pincode' => '400058']);
        $this->createPincode(['pincode' => '400051']);

        $response = $this->getJson('/api/v1/admin/pincodes');
        $response->assertOk()->assertJsonStructure(['success', 'data', 'meta']);
    }

    public function test_can_create_pincode(): void
    {
        $zone = $this->createDeliveryZone();

        $response = $this->postJson('/api/v1/admin/pincodes', [
            'delivery_zone_id' => $zone->id,
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'city_id' => $this->city->id,
            'pincode' => '400001',
            'office_name' => 'Fort',
            'district' => 'Mumbai',
            'latitude' => 18.9432,
            'longitude' => 72.8321,
            'status' => 'active',
            'is_serviceable' => true,
        ]);

        $response->assertCreated()->assertJsonStructure(['success', 'data' => ['uuid', 'pincode']]);
        $this->assertDatabaseHas('pincodes', ['pincode' => '400001']);
    }

    public function test_can_show_pincode(): void
    {
        $pincode = $this->createPincode(['pincode' => '400058']);

        $response = $this->getJson("/api/v1/admin/pincodes/{$pincode->uuid}");
        $response->assertOk()->assertJsonPath('data.pincode', '400058');
    }

    public function test_can_update_pincode(): void
    {
        $pincode = $this->createPincode(['pincode' => '400058']);

        $response = $this->putJson("/api/v1/admin/pincodes/{$pincode->uuid}", [
            'office_name' => 'Updated Office',
            'district' => 'Updated District',
        ]);

        $response->assertOk()->assertJsonPath('data.office_name', 'Updated Office');
    }

    public function test_can_delete_pincode(): void
    {
        $pincode = $this->createPincode();

        $response = $this->deleteJson("/api/v1/admin/pincodes/{$pincode->uuid}");
        $response->assertOk();
        $this->assertSoftDeleted('pincodes', ['id' => $pincode->id]);
    }

    public function test_can_restore_pincode(): void
    {
        $pincode = $this->createPincode();
        $pincode->delete();

        $response = $this->postJson("/api/v1/admin/pincodes/{$pincode->uuid}/restore");
        $response->assertOk();
        $this->assertDatabaseHas('pincodes', ['id' => $pincode->id, 'deleted_at' => null]);
    }

    public function test_can_force_delete_pincode(): void
    {
        $pincode = $this->createPincode();
        $pincode->delete();

        $response = $this->deleteJson("/api/v1/admin/pincodes/{$pincode->uuid}/force-delete");
        $response->assertOk();
        $this->assertDatabaseMissing('pincodes', ['id' => $pincode->id]);
    }

    public function test_can_bulk_delete_pincodes(): void
    {
        $p1 = $this->createPincode(['pincode' => '400001']);
        $p2 = $this->createPincode(['pincode' => '400002']);

        $response = $this->postJson('/api/v1/admin/pincodes/bulk-delete', [
            'ids' => [$p1->id, $p2->id],
        ]);
        $response->assertOk();
    }

    public function test_can_bulk_set_status_pincodes(): void
    {
        $p1 = $this->createPincode(['pincode' => '400001']);
        $p2 = $this->createPincode(['pincode' => '400002']);

        $response = $this->postJson('/api/v1/admin/pincodes/bulk-set-status', [
            'ids' => [$p1->id, $p2->id],
            'status' => 'inactive',
        ]);
        $response->assertOk();
    }

    public function test_can_export_pincodes(): void
    {
        $this->createPincode(['pincode' => '400058']);

        $response = $this->getJson('/api/v1/admin/pincodes/export');
        $response->assertOk();
    }

    public function test_cannot_create_pincode_with_invalid_data(): void
    {
        $response = $this->postJson('/api/v1/admin/pincodes', []);
        $response->assertUnprocessable()->assertJsonValidationErrors([
            'delivery_zone_id', 'country_id', 'state_id', 'city_id', 'pincode', 'status',
        ]);
    }

    public function test_unauthenticated_user_cannot_access(): void
    {
        Auth::guard('admin')->logout();

        $response = $this->getJson('/api/v1/admin/pincodes');
        $response->assertUnauthorized();
    }
}
