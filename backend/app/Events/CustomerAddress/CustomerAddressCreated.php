<?php
declare(strict_types=1);
namespace App\Events\CustomerAddress;
use App\Models\CustomerAddress;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
class CustomerAddressCreated { use Dispatchable, SerializesModels; public function __construct(public CustomerAddress $address, public int $createdBy) {} }
