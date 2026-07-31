<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kitchen;
use App\Models\KitchenWorkingDay;

class KitchenWorkingDaySeeder extends Seeder
{
    public function run(): void
    {
        $defaultSchedule = [
            'monday'    => ['is_working' => true,  'opening_time' => '06:00', 'closing_time' => '22:00', 'preparation_start_time' => '04:00', 'accept_order_start' => '06:00', 'accept_order_end' => '21:30'],
            'tuesday'   => ['is_working' => true,  'opening_time' => '06:00', 'closing_time' => '22:00', 'preparation_start_time' => '04:00', 'accept_order_start' => '06:00', 'accept_order_end' => '21:30'],
            'wednesday' => ['is_working' => true,  'opening_time' => '06:00', 'closing_time' => '22:00', 'preparation_start_time' => '04:00', 'accept_order_start' => '06:00', 'accept_order_end' => '21:30'],
            'thursday'  => ['is_working' => true,  'opening_time' => '06:00', 'closing_time' => '22:00', 'preparation_start_time' => '04:00', 'accept_order_start' => '06:00', 'accept_order_end' => '21:30'],
            'friday'    => ['is_working' => true,  'opening_time' => '06:00', 'closing_time' => '22:00', 'preparation_start_time' => '04:00', 'accept_order_start' => '06:00', 'accept_order_end' => '21:30'],
            'saturday'  => ['is_working' => true,  'opening_time' => '06:00', 'closing_time' => '22:00', 'preparation_start_time' => '04:00', 'accept_order_start' => '06:00', 'accept_order_end' => '21:30'],
            'sunday'    => ['is_working' => true,  'opening_time' => '07:00', 'closing_time' => '21:00', 'preparation_start_time' => '05:00', 'accept_order_start' => '07:00', 'accept_order_end' => '20:30'],
        ];

        $kitchens = Kitchen::query()->get();

        foreach ($kitchens as $kitchen) {
            foreach ($defaultSchedule as $dayOfWeek => $schedule) {
                KitchenWorkingDay::updateOrCreate(
                    ['kitchen_id' => $kitchen->id, 'day_of_week' => $dayOfWeek],
                    $schedule + ['is_working' => $schedule['is_working'] ? 1 : 0],
                );
            }
        }
    }
}
