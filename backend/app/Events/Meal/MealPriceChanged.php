<?php
declare(strict_types=1);
namespace App\Events\Meal;
use App\Models\Meal;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
class MealPriceChanged { use Dispatchable, SerializesModels; public function __construct(public Meal $meal, public float $oldPrice, public float $newPrice) {} }
