<?php
declare(strict_types=1);
namespace App\Events\Meal;
use App\Models\Meal;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
class MealStatusChanged { use Dispatchable, SerializesModels; public function __construct(public Meal $meal, public string $oldStatus, public string $newStatus) {} }
