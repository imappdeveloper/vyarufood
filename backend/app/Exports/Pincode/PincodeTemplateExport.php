<?php

declare(strict_types=1);

namespace App\Exports\Pincode;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PincodeTemplateExport implements FromCollection, WithHeadings, WithStyles
{
    public function collection(): Collection
    {
        return collect();
    }

    public function headings(): array
    {
        return [
            'Pincode*',
            'Delivery Zone ID*',
            'Country ID*',
            'State ID*',
            'City ID*',
            'Area ID',
            'Office Name',
            'District',
            'Latitude',
            'Longitude',
            'Status (active/inactive)',
            'Serviceable (0/1)',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true, 'size' => 12]]];
    }
}
