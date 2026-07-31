<?php
declare(strict_types=1);
namespace App\Exports;
use App\Models\Master\City;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class CityExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected array $filters;

    public function __construct(?array $filters = null)
    {
        $this->filters = $filters ?? [];
    }

    public function collection()
    {
        $query = City::with(['country', 'state']);
        if (!empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }
        if (!empty($this->filters['country_id'])) {
            $query->where('country_id', $this->filters['country_id']);
        }
        if (!empty($this->filters['state_id'])) {
            $query->where('state_id', $this->filters['state_id']);
        }
        if (!empty($this->filters['search'])) {
            $query->where(function ($q) {
                $q->where('name', 'LIKE', "%{$this->filters['search']}%")
                  ->orWhere('city_code', 'LIKE', "%{$this->filters['search']}%");
            });
        }
        return $query->orderBy('display_order')->orderBy('name')->get();
    }

    public function headings(): array
    {
        return ['Country', 'State', 'Name', 'City Code', 'Latitude', 'Longitude', 'Timezone', 'Population', 'Display Order', 'Metro', 'Status', 'Is Default'];
    }

    public function map($city): array
    {
        return [
            $city->country->name ?? '',
            $city->state->name ?? '',
            $city->name,
            $city->city_code,
            $city->latitude,
            $city->longitude,
            $city->timezone,
            $city->population,
            $city->display_order,
            $city->is_metro ? 'Yes' : 'No',
            $city->status,
            $city->is_default ? 'Yes' : 'No',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true, 'size' => 12]]];
    }
}
