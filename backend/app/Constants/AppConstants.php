<?php

declare(strict_types=1);

namespace App\Constants;

class AppConstants
{
    public const APP_NAME = 'Tiffin Management System';
    public const APP_VERSION = '1.0.0';
    public const API_VERSION = 'v1';

    public const PER_PAGE_DEFAULT = 15;
    public const PER_PAGE_MAX = 100;

    public const CACHE_TTL_SHORT = 60;
    public const CACHE_TTL_MEDIUM = 3600;
    public const CACHE_TTL_LONG = 86400;

    public const TOKEN_EXPIRY = 60 * 24;
    public const PASSWORD_RESET_EXPIRY = 60;

    public const MAX_LOGIN_ATTEMPTS = 5;
    public const LOCKOUT_DURATION = 15;

    public const MAX_FILE_SIZE = 10240;
    public const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    public const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    public const PAGINATION_PER_PAGE = 15;
    public const PAGINATION_MAX = 100;

    public const STATUS_ACTIVE = 'active';
    public const STATUS_INACTIVE = 'inactive';
    public const STATUS_PENDING = 'pending';
    public const STATUS_SUSPENDED = 'suspended';
}
