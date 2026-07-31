import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { DeliverySlotApiService } from '../../../core/services/delivery-slot-api.service';
import { DeliveryZoneApiService } from '../../../core/services/delivery-zone-api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-delivery-slot-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatSelectModule, MatCheckboxModule,
    MatProgressSpinnerModule, MatDividerModule,
  ],
  styles: [`
    :host { display: block; }
    .form-section { transition: all 0.2s ease; }
    .form-section:hover { box-shadow: 0 4px 12px -2px rgba(99, 102, 241, 0.06), 0 2px 4px -2px rgba(99, 102, 241, 0.03); }
    .section-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
    .fade-in { animation: fadeIn 0.3s ease-out; }
  `],
  template: `
    <div class="fade-in max-w-5xl mx-auto">
      <a [routerLink]="['/admin/delivery-zones', zoneUuid, 'slots']"
        class="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6 group">
        <mat-icon class="mr-1 !text-lg group-hover:-translate-x-0.5 transition-transform">arrow_back</mat-icon>
        Back to Delivery Slots
      </a>

      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">
          @if (isEditing) { Edit Delivery Slot } @else { Create New Delivery Slot }
        </h1>
        @if (isEditing && slotName) {
          <p class="mt-1 text-gray-500">Editing <span class="font-medium text-gray-700">{{ slotName }}</span></p>
        } @else {
          <p class="mt-1 text-gray-500">Fill in the details below to add a new delivery slot</p>
        }
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">

        <div class="form-section bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="section-icon bg-indigo-100">
              <mat-icon class="!text-indigo-600">schedule</mat-icon>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Slot Information</h2>
              <p class="text-sm text-gray-500">Time range, capacity and cutoff for this slot</p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <mat-form-field appearance="outline" class="w-full md:col-span-2">
              <mat-label>Slot Name</mat-label>
              <input matInput formControlName="slot_name" placeholder="e.g. Morning Delivery" />
              <mat-error>Slot name is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Start Time</mat-label>
              <input matInput type="time" formControlName="start_time" />
              <mat-error>Start time is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>End Time</mat-label>
              <input matInput type="time" formControlName="end_time" />
              <mat-error>End time is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Cutoff Time</mat-label>
              <input matInput type="time" formControlName="cutoff_time" />
              <mat-hint>Order cutoff before this slot</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Maximum Orders</mat-label>
              <input matInput type="number" formControlName="maximum_orders" placeholder="50" />
              <mat-hint>Leave empty for unlimited</mat-hint>
            </mat-form-field>
          </div>
        </div>

        <div class="form-section bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="section-icon bg-purple-100">
              <mat-icon class="!text-purple-600">tune</mat-icon>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Status</h2>
              <p class="text-sm text-gray-500">Set the delivery slot status</p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Status</mat-label>
              <mat-select formControlName="status">
                <mat-option value="active">
                  <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-emerald-500"></span>Active</span>
                </mat-option>
                <mat-option value="inactive">
                  <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-red-500"></span>Inactive</span>
                </mat-option>
                <mat-option value="pending">
                  <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-amber-500"></span>Pending</span>
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>

        <div class="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 sticky bottom-4">
          <p class="text-sm text-gray-400">
            @if (isEditing) { Changes will be saved immediately } @else { Fields marked with * are required }
          </p>
          <div class="flex items-center gap-3">
            <button mat-stroked-button type="button" [routerLink]="['/admin/delivery-zones', zoneUuid, 'slots']"
              class="!border-gray-300 !text-gray-700 !px-5 !rounded-lg">
              Cancel
            </button>
            <button mat-flat-button type="submit" [disabled]="form.invalid || isLoading"
              class="!bg-indigo-600 !text-white hover:!bg-indigo-700 !px-8 !rounded-lg !font-medium !shadow-md hover:!shadow-lg transition-all disabled:!opacity-50 disabled:!cursor-not-allowed">
              @if (isLoading) { <mat-spinner diameter="18" class="inline-block mr-2 !text-white"></mat-spinner> }
              @if (isEditing) { Update Slot } @else { Create Slot }
            </button>
          </div>
        </div>
      </form>
    </div>
  `,
})
export class DeliverySlotFormComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private slotApi = inject(DeliverySlotApiService);
  private zoneApi = inject(DeliveryZoneApiService);
  private notification = inject(NotificationService);

  isEditing = false;
  slotUuid: string | null = null;
  slotName = '';
  zoneUuid = '';
  isLoading = false;

  form = this.fb.group({
    slot_name: ['', Validators.required],
    start_time: ['', Validators.required],
    end_time: ['', Validators.required],
    cutoff_time: [''],
    maximum_orders: [null as number | null],
    status: ['active'],
  });

  ngOnInit(): void {
    this.zoneUuid = this.route.parent?.snapshot.paramMap.get('zoneUuid') || this.route.snapshot.paramMap.get('zoneUuid') || '';
    if (!this.zoneUuid) {
      this.notification.error('No delivery zone specified');
      this.router.navigate(['/admin/delivery-zones']);
      return;
    }
    const slotUuid = this.route.snapshot.paramMap.get('slotUuid');
    if (slotUuid) {
      this.isEditing = true;
      this.slotUuid = slotUuid;
      this.loadSlot(slotUuid);
    }
  }

  loadSlot(slotUuid: string): void {
    this.isLoading = true;
    this.slotApi.getById(this.zoneUuid, slotUuid).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.data) {
          this.slotName = res.data.slot_name;
          this.form.patchValue({
            slot_name: res.data.slot_name,
            start_time: res.data.start_time,
            end_time: res.data.end_time,
            cutoff_time: res.data.cutoff_time || '',
            maximum_orders: res.data.maximum_orders,
            status: res.data.status || 'active',
          });
        }
      },
      error: () => {
        this.isLoading = false;
        this.notification.error('Failed to load delivery slot');
        this.router.navigate(['/admin/delivery-zones', this.zoneUuid, 'slots']);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isLoading = true;
    const v = this.form.value;

    const payload: any = {
      slot_name: v.slot_name!,
      start_time: v.start_time!,
      end_time: v.end_time!,
      status: v.status || 'active',
    };
    if (v.cutoff_time) payload.cutoff_time = v.cutoff_time;
    if (v.maximum_orders != null) payload.maximum_orders = v.maximum_orders;

    const req = this.isEditing
      ? this.slotApi.update(this.zoneUuid, this.slotUuid!, payload)
      : this.slotApi.create(this.zoneUuid, payload);

    req.subscribe({
      next: (res) => {
        this.isLoading = false;
        this.notification.success(res.message || (this.isEditing ? 'Delivery slot updated' : 'Delivery slot created'));
        this.router.navigate(['/admin/delivery-zones', this.zoneUuid, 'slots']);
      },
      error: (err) => {
        this.isLoading = false;
        this.notification.error(err.error?.message || 'Operation failed');
      },
    });
  }
}
