import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HolidayStatusService } from '../../../../core/services/holiday-status.service';

@Component({
  selector: 'app-closed-for-holiday',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#022c22,#064e3b,#065f46);padding:1rem;">
      @if (holidayStatus.status(); as s) {
        <div style="text-align:center;padding:40px 24px;max-width:560px;width:100%;">
          <div style="width:100px;height:100px;border-radius:24px;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 32px;">
            <span class="material-icons" style="font-size:48px;color:#fbbf24;">{{ s.status === 'holiday' ? 'celebration' : 'free_breakfast' }}</span>
          </div>

          <div style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.3rem 0.8rem;border-radius:999px;font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:1rem;background:rgba(251,191,36,0.2);color:#fbbf24;">
            {{ s.status === 'weekly_off' ? 'Weekly Off Day' : 'Holiday' }}
          </div>

          <h1 style="font-size:2rem;font-weight:800;color:white;margin:0 0 0.75rem;letter-spacing:-0.02em;line-height:1.2;">
            {{ s.message }}
          </h1>

          <p style="font-size:1rem;color:rgba(167,243,208,0.85);margin:0 0 2rem;line-height:1.6;">
            @if (s.status === 'holiday') {
              We are closed today in observance of this occasion. Orders will not be processed. We'll be back on the next working day!
            } @else {
              We are closed today for our weekly off. Orders will not be processed. We'll be back tomorrow!
            }
          </p>

          <div style="font-size:0.85rem;color:rgba(167,243,208,0.6);margin-bottom:2rem;">
            {{ todayDate }}
          </div>

          @if (s.weekly_schedule; as schedule) {
            <div style="background:rgba(255,255,255,0.06);border-radius:1rem;padding:1.25rem;margin-bottom:2rem;text-align:left;">
              <div style="font-size:0.75rem;font-weight:600;color:rgba(167,243,208,0.7);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.75rem;">Weekly Schedule</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.4rem;">
                @for (day of schedule; track day.day_of_week) {
                  <div style="display:flex;align-items:center;gap:0.5rem;padding:0.35rem 0.5rem;border-radius:0.5rem;"
                    [style.background]="day.day_of_week === s.day_of_week ? 'rgba(251,191,36,0.1)' : 'transparent'">
                    <span class="material-icons" style="font-size:0.85rem;" [style.color]="day.is_working ? '#34d399' : '#f87171'">{{ day.is_working ? 'check_circle' : 'cancel' }}</span>
                    <span style="font-size:0.8rem;color:rgba(255,255,255,0.8);font-weight:500;">{{ day.day_of_week_label }}</span>
                    @if (day.day_of_week === s.day_of_week) {
                      <span style="font-size:0.65rem;padding:0.1rem 0.35rem;border-radius:0.25rem;background:rgba(251,191,36,0.2);color:#fbbf24;font-weight:600;margin-left:auto;">Today</span>
                    }
                  </div>
                }
              </div>
            </div>
          }

          @if (s.upcoming_holidays.length > 0) {
            <div style="background:rgba(255,255,255,0.06);border-radius:1rem;padding:1.25rem;margin-bottom:2rem;text-align:left;">
              <div style="font-size:0.75rem;font-weight:600;color:rgba(167,243,208,0.7);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.75rem;">Upcoming Holidays</div>
              @for (h of s.upcoming_holidays; track h.holiday_name + h.start_date) {
                <div style="display:flex;align-items:center;gap:0.5rem;padding:0.35rem 0;">
                  <span class="material-icons" style="font-size:0.9rem;color:#fbbf24;">event</span>
                  <span style="font-size:0.82rem;color:rgba(255,255,255,0.85);">{{ h.holiday_name }}</span>
                  <span style="font-size:0.72rem;color:rgba(167,243,208,0.6);margin-left:auto;">{{ h.start_date }}{{ h.duration > 1 ? ' – ' + h.end_date : '' }}</span>
                </div>
              }
            </div>
          }

          <div style="display:flex;align-items:center;justify-content:center;gap:12px;">
            <div style="width:12px;height:12px;border-radius:50%;background:#34d399;animation:pulse 1.5s ease-in-out infinite;"></div>
            <div style="width:12px;height:12px;border-radius:50%;background:#34d399;animation:pulse 1.5s ease-in-out infinite;animation-delay:0.3s;"></div>
            <div style="width:12px;height:12px;border-radius:50%;background:#34d399;animation:pulse 1.5s ease-in-out infinite;animation-delay:0.6s;"></div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes pulse {
      0%, 100% { opacity: 0.3; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1.2); }
    }
  `],
})
export class ClosedForHolidayComponent {
  holidayStatus = inject(HolidayStatusService);
  todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
