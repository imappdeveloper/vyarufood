<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Master\Pincode;

class PincodeTest extends TestCase
{
    public function test_pincode_model_uses_has_uuid(): void
    {
        $model = new Pincode();
        $this->assertTrue(in_array('App\Traits\HasUuid', class_uses($model)));
    }

    public function test_pincode_model_uses_has_audit_fields(): void
    {
        $model = new Pincode();
        $this->assertTrue(in_array('App\Traits\HasAuditFields', class_uses($model)));
    }

    public function test_pincode_model_uses_soft_deletes(): void
    {
        $model = new Pincode();
        $this->assertTrue(method_exists($model, 'trashed'));
    }

    public function test_pincode_model_uses_filterable(): void
    {
        $model = new Pincode();
        $this->assertTrue(in_array('App\Traits\Filterable', class_uses($model)));
    }

    public function test_pincode_has_correct_fillable_fields(): void
    {
        $model = new Pincode();
        $fillable = $model->getFillable();

        $this->assertContains('uuid', $fillable);
        $this->assertContains('delivery_zone_id', $fillable);
        $this->assertContains('country_id', $fillable);
        $this->assertContains('state_id', $fillable);
        $this->assertContains('city_id', $fillable);
        $this->assertContains('area_id', $fillable);
        $this->assertContains('pincode', $fillable);
        $this->assertContains('office_name', $fillable);
        $this->assertContains('district', $fillable);
        $this->assertContains('latitude', $fillable);
        $this->assertContains('longitude', $fillable);
        $this->assertContains('status', $fillable);
        $this->assertContains('is_serviceable', $fillable);
        $this->assertContains('created_by', $fillable);
        $this->assertContains('updated_by', $fillable);
        $this->assertContains('deleted_by', $fillable);
    }

    public function test_pincode_model_has_route_key_uuid(): void
    {
        $model = new Pincode();
        $this->assertEquals('uuid', $model->getRouteKeyName());
    }

    public function test_pincode_belongs_to_delivery_zone(): void
    {
        $model = new Pincode();
        $this->assertTrue(method_exists($model, 'deliveryZone'));
    }

    public function test_pincode_belongs_to_country(): void
    {
        $model = new Pincode();
        $this->assertTrue(method_exists($model, 'country'));
    }

    public function test_pincode_belongs_to_state(): void
    {
        $model = new Pincode();
        $this->assertTrue(method_exists($model, 'state'));
    }

    public function test_pincode_belongs_to_city(): void
    {
        $model = new Pincode();
        $this->assertTrue(method_exists($model, 'city'));
    }

    public function test_pincode_belongs_to_area(): void
    {
        $model = new Pincode();
        $this->assertTrue(method_exists($model, 'area'));
    }
}
