<?php

declare(strict_types=1);

namespace App\DTOs\WeeklyMenu;

final class WeeklyMenuDTO
{
    public function __construct(
        public readonly ?int $id = null,
        public readonly ?string $uuid = null,
        public readonly int $kitchenId = 1,
        public readonly ?string $title = null,
        public readonly ?string $description = null,
        public readonly ?string $weekStartDate = null,
        public readonly ?string $weekEndDate = null,
        public readonly string $status = 'draft',
        public readonly ?string $publishedAt = null,
        public readonly ?int $publishedBy = null,
        public readonly int $cutOffHours = 12,
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
            kitchenId: isset($data['kitchen_id']) ? (int) $data['kitchen_id'] : 1,
            title: $data['title'] ?? null,
            description: $data['description'] ?? null,
            weekStartDate: $data['week_start_date'] ?? null,
            weekEndDate: $data['week_end_date'] ?? null,
            status: $data['status'] ?? 'draft',
            publishedAt: $data['published_at'] ?? null,
            publishedBy: isset($data['published_by']) ? (int) $data['published_by'] : null,
            cutOffHours: isset($data['cut_off_hours']) ? (int) $data['cut_off_hours'] : 12,
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
            kitchenId: $model->kitchen_id,
            title: $model->title,
            description: $model->description,
            weekStartDate: $model->week_start_date?->format('Y-m-d'),
            weekEndDate: $model->week_end_date?->format('Y-m-d'),
            status: $model->status,
            publishedAt: $model->published_at?->format('Y-m-d H:i:s'),
            publishedBy: $model->published_by,
            cutOffHours: $model->cut_off_hours,
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
            'kitchen_id' => $this->kitchenId,
            'title' => $this->title,
            'description' => $this->description,
            'week_start_date' => $this->weekStartDate,
            'week_end_date' => $this->weekEndDate,
            'status' => $this->status,
            'published_at' => $this->publishedAt,
            'published_by' => $this->publishedBy,
            'cut_off_hours' => $this->cutOffHours,
            'created_by' => $this->createdBy,
            'updated_by' => $this->updatedBy,
            'deleted_by' => $this->deletedBy,
        ];
    }
}
