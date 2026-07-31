import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExpenseApiService } from '../../../core/services/expense-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ExpenseCategory } from '../../../core/models/expense/expense.model';

@Component({
  selector: 'app-expense-category-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 900px; margin: 0 auto; position: relative; z-index: 2;">
        <a routerLink="/admin/expenses" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
          onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
          <span class="material-icons" style="font-size: 16px;">arrow_back</span>
          Back to Expenses
        </a>
        <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">
          <span *ngIf="isEdit">Edit Category</span>
          <span *ngIf="!isEdit">Create Category</span>
        </h1>
        <p *ngIf="!isEdit" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Fill in the details below to create a new expense category</p>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 900px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
      <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; padding: 80px 24px;">
        <div style="text-align: center;">
          <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
          <p style="font-size: 13px; color: #9ca3af;">Loading category...</p>
        </div>
      </div>

      <form *ngIf="!loading" [formGroup]="form" (ngSubmit)="onSubmit()">
        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">category</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Category Details</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Name, icon, color, and settings</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Category Name <span style="color: #dc2626;">*</span></label>
              <input formControlName="category_name" placeholder="e.g. Kitchen Expenses"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="form.get('category_name')?.invalid && form.get('category_name')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="form.get('category_name')?.invalid && form.get('category_name')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Category name is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Parent Category</label>
              <select formControlName="parent_category_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">None (Top Level)</option>
                <option *ngFor="let cat of parentCategories" [ngValue]="cat.id">{{ cat.category_name }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Material Icon</label>
              <input formControlName="icon" placeholder="e.g. restaurant"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">Material icon name (e.g. restaurant, payments, bolt)</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Display Order</label>
              <input type="number" formControlName="display_order" placeholder="0" min="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Color</label>
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <div *ngFor="let c of colorOptions"
                  (click)="form.get('color')?.setValue(c)"
                  style="width: 36px; height: 36px; border-radius: 10px; cursor: pointer; border: 2px solid transparent; transition: all 0.15s ease;"
                  [style.background]="c"
                  [style.borderColor]="form.get('color')?.value === c ? '#166534' : 'transparent'"
                  [style.boxShadow]="form.get('color')?.value === c ? '0 0 0 2px white, 0 0 0 4px #166534' : 'none'"
                  onmouseover="this.style.transform='scale(1.12)'" onmouseout="this.style.transform=''">
                </div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; padding-top: 4px;">
              <input type="checkbox" formControlName="is_recurring" id="is_recurring"
                style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px;" />
              <label for="is_recurring" style="font-size: 13px; color: #374151;">Recurring Category</label>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; padding-top: 4px;">
              <input type="checkbox" formControlName="is_taxable" id="is_taxable"
                style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px;" />
              <label for="is_taxable" style="font-size: 13px; color: #374151;">Taxable by Default</label>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Status</label>
              <select formControlName="status"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Remarks</label>
              <textarea formControlName="remarks" rows="2"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; resize: vertical;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
            </div>
          </div>
        </div>

        <div style="position: sticky; bottom: 16px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            <span *ngIf="isEdit">Changes will be saved immediately</span>
            <span *ngIf="!isEdit">Fields marked with * are required</span>
          </p>
          <div style="display: flex; align-items: center; gap: 10px;">
            <a routerLink="/admin/expenses"
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
              <span *ngIf="isEdit">Update Category</span>
              <span *ngIf="!isEdit">Create Category</span>
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
export class ExpenseCategoryFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private expenseApi = inject(ExpenseApiService);
  private notification = inject(NotificationService);

  form!: FormGroup;
  parentCategories: ExpenseCategory[] = [];
  isEdit = false;
  loading = false;
  saving = false;
  categoryUuid = '';

  colorOptions = [
    '#4F46E5', '#059669', '#D97706', '#DC2626', '#F59E0B',
    '#EA580C', '#0284C7', '#7C3AED', '#0891B2', '#4338CA',
    '#B45309', '#9333EA', '#16A34A', '#2563EB', '#7C2D12',
  ];

  ngOnInit(): void {
    this.form = this.fb.group({
      category_name: ['', Validators.required],
      parent_category_id: [null],
      icon: ['category'],
      color: ['#4F46E5'],
      is_recurring: [false],
      is_taxable: [true],
      status: ['active'],
      display_order: [0],
      remarks: [''],
    });

    this.loadParentCategories();

    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid && this.router.url.includes('/edit')) {
      this.isEdit = true;
      this.categoryUuid = uuid;
      this.loadCategory(uuid);
    }
  }

  loadParentCategories(): void {
    this.expenseApi.getCategories({ per_page: '100' }).subscribe({
      next: (res) => {
        this.parentCategories = this.isEdit
          ? res.data!.filter((c: ExpenseCategory) => c.uuid !== this.categoryUuid)
          : res.data!;
      },
    });
  }

  loadCategory(uuid: string): void {
    this.loading = true;
    this.expenseApi.getCategory(uuid).subscribe({
      next: (res) => {
        const c = res.data!;
        this.form.patchValue({
          category_name: c.category_name,
          parent_category_id: c.parent_category_id,
          icon: c.icon || 'category',
          color: c.color || '#4F46E5',
          is_recurring: c.is_recurring,
          is_taxable: c.is_taxable,
          status: c.status,
          display_order: c.display_order,
          remarks: c.remarks,
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notification.error('Failed to load category');
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const request = this.isEdit
      ? this.expenseApi.updateCategory(this.categoryUuid, this.form.value)
      : this.expenseApi.createCategory(this.form.value);

    request.subscribe({
      next: () => {
        this.notification.success(this.isEdit ? 'Category updated' : 'Category created');
        this.router.navigate(['/admin/expenses']);
      },
      error: () => {
        this.saving = false;
        this.notification.error('Failed to save category');
      },
    });
  }
}
