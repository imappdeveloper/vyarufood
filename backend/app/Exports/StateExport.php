<?php
declare(strict_types=1);
namespace App\Exports;
use App\Models\Master\State;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class StateExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected array $filters;

    public function __construct(?array $filters = null)
    {
        $this->filters = $filters ?? [];
    }

    public function collection()
    {
        $query = State::with('country');
        if (!empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }
        if (!empty($this->filters['country_id'])) {
            $query->where('country_id', $this->filters['country_id']);
        }
        if (!empty($this->filters['search'])) {
            $query->where(function ($q) {
                $q->where('name', 'LIKE', "%{$this->filters['search']}%")
                  ->orWhere('state_code', 'LIKE', "%{$this->filters['search']}%");
            });
        }
        return $query->orderBy('sort_order')->orderBy('name')->get();
    }

    public function headings(): array
    {
        return ['Country', 'Name', 'State Code', 'Abbreviation', 'GST Code', 'Latitude', 'Longitude', 'Status', 'Sort Order', 'Is Default'];
    }

    public function map($state): array
    {
        return [
            $state->country->name ?? '',
            $state->name,
            $state->state_code,
            $state->abbreviation,
            $state->gst_code,
            $state->latitude,
            $state->longitude,
            $state->status,
            $state->sort_order,
            $state->is_default ? 'Yes' : 'No',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true, 'size' => 12]]];
    }
}
