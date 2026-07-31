<?php

declare(strict_types=1);

namespace App\Http\Requests\MonthlyMenu;

use App\Support\BaseRequest;

class StoreMonthlyMenuRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'month' => ['required', 'integer', 'min:1', 'max:12'],
            'year' => ['required', 'integer', 'min:2020', 'max:2030'],
            'kitchen_id' => ['required', 'integer', 'exists:kitchens,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'menu_template_id' => ['nullable', 'integer', 'exists:menu_templates,id'],
        ];
    }

    public function attributes(): array
    {
        return [
            'month' => 'Month',
            'year' => 'Year',
            'kitchen_id' => 'Kitchen',
            'title' => 'Title',
            'description' => 'Description',
            'menu_template_id' => 'Menu Template',
        ];
    }
}
