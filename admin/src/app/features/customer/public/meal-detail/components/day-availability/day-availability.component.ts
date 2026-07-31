import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_ABBREVIATIONS: Record<string, string> = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
  Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday',
  friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
};

@Component({
  selector: 'app-day-availability',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (hasAvailability()) {
      <div class="bg-white rounded-xl border border-gray-100 p-5">
        <div class="flex items-center gap-2 mb-4">
          <span class="material-icons text-blue-500">event</span>
          <h3 class="text-lg font-semibold text-gray-900">Available Days</h3>
        </div>
        <div class="grid grid-cols-7 gap-2">
          @for (day of allDays; track day) {
            <div class="text-center">
              <div
                [class]="isDayAvailable(day)
                  ? 'w-10 h-10 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-1'
                  : 'w-10 h-10 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-1'"
              >
                <span
                  [class]="isDayAvailable(day)
                    ? 'material-icons text-green-600 text-lg'
                    : 'material-icons text-gray-300 text-lg'"
                >
                  {{ isDayAvailable(day) ? 'check' : 'close' }}
                </span>
              </div>
              <span
                [class]="isDayAvailable(day) ? 'text-xs font-medium text-gray-700' : 'text-xs text-gray-400'"
              >
                {{ getShortDay(day) }}
              </span>
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class DayAvailabilityComponent {
  @Input() availabilitySlots: string[] | null = null;

  allDays = ALL_DAYS;

  hasAvailability = computed(() => this.availabilitySlots && this.availabilitySlots.length > 0);

  normalizedDays = computed(() => {
    if (!this.availabilitySlots) return new Set<string>();
    return new Set(
      this.availabilitySlots.map(d => DAY_ABBREVIATIONS[d] || d).filter(d => ALL_DAYS.includes(d))
    );
  });

  isDayAvailable(day: string): boolean {
    return this.normalizedDays().has(day);
  }

  getShortDay(day: string): string {
    return day.substring(0, 3);
  }
}
