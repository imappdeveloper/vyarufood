<?php

declare(strict_types=1);

namespace App\Traits;

use Illuminate\Support\Facades\Cache;

trait Cacheable
{
    public function getCacheKey(string $identifier = ''): string
    {
        $class = class_basename(static::class);
        $id = $identifier ?: $this->getKey();

        return strtolower("{$class}:{$id}");
    }

    public static function cachedFind(int|string $key, callable $callback, int $ttl = 3600): mixed
    {
        $instance = new static;
        $cacheKey = static::class . ':' . $key;

        return Cache::remember($cacheKey, $ttl, fn () => $callback($key));
    }

    public function clearCache(): void
    {
        Cache::forget($this->getCacheKey());
    }

    public static function flushCache(): void
    {
        $instance = new static;
        $tableName = $instance->getTable();

        Cache::tags([$tableName])->flush();
    }
}
