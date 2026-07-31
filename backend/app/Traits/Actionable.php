<?php

declare(strict_types=1);

namespace App\Traits;

use Illuminate\Http\Request;

trait Actionable
{
    public function performAction(string $action, Request $request): mixed
    {
        $actionClass = $this->getActionClass($action);

        if (!class_exists($actionClass)) {
            throw new \App\Exceptions\BusinessException(
                "Action [{$action}] not found for " . static::class
            );
        }

        return app($actionClass)->handle($request);
    }

    protected function getActionClass(string $action): string
    {
        $model = class_basename(static::class);

        return "App\\Actions\\{$model}\\{$action}";
    }
}
