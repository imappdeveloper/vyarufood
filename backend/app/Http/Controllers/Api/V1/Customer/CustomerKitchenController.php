<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Customer;

use App\Models\KitchenHoliday;
use App\Models\KitchenWorkingDay;
use App\Support\BaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class CustomerKitchenController extends BaseController
{
    public function holidayStatus(Request $request): JsonResponse
    {
        try {
            $kitchenId = (int) $request->input('kitchen_id', 1);
            $today = Carbon::today();
            $dayOfWeek = strtolower($today->format('l'));

            // Query DB directly — no cache for customer-facing endpoint
            $allDays = KitchenWorkingDay::where('kitchen_id', $kitchenId)
                ->orderByRaw("FIELD(day_of_week, 'monday','tuesday','wednesday','thursday','friday','saturday','sunday')")
                ->get();

            $todayWorkingDay = $allDays->firstWhere('day_of_week', $dayOfWeek);
            $isWorkingDay = $todayWorkingDay ? (bool) $todayWorkingDay->is_working : true;

            $activeHolidays = KitchenHoliday::active()
                ->where('kitchen_id', $kitchenId)
                ->where('start_date', '<=', $today->format('Y-m-d'))
                ->where('end_date', '>=', $today->format('Y-m-d'))
                ->get();
            $isOnHoliday = $activeHolidays->isNotEmpty();

            $isOffToday = !$isWorkingDay || $isOnHoliday;
            $status = 'open';
            $message = 'Kitchen is open today';
            $offDayType = null;
            $todayHoliday = null;

            if ($isOnHoliday) {
                $holiday = $activeHolidays->first();
                $status = 'holiday';
                $message = 'Today is ' . $holiday->holiday_name . ' - ' . $holiday->holiday_type_label;
                $offDayType = $holiday->holiday_type;
                $todayHoliday = [
                    'holiday_name' => $holiday->holiday_name,
                    'holiday_type' => $holiday->holiday_type,
                    'holiday_type_label' => $holiday->holiday_type_label,
                    'start_date' => $holiday->start_date->format('Y-m-d'),
                    'end_date' => $holiday->end_date->format('Y-m-d'),
                    'reason' => $holiday->reason,
                ];
            } elseif (!$isWorkingDay) {
                $status = 'weekly_off';
                $message = 'Today is ' . ucfirst($dayOfWeek) . ' - Weekly Off';
                $offDayType = 'weekly_off';
            }

            $dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            $weeklySchedule = [];
            foreach ($dayOrder as $day) {
                $wd = $allDays->firstWhere('day_of_week', $day);
                if ($wd) {
                    $weeklySchedule[] = [
                        'day_of_week' => $wd->day_of_week,
                        'day_of_week_label' => $wd->day_of_week_label,
                        'is_working' => (bool) $wd->is_working,
                        'opening_time' => $wd->opening_time,
                        'closing_time' => $wd->closing_time,
                    ];
                } else {
                    $weeklySchedule[] = [
                        'day_of_week' => $day,
                        'day_of_week_label' => ucfirst($day),
                        'is_working' => $day !== 'sunday',
                        'opening_time' => null,
                        'closing_time' => null,
                    ];
                }
            }

            $upcomingFrom = $isOnHoliday ? $today->copy()->addDay()->format('Y-m-d') : $today->format('Y-m-d');
            $upcomingTo = $today->copy()->addDays(30)->format('Y-m-d');
            $upcomingHolidays = KitchenHoliday::active()
                ->where('kitchen_id', $kitchenId)
                ->where('end_date', '>=', $upcomingFrom)
                ->where('start_date', '<=', $upcomingTo)
                ->orderBy('start_date')
                ->get()
                ->map(fn ($h) => [
                    'holiday_name' => $h->holiday_name,
                    'holiday_type' => $h->holiday_type,
                    'holiday_type_label' => $h->holiday_type_label,
                    'start_date' => $h->start_date->format('Y-m-d'),
                    'end_date' => $h->end_date->format('Y-m-d'),
                    'duration' => $h->duration,
                    'reason' => $h->reason,
                ]);

            return $this->successResponse([
                'is_off_today' => $isOffToday,
                'status' => $status,
                'message' => $message,
                'off_day_type' => $offDayType,
                'day_of_week' => $dayOfWeek,
                'today_holiday' => $todayHoliday,
                'working_hours' => $todayWorkingDay && $isWorkingDay ? [
                    'opening_time' => $todayWorkingDay->opening_time,
                    'closing_time' => $todayWorkingDay->closing_time,
                ] : null,
                'weekly_schedule' => $weeklySchedule,
                'upcoming_holidays' => $upcomingHolidays,
            ], 'Kitchen holiday status retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}
