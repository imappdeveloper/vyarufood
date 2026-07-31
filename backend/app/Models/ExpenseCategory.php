<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use App\Models\Auth\Admin;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExpenseCategory extends Model
{
    use HasUuid, SoftDeletes;

    protected $table = 'expense_categories';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'category_code', 'category_name', 'parent_category_id', 'icon', 'color',
        'is_recurring', 'is_taxable', 'status', 'display_order', 'remarks',
        'created_by', 'updated_by', 'deleted_by',
    ];

    protected $casts = [
        'is_recurring' => 'boolean',
        'is_taxable' => 'boolean',
        'display_order' => 'integer',
    ];

    public function parentCategory(): BelongsTo
    {
        return $this->belongsTo(ExpenseCategory::class, 'parent_category_id');
    }

    public function childCategories(): HasMany
    {
        return $this->hasMany(ExpenseCategory::class, 'parent_category_id');
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class, 'expense_category_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }
}
