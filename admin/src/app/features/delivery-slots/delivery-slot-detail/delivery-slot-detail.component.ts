import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeliverySlotApiService } from '../../../core/services/delivery-slot-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DeliverySlot } from '../../../core/models/master/delivery-slot.model';

@Component({
  selector: 'app-delivery-slot-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatButtonModule, MatIconModule, MatCardModule,
    MatChipsModule, MatDividerModule, MatProgressSpinnerModule, MatTooltipModule,
  ],
  styles: [`
    :host { display: block; }
    .detail-card { transition: all 0.2s ease; }
    .detail-card:hover { box-shadow: 0 4px 12px -2px rgba(99, 102, 241, 0.06), 0 2px 4px -2px rgba(99, 102, 241, 0.03); }
    .info-label { font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin-bottom: 4px; }
    .info-value { font-size: 0.9375rem; font-weight: 500; color: #1f2937; }
    .action-btn { transition: all 0.15s ease; }
    .action-btn:hover { transform: translateY(-1px); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
    .fade-in { animation: fadeIn 0.3s ease-out; }
  `],
  template: `
    @if (loading) {
      <div class="flex items-center justify-center h-[60vh]">
        <div class="text-center">
          <mat-spinner diameter="48" class="mx-auto mb-4 !text-indigo-600"></mat-spinner>
          <p class="text-gray-500 text-sm">Loading delivery slot details...</p>
        </div>
      </div>
    } @else if (slot) {
      <div class="fade-in">
        <a [routerLink]="['/admin/delivery-zones', zoneUuid, 'slots']"
          class="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6 group">
          <mat-icon class="mr-1 !text-lg group-hover:-translate-x-0.5 transition-transform">arrow_back</mat-icon>
          Back to Delivery Slots
        </a>

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-3xl font-bold text-gray-900 tracking-tight">{{ slot.slot_name }}</h1>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                [class]="getStatusClass(slot.status)">
                {{ slot.status | titlecase }}
              </span>
            </div>
            <p class="text-gray-500 mt-1">
              {{ slot.start_time }} &mdash; {{ slot.end_time }}
            </p>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <button mat-stroked-button (click)="toggleStatus()"
              [class]="slot.status === 'active' ? '!border-red-300 !text-red-600 hover:!bg-red-50' : '!border-emerald-300 !text-emerald-600 hover:!bg-emerald-50'"
              class="!rounded-lg">
              <mat-icon class="mr-1">{{ slot.status === 'active' ? 'block' : 'check_circle' }}</mat-icon>
              {{ slot.status === 'active' ? 'Deactivate' : 'Activate' }}
            </button>
            <button mat-flat-button [routerLink]="['/admin/delivery-zones', zoneUuid, 'slots', slot.uuid, 'edit']"
              class="!bg-indigo-600 !text-white hover:!bg-indigo-700 !rounded-lg !px-5">
              <mat-icon class="mr-1">edit</mat-icon> Edit
            </button>
            <button mat-stroked-button (click)="deleteSlot()"
              class="!border-red-300 !text-red-600 hover:!bg-red-50 !rounded-lg">
              <mat-icon class="mr-1">delete</mat-icon> Delete
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <div class="detail-card bg-white rounded-xl border border-gray-200 p-6">
              <div class="flex items-center gap-2 mb-5">
                <mat-icon class="!text-indigo-500 !text-xl">info</mat-icon>
                <h2 class="text-lg font-semibold text-gray-900">Slot Information</h2>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-5">
                <div>
                  <p class="info-label">Slot Name</p>
                  <p class="info-value">{{ slot.slot_name }}</p>
                </div>
                <div>
                  <p class="info-label">Start Time</p>
                  <p class="info-value font-mono">{{ slot.start_time }}</p>
                </div>
                <div>
                  <p class="info-label">End Time</p>
                  <p class="info-value font-mono">{{ slot.end_time }}</p>
                </div>
                <div>
                  <p class="info-label">Cutoff Time</p>
                  <p class="info-value font-mono">{{ slot.cutoff_time || '-' }}</p>
                </div>
                <div>
                  <p class="info-label">Maximum Orders</p>
                  @if (slot.maximum_orders != null) {
                    <span class="inline-block px-2.5 py-1 rounded bg-indigo-50 text-sm font-semibold text-indigo-700">{{ slot.maximum_orders }}</span>
                  } @else {
                    <p class="info-value">Unlimited</p>
                  }
                </div>
                <div>
                  <p class="info-label">Delivery Zone</p>
                  @if (slot.deliveryZone) {
                    <span class="inline-block px-2.5 py-1 rounded bg-emerald-50 text-sm font-semibold text-emerald-700">{{ slot.deliveryZone.zone_name }}</span>
                  } @else {
                    <p class="info-value">-</p>
                  }
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="detail-card bg-white rounded-xl border border-gray-200 p-6">
              <div class="flex items-center gap-2 mb-5">
                <mat-icon class="!text-purple-500 !text-xl">verified</mat-icon>
                <h2 class="text-lg font-semibold text-gray-900">Status</h2>
              </div>
              <div class="space-y-4">
                <div class="flex items-center justify-between py-2 border-b border-gray-100">
                  <span class="text-sm text-gray-500">Status</span>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                    [class]="getStatusClass(slot.status)">
                    {{ slot.status | titlecase }}
                  </span>
                </div>
              </div>
            </div>

            <div class="detail-card bg-white rounded-xl border border-gray-200 p-6">
              <div class="flex items-center gap-2 mb-5">
                <mat-icon class="!text-gray-400 !text-xl">schedule</mat-icon>
                <h2 class="text-lg font-semibold text-gray-900">Metadata</h2>
              </div>
              <div class="space-y-4">
                <div class="py-2 border-b border-gray-100">
                  <p class="text-sm text-gray-500 mb-1">Created At</p>
                  <p class="text-sm font-medium text-gray-900">{{ slot.created_at | date:'MMM d, y, h:mm a' }}</p>
                </div>
                <div class="py-2">
                  <p class="text-sm text-gray-500 mb-1">Updated At</p>
                  <p class="text-sm font-medium text-gray-900">{{ slot.updated_at | date:'MMM d, y, h:mm a' }}</p>
                </div>
              </div>
            </div>

            <div class="detail-card bg-white rounded-xl border border-gray-200 p-6">
              <div class="flex items-center gap-2 mb-5">
                <mat-icon class="!text-indigo-500 !text-xl">bolt</mat-icon>
                <h2 class="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div class="space-y-3">
                <button mat-stroked-button [routerLink]="['/admin/delivery-zones', zoneUuid, 'slots', slot.uuid, 'edit']"
                  class="w-full action-btn !border-gray-200 !text-gray-700 !justify-start !rounded-lg">
                  <mat-icon class="mr-3 !text-indigo-500">edit</mat-icon> Edit Slot
                </button>
                <button mat-stroked-button (click)="toggleStatus()"
                  class="w-full action-btn !border-gray-200 !text-gray-700 !justify-start !rounded-lg">
                  <mat-icon class="mr-3" [class]="slot.status === 'active' ? '!text-red-500' : '!text-emerald-500'">
                    {{ slot.status === 'active' ? 'block' : 'check_circle' }}
                  </mat-icon>
                  {{ slot.status === 'active' ? 'Deactivate' : 'Activate' }}
                </button>
                <button mat-stroked-button [routerLink]="['/admin/delivery-zones', zoneUuid, 'slots']"
                  class="w-full action-btn !border-gray-200 !text-gray-700 !justify-start !rounded-lg">
                  <mat-icon class="mr-3 !text-gray-500">arrow_back</mat-icon> Back to Slots
                </button>
                <mat-divider></mat-divider>
                <button mat-stroked-button (click)="deleteSlot()"
                  class="w-full action-btn !border-red-200 !text-red-600 hover:!bg-red-50 !justify-start !rounded-lg">
                  <mat-icon class="mr-3">delete</mat-icon> Delete Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class DeliverySlotDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private slotApi = inject(DeliverySlotApiService);
  private notification = inject(NotificationService);

  zoneUuid = '';
  slot: DeliverySlot | null = null;
  loading = true;

  ngOnInit(): void {
    this.zoneUuid = this.route.parent?.snapshot.paramMap.get('zoneUuid') || this.route.snapshot.paramMap.get('zoneUuid') || '';
    const slotUuid = this.route.snapshot.paramMap.get('slotUuid');
    if (!this.zoneUuid || !slotUuid) {
      this.router.navigate(['/admin/delivery-zones']);
      return;
    }
    this.loadSlot(slotUuid);
  }

  loadSlot(slotUuid: string): void {
    this.loading = true;
    this.slotApi.getById(this.zoneUuid, slotUuid).subscribe({
      next: (res) => {
        if (res.data) { this.slot = res.data; } else { this.router.navigate(['/admin/delivery-zones', this.zoneUuid, 'slots']); }
        this.loading = false;
      },
      error: () => { this.loading = false; this.notification.error('Failed to load delivery slot'); this.router.navigate(['/admin/delivery-zones', this.zoneUuid, 'slots']); },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'inactive': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  toggleStatus(): void {
    if (!this.slot) return;
    const newStatus = this.slot.status === 'active' ? 'inactive' : 'active';
    const label = newStatus === 'active' ? 'Activate' : 'Deactivate';
    if (window.confirm(`${label} slot "${this.slot.slot_name}"?`)) {
      this.slotApi.delete(this.zoneUuid, this.slot.uuid).subscribe({
        next: () => { this.notification.success(`Slot ${newStatus === 'active' ? 'activated' : 'deactivated'}`); this.loadSlot(this.slot!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deleteSlot(): void {
    if (!this.slot) return;
    if (window.confirm(`Delete slot "${this.slot.slot_name}"? This action cannot be undone.`)) {
      this.slotApi.delete(this.zoneUuid, this.slot.uuid).subscribe({
        next: () => { this.notification.success('Slot deleted'); this.router.navigate(['/admin/delivery-zones', this.zoneUuid, 'slots']); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }
}
