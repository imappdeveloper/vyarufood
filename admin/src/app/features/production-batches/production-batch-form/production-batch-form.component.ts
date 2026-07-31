import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductionBatchApiService } from '../../../core/services/production-batch-api.service';
import { KitchenApiService } from '../../../core/services/kitchen-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BATCH_TYPES } from '../../../core/models/production-batch/production-batch.model';

@Component({
  selector: 'app-production-batch-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 900px; margin: 0 auto; position: relative; z-index: 2;">
        <a routerLink="/admin/production-batches" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
          onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
          <span class="material-icons" style="font-size: 16px;">arrow_back</span>
          Back to Production Batches
        </a>
        <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">
          <span *ngIf="isEditMode">Edit Production Batch</span>
          <span *ngIf="!isEditMode">Create Production Batch</span>
        </h1>
        <p *ngIf="isEditMode" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Update production batch details</p>
        <p *ngIf="!isEditMode" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Create a new production batch for your kitchen</p>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 900px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
      <form [formGroup]="batchForm" (ngSubmit)="onSubmit()">
        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">production_quantity_limit</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Batch Details</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Configure the production batch information</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Production Date <span style="color: #dc2626;">*</span></label>
              <input type="date" formControlName="production_date"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="batchForm.get('production_date')?.invalid && batchForm.get('production_date')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="batchForm.get('production_date')?.invalid && batchForm.get('production_date')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Production date is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Kitchen <span style="color: #dc2626;">*</span></label>
              <select formControlName="kitchen_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                [style.borderColor]="batchForm.get('kitchen_id')?.invalid && batchForm.get('kitchen_id')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">Select Kitchen</option>
                <option *ngFor="let k of kitchens" [value]="k.id">{{ k.name }}</option>
              </select>
              <p *ngIf="batchForm.get('kitchen_id')?.invalid && batchForm.get('kitchen_id')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Kitchen is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Batch Name <span style="color: #dc2626;">*</span></label>
              <input type="text" formControlName="batch_name" placeholder="e.g. Morning Batch - Breakfast" maxlength="150"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="batchForm.get('batch_name')?.invalid && batchForm.get('batch_name')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <p *ngIf="batchForm.get('batch_name')?.invalid && batchForm.get('batch_name')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Batch name is required</p>
                <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0; margin-left: auto;">{{ batchForm.get('batch_name')?.value?.length || 0 }}/150</p>
              </div>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Batch Type</label>
              <select formControlName="batch_type"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option *ngFor="let bt of batchTypes" [value]="bt.value">{{ bt.label }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Planned Start Time</label>
              <input type="time" formControlName="planned_start_time"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Planned End Time</label>
              <input type="time" formControlName="planned_end_time"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="batchForm.get('planned_start_time')?.value && batchForm.get('planned_end_time')?.value && batchForm.get('planned_start_time')?.value >= batchForm.get('planned_end_time')?.value" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Must be after planned start time</p>
            </div>
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Remarks</label>
              <textarea formControlName="remarks" rows="3" maxlength="1000" placeholder="Any additional notes..."
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; resize: vertical;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
              <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0; text-align: right;">{{ batchForm.get('remarks')?.value?.length || 0 }}/1000</p>
            </div>
          </div>
        </div>

        <div style="position: sticky; bottom: 16px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            <span *ngIf="isEditMode">Changes will be saved immediately</span>
            <span *ngIf="!isEditMode">Fields marked with * are required</span>
          </p>
          <div style="display: flex; align-items: center; gap: 10px;">
            <a routerLink="/admin/production-batches"
              style="padding: 10px 20px; background: white; color: #374151; font-weight: 600; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; border: 1.5px solid #e5e7eb; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">
              Cancel
            </a>
            <button type="submit" [disabled]="batchForm.invalid || saving"
              style="padding: 10px 28px; background: #059669; color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3);"
              [style.opacity]="batchForm.invalid || saving ? '0.5' : '1'"
              [style.cursor]="batchForm.invalid || saving ? 'not-allowed' : 'pointer'"
              onmouseover="if(!this.disabled){this.style.background='#047857';this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 16px rgba(5,150,105,0.4)'}"
              onmouseout="if(!this.disabled){this.style.background='#059669';this.style.transform='';this.style.boxShadow='0 4px 12px rgba(5,150,105,0.3)'}">
              <span *ngIf="saving" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block;"></span>
              <span *ngIf="isEditMode">Update Batch</span>
              <span *ngIf="!isEditMode">Create Batch</span>
            </button>
          </div>
        </div>
      </form>
    </section>

    <style>
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class ProductionBatchFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private batchApi = inject(ProductionBatchApiService);
  private kitchenApi = inject(KitchenApiService);
  private notification = inject(NotificationService);

  batchForm!: FormGroup;
  isEditMode = false;
  batchUuid = '';
  saving = false;

  kitchens: any[] = [];
  batchTypes = BATCH_TYPES;

  ngOnInit(): void {
    this.buildForm();
    this.batchUuid = this.route.snapshot.paramMap.get('uuid') || '';
    this.isEditMode = !!this.batchUuid;
    this.loadKitchens();
    if (this.isEditMode) { this.loadBatch(); }
  }

  buildForm(): void {
    this.batchForm = this.fb.group({
      production_date: [new Date().toISOString().slice(0, 10), Validators.required],
      kitchen_id: [null, Validators.required],
      batch_name: ['', Validators.required],
      batch_type: ['regular'],
      planned_start_time: ['06:00'],
      planned_end_time: ['10:00'],
      remarks: [''],
    });
  }

  loadKitchens(): void {
    this.kitchenApi.getAll().subscribe({
      next: (res) => { this.kitchens = res.data || []; },
    });
  }

  loadBatch(): void {
    this.batchApi.getBatch(this.batchUuid).subscribe({
      next: (res) => {
        const batch = res.data!;
        this.batchForm.patchValue({
          production_date: batch.production_date ? batch.production_date.slice(0, 10) : new Date().toISOString().slice(0, 10),
          kitchen_id: batch.kitchen_id,
          batch_name: batch.batch_name,
          batch_type: batch.batch_type || 'regular',
          planned_start_time: batch.planned_start_time || '',
          planned_end_time: batch.planned_end_time || '',
          remarks: batch.remarks || '',
        });
      },
      error: () => { this.notification.error('Failed to load batch'); this.router.navigate(['/admin/production-batches']); },
    });
  }

  onSubmit(): void {
    if (this.batchForm.invalid) return;
    this.saving = true;

    const formValue = { ...this.batchForm.value };
    const data: Record<string, any> = {
      kitchen_id: formValue.kitchen_id,
      batch_name: formValue.batch_name,
      batch_type: formValue.batch_type,
      planned_start_time: formValue.planned_start_time || null,
      planned_end_time: formValue.planned_end_time || null,
      remarks: formValue.remarks || null,
    };

    if (formValue.production_date) {
      data['production_date'] = formValue.production_date;
    }

    const obs = this.isEditMode
      ? this.batchApi.updateBatch(this.batchUuid, data)
      : this.batchApi.createBatch(data);

    obs.subscribe({
      next: (res) => {
        this.notification.success(this.isEditMode ? 'Batch updated' : 'Batch created');
        const uuid = res.data?.uuid || this.batchUuid;
        this.router.navigate(['/admin/production-batches', uuid]);
      },
      error: (err) => { this.saving = false; this.notification.error(err.error?.message || 'Operation failed'); },
    });
  }
}
