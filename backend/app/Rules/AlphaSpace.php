<?php

declare(strict_types=1);

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class AlphaSpace implements Rule
{
    public function passes($attribute, $value): bool
    {
        return preg_match('/^[a-zA-Z\s]+$/', $value);
    }

    public function message(): string
    {
        return 'The :attribute may only contain letters and spaces.';
    }
}
