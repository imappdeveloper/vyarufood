<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Role;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Auth\StoreRoleRequest;
use App\Http\Requests\Auth\UpdateRoleRequest;
use App\Http\Resources\Auth\RoleResource;
use App\Services\Auth\RoleServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoleController extends BaseController
{
    public function __construct(
        protected RoleServiceInterface $roleService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $sort = $request->input('sort', 'sort_order');
        $order = $request->input('order', 'asc');

        $roles = $this->roleService->list($perPage, $sort, $order);

        return $this->paginatedResponse(
            RoleResource::collection($roles),
            'Roles retrieved'
        );
    }

    public function all(): JsonResponse
    {
        $roles = $this->roleService->getAllRoles();
        return $this->successResponse(RoleResource::collection($roles), 'Roles retrieved');
    }

    public function store(StoreRoleRequest $request): JsonResponse
    {
        try {
            $role = $this->roleService->create($request->validated());
            return $this->createdResponse(new RoleResource($role), 'Role created');
        } catch (\App\Exceptions\BusinessException $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function show(string $id): JsonResponse
    {
        try {
            $role = $this->roleService->findById((int) $id);
            return $this->successResponse(new RoleResource($role), 'Role retrieved');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Role not found');
        }
    }

    public function update(UpdateRoleRequest $request, string $id): JsonResponse
    {
        try {
            $role = $this->roleService->findById((int) $id);
            $role = $this->roleService->update($role, $request->validated());
            return $this->successResponse(new RoleResource($role), 'Role updated');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Role not found');
        } catch (\App\Exceptions\BusinessException $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $role = $this->roleService->findById((int) $id);
            $this->roleService->delete($role);
            return $this->noContentResponse('Role deleted');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Role not found');
        } catch (\App\Exceptions\BusinessException $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function clone(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:roles,name'],
        ]);

        try {
            $role = $this->roleService->findById((int) $id);
            $cloned = $this->roleService->cloneRole($role, $request->input('name'));
            return $this->createdResponse(new RoleResource($cloned), 'Role cloned');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Role not found');
        } catch (\App\Exceptions\BusinessException $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function assignPermissions(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'permission_ids' => ['required', 'array'],
            'permission_ids.*' => ['integer', 'exists:permissions,id'],
        ]);

        try {
            $role = $this->roleService->findById((int) $id);
            $role = $this->roleService->assignPermissions($role, $request->input('permission_ids'));
            return $this->successResponse(new RoleResource($role), 'Permissions assigned');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Role not found');
        }
    }

    public function removePermissions(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'permission_ids' => ['required', 'array'],
            'permission_ids.*' => ['integer', 'exists:permissions,id'],
        ]);

        try {
            $role = $this->roleService->findById((int) $id);
            $role = $this->roleService->removePermissions($role, $request->input('permission_ids'));
            return $this->successResponse(new RoleResource($role), 'Permissions removed');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->notFoundResponse('Role not found');
        }
    }
}
