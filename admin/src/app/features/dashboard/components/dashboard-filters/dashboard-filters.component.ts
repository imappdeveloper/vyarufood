import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DashboardPeriod } from '../../../../core/models/dashboard/dashboard-types.model';

@Component({
  selector: 'app-dashboard-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'10px'" [style.flexWrap]="'wrap'">
      <div [style.display]="'flex'" [style.alignItems]="'center'" [style.background]="'rgba(255,255,255,0.15)'"
           [style.borderRadius]="'10px'" [style.padding]="'4px'">
        @for (p of periods; track p.value) {
          <button (click)="selectPeriod(p.value)"
            [style.padding]="'7px 14px'"
            [style.fontSize]="'12px'" [style.fontWeight]="'600'"
            [style.border]="'none'" [style.borderRadius]="'8px'"
            [style.cursor]="'pointer'" [style.transition]="'all 0.2s ease'"
            [style.background]="selectedPeriod === p.value ? '#fff' : 'transparent'"
            [style.color]="selectedPeriod === p.value ? '#047857' : 'rgba(255,255,255,0.8)'"
            [style.boxShadow]="selectedPeriod === p.value ? '0 2px 8px rgba(0,0,0,0.12)' : 'none'">
            {{ p.label }}
          </button>
        }
      </div>
      @if (selectedPeriod === 'custom') {
        <div [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'8px'">
          <input type="date" [(ngModel)]="startDate" (change)="onCustomDate()"
            [style.padding]="'7px 12px'" [style.fontSize]="'12px'" [style.borderRadius]="'8px'"
            [style.border]="'1px solid rgba(255,255,255,0.3)'" [style.background]="'rgba(255,255,255,0.15)'"
            [style.color]="'#fff'" [style.outline]="'none'"
            [style.colorScheme]="'dark'" />
          <span [style.color]="'rgba(255,255,255,0.6)'" [style.fontSize]="'12px'">to</span>
          <input type="date" [(ngModel)]="endDate" (change)="onCustomDate()"
            [style.padding]="'7px 12px'" [style.fontSize]="'12px'" [style.borderRadius]="'8px'"
            [style.border]="'1px solid rgba(255,255,255,0.3)'" [style.background]="'rgba(255,255,255,0.15)'"
            [style.color]="'#fff'" [style.outline]="'none'"
            [style.colorScheme]="'dark'" />
        </div>
      }
      <button (click)="onExport()"
        [style.padding]="'7px 14px'" [style.fontSize]="'12px'" [style.fontWeight]="'600'"
        [style.border]="'1px solid rgba(255,255,255,0.3)'" [style.borderRadius]="'8px'"
        [style.background]="'rgba(255,255,255,0.1)'" [style.color]="'#fff'"
        [style.cursor]="'pointer'" [style.transition]="'all 0.2s ease'"
        [style.display]="'flex'" [style.alignItems]="'center'" [style.gap]="'6px'"
        (mouseenter)="exportHovered = true" (mouseleave)="exportHovered = false"
        [style.background]="exportHovered ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Export
      </button>
    </div>
  `,
})
export class DashboardFiltersComponent {
  @Output() periodChange = new EventEmitter<{ period: DashboardPeriod; start_date?: string; end_date?: string }>();
  @Output() exportData = new EventEmitter<void>();

  selectedPeriod: DashboardPeriod = 'last_7_days';
  startDate = '';
  endDate = '';
  exportHovered = false;

  periods = [
    { label: 'Today', value: 'today' as DashboardPeriod },
    { label: 'Yesterday', value: 'yesterday' as DashboardPeriod },
    { label: '7D', value: 'last_7_days' as DashboardPeriod },
    { label: '30D', value: 'last_30_days' as DashboardPeriod },
    { label: 'This Month', value: 'this_month' as DashboardPeriod },
    { label: 'Last Month', value: 'last_month' as DashboardPeriod },
    { label: 'Custom', value: 'custom' as DashboardPeriod },
  ];

  selectPeriod(period: DashboardPeriod): void {
    this.selectedPeriod = period;
    this.periodChange.emit({ period });
  }

  onCustomDate(): void {
    if (this.startDate && this.endDate) {
      this.periodChange.emit({ period: 'custom', start_date: this.startDate, end_date: this.endDate });
    }
  }

  onExport(): void {
    this.exportData.emit();
  }
}
