<?php

declare(strict_types=1);

namespace App\Constants;

class QueueConstants
{
    public const QUEUE_DEFAULT = 'default';
    public const QUEUE_HIGH = 'high';
    public const QUEUE_LOW = 'low';
    public const QUEUE_NOTIFICATIONS = 'notifications';
    public const QUEUE_REPORTS = 'reports';

    public const JOB_MAX_TRIES = 3;
    public const JOB_TIMEOUT = 120;
    public const JOB_RETRY_DELAY = 60;
    public const JOB_MAX_EXCEPTIONS = 3;
}
