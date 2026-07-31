import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { KitchenWorkingDayApiService } from '../../../../core/services/kitchen-working-day-api.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-working-day-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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
          <a routerLink="/admin/kitchens/working-days" style="color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">Working Days</a>
          <span class="material-icons" style="font-size: 14px; color: rgba(255,255,255,0.4);">chevron_right</span>
          <span style="color: white; font-weight: 600;">{{ isEdit ? 'Edit' : 'Create' }}</span>
        </nav>
        <a routerLink="/admin/kitchens/working-days" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
          onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
          <span class="material-icons" style="font-size: 16px;">arrow_back</span>
          Back to Working Days
        </a>
        <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">
          {{ isEdit ? 'Edit Working Day' : 'Create Working Day' }}
        </h1>
        <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">
          {{ isEdit ? 'Update working day schedule' : 'Add a new working day schedule' }}
        </p>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 800px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
      <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
          <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="font-size: 20px; color: #059669;">schedule</span>
          </div>
          <div>
            <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Schedule Details</h2>
            <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Configure day type and operating times</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Day of Week <span style="color: #dc2626;">*</span></label>
            <select [(ngModel)]="formData.day_of_week" [disabled]="isEdit"
              style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
              [style.background]="isEdit ? '#f3f4f6' : '#f9fafb'"
              onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
              onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background=this.isEdit?'#f3f4f6':'#f9fafb';">
              <option value="">Select Day</option>
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
              <option value="saturday">Saturday</option>
              <option value="sunday">Sunday</option>
            </select>
          </div>
          <div style="display: flex; align-items: center; padding-top: 6px;">
            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 14px; font-weight: 600; color: #374151; user-select: none;">
              <input type="checkbox" [(ngModel)]="formData.is_working"
                style="width: 18px; height: 18px; accent-color: #059669; border-radius: 4px; cursor: pointer;" />
              Is Working Day
            </label>
          </div>

          <div>
            <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Opening Time</label>
            <input type="time" [(ngModel)]="formData.opening_time"
              style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
              onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
              onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
          </div>
          <div>
            <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Closing Time</label>
            <input type="time" [(ngModel)]="formData.closing_time"
              style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
              onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
              onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
          </div>
          <div>
            <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Preparation Start Time</label>
            <input type="time" [(ngModel)]="formData.preparation_start_time"
              style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
              onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
              onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
          </div>
          <div>
            <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Accept Order Start</label>
            <input type="time" [(ngModel)]="formData.accept_order_start"
              style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
              onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
              onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
          </div>
          <div>
            <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Accept Order End</label>
            <input type="time" [(ngModel)]="formData.accept_order_end"
              style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
              onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
              onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
          </div>
        </div>
      </div>

      <div style="position: sticky; bottom: 16px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 16px rgba(0,0,0,0.06); margin-top: 16px;">
        <p style="font-size: 12px; color: #9ca3af; margin: 0;">
          <span *ngIf="isEdit">Changes will be saved immediately</span>
          <span *ngIf="!isEdit">Fields marked with * are required</span>
        </p>
        <div style="display: flex; align-items: center; gap: 10px;">
          <a routerLink="/admin/kitchens/working-days"
            style="padding: 10px 20px; background: white; color: #374151; font-weight: 600; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; border: 1.5px solid #e5e7eb; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
            onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">
            Cancel
          </a>
          <button (click)="onSubmit()" [disabled]="saving"
            style="padding: 10px 28px; background: #059669; color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3);"
            [style.opacity]="saving ? '0.6' : '1'"
            [style.cursor]="saving ? 'not-allowed' : 'pointer'"
            onmouseover="if(!this.disabled){this.style.background='#047857';this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 16px rgba(5,150,105,0.4)'}"
            onmouseout="if(!this.disabled){this.style.background='#059669';this.style.transform='';this.style.boxShadow='0 4px 12px rgba(5,150,105,0.3)'}">
            <span *ngIf="saving" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block;"></span>
            {{ isEdit ? 'Update' : 'Create' }}
          </button>
        </div>
      </div>
    </section>

    <style>
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class WorkingDayFormComponent implements OnInit {
  private workingDayApi = inject(KitchenWorkingDayApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEdit = false;
  saving = false;
  kitchenId = 1;
  uuid = '';

  formData = {
    day_of_week: '',
    is_working: true,
    opening_time: '',
    closing_time: '',
    preparation_start_time: '',
    accept_order_start: '',
    accept_order_end: '',
  };

  ngOnInit(): void {
    this.kitchenId = +this.route.snapshot.queryParams['kitchen_id'] || 1;
    this.uuid = this.route.snapshot.params['uuid'] || '';
    this.isEdit = !!this.uuid;

    if (this.isEdit) {
      this.loadWorkingDay();
    }
  }

  loadWorkingDay(): void {
    this.workingDayApi.getById(this.uuid).subscribe({
      next: (res) => {
        const data = res.data!;
        this.formData = {
          day_of_week: data.day_of_week,
          is_working: data.is_working,
          opening_time: data.opening_time || '',
          closing_time: data.closing_time || '',
          preparation_start_time: data.preparation_start_time || '',
          accept_order_start: data.accept_order_start || '',
          accept_order_end: data.accept_order_end || '',
        };
      },
      error: () => this.notification.error('Failed to load working day'),
    });
  }

  onSubmit(): void {
    if (!this.formData.day_of_week) {
      this.notification.error('Day of week is required');
      return;
    }

    this.saving = true;
    const payload = { ...this.formData, kitchen_id: this.kitchenId };

    if (this.isEdit) {
      this.workingDayApi.update(this.uuid, payload).subscribe({
        next: () => {
          this.notification.success('Working day updated');
          this.router.navigate(['/admin/kitchens/working-days']);
        },
        error: (err) => { this.saving = false; this.notification.error(err.error?.message || 'Update failed'); },
      });
    } else {
      this.workingDayApi.create(payload).subscribe({
        next: () => {
          this.notification.success('Working day created');
          this.router.navigate(['/admin/kitchens/working-days']);
        },
        error: (err) => { this.saving = false; this.notification.error(err.error?.message || 'Creation failed'); },
      });
    }
  }
}
