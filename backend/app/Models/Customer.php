<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use App\Traits\HasAuditFields;
use App\Traits\Filterable;
use App\Enums\StatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Customer extends Authenticatable
{
    use HasApiTokens, HasFactory, HasUuid, HasAuditFields, Filterable, SoftDeletes, Notifiable;

    protected $fillable = [
        'uuid', 'first_name', 'last_name', 'email', 'phone', 'country_code',
        'password', 'profile_photo', 'gender', 'date_of_birth',
        'address_line_1', 'address_line_2', 'country_id', 'state_id', 'city_id',
        'area_id', 'pincode', 'latitude', 'longitude',
        'status', 'is_blocked', 'block_reason',
        'wallet_balance', 'wallet_currency', 'referral_code', 'referred_by',
        'email_verified', 'phone_verified', 'otp_code', 'otp_expires_at',
        'last_login_at', 'last_login_ip', 'last_login_device', 'last_login_browser',
        'created_by', 'updated_by', 'deleted_by',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'date_of_birth' => 'date',
            'latitude' => 'float',
            'longitude' => 'float',
            'is_blocked' => 'boolean',
            'wallet_balance' => 'float',
            'email_verified' => 'boolean',
            'phone_verified' => 'boolean',
            'otp_expires_at' => 'datetime',
            'last_login_at' => 'datetime',
            'status' => StatusEnum::class,
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    public function scopeActive($query)
    {
        return $query->where('status', StatusEnum::Active);
    }

    public function scopeUnblocked($query)
    {
        return $query->where('is_blocked', false);
    }

    public function scopeSearch($query, ?string $search)
    {
        if (! $search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('first_name', 'LIKE', "%{$search}%")
              ->orWhere('last_name', 'LIKE', "%{$search}%")
              ->orWhere('email', 'LIKE', "%{$search}%")
              ->orWhere('phone', 'LIKE', "%{$search}%")
              ->orWhere('referral_code', 'LIKE', "%{$search}%");
        });
    }

    public function country()
    {
        return $this->belongsTo(\App\Models\Master\Country::class);
    }

    public function state()
    {
        return $this->belongsTo(\App\Models\Master\State::class);
    }

    public function city()
    {
        return $this->belongsTo(\App\Models\Master\City::class);
    }

    public function area()
    {
        return $this->belongsTo(\App\Models\Master\Area::class);
    }

    public function referrer()
    {
        return $this->belongsTo(Customer::class, 'referred_by');
    }

    public function referrals()
    {
        return $this->hasMany(Customer::class, 'referred_by');
    }

    public function addresses()
    {
        return $this->hasMany(CustomerAddress::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'updated_by');
    }

    public function isActive(): bool
    {
        return $this->status === StatusEnum::Active;
    }

    public function isBlocked(): bool
    {
        return (bool) $this->is_blocked;
    }

    public function hasVerifiedEmail(): bool
    {
        return (bool) $this->email_verified;
    }

    public function hasVerifiedPhone(): bool
    {
        return (bool) $this->phone_verified;
    }

    public function generateOtp(): string
    {
        $otp = str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
        $this->update([
            'otp_code' => $otp,
            'otp_expires_at' => now()->addMinutes(10),
        ]);
        return $otp;
    }

    public function verifyOtp(string $otp): bool
    {
        if (
            $this->otp_code === $otp &&
            $this->otp_expires_at &&
            $this->otp_expires_at->isFuture()
        ) {
            $this->update([
                'otp_code' => null,
                'otp_expires_at' => null,
                'phone_verified' => true,
            ]);
            return true;
        }
        return false;
    }

    public function recordLogin(string $ip, ?string $device, ?string $browser): void
    {
        $this->update([
            'last_login_at' => now(),
            'last_login_ip' => $ip,
            'last_login_device' => $device,
            'last_login_browser' => $browser,
        ]);
    }

    public function block(?string $reason = null): void
    {
        $this->update([
            'is_blocked' => true,
            'block_reason' => $reason,
            'status' => StatusEnum::Suspended,
        ]);
    }

    public function unblock(): void
    {
        $this->update([
            'is_blocked' => false,
            'block_reason' => null,
            'status' => StatusEnum::Active,
        ]);
    }

    public function addToWallet(float $amount, ?string $description = null): float
    {
        $this->wallet_balance += $amount;
        $this->save();

        return $this->wallet_balance;
    }

    public function deductFromWallet(float $amount, ?string $description = null): float
    {
        if ($this->wallet_balance < $amount) {
            throw new \Exception('Insufficient wallet balance');
        }

        $this->wallet_balance -= $amount;
        $this->save();

        return $this->wallet_balance;
    }
}
