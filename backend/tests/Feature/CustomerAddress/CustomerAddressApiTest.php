<?php

declare(strict_types=1);

namespace Tests\Feature\CustomerAddress;

use App\Models\Auth\Admin;
use App\Models\Customer;
use App\Models\CustomerAddress;
use App\Models\Master\Country;
use App\Models\Master\State;
use App\Models\Master\City;
use App\Models\Master\Area;
use App\Models\Master\DeliveryZone;
use App\Models\Master\Pincode;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class CustomerAddressApiTest extends TestCase
{
    use RefreshDatabase;

    protected Admin $admin;
    protected Customer $customer;
    protected Country $country;
    protected State $state;
    protected City $city;
    protected Area $area;
    protected DeliveryZone $zone;
    protected Pincode $pincode;

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

        $this->area = Area::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'city_id' => $this->city->id,
            'name' => 'Velachery',
            'area_code' => 'VLC',
            'postal_zone' => '600042',
            'status' => 'active',
        ]);

        $this->zone = DeliveryZone::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'zone_name' => 'Central Chennai Zone',
            'zone_code' => 'CCZ',
            'city_id' => $this->city->id,
            'state_id' => $this->state->id,
            'country_id' => $this->country->id,
            'delivery_radius' => 10.00,
            'minimum_order_amount' => 100.00,
            'delivery_charge' => 30.00,
            'free_delivery_above' => 500.00,
            'estimated_delivery_time' => 45,
            'maximum_orders_per_slot' => 100,
            'status' => 'active',
        ]);

        $this->pincode = Pincode::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'delivery_zone_id' => $this->zone->id,
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'city_id' => $this->city->id,
            'area_id' => $this->area->id,
            'pincode' => '600042',
            'office_name' => 'Velachery',
            'district' => 'Chennai',
            'is_serviceable' => true,
            'status' => 'active',
        ]);

        $this->customer = Customer::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'first_name' => 'Test',
            'last_name' => 'Customer',
            'email' => 'test@example.com',
            'phone' => '9876543210',
            'country_code' => '+91',
            'status' => 'active',
            'referral_code' => strtoupper(\Illuminate\Support\Str::random(8)),
        ]);
    }

    protected function createAddress(array $overrides = []): CustomerAddress
    {
        return CustomerAddress::create(array_merge([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'customer_id' => $this->customer->id,
            'address_type' => 'home',
            'house_no' => '12A',
            'building_name' => 'Sunshine Towers',
            'address_line_1' => '12A Velachery Main Road',
            'city_id' => $this->city->id,
            'area_id' => $this->area->id,
            'delivery_zone_id' => $this->zone->id,
            'pincode_id' => $this->pincode->id,
            'latitude' => 13.0067,
            'longitude' => 80.2206,
            'contact_person' => 'Test Person',
            'contact_mobile' => '9876543210',
            'status' => 'active',
            'is_default' => false,
            'is_verified' => false,
        ], $overrides));
    }

    public function test_can_list_customer_addresses(): void
    {
        $this->createAddress();
        $this->createAddress(['address_type' => 'office']);

        $response = $this->actingAs($this->admin, 'admin')
            ->getJson('/api/v1/admin/customer-addresses');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Customer addresses retrieved successfully',
            ]);
    }

    public function test_can_create_customer_address(): void
    {
        $data = [
            'customer_id' => $this->customer->id,
            'address_type' => 'home',
            'house_no' => '45B',
            'building_name' => 'Green Apartments',
            'address_line_1' => '45B T Nagar',
            'city_id' => $this->city->id,
            'area_id' => $this->area->id,
            'delivery_zone_id' => $this->zone->id,
            'pincode_id' => $this->pincode->id,
            'latitude' => 13.0418,
            'longitude' => 80.2341,
            'contact_person' => 'Rahul',
            'contact_mobile' => '9876543211',
            'status' => 'active',
        ];

        $response = $this->actingAs($this->admin, 'admin')
            ->postJson('/api/v1/admin/customer-addresses', $data);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Customer address created successfully',
            ]);

        $this->assertDatabaseHas('customer_addresses', [
            'customer_id' => $this->customer->id,
            'address_type' => 'home',
            'house_no' => '45B',
        ]);
    }

    public function test_can_show_customer_address(): void
    {
        $address = $this->createAddress();

        $response = $this->actingAs($this->admin, 'admin')
            ->getJson("/api/v1/admin/customer-addresses/{$address->uuid}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Customer address retrieved successfully',
            ]);
    }

    public function test_can_update_customer_address(): void
    {
        $address = $this->createAddress();

        $data = [
            'house_no' => '99Z',
            'contact_person' => 'Updated Person',
        ];

        $response = $this->actingAs($this->admin, 'admin')
            ->putJson("/api/v1/admin/customer-addresses/{$address->uuid}", $data);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Customer address updated successfully',
            ]);
    }

    public function test_can_delete_customer_address(): void
    {
        $address = $this->createAddress();

        $response = $this->actingAs($this->admin, 'admin')
            ->deleteJson("/api/v1/admin/customer-addresses/{$address->uuid}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Customer address deleted successfully',
            ]);

        $this->assertSoftDeleted('customer_addresses', ['id' => $address->id]);
    }

    public function test_can_restore_customer_address(): void
    {
        $address = $this->createAddress();
        $address->delete();

        $response = $this->actingAs($this->admin, 'admin')
            ->postJson("/api/v1/admin/customer-addresses/{$address->uuid}/restore");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Customer address restored successfully',
            ]);

        $this->assertDatabaseHas('customer_addresses', ['id' => $address->id, 'deleted_at' => null]);
    }

    public function test_can_force_delete_customer_address(): void
    {
        $address = $this->createAddress();
        $addressId = $address->id;
        $address->delete();

        $response = $this->actingAs($this->admin, 'admin')
            ->deleteJson("/api/v1/admin/customer-addresses/{$address->uuid}/force-delete");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Customer address permanently deleted',
            ]);

        $this->assertDatabaseMissing('customer_addresses', ['id' => $addressId]);
    }

    public function test_can_set_default_address(): void
    {
        $address1 = $this->createAddress(['is_default' => false]);
        $address2 = $this->createAddress(['is_default' => true]);

        $response = $this->actingAs($this->admin, 'admin')
            ->patchJson("/api/v1/admin/customer-addresses/{$address1->uuid}/default");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Default address updated successfully',
            ]);

        $this->assertDatabaseHas('customer_addresses', ['id' => $address1->id, 'is_default' => true]);
        $this->assertDatabaseHas('customer_addresses', ['id' => $address2->id, 'is_default' => false]);
    }

    public function test_can_verify_address(): void
    {
        $address = $this->createAddress(['is_verified' => false]);

        $response = $this->actingAs($this->admin, 'admin')
            ->patchJson("/api/v1/admin/customer-addresses/{$address->uuid}/verify");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Customer address verified successfully',
            ]);

        $this->assertDatabaseHas('customer_addresses', ['id' => $address->id, 'is_verified' => true]);
    }

    public function test_can_set_status(): void
    {
        $address = $this->createAddress(['status' => 'active']);

        $response = $this->actingAs($this->admin, 'admin')
            ->patchJson("/api/v1/admin/customer-addresses/{$address->uuid}/status", ['status' => 'inactive']);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Customer address status updated successfully',
            ]);

        $this->assertDatabaseHas('customer_addresses', ['id' => $address->id, 'status' => 'inactive']);
    }

    public function test_can_bulk_delete(): void
    {
        $addr1 = $this->createAddress();
        $addr2 = $this->createAddress();

        $response = $this->actingAs($this->admin, 'admin')
            ->postJson('/api/v1/admin/customer-addresses/bulk-delete', [
                'ids' => [$addr1->id, $addr2->id],
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_can_bulk_set_status(): void
    {
        $addr1 = $this->createAddress(['status' => 'active']);
        $addr2 = $this->createAddress(['status' => 'active']);

        $response = $this->actingAs($this->admin, 'admin')
            ->postJson('/api/v1/admin/customer-addresses/bulk-set-status', [
                'ids' => [$addr1->id, $addr2->id],
                'status' => 'inactive',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_can_search_addresses(): void
    {
        $this->createAddress(['contact_person' => 'Rahul Sharma']);

        $response = $this->actingAs($this->admin, 'admin')
            ->getJson('/api/v1/admin/customer-addresses/search?q=Rahul');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_can_get_stats(): void
    {
        $this->createAddress(['status' => 'active', 'is_verified' => true]);
        $this->createAddress(['status' => 'inactive']);

        $response = $this->actingAs($this->admin, 'admin')
            ->getJson('/api/v1/admin/customer-addresses/stats');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Customer address statistics retrieved successfully',
            ]);
    }

    public function test_can_check_service_availability(): void
    {
        $response = $this->actingAs($this->admin, 'admin')
            ->postJson('/api/v1/admin/customer-addresses/check-service', [
                'delivery_zone_id' => $this->zone->id,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Service availability checked',
            ])
            ->assertJsonPath('data.service_available', true);
    }

    public function test_service_unavailable_returns_false(): void
    {
        $anotherCity = City::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'name' => 'Coimbatore',
            'city_code' => 'CBE',
            'status' => 'active',
        ]);

        $response = $this->actingAs($this->admin, 'admin')
            ->postJson('/api/v1/admin/customer-addresses/check-service', [
                'city_id' => $anotherCity->id,
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.service_available', false);
    }

    public function test_can_export(): void
    {
        $this->createAddress();

        $response = $this->actingAs($this->admin, 'admin')
            ->getJson('/api/v1/admin/customer-addresses/export');

        $response->assertStatus(200)
            ->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
    }

    public function test_store_requires_customer_id(): void
    {
        $response = $this->actingAs($this->admin, 'admin')
            ->postJson('/api/v1/admin/customer-addresses', [
                'address_type' => 'home',
                'status' => 'active',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['customer_id']);
    }

    public function test_store_requires_address_type(): void
    {
        $response = $this->actingAs($this->admin, 'admin')
            ->postJson('/api/v1/admin/customer-addresses', [
                'customer_id' => $this->customer->id,
                'status' => 'active',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['address_type']);
    }

    public function test_store_validates_address_type_enum(): void
    {
        $response = $this->actingAs($this->admin, 'admin')
            ->postJson('/api/v1/admin/customer-addresses', [
                'customer_id' => $this->customer->id,
                'address_type' => 'invalid_type',
                'status' => 'active',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['address_type']);
    }

    public function test_unauthenticated_cannot_access(): void
    {
        $response = $this->getJson('/api/v1/admin/customer-addresses');

        $response->assertStatus(401);
    }
}
