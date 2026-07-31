<?php

declare(strict_types=1);

if (!function_exists('format_currency')) {
    function format_currency(float $amount, string $symbol = '₹', int $decimals = 2): string
    {
        return $symbol . number_format($amount, $decimals, '.', ',');
    }
}

if (!function_exists('generate_unique_code')) {
    function generate_unique_code(string $prefix = '', int $length = 8): string
    {
        $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $code = '';

        for ($i = 0; $i < $length; $i++) {
            $code .= $characters[random_int(0, strlen($characters) - 1)];
        }

        return $prefix ? $prefix . $code : $code;
    }
}

if (!function_exists('get_model_class')) {
    function get_model_class($model): ?string
    {
        if ($model instanceof \Illuminate\Database\Eloquent\Model) {
            return get_class($model);
        }
        return null;
    }
}

if (!function_exists('slugify')) {
    function slugify(string $text): string
    {
        $text = strtolower(trim($text));
        $text = preg_replace('/[^a-z0-9-]/', '-', $text);
        $text = preg_replace('/-+/', '-', $text);
        return trim($text, '-');
    }
}

if (!function_exists('time_ago')) {
    function time_ago(\DateTimeInterface $datetime): string
    {
        $now = new \DateTime();
        $diff = $now->diff($datetime);

        if ($diff->y > 0) return $diff->y . ' year' . ($diff->y > 1 ? 's' : '') . ' ago';
        if ($diff->m > 0) return $diff->m . ' month' . ($diff->m > 1 ? 's' : '') . ' ago';
        if ($diff->d > 0) return $diff->d . ' day' . ($diff->d > 1 ? 's' : '') . ' ago';
        if ($diff->h > 0) return $diff->h . ' hour' . ($diff->h > 1 ? 's' : '') . ' ago';
        if ($diff->i > 0) return $diff->i . ' minute' . ($diff->i > 1 ? 's' : '') . ' ago';

        return 'Just now';
    }
}

if (!function_exists('mask_email')) {
    function mask_email(string $email): string
    {
        [$name, $domain] = explode('@', $email);
        $masked = substr($name, 0, 2) . str_repeat('*', max(strlen($name) - 2, 3));
        return $masked . '@' . $domain;
    }
}

if (!function_exists('mask_phone')) {
    function mask_phone(string $phone): string
    {
        return str_repeat('*', max(strlen($phone) - 4, 0)) . substr($phone, -4);
    }
}

if (!function_exists('generate_otp')) {
    function generate_otp(int $length = 6): string
    {
        $min = (int) str_repeat('1', $length);
        $max = (int) str_repeat('9', $length);
        return (string) random_int($min, $max);
    }
}

if (!function_exists('round_to')) {
    function round_to(float $value, int $precision = 2): float
    {
        return round($value, $precision);
    }
}

if (!function_exists('bytes_to_human')) {
    function bytes_to_human(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, 2) . ' ' . $units[$pow];
    }
}

if (!function_exists('random_color')) {
    function random_color(): string
    {
        return '#' . dechex(random_int(0, 16777215));
    }
}

if (!function_exists('parse_user_agent')) {
    function parse_user_agent(string $userAgent): array
    {
        $result = [
            'platform' => null,
            'browser' => null,
            'browser_version' => null,
            'device' => null,
            'is_mobile' => false,
            'is_tablet' => false,
            'is_desktop' => false,
            'is_robot' => false,
        ];

        $platforms = [
            'Windows' => 'Windows',
            'iPhone' => 'iOS',
            'iPad' => 'iOS',
            'Mac' => 'macOS',
            'Android' => 'Android',
            'Linux' => 'Linux',
            'ChromeOS' => 'ChromeOS',
            'Ubuntu' => 'Linux',
            'Debian' => 'Linux',
            'CentOS' => 'Linux',
            'Fedora' => 'Linux',
        ];

        foreach ($platforms as $pattern => $name) {
            if (stripos($userAgent, $pattern) !== false) {
                $result['platform'] = $name;
                break;
            }
        }

        $browsers = [
            'Edg/' => 'Edge',
            'OPR/' => 'Opera',
            'Chrome/' => 'Chrome',
            'Firefox/' => 'Firefox',
            'Safari/' => 'Safari',
            'MSIE' => 'IE',
            'Trident/' => 'IE',
            'Opera' => 'Opera',
        ];

        foreach ($browsers as $pattern => $name) {
            if (stripos($userAgent, $pattern) !== false) {
                $result['browser'] = $name;

                $versionPattern = $pattern;
                if (str_ends_with($versionPattern, '/')) {
                    $versionPattern = rtrim($versionPattern, '/') . '([\d.]+)';
                } else {
                    $versionPattern = $versionPattern . '/([\d.]+)';
                }

                if (preg_match('#' . $versionPattern . '#i', $userAgent, $matches)) {
                    $result['browser_version'] = $matches[1] ?? null;
                }

                break;
            }
        }

        if (preg_match('#(bot|crawl|spider|slurp|mediapartners|preview)#i', $userAgent)) {
            $result['is_robot'] = true;
        }

        if (preg_match('#Mobile|iP(hone|od)|Android.*Mobile|Windows Phone#i', $userAgent)) {
            $result['is_mobile'] = true;
            $result['device'] = 'Mobile';
        } elseif (preg_match('#iPad|Android(?!.*Mobile)|Tablet#i', $userAgent)) {
            $result['is_tablet'] = true;
            $result['device'] = 'Tablet';
        } elseif (!$result['is_robot']) {
            $result['is_desktop'] = true;
            $result['device'] = 'Desktop';
        }

        return $result;
    }
}
