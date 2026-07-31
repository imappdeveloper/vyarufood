<?php

declare(strict_types=1);

namespace App\Imports\Pincode;

use App\DTOs\Pincode\PincodeDTO;
use App\Services\Pincode\PincodeServiceInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class PincodeImport implements ToCollection, WithHeadingRow, WithValidation
{
    protected int $successes = 0;
    protected array $failures = [];
    protected int $total = 0;

    public function __construct(
        protected PincodeServiceInterface $pincodeService,
    ) {}

    public function rules(): array
    {
        return [
            'pincode' => 'required|string|max:10|unique:pincodes,pincode',
            'delivery_zone_id' => 'required|exists:delivery_zones,id',
            'country_id' => 'required|exists:countries,id',
            'state_id' => 'required|exists:states,id',
            'city_id' => 'required|exists:cities,id',
            'area_id' => 'nullable|exists:areas,id',
            'office_name' => 'nullable',
            'district' => 'nullable',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ];
    }

    public function collection(Collection $rows): void
    {
        $this->total = $rows->count();

        DB::beginTransaction();

        try {
            foreach ($rows as $index => $row) {
                try {
                    $data = [
                        'pincode' => $row['pincode'] ?? '',
                        'delivery_zone_id' => $row['delivery_zone_id'] ?? 0,
                        'country_id' => $row['country_id'] ?? 0,
                        'state_id' => $row['state_id'] ?? 0,
                        'city_id' => $row['city_id'] ?? 0,
                        'area_id' => $row['area_id'] ?? null,
                        'office_name' => $row['office_name'] ?? null,
                        'district' => $row['district'] ?? null,
                        'latitude' => $row['latitude'] ?? null,
                        'longitude' => $row['longitude'] ?? null,
                        'status' => $row['status'] ?? 'active',
                        'created_by' => auth()->guard('admin')->id(),
                    ];

                    $dto = PincodeDTO::fromArray($data);
                    $this->pincodeService->create($dto->toArray());
                    $this->successes++;
                } catch (\Exception $e) {
                    Log::error('Pincode import row failed', [
                        'row' => $index + 1,
                        'error' => $e->getMessage(),
                    ]);
                    $this->failures[] = [
                        'row' => $index + 1,
                        'error' => $e->getMessage(),
                    ];
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Pincode import transaction failed', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    public function getResult(): array
    {
        return [
            'successes' => $this->successes,
            'failures' => $this->failures,
            'total' => $this->total,
        ];
    }
}
