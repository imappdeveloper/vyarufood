<?php

declare(strict_types=1);

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class NoLeadingTrailingSpaces implements Rule
{
    public function passes($attribute, $value): bool
    {
        return $value === trim($value);
    }

    public function message(): string
    {
        return 'The :attribute must not have leading or trailing spaces.';
    }
}
