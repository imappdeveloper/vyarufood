<?php
declare(strict_types=1);
namespace Tests\Feature\State;

use App\Models\Auth\Admin;
use App\Models\Master\Country;
use App\Models\Master\State;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StateApiTest extends TestCase
{
    use RefreshDatabase;

    protected Admin $admin;
    protected Country $country;

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
    }

    private function authHeader(): void
    {
        $this->actingAs($this->admin, 'admin');
    }

    private function createState(array $overrides = []): State
    {
        return State::create(array_merge([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'country_id' => $this->country->id,
            'name' => 'Maharashtra',
            'state_code' => 'MH',
            'abbreviation' => 'MH',
            'gst_code' => '27',
            'status' => 'active',
            'sort_order' => 0,
            'is_default' => false,
        ], $overrides));
    }

    public function test_can_list_states(): void
    {
        $this->authHeader();
        $this->createState(['name' => 'Maharashtra', 'state_code' => 'MH']);
        $this->createState(['name' => 'Karnataka', 'state_code' => 'KA']);

        $response = $this->getJson('/api/v1/admin/states');
        $response->assertOk()->assertJsonStructure(['success', 'data', 'meta']);
    }

    public function test_can_create_state(): void
    {
        $this->authHeader();
        $response = $this->postJson('/api/v1/admin/states', [
            'country_id' => $this->country->id,
            'name' => 'Tamil Nadu',
            'state_code' => 'TN',
            'abbreviation' => 'TN',
            'gst_code' => '33',
        ]);

        $response->assertCreated()->assertJsonStructure(['success', 'data' => ['uuid', 'name', 'state_code']]);
        $this->assertDatabaseHas('states', ['name' => 'Tamil Nadu', 'state_code' => 'TN']);
    }

    public function test_cannot_create_duplicate_name_in_same_country(): void
    {
        $this->authHeader();
        $this->createState(['name' => 'Maharashtra']);

        $response = $this->postJson('/api/v1/admin/states', [
            'country_id' => $this->country->id,
            'name' => 'Maharashtra',
            'state_code' => 'MH2',
        ]);

        $response->assertUnprocessable();
    }

    public function test_can_show_state(): void
    {
        $this->authHeader();
        $state = $this->createState();

        $response = $this->getJson("/api/v1/admin/states/{$state->uuid}");
        $response->assertOk()->assertJsonPath('data.name', 'Maharashtra');
    }

    public function test_can_update_state(): void
    {
        $this->authHeader();
        $state = $this->createState();

        $response = $this->putJson("/api/v1/admin/states/{$state->uuid}", [
            'name' => 'Greater Maharashtra',
        ]);

        $response->assertOk()->assertJsonPath('data.name', 'Greater Maharashtra');
    }

    public function test_can_delete_state(): void
    {
        $this->authHeader();
        $state = $this->createState();

        $response = $this->deleteJson("/api/v1/admin/states/{$state->uuid}");
        $response->assertOk();
        $this->assertSoftDeleted('states', ['id' => $state->id]);
    }

    public function test_can_restore_state(): void
    {
        $this->authHeader();
        $state = $this->createState();
        $state->delete();

        $response = $this->postJson("/api/v1/admin/states/{$state->uuid}/restore");
        $response->assertOk();
        $this->assertDatabaseHas('states', ['id' => $state->id, 'deleted_at' => null]);
    }

    public function test_can_set_status(): void
    {
        $this->authHeader();
        $state = $this->createState(['status' => 'active']);

        $response = $this->patchJson("/api/v1/admin/states/{$state->uuid}/status", ['status' => 'inactive']);
        $response->assertOk()->assertJsonPath('data.status', 'inactive');
    }

    public function test_can_set_default(): void
    {
        $this->authHeader();
        $state = $this->createState();

        $response = $this->patchJson("/api/v1/admin/states/{$state->uuid}/default");
        $response->assertOk();
        $this->assertDatabaseHas('states', ['id' => $state->id, 'is_default' => true]);
    }

    public function test_unauthenticated_cannot_access(): void
    {
        $response = $this->getJson('/api/v1/admin/states');
        $response->assertUnauthorized();
    }

    public function test_can_export_states(): void
    {
        $this->authHeader();
        $this->createState();

        $response = $this->getJson('/api/v1/admin/states/export');
        $response->assertOk();
        $response->assertHeader('Content-Type', 'text/csv; charset=utf-8');
    }

    public function test_can_download_template(): void
    {
        $this->authHeader();

        $response = $this->getJson('/api/v1/admin/states/sample-template');
        $response->assertOk();
        $response->assertHeader('Content-Type', 'text/csv; charset=utf-8');
    }

    public function test_can_bulk_delete(): void
    {
        $this->authHeader();
        $s1 = $this->createState(['name' => 'State 1', 'state_code' => 'S1']);
        $s2 = $this->createState(['name' => 'State 2', 'state_code' => 'S2']);

        $response = $this->postJson('/api/v1/admin/states/bulk-delete', ['ids' => [$s1->id, $s2->id]]);
        $response->assertOk();
    }

    public function test_can_bulk_status(): void
    {
        $this->authHeader();
        $s1 = $this->createState(['name' => 'State A', 'state_code' => 'SA']);
        $s2 = $this->createState(['name' => 'State B', 'state_code' => 'SB']);

        $response = $this->patchJson('/api/v1/admin/states/bulk-status', ['ids' => [$s1->id, $s2->id], 'status' => 'inactive']);
        $response->assertOk();
    }

    public function test_validation_error_for_missing_required_fields(): void
    {
        $this->authHeader();
        $response = $this->postJson('/api/v1/admin/states', []);
        $response->assertUnprocessable()->assertJsonValidationErrors(['country_id', 'name']);
    }

    public function test_can_filter_by_country(): void
    {
        $this->authHeader();
        $this->createState(['name' => 'MH']);

        $response = $this->getJson("/api/v1/admin/states?country_id={$this->country->id}");
        $response->assertOk();
    }

    public function test_can_get_states_by_country_uuid(): void
    {
        $this->authHeader();
        $this->createState();

        $response = $this->getJson("/api/v1/admin/states/by-country/{$this->country->uuid}");
        $response->assertOk()->assertJsonStructure(['success', 'data']);
    }
}
