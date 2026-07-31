import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuTemplateApiService } from '../../../core/services/menu-template-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MenuTemplate, MenuTemplateItem } from '../../../core/models/monthly-menu/menu-template.model';

@Component({
  selector: 'app-menu-template-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading template details...</p>
      </div>
    </div>

    <div *ngIf="!loading && template" style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto;">
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
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
            <div>
              <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 8px 0 0 0;">{{ template.template_name }}</h1>
                <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                  [style.background]="template.status === 'active' ? '#d1fae5' : '#f3f4f6'"
                  [style.color]="template.status === 'active' ? '#047857' : '#6b7280'">
                  <span *ngIf="template.status === 'active'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor; margin-right: 4px;"></span>
                  {{ template.status | titlecase }}
                </span>
                <span *ngIf="template.is_default" style="padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 800; background: #fef3c7; color: #b45309; display: inline-flex; align-items: center; gap: 4px;">
                  <span class="material-icons" style="font-size: 14px;">star</span> Default
                </span>
              </div>
              <p style="color: #a7f3d0; font-size: 13px; margin: 4px 0 0 0;">
                <span *ngIf="template.kitchen_name">{{ template.kitchen_name }} &bull; </span>
                Created {{ template.created_at | date:'MMM d, yyyy' }}
              </p>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
              <button (click)="editTemplate()"
                style="padding: 8px 16px; background: white; border: 1px solid #a7f3d0; border-radius: 10px; font-size: 12px; font-weight: 600; color: #047857; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
                onmouseover="this.style.background='#ecfdf5'" onmouseout="this.style.background='white'">
                <span class="material-icons" style="font-size: 16px;">edit</span> Edit
              </button>
              <button (click)="duplicateTemplate()"
                style="padding: 8px 16px; background: white; border: 1px solid #a7f3d0; border-radius: 10px; font-size: 12px; font-weight: 600; color: #047857; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
                onmouseover="this.style.background='#ecfdf5'" onmouseout="this.style.background='white'">
                <span class="material-icons" style="font-size: 16px;">content_copy</span> Duplicate
              </button>
              <button *ngIf="!template.is_default" (click)="setDefault()"
                style="padding: 8px 16px; background: white; border: 1px solid #a7f3d0; border-radius: 10px; font-size: 12px; font-weight: 600; color: #047857; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
                onmouseover="this.style.background='#ecfdf5'" onmouseout="this.style.background='white'">
                <span class="material-icons" style="font-size: 16px;">star</span> Set Default
              </button>
              <button (click)="deleteTemplate()"
                style="padding: 8px 16px; background: white; border: 1px solid #fca5a5; border-radius: 10px; font-size: 12px; font-weight: 600; color: #dc2626; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
                onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='white'">
                <span class="material-icons" style="font-size: 16px;">delete</span> Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; padding: 0 24px;">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #059669;">restaurant</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Items</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ template.items?.length || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #047857;">kitchen</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Kitchen</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ template.kitchen_name || '-' }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #d97706;">toggle_on</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Status</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ template.status | titlecase }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #ddd6fe; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #7c3aed;">star</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Default</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ template.is_default ? 'Yes' : 'No' }}</p>
          </div>
        </div>
      </div>

      <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px; margin: 0 24px 60px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px;">
          <span class="material-icons" style="font-size: 20px; color: #059669;">list_alt</span>
          Template Items
        </h3>
        <div *ngIf="groupedItems.length > 0">
          <div *ngFor="let group of groupedItems; let first = first" style="margin-bottom: 10px;">
            <div (click)="toggleDay(group.dayName)"
              style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 12px; cursor: pointer; background: #f9fafb; transition: all 0.15s ease;"
              onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='#f9fafb'">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="material-icons" style="font-size: 18px; color: #059669;">calendar_today</span>
                <span style="font-size: 14px; font-weight: 700; color: #1f2937;">{{ group.dayName }}</span>
                <span style="font-size: 12px; color: #9ca3af; font-weight: 400;">{{ group.items.length }} item{{ group.items.length !== 1 ? 's' : '' }}</span>
              </div>
              <span class="material-icons" style="font-size: 18px; color: #9ca3af; transition: transform 0.2s ease;"
                [style.transform]="expandedDays.has(group.dayName) ? 'rotate(180deg)' : ''">expand_more</span>
            </div>
            <div *ngIf="expandedDays.has(group.dayName)" style="border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; overflow: hidden; animation: fadeIn 0.2s ease-out;">
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                  <thead>
                    <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                      <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Category</th>
                      <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Meal</th>
                      <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Type</th>
                      <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of group.items; let i = index" style="border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                      [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'">
                      <td style="padding: 10px 12px;">
                        <span style="display: inline-flex; padding: 2px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; background: #d1fae5; color: #047857;">{{ item.meal_category_name || '-' }}</span>
                      </td>
                      <td style="padding: 10px 12px; font-weight: 600; color: #1f2937;">{{ item.meal_name || '-' }}</td>
                      <td style="padding: 10px 12px; color: #6b7280;">{{ item.meal_type_name || '-' }}</td>
                      <td style="padding: 10px 12px; text-align: center; color: #6b7280;">{{ item.display_order }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div *ngIf="groupedItems.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
          <div style="width: 64px; height: 64px; border-radius: 16px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <span class="material-icons" style="font-size: 28px; color: #d1d5db;">restaurant_menu</span>
          </div>
          <h4 style="font-size: 15px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No items yet</h4>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Add meals to this template</p>
        </div>
      </div>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class MenuTemplateDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private menuTemplateApi = inject(MenuTemplateApiService);
  private notification = inject(NotificationService);

  template: MenuTemplate | null = null;
  loading = true;
  groupedItems: { dayName: string; items: MenuTemplateItem[] }[] = [];
  expandedDays = new Set<string>();

  private readonly dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) { this.loadTemplate(uuid); }
  }

  loadTemplate(uuid: string): void {
    this.menuTemplateApi.getMenuTemplate(uuid).subscribe({
      next: (res) => {
        this.template = res.data ?? null;
        this.groupItemsByDay();
        this.loading = false;
        if (this.groupedItems.length > 0) {
          this.groupedItems.forEach(g => this.expandedDays.add(g.dayName));
        }
      },
      error: () => { this.notification.error('Failed to load template'); this.router.navigate(['/admin/menu-templates']); },
    });
  }

  groupItemsByDay(): void {
    if (!this.template?.items) { this.groupedItems = []; return; }
    const map = new Map<string, MenuTemplateItem[]>();
    for (const item of this.template.items) {
      const day = item.day_name;
      if (!map.has(day)) { map.set(day, []); }
      map.get(day)!.push(item);
    }
    this.groupedItems = Array.from(map.entries())
      .sort((a, b) => this.dayOrder.indexOf(a[0]) - this.dayOrder.indexOf(b[0]))
      .map(([dayName, items]) => ({
        dayName,
        items: items.sort((a, b) => a.display_order - b.display_order),
      }));
  }

  toggleDay(dayName: string): void {
    if (this.expandedDays.has(dayName)) { this.expandedDays.delete(dayName); } else { this.expandedDays.add(dayName); }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'inactive': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  editTemplate(): void {
    if (!this.template) return;
    this.router.navigate(['/admin/menu-templates', this.template.uuid, 'edit']);
  }

  duplicateTemplate(): void {
    if (!this.template) return;
    this.menuTemplateApi.duplicateMenuTemplate(this.template.uuid).subscribe({
      next: (res) => {
        this.notification.success('Template duplicated');
        if (res.data) { this.router.navigate(['/admin/menu-templates', res.data.uuid]); }
      },
      error: (err) => this.notification.error(err.error?.message || 'Failed to duplicate template'),
    });
  }

  setDefault(): void {
    if (!this.template) return;
    this.menuTemplateApi.setDefault(this.template.uuid).subscribe({
      next: (res) => {
        this.template = res.data ?? null;
        this.groupItemsByDay();
        this.notification.success('Template set as default');
      },
      error: (err) => this.notification.error(err.error?.message || 'Failed to set default'),
    });
  }

  deleteTemplate(): void {
    if (!this.template) return;
    if (window.confirm(`Delete "${this.template.template_name}"? This action cannot be undone.`)) {
      this.menuTemplateApi.deleteMenuTemplate(this.template.uuid).subscribe({
        next: () => { this.notification.success('Template deleted'); this.router.navigate(['/admin/menu-templates']); },
        error: (err) => this.notification.error(err.error?.message || 'Failed to delete template'),
      });
    }
  }
}
