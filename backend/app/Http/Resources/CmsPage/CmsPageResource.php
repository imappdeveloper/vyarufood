<?php

declare(strict_types=1);

namespace App\Http\Resources\CmsPage;

use App\Support\BaseResource;

class CmsPageResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'page_code' => $this->page_code,
            'page_title' => $this->page_title,
            'slug' => $this->slug,
            'content' => $this->content,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'meta_keywords' => $this->meta_keywords,
            'status' => $this->status,
            'status_label' => ucfirst($this->status),
            'published_at' => $this->published_at?->toISOString(),
            'created_by' => $this->created_by,
            'created_by_name' => $this->whenLoaded('creator', fn () => $this->creator->name),
            'updated_by' => $this->updated_by,
            'updated_by_name' => $this->whenLoaded('updater', fn () => $this->updater->name),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
