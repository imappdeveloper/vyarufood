<?php

declare(strict_types=1);

namespace App\DTOs\CmsPage;

final class CmsPageDTO
{
    public function __construct(
        public readonly string $pageCode,
        public readonly string $pageTitle,
        public readonly ?string $slug = null,
        public readonly ?string $content = null,
        public readonly ?string $metaTitle = null,
        public readonly ?string $metaDescription = null,
        public readonly ?string $metaKeywords = null,
        public readonly string $status = 'draft',
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            pageCode: $data['page_code'] ?? '',
            pageTitle: $data['page_title'] ?? '',
            slug: $data['slug'] ?? null,
            content: $data['content'] ?? null,
            metaTitle: $data['meta_title'] ?? null,
            metaDescription: $data['meta_description'] ?? null,
            metaKeywords: $data['meta_keywords'] ?? null,
            status: $data['status'] ?? 'draft',
        );
    }

    public function toArray(): array
    {
        return [
            'page_code' => $this->pageCode,
            'page_title' => $this->pageTitle,
            'slug' => $this->slug,
            'content' => $this->content,
            'meta_title' => $this->metaTitle,
            'meta_description' => $this->metaDescription,
            'meta_keywords' => $this->metaKeywords,
            'status' => $this->status,
        ];
    }
}
