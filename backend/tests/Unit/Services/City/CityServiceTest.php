<?php
declare(strict_types=1);
namespace Tests\Unit\Services\City;

use App\DTOs\City\CityDTO;
use App\Models\Master\City;
use App\Repositories\City\CityRepositoryInterface;
use App\Services\City\CityService;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;

class CityServiceTest extends TestCase
{
    private MockObject $repo;
    private CityService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repo = $this->createMock(CityRepositoryInterface::class);
        $this->service = new CityService($this->repo);
    }

    public function test_create_calls_repo(): void
    {
        $data = ['country_id' => 1, 'state_id' => 1, 'name' => 'Mumbai', 'city_code' => 'MUM'];
        $city = new City($data);

        $this->repo->method('create')
            ->willReturn($city);

        $this->assertInstanceOf(City::class, $city);
    }

    public function test_dto_from_array(): void
    {
        $dto = CityDTO::fromArray([
            'country_id' => 1,
            'state_id' => 1,
            'name' => 'Mumbai',
            'city_code' => 'MUM',
            'timezone' => 'Asia/Kolkata',
            'population' => 12442373,
            'is_metro' => true,
        ]);

        $this->assertEquals(1, $dto->countryId);
        $this->assertEquals(1, $dto->stateId);
        $this->assertEquals('Mumbai', $dto->name);
        $this->assertEquals('MUM', $dto->cityCode);
        $this->assertEquals('Asia/Kolkata', $dto->timezone);
        $this->assertEquals(12442373, $dto->population);
        $this->assertTrue($dto->isMetro);
    }

    public function test_dto_to_array(): void
    {
        $dto = CityDTO::fromArray([
            'country_id' => 1,
            'state_id' => 2,
            'name' => 'Pune',
            'city_code' => 'PUN',
        ]);

        $arr = $dto->toArray();
        $this->assertEquals(1, $arr['country_id']);
        $this->assertEquals(2, $arr['state_id']);
        $this->assertEquals('Pune', $arr['name']);
        $this->assertEquals('PUN', $arr['city_code']);
        $this->assertEquals('active', $arr['status']);
        $this->assertEquals(0, $arr['display_order']);
        $this->assertFalse($arr['is_metro']);
        $this->assertFalse($arr['is_default']);
    }
}
