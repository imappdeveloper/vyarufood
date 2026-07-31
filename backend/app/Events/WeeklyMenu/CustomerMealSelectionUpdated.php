<?php
declare(strict_types=1);
namespace App\Events\WeeklyMenu;
use App\Models\CustomerMealSelection;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
final class CustomerMealSelectionUpdated
{
    use Dispatchable, SerializesModels;
    public function __construct(public readonly CustomerMealSelection $selection) {}
}
