<?php
declare(strict_types=1);
namespace App\Listeners\MonthlyMenu;
use App\Support\CacheManager;
final class ClearMonthlyMenuCache
{
    public function handle(object $event): void
    {
        CacheManager::flush('monthly_menus');
        CacheManager::flush('monthly_menu_items');
        CacheManager::flush('menu_templates');
    }
}
