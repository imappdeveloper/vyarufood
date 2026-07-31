<?php

declare(strict_types=1);

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait Filterable
{
    public function scopeApplyFilters(Builder $query, array $filters): Builder
    {
        foreach ($filters as $field => $value) {
            if (is_null($value) || $value === '') {
                continue;
            }

            $method = 'filter' . str_replace('_', '', ucfirst($field));

            if (method_exists($this, $method)) {
                $this->{$method}($query, $value);
            } elseif (in_array($field, $this->fillable ?? [])) {
                $query->where($field, $value);
            }
        }

        return $query;
    }

    public function scopeApplySearch(Builder $query, ?string $search, array $columns = []): Builder
    {
        if (!$search) {
            return $query;
        }

        $columns = $columns ?: ['name', 'email'];

        $query->where(function (Builder $q) use ($search, $columns) {
            foreach ($columns as $column) {
                $q->orWhere($column, 'LIKE', "%{$search}%");
            }
        });

        return $query;
    }
}
