# Enterprise Architecture Document
## Single Vendor Tiffin Management System

---

## Table of Contents

1. [Project Architecture Diagram](#1-project-architecture-diagram)
2. [Database Standards](#2-database-standards)
3. [API Standards](#3-api-standards)
4. [Security Architecture](#4-security-architecture)
5. [Logging Architecture](#5-logging-architecture)
6. [Queue Architecture](#6-queue-architecture)
7. [File Storage Architecture](#7-file-storage-architecture)
8. [UI Design System](#8-ui-design-system)
9. [Coding Standards](#9-coding-standards)
10. [Recommended Packages](#10-recommended-packages)
11. [Development Workflow](#11-development-workflow)
12. [Best Practices](#12-best-practices)

---

## 1. Project Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                                │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Angular Admin│  │ Flutter App  │  │ Future Clients       │  │
│  │ (Web Panel)  │  │ (Mobile)     │  │ (PWA, etc.)          │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
└─────────┼─────────────────┼─────────────────────┼───────────────┘
          │                 │                     │
          │        HTTPS / REST API               │
          │                 │                     │
┌─────────┼─────────────────┼─────────────────────┼───────────────┐
│         ▼                 ▼                     ▼               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              API GATEWAY / LOAD BALANCER                │   │
│  │         (Nginx / AWS ALB / Cloudflare)                  │   │
│  └─────────────────────────┬───────────────────────────────┘   │
│                            │                                   │
│                    BACKEND LAYER                               │
│                            │                                   │
│  ┌─────────────────────────▼───────────────────────────────┐   │
│  │                  LARAVEL 12 API                         │   │
│  │                                                         │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │   Auth   │ │  Routes  │ │Middleware│ │Requests  │  │   │
│  │  │ (Sanctum)│ │ (API v1) │ │ (RBAC)  │ │(Validate)│  │   │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │   │
│  │       │             │            │             │         │   │
│  │  ┌────▼─────────────▼────────────▼─────────────▼─────┐  │   │
│  │  │              CONTROLLER LAYER                     │  │   │
│  │  │         (BaseController → Module Controllers)     │  │   │
│  │  └─────────────────────┬─────────────────────────────┘  │   │
│  │                        │                                │   │
│  │  ┌─────────────────────▼─────────────────────────────┐  │   │
│  │  │              SERVICE LAYER                        │  │   │
│  │  │         (BaseService → Module Services)           │  │   │
│  │  └─────────────────────┬─────────────────────────────┘  │   │
│  │                        │                                │   │
│  │  ┌─────────────────────▼─────────────────────────────┐  │   │
│  │  │           REPOSITORY LAYER                        │  │   │
│  │  │       (BaseRepository → Module Repositories)      │  │   │
│  │  └─────────────────────┬─────────────────────────────┘  │   │
│  │                        │                                │   │
│  │  ┌─────────────────────▼─────────────────────────────┐  │   │
│  │  │              MODEL / ELOQUENT LAYER               │  │   │
│  │  │         (Traits: Uuid, Audit, SoftDelete)         │  │   │
│  │  └─────────────────────┬─────────────────────────────┘  │   │
│  │                        │                                │   │
│  │  ┌──────────┐  ┌──────▼─────┐  ┌──────────────────┐   │   │
│  │  │   Jobs   │  │  Events /  │  │   Observers      │   │   │
│  │  │ (Queue)  │  │  Listeners │  │   (Lifecycle)    │   │   │
│  │  └──────────┘  └────────────┘  └──────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                   │
│                    DATA LAYER                                  │
│                            │                                   │
│  ┌──────────┐  ┌──────────▼──────────┐  ┌─────────────────┐   │
│  │  Redis   │  │      MySQL 8        │  │  S3 / Local     │   │
│  │ (Cache,  │  │  (Primary DB,       │  │  (File Storage) │   │
│  │  Queue,  │  │   Audit Logs,       │  │                 │   │
│  │  Session)│  │   Activity Logs)    │  │                 │   │
│  └──────────┘  └─────────────────────┘  └─────────────────┘   │
│                                                                │
│                    INFRASTRUCTURE                              │
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Docker   │  │  Nginx   │  │  GitHub  │  │  CI/CD       │  │
│  │ (Compose) │  │ (Reverse │  │  Actions │  │  Pipeline    │  │
│  │           │  │  Proxy)  │  │          │  │              │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Layered Architecture Flow

```
Request → Middleware → Controller → Service → Repository → Model → Database
                         ↓            ↓           ↓
                      Validation   Business    Query
                                   Logic       Builder
                                      ↓
                                   Response
```

### Module Architecture (Each Future Module Follows)

```
Modules/
└── {ModuleName}/
    ├── Controllers/
    │   └── {ModuleName}Controller.php
    ├── Services/
    │   └── {ModuleName}Service.php
    ├── Repositories/
    │   ├── {ModuleName}RepositoryInterface.php
    │   └── Eloquent{ModuleName}Repository.php
    ├── Models/
    │   └── {ModuleName}.php
    ├── Requests/
    │   ├── Store{ModuleName}Request.php
    │   └── Update{ModuleName}Request.php
    ├── Resources/
    │   ├── {ModuleName}Resource.php
    │   └── {ModuleName}Collection.php
    ├── Policies/
    │   └── {ModuleName}Policy.php
    ├── Observers/
    │   └── {ModuleName}Observer.php
    ├── Events/
    │   ├── {ModuleName}Created.php
    │   ├── {ModuleName}Updated.php
    │   └── {ModuleName}Deleted.php
    ├── Listeners/
    │   ├── Send{ModuleName}Notification.php
    │   └── Log{ModuleName}Activity.php
    ├── Jobs/
    │   └── Process{ModuleName}.php
    ├── Actions/
    │   ├── Create{ModuleName}.php
    │   ├── Update{ModuleName}.php
    │   └── Delete{ModuleName}.php
    ├── DTOs/
    │   └── {ModuleName}DTO.php
    ├── Enums/
    │   └── {ModuleName}StatusEnum.php
    ├── Constants/
    │   └── {ModuleName}Constants.php
    └── routes/
        └── api.php
```

---

## 2. Database Standards

### 2.1 Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Table names | snake_case, plural | `users`, `tiffin_plans`, `order_items` |
| Column names | snake_case | `first_name`, `created_at`, `is_active` |
| Primary keys | `id` (auto-increment) or `uuid` | `id`, `uuid` |
| Foreign keys | `{related_table_singular}_id` | `user_id`, `order_id` |
| Pivot tables | `{table1}_{table2}` (alphabetical) | `order_meals`, `plan_days` |
| Indexes | `idx_{table}_{column}` | `idx_users_email` |
| Unique keys | `uniq_{table}_{column}` | `uniq_users_email` |
| Soft deletes | `deleted_at` | `deleted_at` |
| Timestamps | `created_at`, `updated_at` | `created_at`, `updated_at` |

### 2.2 Standard Table Structure

```sql
CREATE TABLE `users` (
    -- Primary Key
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` CHAR(36) NOT NULL,

    -- Core Fields
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `password` VARCHAR(255) NOT NULL,

    -- Status & Flags
    `status` ENUM('active', 'inactive', 'pending', 'suspended') NOT NULL DEFAULT 'active',
    `email_verified_at` TIMESTAMP NULL,
    `phone_verified_at` TIMESTAMP NULL,

    -- Media
    `avatar` VARCHAR(500) NULL,

    -- Audit Fields
    `created_by` BIGINT UNSIGNED NULL,
    `updated_by` BIGINT UNSIGNED NULL,
    `deleted_by` BIGINT UNSIGNED NULL,

    -- Timestamps
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    `deleted_at` TIMESTAMP NULL,

    -- Primary Key
    PRIMARY KEY (`id`),

    -- Unique Keys
    UNIQUE KEY `uniq_users_uuid` (`uuid`),
    UNIQUE KEY `uniq_users_email` (`email`),

    -- Indexes
    INDEX `idx_users_status` (`status`),
    INDEX `idx_users_phone` (`phone`),
    INDEX `idx_users_created_at` (`created_at`),

    -- Foreign Keys
    CONSTRAINT `fk_users_created_by` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_users_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_users_deleted_by` FOREIGN KEY (`deleted_by`) REFERENCES `users`(`id`) ON DELETE SET NULL

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2.3 Column Naming Rules

| Type | Convention | Example |
|------|-----------|---------|
| Boolean flags | `is_{adjective}` or `has_{noun}` | `is_active`, `has_subscription`, `is_verified` |
| Timestamps | `{verb}_at` | `created_at`, `deleted_at`, `verified_at` |
| Foreign keys | `{entity}_id` | `user_id`, `order_id` |
| Prices/Amounts | `{thing}_amount` or `{thing}_price` | `total_amount`, `discount_amount` |
| Counts | `{thing}_count` | `item_count`, `order_count` |
| Slugs | `slug` | `slug` |
| Sort order | `sort_order` | `sort_order` |
| Type/Category | `{thing}_type` or `{thing}_category` | `order_type`, `payment_category` |

### 2.4 UUID Strategy

- All public-facing resources use UUID for external identification
- UUID is generated via `Str::uuid()` in the `HasUuid` trait
- Internal references use `id` (auto-increment) for performance
- UUID column is `CHAR(36)` with a unique index
- Route model binding uses UUID, not ID

### 2.5 Index Strategy

```sql
-- Single Column Index
INDEX `idx_{table}_{column}` (`column`)

-- Composite Index
INDEX `idx_{table}_{col1}_{col2}` (`col1`, `col2`)

-- Unique Index
UNIQUE INDEX `uniq_{table}_{column}` (`column`)

-- Full-Text Index (for search)
FULLTEXT INDEX `ft_{table}_{columns}` (`col1`, `col2`)
```

### 2.6 Foreign Key Rules

```sql
-- Always use ON DELETE and ON DELETE actions
CONSTRAINT `fk_{table}_{ref_table}` FOREIGN KEY (`ref_table_id`)
    REFERENCES `ref_table`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE

-- Soft-delete aware foreign keys
CONSTRAINT `fk_{table}_{ref_table}` FOREIGN KEY (`ref_table_id`)
    REFERENCES `ref_table`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
```

### 2.7 Audit Fields Standard

Every table must have:

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `created_by` | BIGINT UNSIGNED | YES | User who created the record |
| `updated_by` | BIGINT UNSIGNED | YES | User who last updated the record |
| `deleted_by` | BIGINT UNSIGNED | YES | User who soft-deleted the record |
| `created_at` | TIMESTAMP | YES | Creation timestamp |
| `updated_at` | TIMESTAMP | YES | Last update timestamp |
| `deleted_at` | TIMESTAMP | YES | Soft delete timestamp |

---

## 3. API Standards

### 3.1 Base URL Structure

```
https://api.example.com/api/v1/{resource}
```

### 3.2 Standard API Response Format

#### Success Response
```json
{
    "success": true,
    "message": "Resource retrieved successfully",
    "data": {
        "id": 1,
        "uuid": "550e8400-e29b-41d4-a716-446655440000",
        "name": "John Doe",
        "email": "john@example.com",
        "created_at": "2026-01-15T10:30:00.000000Z",
        "updated_at": "2026-01-15T10:30:00.000000Z"
    }
}
```

#### Validation Error Response
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "email": ["The email field is required."],
        "password": ["The password must be at least 8 characters."]
    }
}
```

#### Unauthorized Response (401)
```json
{
    "success": false,
    "message": "Unauthenticated. Please login."
}
```

#### Forbidden Response (403)
```json
{
    "success": false,
    "message": "Forbidden. You do not have permission to perform this action."
}
```

#### Not Found Response (404)
```json
{
    "success": false,
    "message": "Resource not found."
}
```

#### Server Error Response (500)
```json
{
    "success": false,
    "message": "Internal server error."
}
```

#### Paginated Response
```json
{
    "success": true,
    "message": "Resources retrieved successfully",
    "data": [
        { "id": 1, "name": "Item 1" },
        { "id": 2, "name": "Item 2" }
    ],
    "meta": {
        "current_page": 1,
        "last_page": 5,
        "per_page": 15,
        "total": 75
    },
    "links": {
        "first": "http://api.example.com/api/v1/users?page=1",
        "last": "http://api.example.com/api/v1/users?page=5",
        "prev": null,
        "next": "http://api.example.com/api/v1/users?page=2"
    }
}
```

#### Bulk Response
```json
{
    "success": true,
    "message": "Bulk operation completed",
    "data": null,
    "affected": 5
}
```

#### File Upload Response
```json
{
    "success": true,
    "message": "File uploaded successfully",
    "data": {
        "url": "http://api.example.com/storage/images/2026/01/abc123.webp",
        "name": "abc123.webp",
        "disk": "public"
    }
}
```

### 3.3 HTTP Methods

| Method | Purpose | Example |
|--------|---------|---------|
| `GET` | Read/Retrieve | `GET /api/v1/users` |
| `POST` | Create | `POST /api/v1/users` |
| `PUT` | Full Update | `PUT /api/v1/users/{uuid}` |
| `PATCH` | Partial Update | `PATCH /api/v1/users/{uuid}` |
| `DELETE` | Delete | `DELETE /api/v1/users/{uuid}` |

### 3.4 Standard Endpoints per Resource

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/{resource}` | GET | List (paginated) |
| `/api/v1/{resource}` | POST | Create |
| `/api/v1/{resource}/{uuid}` | GET | Show |
| `/api/v1/{resource}/{uuid}` | PUT | Update |
| `/api/v1/{resource}/{uuid}` | DELETE | Delete |
| `/api/v1/{resource}/bulk-delete` | POST | Bulk Delete |
| `/api/v1/{resource}/bulk-update` | POST | Bulk Update |
| `/api/v1/{resource}/export` | GET | Export (Excel/PDF) |
| `/api/v1/{resource}/import` | POST | Import (Excel/CSV) |

### 3.5 Query Parameters

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `page` | int | `?page=2` | Page number |
| `per_page` | int | `?per_page=25` | Items per page (max 100) |
| `sort` | string | `?sort=name` | Sort field |
| `order` | string | `?order=asc` | Sort direction (asc/desc) |
| `search` | string | `?search=john` | Full-text search |
| `filter[field]` | mixed | `?filter[status]=active` | Field-specific filter |

### 3.6 API Versioning

- URL-based versioning: `/api/v1/`, `/api/v2/`
- Current version: `v1`
- Version defined in `.env` as `APP_API_VERSION`
- Breaking changes require new version
- Deprecation notice: 6-month support window

---

## 4. Security Architecture

### 4.1 Authentication

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Client    │────▶│  Sanctum     │────▶│   MySQL     │
│  (Token)    │     │  Auth Guard   │     │  (users)    │
└─────────────┘     └──────────────┘     └─────────────┘
```

- **Sanctum SPA Authentication** for Admin (cookie-based)
- **Sanctum Token Authentication** for Mobile/API (bearer token)
- Tokens stored in `personal_access_tokens` table
- Token abilities for fine-grained permissions

### 4.2 Authorization (RBAC)

```
Roles Hierarchy:
├── super_admin (full access)
├── admin (manage all modules)
├── manager (manage assigned modules)
└── staff (view + limited operations)

Permissions (per module):
├── view_{module}
├── create_{module}
├── update_{module}
├── delete_{module}
├── export_{module}
└── import_{module}
```

- **Spatie Permission** package for role/permission management
- **Policies** per model for authorization logic
- **Middleware** for route-level protection

### 4.3 Rate Limiting

```php
// routes/api.php
Route::middleware('throttle:login')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);
});

// config/rate_limits.php
'login' => [
    'max_attempts' => 5,
    'decay_minutes' => 15,
],
'api' => [
    'max_attempts' => 60,
    'decay_minutes' => 1,
],
'password_reset' => [
    'max_attempts' => 3,
    'decay_minutes' => 60,
],
```

### 4.4 Password Policy

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (@$!%*?&#)
- Bcrypt hashing (cost factor 12)
- Password history: prevent reuse of last 5 passwords

### 4.5 API Security Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

### 4.6 File Upload Security

- Validate MIME type (server-side, not just extension)
- Maximum file size: 10MB for images, 20MB for documents
- Store outside public web root when possible
- Generate random filenames (prevent path traversal)
- Scan uploaded files for malware (production)
- Validate image dimensions and integrity

### 4.7 Validation Rules

- All inputs validated server-side using Form Requests
- SQL Injection prevention via Eloquent parameter binding
- XSS prevention via Blade `{{ }}` escaping
- CSRF protection for web routes
- JSON input size limits

### 4.8 Audit Logging

```php
// Every significant action logged
activity()
    ->performedOn($model)
    ->withProperties([
        'old' => $oldValues,
        'new' => $newValues,
    ])
    ->event('updated')
    ->log('User updated profile');

// Logs stored in activity_log table
// Retention: 365 days minimum
```

### 4.9 CORS Configuration

```php
// config/cors.php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:4200')],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

---

## 5. Logging Architecture

### 5.1 Log Channels

```php
// config/logging.php
'channels' => [
    'stack' => [
        'driver' => 'stack',
        'channels' => ['daily', 'error_log'],
        'ignore_exceptions' => false,
    ],

    'single' => [
        'driver' => 'single',
        'path' => storage_path('logs/laravel.log'),
        'level' => env('LOG_LEVEL', 'debug'),
    ],

    'daily' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'level' => env('LOG_LEVEL', 'debug'),
        'days' => 90,
    ],

    'error_log' => [
        'driver' => 'error-log',
    ],

    'auth' => [
        'driver' => 'daily',
        'path' => storage_path('logs/auth.log'),
        'level' => 'info',
        'days' => 180,
    ],

    'activity' => [
        'driver' => 'daily',
        'path' => storage_path('logs/activity.log'),
        'level' => 'info',
        'days' => 365,
    ],

    'api' => [
        'driver' => 'daily',
        'path' => storage_path('logs/api.log'),
        'level' => 'info',
        'days' => 90,
    ],

    'system' => [
        'driver' => 'daily',
        'path' => storage_path('logs/system.log'),
        'level' => 'warning',
        'days' => 365,
    ],
],
```

### 5.2 Log Levels

| Level | Usage |
|-------|-------|
| `emergency` | System is unusable |
| `alert` | Action must be taken immediately |
| `critical` | Critical conditions |
| `error` | Runtime errors |
| `warning` | Exceptional occurrences |
| `notice` | Normal but significant events |
| `info` | Informational events |
| `debug` | Detailed debug information |

### 5.3 Log Categories

```
logs/
├── laravel.log          # General application log (daily rotation)
├── auth.log             # Authentication events (login, logout, failed attempts)
├── activity.log         # User activity audit trail
├── api.log              # API request/response logs
├── system.log           # System-level warnings and errors
├── queue.log            # Queue job processing logs
└── sql.log              # Slow query logs (dev only)
```

### 5.4 Authentication Logs

```php
// What to log:
- Login success
- Login failure (with IP and email)
- Password reset requested
- Password reset completed
- Token created
- Token revoked
- Account locked
- Account unlocked
```

### 5.5 Activity Logs (Spatie)

```php
// Activity types per module
activity('auth')->performedOn($user)->event('login')->log('User logged in');
activity('users')->performedOn($user)->event('created')->log('User created');
activity('orders')->performedOn($order)->event('updated')->log('Order status changed');

// Activity properties stored:
// - log_name: module name
// - description: action description
// - subject_type: model class
// - subject_id: model ID
// - causer_type: user class
// - causer_id: user ID
// - properties: old/new values (JSON)
// - event: event type
```

---

## 6. Queue Architecture

### 6.1 Queue Configuration

```php
// .env
QUEUE_CONNECTION=redis

// config/queue.php
'connections' => [
    'redis' => [
        'driver' => 'redis',
        'connection' => 'default',
        'queue' => env('REDIS_QUEUE', 'default'),
        'retry_after' => 90,
        'block_for' => null,
    ],
],

'failed' => [
    'driver' => env('QUEUE_FAILED_DRIVER', 'database-uuids'),
    'database' => env('DB_CONNECTION', 'mysql'),
    'table' => 'failed_jobs',
],
```

### 6.2 Queue Naming Convention

| Queue | Purpose | Priority |
|-------|---------|----------|
| `high` | Critical operations (notifications) | Highest |
| `default` | Standard operations | Normal |
| `low` | Background tasks (reports, exports) | Low |
| `notifications` | Email, SMS, Push notifications | Medium |
| `reports` | Report generation, data exports | Low |

### 6.3 Job Structure

```php
class ProcessOrderExport extends BaseJob
{
    public int $tries = 3;
    public int $timeout = 300;
    public string $jobName = 'process-order-export';

    public function __construct(
        private readonly int $userId,
        private readonly array $filters
    ) {
        parent::__construct();
    }

    public function handle(): void
    {
        // Process export
    }

    public function failed(\Throwable $exception): void
    {
        parent::failed($exception);
        // Notify user of failure
    }
}
```

### 6.4 Retry Strategy

| Attempt | Delay | Action |
|---------|-------|--------|
| 1 | 0s | Immediate retry |
| 2 | 60s | 1 minute delay |
| 3 | 300s | 5 minutes delay |
| Failed | - | Move to failed_jobs table |

### 6.5 Failed Job Handling

```php
// Failed jobs tracked in `failed_jobs` table
// Horizon dashboard for monitoring
// Notifications on job failure
// Manual retry from Horizon dashboard
```

### 6.6 Scheduler

```php
// app/Console/Kernel.php
$schedule->command('queue:work --stop-when-empty')
    ->everyMinute()
    ->withoutOverlapping()
    ->onQueue('default');

$schedule->command('activity:clean')
    ->daily()
    ->at('02:00');

$schedule->command('cache:prune-stale-tags')
    ->hourly();

$schedule->command('schedule:run')
    ->everyMinute();
```

---

## 7. File Storage Architecture

### 7.1 Storage Disks

```php
// config/filesystems.php
'disks' => [
    'local' => [
        'driver' => 'local',
        'root' => storage_path('app/private'),
        'throw' => false,
    ],
    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'),
        'url' => env('APP_URL') . '/storage',
        'visibility' => 'public',
    ],
    's3' => [
        'driver' => 's3',
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION'),
        'bucket' => env('AWS_BUCKET'),
        'url' => env('AWS_URL'),
    ],
],
```

### 7.2 Storage Paths

```
storage/app/
├── public/                    # Public files (symlinked)
│   ├── avatars/               # User profile images
│   │   └── 2026/01/
│   ├── meal-images/           # Meal/food images
│   │   └── 2026/01/
│   └── documents/             # Public documents
├── private/                   # Private files
│   ├── reports/               # Generated reports
│   ├── invoices/              # Invoice PDFs
│   └── documents/             # Private documents
├── temp/                      # Temporary uploads
│   └── (auto-cleanup daily)
└── logs/                      # Application logs
    ├── laravel.log
    ├── auth.log
    ├── activity.log
    ├── api.log
    └── system.log
```

### 7.3 File Upload Rules

| File Type | Max Size | Allowed Types | Disk |
|-----------|----------|---------------|------|
| Avatar | 2MB | jpeg, png, webp | public |
| Meal Image | 5MB | jpeg, png, webp | public |
| Document | 20MB | pdf, doc, docx | private |
| Report | 50MB | pdf, xlsx, csv | private |
| Temp Upload | 10MB | all types | temp |

### 7.4 Image Processing

```php
// Using Intervention Image
$uploadManager->uploadImage($file, 'meal-images', 1200, 1200, 85);
// - Resize to max 1200x1200 (maintain aspect ratio)
// - Convert to WebP format
// - 85% quality
// - Generate random filename
// - Store with date-based path: {folder}/2026/01/{hash}.webp
```

### 7.5 Temporary File Cleanup

```php
// Scheduled: Daily at 3:00 AM
// Delete files older than 24 hours from temp/
// Log cleanup activity
```

---

## 8. UI Design System

### 8.1 Color Palette

```scss
// Primary Colors
$primary-50:  #EEF2FF;
$primary-100: #E0E7FF;
$primary-200: #C7D2FE;
$primary-300: #A5B4FC;
$primary-400: #818CF8;
$primary-500: #6366F1;  // Indigo
$primary-600: #4F46E5;
$primary-700: #4338CA;
$primary-800: #3730A3;
$primary-900: #312E81;

// Secondary Colors
$secondary-50:  #F8FAFC;
$secondary-100: #F1F5F9;
$secondary-200: #E2E8F0;
$secondary-300: #CBD5E1;
$secondary-400: #94A3B8;
$secondary-500: #64748B;
$secondary-600: #475569;
$secondary-700: #334155;
$secondary-800: #1E293B;
$secondary-900: #0F172A;

// Status Colors
$success: #22C55E;
$warning: #F59E0B;
$danger:  #EF4444;
$info:    #3B82F6;
```

### 8.2 Typography

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| H1 | Inter | 30px | 700 | 36px |
| H2 | Inter | 24px | 700 | 32px |
| H3 | Inter | 20px | 600 | 28px |
| H4 | Inter | 18px | 600 | 24px |
| Body | Inter | 14px | 400 | 20px |
| Small | Inter | 12px | 400 | 16px |
| Caption | Inter | 11px | 500 | 14px |
| Mono | JetBrains Mono | 13px | 400 | 18px |

### 8.3 Spacing System

```
4px  → space-1 (0.25rem)
8px  → space-2 (0.5rem)
12px → space-3 (0.75rem)
16px → space-4 (1rem)
20px → space-5 (1.25rem)
24px → space-6 (1.5rem)
32px → space-8 (2rem)
40px → space-10 (2.5rem)
48px → space-12 (3rem)
64px → space-16 (4rem)
```

### 8.4 Component Specifications

#### Buttons
| Variant | Background | Text | Border | Padding | Radius |
|---------|-----------|------|--------|---------|--------|
| Primary | #6366F1 | White | None | 8px 16px | 8px |
| Secondary | White | #6366F1 | #6366F1 | 8px 16px | 8px |
| Danger | #EF4444 | White | None | 8px 16px | 8px |
| Ghost | Transparent | #6366F1 | None | 8px 16px | 8px |
| Text | Transparent | #6366F1 | None | 4px 8px | 4px |

#### Form Inputs
| Property | Value |
|----------|-------|
| Height | 40px |
| Border | 1px solid #CBD5E1 |
| Border Focus | 2px solid #6366F1 |
| Border Radius | 8px |
| Padding | 8px 12px |
| Font Size | 14px |
| Background | White |
| Error Border | #EF4444 |

#### Cards
| Property | Value |
|----------|-------|
| Background | White |
| Border | 1px solid #E2E8F0 |
| Border Radius | 12px |
| Padding | 24px |
| Shadow | 0 1px 3px rgba(0,0,0,0.1) |

#### Status Badges
| Status | Background | Text | Dot Color |
|--------|-----------|------|-----------|
| Active | #F0FDF4 | #16A34A | #22C55E |
| Inactive | #FEF2F2 | #DC2626 | #EF4444 |
| Pending | #FFFBEB | #D97706 | #F59E0B |
| Suspended | #EFF6FF | #2563EB | #3B82F6 |

### 8.5 Icon System

- **Primary:** Material Icons (Google Fonts)
- **Secondary:** Custom SVG icons
- **Size Options:** 16px, 20px, 24px, 32px, 48px
- **Default:** 24px, grey-600

### 8.6 Dark Mode

```scss
// Toggle between .theme-light and .theme-dark on body
.theme-dark {
  --bg-primary: #0F172A;
  --bg-secondary: #1E293B;
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
  --border-color: #334155;
  --card-bg: #1E293B;
}
```

---

## 9. Coding Standards

### 9.1 PHP Standards

| Rule | Standard |
|------|----------|
| PHP Version | 8.4+ |
| Coding Style | PSR-12 |
| Type Declarations | Strict types on all files (`declare(strict_types=1)`) |
| Return Types | Always declare return types |
| Property Types | Always use typed properties |
| Nullable | Use `?Type` or `Type\|null` |
| Enums | Use PHP 8.1+ enums |
| Named Arguments | Use when clarity needed |

### 9.2 Laravel Standards

| Rule | Standard |
|------|----------|
| Controllers | Thin controllers, delegate to services |
| Services | Business logic only, no HTTP concerns |
| Repositories | Database queries only |
| Models | Relationships, scopes, accessors/mutators only |
| Requests | Form validation in FormRequest classes |
| Resources | API transformation in Resource classes |
| Naming | Singular for models, plural for controllers |
| Routes | `Route::apiResource()` preferred |

### 9.3 Angular Standards

| Rule | Standard |
|------|----------|
| Components | Standalone components only (Angular 20) |
| Naming | `{feature}.component.ts`, `{feature}.service.ts` |
| Templates | Inline templates for small, external for complex |
| Signals | Use signals for reactive state (Angular 17+) |
| Lazy Loading | All feature routes lazy loaded |
| Imports | Organized by module, no wildcards |
| Styling | Tailwind CSS + Angular Material |

### 9.4 TypeScript Standards

| Rule | Standard |
|------|----------|
| Strict Mode | Enabled |
| Interfaces | Prefer interfaces over types |
| Naming | camelCase for variables/functions, PascalCase for classes/interfaces |
| Enums | Use `const enum` when possible |
| Any | Avoid `any`, use `unknown` when needed |
| Null Handling | Use `!` operator judiciously |

### 9.5 SQL Standards

| Rule | Standard |
|------|----------|
| Keywords | UPPERCASE (SELECT, FROM, WHERE) |
| Naming | snake_case for all identifiers |
| Joins | Explicit JOIN syntax, not comma joins |
| Indexes | Named indexes |
| Charset | utf8mb4_unicode_ci |
| Engine | InnoDB |

### 9.6 Folder Naming

| Location | Convention | Example |
|----------|-----------|---------|
| Laravel Modules | PascalCase | `Modules/UserManagement/` |
| Laravel Classes | PascalCase | `UserService.php` |
| Laravel Folders | PascalCase | `Services/`, `Repositories/` |
| Angular Features | kebab-case | `features/user-management/` |
| Angular Components | kebab-case | `data-table.component.ts` |
| Config Files | snake_case | `app.php`, `cors.php` |

### 9.7 Method Naming

| Type | Convention | Example |
|------|-----------|---------|
| Controllers | camelCase | `index()`, `store()`, `show()` |
| Services | camelCase | `createUser()`, `processOrder()` |
| Repositories | camelCase | `findByEmail()`, `getActiveUsers()` |
| Boolean Methods | `is_`, `has_`, `can_` | `isActive()`, `hasPermission()` |
| Setters | `set_` | `setStatus()`, `setEmail()` |
| Getters | `get_` | `getFullName()`, `getEmail()` |
| Events | Past tense | `UserCreated`, `OrderProcessed` |
| Listeners | Verb phrase | `SendWelcomeEmail`, `LogActivity` |

### 9.8 Migration Naming

```
Pattern: {timestamp}_{action}_{table_name}.php

Examples:
- 2026_01_15_000001_create_users_table.php
- 2026_01_15_000002_create_orders_table.php
- 2026_01_15_000003_add_phone_to_users_table.php
- 2026_01_15_000004_create_order_items_table.php
- 2026_01_15_000005_add_status_to_orders_table.php
```

### 9.9 Route Naming

```php
// api.php
Route::apiResource('users', UserController::class);

// Generated route names:
// users.index
// users.store
// users.show
// users.update
// users.destroy
```

---

## 10. Recommended Packages

### 10.1 Laravel Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `laravel/sanctum` | ^4.0 | API token authentication |
| `spatie/laravel-permission` | ^7.0 | Role & permission management |
| `spatie/laravel-activitylog` | ^4.9 | Audit trail / activity logging |
| `spatie/laravel-medialibrary` | ^11.0 | File/media management |
| `intervention/image` | ^3.0 | Image processing & manipulation |
| `maatwebsite/excel` | ^3.1 | Excel import/export |
| `laravel/horizon` | ^5.0 | Queue monitoring dashboard |
| `laravel/pulse` | ^1.0 | Application performance monitoring |
| `darkaonline/l5-swagger` | ^9.0 | Swagger/OpenAPI documentation |
| `predis/predis` | ^2.0 | Redis PHP client |
| `laravel/telescope` | ^5.0 | Debug & development assistant |
| `laravel/sail` | ^1.0 | Docker development environment |
| `guzzlehttp/guzzle` | ^7.8 | HTTP client for API calls |
| `league/flysystem-aws-s3-v3` | ^3.0 | S3 filesystem adapter |

### 10.2 Angular Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `@angular/material` | ^20.0 | Material Design UI components |
| `@angular/cdk` | ^20.0 | Component Dev Kit (prerequisites) |
| `@ngx-translate/core` | ^15.0 | Internationalization (i18n) |
| `@ngx-translate/http-loader` | ^8.0 | Translation file loader |
| `apexcharts` | ^4.0 | Chart library |
| `ngx-apexcharts` | ^1.0 | Angular wrapper for ApexCharts |
| `tailwindcss` | ^3.4 | Utility-first CSS framework |
| `autoprefixer` | ^10.4 | CSS vendor prefixing |
| `postcss` | ^8.4 | CSS transformation |

### 10.3 Development Packages

| Package | Purpose |
|---------|---------|
| `phpunit/phpunit` | PHP testing framework |
| `nunomaduro/collision` | Error reporting for CLI |
| `laravel/pint` | Laravel code style fixer |
| `mockery/mockery` | Mocking for tests |
| `fakerphp/faker` | Test data generation |

---

## 11. Development Workflow

### 11.1 Git Branch Strategy

```
main (production)
├── develop (integration)
│   ├── feature/TIFF-001-user-module
│   ├── feature/TIFF-002-order-module
│   ├── feature/TIFF-003-meal-module
│   ├── bugfix/TIFF-050-fix-login
│   └── hotfix/TIFF-100-critical-fix
├── staging (pre-production)
└── release/v1.0.0 (release preparation)
```

| Branch | Purpose | Merges Into |
|--------|---------|-------------|
| `main` | Production-ready code | - |
| `develop` | Integration branch | `main` |
| `feature/*` | New features | `develop` |
| `bugfix/*` | Bug fixes | `develop` |
| `hotfix/*` | Critical production fixes | `main` + `develop` |
| `staging` | Pre-production testing | `main` |
| `release/*` | Release preparation | `main` + `develop` |

### 11.2 Commit Convention

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Build/tooling changes
- `perf`: Performance improvements
- `ci`: CI/CD changes

**Examples:**
```
feat(users): add user registration module
fix(auth): resolve token refresh issue
docs(api): update Swagger documentation
refactor(orders): extract business logic to service
test(users): add unit tests for UserService
chore(deps): update Laravel to 12.1
```

### 11.3 Code Review Rules

1. Every PR requires at least 1 approval
2. All CI checks must pass
3. No merge conflicts
4. Follow coding standards (automated via Pint/ESLint)
5. Add tests for new features
6. Update documentation for API changes
7. Review for security vulnerabilities
8. Check performance implications

### 11.4 Database Migration Rules

1. Never modify a deployed migration
2. Always create a new migration for changes
3. Use `up()` and `down()` methods
4. Add indexes for foreign keys
5. Test rollback before deploying
6. Use transactions for complex migrations
7. Document breaking changes
8. Backward compatible when possible

### 11.5 Testing Rules

| Type | Coverage Target | Tools |
|------|----------------|-------|
| Unit Tests | 80%+ | PHPUnit, Jest |
| Feature Tests | All API endpoints | PHPUnit |
| Integration Tests | Critical paths | PHPUnit |
| E2E Tests | User flows | Cypress / Playwright |
| Angular Unit Tests | 70%+ | Karma, Jasmine |

### 11.6 API Versioning Rules

1. Version in URL: `/api/v1/`
2. Breaking changes require new version
3. Minimum 6-month support for old versions
4. Deprecation headers in responses
5. Version documentation in Swagger

### 11.7 Environment Management

| Environment | URL | Database | Debug | Queue |
|-------------|-----|----------|-------|-------|
| Local | localhost | tiffin_db_local | true | sync |
| Development | dev.api.example.com | tiffin_db_dev | true | redis |
| Staging | staging.api.example.com | tiffin_db_staging | false | redis |
| Production | api.example.com | tiffin_db_prod | false | redis |

---

## 12. Best Practices

### 12.1 Laravel Best Practices

1. **Thin Controllers** - Business logic in services
2. **Repository Pattern** - Database abstraction
3. **Form Requests** - Validation separation
4. **API Resources** - Response transformation
5. **Events/Listeners** - Loose coupling
6. **Jobs** - Async processing
7. **Policies** - Authorization logic
8. **Traits** - Reusable behavior
9. **DTOs** - Data transfer objects
10. **Enums** - Type-safe constants

### 12.2 Angular Best Practices

1. **Standalone Components** - No NgModules
2. **Lazy Loading** - Route-based code splitting
3. **Signals** - Reactive state management
4. **OnPush** - Change detection strategy
5. **Interceptors** - Cross-cutting concerns
6. **Services** - Single responsibility
7. **Guards** - Route protection
8. **Pipes** - Template transformations
9. **TrackBy** - NgFor performance
10. **DestroyRef** - Memory leak prevention

### 12.3 Performance Optimization

```
Backend:
- Redis caching for frequently accessed data
- Database query optimization (indexes, eager loading)
- Queue for heavy operations
- Image compression and optimization
- API response compression (gzip)
- Database connection pooling

Frontend:
- Lazy loading for all feature modules
- OnPush change detection
- Virtual scrolling for large lists
- Image lazy loading
- Debounced search inputs
- Optimistic UI updates
- Service worker for caching (future)
```

### 12.4 Error Handling Strategy

```
Backend:
├── Global Exception Handler (Handler.php)
├── Form Request Validation (422 responses)
├── Business Exceptions (custom error codes)
├── Database Exceptions (query failures)
├── File Upload Exceptions (size, type)
├── Authentication Exceptions (401)
├── Authorization Exceptions (403)
└── Logging (all errors logged with context)

Frontend:
├── HTTP Interceptor (global error handling)
├── Toast Notifications (user feedback)
├── Route Guards (access control)
├── Form Validation (real-time feedback)
└── Error Boundaries (component-level)
```

### 12.5 Deployment Checklist

```markdown
## Pre-Deployment
- [ ] All tests passing
- [ ] Code review completed
- [ ] Database migrations ready
- [ ] Environment variables configured
- [ ] Dependencies updated
- [ ] Assets built for production
- [ ] Swagger documentation updated

## Deployment
- [ ] Enable maintenance mode
- [ ] Pull latest code
- [ ] Install dependencies
- [ ] Run migrations
- [ ] Clear caches
- [ ] Restart queues
- [ ] Build frontend assets
- [ ] Disable maintenance mode

## Post-Deployment
- [ ] Health check endpoint responding
- [ ] Authentication working
- [ ] API endpoints responding
- [ ] Queue processing
- [ ] File uploads working
- [ ] Email notifications sending
- [ ] Error monitoring active
- [ ] Performance metrics normal

## Rollback Plan
- [ ] Database backup available
- [ ] Previous code version tagged
- [ ] Rollback script ready
- [ ] Team notified
```

### 12.6 Security Checklist

```markdown
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Eloquent)
- [ ] XSS prevention (Blade escaping)
- [ ] CSRF protection enabled
- [ ] File upload validation
- [ ] Authentication logs active
- [ ] Activity audit logs enabled
- [ ] Sensitive data encrypted
- [ ] API tokens have expiration
- [ ] Password policy enforced
- [ ] Session security configured
- [ ] Security headers configured
```
