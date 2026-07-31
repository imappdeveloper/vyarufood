<?php

declare(strict_types=1);

namespace App\Imports\Customer;

use App\DTOs\Customer\CustomerDTO;
use Illuminate\Support\Facades\Log;

class CustomerImport
{
    public function import(array $rows): array
    {
        $successes = 0;
        $failures = [];
        $createdBy = auth()->guard('admin')->id();

        foreach ($rows as $index => $row) {
            try {
                $dto = CustomerDTO::fromArray($row);
                app(\App\Repositories\Customer\CustomerRepositoryInterface::class)->create($dto, $createdBy);
                $successes++;
            } catch (\Exception $e) {
                $failures[] = [
                    'row' => $index + 1,
                    'error' => $e->getMessage(),
                    'data' => $row,
                ];
                Log::error("Customer import failed at row " . ($index + 1), ['error' => $e->getMessage()]);
            }
        }

        return [
            'successes' => $successes,
            'failures' => $failures,
            'total' => count($rows),
        ];
    }
}
