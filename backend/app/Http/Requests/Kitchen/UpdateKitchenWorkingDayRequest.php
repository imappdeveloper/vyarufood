<?php

declare(strict_types=1);

namespace App\Http\Requests\Kitchen;

use App\Support\BaseRequest;

class UpdateKitchenWorkingDayRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'day_of_week' => ['sometimes', 'string', 'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday'],
            'is_working' => ['sometimes', 'boolean'],
            'opening_time' => ['nullable', 'string', 'date_format:H:i'],
            'closing_time' => ['nullable', 'string', 'date_format:H:i'],
            'preparation_start_time' => ['nullable', 'string', 'date_format:H:i'],
            'accept_order_start' => ['nullable', 'string', 'date_format:H:i'],
            'accept_order_end' => ['nullable', 'string', 'date_format:H:i'],
        ];
    }

    public function attributes(): array
    {
        return [
            'day_of_week' => 'Day of Week',
            'is_working' => 'Is Working',
            'opening_time' => 'Opening Time',
            'closing_time' => 'Closing Time',
            'preparation_start_time' => 'Preparation Start Time',
            'accept_order_start' => 'Accept Order Start',
            'accept_order_end' => 'Accept Order End',
        ];
    }
}
