<?php
declare(strict_types=1);
namespace Tests\Feature\Area;

use App\Models\Auth\Admin;
use App\Models\Master\Country;
use App\Models\Master\State;
use App\Models\Master\City;
use App\Models\Master\Area;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AreaApiTest extends TestCase
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
    }

    private function authHeader(): void
    {
        $this->actingAs($this->admin, 'admin');
    }

    private function createArea(array $overrides = []): Area
    {
        return Area::create(array_merge([
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
        ], $overrides));
    }

    public function test_can_list_areas(): void
    {
        $this->authHeader();
        $this->createArea(['name' => 'Andheri', 'area_code' => 'AW']);
        $this->createArea(['name' => 'Bandra', 'area_code' => 'BD']);

        $response = $this->getJson('/api/v1/admin/areas');
        $response->assertOk()->assertJsonStructure(['success', 'data', 'meta']);
    }

    public function test_can_create_area(): void
    {
        $this->authHeader();
        $response = $this->postJson('/api/v1/admin/areas', [
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'city_id' => $this->city->id,
            'name' => 'Dadar',
            'area_code' => 'DDR',
            'latitude' => 19.0178,
            'longitude' => 72.8478,
            'delivery_radius' => 3.0,
            'minimum_order_amount' => 100.0,
            'delivery_charge' => 15.0,
            'estimated_delivery_time' => 25,
            'is_serviceable' => true,
        ]);

        $response->assertCreated()->assertJsonStructure(['success', 'data' => ['uuid', 'name', 'area_code']]);
        $this->assertDatabaseHas('areas', ['name' => 'Dadar', 'area_code' => 'DDR']);
    }

    public function test_cannot_create_duplicate_name_in_same_city(): void
    {
        $this->authHeader();
        $this->createArea(['name' => 'Duplicate Area']);

        $response = $this->postJson('/api/v1/admin/areas', [
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'city_id' => $this->city->id,
            'name' => 'Duplicate Area',
            'area_code' => 'DUP2',
        ]);

        $response->assertUnprocessable();
    }

    public function test_cannot_create_duplicate_area_code(): void
    {
        $this->authHeader();
        $this->createArea(['area_code' => 'SAME']);

        $response = $this->postJson('/api/v1/admin/areas', [
            'country_id' => $this->country->id,
            'state_id' => $this->state->id,
            'city_id' => $this->city->id,
            'name' => 'Different Area',
            'area_code' => 'SAME',
        ]);

        $response->assertUnprocessable();
    }

    public function test_can_show_area(): void
    {
        $this->authHeader();
        $area = $this->createArea();

        $response = $this->getJson("/api/v1/admin/areas/{$area->uuid}");
        $response->assertOk()->assertJsonPath('data.name', 'Andheri West');
    }

    public function test_can_update_area(): void
    {
        $this->authHeader();
        $area = $this->createArea();

        $response = $this->putJson("/api/v1/admin/areas/{$area->uuid}", [
            'name' => 'Updated Andheri',
        ]);

        $response->assertOk()->assertJsonPath('data.name', 'Updated Andheri');
    }

    public function test_can_delete_area(): void
    {
        $this->authHeader();
        $area = $this->createArea();

        $response = $this->deleteJson("/api/v1/admin/areas/{$area->uuid}");
        $response->assertOk();
        $this->assertSoftDeleted('areas', ['id' => $area->id]);
    }

    public function test_can_restore_area(): void
    {
        $this->authHeader();
        $area = $this->createArea();
        $area->delete();

        $response = $this->postJson("/api/v1/admin/areas/{$area->uuid}/restore");
        $response->assertOk();
        $this->assertDatabaseHas('areas', ['id' => $area->id, 'deleted_at' => null]);
    }

    public function test_can_set_status(): void
    {
        $this->authHeader();
        $area = $this->createArea(['status' => 'active']);

        $response = $this->patchJson("/api/v1/admin/areas/{$area->uuid}/status", ['status' => 'inactive']);
        $response->assertOk()->assertJsonPath('data.status', 'inactive');
    }

    public function test_can_set_default(): void
    {
        $this->authHeader();
        $area = $this->createArea();

        $response = $this->patchJson("/api/v1/admin/areas/{$area->uuid}/default");
        $response->assertOk();
        $this->assertDatabaseHas('areas', ['id' => $area->id, 'is_default' => true]);
    }

    public function test_can_toggle_service(): void
    {
        $this->authHeader();
        $area = $this->createArea(['is_serviceable' => true]);

        $response = $this->patchJson("/api/v1/admin/areas/{$area->uuid}/service", ['is_serviceable' => false]);
        $response->assertOk()->assertJsonPath('data.is_serviceable', false);
    }

    public function test_unauthenticated_cannot_access(): void
    {
        $response = $this->getJson('/api/v1/admin/areas');
        $response->assertUnauthorized();
    }

    public function test_can_export_areas(): void
    {
        $this->authHeader();
        $this->createArea();

        $response = $this->getJson('/api/v1/admin/areas/export');
        $response->assertOk();
    }

    public function test_can_download_template(): void
    {
        $this->authHeader();

        $response = $this->getJson('/api/v1/admin/areas/sample-template');
        $response->assertOk();
    }

    public function test_can_bulk_delete(): void
    {
        $this->authHeader();
        $a1 = $this->createArea(['name' => 'Area 1', 'area_code' => 'A1']);
        $a2 = $this->createArea(['name' => 'Area 2', 'area_code' => 'A2']);

        $response = $this->postJson('/api/v1/admin/areas/bulk-delete', ['ids' => [$a1->id, $a2->id]]);
        $response->assertOk();
    }

    public function test_can_bulk_status(): void
    {
        $this->authHeader();
        $a1 = $this->createArea(['name' => 'Area A', 'area_code' => 'AA']);
        $a2 = $this->createArea(['name' => 'Area B', 'area_code' => 'AB']);

        $response = $this->patchJson('/api/v1/admin/areas/bulk-status', ['ids' => [$a1->id, $a2->id], 'status' => 'inactive']);
        $response->assertOk();
    }

    public function test_validation_error_for_missing_required_fields(): void
    {
        $this->authHeader();
        $response = $this->postJson('/api/v1/admin/areas', []);
        $response->assertUnprocessable()->assertJsonValidationErrors(['country_id', 'state_id', 'city_id', 'name', 'area_code']);
    }

    public function test_can_filter_by_city(): void
    {
        $this->authHeader();
        $this->createArea(['name' => 'Filtered Area']);

        $response = $this->getJson("/api/v1/admin/areas?city_id={$this->city->id}");
        $response->assertOk();
    }

    public function test_can_get_areas_by_city_uuid(): void
    {
        $this->authHeader();
        $this->createArea();

        $response = $this->getJson("/api/v1/admin/areas/by-city/{$this->city->uuid}");
        $response->assertOk()->assertJsonStructure(['success', 'data']);
    }
}
