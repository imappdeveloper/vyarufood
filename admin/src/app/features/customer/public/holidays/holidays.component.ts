import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HolidayStatusService } from '../../../../core/services/holiday-status.service';
import { KitchenHolidayStatus, WeeklyScheduleDay, UpcomingHoliday } from '../../../../core/services/customer-browse-api.service';

@Component({
  selector: 'app-customer-holidays',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="max-width: 56rem; margin: 0 auto; padding: 2rem 1rem 4rem;">
      <!-- Breadcrumb -->
      <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #6b7280; margin-bottom: 1.5rem;">
        <a routerLink="/" style="color: #059669; text-decoration: none; cursor: pointer;">Home</a>
        <span class="material-icons" style="font-size: 0.85rem;">chevron_right</span>
        <span style="color: #374151; font-weight: 500;">Service Schedule</span>
      </div>

      @if (holidayStatus.loading()) {
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 1rem; gap: 1rem;">
          <span class="material-icons" style="font-size: 2rem; color: #059669; animation: spin 1s linear infinite;">refresh</span>
          <span style="color: #6b7280; font-size: 0.9rem;">Loading schedule...</span>
        </div>
      } @else if (holidayStatus.status(); as status) {
        <!-- Today's Status Card -->
        <div style="border-radius: 1rem; overflow: hidden; margin-bottom: 2rem;"
          [style.background]="status.is_off_today ? 'linear-gradient(135deg, #fef2f2, #fee2e2)' : 'linear-gradient(135deg, #f0fdf4, #dcfce7)'"
          [style.border]="status.is_off_today ? '1.5px solid #fecaca' : '1.5px solid #bbf7d0'">
          <div style="padding: 1.5rem 2rem; display: flex; align-items: center; gap: 1rem;">
            <span class="material-icons" style="font-size: 2rem;"
              [style.color]="status.is_off_today ? '#dc2626' : '#059669'">
              {{ status.is_off_today ? 'block' : 'check_circle' }}
            </span>
            <div style="flex: 1;">
              <div style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;"
                [style.color]="status.is_off_today ? '#991b1b' : '#065f46'">
                Today's Status
              </div>
              <div style="font-size: 1.1rem; font-weight: 700;"
                [style.color]="status.is_off_today ? '#7f1d1d' : '#064e3b'">
                {{ status.message }}
              </div>
              @if (status.today_holiday; as h) {
                <div style="margin-top: 0.5rem; padding: 0.5rem 0.75rem; background: rgba(255,255,255,0.6); border-radius: 0.5rem;"
                  [style.border]="'1px solid ' + (status.is_off_today ? '#fecaca' : '#bbf7d0')">
                  <div style="font-size: 0.78rem; color: #374151;">
                    <span style="font-weight: 600;">{{ h.start_date }}</span>
                    @if (h.end_date !== h.start_date) {
                      <span> – {{ h.end_date }}</span>
                    }
                  </div>
                  @if (h.reason) {
                    <div style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">{{ h.reason }}</div>
                  }
                </div>
              }
              @if (!status.is_off_today && status.working_hours; as wh) {
                <div style="margin-top: 0.35rem; font-size: 0.82rem; color: #047857;">
                  <span style="font-weight: 600;">Hours:</span> {{ wh.opening_time }} – {{ wh.closing_time }}
                </div>
              }
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <!-- Weekly Schedule -->
          <div style="background: white; border: 1.5px solid #e5e7eb; border-radius: 1rem; overflow: hidden;">
            <div style="padding: 1rem 1.25rem; border-bottom: 1px solid #e5e7eb; background: #f9fafb;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="material-icons" style="font-size: 1.1rem; color: #059669;">date_range</span>
                <span style="font-size: 0.85rem; font-weight: 700; color: #1e293b;">Weekly Schedule</span>
              </div>
            </div>
            <div style="padding: 0.5rem;">
              @for (day of status.weekly_schedule; track day.day_of_week) {
                <div style="display: flex; align-items: center; padding: 0.6rem 0.75rem; border-bottom: 1px solid #f3f4f6; gap: 0.75rem;">
                  <div style="flex: 1; display: flex; align-items: center; gap: 0.5rem;">
                    @if (day.is_working) {
                      <span class="material-icons" style="font-size: 1rem; color: #059669;">check_circle</span>
                    } @else {
                      <span class="material-icons" style="font-size: 1rem; color: #dc2626;">cancel</span>
                    }
                    <span style="font-size: 0.85rem; font-weight: 500; color: #374151;">{{ day.day_of_week_label }}</span>
                  </div>
                  @if (day.is_working && day.opening_time && day.closing_time) {
                    <span style="font-size: 0.75rem; color: #059669; font-weight: 500;">{{ day.opening_time }} – {{ day.closing_time }}</span>
                  } @else if (!day.is_working) {
                    <span style="font-size: 0.72rem; color: #dc2626; font-weight: 600; background: #fef2f2; padding: 0.15rem 0.5rem; border-radius: 0.25rem;">Off</span>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Upcoming Holidays -->
          <div style="background: white; border: 1.5px solid #e5e7eb; border-radius: 1rem; overflow: hidden;">
            <div style="padding: 1rem 1.25rem; border-bottom: 1px solid #e5e7eb; background: #f9fafb;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="material-icons" style="font-size: 1.1rem; color: #059669;">event_busy</span>
                <span style="font-size: 0.85rem; font-weight: 700; color: #1e293b;">Upcoming Holidays (30 days)</span>
              </div>
            </div>
            @if (status.upcoming_holidays.length === 0) {
              <div style="padding: 2rem 1.25rem; text-align: center; color: #9ca3af;">
                <span class="material-icons" style="font-size: 1.5rem; display: block; margin-bottom: 0.5rem;">event_available</span>
                <span style="font-size: 0.82rem;">No upcoming holidays scheduled</span>
              </div>
            } @else {
              <div style="padding: 0.5rem;">
                @for (h of status.upcoming_holidays; track h.holiday_name + h.start_date) {
                  <div style="padding: 0.6rem 0.75rem; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 2rem; height: 2rem; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"
                      [style.background]="getHolidayColor(h.holiday_type) + '15'">
                      <span class="material-icons" style="font-size: 1rem;" [style.color]="getHolidayColor(h.holiday_type)">event</span>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                      <div style="font-size: 0.82rem; font-weight: 600; color: #1e293b;">{{ h.holiday_name }}</div>
                      <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.15rem;">
                        <span style="font-size: 0.7rem; color: #6b7280;">{{ h.start_date }}</span>
                        @if (h.duration > 1) {
                          <span style="font-size: 0.7rem; color: #6b7280;">– {{ h.end_date }} ({{ h.duration }} days)</span>
                        }
                        <span style="font-size: 0.65rem; padding: 0.1rem 0.4rem; border-radius: 0.25rem; font-weight: 600;"
                          [style.background]="getHolidayColor(h.holiday_type) + '20'"
                          [style.color]="getHolidayColor(h.holiday_type)">
                          {{ h.holiday_type_label }}
                        </span>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `],
})
export class CustomerHolidaysComponent implements OnInit {
  holidayStatus = inject(HolidayStatusService);

  ngOnInit(): void {
    this.holidayStatus.loadStatus();
  }

  getHolidayColor(type: string): string {
    const colors: Record<string, string> = {
      'public_holiday': '#f59e0b',
      'festival': '#ec4899',
      'weekly_off': '#ef4444',
      'maintenance': '#6366f1',
      'emergency': '#dc2626',
      'custom': '#8b5cf6',
    };
    return colors[type] || '#6b7280';
  }
}
