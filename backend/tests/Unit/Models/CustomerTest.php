<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Customer;
use App\Models\Master\Country;
use App\Models\Master\State;
use App\Models\Master\City;
use App\Models\Master\Area;
use App\Enums\StatusEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerTest extends TestCase
{
    use RefreshDatabase;

    protected function createCustomer(array $overrides = []): Customer
    {
        return Customer::create(array_merge([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'first_name' => 'Rahul',
            'last_name' => 'Sharma',
            'email' => 'rahul@example.com',
            'phone' => '9876543210',
            'country_code' => '+91',
            'status' => 'active',
            'referral_code' => strtoupper(\Illuminate\Support\Str::random(8)),
        ], $overrides));
    }

    public function test_can_create_customer(): void
    {
        $customer = $this->createCustomer();

        $this->assertNotNull($customer->id);
        $this->assertNotNull($customer->uuid);
        $this->assertEquals('Rahul', $customer->first_name);
    }

    public function test_customer_has_uuid(): void
    {
        $customer = $this->createCustomer();

        $this->assertNotNull($customer->uuid);
        $this->assertIsString($customer->uuid);
    }

    public function test_customer_route_key_is_uuid(): void
    {
        $customer = $this->createCustomer();

        $this->assertEquals('uuid', $customer->getRouteKeyName());
    }

    public function test_customer_has_full_name_attribute(): void
    {
        $customer = $this->createCustomer();

        $this->assertEquals('Rahul Sharma', $customer->full_name);
    }

    public function test_customer_status_casts_to_enum(): void
    {
        $customer = $this->createCustomer(['status' => 'active']);

        $this->assertInstanceOf(StatusEnum::class, $customer->status);
        $this->assertEquals(StatusEnum::Active, $customer->status);
    }

    public function test_customer_is_active(): void
    {
        $customer = $this->createCustomer(['status' => 'active']);

        $this->assertTrue($customer->isActive());
    }

    public function test_customer_is_not_active_when_inactive(): void
    {
        $customer = $this->createCustomer(['status' => 'inactive']);

        $this->assertFalse($customer->isActive());
    }

    public function test_customer_is_blocked(): void
    {
        $customer = $this->createCustomer(['is_blocked' => true]);

        $this->assertTrue($customer->isBlocked());
    }

    public function test_customer_is_not_blocked_by_default(): void
    {
        $customer = $this->createCustomer();

        $this->assertFalse($customer->isBlocked());
    }

    public function test_customer_has_verified_email(): void
    {
        $customer = $this->createCustomer(['email_verified' => true]);

        $this->assertTrue($customer->hasVerifiedEmail());
    }

    public function test_customer_email_not_verified_by_default(): void
    {
        $customer = $this->createCustomer();

        $this->assertFalse($customer->hasVerifiedEmail());
    }

    public function test_customer_has_verified_phone(): void
    {
        $customer = $this->createCustomer(['phone_verified' => true]);

        $this->assertTrue($customer->hasVerifiedPhone());
    }

    public function test_customer_phone_not_verified_by_default(): void
    {
        $customer = $this->createCustomer();

        $this->assertFalse($customer->hasVerifiedPhone());
    }

    public function test_customer_wallet_balance_starts_at_zero(): void
    {
        $customer = $this->createCustomer();

        $this->assertEquals(0, $customer->wallet_balance);
    }

    public function test_customer_can_add_to_wallet(): void
    {
        $customer = $this->createCustomer();
        $newBalance = $customer->addToWallet(500.0);

        $this->assertEquals(500.0, $newBalance);
        $this->assertEquals(500.0, $customer->fresh()->wallet_balance);
    }

    public function test_customer_can_deduct_from_wallet(): void
    {
        $customer = $this->createCustomer(['wallet_balance' => 1000]);
        $newBalance = $customer->deductFromWallet(300.0);

        $this->assertEquals(700.0, $newBalance);
        $this->assertEquals(700.0, $customer->fresh()->wallet_balance);
    }

    public function test_customer_cannot_deduct_more_than_balance(): void
    {
        $customer = $this->createCustomer(['wallet_balance' => 100]);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Insufficient wallet balance');

        $customer->deductFromWallet(200.0);
    }

    public function test_customer_can_block(): void
    {
        $customer = $this->createCustomer();
        $customer->block('Violation');

        $this->assertTrue($customer->fresh()->is_blocked);
        $this->assertEquals('Violation', $customer->fresh()->block_reason);
        $this->assertEquals(StatusEnum::Suspended, $customer->fresh()->status);
    }

    public function test_customer_can_unblock(): void
    {
        $customer = $this->createCustomer([
            'is_blocked' => true,
            'block_reason' => 'Violation',
            'status' => 'suspended',
        ]);
        $customer->unblock();

        $this->assertFalse($customer->fresh()->is_blocked);
        $this->assertNull($customer->fresh()->block_reason);
        $this->assertEquals(StatusEnum::Active, $customer->fresh()->status);
    }

    public function test_customer_country_relationship(): void
    {
        $country = Country::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'iso2' => 'IN',
            'iso3' => 'IND',
            'name' => 'India',
            'status' => 'active',
        ]);

        $customer = $this->createCustomer(['country_id' => $country->id]);

        $this->assertNotNull($customer->country);
        $this->assertEquals($country->id, $customer->country->id);
    }

    public function test_customer_state_relationship(): void
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
            'name' => 'Maharashtra',
            'state_code' => 'MH',
            'status' => 'active',
        ]);

        $customer = $this->createCustomer(['state_id' => $state->id]);

        $this->assertNotNull($customer->state);
        $this->assertEquals($state->id, $customer->state->id);
    }

    public function test_customer_city_relationship(): void
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
            'name' => 'Maharashtra',
            'state_code' => 'MH',
            'status' => 'active',
        ]);

        $city = City::create([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'country_id' => $country->id,
            'state_id' => $state->id,
            'name' => 'Mumbai',
            'city_code' => 'MUM',
            'status' => 'active',
        ]);

        $customer = $this->createCustomer(['city_id' => $city->id]);

        $this->assertNotNull($customer->city);
        $this->assertEquals($city->id, $customer->city->id);
    }

    public function test_customer_soft_deletes(): void
    {
        $customer = $this->createCustomer();
        $customerId = $customer->id;

        $customer->delete();

        $this->assertSoftDeleted('customers', ['id' => $customerId]);
        $this->assertNotNull(Customer::withTrashed()->find($customerId));
    }

    public function test_customer_can_restore(): void
    {
        $customer = $this->createCustomer();
        $customer->delete();
        $customer->restore();

        $this->assertDatabaseHas('customers', ['id' => $customer->id, 'deleted_at' => null]);
    }

    public function test_customer_search_scope(): void
    {
        $this->createCustomer(['first_name' => 'Rahul', 'email' => 'rahul@example.com', 'phone' => '9876543210']);
        $this->createCustomer(['first_name' => 'Priya', 'email' => 'priya@example.com', 'phone' => '9876543211']);

        $results = Customer::search('Rahul')->get();

        $this->assertCount(1, $results);
        $this->assertEquals('Rahul', $results->first()->first_name);
    }

    public function test_customer_active_scope(): void
    {
        $this->createCustomer(['status' => 'active', 'is_blocked' => false]);
        $this->createCustomer(['email' => 'inactive@example.com', 'phone' => '9876543211', 'status' => 'inactive', 'is_blocked' => false]);

        $results = Customer::active()->get();

        $this->assertCount(1, $results);
    }

    public function test_customer_unblocked_scope(): void
    {
        $this->createCustomer(['is_blocked' => false]);
        $this->createCustomer(['email' => 'blocked@example.com', 'phone' => '9876543211', 'is_blocked' => true]);

        $results = Customer::unblocked()->get();

        $this->assertCount(1, $results);
    }

    public function test_customer_fillable_fields(): void
    {
        $customer = new Customer();

        $expected = [
            'uuid', 'first_name', 'last_name', 'email', 'phone', 'country_code',
            'password', 'profile_photo', 'gender', 'date_of_birth',
            'address_line_1', 'address_line_2', 'country_id', 'state_id', 'city_id',
            'area_id', 'pincode', 'latitude', 'longitude',
            'status', 'is_blocked', 'block_reason',
            'wallet_balance', 'wallet_currency', 'referral_code', 'referred_by',
            'email_verified', 'phone_verified',
            'last_login_at', 'last_login_ip', 'last_login_device', 'last_login_browser',
            'created_by', 'updated_by', 'deleted_by',
        ];

        $this->assertEquals($expected, $customer->getFillable());
    }

    public function test_customer_hides_password(): void
    {
        $customer = $this->createCustomer(['password' => bcrypt('secret')]);

        $toArray = $customer->toArray();
        $this->assertArrayNotHasKey('password', $toArray);
    }
}
