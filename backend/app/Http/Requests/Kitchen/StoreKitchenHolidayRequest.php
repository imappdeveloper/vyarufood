<?php

declare(strict_types=1);

namespace App\Http\Requests\Kitchen;

use App\Support\BaseRequest;

class StoreKitchenHolidayRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'kitchen_id' => ['required', 'integer', 'exists:kitchens,id'],
            'holiday_name' => ['required', 'string', 'max:255'],
            'holiday_type' => ['required', 'string', 'in:weekly_off,public_holiday,festival,maintenance,emergency,custom'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'reason' => ['nullable', 'string', 'max:1000'],
            'status' => ['sometimes', 'string', 'in:active,inactive'],
        ];
    }

    public function attributes(): array
    {
        return [
            'kitchen_id' => 'Kitchen',
            'holiday_name' => 'Holiday Name',
            'holiday_type' => 'Holiday Type',
            'start_date' => 'Start Date',
            'end_date' => 'End Date',
            'reason' => 'Reason',
            'status' => 'Status',
        ];
    }
}
