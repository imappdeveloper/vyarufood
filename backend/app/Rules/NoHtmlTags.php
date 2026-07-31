<?php

declare(strict_types=1);

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class NoHtmlTags implements Rule
{
    public function passes($attribute, $value): bool
    {
        return $value === strip_tags($value);
    }

    public function message(): string
    {
        return 'The :attribute must not contain HTML tags.';
    }
}
