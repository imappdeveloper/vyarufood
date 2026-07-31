<?php

declare(strict_types=1);

namespace App\Constants;

class LogConstants
{
    public const CHANNEL_AUTH = 'auth';
    public const CHANNEL_ACTIVITY = 'activity';
    public const CHANNEL_API = 'api';
    public const CHANNEL_SYSTEM = 'system';

    public const ACTION_LOGIN = 'login';
    public const ACTION_LOGOUT = 'logout';
    public const ACTION_CREATE = 'create';
    public const ACTION_UPDATE = 'update';
    public const ACTION_DELETE = 'delete';
    public const ACTION_EXPORT = 'export';
    public const ACTION_IMPORT = 'import';
}
