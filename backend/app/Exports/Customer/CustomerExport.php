<?php

declare(strict_types=1);

namespace App\Exports\Customer;

use App\Models\Customer;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class CustomerExport implements FromCollection, WithHeadings, WithMapping
{
    protected ?array $filters;

    public function __construct(?array $filters = null)
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = Customer::query()->with(['city']);

        if (! empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }

        if (! empty($this->filters['search'])) {
            $query->search($this->filters['search']);
        }

        return $query->orderBy('first_name', 'asc')->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'First Name',
            'Last Name',
            'Email',
            'Phone',
            'Country Code',
            'Gender',
            'Date of Birth',
            'Address',
            'City',
            'Pincode',
            'Status',
            'Blocked',
            'Wallet Balance',
            'Referral Code',
            'Email Verified',
            'Phone Verified',
            'Created At',
        ];
    }

    public function map($customer): array
    {
        return [
            $customer->id,
            $customer->first_name,
            $customer->last_name,
            $customer->email,
            $customer->phone,
            $customer->country_code,
            $customer->gender,
            $customer->date_of_birth?->format('Y-m-d'),
            $customer->address_line_1,
            $customer->city?->name,
            $customer->pincode,
            $customer->status instanceof \App\Enums\StatusEnum ? $customer->status->value : $customer->status,
            $customer->is_blocked ? 'Yes' : 'No',
            $customer->wallet_balance,
            $customer->referral_code,
            $customer->email_verified ? 'Yes' : 'No',
            $customer->phone_verified ? 'Yes' : 'No',
            $customer->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
