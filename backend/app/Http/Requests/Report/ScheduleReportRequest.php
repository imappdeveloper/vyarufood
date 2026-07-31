<?php

declare(strict_types=1);

namespace App\Http\Requests\Report;

use Illuminate\Foundation\Http\FormRequest;

class ScheduleReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'report_name' => 'required|string|max:255',
            'report_type' => 'required|string',
            'frequency' => 'required|in:daily,weekly,monthly,quarterly,yearly',
            'export_format' => 'required|in:pdf,excel,csv',
            'email_recipients' => 'required|array|min:1',
            'email_recipients.*' => 'email',
            'next_run' => 'nullable|date|after:now',
        ];
    }
}
