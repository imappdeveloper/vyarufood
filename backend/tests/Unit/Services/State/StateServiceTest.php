<?php
declare(strict_types=1);
namespace Tests\Unit\Services\State;

use App\DTOs\State\StateDTO;
use App\Models\Master\State;
use App\Repositories\State\StateRepositoryInterface;
use App\Services\State\StateService;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;

class StateServiceTest extends TestCase
{
    private MockObject $repo;
    private StateService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repo = $this->createMock(StateRepositoryInterface::class);
        $this->service = new StateService($this->repo);
    }

    public function test_create_calls_repo(): void
    {
        $data = ['country_id' => 1, 'name' => 'Maharashtra'];
        $state = new State($data);

        $this->repo->method('create')
            ->willReturn($state);

        $this->assertInstanceOf(State::class, $state);
    }

    public function test_dto_from_array(): void
    {
        $dto = StateDTO::fromArray([
            'country_id' => 1,
            'name' => 'Maharashtra',
            'state_code' => 'MH',
            'gst_code' => '27',
        ]);

        $this->assertEquals(1, $dto->countryId);
        $this->assertEquals('Maharashtra', $dto->name);
        $this->assertEquals('MH', $dto->stateCode);
        $this->assertEquals('27', $dto->gstCode);
    }

    public function test_dto_to_array(): void
    {
        $dto = StateDTO::fromArray([
            'country_id' => 1,
            'name' => 'Karnataka',
            'state_code' => 'KA',
        ]);

        $arr = $dto->toArray();
        $this->assertEquals(1, $arr['country_id']);
        $this->assertEquals('Karnataka', $arr['name']);
        $this->assertEquals('KA', $arr['state_code']);
        $this->assertEquals('active', $arr['status']);
        $this->assertEquals(0, $arr['sort_order']);
        $this->assertFalse($arr['is_default']);
    }
}
