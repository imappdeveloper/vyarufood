<?php

declare(strict_types=1);

namespace App\Traits;

use Illuminate\Support\Facades\Auth;

trait HasAuditFields
{
    public static function bootHasAuditFields(): void
    {
        static::creating(function ($model) {
            if (auth()->guard('web')->check()) {
                $model->created_by = auth()->guard('web')->id();
                $model->updated_by = auth()->guard('web')->id();
            }
        });

        static::updating(function ($model) {
            if (auth()->guard('web')->check()) {
                $model->updated_by = auth()->guard('web')->id();
            }
        });
    }
}
