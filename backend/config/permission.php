<?php

return [
    'models' => [
        'permission' => Spatie\Permission\Models\Permission::class,
        'role' => Spatie\Permission\Models\Role::class,
    ],
    'table_names' => [
        'roles' => 'roles',
        'permissions' => 'permissions',
        'model_has_permissions' => 'model_has_permissions',
        'model_has_roles' => 'model_has_roles',
        'role_has_permissions' => 'role_has_permissions',
    ],
    'column_names' => [
        'model_morph_key' => 'model_id',
        'model_type_key' => 'model_type',
        'model_key' => 'model_id',
        'role_key' => 'role',
        'permission_key' => 'permission',
    ],
    'register_permission_check_method' => true,
    'register_octane_reset_listener' => false,
    'exception_guard' => null,
    'display_permission_in_exception' => true,
    'enable_wildcard_permission' => false,
    'cache' => [
        'store' => env('CACHE_STORE', env('CACHE_DRIVER', 'file')),
        'key' => 'spatie_permission_cache',
        'prefix' => 'spatie_permission.cache',
        'ttl' => 604800,
    ],
];
