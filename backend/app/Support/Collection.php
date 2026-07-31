<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Support\Collection as BaseCollection;

class Collection extends BaseCollection
{
    public function toDataTable(array $columns): array
    {
        return $this->map(fn ($item) => collect($item)->only($columns))->toArray();
    }

    public function chunkToArray(int $size): array
    {
        return $this->chunk($size)->toArray();
    }
}
