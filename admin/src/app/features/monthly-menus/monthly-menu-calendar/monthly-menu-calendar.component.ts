import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthlyMenu, MonthlyMenuItem } from '../../../core/models/monthly-menu/monthly-menu.model';

interface CalendarDay {
  date: Date;
  dayNumber: number;
  dateStr: string;
  isCurrentMonth: boolean;
  items: MonthlyMenuItem[];
}

@Component({
  selector: 'app-monthly-menu-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class.readonly]="readonly" style="width: 100%;">
      <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;">
        <div *ngFor="let d of dayNames"
          style="text-align: center; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; padding: 8px 0; color: #6b7280;">{{ d }}</div>

        <ng-container *ngFor="let week of calendarWeeks; let wi = index">
          <ng-container *ngFor="let day of week; let di = index">
            <div
              style="min-height: 100px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 6px; transition: all 0.15s ease; cursor: default;"
              [style.background]="!day.isCurrentMonth ? '#f9fafb' : isToday(day) ? '#eef2ff' : '#fafafa'"
              [style.opacity]="!day.isCurrentMonth ? '0.4' : '1'"
              [style.borderColor]="isToday(day) ? '#6366f1' : '#e5e7eb'"
              [style.cursor]="!readonly && day.isCurrentMonth ? 'pointer' : 'default'"
              (click)="onDayClick(day)"
              onmouseover="if(this.style.cursor==='pointer'){this.style.borderColor='#818cf8';this.style.background='#f0f1ff'}"
              onmouseout="if(this.style.cursor==='pointer'){this.style.borderColor='#e5e7eb';this.style.background='#fafafa'}">

              <div
                style="font-size: 12px; font-weight: 600; margin-bottom: 4px;"
                [style.color]="isToday(day) ? '#4f46e5' : !day.isCurrentMonth ? '#9ca3af' : '#374151'"
                [style.fontWeight]="isToday(day) ? '700' : '600'">
                {{ day.dayNumber }}
              </div>

              <ng-container *ngFor="let categoryGroup of groupItemsByCategory(day.items); let ci = index">
                <div style="margin-bottom: 4px;">
                  <span
                    style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 2px; padding: 1px 6px; border-radius: 3px; display: inline-block;"
                    [style.background]="getCategoryColor(categoryGroup.categoryName).bg"
                    [style.color]="getCategoryColor(categoryGroup.categoryName).text">
                    {{ categoryGroup.categoryName }}
                  </span>
                  <ng-container *ngFor="let item of categoryGroup.items; let ii = index">
                    <div
                      style="font-size: 11px; padding: 2px 6px; border-radius: 4px; margin-bottom: 2px; display: flex; align-items: center; gap: 4px; font-weight: 500; transition: all 0.15s ease;"
                      [style.background]="getMealColor(item).bg"
                      [style.color]="getMealColor(item).text"
                      [style.cursor]="!readonly ? 'pointer' : 'default'"
                      [title]="getMealTooltip(item)"
                      (click)="onItemClick(item); $event.stopPropagation()"
                      onmouseover="if(!this.readonly){this.style.transform='scale(1.02)';this.style.filter='brightness(0.96)'}"
                      onmouseout="if(!this.readonly){this.style.transform='';this.style.filter=''}">
                      <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ item.meal_name || 'Meal' }}</span>
                      <span *ngIf="!readonly"
                        style="width: 12px; height: 12px; font-size: 10px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(0,0,0,0.1); opacity: 0; transition: opacity 0.15s ease;"
                        (click)="onDeleteClick(item); $event.stopPropagation()"
                        onmouseover="this.style.opacity='1';this.style.background='rgba(0,0,0,0.2)'"
                        onmouseout="this.style.opacity='1'">
                        <span class="material-icons" style="font-size: 10px; width: 10px; height: 10px;">close</span>
                      </span>
                    </div>
                  </ng-container>
                </div>
              </ng-container>

              <div *ngIf="!readonly && day.isCurrentMonth && day.items.length === 0"
                style="font-size: 10px; color: #d1d5db; text-align: center; margin-top: 8px;">+ Add</div>
            </div>
          </ng-container>
        </ng-container>
      </div>
    </div>
  `,
})
export class MonthlyMenuCalendarComponent {
  @Input() monthlyMenu!: MonthlyMenu;
  @Input() items: MonthlyMenuItem[] = [];
  @Input() readonly = false;
  @Output() addItem = new EventEmitter<{ date: string }>();
  @Output() editItem = new EventEmitter<MonthlyMenuItem>();
  @Output() deleteItem = new EventEmitter<MonthlyMenuItem>();

  dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  calendarWeeks: CalendarDay[][] = [];

  ngOnChanges(): void {
    this.buildCalendar();
  }

  buildCalendar(): void {
    if (!this.monthlyMenu) return;

    const year = this.monthlyMenu.year;
    const month = this.monthlyMenu.month;
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const totalDays = lastDay.getDate();

    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
    const totalCells = Math.ceil((totalDays + firstDayOfWeek) / 7) * 7;

    const weeks: CalendarDay[][] = [];
    let currentWeek: CalendarDay[] = [];

    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - firstDayOfWeek + 1;
      const cellDate = new Date(year, month - 1, dayNum);
      const isCurrentMonth = cellDate.getMonth() === month - 1;
      const dateStr = this.formatDateStr(cellDate);

      currentWeek.push({
        date: cellDate,
        dayNumber: cellDate.getDate(),
        dateStr,
        isCurrentMonth,
        items: this.getItemsForDate(dateStr),
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    this.calendarWeeks = weeks;
  }

  getItemsForDate(dateStr: string): MonthlyMenuItem[] {
    return this.items
      .filter((item) => item.menu_date === dateStr)
      .sort((a, b) => a.display_order - b.display_order);
  }

  groupItemsByCategory(items: MonthlyMenuItem[]): { categoryName: string; items: MonthlyMenuItem[] }[] {
    const map = new Map<string, MonthlyMenuItem[]>();
    for (const item of items) {
      const name = item.meal_category_name || item.meal_category?.name || 'Other';
      if (!map.has(name)) {
        map.set(name, []);
      }
      map.get(name)!.push(item);
    }
    return Array.from(map.entries()).map(([categoryName, itemList]) => ({
      categoryName,
      items: itemList,
    }));
  }

  isToday(day: CalendarDay): boolean {
    const now = new Date();
    return (
      day.date.getFullYear() === now.getFullYear() &&
      day.date.getMonth() === now.getMonth() &&
      day.date.getDate() === now.getDate()
    );
  }

  getCategoryColor(categoryName: string): { bg: string; text: string } {
    const lower = categoryName.toLowerCase();
    if (lower.includes('breakfast')) return { bg: '#fef3c7', text: '#92400e' };
    if (lower.includes('lunch')) return { bg: '#d1fae5', text: '#065f46' };
    if (lower.includes('dinner')) return { bg: '#dbeafe', text: '#1e40af' };
    if (lower.includes('snack')) return { bg: '#ede9fe', text: '#5b21b6' };
    return { bg: '#f3f4f6', text: '#374151' };
  }

  getMealColor(item: MonthlyMenuItem): { bg: string; text: string } {
    const name = (item.meal_category_name || item.meal_category?.name || '').toLowerCase();
    if (name.includes('breakfast')) return { bg: '#fef3c7', text: '#92400e' };
    if (name.includes('lunch')) return { bg: '#d1fae5', text: '#065f46' };
    if (name.includes('dinner')) return { bg: '#dbeafe', text: '#1e40af' };
    if (name.includes('snack')) return { bg: '#ede9fe', text: '#5b21b6' };
    return { bg: '#f3f4f6', text: '#374151' };
  }

  getMealTooltip(item: MonthlyMenuItem): string {
    const parts = [item.meal_name || 'Meal'];
    if (item.meal_category_name) parts.push(`Category: ${item.meal_category_name}`);
    if (item.meal_type_name) parts.push(`Type: ${item.meal_type_name}`);
    parts.push(`Limit: ${item.meal_limit}`);
    if (item.is_special) parts.push('Special');
    if (item.is_festival) parts.push('Festival');
    return parts.join(' | ');
  }

  onDayClick(day: CalendarDay): void {
    if (this.readonly || !day.isCurrentMonth) return;
    this.addItem.emit({ date: day.dateStr });
  }

  onItemClick(item: MonthlyMenuItem): void {
    if (this.readonly) return;
    this.editItem.emit(item);
  }

  onDeleteClick(item: MonthlyMenuItem): void {
    if (this.readonly) return;
    this.deleteItem.emit(item);
  }

  private formatDateStr(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
