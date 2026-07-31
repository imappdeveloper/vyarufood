<?php

declare(strict_types=1);

namespace App\Exports\CustomerAddress;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class CustomerAddressTemplateExport implements FromCollection, WithHeadings, WithStyles
{
    public function collection(): Collection
    {
        return collect();
    }

    public function headings(): array
    {
        return [
            'Customer ID*',
            'Address Type (home/office/hostel/apartment/pg/other)',
            'House No',
            'Building Name',
            'Floor',
            'Street',
            'Landmark',
            'Address Line 1',
            'Address Line 2',
            'Country ID',
            'State ID',
            'City ID',
            'Area ID',
            'Delivery Zone ID',
            'Pincode ID',
            'Latitude',
            'Longitude',
            'Google Place ID',
            'Contact Person',
            'Contact Mobile',
            'Delivery Instruction',
            'Default (0/1)',
            'Verified (0/1)',
            'Status (active/inactive)',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true, 'size' => 12]]];
    }
}
