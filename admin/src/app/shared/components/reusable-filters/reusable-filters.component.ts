import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FilterConfig } from '../../../core/interfaces/filter.interface';

@Component({
  selector: 'app-reusable-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-lg border p-4 mb-4">
      <div class="flex flex-wrap items-end gap-4">
        @for (filter of filters; track filter.key) {
          <mat-form-field appearance="outline" class="flex-1 min-w-[200px]">
            <mat-label>{{ filter.label }}</mat-label>
            @if (filter.type === 'text') {
              <input matInput [(ngModel)]="filterValues[filter.key]" [placeholder]="filter.placeholder || ''" />
            } @else if (filter.type === 'select') {
              <mat-select [(ngModel)]="filterValues[filter.key]">
                <mat-option [value]="null">All</mat-option>
                @for (option of filter.options; track option.value) {
                  <mat-option [value]="option.value">{{ option.label }}</mat-option>
                }
              </mat-select>
            } @else if (filter.type === 'date') {
              <input matInput type="date" [(ngModel)]="filterValues[filter.key]" />
            } @else if (filter.type === 'number') {
              <input matInput type="number" [(ngModel)]="filterValues[filter.key]" />
            }
          </mat-form-field>
        }
        <div class="flex gap-2">
          <button mat-flat-button color="primary" (click)="onApply()"><mat-icon class="mr-1">search</mat-icon>Apply</button>
          <button mat-stroked-button (click)="onReset()"><mat-icon class="mr-1">refresh</mat-icon>Reset</button>
        </div>
      </div>
    </div>
  `,
})
export class ReusableFiltersComponent {
  @Input() filters: FilterConfig[] = [];
  @Output() filterApply = new EventEmitter<Record<string, any>>();
  @Output() filterReset = new EventEmitter<void>();
  filterValues: Record<string, any> = {};

  ngOnInit(): void {
    this.filters.forEach((filter) => { this.filterValues[filter.key] = filter.defaultValue ?? null; });
  }

  onApply(): void { this.filterApply.emit(this.filterValues); }
  onReset(): void {
    this.filters.forEach((filter) => { this.filterValues[filter.key] = filter.defaultValue ?? null; });
    this.filterReset.emit();
  }
}
