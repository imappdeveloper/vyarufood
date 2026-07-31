<?php

declare(strict_types=1);

namespace App\DTOs\MonthlyMenu;

final class MonthlyMenuDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $uuid = null,
        public readonly int $month = 1,
        public readonly int $year = 2026,
        public readonly int $kitchenId = 1,
        public readonly ?string $title = null,
        public readonly ?string $description = null,
        public readonly ?int $menuTemplateId = null,
        public readonly string $status = 'draft',
        public readonly ?string $publishedAt = null,
        public readonly ?int $publishedBy = null,
        public readonly ?string $approvedAt = null,
        public readonly ?int $approvedBy = null,
        public readonly ?int $createdBy = null,
        public readonly ?int $updatedBy = null,
        public readonly ?int $deletedBy = null,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            id: isset($data['id']) ? (int) $data['id'] : null,
            uuid: $data['uuid'] ?? null,
            month: isset($data['month']) ? (int) $data['month'] : 1,
            year: isset($data['year']) ? (int) $data['year'] : 2026,
            kitchenId: isset($data['kitchen_id']) ? (int) $data['kitchen_id'] : 1,
            title: $data['title'] ?? null,
            description: $data['description'] ?? null,
            menuTemplateId: isset($data['menu_template_id']) ? (int) $data['menu_template_id'] : null,
            status: $data['status'] ?? 'draft',
            publishedAt: $data['published_at'] ?? null,
            publishedBy: isset($data['published_by']) ? (int) $data['published_by'] : null,
            approvedAt: $data['approved_at'] ?? null,
            approvedBy: isset($data['approved_by']) ? (int) $data['approved_by'] : null,
            createdBy: isset($data['created_by']) ? (int) $data['created_by'] : null,
            updatedBy: isset($data['updated_by']) ? (int) $data['updated_by'] : null,
            deletedBy: isset($data['deleted_by']) ? (int) $data['deleted_by'] : null,
        );
    }

    public static function fromModel($model): self
    {
        return new self(
            id: $model->id,
            uuid: $model->uuid,
            month: $model->month,
            year: $model->year,
            kitchenId: $model->kitchen_id,
            title: $model->title,
            description: $model->description,
            menuTemplateId: $model->menu_template_id,
            status: $model->status,
            publishedAt: $model->published_at?->format('Y-m-d H:i:s'),
            publishedBy: $model->published_by,
            approvedAt: $model->approved_at?->format('Y-m-d H:i:s'),
            approvedBy: $model->approved_by,
            createdBy: $model->created_by,
            updatedBy: $model->updated_by,
            deletedBy: $model->deleted_by,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'month' => $this->month,
            'year' => $this->year,
            'kitchen_id' => $this->kitchenId,
            'title' => $this->title,
            'description' => $this->description,
            'menu_template_id' => $this->menuTemplateId,
            'status' => $this->status,
            'published_at' => $this->publishedAt,
            'published_by' => $this->publishedBy,
            'approved_at' => $this->approvedAt,
            'approved_by' => $this->approvedBy,
            'created_by' => $this->createdBy,
            'updated_by' => $this->updatedBy,
            'deleted_by' => $this->deletedBy,
        ];
    }
}
