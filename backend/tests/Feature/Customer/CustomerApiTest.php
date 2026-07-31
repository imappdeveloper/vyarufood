<?php

declare(strict_types=1);

namespace Tests\Feature\Customer;

use App\Models\Auth\Admin;
use App\Models\Master\Country;
use App\Models\Master\State;
use App\Models\Master\City;
use App\Models\Master\Area;
use App\Models\Customer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerApiTest extends TestCase
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
            'status' => 'active',
        ]);
    }

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

    public function test_can_list_customers(): void
    {
        $this->createCustomer(['email' => 'test1@example.com', 'phone' => '9876543210']);
        $this->createCustomer(['email' => 'test2@example.com', 'phone' => '9876543211']);

        $response = $this->actingAs($this->admin, 'admin')
            ->getJson('/api/v1/admin/customers');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Customers retrieved successfully',
            ]);
    }

    public function test_can_search_customers(): void
    {
        $this->createCustomer(['first_name' => 'Rahul', 'email' => 'rahul@example.com', 'phone' => '9876543210']);
        $this->createCustomer(['first_name' => 'Priya', 'email' => 'priya@example.com', 'phone' => '9876543211']);

        $response = $this->actingAs($this->admin, 'admin')
            ->getJson('/api/v1/admin/customers?search=Rahul');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    public function test_can_create_customer(): void
    {
        $data = [
            'first_name' => 'Rahul',
            'last_name' => 'Sharma',
            'email' => 'rahul@example.com',
            'phone' => '9876543210',
            'country_code' => '+91',
            'gender' => 'male',
            'date_of_birth' => '1995-05-15',
            'address_line_1' => '123 MG Road',
            'city_id' => $this->city->id,
            'pincode' => '400001',
            'status' => 'active',
        ];

        $response = $this->actingAs($this->admin, 'admin')
            ->postJson('/api/v1/admin/customers', $data);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Customer created successfully',
            ]);

        $this->assertDatabaseHas('customers', ['email' => 'rahul@example.com']);
    }

    public function test_cannot_create_customer_without_required_fields(): void
    {
        $response = $this->actingAs($this->admin, 'admin')
            ->postJson('/api/v1/admin/customers', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['first_name', 'last_name', 'email', 'phone', 'status']);
    }

    public function test_cannot_create_customer_with_duplicate_email(): void
    {
        $this->createCustomer(['email' => 'rahul@example.com']);

        $response = $this->actingAs($this->admin, 'admin')
            ->postJson('/api/v1/admin/customers', [
                'first_name' => 'Test',
                'last_name' => 'User',
                'email' => 'rahul@example.com',
                'phone' => '9876543211',
                'status' => 'active',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_cannot_create_customer_with_duplicate_phone(): void
    {
        $this->createCustomer(['phone' => '9876543210']);

        $response = $this->actingAs($this->admin, 'admin')
            ->postJson('/api/v1/admin/customers', [
                'first_name' => 'Test',
                'last_name' => 'User',
                'email' => 'other@example.com',
                'phone' => '9876543210',
                'status' => 'active',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['phone']);
    }

    public function test_can_show_customer(): void
    {
        $customer = $this->createCustomer();

        $response = $this->actingAs($this->admin, 'admin')
            ->getJson("/api/v1/admin/customers/{$customer->uuid}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'uuid' => $customer->uuid,
                    'first_name' => 'Rahul',
                    'last_name' => 'Sharma',
                    'email' => 'rahul@example.com',
                ],
            ]);
    }

    public function test_can_update_customer(): void
    {
        $customer = $this->createCustomer();

        $response = $this->actingAs($this->admin, 'admin')
            ->putJson("/api/v1/admin/customers/{$customer->uuid}", [
                'first_name' => 'Rahul Updated',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Customer updated successfully',
            ]);

        $this->assertDatabaseHas('customers', ['id' => $customer->id, 'first_name' => 'Rahul Updated']);
    }

    public function test_can_delete_customer(): void
    {
        $customer = $this->createCustomer();

        $response = $this->actingAs($this->admin, 'admin')
            ->deleteJson("/api/v1/admin/customers/{$customer->uuid}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Customer deleted successfully',
            ]);

        $this->assertSoftDeleted('customers', ['id' => $customer->id]);
    }

    public function test_can_restore_customer(): void
    {
        $customer = $this->createCustomer();
        $customer->delete();

        $response = $this->actingAs($this->admin, 'admin')
            ->postJson("/api/v1/admin/customers/{$customer->uuid}/restore");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Customer restored successfully',
            ]);

        $this->assertDatabaseHas('customers', ['id' => $customer->id, 'deleted_at' => null]);
    }

    public function test_can_force_delete_customer(): void
    {
        $customer = $this->createCustomer();
        $customer->delete();

        $response = $this->actingAs($this->admin, 'admin')
            ->deleteJson("/api/v1/admin/customers/{$customer->uuid}/force-delete");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Customer permanently deleted',
            ]);

        $this->assertDatabaseMissing('customers', ['id' => $customer->id]);
    }

    public function test_can_set_customer_status(): void
    {
        $customer = $this->createCustomer();

        $response = $this->actingAs($this->admin, 'admin')
            ->patchJson("/api/v1/admin/customers/{$customer->uuid}/status", [
                'status' => 'inactive',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Customer status updated successfully',
            ]);

        $this->assertDatabaseHas('customers', ['id' => $customer->id, 'status' => 'inactive']);
    }

    public function test_can_block_customer(): void
    {
        $customer = $this->createCustomer();

        $response = $this->actingAs($this->admin, 'admin')
            ->postJson("/api/v1/admin/customers/{$customer->uuid}/block", [
                'reason' => 'Spam account',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Customer blocked successfully',
            ]);

        $this->assertDatabaseHas('customers', [
            'id' => $customer->id,
            'is_blocked' => true,
            'block_reason' => 'Spam account',
        ]);
    }

    public function test_can_unblock_customer(): void
    {
        $customer = $this->createCustomer([
            'is_blocked' => true,
            'block_reason' => 'Spam account',
            'status' => 'suspended',
        ]);

        $response = $this->actingAs($this->admin, 'admin')
            ->postJson("/api/v1/admin/customers/{$customer->uuid}/unblock");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Customer unblocked successfully',
            ]);

        $this->assertDatabaseHas('customers', [
            'id' => $customer->id,
            'is_blocked' => false,
            'status' => 'active',
        ]);
    }

    public function test_can_bulk_delete_customers(): void
    {
        $c1 = $this->createCustomer(['email' => 'bulk1@example.com', 'phone' => '9876543210']);
        $c2 = $this->createCustomer(['email' => 'bulk2@example.com', 'phone' => '9876543211']);

        $response = $this->actingAs($this->admin, 'admin')
            ->postJson('/api/v1/admin/customers/bulk-delete', [
                'ids' => [$c1->id, $c2->id],
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => ['deleted' => 2],
            ]);
    }

    public function test_can_bulk_set_status_customers(): void
    {
        $c1 = $this->createCustomer(['email' => 'bulk1@example.com', 'phone' => '9876543210']);
        $c2 = $this->createCustomer(['email' => 'bulk2@example.com', 'phone' => '9876543211']);

        $response = $this->actingAs($this->admin, 'admin')
            ->postJson('/api/v1/admin/customers/bulk-set-status', [
                'ids' => [$c1->id, $c2->id],
                'status' => 'inactive',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => ['updated' => 2],
            ]);
    }

    public function test_can_get_stats(): void
    {
        $this->createCustomer(['email' => 'stat1@example.com', 'phone' => '9876543210', 'status' => 'active']);
        $this->createCustomer(['email' => 'stat2@example.com', 'phone' => '9876543211', 'status' => 'inactive']);

        $response = $this->actingAs($this->admin, 'admin')
            ->getJson('/api/v1/admin/customers/stats');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Customer statistics retrieved successfully',
            ]);
    }

    public function test_can_search_customers_endpoint(): void
    {
        $this->createCustomer(['first_name' => 'Rahul', 'email' => 'rahul@example.com', 'phone' => '9876543210']);

        $response = $this->actingAs($this->admin, 'admin')
            ->getJson('/api/v1/admin/customers/search?q=Rahul');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    public function test_unauthenticated_user_cannot_access_customers(): void
    {
        $response = $this->getJson('/api/v1/admin/customers');

        $response->assertStatus(401);
    }
}
