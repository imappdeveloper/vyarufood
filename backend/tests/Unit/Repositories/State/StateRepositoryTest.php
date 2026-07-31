<?php
declare(strict_types=1);
namespace Tests\Unit\Repositories\State;

use App\Models\Master\State;
use PHPUnit\Framework\TestCase;

class StateRepositoryTest extends TestCase
{
    public function test_state_model_uses_soft_deletes(): void
    {
        $model = new State();
        $this->assertTrue(in_array('Illuminate\Database\Eloquent\SoftDeletes', class_uses($model)));
    }

    public function test_state_model_uses_has_uuid(): void
    {
        $model = new State();
        $this->assertTrue(in_array('App\Traits\HasUuid', class_uses($model)));
    }

    public function test_state_route_key_name_is_uuid(): void
    {
        $model = new State();
        $this->assertEquals('uuid', $model->getRouteKeyName());
    }

    public function test_state_fillable_fields(): void
    {
        $model = new State();
        $this->assertContains('name', $model->getFillable());
        $this->assertContains('country_id', $model->getFillable());
        $this->assertContains('state_code', $model->getFillable());
        $this->assertContains('abbreviation', $model->getFillable());
        $this->assertContains('gst_code', $model->getFillable());
        $this->assertContains('status', $model->getFillable());
        $this->assertContains('is_default', $model->getFillable());
    }

    public function test_state_belongs_to_country(): void
    {
        $model = new State();
        $this->assertTrue(method_exists($model, 'country'));
    }
}
