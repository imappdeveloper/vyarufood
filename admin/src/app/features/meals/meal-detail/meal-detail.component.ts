import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MealApiService } from '../../../core/services/meal-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Meal } from '../../../core/models/meal/meal.model';

@Component({
  selector: 'app-meal-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading meal details...</p>
      </div>
    </div>

    <div *ngIf="!loading && meal" style="animation: fadeIn 0.3s ease-out;">
      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
          <a routerLink="/admin/meals" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 16px;">arrow_back</span>
            Back to Meals
          </a>
          <div style="display: flex; align-items: flex-start; gap: 16px; flex-wrap: wrap;">
            <div style="width: 72px; height: 72px; border-radius: 14px; overflow: hidden; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 2px solid rgba(255,255,255,0.15);">
              <span *ngIf="!meal.meal_image && !meal.thumbnail" class="material-icons" style="font-size: 28px; color: rgba(255,255,255,0.6);">restaurant</span>
              <img *ngIf="meal.meal_image || meal.thumbnail" [src]="meal.thumbnail || meal.meal_image" [alt]="meal.name" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0;">{{ meal.name }}</h1>
                <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                  [style.background]="meal.status === 'active' ? '#d1fae5' : '#f3f4f6'"
                  [style.color]="meal.status === 'active' ? '#047857' : '#6b7280'">
                  <span *ngIf="meal.status === 'active'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor; margin-right: 2px;"></span>
                  {{ meal.status_label }}
                </span>
              </div>
              <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 4px 0 0 0;">{{ meal.meal_code }} &bull; {{ meal.category?.name || 'N/A' }} &bull; {{ meal.meal_type?.name || 'N/A' }}</p>
              <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px;">
                <span *ngIf="meal.is_featured" style="padding: 2px 10px; border-radius: 6px; font-size: 10px; font-weight: 800; background: rgba(255,255,255,0.2); color: white; text-transform: uppercase; letter-spacing: 0.03em;">Featured</span>
                <span *ngIf="meal.is_recommended" style="padding: 2px 10px; border-radius: 6px; font-size: 10px; font-weight: 800; background: rgba(255,255,255,0.2); color: white; text-transform: uppercase; letter-spacing: 0.03em;">Recommended</span>
                <span *ngIf="meal.is_new" style="padding: 2px 10px; border-radius: 6px; font-size: 10px; font-weight: 800; background: rgba(255,255,255,0.2); color: white; text-transform: uppercase; letter-spacing: 0.03em;">New</span>
                <span *ngIf="meal.is_bestseller" style="padding: 2px 10px; border-radius: 6px; font-size: 10px; font-weight: 800; background: rgba(255,255,255,0.2); color: white; text-transform: uppercase; letter-spacing: 0.03em;">Bestseller</span>
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 20px;">
            <button (click)="toggleStatus()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">{{ meal.status === 'active' ? 'pause' : 'play_arrow' }}</span>
              {{ meal.status === 'active' ? 'Deactivate' : 'Activate' }}
            </button>
            <button (click)="duplicateMeal()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">content_copy</span> Duplicate
            </button>
            <a [routerLink]="['/admin/meals', meal.uuid, 'edit']"
              style="padding: 8px 20px; background: white; color: #059669; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease;"
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
              onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
              <span class="material-icons" style="font-size: 18px;">edit</span> Edit
            </a>
            <button (click)="deleteMeal()"
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
                <span class="material-icons" style="font-size: 18px; color: #2563eb;">restaurant</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Basic Information</h2>
              </div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Meal Code</p>
                  <p style="font-size: 14px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ meal.meal_code }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Name</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ meal.name }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Slug</p>
                  <p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ meal.slug }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Category</p>
                  <span style="display: inline-flex; padding: 2px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; background: #d1fae5; color: #047857;">{{ meal.category?.name || '-' }}</span>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Meal Type</p>
                  <span style="display: inline-flex; padding: 2px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; background: #f3e8ff; color: #7c3aed;">{{ meal.meal_type?.name || '-' }}</span>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Kitchen</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ meal.kitchen?.name || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">SKU</p>
                  <p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ meal.sku || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Barcode</p>
                  <p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ meal.barcode || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">HSN Code</p>
                  <p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ meal.hsn_code || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Spice Level</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ meal.spice_level_label || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Serving Size</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ meal.serving_size || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Unit</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; text-transform: capitalize; margin: 0;">{{ meal.unit || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Prep Time</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ meal.preparation_time }} min</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Display Order</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ meal.display_order }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Availability</p>
                  <span style="display: inline-flex; padding: 2px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; background: #cffafe; color: #0891b2;">{{ meal.availability_type_label || meal.availability_type }}</span>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #7c3aed;">monitor_weight</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Nutrition</h2>
              </div>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Calories</p>
                  <p style="font-size: 14px; font-weight: 700; color: #ea580c; margin: 0 0 8px 0;">{{ meal.calories }} kcal</p>
                  <div style="height: 8px; border-radius: 4px; background: #f3f4f6; overflow: hidden;">
                    <div style="height: 100%; border-radius: 4px; background: #fb923c; transition: width 0.5s ease;" [style.width.%]="getNutritionPercent(meal.calories, 2000)"></div>
                  </div>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Protein</p>
                  <p style="font-size: 14px; font-weight: 700; color: #dc2626; margin: 0 0 8px 0;">{{ meal.protein }}g</p>
                  <div style="height: 8px; border-radius: 4px; background: #f3f4f6; overflow: hidden;">
                    <div style="height: 100%; border-radius: 4px; background: #f87171; transition: width 0.5s ease;" [style.width.%]="getNutritionPercent(meal.protein, 50)"></div>
                  </div>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Carbs</p>
                  <p style="font-size: 14px; font-weight: 700; color: #2563eb; margin: 0 0 8px 0;">{{ meal.carbohydrates }}g</p>
                  <div style="height: 8px; border-radius: 4px; background: #f3f4f6; overflow: hidden;">
                    <div style="height: 100%; border-radius: 4px; background: #60a5fa; transition: width 0.5s ease;" [style.width.%]="getNutritionPercent(meal.carbohydrates, 300)"></div>
                  </div>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Fat</p>
                  <p style="font-size: 14px; font-weight: 700; color: #ca8a04; margin: 0 0 8px 0;">{{ meal.fat }}g</p>
                  <div style="height: 8px; border-radius: 4px; background: #f3f4f6; overflow: hidden;">
                    <div style="height: 100%; border-radius: 4px; background: #fbbf24; transition: width 0.5s ease;" [style.width.%]="getNutritionPercent(meal.fat, 65)"></div>
                  </div>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Fiber</p>
                  <p style="font-size: 14px; font-weight: 700; color: #16a34a; margin: 0 0 8px 0;">{{ meal.fiber }}g</p>
                  <div style="height: 8px; border-radius: 4px; background: #f3f4f6; overflow: hidden;">
                    <div style="height: 100%; border-radius: 4px; background: #4ade80; transition: width 0.5s ease;" [style.width.%]="getNutritionPercent(meal.fiber, 25)"></div>
                  </div>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Sugar</p>
                  <p style="font-size: 14px; font-weight: 700; color: #db2777; margin: 0 0 8px 0;">{{ meal.sugar }}g</p>
                  <div style="height: 8px; border-radius: 4px; background: #f3f4f6; overflow: hidden;">
                    <div style="height: 100%; border-radius: 4px; background: #f472b6; transition: width 0.5s ease;" [style.width.%]="getNutritionPercent(meal.sugar, 50)"></div>
                  </div>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Sodium</p>
                  <p style="font-size: 14px; font-weight: 700; color: #6b7280; margin: 0 0 8px 0;">{{ meal.sodium }}mg</p>
                  <div style="height: 8px; border-radius: 4px; background: #f3f4f6; overflow: hidden;">
                    <div style="height: 100%; border-radius: 4px; background: #9ca3af; transition: width 0.5s ease;" [style.width.%]="getNutritionPercent(meal.sodium, 2300)"></div>
                  </div>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #047857;">description</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Description</h2>
              </div>
              <div style="display: flex; flex-direction: column; gap: 16px;">
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Short Description</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ meal.short_description || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Full Description</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0; white-space: pre-line;">{{ meal.description || '-' }}</p>
                </div>
                <div *ngIf="meal.ingredients && meal.ingredients.length > 0">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 8px 0;">Ingredients</p>
                  <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    <span *ngFor="let item of meal.ingredients; trackBy: trackByItem" style="padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; background: #d1fae5; color: #047857;">{{ item }}</span>
                  </div>
                </div>
                <div *ngIf="meal.allergens && meal.allergens.length > 0">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 8px 0;">Allergens</p>
                  <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    <span *ngFor="let item of meal.allergens; trackBy: trackByItem" style="padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; background: #fecaca; color: #dc2626;">{{ item }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #d97706;">paid</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Pricing</h2>
              </div>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Price</p>
                  <p style="font-size: 18px; font-weight: 700; color: #1f2937; margin: 0;">\u20B9{{ meal.price }}</p>
                </div>
                <div *ngIf="meal.offer_price" style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Offer Price</p>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <p style="font-size: 18px; font-weight: 700; color: #047857; margin: 0;">\u20B9{{ meal.offer_price }}</p>
                    <span style="font-size: 11px; font-weight: 700; color: #dc2626;">-{{ meal.discount_percentage || 0 }}%</span>
                  </div>
                </div>
                <div *ngIf="meal.cost_price" style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Cost Price</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">\u20B9{{ meal.cost_price }}</p>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Tax</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ meal.tax_percentage }}%</p>
                </div>
                <div style="padding: 10px 0;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Effective Price</p>
                  <p style="font-size: 20px; font-weight: 800; color: #059669; margin: 0;">\u20B9{{ meal.effective_price || meal.price }}</p>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #0891b2;">flag</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Flags</h2>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0;">
                  <span style="font-size: 13px; font-weight: 600; color: #1f2937;">Featured</span>
                  <span style="font-size: 13px; font-weight: 700;" [style.color]="meal.is_featured ? '#047857' : '#9ca3af'">{{ meal.is_featured ? 'Yes' : 'No' }}</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-top: 1px solid #f3f4f6;">
                  <span style="font-size: 13px; font-weight: 600; color: #1f2937;">Recommended</span>
                  <span style="font-size: 13px; font-weight: 700;" [style.color]="meal.is_recommended ? '#047857' : '#9ca3af'">{{ meal.is_recommended ? 'Yes' : 'No' }}</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-top: 1px solid #f3f4f6;">
                  <span style="font-size: 13px; font-weight: 600; color: #1f2937;">New</span>
                  <span style="font-size: 13px; font-weight: 700;" [style.color]="meal.is_new ? '#047857' : '#9ca3af'">{{ meal.is_new ? 'Yes' : 'No' }}</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-top: 1px solid #f3f4f6;">
                  <span style="font-size: 13px; font-weight: 600; color: #1f2937;">Bestseller</span>
                  <span style="font-size: 13px; font-weight: 700;" [style.color]="meal.is_bestseller ? '#047857' : '#9ca3af'">{{ meal.is_bestseller ? 'Yes' : 'No' }}</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-top: 1px solid #f3f4f6;">
                  <span style="font-size: 13px; font-weight: 600; color: #1f2937;">Customizable</span>
                  <span style="font-size: 13px; font-weight: 700;" [style.color]="meal.is_customizable ? '#047857' : '#9ca3af'">{{ meal.is_customizable ? 'Yes' : 'No' }}</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-top: 1px solid #f3f4f6;">
                  <span style="font-size: 13px; font-weight: 600; color: #1f2937;">Requires Prep</span>
                  <span style="font-size: 13px; font-weight: 700;" [style.color]="meal.requires_preparation ? '#047857' : '#9ca3af'">{{ meal.requires_preparation ? 'Yes' : 'No' }}</span>
                </div>
              </div>
            </div>

            <div *ngIf="meal.gallery && meal.gallery.length > 0" style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #2563eb;">collections</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Gallery</h2>
              </div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                <img *ngFor="let img of meal.gallery; trackBy: trackByItem" [src]="img" style="width: 100%; height: 80px; object-fit: cover; border-radius: 10px; border: 1px solid #e5e7eb;" />
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #9ca3af;">info</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Audit</h2>
              </div>
              <div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Created</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ meal.created_at | date:'medium' }}</p>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Last Updated</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ meal.updated_at | date:'medium' }}</p>
                </div>
                <div *ngIf="meal.created_by_name" style="padding: 10px 0 0; border-top: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Created By</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ meal.created_by_name }}</p>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #047857;">bolt</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Quick Actions</h2>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <a [routerLink]="['/admin/meals', meal.uuid, 'edit']"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-decoration: none; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #047857;">edit</span> Edit Meal
                </a>
                <button (click)="toggleStatus()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="font-size: 18px;" [style.color]="meal.status === 'active' ? '#dc2626' : '#059669'">{{ meal.status === 'active' ? 'pause' : 'play_arrow' }}</span>
                  {{ meal.status === 'active' ? 'Deactivate' : 'Activate' }}
                </button>
                <button (click)="duplicateMeal()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #2563eb;">content_copy</span> Duplicate
                </button>
                <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                <button (click)="deleteMeal()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #fecaca; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                  onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                  <span class="material-icons" style="font-size: 18px;">delete</span> Delete Meal
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
export class MealDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mealApi = inject(MealApiService);
  private notification = inject(NotificationService);

  meal: Meal | null = null;
  loading = true;

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) { this.loadMeal(uuid); }
  }

  loadMeal(uuid: string): void {
    this.mealApi.getById(uuid).subscribe({
      next: (res) => { this.meal = res.data ?? null; this.loading = false; },
      error: () => { this.notification.error('Failed to load meal'); this.router.navigate(['/admin/meals']); },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'inactive': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getNutritionPercent(value: number, max: number): number {
    return Math.min((value / max) * 100, 100);
  }

  toggleStatus(): void {
    if (!this.meal) return;
    const newStatus = this.meal.status === 'active' ? 'inactive' : 'active';
    const label = newStatus === 'active' ? 'Activate' : 'Deactivate';
    if (window.confirm(`${label} "${this.meal.name}"?`)) {
      this.mealApi.setStatus(this.meal.uuid, newStatus).subscribe({
        next: (res) => {
          this.meal = res.data ?? null;
          this.notification.success(`Meal ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
        },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  duplicateMeal(): void {
    if (!this.meal) return;
    if (window.confirm(`Duplicate "${this.meal.name}"?`)) {
      this.mealApi.duplicate(this.meal.uuid).subscribe({
        next: (res) => {
          this.notification.success('Meal duplicated');
          if (res.data) { this.router.navigate(['/admin/meals', res.data.uuid, 'edit']); }
        },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deleteMeal(): void {
    if (!this.meal) return;
    if (window.confirm(`Delete "${this.meal.name}"? This action cannot be undone.`)) {
      this.mealApi.delete(this.meal.uuid).subscribe({
        next: () => { this.notification.success('Meal deleted'); this.router.navigate(['/admin/meals']); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  trackByItem(_index: number, item: any): any { return item; }
}
