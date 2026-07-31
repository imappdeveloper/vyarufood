<?php
declare(strict_types=1);
namespace App\Exports;
use App\Models\Master\Country;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class CountryExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $countries;
    protected array $filters;

    public function __construct(?array $filters = null)
    {
        $this->filters = $filters ?? [];
    }

    public function collection()
    {
        $query = Country::query();
        if (!empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }
        if (!empty($this->filters['search'])) {
            $query->where(function ($q) {
                $q->where('name', 'LIKE', "%{$this->filters['search']}%")
                  ->orWhere('iso2', 'LIKE', "%{$this->filters['search']}%")
                  ->orWhere('iso3', 'LIKE', "%{$this->filters['search']}%");
            });
        }
        return $query->orderBy('sort_order')->orderBy('name')->get();
    }

    public function headings(): array
    {
        return ['Name', 'ISO2', 'ISO3', 'Numeric Code', 'Phone Code', 'Capital', 'Currency Code', 'Currency Name', 'Currency Symbol', 'Region', 'Sub Region', 'Nationality', 'Status', 'Is Default'];
    }

    public function map($country): array
    {
        return [
            $country->name, $country->iso2, $country->iso3, $country->numeric_code,
            $country->phone_code, $country->capital, $country->currency_code,
            $country->currency_name, $country->currency_symbol, $country->region,
            $country->subregion, $country->nationality, $country->status,
            $country->is_default ? 'Yes' : 'No',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true, 'size' => 12]]];
    }
}
