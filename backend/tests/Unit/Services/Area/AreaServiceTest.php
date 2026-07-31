<?php

declare(strict_types=1);

namespace Tests\Unit\Services\Area;

use Tests\TestCase;
use App\DTOs\Area\AreaDTO;

class AreaServiceTest extends TestCase
{
    public function test_dto_from_array(): void
    {
        $dto = AreaDTO::fromArray([
            'country_id' => 1,
            'state_id' => 2,
            'city_id' => 3,
            'name' => 'Andheri West',
            'area_code' => 'AND-W',
            'delivery_radius' => 5.0,
            'minimum_order_amount' => 150.00,
            'delivery_charge' => 20.00,
            'estimated_delivery_time' => 30,
            'is_serviceable' => true,
            'is_default' => false,
        ]);

        $this->assertEquals(1, $dto->countryId);
        $this->assertEquals(2, $dto->stateId);
        $this->assertEquals(3, $dto->cityId);
        $this->assertEquals('Andheri West', $dto->name);
        $this->assertEquals('AND-W', $dto->areaCode);
        $this->assertEquals(5.0, $dto->deliveryRadius);
        $this->assertTrue($dto->isServiceable);
    }

    public function test_dto_to_array(): void
    {
        $dto = AreaDTO::fromArray([
            'country_id' => 1,
            'state_id' => 2,
            'city_id' => 3,
            'name' => 'Test Area',
            'area_code' => 'TST',
        ]);

        $arr = $dto->toArray();
        $this->assertArrayHasKey('country_id', $arr);
        $this->assertArrayHasKey('area_code', $arr);
        $this->assertEquals('Test Area', $arr['name']);
    }
}
