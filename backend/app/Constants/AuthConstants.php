<?php

declare(strict_types=1);

namespace App\Constants;

class AuthConstants
{
    public const GUARD_WEB = 'web';
    public const GUARD_API = 'sanctum';

    public const ROLE_SUPER_ADMIN = 'super_admin';
    public const ROLE_ADMIN = 'admin';
    public const ROLE_MANAGER = 'manager';
    public const ROLE_STAFF = 'staff';

    public const PERMISSION_PREFIX = '';
    public const PERMISSION_ALL = '*';

    public const TOKEN_ABILITY_VIEW = 'view';
    public const TOKEN_ABILITY_CREATE = 'create';
    public const TOKEN_ABILITY_UPDATE = 'update';
    public const TOKEN_ABILITY_DELETE = 'delete';
}
