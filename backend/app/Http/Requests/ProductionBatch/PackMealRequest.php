<?php

declare(strict_types=1);

namespace App\Http\Requests\ProductionBatch;

use Illuminate\Foundation\Http\FormRequest;

class PackMealRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [];
    }
}
