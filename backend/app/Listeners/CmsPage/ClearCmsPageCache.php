<?php

declare(strict_types=1);

namespace App\Listeners\CmsPage;

use App\Support\BaseListener;
use App\Support\CacheManager;

class ClearCmsPageCache extends BaseListener
{
    public function handle(object $event): void
    {
        CacheManager::flush('cms_page');
    }
}
