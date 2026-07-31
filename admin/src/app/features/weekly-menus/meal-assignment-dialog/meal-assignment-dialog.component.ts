import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MealApiService } from '../../../core/services/meal-api.service';
import { MealCategoryApiService } from '../../../core/services/meal-category-api.service';
import { Meal } from '../../../core/models/meal/meal.model';
import { MealCategory } from '../../../core/models/meal/meal-category.model';
import { WeeklyMenuItem } from '../../../core/models/weekly-menu/weekly-menu.model';

export interface MealAssignmentDialogData {
  weekly_menu_id: number;
  menu_date?: string;
  meal_category_id?: number | null;
  item?: WeeklyMenuItem;
  mode: 'create' | 'edit';
}

@Component({
  selector: 'app-meal-assignment-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.15s ease-out;">
      <div style="background: white; border-radius: 16px; max-width: 520px; width: 90vw; box-shadow: 0 20px 60px rgba(0,0,0,0.2);" (click)="$event.stopPropagation()">
        <div style="display: flex; align-items: center; gap: 10px; padding: 20px 24px 0;">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="font-size: 18px; color: #059669;">{{ data.mode === 'edit' ? 'edit' : 'add_circle' }}</span>
          </div>
          <h2 style="font-size: 16px; font-weight: 800; color: #166534; margin: 0;">{{ data.mode === 'edit' ? 'Edit Menu Item' : 'Add Menu Item' }}</h2>
        </div>

        <div style="padding: 20px 24px; max-height: 70vh; overflow-y: auto;">
          <form [formGroup]="form" style="display: flex; flex-direction: column; gap: 4px;">
            <div *ngIf="!data.menu_date">
              <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">Menu Date <span style="color: #dc2626;">*</span></label>
              <input type="date" formControlName="menu_date"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: white; box-sizing: border-box;"
                [style.borderColor]="form.get('menu_date')?.invalid && form.get('menu_date')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb'" />
              <p *ngIf="form.get('menu_date')?.invalid && form.get('menu_date')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Date is required</p>
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">Meal Category <span style="color: #dc2626;">*</span></label>
              <select formControlName="meal_category_id" (change)="onCategoryChange()"
                style="width: 100%; padding: 10px 32px 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: white; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; transition: all 0.2s ease; box-sizing: border-box;"
                [style.borderColor]="form.get('meal_category_id')?.invalid && form.get('meal_category_id')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb'">
                <option [ngValue]="null">Select Category</option>
                <option *ngFor="let cat of categories" [ngValue]="cat.id">{{ cat.name }}</option>
              </select>
              <p *ngIf="form.get('meal_category_id')?.invalid && form.get('meal_category_id')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Category is required</p>
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">Meal <span style="color: #dc2626;">*</span></label>
              <select formControlName="meal_id" [disabled]="loadingMeals"
                style="width: 100%; padding: 10px 32px 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: white; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; transition: all 0.2s ease; box-sizing: border-box;"
                [style.borderColor]="form.get('meal_id')?.invalid && form.get('meal_id')?.touched ? '#dc2626' : '#e5e7eb'"
                [style.opacity]="loadingMeals ? '0.6' : '1'"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb'">
                <option [ngValue]="null">{{ loadingMeals ? 'Loading meals...' : 'Select Meal' }}</option>
                <option *ngFor="let meal of filteredMeals" [ngValue]="meal.id">
                  {{ meal.name }} ({{ meal.meal_code }})
                </option>
              </select>
              <p *ngIf="form.get('meal_id')?.invalid && form.get('meal_id')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Meal is required</p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">Display Order</label>
                <input type="number" formControlName="display_order" min="0"
                  style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: white; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb'" />
              </div>
              <div>
                <label style="display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px;">Meal Limit</label>
                <input type="number" formControlName="meal_limit" min="1"
                  style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: white; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb'" />
              </div>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-top: 8px; padding: 8px 0;">
              <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: #374151; cursor: pointer;">
                <input type="checkbox" formControlName="is_default" style="width: 16px; height: 16px; accent-color: #059669; cursor: pointer; margin: 0;" />
                Default
              </label>
              <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: #374151; cursor: pointer;">
                <input type="checkbox" formControlName="is_optional" style="width: 16px; height: 16px; accent-color: #059669; cursor: pointer; margin: 0;" />
                Optional
              </label>
              <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: #374151; cursor: pointer;">
                <input type="checkbox" formControlName="is_recommended" style="width: 16px; height: 16px; accent-color: #059669; cursor: pointer; margin: 0;" />
                Recommended
              </label>
            </div>
          </form>
        </div>

        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding: 16px 24px 20px; border-top: 1px solid #f3f4f6;">
          <button (click)="onClose()"
            style="padding: 10px 24px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#9ca3af'" onmouseout="this.style.borderColor='#e5e7eb'">Cancel</button>
          <button (click)="onSave()" [disabled]="form.invalid || saving"
            style="padding: 10px 28px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; border: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            [style.opacity]="form.invalid || saving ? '0.6' : '1'"
            [style.cursor]="form.invalid || saving ? 'not-allowed' : 'pointer'"
            onmouseover="if(!(this.disabled)){this.style.background='#047857';this.style.transform='translateY(-1px)'}" onmouseout="this.style.background='#059669';this.style.transform=''">
            <div *ngIf="saving" style="width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            {{ data.mode === 'edit' ? 'Update' : 'Add' }}
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
export class MealAssignmentDialogComponent implements OnInit {
  @Input() data!: MealAssignmentDialogData;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<any>();

  private fb = inject(UntypedFormBuilder);
  private mealApi = inject(MealApiService);
  private mealCategoryApi = inject(MealCategoryApiService);

  saving = false;
  loadingMeals = false;

  categories: MealCategory[] = [];
  meals: Meal[] = [];
  filteredMeals: Meal[] = [];

  form!: UntypedFormGroup;

  ngOnInit(): void {
    const item = this.data.item;
    const menuDate = this.data.menu_date || item?.menu_date || '';
    this.form = this.fb.group({
      menu_date: [menuDate, this.data.mode === 'create' && !menuDate ? Validators.required : []],
      meal_category_id: [item?.meal_category_id ?? this.data.meal_category_id ?? null, Validators.required],
      meal_id: [item?.meal_id ?? null, Validators.required],
      display_order: [item?.display_order ?? 0],
      meal_limit: [item?.meal_limit ?? 10],
      is_default: [item?.is_default ?? false],
      is_optional: [item?.is_optional ?? false],
      is_recommended: [item?.is_recommended ?? false],
    });
    this.loadCategories();
    this.loadMeals();
  }

  loadCategories(): void {
    this.mealCategoryApi.getAll().subscribe({
      next: (res) => { this.categories = res.data || []; },
      error: () => {},
    });
  }

  loadMeals(): void {
    this.loadingMeals = true;
    this.mealApi.getAll({ status: 'active' }).subscribe({
      next: (res) => {
        this.meals = res.data || [];
        this.loadingMeals = false;
        this.onCategoryChange();
      },
      error: () => { this.loadingMeals = false; },
    });
  }

  onCategoryChange(): void {
    const categoryId = this.form.get('meal_category_id')?.value;
    if (categoryId) {
      this.filteredMeals = this.meals.filter((m) => m.category_id === categoryId);
    } else {
      this.filteredMeals = this.meals;
    }
    const currentMealId = this.form.get('meal_id')?.value;
    if (currentMealId && !this.filteredMeals.find((m) => m.id === currentMealId)) {
      this.form.patchValue({ meal_id: null });
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const formValue = this.form.value;
    const result: any = {
      weekly_menu_id: this.data.weekly_menu_id,
      menu_date: formValue.menu_date || this.data.menu_date,
      meal_category_id: formValue.meal_category_id,
      meal_id: formValue.meal_id,
      display_order: formValue.display_order,
      meal_limit: formValue.meal_limit,
      is_default: formValue.is_default,
      is_optional: formValue.is_optional,
      is_recommended: formValue.is_recommended,
    };

    setTimeout(() => {
      this.saving = false;
      this.confirm.emit(result);
    }, 100);
  }
}
