<?php

declare(strict_types=1);

namespace App\Http\Requests\CmsPage;

use App\Support\BaseRequest;
use Illuminate\Validation\Rule;

class UpdateCmsPageRequest extends BaseRequest
{
    public function rules(): array
    {
        $pageId = $this->route('uuid');

        return [
            'page_code' => ['sometimes', 'string', 'max:100', Rule::unique('cms_pages', 'page_code')->ignore($pageId, 'uuid')],
            'page_title' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', Rule::unique('cms_pages', 'slug')->ignore($pageId, 'uuid')],
            'content' => ['nullable', 'string'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'meta_keywords' => ['nullable', 'string', 'max:500'],
            'status' => ['sometimes', 'string', Rule::in(['draft', 'published', 'archived'])],
        ];
    }

    public function attributes(): array
    {
        return [
            'page_code' => 'page code',
            'page_title' => 'page title',
            'slug' => 'slug',
            'content' => 'content',
            'meta_title' => 'meta title',
            'meta_description' => 'meta description',
            'meta_keywords' => 'meta keywords',
        ];
    }
}
