<?php

declare(strict_types=1);

namespace App\DTOs\Supplier;

final class SupplierContactDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?int $supplierId = null,
        public readonly ?string $name = null,
        public readonly ?string $designation = null,
        public readonly ?string $mobile = null,
        public readonly ?string $email = null,
        public readonly bool $isPrimary = false,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            supplierId: isset($data['supplier_id']) ? (int) $data['supplier_id'] : null,
            name: $data['name'] ?? null,
            designation: $data['designation'] ?? null,
            mobile: $data['mobile'] ?? null,
            email: $data['email'] ?? null,
            isPrimary: (bool) ($data['is_primary'] ?? false),
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'designation' => $this->designation,
            'mobile' => $this->mobile,
            'email' => $this->email,
            'is_primary' => $this->isPrimary,
        ];
    }
}
