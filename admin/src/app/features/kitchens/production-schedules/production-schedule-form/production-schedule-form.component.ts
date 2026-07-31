import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductionScheduleApiService } from '../../../../core/services/production-schedule-api.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-production-schedule-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 800px; margin: 0 auto; position: relative; z-index: 2;">
        <nav style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.7); margin-bottom: 16px;">
          <a routerLink="/admin/dashboard" style="color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">Home</a>
          <span class="material-icons" style="font-size: 14px; color: rgba(255,255,255,0.4);">chevron_right</span>
          <a routerLink="/admin/kitchens" style="color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">Kitchens</a>
          <span class="material-icons" style="font-size: 14px; color: rgba(255,255,255,0.4);">chevron_right</span>
          <a routerLink="/admin/kitchens/production-schedules" style="color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">Production Schedules</a>
          <span class="material-icons" style="font-size: 14px; color: rgba(255,255,255,0.4);">chevron_right</span>
          <span style="color: white; font-weight: 600;">{{ isEditing ? 'Edit' : 'Create' }}</span>
        </nav>
        <a routerLink="/admin/kitchens/production-schedules" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
          onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
          <span class="material-icons" style="font-size: 16px;">arrow_back</span>
          Back to Production Schedules
        </a>
        <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">
          {{ isEditing ? 'Edit Production Schedule' : 'Create Production Schedule' }}
        </h1>
        <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">
          <span *ngIf="isEditing && scheduleLabel">Editing <strong style="color: white;">{{ scheduleLabel }}</strong></span>
          <span *ngIf="!isEditing">Fill in the details below to plan kitchen production</span>
        </p>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 800px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #dbeafe; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #2563eb;">event</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Production Details</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Date, meal type and planned quantities</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Production Date <span style="color: #dc2626;">*</span></label>
              <input type="date" formControlName="production_date"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; box-sizing: border-box;"
                [style.borderColor]="form.get('production_date')?.invalid && form.get('production_date')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="form.get('production_date')?.invalid && form.get('production_date')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Production date is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Meal Type <span style="color: #dc2626;">*</span></label>
              <select formControlName="meal_type"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="healthy_meal">Healthy Meal</option>
                <option value="snack">Snack</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Planned Quantity</label>
              <input type="number" min="0" formControlName="planned_quantity"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Produced Quantity</label>
              <input type="number" min="0" formControlName="produced_quantity"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #f5f3ff; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #6d28d9;">schedule</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Timing</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Production start and end times</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Production Start</label>
              <input type="datetime-local" formControlName="production_start"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Production End</label>
              <input type="datetime-local" formControlName="production_end"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">info</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Status & Notes</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Schedule status and remarks</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Status</label>
              <select formControlName="status"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div></div>
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Remarks <span style="color: #9ca3af;">(optional)</span></label>
              <textarea formControlName="remarks" rows="3" placeholder="Optional remarks about this schedule"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; resize: vertical;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
            </div>
          </div>
        </div>

        <div style="position: sticky; bottom: 16px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 16px rgba(0,0,0,0.06); margin-top: 16px;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            <span *ngIf="isEditing">Changes will be saved immediately</span>
            <span *ngIf="!isEditing">Fields marked with * are required</span>
          </p>
          <div style="display: flex; align-items: center; gap: 10px;">
            <a routerLink="/admin/kitchens/production-schedules"
              style="padding: 10px 20px; background: white; color: #374151; font-weight: 600; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; border: 1.5px solid #e5e7eb; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">
              Cancel
            </a>
            <button type="submit" [disabled]="form.invalid || saving"
              style="padding: 10px 28px; background: #059669; color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3);"
              [style.opacity]="form.invalid || saving ? '0.5' : '1'"
              [style.cursor]="form.invalid || saving ? 'not-allowed' : 'pointer'"
              onmouseover="if(!this.disabled){this.style.background='#047857';this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 16px rgba(5,150,105,0.4)'}"
              onmouseout="if(!this.disabled){this.style.background='#059669';this.style.transform='';this.style.boxShadow='0 4px 12px rgba(5,150,105,0.3)'}">
              <span *ngIf="saving" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block;"></span>
              {{ isEditing ? 'Update Schedule' : 'Create Schedule' }}
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
export class ProductionScheduleFormComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private scheduleApi = inject(ProductionScheduleApiService);
  private notification = inject(NotificationService);

  isEditing = false;
  saving = false;
  scheduleUuid = '';
  scheduleLabel = '';
  kitchenId = 1;

  form = this.fb.group({
    production_date: ['', Validators.required],
    meal_type: ['lunch', Validators.required],
    planned_quantity: [0],
    produced_quantity: [0],
    production_start: [null as string | null],
    production_end: [null as string | null],
    status: ['planned'],
    remarks: [null as string | null],
  });

  ngOnInit(): void {
    this.scheduleUuid = this.route.snapshot.paramMap.get('uuid') || '';
    this.isEditing = !!this.scheduleUuid;
    this.kitchenId = this.route.snapshot.queryParams['kitchen_id'] ? +this.route.snapshot.queryParams['kitchen_id'] : 1;

    if (this.isEditing) {
      this.loadSchedule();
    }
  }

  loadSchedule(): void {
    this.scheduleApi.getById(this.scheduleUuid).subscribe({
      next: (res) => {
        const s = res.data!;
        this.scheduleLabel = `${s.meal_type_label} - ${s.production_date}`;
        this.form.patchValue({
          production_date: s.production_date,
          meal_type: s.meal_type,
          planned_quantity: s.planned_quantity,
          produced_quantity: s.produced_quantity,
          production_start: s.production_start,
          production_end: s.production_end,
          status: s.status,
          remarks: s.remarks,
        });
      },
      error: () => { this.notification.error('Failed to load production schedule'); this.router.navigate(['/admin/kitchens/production-schedules']); },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const formValue = { ...this.form.value };

    if (formValue.production_start && typeof formValue.production_start === 'string') {
      formValue.production_start = formValue.production_start.replace('T', ' ') + ':00';
    }
    if (formValue.production_end && typeof formValue.production_end === 'string') {
      formValue.production_end = formValue.production_end.replace('T', ' ') + ':00';
    }

    if (this.isEditing) {
      const { kitchen_id, ...updateData } = formValue as any;
      this.scheduleApi.update(this.scheduleUuid, updateData).subscribe({
        next: () => {
          this.notification.success('Production schedule updated');
          this.router.navigate(['/admin/kitchens/production-schedules']);
        },
        error: (err) => { this.saving = false; this.notification.error(err.error?.message || 'Operation failed'); },
      });
    } else {
      const data = { ...formValue, kitchen_id: this.kitchenId };
      this.scheduleApi.create(data).subscribe({
        next: () => {
          this.notification.success('Production schedule created');
          this.router.navigate(['/admin/kitchens/production-schedules']);
        },
        error: (err) => { this.saving = false; this.notification.error(err.error?.message || 'Operation failed'); },
      });
    }
  }
}
