<?php

declare(strict_types=1);

namespace App\Http\Requests\DeliveryZone;

use App\Support\BaseRequest;

class StoreDeliverySlotRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'delivery_zone_id' => ['nullable', 'integer', 'exists:delivery_zones,id'],
            'slot_name' => ['required', 'string', 'max:100'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'maximum_orders' => ['nullable', 'integer', 'min:1'],
            'cutoff_time' => ['nullable', 'date_format:H:i'],
            'status' => ['required', 'string', 'in:active,inactive'],
        ];
    }

    public function attributes(): array
    {
        return [
            'delivery_zone_id' => 'Delivery Zone',
            'slot_name' => 'Slot Name',
            'start_time' => 'Start Time',
            'end_time' => 'End Time',
            'maximum_orders' => 'Maximum Orders',
            'cutoff_time' => 'Cutoff Time',
            'status' => 'Status',
        ];
    }
}
