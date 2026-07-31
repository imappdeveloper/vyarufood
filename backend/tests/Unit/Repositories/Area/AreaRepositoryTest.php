<?php

declare(strict_types=1);

namespace Tests\Unit\Repositories\Area;

use Tests\TestCase;
use App\Models\Master\Area;

class AreaRepositoryTest extends TestCase
{
    public function test_area_model_uses_soft_deletes(): void
    {
        $area = new Area();
        $this->assertTrue(method_exists($area, 'trashed'));
    }

    public function test_area_model_uses_has_uuid(): void
    {
        $area = new Area();
        $this->assertTrue(in_array('App\Traits\HasUuid', class_uses($area)));
    }

    public function test_area_route_key_name_is_uuid(): void
    {
        $area = new Area();
        $this->assertEquals('uuid', $area->getRouteKeyName());
    }

    public function test_area_fillable_fields(): void
    {
        $area = new Area();
        $this->assertContains('name', $area->getFillable());
        $this->assertContains('city_id', $area->getFillable());
        $this->assertContains('area_code', $area->getFillable());
        $this->assertContains('is_serviceable', $area->getFillable());
    }

    public function test_area_belongs_to_country(): void
    {
        $area = new Area();
        $this->assertTrue(method_exists($area, 'country'));
    }

    public function test_area_belongs_to_state(): void
    {
        $area = new Area();
        $this->assertTrue(method_exists($area, 'state'));
    }

    public function test_area_belongs_to_city(): void
    {
        $area = new Area();
        $this->assertTrue(method_exists($area, 'city'));
    }
}
