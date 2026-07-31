<?php

declare(strict_types=1);

namespace App\Models\Auth;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoginHistory extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'admin_id',
        'ip_address',
        'user_agent',
        'device',
        'browser',
        'os',
        'location',
        'is_successful',
        'failure_reason',
        'login_at',
        'logout_at',
    ];

    protected function casts(): array
    {
        return [
            'is_successful' => 'boolean',
            'login_at' => 'datetime',
            'logout_at' => 'datetime',
        ];
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
