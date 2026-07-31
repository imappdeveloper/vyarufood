<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception as BaseException;

class BusinessException extends BaseException
{
    protected mixed $context;

    public function __construct(string $message = '', int $code = 400, mixed $context = null)
    {
        parent::__construct($message, $code);
        $this->context = $context;
    }

    public function getContext(): mixed
    {
        return $this->context;
    }
}
