<?php

declare(strict_types=1);

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class DecimalPrecision implements Rule
{
    protected int $maxDecimals;

    public function __construct(int $maxDecimals = 2)
    {
        $this->maxDecimals = $maxDecimals;
    }

    public function passes($attribute, $value): bool
    {
        return preg_match('/^\d+(\.\d{1,' . $this->maxDecimals . '})?$/', $value);
    }

    public function message(): string
    {
        return "The :attribute must have at most {$this->maxDecimals} decimal places.";
    }
}
