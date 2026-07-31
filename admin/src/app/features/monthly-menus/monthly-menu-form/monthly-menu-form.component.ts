import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MonthlyMenuApiService } from '../../../core/services/monthly-menu-api.service';
import { MenuTemplateApiService } from '../../../core/services/menu-template-api.service';
import { KitchenApiService } from '../../../core/services/kitchen-api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-monthly-menu-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 900px; margin: 0 auto; position: relative; z-index: 2;">
        <a routerLink="/admin/monthly-menus" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
          onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
          <span class="material-icons" style="font-size: 16px;">arrow_back</span>
          Back to Monthly Menus
        </a>
        <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">
          <span *ngIf="isEditing">Edit Monthly Menu</span>
          <span *ngIf="!isEditing">Create Monthly Menu</span>
        </h1>
        <p *ngIf="isEditing && menuTitle" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Editing <strong style="color: white;">{{ menuTitle }}</strong></p>
        <p *ngIf="!isEditing" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Set up a monthly menu by selecting the period and adding a template</p>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 900px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">info</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Basic Information</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Menu title, period, and configuration</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Menu Title <span style="color: #dc2626;">*</span></label>
              <input formControlName="title" placeholder="e.g. July 2026 Menu" maxlength="255"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="form.get('title')?.invalid && form.get('title')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="form.get('title')?.invalid && form.get('title')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Title is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Month <span style="color: #dc2626;">*</span></label>
              <select formControlName="month"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option *ngFor="let m of monthOptions" [value]="m.value">{{ m.label }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Year <span style="color: #dc2626;">*</span></label>
              <select formControlName="year"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option *ngFor="let y of yearOptions" [value]="y">{{ y }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Kitchen</label>
              <select formControlName="kitchen_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">Select Kitchen</option>
                <option *ngFor="let k of kitchens" [value]="k.id">{{ k.name }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Menu Template</label>
              <select formControlName="menu_template_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">None</option>
                <option *ngFor="let t of menuTemplates" [value]="t.id">{{ t.template_name }}</option>
              </select>
              <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">Optional template to base this menu on</p>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #f3e8ff; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #7c3aed;">description</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Description</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Optional description for this menu</p>
            </div>
          </div>
          <div>
            <textarea formControlName="description" rows="3" maxlength="1000" placeholder="Brief description of this monthly menu"
              style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; resize: vertical;"
              onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
              onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
            <p style="font-size: 11px; color: #9ca3af; text-align: right; margin: 4px 0 0 0;">{{ (form.get('description')?.value || '').length }}/1000</p>
          </div>
        </div>

        <div *ngIf="isEditing" style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
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
              [style.background]="currentStatus === 'published' ? '#d1fae5' : currentStatus === 'approved' ? '#dbeafe' : currentStatus === 'draft' ? '#fef3c7' : '#f3f4f6'"
              [style.color]="currentStatus === 'published' ? '#047857' : currentStatus === 'approved' ? '#1d4ed8' : currentStatus === 'draft' ? '#b45309' : '#6b7280'">
              {{ currentStatus | titlecase }}
            </span>
            <span *ngIf="currentStatus === 'published' || currentStatus === 'approved'" style="font-size: 12px; color: #9ca3af;">To change status, use the actions from the menu detail page.</span>
            <select *ngIf="currentStatus !== 'published' && currentStatus !== 'approved'" formControlName="status"
              style="padding: 8px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer;"
              onfocus="this.style.borderColor='#059669'" onblur="this.style.borderColor='#e5e7eb'">
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div style="position: sticky; bottom: 16px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">Fields marked with * are required</p>
          <div style="display: flex; align-items: center; gap: 10px;">
            <a routerLink="/admin/monthly-menus"
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
              <span *ngIf="isEditing">Update Menu</span>
              <span *ngIf="!isEditing">Create Menu</span>
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
export class MonthlyMenuFormComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private monthlyMenuApi = inject(MonthlyMenuApiService);
  private menuTemplateApi = inject(MenuTemplateApiService);
  private kitchenApi = inject(KitchenApiService);
  private notification = inject(NotificationService);

  isEditing = false;
  saving = false;
  menuUuid = '';
  menuTitle = '';
  currentStatus = 'draft';

  kitchens: any[] = [];
  menuTemplates: any[] = [];

  monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  yearOptions = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

  form = this.fb.group({
    title: ['', Validators.required],
    description: [null as string | null],
    month: [new Date().getMonth() + 1, Validators.required],
    year: [new Date().getFullYear(), Validators.required],
    kitchen_id: [null as number | null],
    menu_template_id: [null as number | null],
    status: ['draft'],
  });

  ngOnInit(): void {
    this.menuUuid = this.route.snapshot.paramMap.get('uuid') || '';
    this.isEditing = !!this.menuUuid;
    this.loadKitchens();
    this.loadMenuTemplates();
    if (this.isEditing) { this.loadMenu(); }
  }

  loadKitchens(): void {
    this.kitchenApi.getAll().subscribe({ next: (res) => { this.kitchens = res.data || []; } });
  }

  loadMenuTemplates(): void {
    this.menuTemplateApi.getMenuTemplates().subscribe({ next: (res) => { this.menuTemplates = res.data || []; } });
  }

  loadMenu(): void {
    this.monthlyMenuApi.getMonthlyMenu(this.menuUuid).subscribe({
      next: (res) => {
        const m = res.data!;
        this.menuTitle = m.title;
        this.currentStatus = m.status;
        this.form.patchValue({
          title: m.title,
          description: m.description,
          month: m.month,
          year: m.year,
          kitchen_id: m.kitchen_id || null,
          menu_template_id: m.menu_template_id || null,
          status: m.status,
        });
      },
      error: () => { this.notification.error('Failed to load menu'); this.router.navigate(['/admin/monthly-menus']); },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const formValue = this.form.value;
    const data: any = {
      title: formValue.title,
      description: formValue.description,
      month: formValue.month,
      year: formValue.year,
      kitchen_id: formValue.kitchen_id,
      menu_template_id: formValue.menu_template_id,
      status: formValue.status,
    };

    const obs = this.isEditing
      ? this.monthlyMenuApi.updateMonthlyMenu(this.menuUuid, data)
      : this.monthlyMenuApi.createMonthlyMenu(data);

    obs.subscribe({
      next: (res) => {
        this.notification.success(this.isEditing ? 'Menu updated' : 'Menu created');
        const uuid = res.data?.uuid || this.menuUuid;
        this.router.navigate(['/admin/monthly-menus', uuid]);
      },
      error: (err) => { this.saving = false; this.notification.error(err.error?.message || 'Operation failed'); },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'published': return 'bg-emerald-100 text-emerald-700';
      case 'approved': return 'bg-blue-100 text-blue-700';
      case 'draft': return 'bg-amber-100 text-amber-700';
      case 'archived': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
