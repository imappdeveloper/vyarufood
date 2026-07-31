<?php

declare(strict_types=1);

namespace App\Models;

use App\Models\Auth\Admin;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SystemSetting extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $table = 'system_settings';

    protected $fillable = [
        'uuid',
        'setting_group',
        'setting_key',
        'setting_value',
        'data_type',
        'is_encrypted',
        'autoload',
        'status',
        'remarks',
        'updated_by',
    ];

    protected $casts = [
        'is_encrypted' => 'boolean',
        'autoload' => 'boolean',
    ];

    public function updater(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    public function getValueAttribute(): mixed
    {
        $value = $this->attributes['setting_value'] ?? null;

        if ($value === null) {
            return null;
        }

        if ($this->is_encrypted) {
            try {
                $value = decrypt($value);
            } catch (\Exception) {
                return $value;
            }
        }

        return match ($this->data_type) {
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $value,
            'float' => (float) $value,
            'json' => json_decode($value, true),
            default => $value,
        };
    }

    public function setRawValue(string $value): void
    {
        $this->attributes['setting_value'] = $this->is_encrypted ? encrypt($value) : $value;
    }

    public function scopeByGroup($query, string $group)
    {
        return $query->where('setting_group', $group);
    }

    public function scopeAutoloaded($query)
    {
        return $query->where('autoload', true)->where('status', 'active');
    }
}
