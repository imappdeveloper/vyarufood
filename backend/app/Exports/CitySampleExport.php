<?php
declare(strict_types=1);
namespace App\Exports;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class CitySampleExport implements FromCollection, WithHeadings, WithStyles
{
    public function collection()
    {
        return [
            ['India', 'Maharashtra', 'Mumbai', 'MUM', '19.0760', '72.8777', 'Asia/Kolkata', '12442373', '0', 'Yes', 'active', 'Yes'],
            ['India', 'Maharashtra', 'Pune', 'PUN', '18.5204', '73.8567', 'Asia/Kolkata', '3124458', '1', 'No', 'active', 'No'],
        ];
    }

    public function headings(): array
    {
        return ['Country', 'State', 'Name', 'City Code', 'Latitude', 'Longitude', 'Timezone', 'Population', 'Display Order', 'Metro', 'Status', 'Is Default'];
    }

    public function styles(Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true, 'size' => 12, 'color' => ['rgb' => 'FFFFFF']], 'fill' => ['fillType' => 'solid', 'color' => ['rgb' => '4F46E5']]]];
    }
}
