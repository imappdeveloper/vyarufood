<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;

class Paginator
{
    public static function paginate($query, int $perPage = 15, ?string $defaultSort = 'created_at', string $defaultOrder = 'desc'): LengthAwarePaginator
    {
        $perPage = min((int) request('per_page', $perPage), 100);
        $sort = request('sort', $defaultSort);
        $order = request('order', $defaultOrder);

        if ($sort && in_array($sort, (array) $query->getModel()->getFillable())) {
            $query->orderBy($sort, $order === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy($defaultSort, $defaultOrder);
        }

        return $query->paginate($perPage);
    }
}
