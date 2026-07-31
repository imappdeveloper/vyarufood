<?php

declare(strict_types=1);

namespace App\Http\Requests\WeeklyMenu;

use App\Support\BaseRequest;

class UpdateCustomerMealSelectionRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'customer_id' => ['sometimes', 'integer', 'exists:customers,id'],
            'weekly_menu_item_id' => ['sometimes', 'integer', 'exists:weekly_menu_items,id'],
            'subscription_id' => ['nullable', 'integer', 'exists:subscriptions,id'],
            'meal_id' => ['sometimes', 'integer', 'exists:meals,id'],
            'meal_category_id' => ['sometimes', 'integer', 'exists:meal_categories,id'],
            'selection_status' => ['sometimes', 'string', 'in:selected,default,skipped'],
            'remarks' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function attributes(): array
    {
        return [
            'customer_id' => 'Customer',
            'weekly_menu_item_id' => 'Weekly Menu Item',
            'subscription_id' => 'Subscription',
            'meal_id' => 'Meal',
            'meal_category_id' => 'Meal Category',
            'selection_status' => 'Selection Status',
            'remarks' => 'Remarks',
        ];
    }
}
