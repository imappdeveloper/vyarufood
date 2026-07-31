<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Master\DeliveryZone;

class DeliveryZoneTest extends TestCase
{
    public function test_delivery_zone_model_uses_has_uuid(): void
    {
        $model = new DeliveryZone();
        $this->assertTrue(in_array('App\Traits\HasUuid', class_uses($model)));
    }

    public function test_delivery_zone_model_uses_has_audit_fields(): void
    {
        $model = new DeliveryZone();
        $this->assertTrue(in_array('App\Traits\HasAuditFields', class_uses($model)));
    }

    public function test_delivery_zone_model_uses_soft_deletes(): void
    {
        $model = new DeliveryZone();
        $this->assertTrue(method_exists($model, 'trashed'));
    }

    public function test_delivery_zone_model_uses_filterable(): void
    {
        $model = new DeliveryZone();
        $this->assertTrue(in_array('App\Traits\Filterable', class_uses($model)));
    }

    public function test_delivery_zone_has_correct_fillable_fields(): void
    {
        $model = new DeliveryZone();
        $fillable = $model->getFillable();

        $this->assertContains('uuid', $fillable);
        $this->assertContains('country_id', $fillable);
        $this->assertContains('state_id', $fillable);
        $this->assertContains('city_id', $fillable);
        $this->assertContains('area_id', $fillable);
        $this->assertContains('zone_name', $fillable);
        $this->assertContains('zone_code', $fillable);
        $this->assertContains('description', $fillable);
        $this->assertContains('delivery_radius', $fillable);
        $this->assertContains('minimum_order_amount', $fillable);
        $this->assertContains('delivery_charge', $fillable);
        $this->assertContains('free_delivery_above', $fillable);
        $this->assertContains('estimated_delivery_time', $fillable);
        $this->assertContains('maximum_orders_per_slot', $fillable);
        $this->assertContains('priority', $fillable);
        $this->assertContains('status', $fillable);
        $this->assertContains('is_default', $fillable);
        $this->assertContains('remarks', $fillable);
        $this->assertContains('created_by', $fillable);
        $this->assertContains('updated_by', $fillable);
        $this->assertContains('deleted_by', $fillable);
    }

    public function test_delivery_zone_model_has_route_key_uuid(): void
    {
        $model = new DeliveryZone();
        $this->assertEquals('uuid', $model->getRouteKeyName());
    }

    public function test_delivery_zone_belongs_to_country(): void
    {
        $model = new DeliveryZone();
        $this->assertTrue(method_exists($model, 'country'));
    }

    public function test_delivery_zone_belongs_to_state(): void
    {
        $model = new DeliveryZone();
        $this->assertTrue(method_exists($model, 'state'));
    }

    public function test_delivery_zone_belongs_to_city(): void
    {
        $model = new DeliveryZone();
        $this->assertTrue(method_exists($model, 'city'));
    }

    public function test_delivery_zone_has_many_pincodes(): void
    {
        $model = new DeliveryZone();
        $this->assertTrue(method_exists($model, 'pincodes'));
    }

    public function test_delivery_zone_has_many_delivery_slots(): void
    {
        $model = new DeliveryZone();
        $this->assertTrue(method_exists($model, 'deliverySlots'));
    }
}
