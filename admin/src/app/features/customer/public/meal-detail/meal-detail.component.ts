import { Component, inject, OnInit, OnDestroy, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, switchMap, catchError, of } from 'rxjs';
import { CustomerBrowseApiService } from '../../../../core/services/customer-browse-api.service';
import { AppStateService } from '../../../../core/services/app-state.service';
import { CartStateService } from '../../../../core/services/cart-state.service';
import { SeoService } from '../../../../core/services/seo.service';
import { Meal } from '../../../../core/models/meal/meal.model';
import { MealImageGalleryComponent } from './components/image-gallery/meal-image-gallery.component';
import { NutritionFactsComponent } from './components/nutrition-facts/nutrition-facts.component';
import { AllergenInfoComponent } from './components/allergen-info/allergen-info.component';
import { IngredientsListComponent } from './components/ingredients-list/ingredients-list.component';
import { DayAvailabilityComponent } from './components/day-availability/day-availability.component';
import { MealReviewsComponent } from './components/meal-reviews/meal-reviews.component';
import { RelatedMealsComponent } from './components/related-meals/related-meals.component';
import { PriceDisplayComponent } from '../../../../shared/components/price-display/price-display.component';
import { RatingStarsComponent } from '../../../../shared/components/rating-stars/rating-stars.component';

