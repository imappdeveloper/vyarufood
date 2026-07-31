<?php
declare(strict_types=1);
namespace App\Events\WeeklyMenu;
use App\Models\WeeklyMenuItem;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
final class WeeklyMenuItemUpdated
{
    use Dispatchable, SerializesModels;
    public function __construct(public readonly WeeklyMenuItem $item) {}
}
