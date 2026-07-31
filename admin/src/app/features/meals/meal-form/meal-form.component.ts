import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MealApiService } from '../../../core/services/meal-api.service';
import { MealCategoryApiService } from '../../../core/services/meal-category-api.service';
import { MealTypeApiService } from '../../../core/services/meal-type-api.service';
import { KitchenApiService } from '../../../core/services/kitchen-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MealCategory } from '../../../core/models/meal/meal-category.model';

@Component({
  selector: 'app-meal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 900px; margin: 0 auto; position: relative; z-index: 2;">
        <a routerLink="/admin/meals" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
          onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
          <span class="material-icons" style="font-size: 16px;">arrow_back</span>
          Back to Meals
        </a>
        <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">
          <span *ngIf="isEditing">Edit Meal</span>
          <span *ngIf="!isEditing">Create New Meal</span>
        </h1>
        <p *ngIf="isEditing && mealName" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Editing <strong style="color: white;">{{ mealName }}</strong></p>
        <p *ngIf="!isEditing" style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Fill in the details below to create a new meal</p>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 900px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #dbeafe; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #2563eb;">restaurant</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Basic Information</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Meal code, name, category and type</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Meal Code <span style="color: #dc2626;">*</span></label>
              <input formControlName="meal_code" placeholder="e.g. ML-001" maxlength="50"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="form.get('meal_code')?.invalid && form.get('meal_code')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="form.get('meal_code')?.invalid && form.get('meal_code')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Meal code is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Meal Name <span style="color: #dc2626;">*</span></label>
              <input formControlName="name" placeholder="e.g. Butter Chicken" maxlength="255" (ngModelChange)="onNameChange($event)"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="form.get('name')?.invalid && form.get('name')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="form.get('name')?.invalid && form.get('name')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Meal name is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Slug</label>
              <input formControlName="slug" placeholder="auto-generated"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">Auto-generated from name</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Category <span style="color: #dc2626;">*</span></label>
              <select formControlName="category_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                [style.borderColor]="form.get('category_id')?.invalid && form.get('category_id')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">Select Category</option>
                <option *ngFor="let cat of categories" [ngValue]="cat.id">{{ cat.name }}</option>
              </select>
              <p *ngIf="form.get('category_id')?.invalid && form.get('category_id')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Category is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Meal Type <span style="color: #dc2626;">*</span></label>
              <select formControlName="meal_type_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                [style.borderColor]="form.get('meal_type_id')?.invalid && form.get('meal_type_id')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">Select Meal Type</option>
                <option *ngFor="let mt of mealTypes" [ngValue]="mt.id">{{ mt.name }}</option>
              </select>
              <p *ngIf="form.get('meal_type_id')?.invalid && form.get('meal_type_id')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Meal type is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Kitchen <span style="color: #dc2626;">*</span></label>
              <select formControlName="kitchen_id"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                [style.borderColor]="form.get('kitchen_id')?.invalid && form.get('kitchen_id')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">Select Kitchen</option>
                <option *ngFor="let k of kitchens" [ngValue]="k.id">{{ k.name }}</option>
              </select>
              <p *ngIf="form.get('kitchen_id')?.invalid && form.get('kitchen_id')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Kitchen is required</p>
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
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Meal descriptions, ingredients and allergens</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Short Description</label>
              <textarea formControlName="short_description" rows="2" maxlength="500" placeholder="Brief description of this meal"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; resize: vertical;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
              <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0; text-align: right;">{{ form.get('short_description')?.value?.length || 0 }}/500</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Full Description</label>
              <textarea formControlName="description" rows="5" maxlength="10000" placeholder="Complete meal description"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; resize: vertical;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
              <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0; text-align: right;">{{ form.get('description')?.value?.length || 0 }}/10000</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Ingredients</label>
              <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
                <span *ngFor="let tag of ingredients; let i = index" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 500; background: #dbeafe; color: #1d4ed8;">
                  {{ tag }}
                  <button type="button" (click)="removeIngredient(i)" style="line-height: 0; background: none; border: none; cursor: pointer; padding: 0; color: inherit;">
                    <span class="material-icons" style="font-size: 14px;">close</span>
                  </button>
                </span>
              </div>
              <input #ingredientInput (keyup.enter)="addIngredient(ingredientInput)" placeholder="Add ingredient (press Enter)"
                style="width: 100%; padding: 9px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Allergens</label>
              <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
                <span *ngFor="let tag of allergens; let i = index" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 500; background: #fecaca; color: #dc2626;">
                  {{ tag }}
                  <button type="button" (click)="removeAllergen(i)" style="line-height: 0; background: none; border: none; cursor: pointer; padding: 0; color: inherit;">
                    <span class="material-icons" style="font-size: 14px;">close</span>
                  </button>
                </span>
              </div>
              <input #allergenInput (keyup.enter)="addAllergen(allergenInput)" placeholder="Add allergen (press Enter)"
                style="width: 100%; padding: 9px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">monitor_weight</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Nutrition &amp; Serving</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Serving details and nutritional information</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Serving Size</label>
              <input formControlName="serving_size" placeholder="e.g. 250g"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Unit</label>
              <select formControlName="unit"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option [ngValue]="null">Select Unit</option>
                <option value="plate">Plate</option>
                <option value="bowl">Bowl</option>
                <option value="piece">Piece</option>
                <option value="glass">Glass</option>
                <option value="portion">Portion</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Preparation Time (min)</label>
              <input formControlName="preparation_time" type="number" min="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
          </div>
          <div style="margin: 20px 0;">
            <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 10px;">Spice Level</label>
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
              <label style="display: inline-flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px; color: #374151;">
                <input type="radio" formControlName="spice_level" [value]="0" style="width: 16px; height: 16px; accent-color: #059669; margin: 0;" /> None
              </label>
              <label style="display: inline-flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px; color: #374151;">
                <input type="radio" formControlName="spice_level" [value]="1" style="width: 16px; height: 16px; accent-color: #059669; margin: 0;" /> Mild
              </label>
              <label style="display: inline-flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px; color: #374151;">
                <input type="radio" formControlName="spice_level" [value]="2" style="width: 16px; height: 16px; accent-color: #059669; margin: 0;" /> Medium
              </label>
              <label style="display: inline-flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px; color: #374151;">
                <input type="radio" formControlName="spice_level" [value]="3" style="width: 16px; height: 16px; accent-color: #059669; margin: 0;" /> Hot
              </label>
              <label style="display: inline-flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px; color: #374151;">
                <input type="radio" formControlName="spice_level" [value]="4" style="width: 16px; height: 16px; accent-color: #059669; margin: 0;" /> Very Hot
              </label>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Calories (kcal)</label>
              <input formControlName="calories" type="number" min="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Protein (g)</label>
              <input formControlName="protein" type="number" min="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Carbs (g)</label>
              <input formControlName="carbohydrates" type="number" min="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Fat (g)</label>
              <input formControlName="fat" type="number" min="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Fiber (g)</label>
              <input formControlName="fiber" type="number" min="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Sugar (g)</label>
              <input formControlName="sugar" type="number" min="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Sodium (mg)</label>
              <input formControlName="sodium" type="number" min="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #fef3c7; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #d97706;">paid</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Pricing</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Meal pricing and tax information</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Price <span style="color: #dc2626;">*</span></label>
              <input formControlName="price" type="number" min="0" step="0.01"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="form.get('price')?.invalid && form.get('price')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="form.get('price')?.invalid && form.get('price')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Price is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Offer Price</label>
              <input formControlName="offer_price" type="number" min="0" step="0.01"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Cost Price</label>
              <input formControlName="cost_price" type="number" min="0" step="0.01"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Tax %</label>
              <input formControlName="tax_percentage" type="number" min="0" max="100" step="0.01"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #cffafe; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #0891b2;">schedule</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Display &amp; Availability</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Display order and availability settings</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Display Order</label>
              <input formControlName="display_order" type="number" min="0"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Availability Type</label>
              <select formControlName="availability_type"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="all_day">All Day</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snacks">Snacks</option>
                <option value="special">Special</option>
                <option value="festival">Festival</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
          <div *ngIf="form.get('availability_type')?.value === 'custom'" style="margin-top: 16px;">
            <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 10px;">Availability Slots</label>
            <div style="display: flex; flex-wrap: wrap; gap: 16px;">
              <label *ngFor="let slot of availabilitySlotOptions" style="display: inline-flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px; color: #374151;">
                <input type="checkbox" [checked]="selectedSlots.includes(slot)" (change)="toggleSlot(slot, $any($event.target).checked)" style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px; margin: 0;" />
                {{ slot }}
              </label>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #fce7f3; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #db2777;">flag</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Flags</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Mark meal as featured, recommended, etc.</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
            <label style="display: inline-flex; align-items: center; gap: 10px; cursor: pointer; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 10px; transition: all 0.15s ease;"
              onmouseover="this.style.borderColor='#d1fae5';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background=''">
              <input type="checkbox" formControlName="is_featured" style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px; margin: 0;" />
              <span style="font-size: 13px; color: #374151;">Featured</span>
            </label>
            <label style="display: inline-flex; align-items: center; gap: 10px; cursor: pointer; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 10px; transition: all 0.15s ease;"
              onmouseover="this.style.borderColor='#d1fae5';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background=''">
              <input type="checkbox" formControlName="is_recommended" style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px; margin: 0;" />
              <span style="font-size: 13px; color: #374151;">Recommended</span>
            </label>
            <label style="display: inline-flex; align-items: center; gap: 10px; cursor: pointer; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 10px; transition: all 0.15s ease;"
              onmouseover="this.style.borderColor='#d1fae5';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background=''">
              <input type="checkbox" formControlName="is_new" style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px; margin: 0;" />
              <span style="font-size: 13px; color: #374151;">New</span>
            </label>
            <label style="display: inline-flex; align-items: center; gap: 10px; cursor: pointer; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 10px; transition: all 0.15s ease;"
              onmouseover="this.style.borderColor='#d1fae5';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background=''">
              <input type="checkbox" formControlName="is_bestseller" style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px; margin: 0;" />
              <span style="font-size: 13px; color: #374151;">Bestseller</span>
            </label>
            <label style="display: inline-flex; align-items: center; gap: 10px; cursor: pointer; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 10px; transition: all 0.15s ease;"
              onmouseover="this.style.borderColor='#d1fae5';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background=''">
              <input type="checkbox" formControlName="is_customizable" style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px; margin: 0;" />
              <span style="font-size: 13px; color: #374151;">Customizable</span>
            </label>
            <label style="display: inline-flex; align-items: center; gap: 10px; cursor: pointer; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 10px; transition: all 0.15s ease;"
              onmouseover="this.style.borderColor='#d1fae5';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background=''">
              <input type="checkbox" formControlName="requires_preparation" style="width: 16px; height: 16px; accent-color: #059669; border-radius: 4px; margin: 0;" />
              <span style="font-size: 13px; color: #374151;">Requires Preparation</span>
            </label>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #f3f4f6; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #6b7280;">qr_code</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Identifiers</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Barcode, SKU and HSN code</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Barcode</label>
              <input formControlName="barcode" placeholder="e.g. 8901234567890"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">SKU</label>
              <input formControlName="sku" placeholder="e.g. ML-BC-001"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">HSN Code</label>
              <input formControlName="hsn_code" placeholder="e.g. 2104"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #dbeafe; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #2563eb;">image</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Media</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Meal images and gallery</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 8px;">Main Image</label>
              <div *ngIf="imagePreview" style="position: relative; display: inline-block; margin-bottom: 12px;">
                <img [src]="imagePreview" style="width: 128px; height: 128px; object-fit: cover; border-radius: 12px; border: 1px solid #e5e7eb;" />
                <button type="button" (click)="removeImagePreview()" style="position: absolute; top: -6px; right: -6px; width: 24px; height: 24px; background: #dc2626; color: white; border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; line-height: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
                  <span class="material-icons" style="font-size: 14px;">close</span>
                </button>
              </div>
              <div (click)="imageFileInput.click()"
                style="border: 2px dashed #d1d5db; border-radius: 12px; padding: 24px; text-align: center; cursor: pointer; transition: all 0.2s ease;"
                onmouseover="this.style.borderColor='#059669';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#d1d5db';this.style.background=''">
                <span class="material-icons" style="font-size: 32px; color: #9ca3af; margin-bottom: 8px; display: block;">cloud_upload</span>
                <p style="font-size: 13px; color: #9ca3af; margin: 0;">Click to upload main image</p>
                <p style="font-size: 11px; color: #d1d5db; margin: 4px 0 0 0;">PNG, JPG up to 5MB</p>
              </div>
              <input #imageFileInput type="file" hidden accept="image/*" (change)="onImageSelected($event)" />
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 8px;">Gallery Images</label>
              <div *ngIf="galleryPreviews.length > 0" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
                <div *ngFor="let preview of galleryPreviews; let i = index" style="position: relative;">
                  <img [src]="preview" style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px; border: 1px solid #e5e7eb;" />
                  <button type="button" (click)="removeGalleryPreview(i)" style="position: absolute; top: -4px; right: -4px; width: 20px; height: 20px; background: #dc2626; color: white; border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; line-height: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
                    <span class="material-icons" style="font-size: 12px;">close</span>
                  </button>
                </div>
              </div>
              <div (click)="galleryFileInput.click()"
                style="border: 2px dashed #d1d5db; border-radius: 12px; padding: 24px; text-align: center; cursor: pointer; transition: all 0.2s ease;"
                onmouseover="this.style.borderColor='#059669';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#d1d5db';this.style.background=''">
                <span class="material-icons" style="font-size: 32px; color: #9ca3af; margin-bottom: 8px; display: block;">collections</span>
                <p style="font-size: 13px; color: #9ca3af; margin: 0;">Click to upload gallery images</p>
                <p style="font-size: 11px; color: #d1d5db; margin: 4px 0 0 0;">Multiple images allowed</p>
              </div>
              <input #galleryFileInput type="file" hidden accept="image/*" multiple (change)="onGallerySelected($event)" />
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #ccfbf1; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #0d9488;">settings</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Status &amp; Notes</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Meal status and internal notes</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Status <span style="color: #dc2626;">*</span></label>
              <select formControlName="status"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box; max-width: 300px;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Remarks</label>
              <textarea formControlName="remarks" rows="3" placeholder="Any internal notes..."
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; resize: vertical;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
            </div>
          </div>
        </div>

        <div style="position: sticky; bottom: 16px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            <span *ngIf="isEditing">Changes will be saved immediately</span>
            <span *ngIf="!isEditing">Fields marked with * are required</span>
          </p>
          <div style="display: flex; align-items: center; gap: 10px;">
            <a routerLink="/admin/meals"
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
              <span *ngIf="isEditing">Update Meal</span>
              <span *ngIf="!isEditing">Create Meal</span>
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
export class MealFormComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mealApi = inject(MealApiService);
  private categoryApi = inject(MealCategoryApiService);
  private mealTypeApi = inject(MealTypeApiService);
  private kitchenApi = inject(KitchenApiService);
  private notification = inject(NotificationService);

  isEditing = false;
  saving = false;
  mealUuid = '';
  mealName = '';

  categories: MealCategory[] = [];
  mealTypes: any[] = [];
  kitchens: any[] = [];

  ingredients: string[] = [];
  allergens: string[] = [];
  selectedSlots: string[] = [];
  availabilitySlotOptions = ['breakfast', 'lunch', 'dinner', 'snacks'];

  imageFile: File | null = null;
  imagePreview: string | null = null;
  galleryFiles: File[] = [];
  galleryPreviews: string[] = [];

  form = this.fb.group({
    meal_code: ['', Validators.required],
    name: ['', Validators.required],
    slug: [''],
    category_id: [null as number | null, Validators.required],
    meal_type_id: [null as number | null, Validators.required],
    kitchen_id: [null as number | null, Validators.required],
    short_description: [null as string | null],
    description: [null as string | null],
    spice_level: [0],
    serving_size: [null as string | null],
    unit: [null as string | null],
    barcode: [null as string | null],
    sku: [null as string | null],
    hsn_code: [null as string | null],
    preparation_time: [0],
    calories: [0],
    protein: [0],
    carbohydrates: [0],
    fat: [0],
    fiber: [0],
    sugar: [0],
    sodium: [0],
    price: [null as number | null, Validators.required],
    offer_price: [null as number | null],
    cost_price: [null as number | null],
    tax_percentage: [0],
    display_order: [0],
    availability_type: ['all_day'],
    is_featured: [false],
    is_recommended: [false],
    is_new: [false],
    is_bestseller: [false],
    is_customizable: [false],
    requires_preparation: [false],
    status: ['active', Validators.required],
    remarks: [null as string | null],
  });

  ngOnInit(): void {
    this.mealUuid = this.route.snapshot.paramMap.get('uuid') || '';
    this.isEditing = !!this.mealUuid;
    this.loadDropdowns();
    if (this.isEditing) { this.loadMeal(); }
  }

  loadDropdowns(): void {
    this.categoryApi.getAll().subscribe({ next: (res) => { this.categories = res.data || []; } });
    this.mealTypeApi.getAll().subscribe({ next: (res) => { this.mealTypes = res.data || []; } });
    this.kitchenApi.getAll().subscribe({ next: (res) => { this.kitchens = res.data || []; } });
  }

  onNameChange(value: string): void {
    if (!this.isEditing || !this.form.get('slug')?.value) {
      const slug = value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
      this.form.patchValue({ slug });
    }
  }

  addIngredient(input: HTMLInputElement): void {
    const val = input.value.trim();
    if (val && !this.ingredients.includes(val)) { this.ingredients.push(val); }
    input.value = '';
  }

  removeIngredient(index: number): void { this.ingredients.splice(index, 1); }

  addAllergen(input: HTMLInputElement): void {
    const val = input.value.trim();
    if (val && !this.allergens.includes(val)) { this.allergens.push(val); }
    input.value = '';
  }

  removeAllergen(index: number): void { this.allergens.splice(index, 1); }

  toggleSlot(slot: string, checked: boolean): void {
    if (checked) { this.selectedSlots.push(slot); } else { this.selectedSlots = this.selectedSlots.filter(s => s !== slot); }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.imageFile = input.files[0];
    const reader = new FileReader();
    reader.onload = () => { this.imagePreview = reader.result as string; };
    reader.readAsDataURL(this.imageFile);
  }

  removeImagePreview(): void { this.imageFile = null; this.imagePreview = null; }

  onGallerySelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    for (let i = 0; i < input.files.length; i++) {
      this.galleryFiles.push(input.files[i]);
      const reader = new FileReader();
      reader.onload = () => { this.galleryPreviews.push(reader.result as string); };
      reader.readAsDataURL(input.files[i]);
    }
    input.value = '';
  }

  removeGalleryPreview(index: number): void { this.galleryPreviews.splice(index, 1); this.galleryFiles.splice(index, 1); }

  loadMeal(): void {
    this.mealApi.getById(this.mealUuid).subscribe({
      next: (res) => {
        const m = res.data!;
        this.mealName = m.name;
        this.ingredients = m.ingredients || [];
        this.allergens = m.allergens || [];
        this.selectedSlots = m.availability_slots || [];
        if (m.meal_image) {
          this.imagePreview = m.meal_image;
        }
        if (m.gallery && m.gallery.length > 0) {
          this.galleryPreviews = [...m.gallery];
        }
        this.form.patchValue({
          meal_code: m.meal_code, name: m.name, slug: m.slug,
          category_id: m.category?.id || m.category_id || null,
          meal_type_id: m.meal_type?.id || m.meal_type_id || null,
          kitchen_id: m.kitchen?.id || m.kitchen_id || null,
          short_description: m.short_description, description: m.description,
          spice_level: m.spice_level, serving_size: m.serving_size, unit: m.unit,
          barcode: m.barcode, sku: m.sku, hsn_code: m.hsn_code,
          preparation_time: m.preparation_time, calories: m.calories, protein: m.protein,
          carbohydrates: m.carbohydrates, fat: m.fat, fiber: m.fiber, sugar: m.sugar, sodium: m.sodium,
          price: m.price, offer_price: m.offer_price, cost_price: m.cost_price, tax_percentage: m.tax_percentage,
          display_order: m.display_order, availability_type: m.availability_type,
          is_featured: m.is_featured, is_recommended: m.is_recommended, is_new: m.is_new,
          is_bestseller: m.is_bestseller, is_customizable: m.is_customizable, requires_preparation: m.requires_preparation,
          status: m.status, remarks: m.remarks,
        });
      },
      error: () => { this.notification.error('Failed to load meal'); this.router.navigate(['/admin/meals']); },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const data: any = { ...this.form.value };
    data.ingredients = this.ingredients;
    data.allergens = this.allergens;
    data.availability_slots = this.selectedSlots;

    const obs = this.isEditing ? this.mealApi.update(this.mealUuid, data) : this.mealApi.create(data);
    obs.subscribe({
      next: (res) => {
        const mealUuid = res.data?.uuid || this.mealUuid;
        if (this.imageFile && mealUuid) {
          this.mealApi.uploadImage(mealUuid, this.imageFile).subscribe({
            next: () => this.uploadGalleryAndFinish(mealUuid),
            error: () => this.uploadGalleryAndFinish(mealUuid),
          });
        } else if (this.galleryFiles.length > 0 && mealUuid) {
          this.uploadGalleryAndFinish(mealUuid);
        } else {
          this.notification.success(this.isEditing ? 'Meal updated' : 'Meal created');
          this.router.navigate(['/admin/meals']);
        }
      },
      error: (err) => { this.saving = false; this.notification.error(err.error?.message || 'Operation failed'); },
    });
  }

  private uploadGalleryAndFinish(mealUuid: string): void {
    if (this.galleryFiles.length > 0) {
      this.mealApi.uploadGallery(mealUuid, this.galleryFiles).subscribe({
        next: () => { this.notification.success(this.isEditing ? 'Meal updated' : 'Meal created'); this.router.navigate(['/admin/meals']); },
        error: () => { this.notification.success(this.isEditing ? 'Meal updated' : 'Meal created'); this.router.navigate(['/admin/meals']); },
      });
    } else {
      this.notification.success(this.isEditing ? 'Meal updated' : 'Meal created');
      this.router.navigate(['/admin/meals']);
    }
  }
}
