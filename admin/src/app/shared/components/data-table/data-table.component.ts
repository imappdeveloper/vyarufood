import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TableColumn, TableAction } from '../../../core/interfaces/table.interface';
import { PaginationMeta } from '../../../core/interfaces/api-response.interface';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatMenuModule, MatCheckboxModule],
  template: `
    <div class="bg-white rounded-lg border overflow-hidden">
      @if (title) {
        <div class="px-6 py-4 border-b flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-800">{{ title }}</h3>
          <ng-content select="[actions]"></ng-content>
        </div>
      }
      <div class="overflow-x-auto">
        <table mat-table [dataSource]="data" class="w-full">
          @if (selectable) {
            <ng-container matColumnDef="select">
              <th mat-header-cell *matHeaderCellDef>
                <mat-checkbox (change)="toggleAll($event)"></mat-checkbox>
              </th>
              <td mat-cell *matCellDef="let row">
                <mat-checkbox (change)="toggleRow(row, $event)" [checked]="selectedRows.has(row.id)"></mat-checkbox>
              </td>
            </ng-container>
          }
          @for (column of columns; track column.key) {
            <ng-container [matColumnDef]="column.key">
              <th mat-header-cell *matHeaderCellDef [class.cursor-pointer]="column.sortable"
                  (click)="column.sortable && onSort(column.key)" [style.width]="column.width">
                <div class="flex items-center gap-1">{{ column.label }}</div>
              </th>
              <td mat-cell *matCellDef="let row">
                @if (column.type === 'status') {
                  <span class="px-2 py-1 rounded-full text-xs font-medium" [ngClass]="getStatusClass(row[column.key])">{{ row[column.key] }}</span>
                } @else if (column.type === 'image') {
                  <img [src]="row[column.key]" class="w-8 h-8 rounded-full object-cover" />
                } @else { {{ row[column.key] }} }
              </td>
            </ng-container>
          }
          @if (actions && actions.length > 0) {
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="text-right">Actions</th>
              <td mat-cell *matCellDef="let row" class="text-right">
                <button mat-icon-button [matMenuTriggerFor]="actionMenu"><mat-icon>more_vert</mat-icon></button>
                <mat-menu #actionMenu="matMenu">
                  @for (action of actions; track action.label) {
                    @if (!action.condition || action.condition(row)) {
                      <button mat-menu-item (click)="action.callback(row)">
                        @if (action.icon) { <mat-icon [style.color]="action.color || ''">{{ action.icon }}</mat-icon> }
                        <span>{{ action.label }}</span>
                      </button>
                    }
                  }
                </mat-menu>
              </td>
            </ng-container>
          }
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50 transition-colors"></tr>
        </table>
        @if (data.length === 0) {
          <div class="p-12 text-center text-gray-500">
            <mat-icon class="text-4xl text-gray-300 mb-2">inbox</mat-icon>
            <p>No data available</p>
          </div>
        }
      </div>
      @if (meta) {
        <mat-paginator [length]="meta.total" [pageSize]="meta.per_page" [pageIndex]="meta.current_page - 1"
                       [pageSizeOptions]="[10, 15, 25, 50, 100]" (page)="onPageChange($event)" showFirstLastButtons class="border-t">
        </mat-paginator>
      }
    </div>
  `,
  styles: [`
    :host ::ng-deep .mat-mdc-row:hover { background-color: #f9fafb; }
    :host ::ng-deep .mat-mdc-header-cell { font-weight: 600; color: #374151; background: #f9fafb; }
  `],
})
export class DataTableComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() title?: string;
  @Input() selectable = false;
  @Input() meta?: PaginationMeta;
  @Input() sortColumn = 'created_at';
  @Input() sortDirection: 'asc' | 'desc' = 'desc';
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() sortChange = new EventEmitter<Sort>();
  @Output() selectionChange = new EventEmitter<any[]>();
  selectedRows = new Set<number>();

  get displayedColumns(): string[] {
    const cols = this.columns.map((c) => c.key);
    if (this.selectable) cols.unshift('select');
    if (this.actions?.length) cols.push('actions');
    return cols;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-red-100 text-red-700',
      pending: 'bg-yellow-100 text-yellow-700',
      suspended: 'bg-blue-100 text-blue-700',
    };
    return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  }

  onPageChange(event: PageEvent): void { this.pageChange.emit(event); }

  onSort(column: string): void {
    this.sortDirection = this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortColumn = column;
    this.sortChange.emit({ active: column, direction: this.sortDirection });
  }

  toggleAll(event: any): void {
    if (event.checked) { this.data.forEach((row) => this.selectedRows.add(row.id)); }
    else { this.selectedRows.clear(); }
    this.emitSelection();
  }

  toggleRow(row: any, event: any): void {
    if (event.checked) { this.selectedRows.add(row.id); }
    else { this.selectedRows.delete(row.id); }
    this.emitSelection();
  }

  private emitSelection(): void {
    this.selectionChange.emit(this.data.filter((row) => this.selectedRows.has(row.id)));
  }
}
