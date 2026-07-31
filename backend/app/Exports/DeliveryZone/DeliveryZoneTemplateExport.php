<?php

declare(strict_types=1);

namespace App\Exports\DeliveryZone;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class DeliveryZoneTemplateExport implements FromCollection, WithHeadings, WithStyles
{
    public function collection(): Collection
    {
        return collect();
    }

    public function headings(): array
    {
        return [
            'Zone Name*',
            'Zone Code*',
            'Country ID*',
            'State ID*',
            'City ID*',
            'Area ID',
            'Delivery Radius',
            'Min Order Amount',
            'Delivery Charge',
            'Free Delivery Above',
            'Est. Time (min)',
            'Priority',
            'Status (active/inactive)',
            'Default (0/1)',
            'Remarks',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true, 'size' => 12]]];
    }
}
