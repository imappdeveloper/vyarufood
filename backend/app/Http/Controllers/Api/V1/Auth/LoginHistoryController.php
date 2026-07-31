<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\BaseController;
use App\Http\Resources\Auth\LoginHistoryResource;
use App\Repositories\Auth\LoginHistoryRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LoginHistoryController extends BaseController
{
    public function __construct(
        protected LoginHistoryRepositoryInterface $loginHistoryRepo,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $search = $request->input('search');

        $history = $this->loginHistoryRepo->getAllLoginHistory($perPage, $search);

        return $this->paginatedResponse(
            LoginHistoryResource::collection($history),
            'Login history retrieved'
        );
    }
}
