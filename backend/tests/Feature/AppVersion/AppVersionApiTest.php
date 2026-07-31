<?php
declare(strict_types=1);
namespace Tests\Feature\AppVersion;

use App\Models\AppVersion;
use App\Models\Auth\Admin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AppVersionApiTest extends TestCase
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

    private function authHeader(): void
    {
        $this->actingAs($this->admin, 'admin');
    }

    private function createVersion(array $overrides = []): AppVersion
    {
        return AppVersion::create(array_merge([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'platform' => 'android',
            'version_name' => '1.0.0',
            'version_code' => 1,
            'minimum_supported_version' => '1.0.0',
            'force_update' => false,
            'release_notes' => 'Initial release',
            'status' => 'active',
        ], $overrides));
    }

    public function test_can_list_versions(): void
    {
        $this->authHeader();
        $this->createVersion(['version_name' => '1.0.0', 'version_code' => 1]);
        $this->createVersion(['version_name' => '1.1.0', 'version_code' => 2]);

        $response = $this->getJson('/api/v1/admin/app-versions');
        $response->assertOk()->assertJsonStructure(['success', 'data', 'meta']);
    }

    public function test_can_create_version(): void
    {
        $this->authHeader();
        $response = $this->postJson('/api/v1/admin/app-versions', [
            'platform' => 'ios',
            'version_name' => '2.0.0',
            'version_code' => 100,
            'minimum_supported_version' => '1.5.0',
            'force_update' => false,
            'release_notes' => 'iOS release',
            'status' => 'active',
        ]);

        $response->assertCreated()->assertJsonStructure(['success', 'data']);
        $this->assertDatabaseHas('app_versions', ['version_code' => 100]);
    }

    public function test_can_show_version(): void
    {
        $this->authHeader();
        $version = $this->createVersion();

        $response = $this->getJson("/api/v1/admin/app-versions/{$version->uuid}");
        $response->assertOk()->assertJsonPath('data.version_name', '1.0.0');
    }

    public function test_can_update_version(): void
    {
        $this->authHeader();
        $version = $this->createVersion();

        $response = $this->putJson("/api/v1/admin/app-versions/{$version->uuid}", [
            'version_name' => '1.0.1',
            'release_notes' => 'Bug fixes',
        ]);

        $response->assertOk()->assertJsonPath('data.version_name', '1.0.1');
    }

    public function test_can_delete_version(): void
    {
        $this->authHeader();
        $version = $this->createVersion();

        $response = $this->deleteJson("/api/v1/admin/app-versions/{$version->uuid}");
        $response->assertOk();
        $this->assertSoftDeleted('app_versions', ['id' => $version->id]);
    }

    public function test_can_set_status(): void
    {
        $this->authHeader();
        $version = $this->createVersion(['status' => 'active']);

        $response = $this->patchJson("/api/v1/admin/app-versions/{$version->uuid}/status", [
            'status' => 'deprecated',
        ]);
        $response->assertOk()->assertJsonPath('data.status', 'deprecated');
    }

    public function test_can_get_latest_for_platform(): void
    {
        $this->authHeader();
        $this->createVersion(['platform' => 'android', 'version_code' => 1, 'version_name' => '1.0.0']);
        $this->createVersion(['platform' => 'android', 'version_code' => 2, 'version_name' => '1.1.0']);

        $response = $this->getJson('/api/v1/admin/app-versions/latest/android');
        $response->assertOk()->assertJsonPath('data.version_code', 2);
    }

    public function test_can_check_outdated(): void
    {
        $this->authHeader();
        $this->createVersion(['platform' => 'android', 'version_code' => 5, 'version_name' => '2.0.0', 'force_update' => true]);

        $response = $this->postJson('/api/v1/admin/app-versions/check-outdated', [
            'platform' => 'android',
            'current_version' => '1.0.0',
        ]);

        $response->assertOk()->assertJsonStructure(['success', 'data']);
    }

    public function test_can_get_stats(): void
    {
        $this->authHeader();
        $this->createVersion(['platform' => 'android', 'version_code' => 1]);
        $this->createVersion(['platform' => 'ios', 'version_code' => 2]);

        $response = $this->getJson('/api/v1/admin/app-versions/stats');
        $response->assertOk()->assertJsonStructure(['success', 'data']);
    }

    public function test_unauthenticated_cannot_access(): void
    {
        $response = $this->getJson('/api/v1/admin/app-versions');
        $response->assertUnauthorized();
    }

    public function test_validation_error_for_missing_required_fields(): void
    {
        $this->authHeader();
        $response = $this->postJson('/api/v1/admin/app-versions', []);
        $response->assertUnprocessable()->assertJsonValidationErrors(['platform', 'version_name', 'version_code']);
    }
}
