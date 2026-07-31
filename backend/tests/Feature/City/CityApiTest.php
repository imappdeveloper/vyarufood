<?php
declare(strict_types=1);
namespace Tests\Feature\City;

use App\Models\Auth\Admin;
use App\Models\Master\Country;
use App\Models\Master\State;
use App\Models\Master\City;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CityApiTest extends TestCase
{
    use RefreshDatabase;

    protected Admin $admin;
    protected Country $country;
    protected State $state;

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
    }

    private function authHeader(): void
    {
        $this->actingAs($this->admin, 'admin');
    }

    private function createCity(array $overrides = []): City
    {
        return City::create(array_merge([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'name' => 'Mumbai',
            'city_code' => 'MUM',
            'latitude' => 19.0760,
            'longitude' => 72.8777,
            'timezone' => 'Asia/Kolkata',
            'population' => 12442373,
            'display_order' => 0,
            'is_metro' => true,
            'status' => 'active',
            'is_default' => false,
        ], $overrides));
    }

    public function test_can_list_cities(): void
    {
        $this->authHeader();
        $this->createCity(['name' => 'Mumbai', 'city_code' => 'MUM']);
        $this->createCity(['name' => 'Pune', 'city_code' => 'PUN']);

        $response = $this->getJson('/api/v1/admin/cities');
        $response->assertOk()->assertJsonStructure(['success', 'data', 'meta']);
    }

    public function test_can_create_city(): void
    {
        $this->authHeader();
        $response = $this->postJson('/api/v1/admin/cities', [
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'name' => 'Nagpur',
            'city_code' => 'NGP',
            'latitude' => 21.1458,
            'longitude' => 79.0882,
            'timezone' => 'Asia/Kolkata',
            'population' => 2497772,
            'is_metro' => false,
        ]);

        $response->assertCreated()->assertJsonStructure(['success', 'data' => ['uuid', 'name', 'city_code']]);
        $this->assertDatabaseHas('cities', ['name' => 'Nagpur', 'city_code' => 'NGP']);
    }

    public function test_cannot_create_duplicate_name_in_same_state(): void
    {
        $this->authHeader();
        $this->createCity(['name' => 'Mumbai']);

        $response = $this->postJson('/api/v1/admin/cities', [
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'name' => 'Mumbai',
            'city_code' => 'MUM2',
        ]);

        $response->assertUnprocessable();
    }

    public function test_cannot_create_duplicate_city_code(): void
    {
        $this->authHeader();
        $this->createCity(['city_code' => 'MUM']);

        $response = $this->postJson('/api/v1/admin/cities', [
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'name' => 'Different City',
            'city_code' => 'MUM',
        ]);

        $response->assertUnprocessable();
    }

    public function test_can_show_city(): void
    {
        $this->authHeader();
        $city = $this->createCity();

        $response = $this->getJson("/api/v1/admin/cities/{$city->uuid}");
        $response->assertOk()->assertJsonPath('data.name', 'Mumbai');
    }

    public function test_can_update_city(): void
    {
        $this->authHeader();
        $city = $this->createCity();

        $response = $this->putJson("/api/v1/admin/cities/{$city->uuid}", [
            'name' => 'Greater Mumbai',
        ]);

        $response->assertOk()->assertJsonPath('data.name', 'Greater Mumbai');
    }

    public function test_can_delete_city(): void
    {
        $this->authHeader();
        $city = $this->createCity();

        $response = $this->deleteJson("/api/v1/admin/cities/{$city->uuid}");
        $response->assertOk();
        $this->assertSoftDeleted('cities', ['id' => $city->id]);
    }

    public function test_can_restore_city(): void
    {
        $this->authHeader();
        $city = $this->createCity();
        $city->delete();

        $response = $this->postJson("/api/v1/admin/cities/{$city->uuid}/restore");
        $response->assertOk();
        $this->assertDatabaseHas('cities', ['id' => $city->id, 'deleted_at' => null]);
    }

    public function test_can_set_status(): void
    {
        $this->authHeader();
        $city = $this->createCity(['status' => 'active']);

        $response = $this->patchJson("/api/v1/admin/cities/{$city->uuid}/status", ['status' => 'inactive']);
        $response->assertOk()->assertJsonPath('data.status', 'inactive');
    }

    public function test_can_set_default(): void
    {
        $this->authHeader();
        $city = $this->createCity();

        $response = $this->patchJson("/api/v1/admin/cities/{$city->uuid}/default");
        $response->assertOk();
        $this->assertDatabaseHas('cities', ['id' => $city->id, 'is_default' => true]);
    }

    public function test_unauthenticated_cannot_access(): void
    {
        $response = $this->getJson('/api/v1/admin/cities');
        $response->assertUnauthorized();
    }

    public function test_can_export_cities(): void
    {
        $this->authHeader();
        $this->createCity();

        $response = $this->getJson('/api/v1/admin/cities/export');
        $response->assertOk();
        $response->assertHeader('Content-Type', 'text/csv; charset=utf-8');
    }

    public function test_can_download_template(): void
    {
        $this->authHeader();

        $response = $this->getJson('/api/v1/admin/cities/sample-template');
        $response->assertOk();
        $response->assertHeader('Content-Type', 'text/csv; charset=utf-8');
    }

    public function test_can_bulk_delete(): void
    {
        $this->authHeader();
        $c1 = $this->createCity(['name' => 'City 1', 'city_code' => 'C1']);
        $c2 = $this->createCity(['name' => 'City 2', 'city_code' => 'C2']);

        $response = $this->postJson('/api/v1/admin/cities/bulk-delete', ['ids' => [$c1->id, $c2->id]]);
        $response->assertOk();
    }

    public function test_can_bulk_status(): void
    {
        $this->authHeader();
        $c1 = $this->createCity(['name' => 'City A', 'city_code' => 'CA']);
        $c2 = $this->createCity(['name' => 'City B', 'city_code' => 'CB']);

        $response = $this->patchJson('/api/v1/admin/cities/bulk-status', ['ids' => [$c1->id, $c2->id], 'status' => 'inactive']);
        $response->assertOk();
    }

    public function test_validation_error_for_missing_required_fields(): void
    {
        $this->authHeader();
        $response = $this->postJson('/api/v1/admin/cities', []);
        $response->assertUnprocessable()->assertJsonValidationErrors(['country_id', 'state_id', 'name', 'city_code']);
    }

    public function test_can_filter_by_state(): void
    {
        $this->authHeader();
        $this->createCity(['name' => 'MH City']);

        $response = $this->getJson("/api/v1/admin/cities?state_id={$this->state->id}");
        $response->assertOk();
    }

    public function test_can_get_cities_by_state_uuid(): void
    {
        $this->authHeader();
        $this->createCity();

        $response = $this->getJson("/api/v1/admin/cities/by-state/{$this->state->uuid}");
        $response->assertOk()->assertJsonStructure(['success', 'data']);
    }

    public function test_can_get_cities_by_country_uuid(): void
    {
        $this->authHeader();
        $this->createCity();

        $response = $this->getJson("/api/v1/admin/cities/by-country/{$this->country->uuid}");
        $response->assertOk()->assertJsonStructure(['success', 'data']);
    }

    public function test_can_filter_by_metro(): void
    {
        $this->authHeader();
        $this->createCity(['name' => 'Metro', 'city_code' => 'MET', 'is_metro' => true]);

        $response = $this->getJson('/api/v1/admin/cities?is_metro=true');
        $response->assertOk();
    }
}
