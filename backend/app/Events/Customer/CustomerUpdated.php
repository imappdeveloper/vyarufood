<?php
declare(strict_types=1);
namespace App\Events\Customer;
use App\Models\Customer;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
class CustomerUpdated { use Dispatchable, SerializesModels; public function __construct(public Customer $customer, public int $updatedBy) {} }
