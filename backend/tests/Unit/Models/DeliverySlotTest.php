<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Master\DeliverySlot;

class DeliverySlotTest extends TestCase
{
    public function test_delivery_slot_model_uses_has_uuid(): void
    {
        $model = new DeliverySlot();
        $this->assertTrue(in_array('App\Traits\HasUuid', class_uses($model)));
    }

    public function test_delivery_slot_model_uses_soft_deletes(): void
    {
        $model = new DeliverySlot();
        $this->assertTrue(method_exists($model, 'trashed'));
    }

    public function test_delivery_slot_model_uses_filterable(): void
    {
        $model = new DeliverySlot();
        $this->assertTrue(in_array('App\Traits\Filterable', class_uses($model)));
    }

    public function test_delivery_slot_has_correct_fillable_fields(): void
    {
        $model = new DeliverySlot();
        $fillable = $model->getFillable();

        $this->assertContains('uuid', $fillable);
        $this->assertContains('delivery_zone_id', $fillable);
        $this->assertContains('slot_name', $fillable);
        $this->assertContains('start_time', $fillable);
        $this->assertContains('end_time', $fillable);
        $this->assertContains('maximum_orders', $fillable);
        $this->assertContains('cutoff_time', $fillable);
        $this->assertContains('status', $fillable);
    }

    public function test_delivery_slot_model_has_route_key_uuid(): void
    {
        $model = new DeliverySlot();
        $this->assertEquals('uuid', $model->getRouteKeyName());
    }

    public function test_delivery_slot_belongs_to_delivery_zone(): void
    {
        $model = new DeliverySlot();
        $this->assertTrue(method_exists($model, 'deliveryZone'));
    }
}
