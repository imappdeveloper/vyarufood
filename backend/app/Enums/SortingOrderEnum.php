<?php

declare(strict_types=1);

namespace App\Enums;

enum SortingOrderEnum: string
{
    case Asc = 'asc';
    case Desc = 'desc';

    public function opposite(): self
    {
        return match ($this) {
            self::Asc => self::Desc,
            self::Desc => self::Asc,
        };
    }
}
