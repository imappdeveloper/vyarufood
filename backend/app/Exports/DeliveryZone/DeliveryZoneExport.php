<?php

declare(strict_types=1);

namespace App\Exports\DeliveryZone;

use App\Http\Resources\DeliveryZone\DeliveryZoneResource;
use App\Services\DeliveryZone\DeliveryZoneServiceInterface;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class DeliveryZoneExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    public function __construct(
        protected ?array $filters = null,
        protected DeliveryZoneServiceInterface $deliveryZoneService,
    ) {}

    public function collection()
    {
        return $this->deliveryZoneService->export($this->filters);
    }

    public function headings(): array
    {
        return [
            'ID',
            'Zone Name',
            'Zone Code',
            'Country',
            'State',
            'City',
            'Area',
            'Delivery Radius',
            'Min Order',
            'Delivery Charge',
            'Free Delivery Above',
            'Est. Time',
            'Priority',
            'Status',
            'Default',
            'Remarks',
            'Created At',
        ];
    }

    public function map($row): array
    {
        $resource = new DeliveryZoneResource($row);
        $data = $resource->toArray(request());

        return [
            $data['id'],
            $data['zone_name'],
            $data['zone_code'],
            $data['country']['name'] ?? '',
            $data['state']['name'] ?? '',
            $data['city']['name'] ?? '',
            $data['area']['name'] ?? '',
            $data['delivery_radius'],
            $data['minimum_order_amount'],
            $data['delivery_charge'],
            $data['free_delivery_above'],
            $data['estimated_delivery_time'],
            $data['priority'],
            $data['status_label'],
            $data['is_default'] ? 'Yes' : 'No',
            $data['remarks'],
            $data['created_at'],
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true, 'size' => 12]]];
    }
}
