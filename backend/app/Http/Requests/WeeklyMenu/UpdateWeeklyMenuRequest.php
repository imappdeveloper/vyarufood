<?php

declare(strict_types=1);

namespace App\Http\Requests\WeeklyMenu;

use App\Models\WeeklyMenu;
use App\Support\BaseRequest;

class UpdateWeeklyMenuRequest extends BaseRequest
{
    public function rules(): array
    {
        $uuid = $this->route('weekly_menu_uuid');
        $menu = $uuid ? WeeklyMenu::withoutTrashed()->where('uuid', $uuid)->first() : null;
        $isDraft = $menu && $menu->status === 'draft';

        $weekStartRules = ['sometimes', 'date'];
        $weekEndRules = ['sometimes', 'date', 'after_or_equal:week_start_date'];

        if ($isDraft) {
            $weekStartRules[] = 'after_or_equal:today';
            $weekEndRules[] = 'after_or_equal:today';
        }

        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'week_start_date' => $weekStartRules,
            'week_end_date' => $weekEndRules,
            'kitchen_id' => ['nullable', 'integer', 'exists:kitchens,id'],
            'cut_off_hours' => ['nullable', 'integer', 'min:1', 'max:72'],
            'status' => ['sometimes', 'string', 'in:draft,published'],
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
