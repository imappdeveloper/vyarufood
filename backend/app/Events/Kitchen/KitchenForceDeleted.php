<?php
declare(strict_types=1);
namespace App\Events\Kitchen;
use App\Models\Kitchen;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
class KitchenForceDeleted { use Dispatchable, SerializesModels; public function __construct(public Kitchen $kitchen) {} }
