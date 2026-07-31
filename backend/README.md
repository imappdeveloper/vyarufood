# Tiffin Management System - Backend API

## Architecture
- Laravel 12
- PHP 8.4
- MySQL 8
- Redis
- Sanctum Auth

## Setup
1. `composer install`
2. Copy `.env.example` to `.env`
3. `php artisan key:generate`
4. `php artisan migrate`
5. `php artisan db:seed`

## Development
- `php artisan serve`
- `php artisan queue:work`
