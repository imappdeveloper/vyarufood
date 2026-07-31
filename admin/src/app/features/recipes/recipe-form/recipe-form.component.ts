import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RecipeApiService } from '../../../core/services/recipe-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RECIPE_STATUSES, YIELD_UNITS, InventoryItem, Unit } from '../../../core/models/recipe/recipe.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 900px; margin: 0 auto; position: relative; z-index: 2;">
        <a routerLink="/admin/recipes" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
          onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
          <span class="material-icons" style="font-size: 16px;">arrow_back</span>
          Back to Recipes
        </a>
        <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">
          <span *ngIf="isEditMode">Edit Recipe</span>
          <span *ngIf="!isEditMode">Create Recipe</span>
        </h1>
        <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">
          <span *ngIf="isEditMode">Update recipe details and ingredients</span>
          <span *ngIf="!isEditMode">Create a new recipe with ingredients and costing</span>
        </p>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 900px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
      <form [formGroup]="recipeForm" (ngSubmit)="onSubmit()">
        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">menu_book</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Recipe Details</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Configure the recipe information</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Recipe Code <span style="color: #dc2626;">*</span></label>
              <input formControlName="recipe_code" placeholder="e.g. RCP-001" maxlength="50"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="recipeForm.get('recipe_code')?.invalid && recipeForm.get('recipe_code')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="recipeForm.get('recipe_code')?.invalid && recipeForm.get('recipe_code')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Recipe code is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Recipe Name <span style="color: #dc2626;">*</span></label>
              <input formControlName="recipe_name" placeholder="e.g. Chicken Biryani" maxlength="200"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="recipeForm.get('recipe_name')?.invalid && recipeForm.get('recipe_name')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="recipeForm.get('recipe_name')?.invalid && recipeForm.get('recipe_name')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Recipe name is required</p>
              <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0; text-align: right;">{{ recipeForm.get('recipe_name')?.value?.length || 0 }}/200</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Meal <span style="color: #dc2626;">*</span></label>
              <select formControlName="meal_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                [style.borderColor]="recipeForm.get('meal_id')?.invalid && recipeForm.get('meal_id')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">Select Meal</option>
                <option *ngFor="let m of meals" [ngValue]="m.id">{{ m.name }}</option>
              </select>
              <p *ngIf="recipeForm.get('meal_id')?.invalid && recipeForm.get('meal_id')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Meal is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Status</label>
              <select formControlName="status"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option *ngFor="let s of statuses" [ngValue]="s.value">{{ s.label }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Yield Quantity <span style="color: #dc2626;">*</span></label>
              <input formControlName="yield_quantity" type="number" min="0" step="0.01"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="recipeForm.get('yield_quantity')?.invalid && recipeForm.get('yield_quantity')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="recipeForm.get('yield_quantity')?.invalid && recipeForm.get('yield_quantity')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Yield quantity is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Yield Unit <span style="color: #dc2626;">*</span></label>
              <select formControlName="yield_unit"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                [style.borderColor]="recipeForm.get('yield_unit')?.invalid && recipeForm.get('yield_unit')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option *ngFor="let u of yieldUnits" [ngValue]="u.value">{{ u.label }}</option>
              </select>
              <p *ngIf="recipeForm.get('yield_unit')?.invalid && recipeForm.get('yield_unit')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Yield unit is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Preparation Time (minutes)</label>
              <input formControlName="preparation_time" type="number" min="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Cooking Time (minutes)</label>
              <input formControlName="cooking_time" type="number" min="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Serving Size <span style="color: #dc2626;">*</span></label>
              <input formControlName="serving_size" type="number" min="1"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="recipeForm.get('serving_size')?.invalid && recipeForm.get('serving_size')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="recipeForm.get('serving_size')?.invalid && recipeForm.get('serving_size')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Serving size is required</p>
            </div>
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Remarks</label>
              <textarea formControlName="remarks" rows="3" maxlength="1000" placeholder="Any additional notes..."
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; resize: vertical;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
              <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0; text-align: right;">{{ recipeForm.get('remarks')?.value?.length || 0 }}/1000</p>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; border-radius: 10px; background: #f3e8ff; display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="font-size: 20px; color: #7c3aed;">format_list_numbered</span>
              </div>
              <div>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Ingredients</h2>
                <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Add ingredients for this recipe</p>
              </div>
            </div>
            <button type="button" (click)="addIngredient()"
              style="padding: 8px 16px; background: white; border: 1.5px solid #a7f3d0; border-radius: 10px; font-size: 13px; font-weight: 600; color: #047857; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
              onmouseover="this.style.background='#f0fdf4'; this.style.borderColor='#059669'" onmouseout="this.style.background='white'; this.style.borderColor='#a7f3d0'">
              <span class="material-icons" style="font-size: 18px;">add</span> Add Ingredient
            </button>
          </div>

          <div *ngIf="recipeItems.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; border: 2px dashed #e5e7eb; border-radius: 12px;">
            <span class="material-icons" style="font-size: 40px; color: #d1d5db; margin-bottom: 12px;">format_list_numbered</span>
            <p style="font-size: 13px; color: #9ca3af; margin: 0 0 16px 0;">No ingredients added yet</p>
            <button type="button" (click)="addIngredient()"
              style="padding: 8px 20px; background: white; border: 1.5px solid #a7f3d0; border-radius: 10px; font-size: 13px; font-weight: 600; color: #047857; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
              onmouseover="this.style.background='#f0fdf4'; this.style.borderColor='#059669'" onmouseout="this.style.background='white'; this.style.borderColor='#a7f3d0'">
              <span class="material-icons" style="font-size: 18px;">add</span> Add First Ingredient
            </button>
          </div>

          <div *ngIf="recipeItems.length > 0" formArrayName="items">
            <div style="display: none;" class="ingredient-header">
              <span>Inventory Item</span>
              <span>Quantity</span>
              <span>Unit</span>
              <span>Wastage %</span>
              <span>Cost</span>
              <span>Order</span>
              <span>Remarks</span>
              <span></span>
            </div>
            <div *ngFor="let itemGroup of recipeItems.controls; let idx = index" [formGroupName]="idx"
              style="display: grid; grid-template-columns: 1fr 100px 100px 90px 100px 100px 120px 40px; gap: 8px; align-items: start; padding: 12px; border: 1px solid #f3f4f6; border-radius: 10px; margin-bottom: 8px; transition: background 0.2s ease;"
              onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
              <div>
                <label style="display: block; font-size: 10px; font-weight: 600; color: #9ca3af; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em;">Inventory Item</label>
                <select formControlName="inventory_item_id"
                  style="width: 100%; padding: 8px 10px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                  <option *ngFor="let item of inventoryItems" [ngValue]="item.id">{{ item.name }}</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 10px; font-weight: 600; color: #9ca3af; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em;">Qty</label>
                <input formControlName="required_quantity" type="number" min="0" step="0.01"
                  style="width: 100%; padding: 8px 10px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              </div>
              <div>
                <label style="display: block; font-size: 10px; font-weight: 600; color: #9ca3af; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em;">Unit</label>
                <select formControlName="unit_id"
                  style="width: 100%; padding: 8px 10px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                  <option *ngFor="let u of units" [ngValue]="u.id">{{ u.name }}</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 10px; font-weight: 600; color: #9ca3af; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em;">Wastage</label>
                <input formControlName="wastage_percentage" type="number" min="0" max="100" step="0.1"
                  style="width: 100%; padding: 8px 10px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              </div>
              <div>
                <label style="display: block; font-size: 10px; font-weight: 600; color: #9ca3af; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em;">Cost</label>
                <input formControlName="cost" type="number" min="0" step="0.01"
                  style="width: 100%; padding: 8px 10px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              </div>
              <div>
                <label style="display: block; font-size: 10px; font-weight: 600; color: #9ca3af; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em;">Order</label>
                <input formControlName="display_order" type="number" min="0"
                  style="width: 100%; padding: 8px 10px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              </div>
              <div>
                <label style="display: block; font-size: 10px; font-weight: 600; color: #9ca3af; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em;">Remarks</label>
                <input formControlName="remarks" maxlength="200"
                  style="width: 100%; padding: 8px 10px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              </div>
              <div style="display: flex; align-items: flex-end; padding-bottom: 2px;">
                <button type="button" (click)="removeIngredient(idx)"
                  style="width: 32px; height: 32px; border: none; background: none; cursor: pointer; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: #fca5a5; transition: all 0.15s ease; line-height: 0;"
                  onmouseover="this.style.background='#fef2f2'; this.style.color='#dc2626'" onmouseout="this.style.background=''; this.style.color='#fca5a5'">
                  <span class="material-icons" style="font-size: 18px;">delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style="position: sticky; bottom: 16px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            <span *ngIf="isEditMode">Changes will be saved immediately</span>
            <span *ngIf="!isEditMode">Fields marked with * are required</span>
          </p>
          <div style="display: flex; align-items: center; gap: 10px;">
            <a routerLink="/admin/recipes"
              style="padding: 10px 20px; background: white; color: #374151; font-weight: 600; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; border: 1.5px solid #e5e7eb; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">
              Cancel
            </a>
            <button type="submit" [disabled]="recipeForm.invalid || saving"
              style="padding: 10px 28px; background: #059669; color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3);"
              [style.opacity]="recipeForm.invalid || saving ? '0.5' : '1'"
              [style.cursor]="recipeForm.invalid || saving ? 'not-allowed' : 'pointer'"
              onmouseover="if(!this.disabled){this.style.background='#047857';this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 16px rgba(5,150,105,0.4)'}"
              onmouseout="if(!this.disabled){this.style.background='#059669';this.style.transform='';this.style.boxShadow='0 4px 12px rgba(5,150,105,0.3)'}">
              <span *ngIf="saving" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block;"></span>
              <span *ngIf="isEditMode">Update Recipe</span>
              <span *ngIf="!isEditMode">Create Recipe</span>
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
export class RecipeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recipeApi = inject(RecipeApiService);
  private notification = inject(NotificationService);
  private http = inject(HttpClient);

  recipeForm!: FormGroup;
  isEditMode = false;
  recipeUuid = '';
  saving = false;

  meals: any[] = [];
  inventoryItems: InventoryItem[] = [];
  units: Unit[] = [];
  statuses = RECIPE_STATUSES;
  yieldUnits = YIELD_UNITS;

  get recipeItems(): FormArray {
    return this.recipeForm.get('items') as FormArray;
  }

  ngOnInit(): void {
    this.buildForm();
    this.recipeUuid = this.route.snapshot.paramMap.get('uuid') || '';
    this.isEditMode = !!this.recipeUuid;
    this.loadDropdowns();
    if (this.isEditMode) { this.loadRecipe(); }
  }

  buildForm(): void {
    this.recipeForm = this.fb.group({
      recipe_code: ['', Validators.required],
      meal_id: [null, Validators.required],
      recipe_name: ['', Validators.required],
      yield_quantity: [0, [Validators.required, Validators.min(0.01)]],
      yield_unit: ['kg', Validators.required],
      preparation_time: [null],
      cooking_time: [null],
      serving_size: [1, [Validators.required, Validators.min(1)]],
      status: ['draft'],
      remarks: [''],
      items: this.fb.array([]),
    });
  }

  createIngredientGroup(): FormGroup {
    return this.fb.group({
      inventory_item_id: [null, Validators.required],
      unit_id: [null, Validators.required],
      required_quantity: [0, [Validators.required, Validators.min(0.01)]],
      wastage_percentage: [0, [Validators.min(0), Validators.max(100)]],
      cost: [0, [Validators.required, Validators.min(0)]],
      display_order: [0],
      remarks: [''],
    });
  }

  addIngredient(): void {
    this.recipeItems.push(this.createIngredientGroup());
  }

  removeIngredient(index: number): void {
    this.recipeItems.removeAt(index);
  }

  loadDropdowns(): void {
    const apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin`;
    this.http.get<any>(`${apiUrl}/meals`, { params: { per_page: '200' }, withCredentials: true }).subscribe({
      next: (res) => { this.meals = res.data || []; },
      error: () => {},
    });
    this.recipeApi.getInventoryItems().subscribe({
      next: (res) => { this.inventoryItems = res.data || []; },
      error: () => {},
    });
    this.recipeApi.getUnits().subscribe({
      next: (res) => { this.units = res.data || []; },
      error: () => {},
    });
  }

  loadRecipe(): void {
    this.recipeApi.getRecipe(this.recipeUuid).subscribe({
      next: (res) => {
        const recipe = res.data!;
        this.recipeForm.patchValue({
          recipe_code: recipe.recipe_code,
          meal_id: recipe.meal_id,
          recipe_name: recipe.recipe_name,
          yield_quantity: recipe.yield_quantity,
          yield_unit: recipe.yield_unit,
          preparation_time: recipe.preparation_time,
          cooking_time: recipe.cooking_time,
          serving_size: recipe.serving_size,
          status: recipe.status,
          remarks: recipe.remarks || '',
        });

        if (recipe.items && recipe.items.length > 0) {
          recipe.items.forEach((item) => {
            this.recipeItems.push(this.fb.group({
              inventory_item_id: [item.inventory_item_id, Validators.required],
              unit_id: [item.unit_id, Validators.required],
              required_quantity: [item.required_quantity, [Validators.required, Validators.min(0.01)]],
              wastage_percentage: [item.wastage_percentage, [Validators.min(0), Validators.max(100)]],
              cost: [item.cost, [Validators.required, Validators.min(0)]],
              display_order: [item.display_order],
              remarks: [item.remarks || ''],
            }));
          });
        }
      },
      error: () => { this.notification.error('Failed to load recipe'); this.router.navigate(['/admin/recipes']); },
    });
  }

  onSubmit(): void {
    if (this.recipeItems.length === 0) {
      this.notification.error('At least one ingredient is required');
      return;
    }

    if (this.recipeForm.invalid) return;
    this.saving = true;

    const formValue = { ...this.recipeForm.value };
    const data: Record<string, any> = {
      recipe_code: formValue.recipe_code,
      meal_id: formValue.meal_id,
      recipe_name: formValue.recipe_name,
      yield_quantity: formValue.yield_quantity,
      yield_unit: formValue.yield_unit,
      preparation_time: formValue.preparation_time || null,
      cooking_time: formValue.cooking_time || null,
      serving_size: formValue.serving_size,
      status: formValue.status,
      remarks: formValue.remarks || null,
      items: formValue.items.map((item: any) => ({
        inventory_item_id: item.inventory_item_id,
        unit_id: item.unit_id,
        required_quantity: item.required_quantity,
        wastage_percentage: item.wastage_percentage || 0,
        cost: item.cost,
        display_order: item.display_order || 0,
        remarks: item.remarks || null,
      })),
    };

    const obs = this.isEditMode
      ? this.recipeApi.updateRecipe(this.recipeUuid, data)
      : this.recipeApi.createRecipe(data);

    obs.subscribe({
      next: (res) => {
        this.notification.success(this.isEditMode ? 'Recipe updated' : 'Recipe created');
        const uuid = res.data?.uuid || this.recipeUuid;
        this.router.navigate(['/admin/recipes', uuid]);
      },
      error: (err) => { this.saving = false; this.notification.error(err.error?.message || 'Operation failed'); },
    });
  }
}
