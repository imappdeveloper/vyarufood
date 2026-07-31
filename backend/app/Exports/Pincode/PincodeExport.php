<?php

declare(strict_types=1);

namespace App\Exports\Pincode;

use App\Http\Resources\Pincode\PincodeResource;
use App\Services\Pincode\PincodeServiceInterface;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PincodeExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    public function __construct(
        protected ?array $filters = null,
        protected PincodeServiceInterface $pincodeService,
    ) {}

    public function collection()
    {
        return $this->pincodeService->export($this->filters);
    }

    public function headings(): array
    {
        return [
            'ID',
            'Pincode',
            'Office Name',
            'District',
            'Delivery Zone',
            'Country',
            'State',
            'City',
            'Area',
            'Latitude',
            'Longitude',
            'Serviceable',
            'Status',
            'Created At',
        ];
    }

    public function map($row): array
    {
        $resource = new PincodeResource($row);
        $data = $resource->toArray(request());

        return [
            $data['id'],
            $data['pincode'],
            $data['office_name'],
            $data['district'],
            $data['deliveryZone']['zone_name'] ?? '',
            $data['country']['name'] ?? '',
            $data['state']['name'] ?? '',
            $data['city']['name'] ?? '',
            $data['area']['name'] ?? '',
            $data['latitude'],
            $data['longitude'],
            $data['is_serviceable'] ? 'Yes' : 'No',
            $data['status_label'],
            $data['created_at'],
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true, 'size' => 12]]];
    }
}
