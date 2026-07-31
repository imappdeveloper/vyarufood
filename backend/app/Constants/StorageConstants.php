<?php

declare(strict_types=1);

namespace App\Constants;

class StorageConstants
{
    public const DISK_LOCAL = 'local';
    public const DISK_PUBLIC = 'public';
    public const DISK_PRIVATE = 'private';
    public const DISK_S3 = 's3';

    public const FOLDER_IMAGES = 'images';
    public const FOLDER_DOCUMENTS = 'documents';
    public const FOLDER_REPORTS = 'reports';
    public const FOLDER_INVOICES = 'invoices';
    public const FOLDER_TEMP = 'temp';
    public const FOLDER_AVATARS = 'avatars';

    public const MAX_UPLOAD_SIZE = 10240;
    public const IMAGE_MAX_WIDTH = 1200;
    public const IMAGE_MAX_HEIGHT = 1200;
    public const IMAGE_QUALITY = 85;
    public const THUMBNAIL_WIDTH = 200;
    public const THUMBNAIL_HEIGHT = 200;
}
