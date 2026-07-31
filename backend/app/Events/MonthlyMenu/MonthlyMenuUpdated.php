<?php
declare(strict_types=1);
namespace App\Events\MonthlyMenu;
use App\Models\MonthlyMenu;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
final class MonthlyMenuUpdated
{
    use Dispatchable, SerializesModels;
    public function __construct(public readonly MonthlyMenu $menu) {}
}
