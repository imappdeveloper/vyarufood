<?php
declare(strict_types=1);
namespace Tests\Feature\SystemBackup;

use App\Models\Auth\Admin;
use App\Models\SystemBackup;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SystemBackupApiTest extends TestCase
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

    private function createBackup(array $overrides = []): SystemBackup
    {
        return SystemBackup::create(array_merge([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'backup_name' => 'Daily Backup',
            'backup_type' => 'database',
            'file_path' => 'backups/daily.sql',
            'file_size' => 1024000,
            'status' => 'completed',
            'started_at' => now()->subMinutes(5),
            'completed_at' => now(),
            'created_by' => $this->admin->id,
        ], $overrides));
    }

    public function test_can_list_backups(): void
    {
        $this->authHeader();
        $this->createBackup(['backup_name' => 'Backup 1']);
        $this->createBackup(['backup_name' => 'Backup 2']);

        $response = $this->getJson('/api/v1/admin/backups');
        $response->assertOk()->assertJsonStructure(['success', 'data', 'meta']);
    }

    public function test_can_create_backup(): void
    {
        $this->authHeader();
        $response = $this->postJson('/api/v1/admin/backups', [
            'backup_name' => 'Weekly Backup',
            'backup_type' => 'database',
        ]);

        $response->assertCreated()->assertJsonStructure(['success', 'data']);
        $this->assertDatabaseHas('system_backups', ['backup_name' => 'Weekly Backup']);
    }

    public function test_can_show_backup(): void
    {
        $this->authHeader();
        $backup = $this->createBackup();

        $response = $this->getJson("/api/v1/admin/backups/{$backup->uuid}");
        $response->assertOk()->assertJsonPath('data.backup_name', 'Daily Backup');
    }

    public function test_can_delete_backup(): void
    {
        $this->authHeader();
        $backup = $this->createBackup();

        $response = $this->deleteJson("/api/v1/admin/backups/{$backup->uuid}");
        $response->assertOk();
        $this->assertDatabaseMissing('system_backups', ['id' => $backup->id]);
    }

    public function test_can_get_stats(): void
    {
        $this->authHeader();
        $this->createBackup(['backup_type' => 'database', 'status' => 'completed', 'file_size' => 1024]);
        $this->createBackup(['backup_type' => 'storage', 'status' => 'completed', 'file_size' => 2048]);

        $response = $this->getJson('/api/v1/admin/backups/stats');
        $response->assertOk()->assertJsonStructure(['success', 'data']);
    }

    public function test_unauthenticated_cannot_access(): void
    {
        $response = $this->getJson('/api/v1/admin/backups');
        $response->assertUnauthorized();
    }

    public function test_validation_error_for_missing_required_fields(): void
    {
        $this->authHeader();
        $response = $this->postJson('/api/v1/admin/backups', []);
        $response->assertUnprocessable()->assertJsonValidationErrors(['backup_name', 'backup_type']);
    }
}
