<?php

declare(strict_types=1);

namespace App\Http\Requests\Kitchen;

use App\Support\BaseRequest;

class UpdateKitchenHolidayRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'holiday_name' => ['sometimes', 'string', 'max:255'],
            'holiday_type' => ['sometimes', 'string', 'in:weekly_off,public_holiday,festival,maintenance,emergency,custom'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date', 'after_or_equal:start_date'],
            'reason' => ['nullable', 'string', 'max:1000'],
            'status' => ['sometimes', 'string', 'in:active,inactive'],
        ];
    }

    public function attributes(): array
    {
        return [
            'holiday_name' => 'Holiday Name',
            'holiday_type' => 'Holiday Type',
            'start_date' => 'Start Date',
            'end_date' => 'End Date',
            'reason' => 'Reason',
            'status' => 'Status',
        ];
    }
}
