import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuTemplateApiService } from '../../../core/services/menu-template-api.service';
import { KitchenApiService } from '../../../core/services/kitchen-api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-menu-template-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #059669 0%, #047857 50%, #166534 100%); padding: 40px 32px 0; position: relative; overflow: hidden; border-radius: 0 0 32px 32px; margin-bottom: 32px;">
        <div style="position: absolute; bottom: 0; left: 0; right: 0; line-height: 0;">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style="width: 100%; height: 40px;">
            <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="white"></path>
          </svg>
        </div>
        <div style="position: relative; z-index: 1; padding-bottom: 56px;">
          <a routerLink="/admin/menu-templates" style="display: inline-flex; align-items: center; font-size: 13px; color: #a7f3d0; text-decoration: none; margin-bottom: 12px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='#a7f3d0'">
            <span class="material-icons" style="font-size: 18px; margin-right: 4px;">arrow_back</span>
            Back to Menu Templates
          </a>
          <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 8px 0 4px 0;">
            {{ isEditing ? 'Edit Menu Template' : 'Create Menu Template' }}
          </h1>
          <p *ngIf="isEditing && templateName" style="color: #a7f3d0; font-size: 14px; margin: 0;">Editing <strong style="color: white;">{{ templateName }}</strong></p>
          <p *ngIf="!isEditing" style="color: #a7f3d0; font-size: 14px; margin: 0;">Create a reusable menu template with meals for each day</p>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" style="max-width: 720px; margin: 0 auto; padding: 0 24px 120px;">
        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 16px rgba(5,150,105,0.06)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)'">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #059669;">info</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Basic Information</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">Template name and configuration</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div style="grid-column: span 2;">
              <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 4px;">Template Name <span style="color: #dc2626;">*</span></label>
              <input type="text" formControlName="template_name" placeholder="e.g. Standard Veg Menu"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="form.get('template_name')?.invalid && form.get('template_name')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
              <p *ngIf="form.get('template_name')?.invalid && form.get('template_name')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Template name is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 4px;">Kitchen</label>
              <select formControlName="kitchen_id"
                style="width: 100%; padding: 10px 32px 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; transition: all 0.2s ease; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'">
                <option [ngValue]="null">Select Kitchen</option>
                <option *ngFor="let k of kitchens" [ngValue]="k.id">{{ k.name }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 4px;">Status</label>
              <select formControlName="status"
                style="width: 100%; padding: 10px 32px 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; transition: all 0.2s ease; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div style="margin-top: 14px;">
            <label style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; color: #374151;">
              <input type="checkbox" formControlName="is_default" style="width: 16px; height: 16px; accent-color: #059669; cursor: pointer; margin: 0;" />
              Set as default template
            </label>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 16px rgba(5,150,105,0.06)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)'">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #ddd6fe; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #7c3aed;">description</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Description</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">Optional description for this template</p>
            </div>
          </div>
          <textarea formControlName="description" rows="3" maxlength="1000" placeholder="Enter a description..."
            style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; resize: vertical; font-family: inherit;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'"></textarea>
          <div style="text-align: right; font-size: 11px; color: #9ca3af; margin-top: 4px;">{{ form.get('description')?.value?.length || 0 }}/1000</div>
        </div>
      </form>

      <div style="position: fixed; bottom: 0; left: 0; right: 0; z-index: 100; background: white; border-top: 1px solid #e5e7eb; padding: 12px 32px; box-shadow: 0 -4px 20px rgba(0,0,0,0.06);">
        <div style="max-width: 720px; margin: 0 auto; display: flex; align-items: center; justify-content: flex-end; gap: 12px;">
          <a routerLink="/admin/menu-templates"
            style="padding: 10px 24px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; text-decoration: none; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#9ca3af'" onmouseout="this.style.borderColor='#e5e7eb'">Cancel</a>
          <button (click)="onSubmit()" [disabled]="form.invalid || saving"
            style="padding: 10px 32px; background: #059669; color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            [style.opacity]="form.invalid || saving ? '0.6' : '1'"
            [style.cursor]="form.invalid || saving ? 'not-allowed' : 'pointer'"
            onmouseover="if(!this.disabled){this.style.background='#047857';this.style.transform='translateY(-1px)'}" onmouseout="if(!this.disabled){this.style.background='#059669';this.style.transform=''}">
            <div *ngIf="saving" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            {{ isEditing ? 'Update Template' : 'Create Template' }}
          </button>
        </div>
      </div>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class MenuTemplateFormComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private menuTemplateApi = inject(MenuTemplateApiService);
  private kitchenApi = inject(KitchenApiService);
  private notification = inject(NotificationService);

  isEditing = false;
  saving = false;
  templateUuid = '';
  templateName = '';

  kitchens: any[] = [];

  form = this.fb.group({
    template_name: ['', Validators.required],
    description: [null as string | null],
    kitchen_id: [null as number | null],
    is_default: [false],
    status: ['active'],
  });

  ngOnInit(): void {
    this.templateUuid = this.route.snapshot.paramMap.get('uuid') || '';
    this.isEditing = !!this.templateUuid;
    this.loadKitchens();
    if (this.isEditing) { this.loadTemplate(); }
  }

  loadKitchens(): void {
    this.kitchenApi.getAll().subscribe({ next: (res) => { this.kitchens = res.data || []; } });
  }

  loadTemplate(): void {
    this.menuTemplateApi.getMenuTemplate(this.templateUuid).subscribe({
      next: (res) => {
        const t = res.data!;
        this.templateName = t.template_name;
        this.form.patchValue({
          template_name: t.template_name,
          description: t.description || null,
          kitchen_id: t.kitchen_id || null,
          is_default: t.is_default,
          status: t.status,
        });
      },
      error: () => { this.notification.error('Failed to load template'); this.router.navigate(['/admin/menu-templates']); },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const formValue = this.form.value;
    const data: any = {
      template_name: formValue.template_name,
      description: formValue.description,
      kitchen_id: formValue.kitchen_id,
      is_default: formValue.is_default,
      status: formValue.status,
    };

    const obs = this.isEditing
      ? this.menuTemplateApi.updateMenuTemplate(this.templateUuid, data)
      : this.menuTemplateApi.createMenuTemplate(data);

    obs.subscribe({
      next: (res) => {
        this.notification.success(this.isEditing ? 'Template updated' : 'Template created');
        this.router.navigate(['/admin/menu-templates']);
      },
      error: (err) => { this.saving = false; this.notification.error(err.error?.message || 'Operation failed'); },
    });
  }
}
