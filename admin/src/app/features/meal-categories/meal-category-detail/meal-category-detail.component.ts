import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MealCategoryApiService } from '../../../core/services/meal-category-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MealCategory } from '../../../core/models/meal/meal-category.model';

@Component({
  selector: 'app-meal-category-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading category details...</p>
      </div>
    </div>

    <div *ngIf="!loading && category" style="animation: fadeIn 0.3s ease-out;">
      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
          <a routerLink="/admin/meal-categories" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 16px;">arrow_back</span>
            Back to Meal Categories
          </a>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0;">{{ category.name }}</h1>
              <span *ngIf="category.is_default" style="padding: 4px 12px; background: rgba(255,255,255,0.2); border-radius: 8px; font-size: 11px; font-weight: 700; color: white;">
                <span class="material-icons" style="font-size: 12px; vertical-align: middle;">star</span> Default
              </span>
              <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                [style.background]="category.status === 'active' ? '#d1fae5' : '#f3f4f6'"
                [style.color]="category.status === 'active' ? '#047857' : '#6b7280'">
                <span *ngIf="category.status === 'active'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                {{ category.status_label }}
              </span>
            </div>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">{{ category.category_code }} &bull; {{ category.slug }}</p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 20px;">
            <button *ngIf="!category.is_default" (click)="setDefault()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">star</span> Set Default
            </button>
            <button (click)="toggleStatus()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">{{ category.status === 'active' ? 'pause' : 'play_arrow' }}</span>
              {{ category.status === 'active' ? 'Deactivate' : 'Activate' }}
            </button>
            <a [routerLink]="['/admin/meal-categories', category.uuid, 'edit']"
              style="padding: 8px 20px; background: white; color: #059669; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease;"
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
              onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
              <span class="material-icons" style="font-size: 18px;">edit</span> Edit
            </a>
            <button (click)="deleteMealCategory()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(220,38,38,0.3)'; this.style.borderColor='rgba(220,38,38,0.4)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'; this.style.borderColor='rgba(255,255,255,0.2)'">
              <span class="material-icons" style="font-size: 18px;">delete</span> Delete
            </button>
          </div>
        </div>
        <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
        </svg>
      </section>

      <section style="max-width: 1200px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: start;">
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #047857;">category</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Basic Information</h2>
              </div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Category Code</p>
                  <p style="font-size: 14px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ category.category_code }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Category Name</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ category.name }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Slug</p>
                  <p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ category.slug }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Display Order</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ category.display_order }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Status</p>
                  <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="category.status === 'active' ? '#d1fae5' : '#f3f4f6'"
                    [style.color]="category.status === 'active' ? '#047857' : '#6b7280'">
                    <span *ngIf="category.status === 'active'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                    {{ category.status_label }}
                  </span>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Default</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ category.is_default ? 'Yes' : 'No' }}</p>
                </div>
                <div style="grid-column: 1 / -1;">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Description</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ category.description || '-' }}</p>
                </div>
                <div style="grid-column: 1 / -1;">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Remarks</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ category.remarks || '-' }}</p>
                </div>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #7c3aed;">palette</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Appearance</h2>
              </div>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Icon</p>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span *ngIf="category.icon" style="width: 36px; height: 36px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
                      <span class="material-icons" style="font-size: 18px; color: #059669;">{{ category.icon }}</span>
                    </span>
                    <span style="font-size: 13px; font-weight: 600; color: #1f2937;">{{ category.icon || '-' }}</span>
                  </div>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Image</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ category.image || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Color Code</p>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span *ngIf="category.color_code" style="width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.06);" [style.background]="category.color_code"></span>
                    <span style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937;">{{ category.color_code || '-' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #9ca3af;">info</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Metadata</h2>
              </div>
              <div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Status</p>
                  <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="category.status === 'active' ? '#d1fae5' : '#f3f4f6'"
                    [style.color]="category.status === 'active' ? '#047857' : '#6b7280'">
                    <span *ngIf="category.status === 'active'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                    {{ category.status_label }}
                  </span>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Default Category</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ category.is_default ? 'Yes' : 'No' }}</p>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Created</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ category.created_at | date:'MMM d, y, h:mm a' }}</p>
                </div>
                <div style="padding: 10px 0;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Last Updated</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ category.updated_at | date:'MMM d, y, h:mm a' }}</p>
                </div>
                <div *ngIf="category.created_by_name" style="padding: 10px 0 0; border-top: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Created By</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ category.created_by_name }}</p>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #047857;">bolt</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Quick Actions</h2>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <a [routerLink]="['/admin/meal-categories', category.uuid, 'edit']"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-decoration: none; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #047857;">edit</span> Edit Category
                </a>
                <button *ngIf="!category.is_default" (click)="setDefault()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #d97706;">star</span> Set as Default
                </button>
                <button (click)="toggleStatus()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="font-size: 18px;" [style.color]="category.status === 'active' ? '#dc2626' : '#059669'">{{ category.status === 'active' ? 'pause' : 'play_arrow' }}</span>
                  {{ category.status === 'active' ? 'Deactivate' : 'Activate' }}
                </button>
                <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                <button *ngIf="!category.is_default" (click)="deleteMealCategory()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #fecaca; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                  <span class="material-icons" style="font-size: 18px;">delete</span> Delete Category
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class MealCategoryDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mealCategoryApi = inject(MealCategoryApiService);
  private notification = inject(NotificationService);

  category: MealCategory | null = null;
  loading = true;

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.loadMealCategory(uuid);
    }
  }

  loadMealCategory(uuid: string): void {
    this.mealCategoryApi.getById(uuid).subscribe({
      next: (res) => { this.category = res.data ?? null; this.loading = false; },
      error: () => { this.notification.error('Failed to load meal category'); this.router.navigate(['/admin/meal-categories']); },
    });
  }

  setDefault(): void {
    if (!this.category) return;
    if (window.confirm(`Set "${this.category.name}" as default category?`)) {
      this.mealCategoryApi.setDefault(this.category.uuid).subscribe({
        next: (res) => { this.category = res.data ?? null; this.notification.success('Default category updated'); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  toggleStatus(): void {
    if (!this.category) return;
    const newStatus = this.category.status === 'active' ? 'inactive' : 'active';
    const label = newStatus === 'active' ? 'Activate' : 'Deactivate';
    if (window.confirm(`${label} "${this.category.name}"?`)) {
      this.mealCategoryApi.setStatus(this.category.uuid, newStatus).subscribe({
        next: (res) => { this.category = res.data ?? null; this.notification.success(`Category ${newStatus === 'active' ? 'activated' : 'deactivated'}`); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deleteMealCategory(): void {
    if (!this.category) return;
    if (this.category.is_default) {
      this.notification.error('Default category cannot be deleted');
      return;
    }
    if (window.confirm(`Delete "${this.category.name}"? This action cannot be undone.`)) {
      this.mealCategoryApi.delete(this.category.uuid).subscribe({
        next: () => { this.notification.success('Category deleted'); this.router.navigate(['/admin/meal-categories']); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }
}
