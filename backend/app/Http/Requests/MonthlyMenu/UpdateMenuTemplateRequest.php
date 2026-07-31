<?php

declare(strict_types=1);

namespace App\Http\Requests\MonthlyMenu;

use App\Support\BaseRequest;

class UpdateMenuTemplateRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'template_name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'kitchen_id' => ['sometimes', 'integer', 'exists:kitchens,id'],
            'is_default' => ['nullable', 'boolean'],
            'status' => ['sometimes', 'string', 'in:active,inactive'],
        ];
    }

    public function attributes(): array
    {
        return [
            'template_name' => 'Template Name',
            'description' => 'Description',
            'kitchen_id' => 'Kitchen',
            'is_default' => 'Default',
            'status' => 'Status',
        ];
    }
}
