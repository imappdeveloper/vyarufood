<?php
declare(strict_types=1);
namespace App\Exports;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class CountrySampleExport implements FromCollection, WithHeadings, WithStyles
{
    public function collection()
    {
        return [
            ['India', 'IN', 'IND', '356', '91', 'New Delhi', 'INR', 'Indian Rupee', '₹', 'Asia', 'Southern Asia', 'Indian', 'active', '0', 'Yes'],
            ['United States', 'US', 'USA', '840', '1', 'Washington D.C.', 'USD', 'United States Dollar', '$', 'Americas', 'Northern America', 'American', 'active', '0', 'No'],
        ];
    }

    public function headings(): array
    {
        return ['Name', 'ISO2', 'ISO3', 'Numeric Code', 'Phone Code', 'Capital', 'Currency Code', 'Currency Name', 'Currency Symbol', 'Region', 'Sub Region', 'Nationality', 'Status', 'Sort Order', 'Is Default'];
    }

    public function styles(Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true, 'size' => 12, 'color' => ['rgb' => 'FFFFFF']], 'fill' => ['fillType' => 'solid', 'color' => ['rgb' => '4F46E5']]]];
    }
}
