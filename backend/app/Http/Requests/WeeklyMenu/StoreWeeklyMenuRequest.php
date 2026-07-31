<?php

declare(strict_types=1);

namespace App\Http\Requests\WeeklyMenu;

use App\Support\BaseRequest;

class StoreWeeklyMenuRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'week_start_date' => ['required', 'date', 'after_or_equal:today'],
            'week_end_date' => ['required', 'date', 'after_or_equal:week_start_date'],
            'kitchen_id' => ['nullable', 'integer', 'exists:kitchens,id'],
            'cut_off_hours' => ['nullable', 'integer', 'min:1', 'max:72'],
            'status' => ['nullable', 'string', 'in:draft,published'],
        ];
    }

    public function attributes(): array
    {
        return [
            'title' => 'Title',
            'description' => 'Description',
            'week_start_date' => 'Week Start Date',
            'week_end_date' => 'Week End Date',
            'kitchen_id' => 'Kitchen',
            'cut_off_hours' => 'Cut Off Hours',
            'status' => 'Status',
        ];
    }
}
