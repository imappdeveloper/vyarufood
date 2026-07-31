<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Customer;
use App\Models\CustomerAddress;
use App\Models\Master\Country;
use App\Models\Master\State;
use App\Models\Master\City;
use App\Models\Master\Area;
use App\Models\Master\DeliveryZone;
use App\Models\Master\Pincode;
use App\Enums\StatusEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerAddressTest extends TestCase
{
    use RefreshDatabase;

    protected function createAddress(array $overrides = []): CustomerAddress
    {
        $customer = Customer::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'first_name' => 'Test',
            'last_name' => 'Customer',
            'email' => 'test' . uniqid() . '@example.com',
            'phone' => '9' . mt_rand(100000000, 999999999),
            'country_code' => '+91',
            'status' => 'active',
            'referral_code' => strtoupper(\Illuminate\Support\Str::random(8)),
        ]);

        return CustomerAddress::create(array_merge([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'customer_id' => $customer->id,
            'address_type' => 'home',
            'address_line_1' => '123 Test Street',
            'latitude' => 13.0827,
            'longitude' => 80.2707,
            'status' => 'active',
            'is_default' => false,
            'is_verified' => false,
        ], $overrides));
    }

    public function test_can_create_customer_address(): void
    {
        $address = $this->createAddress();

        $this->assertNotNull($address->id);
        $this->assertNotNull($address->uuid);
        $this->assertEquals('home', $address->address_type);
    }

    public function test_address_has_uuid(): void
    {
        $address = $this->createAddress();

        $this->assertNotNull($address->uuid);
        $this->assertIsString($address->uuid);
    }

    public function test_address_route_key_is_uuid(): void
    {
        $address = $this->createAddress();

        $this->assertEquals('uuid', $address->getRouteKeyName());
    }

    public function test_address_belongs_to_customer(): void
    {
        $address = $this->createAddress();

        $this->assertNotNull($address->customer);
        $this->assertInstanceOf(Customer::class, $address->customer);
    }

    public function test_address_has_full_address_attribute(): void
    {
        $address = $this->createAddress([
            'address_line_1' => '123 Test Street',
            'address_line_2' => 'Near Park',
            'landmark' => 'Opposite Temple',
        ]);

        $fullAddress = $address->full_address;

        $this->assertIsString($fullAddress);
        $this->assertStringContainsString('123 Test Street', $fullAddress);
    }

    public function test_address_has_address_label_attribute(): void
    {
        $address = $this->createAddress(['address_type' => 'office']);

        $this->assertEquals('Office', $address->address_label);
    }

    public function test_address_status_casts_to_enum(): void
    {
        $address = $this->createAddress(['status' => 'active']);

        $this->assertInstanceOf(StatusEnum::class, $address->status);
        $this->assertEquals(StatusEnum::Active, $address->status);
    }

    public function test_address_latitude_longitude_cast_to_float(): void
    {
        $address = $this->createAddress([
            'latitude' => 13.0827,
            'longitude' => 80.2707,
        ]);

        $this->assertIsFloat($address->latitude);
        $this->assertIsFloat($address->longitude);
        $this->assertEquals(13.0827, $address->latitude);
    }

    public function test_address_is_default_casts_to_boolean(): void
    {
        $address = $this->createAddress(['is_default' => true]);

        $this->assertIsBool($address->is_default);
        $this->assertTrue($address->is_default);
    }

    public function test_address_is_verified_casts_to_boolean(): void
    {
        $address = $this->createAddress(['is_verified' => true]);

        $this->assertIsBool($address->is_verified);
        $this->assertTrue($address->is_verified);
    }

    public function test_address_scope_active(): void
    {
        $this->createAddress(['status' => 'active']);
        $this->createAddress(['status' => 'inactive']);

        $active = CustomerAddress::active()->count();

        $this->assertEquals(1, $active);
    }

    public function test_address_scope_default(): void
    {
        $this->createAddress(['is_default' => true]);
        $this->createAddress(['is_default' => false]);

        $defaults = CustomerAddress::default()->count();

        $this->assertEquals(1, $defaults);
    }

    public function test_address_scope_for_customer(): void
    {
        $customer = Customer::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'first_name' => 'Scope',
            'last_name' => 'Test',
            'email' => 'scope' . uniqid() . '@example.com',
            'phone' => '9' . mt_rand(100000000, 999999999),
            'status' => 'active',
            'referral_code' => strtoupper(\Illuminate\Support\Str::random(8)),
        ]);

        $this->createAddress(['customer_id' => $customer->id]);
        $this->createAddress(['customer_id' => $customer->id]);
        $this->createAddress();

        $count = CustomerAddress::forCustomer($customer->id)->count();

        $this->assertEquals(2, $count);
    }

    public function test_address_soft_deletes(): void
    {
        $address = $this->createAddress();
        $addressId = $address->id;

        $address->delete();

        $this->assertNull(CustomerAddress::find($addressId));
        $this->assertNotNull(CustomerAddress::withTrashed()->find($addressId));
    }

    public function test_address_can_restore(): void
    {
        $address = $this->createAddress();
        $addressId = $address->id;
        $address->delete();

        CustomerAddress::withTrashed()->find($addressId)->restore();

        $this->assertNotNull(CustomerAddress::find($addressId));
    }

    public function test_address_force_deletes_permanently(): void
    {
        $address = $this->createAddress();
        $addressId = $address->id;
        $address->forceDelete();

        $this->assertNull(CustomerAddress::withTrashed()->find($addressId));
    }

    public function test_address_can_set_default(): void
    {
        $address = $this->createAddress(['is_default' => false]);

        $address->setIsDefault();

        $this->assertTrue($address->fresh()->is_default);
    }

    public function test_address_can_unset_default(): void
    {
        $address = $this->createAddress(['is_default' => true]);

        $address->unsetDefault();

        $this->assertFalse($address->fresh()->is_default);
    }

    public function test_address_has_multiple_address_types(): void
    {
        $types = ['home', 'office', 'hostel', 'apartment', 'pg', 'other'];

        foreach ($types as $type) {
            $address = $this->createAddress(['address_type' => $type]);
            $this->assertEquals($type, $address->address_type);
        }
    }

    public function test_address_with_full_fields(): void
    {
        $address = $this->createAddress([
            'house_no' => '12A',
            'building_name' => 'Sunshine Towers',
            'floor' => '3rd Floor',
            'street' => 'Main Road',
            'landmark' => 'Near Temple',
            'address_line_1' => '12A Main Road',
            'address_line_2' => 'Velachery',
            'contact_person' => 'Rahul Sharma',
            'contact_mobile' => '9876543210',
            'delivery_instruction' => 'Ring the bell',
        ]);

        $this->assertEquals('12A', $address->house_no);
        $this->assertEquals('Sunshine Towers', $address->building_name);
        $this->assertEquals('3rd Floor', $address->floor);
        $this->assertEquals('Main Road', $address->street);
        $this->assertEquals('Near Temple', $address->landmark);
        $this->assertEquals('Rahul Sharma', $address->contact_person);
        $this->assertEquals('9876543210', $address->contact_mobile);
        $this->assertEquals('Ring the bell', $address->delivery_instruction);
    }

    public function test_address_with_google_place_id(): void
    {
        $address = $this->createAddress([
            'google_place_id' => 'ChIJ1x7z8cCBhzsRyGJpN2dJABk',
        ]);

        $this->assertEquals('ChIJ1x7z8cCBhzsRyGJpN2dJABk', $address->google_place_id);
    }

    public function test_address_relationships(): void
    {
        $address = $this->createAddress();

        $this->assertNotNull($address->customer);

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

        $address->update([
            'country_id' => $country->id,
            'state_id' => $state->id,
            'city_id' => $city->id,
        ]);

        $address->refresh();

        $this->assertNotNull($address->country);
        $this->assertNotNull($address->state);
        $this->assertNotNull($address->city);
        $this->assertEquals('India', $address->country->name);
        $this->assertEquals('Tamil Nadu', $address->state->name);
        $this->assertEquals('Chennai', $address->city->name);
    }
}
