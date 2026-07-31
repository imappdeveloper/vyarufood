<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AppVersion extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $table = 'app_versions';

    protected $fillable = [
        'uuid',
        'platform',
        'version_name',
        'version_code',
        'minimum_supported_version',
        'force_update',
        'release_notes',
        'status',
    ];

    protected $casts = [
        'version_code' => 'integer',
        'force_update' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeForPlatform($query, string $platform)
    {
        return $query->where('platform', $platform);
    }

    public function scopeLatestForPlatform($query, string $platform)
    {
        return $query->where('platform', $platform)
            ->where('status', 'active')
            ->orderByDesc('version_code');
    }

    public function isOutdated(string $currentVersion): bool
    {
        return version_compare($currentVersion, $this->minimum_supported_version ?? $this->version_name, '<');
    }
}
