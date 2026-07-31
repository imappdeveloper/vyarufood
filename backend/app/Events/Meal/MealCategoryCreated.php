<?php
declare(strict_types=1);
namespace App\Events\Meal;
use App\Models\MealCategory;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
class MealCategoryCreated { use Dispatchable, SerializesModels; public function __construct(public MealCategory $mealCategory) {} }
