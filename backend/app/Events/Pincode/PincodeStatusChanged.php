<?php
declare(strict_types=1);
namespace App\Events\Pincode;
use App\Models\Master\Pincode;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
class PincodeStatusChanged { use Dispatchable, SerializesModels; public function __construct(public Pincode $pincode, public string $oldStatus, public string $newStatus, public int $changedBy) {} }
