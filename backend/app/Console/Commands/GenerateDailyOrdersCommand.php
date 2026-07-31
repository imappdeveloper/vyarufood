<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\Order\OrderServiceInterface;
use Illuminate\Console\Command;

class GenerateDailyOrdersCommand extends Command
{
    protected $signature = 'orders:generate-daily {--date= : The date to generate orders for (Y-m-d)}';
    protected $description = 'Generate daily subscription orders for active subscriptions';

    public function __construct(
        private OrderServiceInterface $orderService,
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $date = $this->option('date') ?? now()->toDateString();

        $this->info("Generating orders for {$date}...");

        try {
            $result = $this->orderService->generateDailySubscriptionOrders($date);

            $this->info("Order generation complete:");
            $this->info("  Total subscriptions: {$result['total_subscriptions']}");
            $this->info("  Orders created: {$result['orders_created']}");
            $this->info("  Orders skipped: {$result['orders_skipped']}");
            $this->info("  Errors: {$result['errors_count']}");

            if (! empty($result['errors'])) {
                foreach ($result['errors'] as $error) {
                    $this->error("  - {$error}");
                }
            }

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error("Order generation failed: {$e->getMessage()}");
            return Command::FAILURE;
        }
    }
}
