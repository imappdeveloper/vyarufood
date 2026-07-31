<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\Services\Auth\AuthServiceInterface;
use App\Support\BaseAction;
use Illuminate\Http\Request;

class LoginAction extends BaseAction
{
    public function __construct(
        protected AuthServiceInterface $authService,
    ) {}

    public function handle(Request $request): array
    {
        return $this->authService->login(
            credentials: $request->only('email', 'password'),
            ip: $request->ip(),
            userAgent: $request->userAgent(),
            remember: $request->boolean('remember_me', false),
        );
    }
}
