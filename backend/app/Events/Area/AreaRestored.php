<?php
declare(strict_types=1);
namespace App\Events\Area;
use App\Models\Master\Area;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
class AreaRestored { use Dispatchable, SerializesModels; public function __construct(public Area $area) {} }
