<?php

declare(strict_types=1);

namespace App\DTOs\Dashboard;

final class DashboardFilterDTO
{
    public function __construct(
        public readonly string $period = 'today',
        public readonly ?string $startDate = null,
        public readonly ?string $endDate = null,
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            period: $data['period'] ?? 'today',
            startDate: $data['start_date'] ?? null,
            endDate: $data['end_date'] ?? null,
        );
    }

    public function getDateRange(): array
    {
        $now = now();

        return match ($this->period) {
            'today' => [
                'start' => $now->copy()->startOfDay()->toDateTimeString(),
                'end' => $now->copy()->endOfDay()->toDateTimeString(),
            ],
            'yesterday' => [
                'start' => $now->copy()->subDay()->startOfDay()->toDateTimeString(),
                'end' => $now->copy()->subDay()->endOfDay()->toDateTimeString(),
            ],
            'last_7_days' => [
                'start' => $now->copy()->subDays(7)->startOfDay()->toDateTimeString(),
                'end' => $now->copy()->endOfDay()->toDateTimeString(),
            ],
            'last_30_days' => [
                'start' => $now->copy()->subDays(30)->startOfDay()->toDateTimeString(),
                'end' => $now->copy()->endOfDay()->toDateTimeString(),
            ],
            'this_month' => [
                'start' => $now->copy()->startOfMonth()->toDateTimeString(),
                'end' => $now->copy()->endOfDay()->toDateTimeString(),
            ],
            'last_month' => [
                'start' => $now->copy()->subMonth()->startOfMonth()->toDateTimeString(),
                'end' => $now->copy()->subMonth()->endOfMonth()->toDateTimeString(),
            ],
            'this_year' => [
                'start' => $now->copy()->startOfYear()->toDateTimeString(),
                'end' => $now->copy()->endOfDay()->toDateTimeString(),
            ],
            'custom' => [
                'start' => $this->startDate ? $this->startDate . ' 00:00:00' : $now->copy()->startOfDay()->toDateTimeString(),
                'end' => $this->endDate ? $this->endDate . ' 23:59:59' : $now->copy()->endOfDay()->toDateTimeString(),
            ],
            default => [
                'start' => $now->copy()->startOfDay()->toDateTimeString(),
                'end' => $now->copy()->endOfDay()->toDateTimeString(),
            ],
        };
    }

    public function getComparisonDateRange(): array
    {
        $range = $this->getDateRange();
        $start = Carbon::parse($range['start']);
        $end = Carbon::parse($range['end']);
        $diff = $start->diffInDays($end);

        return [
            'start' => $start->copy()->subDays($diff + 1)->startOfDay()->toDateTimeString(),
            'end' => $start->copy()->subDay()->endOfDay()->toDateTimeString(),
        ];
    }

    public function getCacheKey(string $prefix): string
    {
        $hash = md5(serialize([$this->period, $this->startDate, $this->endDate]));
        return "{$prefix}:{$hash}";
    }
}
