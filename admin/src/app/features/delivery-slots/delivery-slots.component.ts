import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { SelectionModel } from '@angular/cdk/collections';
import { DeliverySlotApiService } from '../../core/services/delivery-slot-api.service';
import { DeliveryZoneApiService } from '../../core/services/delivery-zone-api.service';
import { NotificationService } from '../../core/services/notification.service';
import { DeliverySlot } from '../../core/models/master/delivery-slot.model';

@Component({
  selector: 'app-delivery-slots',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule, MatTableModule, MatPaginatorModule,
    MatCheckboxModule, MatMenuModule, MatButtonModule, MatIconModule, MatTooltipModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule,
    MatDividerModule,
  ],
  styles: [`
    :host { display: block; }
    .stat-card { transition: all 0.2s ease; }
    .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px -5px rgba(99, 102, 241, 0.1), 0 4px 10px -5px rgba(99, 102, 241, 0.04); }
    .table-row-hover:hover { background-color: #f5f7ff !important; }
    .bulk-bar { animation: slideDown 0.2s ease-out; }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .fade-in { animation: fadeIn 0.3s ease-out; }
    .empty-state-icon { background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); }
    .kebab-btn { min-width: 36px; padding: 0; }
  `],
  template: `
    <div class="fade-in">
      <div class="mb-8">
        <nav class="flex items-center text-sm text-gray-500 mb-4">
          <a routerLink="/admin/dashboard" class="hover:text-indigo-600 transition-colors">Home</a>
          <mat-icon class="text-gray-400 mx-1" style="font-size: 16px; width: 16px; height: 16px;">chevron_right</mat-icon>
          <a routerLink="/admin/delivery-zones" class="hover:text-indigo-600 transition-colors">Delivery Zones</a>
          <mat-icon class="text-gray-400 mx-1" style="font-size: 16px; width: 16px; height: 16px;">chevron_right</mat-icon>
          <span class="text-gray-900 font-medium">Delivery Slots</span>
        </nav>
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">
              Delivery Slots
              @if (zoneName) {
                <span class="text-xl font-normal text-gray-400 ml-2">&mdash; {{ zoneName }}</span>
              }
            </h1>
            <p class="mt-1 text-gray-500 text-base">Manage delivery time slots for this zone</p>
          </div>
          <div class="flex items-center gap-3">
            <a mat-stroked-button [routerLink]="['/admin/delivery-zones']"
              class="!border-gray-300 !text-gray-700">
              <mat-icon class="mr-1" style="font-size: 18px; width: 18px; height: 18px;">arrow_back</mat-icon>
              Back to Zones
            </a>
            <button mat-flat-button [routerLink]="['/admin/delivery-zones', zoneUuid, 'slots', 'create']"
              class="!bg-indigo-600 !text-white hover:!bg-indigo-700 !px-5 !py-2 !rounded-lg !font-medium !shadow-md hover:!shadow-lg transition-all">
              <mat-icon class="mr-1" style="font-size: 20px; width: 20px; height: 20px;">add</mat-icon>
              Add Slot
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="stat-card bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
            <mat-icon class="text-indigo-600">schedule</mat-icon>
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium">Total Slots</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalCount }}</p>
          </div>
        </div>
        <div class="stat-card bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
            <mat-icon class="text-emerald-600">check_circle</mat-icon>
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium">Active</p>
            <p class="text-2xl font-bold text-gray-900">{{ activeCount }}</p>
          </div>
        </div>
        <div class="stat-card bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <mat-icon class="text-amber-600">hourglass_empty</mat-icon>
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium">Pending</p>
            <p class="text-2xl font-bold text-gray-900">{{ pendingCount }}</p>
          </div>
        </div>
        <div class="stat-card bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
            <mat-icon class="text-red-600">block</mat-icon>
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium">Inactive</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalCount - activeCount - pendingCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 mb-4">
        <div class="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <mat-form-field appearance="outline" class="!flex-1 !min-w-0">
            <mat-icon matPrefix class="text-gray-400 mr-1">search</mat-icon>
            <mat-label>Search slots</mat-label>
            <input matInput [(ngModel)]="search" (keyup.enter)="loadSlots()" (ngModelChange)="onSearchDebounce()" />
            @if (search) {
              <button matSuffix mat-icon-button (click)="clearSearch()"><mat-icon>close</mat-icon></button>
            }
          </mat-form-field>
          <mat-form-field appearance="outline" class="!w-40">
            <mat-label>Status</mat-label>
            <mat-select [(ngModel)]="statusFilter" (selectionChange)="onFilterChange()">
              <mat-option [value]="null">All Statuses</mat-option>
              <mat-option value="active">Active</mat-option>
              <mat-option value="inactive">Inactive</mat-option>
              <mat-option value="pending">Pending</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </div>

      @if (selectedRows.length > 0) {
        <div class="bulk-bar bg-indigo-50 border border-indigo-200 rounded-xl mb-4 px-6 py-3 flex items-center gap-4">
          <span class="text-sm font-semibold text-indigo-700">{{ selectedRows.length }} selected</span>
          <div class="h-5 w-px bg-indigo-300"></div>
          <button mat-stroked-button class="!border-red-300 !text-red-600 !text-sm" (click)="bulkDelete()">
            <mat-icon class="mr-1" style="font-size: 16px; width: 16px; height: 16px;">delete</mat-icon> Delete
          </button>
          <button mat-icon-button class="!text-gray-500 ml-auto" (click)="clearSelection()">
            <mat-icon style="font-size: 18px; width: 18px; height: 18px;">close</mat-icon>
          </button>
        </div>
      }

      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        @if (loading) {
          <div class="flex items-center justify-center py-20">
            <mat-spinner diameter="40" class="!text-indigo-600"></mat-spinner>
          </div>
        } @else if (dataSource.filteredData.length === 0) {
          <div class="flex flex-col items-center justify-center py-20 px-6">
            <div class="empty-state-icon w-20 h-20 rounded-2xl flex items-center justify-center mb-5">
              <mat-icon class="!text-indigo-400 !text-4xl">schedule</mat-icon>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-1">No delivery slots found</h3>
            <p class="text-gray-500 text-center max-w-sm mb-6">
              @if (search || statusFilter) {
                Try adjusting your search or filter criteria
              } @else {
                Get started by adding your first delivery slot
              }
            </p>
            @if (!search && !statusFilter) {
              <button mat-flat-button [routerLink]="['/admin/delivery-zones', zoneUuid, 'slots', 'create']"
                class="!bg-indigo-600 !text-white hover:!bg-indigo-700 !px-5 !rounded-lg">
                <mat-icon class="mr-1">add</mat-icon> Add Slot
              </button>
            } @else {
              <button mat-stroked-button (click)="clearFilters()" class="!border-gray-300 !text-gray-700">Clear Filters</button>
            }
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="dataSource" class="w-full">
              <ng-container matColumnDef="select">
                <th mat-header-cell *matHeaderCellDef class="!w-12 !pr-0">
                  <mat-checkbox (change)="toggleAllRows($event)"
                    [checked]="selection.hasValue() && isAllSelected()"
                    [indeterminate]="selection.hasValue() && !isAllSelected()"></mat-checkbox>
                </th>
                <td mat-cell *matCellDef="let row" class="!w-12 !pr-0">
                  <mat-checkbox (click)="$event.stopPropagation()" (change)="toggleRow(row)"
                    [checked]="selection.isSelected(row)"></mat-checkbox>
                </td>
              </ng-container>

              <ng-container matColumnDef="slot_name">
                <th mat-header-cell *matHeaderCellDef class="!min-w-[160px]">Slot Name</th>
                <td mat-cell *matCellDef="let row">
                  <div class="py-2">
                    <p class="font-semibold text-gray-900 leading-tight">{{ row.slot_name }}</p>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="start_time">
                <th mat-header-cell *matHeaderCellDef>Start Time</th>
                <td mat-cell *matCellDef="let row">
                  <span class="text-sm text-gray-700 font-mono">{{ row.start_time }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="end_time">
                <th mat-header-cell *matHeaderCellDef>End Time</th>
                <td mat-cell *matCellDef="let row">
                  <span class="text-sm text-gray-700 font-mono">{{ row.end_time }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="cutoff_time">
                <th mat-header-cell *matHeaderCellDef class="hidden lg:table-cell">Cutoff</th>
                <td mat-cell *matCellDef="let row" class="hidden lg:table-cell">
                  <span class="text-sm text-gray-600 font-mono">{{ row.cutoff_time || '-' }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="maximum_orders">
                <th mat-header-cell *matHeaderCellDef class="text-right hidden lg:table-cell">Max Orders</th>
                <td mat-cell *matCellDef="let row" class="text-right hidden lg:table-cell">
                  <span class="text-sm text-gray-600 font-mono">{{ row.maximum_orders ?? '-' }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef class="!text-center">Status</th>
                <td mat-cell *matCellDef="let row" class="!text-center">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    [class]="getStatusClass(row.status)">
                    {{ row.status | titlecase }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="!text-center !w-16"></th>
                <td mat-cell *matCellDef="let row" class="!text-center !w-16">
                  <button mat-icon-button [matMenuTriggerFor]="actionMenu" class="kebab-btn !text-gray-400 hover:!text-gray-700"
                    (click)="$event.stopPropagation()">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #actionMenu="matMenu" class="!rounded-xl">
                    <button mat-menu-item (click)="viewSlot(row)">
                      <mat-icon class="!text-indigo-500">visibility</mat-icon><span>View Details</span>
                    </button>
                    <button mat-menu-item (click)="editSlot(row)">
                      <mat-icon class="!text-indigo-500">edit</mat-icon><span>Edit</span>
                    </button>
                    <mat-divider></mat-divider>
                    @if (row.status !== 'active') {
                      <button mat-menu-item (click)="setStatus(row, 'active')">
                        <mat-icon class="!text-emerald-500">check_circle</mat-icon><span>Activate</span>
                      </button>
                    }
                    @if (row.status === 'active') {
                      <button mat-menu-item (click)="setStatus(row, 'inactive')">
                        <mat-icon class="!text-red-500">block</mat-icon><span>Deactivate</span>
                      </button>
                    }
                    <mat-divider></mat-divider>
                    <button mat-menu-item (click)="deleteSlot(row)" class="!text-red-600">
                      <mat-icon>delete</mat-icon><span>Delete</span>
                    </button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns" class="!bg-gray-50"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"
                class="table-row-hover cursor-pointer" (click)="viewSlot(row)">
              </tr>
            </table>
          </div>

          <div class="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
            <span class="text-sm text-gray-500">Showing {{ getRangeLabel() }}</span>
            <mat-paginator [length]="totalCount" [pageSize]="perPage" [pageSizeOptions]="[10, 25, 50]"
              (page)="onPageChange($event)" showFirstLastButtons class="!text-sm">
            </mat-paginator>
          </div>
        }
      </div>
    </div>
  `,
})
export class DeliverySlotsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private slotApi = inject(DeliverySlotApiService);
  private zoneApi = inject(DeliveryZoneApiService);
  private notification = inject(NotificationService);

  zoneUuid = '';
  zoneName = '';
  slots: DeliverySlot[] = [];
  displayedColumns = ['select', 'slot_name', 'start_time', 'end_time', 'cutoff_time', 'maximum_orders', 'status', 'actions'];
  dataSource = new MatTableDataSource<DeliverySlot>();
  selection = new SelectionModel<DeliverySlot>(true, []);

  loading = false;

  currentPage = 1;
  perPage = 10;
  sort = 'start_time';
  order: 'asc' | 'desc' = 'asc';
  search = '';
  statusFilter: string | null = null;

  totalCount = 0;
  activeCount = 0;
  pendingCount = 0;

  selectedRows: DeliverySlot[] = [];
  private searchTimeout: any;

  ngOnInit(): void {
    this.zoneUuid = this.route.parent?.snapshot.paramMap.get('zoneUuid') || this.route.snapshot.paramMap.get('zoneUuid') || '';
    if (!this.zoneUuid) {
      this.notification.error('No delivery zone specified');
      this.router.navigate(['/admin/delivery-zones']);
      return;
    }
    this.loadZoneName();
    this.loadSlots();
  }

  loadZoneName(): void {
    this.zoneApi.getById(this.zoneUuid).subscribe({
      next: (res) => { if (res.data) { this.zoneName = res.data.zone_name; } },
      error: () => {},
    });
  }

  loadSlots(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: this.currentPage.toString(),
      per_page: this.perPage.toString(),
      sort: this.sort,
      order: this.order,
    };
    if (this.search) params['search'] = this.search;
    if (this.statusFilter) params['status'] = this.statusFilter;

    this.slotApi.getAll(this.zoneUuid, params).subscribe({
      next: (res) => {
        this.slots = res.data || [];
        this.dataSource.data = this.slots;
        this.totalCount = this.slots.length;
        this.activeCount = this.slots.filter(s => s.status === 'active').length;
        this.pendingCount = this.slots.filter(s => s.status === 'pending').length;
        this.loading = false;
      },
      error: () => { this.loading = false; this.notification.error('Failed to load delivery slots'); },
    });
  }

  onSearchDebounce(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => { this.currentPage = 1; this.loadSlots(); }, 400);
  }

  clearSearch(): void { this.search = ''; this.currentPage = 1; this.loadSlots(); }
  onFilterChange(): void { this.currentPage = 1; this.loadSlots(); }
  clearFilters(): void {
    this.search = '';
    this.statusFilter = null;
    this.currentPage = 1;
    this.loadSlots();
  }
  onPageChange(event: PageEvent): void { this.currentPage = event.pageIndex + 1; this.perPage = event.pageSize; this.loadSlots(); }

  isAllSelected(): boolean { return this.selection.selected.length === this.dataSource.filteredData.length; }
  toggleAllRows(event: any): void {
    if (event.checked) { this.selection.select(...this.dataSource.filteredData); } else { this.selection.clear(); }
    this.selectedRows = this.selection.selected;
  }
  toggleRow(row: DeliverySlot): void { this.selection.toggle(row); this.selectedRows = this.selection.selected; }
  clearSelection(): void { this.selection.clear(); this.selectedRows = []; }
  getRangeLabel(): string { const t = this.dataSource.filteredData.length; return t === 0 ? '0 of 0' : `1\u2013${t} of ${t}`; }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'inactive': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  viewSlot(row: DeliverySlot): void { this.router.navigate(['/admin/delivery-zones', this.zoneUuid, 'slots', row.uuid]); }
  editSlot(row: DeliverySlot): void { this.router.navigate(['/admin/delivery-zones', this.zoneUuid, 'slots', row.uuid, 'edit']); }

  setStatus(row: DeliverySlot, status: string): void {
    const label = status === 'active' ? 'Activate' : 'Deactivate';
    if (window.confirm(`${label} slot "${row.slot_name}"?`)) {
      this.slotApi.delete(this.zoneUuid, row.uuid).subscribe({
        next: () => { this.notification.success(`Slot ${status === 'active' ? 'activated' : 'deactivated'}`); this.loadSlots(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deleteSlot(row: DeliverySlot): void {
    if (window.confirm(`Delete slot "${row.slot_name}"? This action cannot be undone.`)) {
      this.slotApi.delete(this.zoneUuid, row.uuid).subscribe({
        next: () => { this.notification.success('Slot deleted'); this.loadSlots(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  bulkDelete(): void {
    if (window.confirm(`Delete ${this.selectedRows.length} selected slots? This cannot be undone.`)) {
      const deletions = this.selectedRows.map(r => this.slotApi.delete(this.zoneUuid, r.uuid));
      deletions[deletions.length - 1]?.subscribe({
        next: () => { this.notification.success('Slots deleted'); this.clearSelection(); this.loadSlots(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }
}
