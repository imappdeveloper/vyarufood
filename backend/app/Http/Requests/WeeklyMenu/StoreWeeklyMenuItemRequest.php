<?php

declare(strict_types=1);

namespace App\Http\Requests\WeeklyMenu;

use App\Support\BaseRequest;

class StoreWeeklyMenuItemRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'weekly_menu_id' => ['required', 'integer', 'exists:weekly_menus,id'],
            'menu_date' => ['required', 'date'],
            'meal_category_id' => ['required', 'integer', 'exists:meal_categories,id'],
            'meal_id' => ['required', 'integer', 'exists:meals,id'],
            'meal_type_id' => ['nullable', 'integer', 'exists:meal_types,id'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'meal_limit' => ['nullable', 'integer', 'min:0'],
            'is_default' => ['nullable', 'boolean'],
            'is_optional' => ['nullable', 'boolean'],
            'is_recommended' => ['nullable', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'weekly_menu_id' => 'Weekly Menu',
            'menu_date' => 'Menu Date',
            'meal_category_id' => 'Meal Category',
            'meal_id' => 'Meal',
            'meal_type_id' => 'Meal Type',
            'display_order' => 'Display Order',
            'meal_limit' => 'Meal Limit',
            'is_default' => 'Is Default',
            'is_optional' => 'Is Optional',
            'is_recommended' => 'Is Recommended',
        ];
    }
}
