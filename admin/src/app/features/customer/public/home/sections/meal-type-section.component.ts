import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CustomerBrowseApiService } from '../../../../../core/services/customer-browse-api.service';
import { CartStateService } from '../../../../../core/services/cart-state.service';
import { Meal } from '../../../../../core/models/meal/meal.model';
import { MealType } from '../../../../../core/models/meal/meal-type.model';

@Component({
  selector: 'app-meal-type-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="relative" [attr.aria-label]="mealType().name + ' meals'" style="padding: 3.5rem 0;">
      <div style="max-width: 80rem; margin: 0 auto; padding: 0 1rem;">

        <!-- Section Header -->
        <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 2.5rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div class="mt-icon-box"
                 style="width: 3rem; height: 3rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08); flex-shrink: 0;"
                 [style.background]="mealType().color_code ? 'linear-gradient(135deg, ' + mealType().color_code + ', ' + mealType().color_code + 'dd)' : 'linear-gradient(135deg, #0d9488, #0891b2)'">
              <span class="material-icons" style="font-size: 1.25rem; color: #fff;">{{ mealType().icon || 'restaurant' }}</span>
            </div>
            <div>
              <h2 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 0.125rem; line-height: 1.2;">{{ mealType().name }}</h2>
              @if (mealType().description) {
                <p style="color: #64748b; font-size: 0.8125rem;">{{ mealType().description }}</p>
              }
            </div>
          </div>
          @if (meals().length > 0) {
            <a routerLink="/meals" [queryParams]="{ meal_type_id: mealType().id }"
               style="display: none; align-items: center; gap: 0.375rem; color: #0d9488; font-weight: 600; font-size: 0.8125rem; text-decoration: none; transition: all 0.3s;"
               class="sm:!inline-flex"
               onmouseover="this.style.color='#0f766e'; this.style.gap='0.625rem';"
               onmouseout="this.style.color='#0d9488'; this.style.gap='0.375rem';">
              View All <span class="material-icons" style="font-size: 16px;">arrow_forward</span>
            </a>
          }
        </div>

        @if (loading()) {
          <div class="mt-grid">
            @for (i of [1,2,3,4]; track i) {
              <div style="background: #fff; border-radius: 0.75rem; overflow: hidden; border: 1px solid #e2e8f0;">
                <div style="height: 11rem; background: #e2e8f0; animation: pulse 1.5s infinite;"></div>
                <div style="padding: 0.875rem; display: flex; flex-direction: column; gap: 0.5rem;">
                  <div style="height: 0.875rem; background: #e2e8f0; border-radius: 0.25rem; width: 70%;"></div>
                  <div style="height: 0.625rem; background: #e2e8f0; border-radius: 0.25rem; width: 90%;"></div>
                  <div style="height: 1.125rem; background: #e2e8f0; border-radius: 0.25rem; width: 25%; margin-top: 0.25rem;"></div>
                </div>
              </div>
            }
          </div>
        } @else if (meals().length === 0) {
          <div style="text-align: center; padding: 3rem 1rem; background: #f8fafc; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <span class="material-icons" style="font-size: 2.5rem; color: #cbd5e1; margin-bottom: 0.5rem;">{{ mealType().icon || 'restaurant' }}</span>
            <p style="color: #64748b; font-size: 0.8125rem;">No {{ mealType().name.toLowerCase() }} meals available right now.</p>
          </div>
        } @else {
          <div class="mt-grid">
            @for (meal of meals(); track meal.id) {
              <a [routerLink]="['/meals', meal.slug]"
                 class="mt-card"
                 style="display: flex; flex-direction: column; background: #fff; border-radius: 0.75rem; overflow: hidden; border: 1px solid #f1f5f5; text-decoration: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); height: 100%;"
                 onmouseover="this.style.boxShadow='0 12px 32px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)'; this.style.borderColor='#e2e8f0'; this.style.transform='translateY(-3px)';"
                 onmouseout="this.style.boxShadow='none'; this.style.borderColor='#f1f5f5'; this.style.transform='none';">

                <!-- Image -->
                <div style="position: relative; height: 11rem; overflow: hidden; flex-shrink: 0;">
                  @if (meal.meal_image) {
                    <img [src]="meal.meal_image" [alt]="meal.name" loading="lazy"
                         style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;"
                         onmouseover="this.style.transform='scale(1.06)';"
                         onmouseout="this.style.transform='scale(1)';" />
                  } @else {
                    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f0fdfa, #e0f2fe);">
                      <span style="font-size: 3rem;">🍛</span>
                    </div>
                  }
                  @if (meal.has_discount) {
                    <div style="position: absolute; top: 0.5rem; right: 0.5rem; padding: 0.15rem 0.5rem; background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff; font-size: 0.6rem; font-weight: 700; border-radius: 9999px; box-shadow: 0 2px 6px rgba(239,68,68,0.4);">
                      {{ meal.discount_percentage }}% OFF
                    </div>
                  }
                  @if (meal.availability_type === 'all_day') {
                    <div style="position: absolute; bottom: 0.5rem; left: 0.5rem; padding: 0.125rem 0.5rem; background: rgba(255,255,255,0.92); backdrop-filter: blur(4px); color: #16a34a; font-size: 0.6rem; font-weight: 600; border-radius: 9999px; display: flex; align-items: center; gap: 0.2rem;">
                      <span style="width: 0.3rem; height: 0.3rem; background: #22c55e; border-radius: 50%;"></span> Available
                    </div>
                  }
                </div>

                <!-- Content -->
                <div style="padding: 0.875rem; display: flex; flex-direction: column; flex-grow: 1;">
                  <div style="display: flex; align-items: center; gap: 0.25rem; margin-bottom: 0.375rem; flex-wrap: wrap;">
                    @if (meal.category) {
                      <span style="padding: 0.0625rem 0.375rem; background: #f1f5f9; color: #475569; font-size: 0.6rem; font-weight: 500; border-radius: 9999px;">{{ meal.category.name }}</span>
                    }
                    @if (meal.spice_level > 0) {
                      <span style="font-size: 0.6rem;">{{ '\u{1F336}\uFE0F'.repeat(meal.spice_level > 3 ? 3 : meal.spice_level) }}</span>
                    }
                  </div>

                  <h3 class="mt-title" style="font-weight: 700; color: #0f172a; font-size: 0.875rem; line-height: 1.3; margin-bottom: 0.25rem; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">
                    {{ meal.name }}
                  </h3>
                  <p style="color: #94a3b8; font-size: 0.7rem; line-height: 1.4; margin-bottom: 0.5rem; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; flex-grow: 1;">
                    {{ meal.short_description || meal.description || 'Fresh homestyle meal' }}
                  </p>

                  @if (meal.calories > 0 || meal.protein > 0) {
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                      @if (meal.calories > 0) {
                        <span style="display: inline-flex; align-items: center; gap: 0.15rem; padding: 0.0625rem 0.375rem; background: #fefce8; color: #a16207; font-size: 0.6rem; font-weight: 500; border-radius: 9999px;">
                          <span class="material-icons" style="font-size: 9px;">local_fire_department</span>{{ meal.calories }} cal
                        </span>
                      }
                      @if (meal.protein > 0) {
                        <span style="padding: 0.0625rem 0.375rem; background: #eff6ff; color: #2563eb; font-size: 0.6rem; font-weight: 500; border-radius: 9999px;">{{ meal.protein }}g protein</span>
                      }
                    </div>
                  }

                  <!-- Price + Actions -->
                  <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 0.5rem; border-top: 1px solid #f1f5f9;">
                    <div>
                      <span style="font-size: 1rem; font-weight: 800; color: #0f172a;">&#8377;{{ meal.effective_price || meal.price }}</span>
                      @if (meal.has_discount) {
                        <span style="font-size: 0.65rem; color: #94a3b8; text-decoration: line-through; margin-left: 0.25rem;">&#8377;{{ meal.price }}</span>
                      }
                    </div>
                    <div style="display: flex; gap: 0.375rem;" (click)="$event.preventDefault(); $event.stopPropagation()">
                      <button
                        (click)="addToCart($event, meal)"
                        style="padding: 0.3rem 0.625rem; background: linear-gradient(135deg, #0d9488, #0891b2); color: #fff; font-size: 0.625rem; font-weight: 600; border-radius: 0.375rem; border: none; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 0.2rem; box-shadow: 0 2px 6px rgba(13,148,136,0.25); white-space: nowrap;"
                        onmouseover="this.style.boxShadow='0 3px 10px rgba(13,148,136,0.4)'; this.style.transform='translateY(-1px)';"
                        onmouseout="this.style.boxShadow='0 2px 6px rgba(13,148,136,0.25)'; this.style.transform='none';">
                        <span class="material-icons" style="font-size: 12px;">add_shopping_cart</span>Add
                      </button>
                      <button
                        (click)="buyNow($event, meal)"
                        style="padding: 0.3rem 0.625rem; background: transparent; color: #0d9488; font-size: 0.625rem; font-weight: 600; border-radius: 0.375rem; border: 1px solid #0d9488; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 0.2rem; white-space: nowrap;"
                        onmouseover="this.style.background='#f0fdfa';"
                        onmouseout="this.style.background='transparent';">
                        <span class="material-icons" style="font-size: 12px;">flash_on</span>Buy
                      </button>
                    </div>
                  </div>
                </div>
              </a>
            }
          </div>

          <!-- Mobile View All -->
          <div style="text-align: center; margin-top: 1.5rem;" class="sm:!hidden">
            <a routerLink="/meals" [queryParams]="{ meal_type_id: mealType().id }"
               style="display: inline-flex; align-items: center; gap: 0.375rem; color: #0d9488; font-weight: 600; font-size: 0.8125rem; text-decoration: none;">
              View All {{ mealType().name }} <span class="material-icons" style="font-size: 16px;">arrow_forward</span>
            </a>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .mt-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 1rem;
    }
    @media (min-width: 480px) {
      .mt-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (min-width: 768px) {
      .mt-grid { grid-template-columns: repeat(3, 1fr); }
    }
    @media (min-width: 1024px) {
      .mt-grid { grid-template-columns: repeat(4, 1fr); gap: 1.125rem; }
    }
    .mt-card:hover .mt-title {
      color: #0d9488;
    }
    .mt-icon-box {
      transition: transform 0.3s ease;
    }
    .mt-card:hover ~ .mt-icon-box,
    .mt-icon-box:hover {
      transform: scale(1.05);
    }
  `],
})
export class MealTypeSectionComponent implements OnInit {
  private browseApi = inject(CustomerBrowseApiService);
  private cartState = inject(CartStateService);
  private router = inject(Router);
  mealType = input.required<MealType>();
  meals = signal<Meal[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.browseApi.getMeals({ meal_type_id: this.mealType().id, per_page: 8, sort: 'display_order', order: 'asc' }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) this.meals.set(res.data);
      },
      error: () => this.loading.set(false),
    });
  }

  addToCart(event: Event, meal: Meal): void {
    event.preventDefault();
    event.stopPropagation();
    this.cartState.addItem(meal.id, 1, meal.name);
  }

  buyNow(event: Event, meal: Meal): void {
    event.preventDefault();
    event.stopPropagation();
    this.cartState.addItem(meal.id, 1, meal.name);
    this.router.navigate(['/checkout']);
  }
}
