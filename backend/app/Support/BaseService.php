<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

abstract class BaseService
{
    protected string $moduleName = 'system';

    public function __construct()
    {
        $this->moduleName = class_basename(static::class);
    }

    protected function transaction(callable $callback): mixed
    {
        return DB::transaction(function () use ($callback) {
            try {
                return $callback();
            } catch (\Exception $e) {
                Log::error("Transaction failed in {$this->moduleName}", [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ]);
                throw $e;
            }
        });
    }

    protected function logInfo(string $message, array $context = []): void
    {
        Log::info("[{$this->moduleName}] {$message}", $context);
    }

    protected function logError(string $message, array $context = []): void
    {
        Log::error("[{$this->moduleName}] {$message}", $context);
    }

    protected function logWarning(string $message, array $context = []): void
    {
        Log::warning("[{$this->moduleName}] {$message}", $context);
    }

    protected function logActivity(string $action, mixed $subject = null, array $properties = []): void
    {
        if (method_exists(\Spatie\Activitylog\Facades\Activity::class, 'class')) {
            auth()->user()?->activities()->create([
                'log_name' => $this->moduleName,
                'description' => $action,
                'subject_type' => get_model_class($subject),
                'subject_id' => $subject?->getKey(),
                'properties' => $properties,
            ]);
        }
    }
}
