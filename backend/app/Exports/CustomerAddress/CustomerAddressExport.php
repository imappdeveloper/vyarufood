<?php

declare(strict_types=1);

namespace App\Exports\CustomerAddress;

use App\Models\CustomerAddress;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class CustomerAddressExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    protected ?array $filters;

    public function __construct(?array $filters = null)
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = CustomerAddress::query()
            ->with(['customer', 'country', 'state', 'city', 'area', 'deliveryZone', 'pincode']);

        if (! empty($this->filters['customer_id'])) {
            $query->where('customer_id', $this->filters['customer_id']);
        }

        if (! empty($this->filters['address_type'])) {
            $query->where('address_type', $this->filters['address_type']);
        }

        if (! empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }

        if (! empty($this->filters['city_id'])) {
            $query->where('city_id', $this->filters['city_id']);
        }

        if (! empty($this->filters['search'])) {
            $query->search($this->filters['search']);
        }

        return $query->orderBy('id', 'desc')->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Customer ID',
            'Customer Name',
            'Address Type',
            'House No',
            'Building Name',
            'Floor',
            'Street',
            'Landmark',
            'Address Line 1',
            'Address Line 2',
            'Country',
            'State',
            'City',
            'Area',
            'Delivery Zone',
            'Pincode',
            'Latitude',
            'Longitude',
            'Contact Person',
            'Contact Mobile',
            'Delivery Instruction',
            'Default',
            'Verified',
            'Status',
            'Created At',
        ];
    }

    public function map($address): array
    {
        return [
            $address->id,
            $address->customer_id,
            $address->customer ? trim($address->customer->first_name . ' ' . $address->customer->last_name) : '',
            $address->address_type,
            $address->house_no,
            $address->building_name,
            $address->floor,
            $address->street,
            $address->landmark,
            $address->address_line_1,
            $address->address_line_2,
            $address->country?->name ?? '',
            $address->state?->name ?? '',
            $address->city?->name ?? '',
            $address->area?->name ?? '',
            $address->deliveryZone?->zone_name ?? '',
            $address->pincode?->pincode ?? '',
            $address->latitude,
            $address->longitude,
            $address->contact_person,
            $address->contact_mobile,
            $address->delivery_instruction,
            $address->is_default ? 'Yes' : 'No',
            $address->is_verified ? 'Yes' : 'No',
            $address->status instanceof \App\Enums\StatusEnum ? $address->status->value : $address->status,
            $address->created_at?->format('Y-m-d H:i:s'),
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true, 'size' => 12]]];
    }
}
