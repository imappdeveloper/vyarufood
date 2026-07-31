<?php

declare(strict_types=1);

namespace App\Enums\Auth;

enum LoginStatusEnum: string
{
    case Success = 'success';
    case Failed = 'failed';
    case Locked = 'locked';

    public function label(): string
    {
        return match ($this) {
            self::Success => 'Success',
            self::Failed => 'Failed',
            self::Locked => 'Locked',
        };
    }
}
