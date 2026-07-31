import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { WeeklyMenuApiService } from '../../../core/services/weekly-menu-api.service';
import { KitchenApiService } from '../../../core/services/kitchen-api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-weekly-menu-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div style="background: linear-gradient(135deg, #059669 0%, #047857 50%, #166534 100%); padding: 32px 24px; margin: 0 0 32px 0; position: relative; overflow: hidden;">
      <svg style="position: absolute; bottom: 0; left: 0; width: 100%; height: 40px; fill: white;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 720,0 1440,20 L1440,40 L0,40 Z"/>
      </svg>
      <div style="max-width: 768px; margin: 0 auto; position: relative; z-index: 1;">
        <a routerLink="/admin/weekly-menus" style="display: inline-flex; align-items: center; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
          onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
          <span class="material-icons" style="font-size: 18px; margin-right: 4px;">arrow_back</span>
          Back to Weekly Menus
        </a>
        <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0;">
          <span *ngIf="isEditing">Edit Weekly Menu</span>
          <span *ngIf="!isEditing">Create Weekly Menu</span>
        </h1>
        <p *ngIf="isEditing && menuTitle" style="font-size: 14px; color: rgba(255,255,255,0.7); margin: 4px 0 0 0;">Editing <strong style="color: white;">{{ menuTitle }}</strong></p>
        <p *ngIf="!isEditing" style="font-size: 14px; color: rgba(255,255,255,0.7); margin: 4px 0 0 0;">Plan your weekly menu by selecting dates and adding meals</p>
      </div>
    </div>

    <div style="animation: fadeIn 0.3s ease-out; max-width: 768px; margin: 0 auto; padding: 0 24px 100px;">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 24px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #059669;">info</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Basic Information</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Menu title, dates, and configuration</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div style="grid-column: span 2;">
              <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">Menu Title <span style="color: #dc2626;">*</span></label>
              <input type="text" formControlName="title" placeholder="e.g. Week of July 21, 2026"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: white; box-sizing: border-box;"
                [style.borderColor]="form.get('title')?.invalid && form.get('title')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor=this.getAttribute('data-touched')==='true'&&this.value?'#e5e7eb':'#e5e7eb'" />
              <p *ngIf="form.get('title')?.invalid && form.get('title')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Title is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">Week Start Date <span style="color: #dc2626;">*</span></label>
              <input type="date" formControlName="week_start_date"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: white; box-sizing: border-box;"
                [style.borderColor]="form.get('week_start_date')?.invalid && form.get('week_start_date')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb'" />
              <p *ngIf="form.get('week_start_date')?.invalid && form.get('week_start_date')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Start date is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">Week End Date <span style="color: #dc2626;">*</span></label>
              <input type="date" formControlName="week_end_date"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: white; box-sizing: border-box;"
                [style.borderColor]="form.get('week_end_date')?.invalid && form.get('week_end_date')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb'" />
              <p *ngIf="form.get('week_end_date')?.invalid && form.get('week_end_date')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">End date is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">Kitchen</label>
              <select formControlName="kitchen_id"
                style="width: 100%; padding: 10px 32px 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: white; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; transition: all 0.2s ease; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb'">
                <option [ngValue]="null">Select Kitchen</option>
                <option *ngFor="let k of kitchens" [ngValue]="k.id">{{ k.name }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">Cut Off Hours</label>
              <input type="number" formControlName="cut_off_hours" min="1" max="168"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: white; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb'" />
              <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">Hours before the menu date to close selection</p>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 24px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #f3f4f6; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #6b7280;">description</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Description</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Optional description for this menu</p>
            </div>
          </div>
          <div>
            <textarea formControlName="description" rows="3" maxlength="1000" placeholder="Enter menu description..."
              style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: white; box-sizing: border-box; resize: vertical; font-family: inherit;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb'"></textarea>
            <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0; text-align: right;">{{ form.get('description')?.value?.length || 0 }}/1000</p>
          </div>
        </div>

        <div *ngIf="isEditing" style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 24px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #f3f4f6; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #6b7280;">settings</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Status</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Current menu status</p>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="display: inline-flex; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 700;"
              [style.background]="currentStatus === 'published' ? '#d1fae5' : currentStatus === 'draft' ? '#fef3c7' : '#f3f4f6'"
              [style.color]="currentStatus === 'published' ? '#047857' : currentStatus === 'draft' ? '#b45309' : '#6b7280'">
              {{ currentStatus | titlecase }}
            </span>
            <span *ngIf="currentStatus === 'published'" style="font-size: 12px; color: #9ca3af;">To change status, use the Publish/Unpublish actions from the menu detail page.</span>
            <select *ngIf="currentStatus !== 'published'" formControlName="status"
              style="padding: 8px 32px 8px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: white; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 140px; transition: all 0.2s ease;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb'">
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </form>
    </div>

    <div style="position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 1px solid #e5e7eb; padding: 12px 24px; z-index: 100; display: flex; align-items: center; justify-content: flex-end; gap: 10px; box-shadow: 0 -4px 20px rgba(0,0,0,0.06);">
      <a routerLink="/admin/weekly-menus"
        style="padding: 10px 24px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; text-decoration: none; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 6px;"
        onmouseover="this.style.borderColor='#9ca3af'" onmouseout="this.style.borderColor='#e5e7eb'">Cancel</a>
      <button (click)="onSubmit()" [disabled]="form.invalid || saving"
        style="padding: 10px 28px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; border: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
        [style.opacity]="form.invalid || saving ? '0.6' : '1'"
        [style.cursor]="form.invalid || saving ? 'not-allowed' : 'pointer'"
        onmouseover="if(!(this.disabled)){this.style.background='#047857';this.style.transform='translateY(-1px)'}" onmouseout="this.style.background='#059669';this.style.transform=''">
        <div *ngIf="saving" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        {{ isEditing ? 'Update Menu' : 'Create Menu' }}
      </button>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class WeeklyMenuFormComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private weeklyMenuApi = inject(WeeklyMenuApiService);
  private kitchenApi = inject(KitchenApiService);
  private notification = inject(NotificationService);

  isEditing = false;
  saving = false;
  menuUuid = '';
  menuTitle = '';
  currentStatus = 'draft';

  kitchens: any[] = [];

  form = this.fb.group({
    title: ['', Validators.required],
    description: [null as string | null],
    week_start_date: [null as Date | null, Validators.required],
    week_end_date: [null as Date | null, Validators.required],
    kitchen_id: [null as number | null],
    cut_off_hours: [12],
    status: ['draft'],
  });

  ngOnInit(): void {
    this.menuUuid = this.route.snapshot.paramMap.get('uuid') || '';
    this.isEditing = !!this.menuUuid;
    this.loadKitchens();
    if (this.isEditing) { this.loadMenu(); }
  }

  loadKitchens(): void {
    this.kitchenApi.getAll().subscribe({ next: (res) => { this.kitchens = res.data || []; } });
  }

  loadMenu(): void {
    this.weeklyMenuApi.getWeeklyMenu(this.menuUuid).subscribe({
      next: (res) => {
        const m = res.data!;
        this.menuTitle = m.title;
        this.currentStatus = m.status;
        this.form.patchValue({
          title: m.title,
          description: m.description,
          week_start_date: m.week_start_date ? new Date(m.week_start_date) : null,
          week_end_date: m.week_end_date ? new Date(m.week_end_date) : null,
          kitchen_id: m.kitchen_id || null,
          cut_off_hours: m.cut_off_hours,
          status: m.status,
        });
      },
      error: () => { this.notification.error('Failed to load menu'); this.router.navigate(['/admin/weekly-menus']); },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const formValue = this.form.value;
    const data: any = {
      title: formValue.title,
      description: formValue.description,
      week_start_date: this.formatDate(formValue.week_start_date),
      week_end_date: this.formatDate(formValue.week_end_date),
      kitchen_id: formValue.kitchen_id,
      cut_off_hours: formValue.cut_off_hours,
      status: formValue.status,
    };

    const obs = this.isEditing
      ? this.weeklyMenuApi.updateWeeklyMenu(this.menuUuid, data)
      : this.weeklyMenuApi.createWeeklyMenu(data);

    obs.subscribe({
      next: (res) => {
        this.notification.success(this.isEditing ? 'Menu updated' : 'Menu created');
        const uuid = res.data?.uuid || this.menuUuid;
        this.router.navigate(['/admin/weekly-menus', uuid]);
      },
      error: (err) => { this.saving = false; this.notification.error(err.error?.message || 'Operation failed'); },
    });
  }

  private formatDate(date: Date | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'published': return 'bg-emerald-100 text-emerald-700';
      case 'draft': return 'bg-amber-100 text-amber-700';
      case 'archived': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
