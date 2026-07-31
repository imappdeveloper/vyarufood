<?php

declare(strict_types=1);

namespace App\Imports\CustomerAddress;

use App\DTOs\CustomerAddress\CustomerAddressDTO;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Illuminate\Support\Collection;

class CustomerAddressImport implements ToCollection, WithHeadingRow, WithValidation
{
    protected int $successes = 0;
    protected array $failures = [];
    protected int $total = 0;

    public function rules(): array
    {
        return [
            'customer_id' => 'required|exists:customers,id',
            'address_type' => 'nullable|in:home,office,hostel,apartment,pg,other',
            'house_no' => 'nullable|string|max:50',
            'building_name' => 'nullable|string|max:255',
            'floor' => 'nullable|string|max:20',
            'street' => 'nullable|string|max:255',
            'landmark' => 'nullable|string|max:255',
            'address_line_1' => 'nullable|string|max:500',
            'address_line_2' => 'nullable|string|max:500',
            'country_id' => 'nullable|integer|exists:countries,id',
            'state_id' => 'nullable|integer|exists:states,id',
            'city_id' => 'nullable|integer|exists:cities,id',
            'area_id' => 'nullable|integer|exists:areas,id',
            'delivery_zone_id' => 'nullable|integer|exists:delivery_zones,id',
            'pincode_id' => 'nullable|integer|exists:pincodes,id',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'google_place_id' => 'nullable|string|max:255',
            'contact_person' => 'nullable|string|max:100',
            'contact_mobile' => 'nullable|string|max:20',
            'delivery_instruction' => 'nullable|string|max:500',
            'is_default' => 'nullable|boolean',
            'is_verified' => 'nullable|boolean',
            'status' => 'nullable|in:active,inactive',
        ];
    }

    public function collection(Collection $rows): void
    {
        $this->total = $rows->count();

        DB::beginTransaction();

        try {
            foreach ($rows as $index => $row) {
                try {
                    $createdBy = auth()->guard('admin')->id();

                    $data = [
                        'customer_id' => $row['customer_id'] ?? 0,
                        'address_type' => $row['address_type'] ?? 'home',
                        'house_no' => $row['house_no'] ?? null,
                        'building_name' => $row['building_name'] ?? null,
                        'floor' => $row['floor'] ?? null,
                        'street' => $row['street'] ?? null,
                        'landmark' => $row['landmark'] ?? null,
                        'address_line_1' => $row['address_line_1'] ?? null,
                        'address_line_2' => $row['address_line_2'] ?? null,
                        'country_id' => $row['country_id'] ?? null,
                        'state_id' => $row['state_id'] ?? null,
                        'city_id' => $row['city_id'] ?? null,
                        'area_id' => $row['area_id'] ?? null,
                        'delivery_zone_id' => $row['delivery_zone_id'] ?? null,
                        'pincode_id' => $row['pincode_id'] ?? null,
                        'latitude' => $row['latitude'] ?? null,
                        'longitude' => $row['longitude'] ?? null,
                        'google_place_id' => $row['google_place_id'] ?? null,
                        'contact_person' => $row['contact_person'] ?? null,
                        'contact_mobile' => $row['contact_mobile'] ?? null,
                        'delivery_instruction' => $row['delivery_instruction'] ?? null,
                        'is_default' => filter_var($row['is_default'] ?? false, FILTER_VALIDATE_BOOLEAN),
                        'is_verified' => filter_var($row['is_verified'] ?? false, FILTER_VALIDATE_BOOLEAN),
                        'status' => $row['status'] ?? 'active',
                        'created_by' => $createdBy,
                    ];

                    $dto = CustomerAddressDTO::fromArray($data);
                    app(\App\Repositories\CustomerAddress\CustomerAddressRepositoryInterface::class)->create($dto, $createdBy);
                    $this->successes++;
                } catch (\Exception $e) {
                    Log::error('CustomerAddress import row failed', [
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
            Log::error('CustomerAddress import transaction failed', ['error' => $e->getMessage()]);
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
