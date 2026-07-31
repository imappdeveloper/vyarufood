<?php
declare(strict_types=1);
namespace App\Exports;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class StateSampleExport implements FromCollection, WithHeadings, WithStyles
{
    public function collection()
    {
        return [
            ['India', 'Maharashtra', 'MH', 'MH', '27', '19.7515', '75.7139', 'active', '0', 'Yes'],
            ['India', 'Karnataka', 'KA', 'KA', '29', '15.3173', '75.7139', 'active', '0', 'No'],
        ];
    }

    public function headings(): array
    {
        return ['Country', 'Name', 'State Code', 'Abbreviation', 'GST Code', 'Latitude', 'Longitude', 'Status', 'Sort Order', 'Is Default'];
    }

    public function styles(Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true, 'size' => 12, 'color' => ['rgb' => 'FFFFFF']], 'fill' => ['fillType' => 'solid', 'color' => ['rgb' => '4F46E5']]]];
    }
}
