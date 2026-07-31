<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Kitchen;
use App\Models\Master\Country;
use App\Models\Master\State;
use App\Models\Master\City;
use App\Enums\StatusEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KitchenTest extends TestCase
{
    use RefreshDatabase;

    protected function createKitchen(array $overrides = []): Kitchen
    {
        return Kitchen::create(array_merge([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'kitchen_code' => 'KIT-' . strtoupper(\Illuminate\Support\Str::random(4)),
            'name' => 'Test Kitchen ' . uniqid(),
            'description' => 'Test kitchen description',
            'kitchen_type' => 'main_kitchen',
            'manager_name' => 'Test Manager',
            'manager_mobile' => '9876543210',
            'manager_email' => 'manager@test.local',
            'address_line_1' => '123 Test Street',
            'latitude' => 13.0827,
            'longitude' => 80.2707,
            'opening_time' => '06:00',
            'closing_time' => '22:00',
            'preparation_start_time' => '05:00',
            'daily_capacity' => 500,
            'maximum_orders' => 200,
            'status' => 'active',
            'is_default' => false,
        ], $overrides));
    }

    public function test_can_create_kitchen(): void
    {
        $kitchen = $this->createKitchen();

        $this->assertNotNull($kitchen->id);
        $this->assertNotNull($kitchen->uuid);
        $this->assertEquals('main_kitchen', $kitchen->kitchen_type);
    }

    public function test_kitchen_has_uuid(): void
    {
        $kitchen = $this->createKitchen();

        $this->assertNotEmpty($kitchen->uuid);
        $this->assertMatchesRegularExpression('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $kitchen->uuid);
    }

    public function test_kitchen_uses_uuid_as_route_key(): void
    {
        $kitchen = $this->createKitchen();

        $this->assertEquals('uuid', $kitchen->getRouteKeyName());
    }

    public function test_kitchen_belongs_to_country(): void
    {
        $country = Country::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'iso2' => 'IN',
            'iso3' => 'IND',
            'name' => 'India',
            'status' => 'active',
        ]);

        $kitchen = $this->createKitchen(['country_id' => $country->id]);

        $this->assertNotNull($kitchen->country);
        $this->assertEquals($country->id, $kitchen->country->id);
    }

    public function test_kitchen_belongs_to_state(): void
    {
        $country = Country::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'iso2' => 'IN',
            'iso3' => 'IND',
            'name' => 'India',
            'status' => 'active',
        ]);

        $state = State::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'country_id' => $country->id,
            'name' => 'Tamil Nadu',
            'state_code' => 'TN',
            'status' => 'active',
        ]);

        $kitchen = $this->createKitchen(['state_id' => $state->id]);

        $this->assertNotNull($kitchen->state);
        $this->assertEquals($state->id, $kitchen->state->id);
    }

    public function test_kitchen_belongs_to_city(): void
    {
        $country = Country::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'iso2' => 'IN',
            'iso3' => 'IND',
            'name' => 'India',
            'status' => 'active',
        ]);

        $state = State::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'country_id' => $country->id,
            'name' => 'Tamil Nadu',
            'state_code' => 'TN',
            'status' => 'active',
        ]);

        $city = City::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'country_id' => $country->id,
            'state_id' => $state->id,
            'name' => 'Chennai',
            'city_code' => 'CHN',
            'status' => 'active',
        ]);

        $kitchen = $this->createKitchen(['city_id' => $city->id]);

        $this->assertNotNull($kitchen->city);
        $this->assertEquals($city->id, $kitchen->city->id);
    }

    public function test_kitchen_scope_active(): void
    {
        $this->createKitchen(['status' => 'active']);
        $this->createKitchen(['status' => 'inactive']);

        $active = Kitchen::active()->get();

        $this->assertCount(1, $active);
        $this->assertEquals('active', $active->first()->status->value);
    }

    public function test_kitchen_scope_default(): void
    {
        $this->createKitchen(['is_default' => true]);
        $this->createKitchen(['is_default' => false]);

        $defaults = Kitchen::default()->get();

        $this->assertCount(1, $defaults);
        $this->assertTrue($defaults->first()->is_default);
    }

    public function test_kitchen_scope_search(): void
    {
        $this->createKitchen(['name' => 'Sunrise Kitchen', 'kitchen_code' => 'KIT-001']);
        $this->createKitchen(['name' => 'Moon Kitchen', 'kitchen_code' => 'KIT-002']);

        $results = Kitchen::search('Sunrise')->get();

        $this->assertCount(1, $results);
        $this->assertEquals('Sunrise Kitchen', $results->first()->name);
    }

    public function test_kitchen_soft_deletes(): void
    {
        $kitchen = $this->createKitchen();
        $kitchenId = $kitchen->id;

        $kitchen->delete();

        $this->assertSoftDeleted('kitchens', ['id' => $kitchenId]);
        $this->assertNotNull(Kitchen::withTrashed()->find($kitchenId));
    }

    public function test_kitchen_restore(): void
    {
        $kitchen = $this->createKitchen();
        $kitchen->delete();
        $kitchen->restore();

        $this->assertNull($kitchen->fresh()->deleted_at);
    }

    public function test_kitchen_force_delete(): void
    {
        $kitchen = $this->createKitchen();
        $kitchenId = $kitchen->id;
        $kitchen->forceDelete();

        $this->assertNull(Kitchen::withTrashed()->find($kitchenId));
    }

    public function test_kitchen_kitchen_types(): void
    {
        $types = ['main_kitchen', 'central_kitchen', 'cloud_kitchen', 'branch_kitchen', 'future_kitchen'];

        foreach ($types as $type) {
            $kitchen = $this->createKitchen(['kitchen_type' => $type]);
            $this->assertEquals($type, $kitchen->kitchen_type);
        }
    }

    public function test_kitchen_is_default_cast_to_boolean(): void
    {
        $kitchen = $this->createKitchen(['is_default' => true]);

        $this->assertIsBool($kitchen->is_default);
        $this->assertTrue($kitchen->is_default);
    }

    public function test_kitchen_status_uses_enum(): void
    {
        $kitchen = $this->createKitchen(['status' => 'active']);

        $this->assertInstanceOf(StatusEnum::class, $kitchen->status);
    }

    public function test_kitchen_type_label_accessor(): void
    {
        $kitchen = $this->createKitchen(['kitchen_type' => 'cloud_kitchen']);

        $this->assertEquals('Cloud kitchen', $kitchen->kitchen_type_label);
    }

    public function test_kitchen_full_address_accessor(): void
    {
        $kitchen = $this->createKitchen([
            'address_line_1' => '123 Test Street',
            'address_line_2' => 'Velachery',
            'landmark' => 'Near Mall',
        ]);

        $this->assertStringContainsString('123 Test Street', $kitchen->full_address);
        $this->assertStringContainsString('Velachery', $kitchen->full_address);
        $this->assertStringContainsString('Near Mall', $kitchen->full_address);
    }

    public function test_kitchen_has_timestamps(): void
    {
        $kitchen = $this->createKitchen();

        $this->assertNotNull($kitchen->created_at);
        $this->assertNotNull($kitchen->updated_at);
    }

    public function test_kitchen_fillable_fields(): void
    {
        $kitchen = $this->createKitchen();

        $fillable = $kitchen->getFillable();

        $this->assertContains('kitchen_code', $fillable);
        $this->assertContains('name', $fillable);
        $this->assertContains('kitchen_type', $fillable);
        $this->assertContains('status', $fillable);
        $this->assertContains('is_default', $fillable);
    }

    public function test_multiple_kitchens_can_be_created(): void
    {
        $k1 = $this->createKitchen(['kitchen_code' => 'KIT-001']);
        $k2 = $this->createKitchen(['kitchen_code' => 'KIT-002']);
        $k3 = $this->createKitchen(['kitchen_code' => 'KIT-003']);

        $this->assertEquals(3, Kitchen::count());
        $this->assertNotEquals($k1->id, $k2->id);
        $this->assertNotEquals($k2->id, $k3->id);
    }
}
