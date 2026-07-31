import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Meal } from '../../../core/models/meal/meal.model';

@Component({
  selector: 'app-meal-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div (click)="navigateToDetail()"
       style="display: block; background: white; border-radius: 18px; overflow: hidden; border: 1px solid #f1f5f9; cursor: pointer; transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);"
       onmouseover="this.style.transform='translateY(-6px)'; this.style.boxShadow='0 20px 48px -8px rgba(5,150,105,0.18), 0 8px 20px -6px rgba(5,150,105,0.08)'; this.style.borderColor='#a7f3d0';"
       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)'; this.style.borderColor='#f1f5f9';">

      <!-- Image Area -->
      <div style="position: relative; height: 210px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); overflow: hidden;">
        @if (meal.meal_image) {
          <img [src]="meal.meal_image" [alt]="meal.name" loading="lazy"
               style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);"
               onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1)'" />
        } @else {
          <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f0fdf4, #d1fae5);">
            <span style="font-size: 56px; transition: transform 0.4s ease; filter: drop-shadow(0 4px 8px rgba(5,150,105,0.15));"
                  onmouseover="this.style.transform='scale(1.12) rotate(-5deg)'" onmouseout="this.style.transform='scale(1) rotate(0)'">&#127835;</span>
          </div>
        }

        <!-- Image bottom gradient overlay -->
        <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 60%; background: linear-gradient(to top, rgba(255,255,255,0.6), transparent);"></div>

        <!-- Top-left badge (Bestseller / Featured / New) -->
        @if (showBadge && meal.is_bestseller) {
          <span style="position: absolute; top: 12px; left: 12px; padding: 4px 12px; background: linear-gradient(135deg, #059669, #10b981); color: white; font-size: 11px; font-weight: 700; border-radius: 20px; box-shadow: 0 4px 12px rgba(5,150,105,0.35); letter-spacing: 0.3px; display: flex; align-items: center; gap: 4px;">
            <span style="font-size: 12px;">&#11088;</span> Bestseller
          </span>
        } @else if (showBadge && meal.is_featured) {
          <span style="position: absolute; top: 12px; left: 12px; padding: 4px 12px; background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; font-size: 11px; font-weight: 700; border-radius: 20px; box-shadow: 0 4px 12px rgba(37,99,235,0.35); letter-spacing: 0.3px;">Featured</span>
        } @else if (showBadge && meal.is_new) {
          <span style="position: absolute; top: 12px; left: 12px; padding: 4px 12px; background: linear-gradient(135deg, #7c3aed, #8b5cf6); color: white; font-size: 11px; font-weight: 700; border-radius: 20px; box-shadow: 0 4px 12px rgba(124,58,237,0.35); letter-spacing: 0.3px;">New</span>
        }

        <!-- Discount badge -->
        @if (meal.has_discount) {
          <span style="position: absolute; top: 12px; right: 12px; padding: 4px 10px; background: linear-gradient(135deg, #dc2626, #ef4444); color: white; font-size: 11px; font-weight: 800; border-radius: 8px; box-shadow: 0 4px 12px rgba(220,38,38,0.35);">
            {{ meal.discount_percentage }}% OFF
          </span>
        }

        <!-- Rating at bottom-left -->
        @if (meal.average_rating > 0) {
          <div style="position: absolute; bottom: 10px; left: 10px; padding: 3px 10px; background: rgba(255,255,255,0.92); backdrop-filter: blur(6px); border-radius: 20px; display: flex; align-items: center; gap: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
            <span style="color: #f59e0b; font-size: 13px;">&#11088;</span>
            <span style="color: #1e293b; font-size: 12px; font-weight: 700;">{{ meal.average_rating.toFixed(1) }}</span>
            <span style="color: #94a3b8; font-size: 11px; font-weight: 500;">({{ meal.reviews_count }})</span>
          </div>
        }

        <!-- Availability badge -->
        @if (meal.availability_type === 'all_day') {
          <div style="position: absolute; bottom: 10px; right: 10px; padding: 3px 10px; background: rgba(255,255,255,0.92); backdrop-filter: blur(6px); border-radius: 20px; display: flex; align-items: center; gap: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
            <span style="width: 6px; height: 6px; background: #22c55e; border-radius: 50%;"></span>
            <span style="color: #059669; font-size: 11px; font-weight: 600;">Available</span>
          </div>
        }
      </div>

      <!-- Content -->
      <div style="padding: 16px 16px 14px;">

        <!-- Top row: veg indicator + tags -->
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; flex-wrap: wrap;">
          @if (meal.dietary_type) {
            <span style="display: inline-flex; align-items: center; gap: 3px; padding: 2px 8px; border-radius: 4px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
              {{ meal.dietary_type === 'veg' ? 'background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0;' : '' }}
              {{ meal.dietary_type === 'non_veg' ? 'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;' : '' }}
              {{ meal.dietary_type === 'egg' ? 'background: #fffbeb; color: #d97706; border: 1px solid #fde68a;' : '' }}
            ">
              <span style="width: 8px; height: 8px; border-radius: 50%;
                {{ meal.dietary_type === 'veg' ? 'background: #16a34a;' : '' }}
                {{ meal.dietary_type === 'non_veg' ? 'background: #dc2626;' : '' }}
                {{ meal.dietary_type === 'egg' ? 'background: #d97706;' : '' }}
              "></span>
              {{ meal.dietary_type === 'non_veg' ? 'Non-Veg' : (meal.dietary_type === 'egg' ? 'Egg' : 'Veg') }}
            </span>
          }
          @if (meal.category) {
            <span style="padding: 2px 10px; background: #f1f5f9; color: #64748b; font-size: 10px; font-weight: 500; border-radius: 20px;">{{ meal.category.name }}</span>
          }
          @if (meal.meal_type) {
            <span style="padding: 2px 10px; background: #f0fdf4; color: #059669; font-size: 10px; font-weight: 500; border-radius: 20px;">{{ meal.meal_type.name }}</span>
          }
        </div>

        <!-- Meal Name -->
        <h3 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 0 0 4px 0; line-height: 1.35; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; transition: color 0.2s;"
            onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#0f172a'">{{ meal.name }}</h3>

        <!-- Description -->
        @if (meal.short_description || meal.description) {
          <p style="font-size: 0.8rem; color: #94a3b8; margin: 0 0 10px 0; line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            {{ meal.short_description || meal.description }}
          </p>
        }

        <!-- Nutrition + Spice row -->
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap;">
          @if (meal.calories > 0) {
            <span style="display: inline-flex; align-items: center; gap: 3px; font-size: 11px; color: #64748b; background: #f8fafc; padding: 2px 8px; border-radius: 6px;">
              <span style="font-size: 12px;">&#128293;</span> {{ meal.calories }} cal
            </span>
          }
          @if (meal.protein > 0) {
            <span style="display: inline-flex; align-items: center; gap: 3px; font-size: 11px; color: #64748b; background: #f8fafc; padding: 2px 8px; border-radius: 6px;">
              <span style="font-size: 11px;">&#129372;</span> {{ meal.protein }}g protein
            </span>
          }
          @if (meal.preparation_time > 0) {
            <span style="display: inline-flex; align-items: center; gap: 3px; font-size: 11px; color: #64748b; background: #f8fafc; padding: 2px 8px; border-radius: 6px;">
              <span style="font-size: 11px;">&#9201;</span> {{ meal.preparation_time }} min
            </span>
          }
          @if (meal.spice_level > 0) {
            <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 11px; color: #64748b; background: #f8fafc; padding: 2px 8px; border-radius: 6px;">
              <span style="font-size: 11px;">&#127798;</span>
              {{ meal.spice_level_label || ('Level ' + meal.spice_level) }}
            </span>
          }
        </div>

        <!-- Price + Actions -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid #f1f5f9;">
          <div style="display: flex; flex-direction: column;">
            <div style="display: flex; align-items: baseline; gap: 6px;">
              <span style="font-size: 1.25rem; font-weight: 800; color: #059669; line-height: 1;">
                &#8377;{{ (meal.effective_price || meal.price) | number:'1.0-0' }}
              </span>
              @if (meal.has_discount) {
                <span style="font-size: 0.8rem; font-weight: 500; color: #94a3b8; text-decoration: line-through;">
                  &#8377;{{ meal.price | number:'1.0-0' }}
                </span>
                <span style="font-size: 0.65rem; font-weight: 700; color: #dc2626; background: #fef2f2; padding: 1px 6px; border-radius: 4px;">
                  {{ meal.discount_percentage }}% off
                </span>
              }
            </div>
            @if (meal.tax_percentage > 0) {
              <span style="font-size: 0.65rem; color: #94a3b8; margin-top: 1px;">+{{ meal.tax_percentage }}% GST</span>
            }
          </div>
          <div style="display: flex; gap: 6px;" (click)="$event.preventDefault(); $event.stopPropagation()">
            <button (click)="onAddToCart.emit(meal)"
              style="padding: 7px 14px; background: linear-gradient(135deg, #059669, #10b981); color: white; font-size: 12px; font-weight: 600; border-radius: 10px; border: none; cursor: pointer; transition: all 0.25s ease; white-space: nowrap; display: flex; align-items: center; gap: 4px;"
              onmouseover="this.style.boxShadow='0 4px 14px rgba(5,150,105,0.4)'; this.style.transform='translateY(-1px)';"
              onmouseout="this.style.boxShadow='none'; this.style.transform='none';">
              <span style="font-size: 14px;">+</span> Add
            </button>
            <button (click)="onBuyNow.emit(meal)"
              style="padding: 7px 14px; background: white; color: #059669; font-size: 12px; font-weight: 600; border-radius: 10px; border: 1.5px solid #d1fae5; cursor: pointer; transition: all 0.25s ease; white-space: nowrap;"
              onmouseover="this.style.background='#f0fdf4'; this.style.borderColor='#059669'; this.style.boxShadow='0 2px 8px rgba(5,150,105,0.12)';"
              onmouseout="this.style.background='white'; this.style.borderColor='#d1fae5'; this.style.boxShadow='none';">
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class MealCardComponent {
  private router = inject(Router);

  @Input({ required: true }) meal!: Meal;
  @Input() showBadge = true;

  @Output() onAddToCart = new EventEmitter<Meal>();
  @Output() onBuyNow = new EventEmitter<Meal>();

  navigateToDetail(): void {
    if (this.meal?.slug) {
      this.router.navigate(['/meals', this.meal.slug]);
    }
  }
}
