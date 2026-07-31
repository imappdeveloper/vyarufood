<?php
declare(strict_types=1);
namespace Tests\Unit\Repositories\Country;

use App\Models\Master\Country;
use PHPUnit\Framework\TestCase;

class CountryRepositoryTest extends TestCase
{
    public function test_country_model_uses_soft_deletes(): void
    {
        $model = new Country();
        $this->assertTrue(in_array('Illuminate\Database\Eloquent\SoftDeletes', class_uses($model)));
    }

    public function test_country_model_uses_has_uuid(): void
    {
        $model = new Country();
        $this->assertTrue(in_array('App\Traits\HasUuid', class_uses($model)));
    }

    public function test_country_route_key_name_is_uuid(): void
    {
        $model = new Country();
        $this->assertEquals('uuid', $model->getRouteKeyName());
    }

    public function test_country_fillable_fields(): void
    {
        $model = new Country();
        $this->assertContains('name', $model->getFillable());
        $this->assertContains('iso2', $model->getFillable());
        $this->assertContains('iso3', $model->getFillable());
        $this->assertContains('phone_code', $model->getFillable());
        $this->assertContains('currency_code', $model->getFillable());
        $this->assertContains('status', $model->getFillable());
        $this->assertContains('is_default', $model->getFillable());
    }
}
