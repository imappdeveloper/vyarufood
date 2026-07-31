<?php
declare(strict_types=1);
namespace App\Events\Meal;
use App\Models\MealType;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
class MealTypeUpdated { use Dispatchable, SerializesModels; public function __construct(public MealType $mealType) {} }
