<?php

declare(strict_types=1);

namespace App\Http\Requests\Report;

use Illuminate\Foundation\Http\FormRequest;

class ExportReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'report_type' => 'required|string',
            'export_format' => 'required|in:pdf,excel,csv',
            'filters' => 'nullable|array',
            'filename' => 'nullable|string|max:255',
        ];
    }
}
