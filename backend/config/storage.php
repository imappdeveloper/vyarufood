<?php

return [
    'disks' => [
        'images' => env('STORAGE_DISK_IMAGES', 'public'),
        'documents' => env('STORAGE_DISK_DOCUMENTS', 'private'),
        'temp' => env('STORAGE_DISK_TEMP', 'local'),
    ],
    'paths' => [
        'avatars' => 'avatars',
        'meal_images' => 'meal-images',
        'documents' => 'documents',
        'reports' => 'reports',
        'invoices' => 'invoices',
        'temp' => 'temp',
    ],
    'allowed_mime_types' => [
        'image' => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        'document' => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        'spreadsheet' => ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    ],
    'max_file_size' => 10240,
];
