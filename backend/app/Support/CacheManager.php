<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;

class CacheManager
{
    public static function remember(string $key, int $ttl, callable $callback): mixed
    {
        return Cache::remember($key, $ttl, $callback);
    }

    public static function forget(string $key): bool
    {
        return Cache::forget($key);
    }

    public static function flush(string $prefix = ''): void
    {
        $driver = config('cache.default', 'file');

        if ($prefix && $driver === 'redis') {
            try {
                $keys = Redis::keys("*{$prefix}*");
                if (!empty($keys)) {
                    Redis::del($keys);
                }
                return;
            } catch (\Exception) {
            }
        }

        if ($prefix) {
            $knownKeys = [
                "{$prefix}:all",
                "{$prefix}:active",
                "{$prefix}:default",
            ];
            foreach ($knownKeys as $key) {
                Cache::forget($key);
            }
            return;
        }

        Cache::flush();
    }

    public static function tags(array $tags): \Illuminate\Cache\TaggedCache
    {
        return Cache::tags($tags);
    }

    public static function cacheKey(string $module, string $identifier = '', string $suffix = ''): string
    {
        $parts = array_filter([$module, $identifier, $suffix]);
        return implode(':', $parts);
    }
}
