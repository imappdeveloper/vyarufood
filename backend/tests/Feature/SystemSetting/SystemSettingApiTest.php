<?php
declare(strict_types=1);
namespace Tests\Feature\SystemSetting;

use App\Models\Auth\Admin;
use App\Models\SystemSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SystemSettingApiTest extends TestCase
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

    private function createSetting(array $overrides = []): SystemSetting
    {
        return SystemSetting::create(array_merge([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'setting_group' => 'general',
            'setting_key' => 'site_name',
            'setting_value' => 'Test Site',
            'data_type' => 'string',
            'is_encrypted' => false,
            'autoload' => true,
            'status' => 'active',
        ], $overrides));
    }

    public function test_can_list_settings(): void
    {
        $this->authHeader();
        $this->createSetting(['setting_key' => 'site_name', 'setting_group' => 'general']);
        $this->createSetting(['setting_key' => 'site_email', 'setting_group' => 'general']);

        $response = $this->getJson('/api/v1/admin/settings');
        $response->assertOk()->assertJsonStructure(['success', 'data', 'meta']);
    }

    public function test_can_create_setting(): void
    {
        $this->authHeader();
        $response = $this->postJson('/api/v1/admin/settings', [
            'setting_group' => 'general',
            'setting_key' => 'site_description',
            'setting_value' => 'A great tiffin service',
            'data_type' => 'string',
            'is_encrypted' => false,
            'autoload' => true,
            'status' => 'active',
        ]);

        $response->assertCreated()->assertJsonStructure(['success', 'data']);
        $this->assertDatabaseHas('system_settings', ['setting_key' => 'site_description']);
    }

    public function test_can_show_setting(): void
    {
        $this->authHeader();
        $setting = $this->createSetting();

        $response = $this->getJson("/api/v1/admin/settings/{$setting->uuid}");
        $response->assertOk()->assertJsonPath('data.setting_key', 'site_name');
    }

    public function test_can_update_setting(): void
    {
        $this->authHeader();
        $setting = $this->createSetting();

        $response = $this->putJson("/api/v1/admin/settings/{$setting->uuid}", [
            'setting_value' => 'Updated Site',
        ]);

        $response->assertOk()->assertJsonPath('data.setting_value', 'Updated Site');
    }

    public function test_can_delete_setting(): void
    {
        $this->authHeader();
        $setting = $this->createSetting();

        $response = $this->deleteJson("/api/v1/admin/settings/{$setting->uuid}");
        $response->assertOk();
        $this->assertSoftDeleted('system_settings', ['id' => $setting->id]);
    }

    public function test_can_get_groups(): void
    {
        $this->authHeader();
        $this->createSetting(['setting_group' => 'general']);
        $this->createSetting(['setting_key' => 'mail_host', 'setting_group' => 'mail']);

        $response = $this->getJson('/api/v1/admin/settings/groups');
        $response->assertOk()->assertJsonStructure(['success', 'data']);
    }

    public function test_can_get_by_group(): void
    {
        $this->authHeader();
        $this->createSetting(['setting_group' => 'general']);
        $this->createSetting(['setting_key' => 'mail_host', 'setting_group' => 'mail']);

        $response = $this->getJson('/api/v1/admin/settings/group/general');
        $response->assertOk()->assertJsonStructure(['success', 'data']);
    }

    public function test_can_bulk_update(): void
    {
        $this->authHeader();
        $this->createSetting(['setting_key' => 'site_name', 'setting_value' => 'Old Name']);
        $this->createSetting(['setting_key' => 'site_email', 'setting_value' => 'old@test.com']);

        $response = $this->patchJson('/api/v1/admin/settings/bulk-update', [
            'settings' => [
                ['setting_key' => 'site_name', 'setting_value' => 'New Name'],
                ['setting_key' => 'site_email', 'setting_value' => 'new@test.com'],
            ],
        ]);

        $response->assertOk();
    }

    public function test_unauthenticated_cannot_access(): void
    {
        $response = $this->getJson('/api/v1/admin/settings');
        $response->assertUnauthorized();
    }

    public function test_validation_error_for_missing_required_fields(): void
    {
        $this->authHeader();
        $response = $this->postJson('/api/v1/admin/settings', []);
        $response->assertUnprocessable()->assertJsonValidationErrors(['setting_group', 'setting_key']);
    }
}
