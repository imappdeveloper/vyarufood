<?php

declare(strict_types=1);

namespace Tests\Feature\DeliveryZone;

use App\Models\Auth\Admin;
use App\Models\Master\Country;
use App\Models\Master\State;
use App\Models\Master\City;
use App\Models\Master\DeliveryZone;
use App\Models\Master\DeliverySlot;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class DeliverySlotApiTest extends TestCase
{
    use RefreshDatabase;

    protected Admin $admin;
    protected Country $country;
    protected State $state;
    protected City $city;
    protected DeliveryZone $deliveryZone;

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

        $this->deliveryZone = DeliveryZone::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'city_id' => $this->city->id,
            'zone_name' => 'Zone A',
            'zone_code' => 'ZA-001',
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
        ]);

        Auth::guard('admin')->login($this->admin);
    }

    private function createDeliverySlot(array $overrides = []): DeliverySlot
    {
        return DeliverySlot::create(array_merge([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'delivery_zone_id' => $this->deliveryZone->id,
            'slot_name' => 'Morning Slot',
            'start_time' => '08:00',
            'end_time' => '10:00',
            'maximum_orders' => 50,
            'cutoff_time' => '07:00',
            'status' => 'active',
        ], $overrides));
    }

    private function baseUrl(): string
    {
        return "/api/v1/admin/delivery-zones/{$this->deliveryZone->uuid}/slots";
    }

    public function test_can_list_delivery_slots(): void
    {
        $this->createDeliverySlot(['slot_name' => 'Morning Slot']);
        $this->createDeliverySlot(['slot_name' => 'Evening Slot']);

        $response = $this->getJson($this->baseUrl());
        $response->assertOk()->assertJsonStructure(['success', 'data', 'meta']);
    }

    public function test_can_create_delivery_slot(): void
    {
        $response = $this->postJson($this->baseUrl(), [
            'delivery_zone_id' => $this->deliveryZone->id,
            'slot_name' => 'Afternoon Slot',
            'start_time' => '12:00',
            'end_time' => '14:00',
            'maximum_orders' => 30,
            'cutoff_time' => '11:30',
            'status' => 'active',
        ]);

        $response->assertCreated()->assertJsonStructure(['success', 'data' => ['uuid', 'slot_name']]);
        $this->assertDatabaseHas('delivery_slots', ['slot_name' => 'Afternoon Slot']);
    }

    public function test_can_show_delivery_slot(): void
    {
        $slot = $this->createDeliverySlot(['slot_name' => 'Morning Slot']);

        $response = $this->getJson("{$this->baseUrl()}/{$slot->uuid}");
        \Log::info('DEBUG SHOW', ['url' => "{$this->baseUrl()}/{$slot->uuid}", 'status' => $response->status(), 'content' => $response->content(), 'slot_id' => $slot->id, 'slot_uuid' => $slot->uuid, 'zone_id' => $this->deliveryZone->id]);
        $response->assertOk()->assertJsonPath('data.slot_name', 'Morning Slot');
    }

    public function test_can_update_delivery_slot(): void
    {
        $slot = $this->createDeliverySlot(['slot_name' => 'Morning Slot']);

        $response = $this->putJson("{$this->baseUrl()}/{$slot->uuid}", [
            'slot_name' => 'Updated Morning Slot',
            'end_time' => '11:00',
        ]);

        $response->assertOk()->assertJsonPath('data.slot_name', 'Updated Morning Slot');
    }

    public function test_can_delete_delivery_slot(): void
    {
        $slot = $this->createDeliverySlot();

        $response = $this->deleteJson("{$this->baseUrl()}/{$slot->uuid}");
        $response->assertOk();
        $this->assertSoftDeleted('delivery_slots', ['id' => $slot->id]);
    }

    public function test_can_restore_delivery_slot(): void
    {
        $slot = $this->createDeliverySlot();
        $slot->delete();

        $response = $this->postJson("{$this->baseUrl()}/{$slot->uuid}/restore");
        $response->assertOk();
        $this->assertDatabaseHas('delivery_slots', ['id' => $slot->id, 'deleted_at' => null]);
    }

    public function test_can_force_delete_delivery_slot(): void
    {
        $slot = $this->createDeliverySlot();
        $slot->delete();

        $response = $this->deleteJson("{$this->baseUrl()}/{$slot->uuid}/force-delete");
        $response->assertOk();
        $this->assertDatabaseMissing('delivery_slots', ['id' => $slot->id]);
    }

    public function test_can_get_available_slots(): void
    {
        $this->createDeliverySlot(['slot_name' => 'Morning Slot', 'status' => 'active']);
        $this->createDeliverySlot(['slot_name' => 'Evening Slot', 'status' => 'active']);

        $response = $this->getJson("{$this->baseUrl()}/available");
        $response->assertOk()->assertJsonStructure(['success', 'data']);
    }

    public function test_cannot_create_slot_with_invalid_data(): void
    {
        $response = $this->postJson($this->baseUrl(), []);
        $response->assertUnprocessable()->assertJsonValidationErrors([
            'slot_name', 'start_time', 'end_time', 'status',
        ]);
    }

    public function test_unauthenticated_user_cannot_access(): void
    {
        Auth::guard('admin')->logout();

        $response = $this->getJson($this->baseUrl());
        $response->assertUnauthorized();
    }
}
