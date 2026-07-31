<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Database\Eloquent\Model;

abstract class BaseObserver
{
    public function created(Model $model): void {}

    public function updated(Model $model): void {}

    public function deleted(Model $model): void {}

    public function restored(Model $model): void {}

    public function forceDeleted(Model $model): void {}
}
