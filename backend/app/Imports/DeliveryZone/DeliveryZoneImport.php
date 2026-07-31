<?php

declare(strict_types=1);

namespace App\Imports\DeliveryZone;

use App\DTOs\DeliveryZone\DeliveryZoneDTO;
use App\Services\DeliveryZone\DeliveryZoneServiceInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class DeliveryZoneImport implements ToCollection, WithHeadingRow, WithValidation
{
    protected int $successes = 0;
    protected array $failures = [];
    protected int $total = 0;

    public function __construct(
        protected DeliveryZoneServiceInterface $deliveryZoneService,
    ) {}

    public function rules(): array
    {
        return [
            'zone_name' => 'required|string|max:255',
            'zone_code' => 'required|string|max:50',
            'country_id' => 'required|exists:countries,id',
            'state_id' => 'required|exists:states,id',
            'city_id' => 'required|exists:cities,id',
            'area_id' => 'nullable|exists:areas,id',
            'delivery_radius' => 'nullable|numeric|min:0',
            'minimum_order_amount' => 'nullable|numeric|min:0',
            'delivery_charge' => 'nullable|numeric|min:0',
            'free_delivery_above' => 'nullable|numeric|min:0',
            'estimated_delivery_time' => 'nullable|integer|min:1',
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
                    $data = [
                        'zone_name' => $row['zone_name'] ?? '',
                        'zone_code' => $row['zone_code'] ?? '',
                        'country_id' => $row['country_id'] ?? 0,
                        'state_id' => $row['state_id'] ?? 0,
                        'city_id' => $row['city_id'] ?? 0,
                        'area_id' => $row['area_id'] ?? null,
                        'delivery_radius' => $row['delivery_radius'] ?? null,
                        'minimum_order_amount' => $row['minimum_order_amount'] ?? null,
                        'delivery_charge' => $row['delivery_charge'] ?? null,
                        'free_delivery_above' => $row['free_delivery_above'] ?? null,
                        'estimated_delivery_time' => $row['estimated_delivery_time'] ?? null,
                        'status' => $row['status'] ?? 'active',
                        'created_by' => auth()->guard('admin')->id(),
                    ];

                    $dto = DeliveryZoneDTO::fromArray($data);
                    $this->deliveryZoneService->create($dto->toArray());
                    $this->successes++;
                } catch (\Exception $e) {
                    Log::error('DeliveryZone import row failed', [
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
            Log::error('DeliveryZone import transaction failed', ['error' => $e->getMessage()]);
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
