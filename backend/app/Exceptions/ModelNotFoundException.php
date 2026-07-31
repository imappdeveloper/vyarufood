<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

class ModelNotFoundException extends Exception
{
    protected string $modelName;

    public function __construct(string $modelName, string|int|null $identifier = null)
    {
        $message = "{$modelName} not found";

        if ($identifier) {
            $message .= " with identifier: {$identifier}";
        }

        $this->modelName = $modelName;

        parent::__construct($message, 404);
    }

    public function getModelName(): string
    {
        return $this->modelName;
    }
}
