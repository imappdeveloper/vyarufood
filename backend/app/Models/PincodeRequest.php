<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PincodeRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'pincode',
        'name',
        'email',
        'phone',
        'message',
        'status',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
