<?php

declare(strict_types=1);

namespace App\Http\Requests\Report;

use Illuminate\Foundation\Http\FormRequest;

class SaveReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'report_code' => 'required|string|max:100',
            'report_name' => 'required|string|max:255',
            'report_type' => 'required|string',
            'filters' => 'nullable|array',
            'is_public' => 'nullable|boolean',
        ];
    }
}
