<?php
declare(strict_types=1);
namespace App\Events\WeeklyMenu;
use App\Models\WeeklyMenu;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
final class WeeklyMenuUnpublished
{
    use Dispatchable, SerializesModels;
    public function __construct(public readonly WeeklyMenu $menu) {}
}
