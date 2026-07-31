<?php
declare(strict_types=1);
namespace Tests\Feature\Country;

use App\Models\Auth\Admin;
use App\Models\Master\Country;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CountryApiTest extends TestCase
{
    use RefreshDatabase;

    protected Admin $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = Admin::factory()->create([
            'email' => 'superadmin@tiffin.local',
            'password' => 'Admin@1234',
            'status' => 'active',
        ]);
    }

    private function authHeader(): array
    {
        $this->actingAs($this->admin, 'admin');
        return [];
    }

    private function createCountry(array $overrides = []): Country
    {
        return Country::create(array_merge([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'iso2' => 'IN',
            'iso3' => 'IND',
            'name' => 'India',
            'numeric_code' => '356',
            'phone_code' => '91',
            'capital' => 'New Delhi',
            'currency_code' => 'INR',
            'currency_symbol' => '₹',
            'currency_name' => 'Indian Rupee',
            'region' => 'Asia',
            'subregion' => 'Southern Asia',
            'nationality' => 'Indian',
            'status' => 'active',
            'sort_order' => 0,
            'is_default' => false,
        ], $overrides));
    }

    public function test_can_list_countries(): void
    {
        $this->authHeader();
        $this->createCountry(['name' => 'India', 'iso2' => 'IN']);
        $this->createCountry(['name' => 'United States', 'iso2' => 'US', 'iso3' => 'USA']);

        $response = $this->getJson('/api/v1/admin/countries');
        $response->assertOk()->assertJsonStructure([
            'success', 'data', 'meta',
        ]);
    }

    public function test_can_create_country(): void
    {
        $this->authHeader();
        $response = $this->postJson('/api/v1/admin/countries', [
            'iso2' => 'US',
            'iso3' => 'USA',
            'name' => 'United States',
            'phone_code' => '1',
            'capital' => 'Washington D.C.',
            'currency_code' => 'USD',
            'currency_symbol' => '$',
            'region' => 'Americas',
        ]);

        $response->assertCreated()->assertJsonStructure(['success', 'data' => ['uuid', 'name', 'iso2', 'iso3']]);
        $this->assertDatabaseHas('countries', ['iso2' => 'US', 'name' => 'United States']);
    }

    public function test_cannot_create_duplicate_name(): void
    {
        $this->authHeader();
        $this->createCountry(['name' => 'India', 'iso2' => 'IN']);

        $response = $this->postJson('/api/v1/admin/countries', [
            'iso2' => 'IN2',
            'iso3' => 'IN2',
            'name' => 'India',
        ]);

        $response->assertUnprocessable();
    }

    public function test_cannot_create_duplicate_iso2(): void
    {
        $this->authHeader();
        $this->createCountry(['iso2' => 'IN']);

        $response = $this->postJson('/api/v1/admin/countries', [
            'iso2' => 'IN',
            'iso3' => 'IN2',
            'name' => 'Different Country',
        ]);

        $response->assertUnprocessable();
    }

    public function test_can_show_country(): void
    {
        $this->authHeader();
        $country = $this->createCountry();

        $response = $this->getJson("/api/v1/admin/countries/{$country->uuid}");
        $response->assertOk()->assertJsonPath('data.name', 'India');
    }

    public function test_can_update_country(): void
    {
        $this->authHeader();
        $country = $this->createCountry();

        $response = $this->putJson("/api/v1/admin/countries/{$country->uuid}", [
            'name' => 'Republic of India',
            'capital' => 'New Delhi',
        ]);

        $response->assertOk()->assertJsonPath('data.name', 'Republic of India');
    }

    public function test_can_delete_country(): void
    {
        $this->authHeader();
        $country = $this->createCountry();

        $response = $this->deleteJson("/api/v1/admin/countries/{$country->uuid}");
        $response->assertOk();
        $this->assertSoftDeleted('countries', ['id' => $country->id]);
    }

    public function test_can_restore_country(): void
    {
        $this->authHeader();
        $country = $this->createCountry();
        $country->delete();

        $response = $this->postJson("/api/v1/admin/countries/{$country->uuid}/restore");
        $response->assertOk();
        $this->assertDatabaseHas('countries', ['id' => $country->id, 'deleted_at' => null]);
    }

    public function test_can_set_status(): void
    {
        $this->authHeader();
        $country = $this->createCountry(['status' => 'active']);

        $response = $this->patchJson("/api/v1/admin/countries/{$country->uuid}/status", ['status' => 'inactive']);
        $response->assertOk()->assertJsonPath('data.status', 'inactive');
    }

    public function test_can_set_default(): void
    {
        $this->authHeader();
        $country = $this->createCountry();

        $response = $this->patchJson("/api/v1/admin/countries/{$country->uuid}/default");
        $response->assertOk();
        $this->assertDatabaseHas('countries', ['id' => $country->id, 'is_default' => true]);
    }

    public function test_unauthenticated_cannot_access(): void
    {
        $response = $this->getJson('/api/v1/admin/countries');
        $response->assertUnauthorized();
    }

    public function test_can_export_countries(): void
    {
        $this->authHeader();
        $this->createCountry();

        $response = $this->getJson('/api/v1/admin/countries/export');
        $response->assertOk();
        $response->assertHeader('Content-Type', 'text/csv; charset=utf-8');
    }

    public function test_can_download_template(): void
    {
        $this->authHeader();

        $response = $this->getJson('/api/v1/admin/countries/sample-template');
        $response->assertOk();
        $response->assertHeader('Content-Type', 'text/csv; charset=utf-8');
    }

    public function test_can_bulk_delete(): void
    {
        $this->authHeader();
        $c1 = $this->createCountry(['name' => 'Country 1', 'iso2' => 'C1', 'iso3' => 'C01']);
        $c2 = $this->createCountry(['name' => 'Country 2', 'iso2' => 'C2', 'iso3' => 'C02']);

        $response = $this->postJson('/api/v1/admin/countries/bulk-delete', ['ids' => [$c1->id, $c2->id]]);
        $response->assertOk();
    }

    public function test_can_bulk_status(): void
    {
        $this->authHeader();
        $c1 = $this->createCountry(['name' => 'Country A', 'iso2' => 'CA', 'iso3' => 'CAA']);
        $c2 = $this->createCountry(['name' => 'Country B', 'iso2' => 'CB', 'iso3' => 'CBB']);

        $response = $this->patchJson('/api/v1/admin/countries/bulk-status', ['ids' => [$c1->id, $c2->id], 'status' => 'inactive']);
        $response->assertOk();
    }

    public function test_validation_error_for_missing_required_fields(): void
    {
        $this->authHeader();
        $response = $this->postJson('/api/v1/admin/countries', []);
        $response->assertUnprocessable()->assertJsonValidationErrors(['iso2', 'iso3', 'name']);
    }
}
