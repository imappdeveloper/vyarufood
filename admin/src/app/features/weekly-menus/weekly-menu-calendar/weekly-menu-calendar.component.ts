import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeeklyMenu, WeeklyMenuItem } from '../../../core/models/weekly-menu/weekly-menu.model';
import { MealCategoryApiService } from '../../../core/services/meal-category-api.service';
import { MealCategory } from '../../../core/models/meal/meal-category.model';

@Component({
  selector: 'app-weekly-menu-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [style.opacity]="readonly ? '0.85' : '1'">
      <div style="display: grid; gap: 2px; overflow-x: auto;">
        <div style="min-width: 900px;">
          <div style="display: grid; grid-template-columns: 100px repeat(7, 1fr); gap: 8px; margin-bottom: 8px;">
            <div style="font-size: 11px; color: #9ca3af; font-weight: 600; display: flex; align-items: flex-end; padding-bottom: 4px;">Category</div>
            <div *ngFor="let day of weekDays" style="text-align: center;"
              [style.color]="isToday(day.date) ? '#059669' : '#9ca3af'">
              <p style="font-size: 11px; font-weight: 600; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">{{ day.date | date:'EEE' }}</p>
              <p style="font-size: 14px; font-weight: 800; margin: 0;"
                [style.color]="isToday(day.date) ? '#059669' : '#1f2937'">{{ day.date | date:'d' }}</p>
            </div>
          </div>

          <div *ngFor="let category of categories">
            <div style="display: grid; grid-template-columns: 100px repeat(7, 1fr); gap: 8px; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; padding-right: 8px;">
                <span style="font-size: 11px; font-weight: 700; color: #059669; background: #d1fae5; padding: 2px 8px; border-radius: 4px; display: inline-block;">{{ category.name }}</span>
              </div>
              <div *ngFor="let day of weekDays"
                style="min-height: 120px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 6px; transition: all 0.15s ease; background: #fafafa;"
                [style.background]="getItemsForCell(day.date, category.id).length > 0 ? 'white' : '#fafafa'"
                onmouseover="this.style.borderColor='#059669';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background=this.getAttribute('data-hasitems')==='true'?'white':'#fafafa'">
                <div *ngFor="let item of getItemsForCell(day.date, category.id)" style="margin-bottom: 4px;">
                  <div (click)="!readonly && editItem.emit(item)" [title]="getMealTooltip(item)"
                    style="font-size: 12px; padding: 4px 8px; border-radius: 6px; display: flex; align-items: center; gap: 4px; cursor: pointer; transition: all 0.15s ease;"
                    [style.background]="item.is_default ? '#eff6ff' : item.is_recommended ? '#ecfdf5' : item.is_optional ? '#fffbeb' : '#f9fafb'"
                    [style.border]="item.is_default ? '1px solid #bfdbfe' : item.is_recommended ? '1px solid #a7f3d0' : item.is_optional ? '1px solid #fde68a' : '1px solid #e5e7eb'"
                    [style.color]="item.is_default ? '#1e40af' : item.is_recommended ? '#065f46' : item.is_optional ? '#92400e' : '#374151'"
                    onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform=''">
                    <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; font-size: 11px; font-weight: 600;">{{ item.meal_name || 'Meal' }}</span>
                    <button *ngIf="!readonly" (click)="deleteItem.emit(item); $event.stopPropagation()"
                      style="width: 16px; height: 16px; border: none; background: none; cursor: pointer; padding: 0; display: inline-flex; align-items: center; justify-content: center; opacity: 0.5; flex-shrink: 0; line-height: 0;"
                      onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.5'">
                      <span class="material-icons" style="font-size: 12px;">close</span>
                    </button>
                  </div>
                </div>
                <button *ngIf="!readonly" (click)="addItem.emit({ date: day.date, categoryId: category.id })"
                  style="width: 100%; border: 1px dashed #d1d5db; border-radius: 6px; padding: 6px; text-align: center; cursor: pointer; transition: all 0.15s ease; color: #9ca3af; font-size: 12px; background: none; display: inline-flex; align-items: center; justify-content: center; gap: 2px;"
                  onmouseover="this.style.borderColor='#059669';this.style.color='#059669';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#d1d5db';this.style.color='#9ca3af';this.style.background=''">
                  <span class="material-icons" style="font-size: 14px;">add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class WeeklyMenuCalendarComponent implements OnInit {
  @Input() menu!: WeeklyMenu;
  @Input() items: WeeklyMenuItem[] = [];
  @Input() readonly = false;
  @Output() addItem = new EventEmitter<{ date: string; categoryId: number }>();
  @Output() editItem = new EventEmitter<WeeklyMenuItem>();
  @Output() deleteItem = new EventEmitter<WeeklyMenuItem>();

  private mealCategoryApi = inject(MealCategoryApiService);

  categories: MealCategory[] = [];
  weekDays: { date: string; dayName: string }[] = [];

  ngOnInit(): void {
    this.loadCategories();
    this.generateWeekDays();
  }

  loadCategories(): void {
    this.mealCategoryApi.getAll().subscribe({
      next: (res) => { this.categories = res.data || []; },
      error: () => {},
    });
  }

  generateWeekDays(): void {
    if (!this.menu) return;
    const [sy, sm, sd] = this.menu.week_start_date.split('-').map(Number);
    const [ey, em, ed] = this.menu.week_end_date.split('-').map(Number);
    const start = new Date(sy, sm - 1, sd);
    const end = new Date(ey, em - 1, ed);
    const days: { date: string; dayName: string }[] = [];
    const current = new Date(start);

    while (current <= end) {
      const y = current.getFullYear();
      const m = String(current.getMonth() + 1).padStart(2, '0');
      const d = String(current.getDate()).padStart(2, '0');
      days.push({
        date: `${y}-${m}-${d}`,
        dayName: current.toLocaleDateString('en-US', { weekday: 'short' }),
      });
      current.setDate(current.getDate() + 1);
    }
    this.weekDays = days;
  }

  getItemsForCell(date: string, categoryId: number): WeeklyMenuItem[] {
    return this.items.filter(
      (item) => item.menu_date === date && item.meal_category_id === categoryId && item.is_active
    ).sort((a, b) => a.display_order - b.display_order);
  }

  isToday(dateStr: string): boolean {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return dateStr === `${y}-${m}-${d}`;
  }

  getMealChipClass(item: WeeklyMenuItem): string {
    if (item.is_default) return 'meal-chip default';
    if (item.is_recommended) return 'meal-chip recommended';
    if (item.is_optional) return 'meal-chip optional';
    return 'meal-chip regular';
  }

  getMealTooltip(item: WeeklyMenuItem): string {
    const parts = [item.meal_name || 'Meal'];
    if (item.meal_type_name) parts.push(`Type: ${item.meal_type_name}`);
    parts.push(`Limit: ${item.meal_limit}`);
    if (item.is_default) parts.push('Default');
    if (item.is_optional) parts.push('Optional');
    if (item.is_recommended) parts.push('Recommended');
    if (item.calories) parts.push(`${item.calories} kcal`);
    return parts.join('\n');
  }
}
