<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Services\Order\OrderServiceInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateDailyOrdersJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 300;

    public function __construct(
        public string $date,
    ) {}

    public function handle(OrderServiceInterface $orderService): void
    {
        Log::info("Starting daily order generation for {$this->date}");

        try {
            $result = $orderService->generateDailySubscriptionOrders($this->date);

            Log::info("Daily order generation completed", $result);
        } catch (\Exception $e) {
            Log::error("Daily order generation failed", [
                'date' => $this->date,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}
