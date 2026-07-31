<?php
declare(strict_types=1);
namespace App\Events\MonthlyMenu;
use App\Models\MenuTemplate;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
final class MenuTemplateCreated
{
    use Dispatchable, SerializesModels;
    public function __construct(public readonly MenuTemplate $menu) {}
}
