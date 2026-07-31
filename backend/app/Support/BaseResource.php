<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Http\Resources\Json\JsonResource;

abstract class BaseResource extends JsonResource
{
    public function toArray($request): array
    {
        return parent::toArray($request);
    }

    public function with($request): array
    {
        return [
            'status' => true,
        ];
    }
}
