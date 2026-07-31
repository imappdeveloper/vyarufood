<?php

declare(strict_types=1);

namespace App\DTOs\MonthlyMenu;

final class MenuTemplateDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $uuid = null,
        public readonly ?string $templateName = null,
        public readonly ?string $description = null,
        public readonly int $kitchenId = 1,
        public readonly bool $isDefault = false,
        public readonly string $status = 'active',
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            uuid: $data['uuid'] ?? null,
            templateName: $data['template_name'] ?? null,
            description: $data['description'] ?? null,
            kitchenId: isset($data['kitchen_id']) ? (int) $data['kitchen_id'] : 1,
            isDefault: ($data['is_default'] ?? false) === true || ($data['is_default'] ?? 0) == 1,
            status: $data['status'] ?? 'active',
        );
    }

    public static function fromModel($model): self
    {
        return new self(
            id: $model->id,
            uuid: $model->uuid,
            templateName: $model->template_name,
            description: $model->description,
            kitchenId: $model->kitchen_id,
            isDefault: $model->is_default,
            status: $model->status,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'template_name' => $this->templateName,
            'description' => $this->description,
            'kitchen_id' => $this->kitchenId,
            'is_default' => $this->isDefault,
            'status' => $this->status,
        ];
    }
}
