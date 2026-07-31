<?php

declare(strict_types=1);

namespace App\Services\Auth;

interface PermissionServiceInterface
{
    public function all(): \Illuminate\Database\Eloquent\Collection;
    public function grouped(): array;
    public function getByGroup(string $group): \Illuminate\Database\Eloquent\Collection;
}
