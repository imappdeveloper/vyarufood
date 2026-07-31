<?php

declare(strict_types=1);

namespace App\Rules;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Validation\Rule;

class UniqueSlug implements Rule
{
    protected string $modelClass;
    protected string $column;
    protected ?int $ignoreId;

    public function __construct(string $modelClass, string $column = 'slug', ?int $ignoreId = null)
    {
        $this->modelClass = $modelClass;
        $this->column = $column;
        $this->ignoreId = $ignoreId;
    }

    public function passes($attribute, $value): bool
    {
        $query = $this->modelClass::where($this->column, $value);

        if ($this->ignoreId) {
            $query->where('id', '!=', $this->ignoreId);
        }

        return !$query->exists();
    }

    public function message(): string
    {
        return 'The :attribute has already been taken.';
    }
}
