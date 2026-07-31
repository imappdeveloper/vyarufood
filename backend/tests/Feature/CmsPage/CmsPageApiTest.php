<?php
declare(strict_types=1);
namespace Tests\Feature\CmsPage;

use App\Models\Auth\Admin;
use App\Models\CmsPage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CmsPageApiTest extends TestCase
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

    private function createPage(array $overrides = []): CmsPage
    {
        return CmsPage::create(array_merge([
            'uuid' => \Illuminate\Support\Str::uuid()->toString(),
            'page_code' => 'PRIVACY',
            'page_title' => 'Privacy Policy',
            'slug' => 'privacy-policy',
            'content' => '<p>Privacy content</p>',
            'meta_title' => 'Privacy Policy',
            'meta_description' => 'Our privacy policy',
            'meta_keywords' => 'privacy',
            'status' => 'draft',
            'created_by' => $this->admin->id,
            'updated_by' => $this->admin->id,
        ], $overrides));
    }

    public function test_can_list_pages(): void
    {
        $this->authHeader();
        $this->createPage(['page_code' => 'PRIVACY', 'slug' => 'privacy-policy']);
        $this->createPage(['page_code' => 'TERMS', 'page_title' => 'Terms of Service', 'slug' => 'terms-of-service']);

        $response = $this->getJson('/api/v1/admin/cms-pages');
        $response->assertOk()->assertJsonStructure(['success', 'data', 'meta']);
    }

    public function test_can_create_page(): void
    {
        $this->authHeader();
        $response = $this->postJson('/api/v1/admin/cms-pages', [
            'page_code' => 'ABOUT',
            'page_title' => 'About Us',
            'slug' => 'about-us',
            'content' => '<p>About our tiffin service</p>',
            'meta_title' => 'About Us',
            'meta_description' => 'About our company',
            'meta_keywords' => 'about,us',
            'status' => 'draft',
        ]);

        $response->assertCreated()->assertJsonStructure(['success', 'data']);
        $this->assertDatabaseHas('cms_pages', ['page_code' => 'ABOUT']);
    }

    public function test_can_show_page(): void
    {
        $this->authHeader();
        $page = $this->createPage();

        $response = $this->getJson("/api/v1/admin/cms-pages/{$page->uuid}");
        $response->assertOk()->assertJsonPath('data.page_code', 'PRIVACY');
    }

    public function test_can_update_page(): void
    {
        $this->authHeader();
        $page = $this->createPage();

        $response = $this->putJson("/api/v1/admin/cms-pages/{$page->uuid}", [
            'page_title' => 'Updated Privacy',
        ]);

        $response->assertOk()->assertJsonPath('data.page_title', 'Updated Privacy');
    }

    public function test_can_delete_page(): void
    {
        $this->authHeader();
        $page = $this->createPage();

        $response = $this->deleteJson("/api/v1/admin/cms-pages/{$page->uuid}");
        $response->assertOk();
        $this->assertSoftDeleted('cms_pages', ['id' => $page->id]);
    }

    public function test_can_publish_page(): void
    {
        $this->authHeader();
        $page = $this->createPage(['status' => 'draft']);

        $response = $this->patchJson("/api/v1/admin/cms-pages/{$page->uuid}/publish");
        $response->assertOk()->assertJsonPath('data.status', 'published');
    }

    public function test_can_archive_page(): void
    {
        $this->authHeader();
        $page = $this->createPage(['status' => 'published']);

        $response = $this->patchJson("/api/v1/admin/cms-pages/{$page->uuid}/archive");
        $response->assertOk()->assertJsonPath('data.status', 'archived');
    }

    public function test_can_get_stats(): void
    {
        $this->authHeader();
        $this->createPage(['page_code' => 'P1', 'slug' => 'p1', 'status' => 'published']);
        $this->createPage(['page_code' => 'P2', 'slug' => 'p2', 'status' => 'draft']);

        $response = $this->getJson('/api/v1/admin/cms-pages/stats');
        $response->assertOk()->assertJsonStructure(['success', 'data']);
    }

    public function test_can_public_show_by_slug(): void
    {
        $this->authHeader();
        $this->createPage(['slug' => 'privacy-policy', 'status' => 'published']);

        $response = $this->getJson('/api/v1/admin/cms-pages/public/privacy-policy');
        $response->assertOk()->assertJsonPath('data.slug', 'privacy-policy');
    }

    public function test_public_show_returns_not_found_for_draft(): void
    {
        $this->authHeader();
        $this->createPage(['slug' => 'draft-page', 'status' => 'draft']);

        $response = $this->getJson('/api/v1/admin/cms-pages/public/draft-page');
        $response->assertNotFound();
    }

    public function test_unauthenticated_cannot_access(): void
    {
        $response = $this->getJson('/api/v1/admin/cms-pages');
        $response->assertUnauthorized();
    }

    public function test_validation_error_for_missing_required_fields(): void
    {
        $this->authHeader();
        $response = $this->postJson('/api/v1/admin/cms-pages', []);
        $response->assertUnprocessable()->assertJsonValidationErrors(['page_code', 'page_title', 'slug']);
    }
}
