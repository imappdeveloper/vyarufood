<?php
declare(strict_types=1);
namespace App\Events\Customer;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
class CustomerForceDeleted { use Dispatchable, SerializesModels; public function __construct(public int $customerId) {} }
