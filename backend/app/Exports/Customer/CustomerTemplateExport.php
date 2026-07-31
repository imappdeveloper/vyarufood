<?php

declare(strict_types=1);

namespace App\Exports\Customer;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class CustomerTemplateExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return collect();
    }

    public function headings(): array
    {
        return [
            'first_name',
            'last_name',
            'email',
            'phone',
            'country_code',
            'gender',
            'date_of_birth',
            'address_line_1',
            'city_id',
            'pincode',
            'status',
            'remarks',
        ];
    }
}
