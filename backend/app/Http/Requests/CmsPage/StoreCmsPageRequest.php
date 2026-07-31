<?php

declare(strict_types=1);

namespace App\Http\Requests\CmsPage;

use App\Support\BaseRequest;
use Illuminate\Validation\Rule;

class StoreCmsPageRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'page_code' => ['required', 'string', 'max:100', Rule::unique('cms_pages', 'page_code')],
            'page_title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('cms_pages', 'slug')],
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
