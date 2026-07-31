<?php
declare(strict_types=1);
namespace App\Listeners\WeeklyMenu;
use App\Support\CacheManager;
final class ClearWeeklyMenuCache
{
    public function handle(object $event): void
    {
        CacheManager::flush('weekly_menus');
        CacheManager::flush('weekly_menu_items');
        CacheManager::flush('customer_meal_selections');
    }
}
