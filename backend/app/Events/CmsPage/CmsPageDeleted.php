<?php

declare(strict_types=1);

namespace App\Events\CmsPage;

use App\Models\CmsPage;
use App\Support\BaseEvent;

class CmsPageDeleted extends BaseEvent
{
    public function __construct(public readonly string $pageTitle) {}
}
