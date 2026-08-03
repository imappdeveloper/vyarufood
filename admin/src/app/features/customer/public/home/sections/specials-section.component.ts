import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CustomerBrowseApiService } from '../../../../../core/services/customer-browse-api.service';
import { CartStateService } from '../../../../../core/services/cart-state.service';
import { Meal } from '../../../../../core/models/meal/meal.model';

@Component({
  selector: 'app-specials-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `    <section style="background: #fff; padding: 2rem 0; position: relative; overflow: hidden;" class="sm:!py-20" aria-label="Today's specials">
      <div style="position: absolute; top: -8rem; right: -4rem; width: 28rem; height: 28rem; background: radial-gradient(circle, rgba(5,150,105,0.08) 0%, transparent 70%); pointer-events: none;"></div>
      <div style="position: absolute; bottom: -6rem; left: -6rem; width: 24rem; height: 24rem; background: radial-gradient(circle, rgba(22,163,74,0.06) 0%, transparent 70%); pointer-events: none;"></div>

      <div style="max-width: 80rem; margin: 0 auto; padding: 0 1rem; position: relative; z-index: 10;">
        <!-- Section Header -->
        <div style="display: flex; align-items: flex-end; justify-content: space-between;" class="mb-6 sm:mb-10">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.25rem 0.75rem; background: linear-gradient(135deg, #059669, #16a34a); color: #fff; font-size: 0.7rem; font-weight: 700; border-radius: 9999px; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 0 2px 8px rgba(5,150,105,0.3);">
              <span class="material-icons" style="font-size: 14px;">local_fire_department</span> Chef's Picks
            </div>
            <h2 class="sm:!text-3xl" style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 0.375rem; line-height: 1.2;">
              Today's Specials
            </h2>
            <p class="sm:!text-sm" style="color: #64748b; font-size: 0.78rem;">Handpicked by our chef — freshly prepared today</p>
          </div>
          @if (meals().length > 0) {
            <a routerLink="/meals" [queryParams]="{ featured: 1 }"
               style="display: none; align-items: center; gap: 0.375rem; color: #059669; font-weight: 600; font-size: 0.875rem; text-decoration: none; transition: all 0.3s;"
               class="sm:!inline-flex"
               onmouseover="this.style.color='#0f766e'; this.style.gap='0.625rem';"
               onmouseout="this.style.color='#059669'; this.style.gap='0.375rem';">
              View All <span class="material-icons" style="font-size: 18px;">arrow_forward</span>
            </a>
          }
        </div>

        @if (loading()) {
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;">
            @for (i of [1,2,3]; track i) {
              <div style="background: #f8fafc; border-radius: 1rem; overflow: hidden; border: 1px solid #e2e8f0;">
                <div style="height: 14rem; background: #e2e8f0; animation: pulse 1.5s infinite;"></div>
                <div style="padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
                  <div style="height: 1rem; background: #e2e8f0; border-radius: 0.25rem; width: 70%;"></div>
                  <div style="height: 0.75rem; background: #e2e8f0; border-radius: 0.25rem; width: 90%;"></div>
                  <div style="height: 1.25rem; background: #e2e8f0; border-radius: 0.25rem; width: 30%; margin-top: 0.5rem;"></div>
                </div>
              </div>
            }
          </div>
        } @else if (meals().length === 0) {
          <div style="text-align: center; padding: 4rem 1rem; background: #f8fafc; border-radius: 1rem; border: 1px solid #e2e8f0;">
            <span class="material-icons" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 0.75rem;">restaurant</span>
            <p style="color: #64748b; font-size: 0.875rem;">No specials today. Check back tomorrow!</p>
          </div>
        } @else {
          <div class="specials-grid">
            @for (meal of meals(); track meal.id; let i = $index) {
              <a [routerLink]="['/meals', meal.slug]"
                 class="specials-card"
                 style="display: flex; flex-direction: column; background: #fff; border-radius: 1rem; overflow: hidden; border: 1px solid #f1f5f5; text-decoration: none; transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); position: relative; height: 100%;"
                 onmouseover="this.style.boxShadow='0 20px 50px rgba(0,0,0,0.1), 0 8px 20px rgba(5,150,105,0.08)'; this.style.borderColor='#a7f3d0'; this.style.transform='translateY(-4px)';"
                 onmouseout="this.style.boxShadow='none'; this.style.borderColor='#f1f5f5'; this.style.transform='none';">

                <!-- Chef badge for first item -->
                @if (i === 0) {
                  <div style="position: absolute; top: 0.75rem; left: 0.75rem; z-index: 10; display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.625rem; background: linear-gradient(135deg, #059669, #16a34a); color: #fff; font-size: 0.65rem; font-weight: 700; border-radius: 9999px; box-shadow: 0 2px 8px rgba(5,150,105,0.4); text-transform: uppercase; letter-spacing: 0.03em;">
                    <span class="material-icons" style="font-size: 12px;">workspace_premium</span> Chef's Pick
                  </div>
                }

                @if (meal.has_discount) {
                  <div style="position: absolute; top: 0.75rem; right: 0.75rem; z-index: 10; padding: 0.25rem 0.625rem; background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff; font-size: 0.65rem; font-weight: 700; border-radius: 9999px; box-shadow: 0 2px 8px rgba(239,68,68,0.4);">
                    {{ meal.discount_percentage }}% OFF
                  </div>
                }

                <!-- Image -->
                <div style="position: relative; height: 14rem; overflow: hidden; flex-shrink: 0;">
                  @if (meal.meal_image) {
                    <img [src]="meal.meal_image" [alt]="meal.name" loading="lazy"
                         style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);"
                         onmouseover="this.style.transform='scale(1.08)';"
                         onmouseout="this.style.transform='scale(1)';" />
                  } @else {
                    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #ecfdf5, #e0f2fe);">
                      <span style="font-size: 3.5rem;">🍛</span>
                    </div>
                  }
                  <!-- Gradient overlay at bottom of image -->
                  <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 3rem; background: linear-gradient(transparent, rgba(0,0,0,0.04)); pointer-events: none;"></div>
                </div>

                <!-- Content -->
                <div style="padding: 1rem 1.125rem 1.125rem; display: flex; flex-direction: column; flex-grow: 1;">
                  <!-- Tags row -->
                  <div style="display: flex; align-items: center; gap: 0.375rem; margin-bottom: 0.5rem; flex-wrap: wrap;">
                    @if (meal.category) {
                      <span style="padding: 0.125rem 0.5rem; background: #f1f5f9; color: #475569; font-size: 0.65rem; font-weight: 500; border-radius: 9999px;">{{ meal.category.name }}</span>
                    }
                    @if (meal.meal_type) {
                      <span style="padding: 0.125rem 0.5rem; background: #ecfdf5; color: #059669; font-size: 0.65rem; font-weight: 500; border-radius: 9999px;">{{ meal.meal_type.name }}</span>
                    }
                    @if (meal.calories > 0) {
                      <span style="padding: 0.125rem 0.5rem; background: #fefce8; color: #a16207; font-size: 0.65rem; font-weight: 500; border-radius: 9999px; display: inline-flex; align-items: center; gap: 0.125rem;">
                        <span class="material-icons" style="font-size: 10px;">local_fire_department</span>{{ meal.calories }} cal
                      </span>
                    }
                  </div>

                  <!-- Title -->
                  <h3 style="font-weight: 700; color: #0f172a; font-size: 0.95rem; line-height: 1.3; margin-bottom: 0.25rem; transition: color 0.2s; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;"
                      class="specials-title">{{ meal.name }}</h3>

                  <!-- Description -->
                  <p style="color: #64748b; font-size: 0.78rem; line-height: 1.5; margin-bottom: 0.75rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex-grow: 1;">
                    {{ meal.short_description || meal.description || 'Freshly prepared homestyle meal' }}
                  </p>

                  <!-- Price + Action Row -->
                  <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 0.75rem; border-top: 1px solid #f1f5f9;">
                    <div>
                      <span style="font-size: 1.2rem; font-weight: 800; color: #0f172a;">&#8377;{{ meal.effective_price || meal.price }}</span>
                      @if (meal.has_discount) {
                        <span style="font-size: 0.75rem; color: #94a3b8; text-decoration: line-through; margin-left: 0.375rem;">&#8377;{{ meal.price }}</span>
                      }
                    </div>
                    <div style="display: flex; gap: 0.5rem;" (click)="$event.preventDefault(); $event.stopPropagation()">
                      <button
                        (click)="addToCart($event, meal)"
                        style="padding: 0.4rem 0.875rem; background: linear-gradient(135deg, #059669, #16a34a); color: #fff; font-size: 0.7rem; font-weight: 600; border-radius: 0.5rem; border: none; cursor: pointer; transition: all 0.25s; display: inline-flex; align-items: center; gap: 0.25rem; box-shadow: 0 2px 8px rgba(5,150,105,0.3); white-space: nowrap;"
                        onmouseover="this.style.boxShadow='0 4px 14px rgba(5,150,105,0.45)'; this.style.transform='translateY(-1px)';"
                        onmouseout="this.style.boxShadow='0 2px 8px rgba(5,150,105,0.3)'; this.style.transform='none';">
                        <span class="material-icons" style="font-size: 14px;">add_shopping_cart</span>
                        Add
                      </button>
                      <button
                        (click)="buyNow($event, meal)"
                        style="padding: 0.4rem 0.875rem; background: transparent; color: #059669; font-size: 0.7rem; font-weight: 600; border-radius: 0.5rem; border: 1.5px solid #059669; cursor: pointer; transition: all 0.25s; display: inline-flex; align-items: center; gap: 0.25rem; white-space: nowrap;"
                        onmouseover="this.style.background='#ecfdf5';"
                        onmouseout="this.style.background='transparent';">
                        <span class="material-icons" style="font-size: 14px;">flash_on</span>
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              </a>
            }
          </div>

          <!-- Mobile View All -->
          <div style="text-align: center; margin-top: 1.25rem;" class="sm:!hidden">
            <a routerLink="/meals" [queryParams]="{ featured: 1 }"
               style="display: inline-flex; align-items: center; gap: 0.375rem; color: #059669; font-weight: 600; font-size: 0.875rem; text-decoration: none;">
              View All <span class="material-icons" style="font-size: 18px;">arrow_forward</span>
            </a>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .specials-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 1.5rem;
    }
    @media (min-width: 640px) {
      .specials-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
      }
    }
    @media (min-width: 1024px) {
      .specials-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 1.75rem;
      }
    }
    .specials-card:hover .specials-title {
      color: #059669;
    }
  `],
})
export class SpecialsSectionComponent implements OnInit {
  private browseApi = inject(CustomerBrowseApiService);
  private cartState = inject(CartStateService);
  private router = inject(Router);
  meals = signal<Meal[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.browseApi.getMeals({ per_page: 6, sort: 'display_order', order: 'asc', featured: 1 }).subscribe({
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
