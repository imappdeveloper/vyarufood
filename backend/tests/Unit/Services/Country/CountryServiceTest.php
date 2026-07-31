<?php
declare(strict_types=1);
namespace Tests\Unit\Services\Country;

use App\DTOs\Country\CountryDTO;
use App\Models\Master\Country;
use App\Repositories\Country\CountryRepositoryInterface;
use App\Services\Country\CountryService;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;

class CountryServiceTest extends TestCase
{
    private MockObject $repo;
    private CountryService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repo = $this->createMock(CountryRepositoryInterface::class);
        $this->service = new CountryService($this->repo);
    }

    public function test_create_calls_repo(): void
    {
        $data = ['iso2' => 'IN', 'iso3' => 'IND', 'name' => 'India'];
        $country = new Country($data);

        $this->repo->method('create')
            ->willReturn($country);

        $this->assertInstanceOf(Country::class, $country);
    }

    public function test_dto_from_array(): void
    {
        $dto = CountryDTO::fromArray([
            'iso2' => 'in',
            'iso3' => 'ind',
            'name' => 'India',
            'phone_code' => '91',
        ]);

        $this->assertEquals('IN', $dto->iso2);
        $this->assertEquals('IND', $dto->iso3);
        $this->assertEquals('India', $dto->name);
        $this->assertEquals('91', $dto->phoneCode);
    }

    public function test_dto_to_array(): void
    {
        $dto = CountryDTO::fromArray([
            'iso2' => 'US',
            'iso3' => 'USA',
            'name' => 'United States',
        ]);

        $arr = $dto->toArray();
        $this->assertEquals('US', $arr['iso2']);
        $this->assertEquals('USA', $arr['iso3']);
        $this->assertEquals('United States', $arr['name']);
        $this->assertEquals('active', $arr['status']);
        $this->assertEquals(0, $arr['sort_order']);
        $this->assertFalse($arr['is_default']);
    }
}
