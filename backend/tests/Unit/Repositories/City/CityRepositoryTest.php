<?php
declare(strict_types=1);
namespace Tests\Unit\Repositories\City;

use App\Models\Master\City;
use PHPUnit\Framework\TestCase;

class CityRepositoryTest extends TestCase
{
    public function test_city_model_uses_soft_deletes(): void
    {
        $model = new City();
        $this->assertTrue(in_array('Illuminate\Database\Eloquent\SoftDeletes', class_uses($model)));
    }

    public function test_city_model_uses_has_uuid(): void
    {
        $model = new City();
        $this->assertTrue(in_array('App\Traits\HasUuid', class_uses($model)));
    }

    public function test_city_route_key_name_is_uuid(): void
    {
        $model = new City();
        $this->assertEquals('uuid', $model->getRouteKeyName());
    }

    public function test_city_fillable_fields(): void
    {
        $model = new City();
        $this->assertContains('name', $model->getFillable());
        $this->assertContains('country_id', $model->getFillable());
        $this->assertContains('state_id', $model->getFillable());
        $this->assertContains('city_code', $model->getFillable());
        $this->assertContains('timezone', $model->getFillable());
        $this->assertContains('population', $model->getFillable());
        $this->assertContains('is_metro', $model->getFillable());
        $this->assertContains('status', $model->getFillable());
        $this->assertContains('is_default', $model->getFillable());
    }

    public function test_city_belongs_to_country(): void
    {
        $model = new City();
        $this->assertTrue(method_exists($model, 'country'));
    }

    public function test_city_belongs_to_state(): void
    {
        $model = new City();
        $this->assertTrue(method_exists($model, 'state'));
    }
}
