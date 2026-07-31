<?php

declare(strict_types=1);

namespace App\DTOs\Auth;

class AdminDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $uuid = null,
        public readonly string $firstName = '',
        public readonly string $lastName = '',
        public readonly string $email = '',
        public readonly ?string $mobile = null,
        public readonly ?string $profilePhoto = null,
        public readonly string $status = 'active',
        public readonly ?string $lastLoginAt = null,
        public readonly ?string $lastLoginIp = null,
        public readonly ?string $emailVerifiedAt = null,
        public readonly ?array $roles = [],
        public readonly ?array $permissions = [],
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {}

    public static function fromModel($model): self
    {
        return new self(
            id: $model->id,
            uuid: $model->uuid,
            firstName: $model->first_name,
            lastName: $model->last_name,
            email: $model->email,
            mobile: $model->mobile,
            profilePhoto: $model->profile_photo,
            status: $model->status->value ?? $model->status,
            lastLoginAt: $model->last_login_at?->toISOString(),
            lastLoginIp: $model->last_login_ip,
            emailVerifiedAt: $model->email_verified_at?->toISOString(),
            roles: [],
            permissions: [],
            createdAt: $model->created_at?->toISOString(),
            updatedAt: $model->updated_at?->toISOString(),
        );
    }

    public function toArray(): array
    {
        return get_object_vars($this);
    }
}
