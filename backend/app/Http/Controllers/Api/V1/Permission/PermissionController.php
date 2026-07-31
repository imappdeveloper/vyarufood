<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Permission;

use App\Http\Controllers\BaseController;
use App\Http\Resources\Auth\PermissionResource;
use App\Services\Auth\PermissionServiceInterface;
use Illuminate\Http\JsonResponse;

class PermissionController extends BaseController
{
    public function __construct(
        protected PermissionServiceInterface $permissionService,
    ) {}

    public function index(): JsonResponse
    {
        $permissions = $this->permissionService->all();
        return $this->successResponse(PermissionResource::collection($permissions), 'Permissions retrieved');
    }

    public function grouped(): JsonResponse
    {
        $grouped = $this->permissionService->grouped();
        $result = [];

        foreach ($grouped as $group => $permissions) {
            $result[] = [
                'group' => $group,
                'permissions' => PermissionResource::collection($permissions),
            ];
        }

        return $this->successResponse($result, 'Permissions retrieved');
    }
}
