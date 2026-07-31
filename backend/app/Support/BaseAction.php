<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Http\Request;

abstract class BaseAction
{
    abstract public function handle(Request $request): mixed;

    protected function transaction(callable $callback): mixed
    {
        return \Illuminate\Support\Facades\DB::transaction($callback);
    }
}
