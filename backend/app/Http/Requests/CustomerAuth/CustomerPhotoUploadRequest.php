<?php

declare(strict_types=1);

namespace App\Http\Requests\CustomerAuth;

use App\Support\BaseRequest;

class CustomerPhotoUploadRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'profile_photo' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
        ];
    }

    public function attributes(): array
    {
        return [
            'profile_photo' => 'Profile Photo',
        ];
    }

    public function messages(): array
    {
        return array_merge(parent::messages(), [
            'profile_photo.image' => 'File must be an image.',
            'profile_photo.mimes' => 'Image must be JPG, PNG, or WebP.',
            'profile_photo.max' => 'Image must not exceed 2MB.',
        ]);
    }
}