@Component({
  selector: 'app-meal-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule,
    MealImageGalleryComponent, NutritionFactsComponent, AllergenInfoComponent,
    IngredientsListComponent, DayAvailabilityComponent, MealReviewsComponent,
    RelatedMealsComponent, PriceDisplayComponent, RatingStarsComponent,
  ],
  template: `
    @if (loading()) {
      <!-- Loading Skeleton -->
      <div style="max-width: 1200px; margin: 0 auto; padding: 32px 24px;">
        <div style="animation: detailSlideIn 0.5s ease-out;">
          <!-- Breadcrumb skeleton -->
          <div style="display: flex; gap: 8px; margin-bottom: 28px;">
            <div style="width: 48px; height: 14px; background: #e5e7eb; border-radius: 7px;"></div>
            <div style="width: 14px; height: 14px; background: #e5e7eb; border-radius: 7px;"></div>
            <div style="width: 56px; height: 14px; background: #e5e7eb; border-radius: 7px;"></div>
            <div style="width: 14px; height: 14px; background: #e5e7eb; border-radius: 7px;"></div>
            <div style="width: 80px; height: 14px; background: #d1fae5; border-radius: 7px;"></div>
          </div>
          <!-- Main content skeleton -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;" class="detail-skel-grid">
            <!-- Image skeleton -->
            <div style="aspect-ratio: 1; background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius: 20px; position: relative; overflow: hidden;">
              <div style="position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); animation: shimmer 1.5s infinite;"></div>
            </div>
            <!-- Info skeleton -->
            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div style="display: flex; gap: 8px;">
                <div style="width: 64px; height: 24px; background: #d1fae5; border-radius: 12px;"></div>
                <div style="width: 48px; height: 24px; background: #dbeafe; border-radius: 12px;"></div>
              </div>
              <div style="width: 70%; height: 32px; background: #e5e7eb; border-radius: 8px;"></div>
              <div style="width: 40%; height: 20px; background: #e5e7eb; border-radius: 8px;"></div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="width: 100%; height: 14px; background: #f3f4f6; border-radius: 7px;"></div>
                <div style="width: 80%; height: 14px; background: #f3f4f6; border-radius: 7px;"></div>
              </div>
              <div style="width: 120px; height: 36px; background: #e5e7eb; border-radius: 8px;"></div>
              <div style="display: flex; gap: 12px;">
                <div style="flex: 1; height: 48px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 14px;"></div>
                <div style="flex: 1; height: 48px; background: #e5e7eb; border-radius: 14px;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else if (meal()) {
      <div style="max-width: 1200px; margin: 0 auto; padding: 20px 24px 0;">
        <!-- Breadcrumb + Title Card -->
        <div style="background: #f0fdf4; border: 1px solid #d1fae5; border-radius: 14px; padding: 14px 20px 16px; margin-bottom: 20px; animation: detailSlideIn 0.5s ease-out 0.05s both;">
          <!-- Breadcrumb -->
          <nav style="display: flex; align-items: center; gap: 5px; font-size: 12px; color: #6b7280; margin-bottom: 10px; flex-wrap: wrap;">
            <a routerLink="/" style="color: #6b7280; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#6b7280'">Home</a>
            <span class="material-icons" style="font-size: 12px; color: #d1d5db;">chevron_right</span>
            <a routerLink="/meals" style="color: #6b7280; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#6b7280'">Meals</a>
            <span class="material-icons" style="font-size: 12px; color: #d1d5db;">chevron_right</span>
            <span style="color: #166534; font-weight: 600; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" [attr.title]="meal()!.name">{{ meal()!.name }}</span>
          </nav>
          <!-- Title + Badges -->
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 6px;">
            @if (meal()!.category) {
              <a [routerLink]="['/meals']" [queryParams]="{ category: meal()!.category!.slug }"
                 style="display: inline-block; padding: 3px 12px; background: white; color: #059669; font-size: 11px; font-weight: 600; border-radius: 20px; border: 1px solid #d1fae5; text-decoration: none; transition: all 0.2s;"
                 onmouseover="this.style.background='#d1fae5'" onmouseout="this.style.background='white'">
                {{ meal()!.category!.name }}
              </a>
            }
            @if (meal()!.meal_type) {
              <span style="padding: 3px 12px; background: #dbeafe; color: #2563eb; font-size: 11px; font-weight: 600; border-radius: 20px;">
                {{ meal()!.meal_type!.name }}
              </span>
            }
            @if (meal()!.is_bestseller) {
              <span style="padding: 3px 12px; background: #dcfce7; color: #16a34a; font-size: 11px; font-weight: 700; border-radius: 20px;">Bestseller</span>
            }
            @if (meal()!.is_featured) {
              <span style="padding: 3px 12px; background: #dbeafe; color: #2563eb; font-size: 11px; font-weight: 700; border-radius: 20px;">Featured</span>
            }
            @if (meal()!.is_new) {
              <span style="padding: 3px 12px; background: #f3e8ff; color: #9333ea; font-size: 11px; font-weight: 700; border-radius: 20px;">New</span>
            }
          </div>
          <h1 style="font-size: clamp(1.4rem, 2.5vw, 1.9rem); font-weight: 800; color: #166534; margin: 0; line-height: 1.3;">{{ meal()!.name }}</h1>
        </div>

        <!-- Main Content: Image + Info -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 32px;" class="detail-main-grid">
          <!-- Image Gallery -->
          <div style="animation: detailSlideIn 0.5s ease-out 0.15s both;">
            <app-meal-image-gallery
              [galleryImages]="galleryImages()"
              [altText]="meal()!.name"
            />
          </div>

          <!-- Meal Info -->
          <div style="display: flex; flex-direction: column; gap: 14px; animation: detailSlideIn 0.5s ease-out 0.25s both;">
            <!-- Rating -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <app-rating-stars [rating]="meal()!.average_rating || 0" [count]="meal()!.reviews_count || 0" [showValue]="true" size="md" />
            </div>

            <!-- Description -->
            <p style="font-size: 0.88rem; color: #4b5563; line-height: 1.65; margin: 0;">
              {{ meal()!.short_description || meal()!.description || 'Delicious meal prepared with fresh ingredients.' }}
            </p>

            <!-- Price -->
            <div style="display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #f9fafb; border-radius: 10px; border: 1px solid #f3f4f6;">
              <app-price-display
                [effectivePrice]="meal()!.effective_price || meal()!.price"
                [originalPrice]="meal()!.has_discount ? meal()!.price : undefined"
                size="xl"
                color="primary"
              />
            </div>

            <!-- Quick Info -->
            <div style="display: flex; flex-wrap: wrap; gap: 14px; font-size: 0.82rem; color: #4b5563;">
              @if (meal()!.preparation_time) {
                <div style="display: flex; align-items: center; gap: 5px; padding: 4px 10px; background: #f0fdf4; border-radius: 8px; border: 1px solid #d1fae5;">
                  <span class="material-icons" style="color: #059669; font-size: 15px;">schedule</span>
                  <span style="color: #166534; font-weight: 500;">{{ meal()!.preparation_time }} min</span>
                </div>
              }
              @if (meal()!.serving_size) {
                <div style="display: flex; align-items: center; gap: 5px; padding: 4px 10px; background: #f0fdf4; border-radius: 8px; border: 1px solid #d1fae5;">
                  <span class="material-icons" style="color: #059669; font-size: 15px;">straighten</span>
                  <span style="color: #166534; font-weight: 500;">{{ meal()!.serving_size }} {{ meal()!.unit }}</span>
                </div>
              }
              @if (meal()!.spice_level !== undefined && meal()!.spice_level !== null && meal()!.spice_level > 0) {
                <div style="display: flex; align-items: center; gap: 5px; padding: 4px 10px; background: #fef2f2; border-radius: 8px; border: 1px solid #fecaca;">
                  <span>{{ '🌶️'.repeat(meal()!.spice_level > 3 ? 3 : meal()!.spice_level) }}</span>
                  <span style="color: #991b1b; font-weight: 500;">{{ meal()!.spice_level_label }}</span>
                </div>
              }
            </div>

            <!-- Availability -->
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="width: 8px; height: 8px; border-radius: 50%;" [style.background]="meal()!.status === 'active' ? '#22c55e' : '#ef4444'"></span>
              <span [style]="'font-size: 0.82rem; font-weight: 600; color: ' + (meal()!.status === 'active' ? '#16a34a' : '#ef4444') + ';'">
                {{ meal()!.status === 'active' ? 'Available Now' : 'Currently Unavailable' }}
              </span>
            </div>

            <!-- Quantity + Actions -->
            @if (meal()!.status === 'active') {
              <div style="display: flex; flex-direction: column; gap: 10px; padding-top: 4px;">
                <!-- Quantity Selector -->
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 0.82rem; font-weight: 600; color: #374151;">Qty:</span>
                  <div style="display: flex; align-items: center; border: 1.5px solid #e5e7eb; border-radius: 10px; overflow: hidden; background: #f9fafb;">
                    <button (click)="decrementQuantity()" [disabled]="quantity() <= 1"
                      style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: transparent; border: none; cursor: pointer; color: #374151; transition: background 0.2s;"
                      onmouseover="this.style.background='#ecfdf5'" onmouseout="this.style.background='transparent'"
                      [style.opacity]="quantity() <= 1 ? '0.35' : '1'" [style.cursor]="quantity() <= 1 ? 'not-allowed' : 'pointer'" aria-label="Decrease quantity">
                      <span class="material-icons" style="font-size: 18px;">remove</span>
                    </button>
                    <input type="number" [value]="quantity()" (change)="onQuantityInput($event)" min="1"
                      style="width: 44px; height: 36px; text-align: center; font-size: 0.85rem; font-weight: 600; border: none; border-left: 1.5px solid #e5e7eb; border-right: 1.5px solid #e5e7eb; background: transparent; outline: none; color: #166534; -moz-appearance: textfield;"
                      onfocus="this.style.background='white'" onblur="this.style.background='transparent'"
                      aria-label="Quantity" />
                    <button (click)="incrementQuantity()"
                      style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: transparent; border: none; cursor: pointer; color: #374151; transition: background 0.2s;"
                      onmouseover="this.style.background='#ecfdf5'" onmouseout="this.style.background='transparent'"
                      aria-label="Increase quantity">
                      <span class="material-icons" style="font-size: 18px;">add</span>
                    </button>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div style="display: flex; gap: 10px;">
                  <button (click)="addToCart()"
                    style="flex: 1; padding: 11px 18px; background: linear-gradient(135deg, #059669, #16a34a); color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 3px 12px rgba(5,150,105,0.3); transition: all 0.25s ease; letter-spacing: 0.2px;"
                    onmouseover="this.style.boxShadow='0 5px 18px rgba(5,150,105,0.4)'; this.style.transform='translateY(-1px)';"
                    onmouseout="this.style.boxShadow='0 3px 12px rgba(5,150,105,0.3)'; this.style.transform='none';">
                    <span class="material-icons" style="font-size: 18px;">add_shopping_cart</span>
                    Add to Cart
                  </button>
                  <button (click)="buyNow()"
                    style="flex: 1; padding: 11px 18px; background: white; color: #059669; font-weight: 700; border-radius: 10px; border: 2px solid #059669; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.25s ease; letter-spacing: 0.2px;"
                    onmouseover="this.style.background='#f0fdf4'; this.style.borderColor='#047857';"
                    onmouseout="this.style.background='white'; this.style.borderColor='#059669';">
                    <span class="material-icons" style="font-size: 18px;">flash_on</span>
                    Buy Now
                  </button>
                </div>

                <!-- Subscribe -->
                <a [routerLink]="['/subscriptions']" [queryParams]="{ meal: meal()!.slug }"
                   style="display: flex; align-items: center; justify-content: center; gap: 6px; padding: 9px 16px; background: transparent; color: #6b7280; font-weight: 500; border-radius: 10px; border: 1px solid #e5e7eb; text-decoration: none; font-size: 0.8rem; transition: all 0.2s;"
                   onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'; this.style.background='#f0fdf4';"
                   onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#6b7280'; this.style.background='transparent';">
                  <span class="material-icons" style="font-size: 15px;">calendar_today</span>
                  Subscribe & Save More
                </a>
              </div>
            } @else {
              <div style="background: #f9fafb; border-radius: 12px; padding: 18px; text-align: center; border: 1px solid #e5e7eb;">
                <p style="color: #4b5563; font-weight: 600; margin: 0 0 3px 0; font-size: 0.88rem;">This meal is currently unavailable.</p>
                <p style="color: #9ca3af; font-size: 0.8rem; margin: 0;">Browse similar meals below</p>
              </div>
            }

            <!-- Share -->
            <div style="display: flex; align-items: center; gap: 12px; padding-top: 2px;">
              <button (click)="shareMeal()"
                style="display: flex; align-items: center; gap: 5px; font-size: 0.8rem; color: #9ca3af; background: none; border: none; cursor: pointer; padding: 0; transition: color 0.2s;"
                onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'"
                aria-label="Share this meal">
                <span class="material-icons" style="font-size: 16px;">share</span>
                Share
              </button>
              <span style="color: #e5e7eb; font-size: 0.75rem;">|</span>
              <span style="font-size: 0.72rem; color: #d1d5db;">SKU: {{ meal()!.sku || meal()!.meal_code }}</span>
            </div>
          </div>
        </div>

        <!-- Detail Tabs: Description, Ingredients, Nutrition, Allergens, Days -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px;" class="detail-tabs-grid">
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <!-- Description -->
            @if (meal()!.description) {
              <div style="background: white; border-radius: 14px; padding: 20px; border: 1px solid #f3f4f6; animation: detailSlideIn 0.5s ease-out 0.3s both;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                  <div style="width: 30px; height: 30px; background: #ecfdf5; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                    <span class="material-icons" style="color: #059669; font-size: 17px;">description</span>
                  </div>
                  <h3 style="font-size: 0.95rem; font-weight: 700; color: #166534; margin: 0;">Description</h3>
                </div>
                <div style="color: #4b5563; line-height: 1.7; font-size: 0.85rem; white-space: pre-line;">{{ meal()!.description }}</div>
              </div>
            }

            <!-- Ingredients -->
            <div style="animation: detailSlideIn 0.5s ease-out 0.35s both;">
              <app-ingredients-list [ingredients]="meal()!.ingredients" />
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 16px;">
            <!-- Nutrition Facts -->
            <div style="animation: detailSlideIn 0.5s ease-out 0.35s both;">
              <app-nutrition-facts [meal]="meal()!" />
            </div>

            <!-- Day Availability -->
            <div style="animation: detailSlideIn 0.5s ease-out 0.4s both;">
              <app-day-availability [availabilitySlots]="meal()!.availability_slots" />
            </div>
          </div>
        </div>

        <!-- Allergens -->
        <div style="margin-bottom: 32px; animation: detailSlideIn 0.5s ease-out 0.4s both;">
          <app-allergen-info [allergens]="meal()!.allergens" />
        </div>

        <!-- Reviews -->
        <div style="margin-bottom: 32px; animation: detailSlideIn 0.5s ease-out 0.45s both;">
          <app-meal-reviews [mealId]="meal()!.id" [mealSlug]="meal()!.slug" />
        </div>

        <!-- Related Meals -->
        <div style="animation: detailSlideIn 0.5s ease-out 0.5s both;">
          <app-related-meals [slug]="meal()!.slug" />
        </div>
      </div>

      <!-- Mobile Sticky Action Bar -->
      @if (meal()!.status === 'active') {
        <div style="position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 1px solid #e5e7eb; padding: 12px 16px; padding-bottom: max(12px, env(safe-area-inset-bottom)); z-index: 40; display: none;" class="detail-mobile-bar">
          <div style="display: flex; gap: 10px; max-width: 1200px; margin: 0 auto;">
            <button (click)="addToCart()"
              style="flex: 1; padding: 13px; background: linear-gradient(135deg, #059669, #16a34a); color: white; font-weight: 700; border-radius: 12px; border: none; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 3px 10px rgba(5,150,105,0.3);">
              <span class="material-icons" style="font-size: 18px;">add_shopping_cart</span>
              Add to Cart
            </button>
            <button (click)="buyNow()"
              style="flex: 1; padding: 13px; background: linear-gradient(135deg, #059669, #16a34a); color: white; font-weight: 700; border-radius: 12px; border: none; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 3px 10px rgba(5,150,105,0.3);">
              <span class="material-icons" style="font-size: 18px;">flash_on</span>
              Buy Now
            </button>
          </div>
        </div>
      }
    } @else {
      <!-- Not Found State -->
      <div style="max-width: 1200px; margin: 0 auto; padding: 80px 24px; text-align: center;">
        <div style="animation: plateFloat 3s ease-in-out infinite; display: inline-block;">
          <span style="font-size: 80px; display: block; opacity: 0.6;">🍽️</span>
        </div>
        <h2 style="font-size: 1.8rem; font-weight: 800; color: #166534; margin: 16px 0 10px 0;">Meal Not Found</h2>
        <p style="color: #6b7280; margin: 0 0 28px 0; max-width: 400px; margin-left: auto; margin-right: auto; line-height: 1.7;">
          The meal you're looking for is unavailable or has been removed from our menu.
        </p>
        <a routerLink="/meals"
           style="display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px; background: linear-gradient(135deg, #059669, #16a34a); color: white; font-weight: 700; border-radius: 14px; text-decoration: none; font-size: 1rem; box-shadow: 0 4px 20px rgba(5,150,105,0.3); transition: all 0.3s ease;"
           onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 30px rgba(5,150,105,0.4)';"
           onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 20px rgba(5,150,105,0.3)';">
          <span class="material-icons">restaurant_menu</span>
          Browse All Meals
        </a>
      </div>
    }
  `,
  styles: [`
    @keyframes detailSlideIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes plateFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }
    .safe-area-bottom {
      padding-bottom: max(1rem, env(safe-area-inset-bottom));
    }
    @media (max-width: 767px) {
      .detail-skel-grid,
      .detail-main-grid,
      .detail-tabs-grid {
        grid-template-columns: 1fr !important;
      }
    }
    @media (min-width: 768px) {
      .detail-mobile-bar {
        display: none !important;
      }
    }
    @media (max-width: 767px) {
      .detail-mobile-bar {
        display: block;
      }
    }
  `],
})
export class MealDetailComponent implements OnInit, OnDestroy {
  private browseApi = inject(CustomerBrowseApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seo = inject(SeoService);
  private appState = inject(AppStateService);
  private cartState = inject(CartStateService);
  private destroy$ = new Subject<void>();

  meal = signal<Meal | null>(null);
  loading = signal(true);
  error = signal(false);
  quantity = signal(1);

  galleryImages = computed(() => {
    const m = this.meal();
    if (!m) return [];
    const images: string[] = [];
    if (m.meal_image) images.push(m.meal_image);
    if (m.gallery && m.gallery.length > 0) {
      m.gallery.forEach(img => {
        if (img && !images.includes(img)) images.push(img);
      });
    }
    return images;
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        const slug = params.get('slug');
        if (!slug) {
          this.loading.set(false);
          this.error.set(true);
          return of(null);
        }
        this.loading.set(true);
        this.error.set(false);
        this.quantity.set(1);
        return this.browseApi.getMealBySlug(slug).pipe(
          catchError(() => {
            this.loading.set(false);
            this.error.set(true);
            return of(null);
          })
        );
      })
    ).subscribe(res => {
      this.loading.set(false);
      if (res && res.success && res.data) {
        this.meal.set(res.data);
        this.error.set(false);
        this.setSeoMeta(res.data);
      } else {
        this.error.set(true);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  incrementQuantity(): void {
    this.quantity.update(q => q + 1);
  }

  decrementQuantity(): void {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  onQuantityInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const val = parseInt(input.value, 10);
    if (!isNaN(val) && val >= 1) {
      this.quantity.set(val);
    } else {
      input.value = String(this.quantity());
    }
  }

  addToCart(): void {
    if (!this.appState.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/meals/${this.meal()?.slug}` },
      });
      return;
    }
    const m = this.meal();
    if (m) {
      this.cartState.addItem(m.id, this.quantity(), m.name);
    }
  }

  buyNow(): void {
    if (!this.appState.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/meals/${this.meal()?.slug}` },
      });
      return;
    }
    const m = this.meal();
    if (m) {
      this.cartState.addItem(m.id, this.quantity(), m.name);
      this.router.navigate(['/cart']);
    }
  }

  shareMeal(): void {
    const slug = this.meal()?.slug;
    const url = `${window.location.origin}/meals/${slug}`;

    if (navigator.share) {
      navigator.share({
        title: this.meal()?.name || 'Check out this meal',
        text: this.meal()?.short_description || `Try ${this.meal()?.name} from Vyaru Tiffin`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
      }).catch(() => {});
    }
  }

  private setSeoMeta(m: Meal): void {
    const title = m.name;
    const desc = m.short_description || m.description || `${m.name} - Fresh meal from Vyaru Tiffin`;
    this.seo.setPageTitle(title, desc.substring(0, 160));

    // Open Graph
    if (m.meal_image) {
      this.seo['meta'].updateTag({ property: 'og:image', content: m.meal_image });
    }
    this.seo['meta'].updateTag({ property: 'og:url', content: `${window.location.origin}/meals/${m.slug}` });
    this.seo['meta'].updateTag({ property: 'og:type', content: 'product' });
  }
}
