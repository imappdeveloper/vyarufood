<?php

declare(strict_types=1);

namespace App\Listeners\CmsPage;

use App\Events\CmsPage\CmsPageArchived;
use App\Events\CmsPage\CmsPageCreated;
use App\Events\CmsPage\CmsPageDeleted;
use App\Events\CmsPage\CmsPagePublished;
use App\Events\CmsPage\CmsPageUpdated;
use App\Support\BaseListener;

class LogCmsPageActivity extends BaseListener
{
    public function handle(object $event): void
    {
        $description = match (true) {
            $event instanceof CmsPageCreated => "CMS page '{$event->page->page_title}' created",
            $event instanceof CmsPageUpdated => "CMS page '{$event->page->page_title}' updated",
            $event instanceof CmsPagePublished => "CMS page '{$event->page->page_title}' published",
            $event instanceof CmsPageArchived => "CMS page '{$event->page->page_title}' archived",
            $event instanceof CmsPageDeleted => "CMS page '{$event->pageTitle}' deleted",
            default => 'CMS page activity',
        };

        activity('cms_page')
            ->event(class_basename($event))
            ->log($description);
    }
}
