import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, Observable, takeUntil, switchMap, catchError, of, finalize } from 'rxjs';
import { CustomerBrowseApiService } from '../../../../core/services/customer-browse-api.service';
import { AppStateService } from '../../../../core/services/app-state.service';
import { CartStateService } from '../../../../core/services/cart-state.service';
import { SeoService } from '../../../../core/services/seo.service';
import { Meal } from '../../../../core/models/meal/meal.model';
import { MealCategory } from '../../../../core/models/meal/meal-category.model';
import { ApiResponse, PaginatedResponse, PaginationMeta } from '../../../../core/interfaces/api-response.interface';
import { MealCardComponent } from '../../../../shared/components/meal-card/meal-card.component';
import { CustomerPaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MealCardComponent, CustomerPaginationComponent, SkeletonLoaderComponent, EmptyStateComponent],
  template: `
    <!-- Hero Section -->
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 80px 24px 110px; overflow: hidden; min-height: 320px;">
      <!-- Floating food emojis -->
      <div style="position: absolute; top: 10%; left: 8%; font-size: 32px; opacity: 0.2; animation: catHeroFloat 5s ease-in-out infinite;">&#127813;</div>
      <div style="position: absolute; top: 20%; right: 12%; font-size: 28px; opacity: 0.18; animation: catHeroFloat 6s ease-in-out 1s infinite;">&#129367;</div>
      <div style="position: absolute; bottom: 25%; left: 15%; font-size: 30px; opacity: 0.16; animation: catHeroFloat 4.5s ease-in-out 0.5s infinite;">&#127798;</div>
      <div style="position: absolute; bottom: 20%; right: 8%; font-size: 26px; opacity: 0.2; animation: catHeroFloat 5.5s ease-in-out 2s infinite;">&#129361;</div>
      <!-- Decorative blurs -->
      <div style="position: absolute; top: 8%; left: 8%; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%; filter: blur(50px);"></div>
      <div style="position: absolute; bottom: 15%; right: 10%; width: 140px; height: 140px; background: rgba(255,255,255,0.05); border-radius: 50%; filter: blur(40px);"></div>
      <!-- Steam wisps -->
      <div style="position: absolute; top: 8%; left: 50%; transform: translateX(-50%); display: flex; gap: 12px; opacity: 0.12;">
        <div style="width: 2px; height: 40px; background: linear-gradient(to top, #fff, transparent); border-radius: 50px; animation: catSteam 2.5s ease-in-out infinite;"></div>
        <div style="width: 2px; height: 48px; background: linear-gradient(to top, #fff, transparent); border-radius: 50px; animation: catSteam 3s ease-in-out 0.4s infinite;"></div>
        <div style="width: 2px; height: 32px; background: linear-gradient(to top, #fff, transparent); border-radius: 50px; animation: catSteam 2s ease-in-out 0.8s infinite;"></div>
      </div>
      <!-- Content -->
      <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
        <!-- Breadcrumb -->
        <nav style="margin-bottom: 20px; animation: catSlideIn 0.5s ease-out 0.05s both;" aria-label="Breadcrumb">
          <ol style="display: flex; align-items: center; gap: 5px; list-style: none; padding: 0; margin: 0;">
            <li><a routerLink="/" style="color: rgba(255,255,255,0.7); text-decoration: none; font-size: 13px; transition: color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">Home</a></li>
            <li><span class="material-icons" style="font-size: 14px; color: rgba(255,255,255,0.4);">chevron_right</span></li>
            <li><a routerLink="/meals" style="color: rgba(255,255,255,0.7); text-decoration: none; font-size: 13px; transition: color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">Meals</a></li>
            <li><span class="material-icons" style="font-size: 14px; color: rgba(255,255,255,0.4);">chevron_right</span></li>
            <li style="color: #86efac; font-weight: 600; font-size: 13px;">{{ category()?.name || 'Category' }}</li>
          </ol>
        </nav>
        <!-- Category Info -->
        @if (loadingCategory()) {
          <div style="display: flex; align-items: center; gap: 20px; animation: catSlideIn 0.5s ease-out 0.1s both;">
            <div style="width: 72px; height: 72px; background: rgba(255,255,255,0.15); border-radius: 20px;"></div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="width: 180px; height: 28px; background: rgba(255,255,255,0.15); border-radius: 8px;"></div>
              <div style="width: 260px; height: 16px; background: rgba(255,255,255,0.1); border-radius: 6px;"></div>
            </div>
          </div>
        } @else if (category()) {
          <div style="display: flex; align-items: center; gap: 20px; animation: catSlideIn 0.5s ease-out 0.1s both;">
            @if (category()!.icon || category()!.image) {
              <div style="width: 72px; height: 72px; background: rgba(255,255,255,0.15); border-radius: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(8px);">
                @if (category()!.icon) {
                  <span class="material-icons" style="font-size: 36px; color: white;">{{ category()!.icon }}</span>
                } @else {
                  <span style="font-size: 36px;">&#127860;</span>
                }
              </div>
            }
            <div>
              <h1 style="font-size: clamp(1.6rem, 3.5vw, 2.2rem); font-weight: 800; color: white; margin: 0 0 6px 0;">{{ category()!.name }}</h1>
              @if (category()!.description) {
                <p style="font-size: 0.9rem; color: rgba(255,255,255,0.85); margin: 0 0 8px 0; max-width: 500px; line-height: 1.6;">{{ category()!.description }}</p>
              }
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; background: rgba(255,255,255,0.15); border-radius: 20px; font-size: 12px; font-weight: 600; color: white; border: 1px solid rgba(255,255,255,0.2);">
                  <span class="material-icons" style="font-size: 14px;">restaurant</span>
                  {{ totalMeals() }} {{ totalMeals() === 1 ? 'meal' : 'meals' }}
                </span>
              </div>
            </div>
          </div>
        }
      </div>
      <!-- Wave divider -->
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 50px; display: block;" viewBox="0 0 1440 50" preserveAspectRatio="none">
        <path d="M0,25 C360,50 1080,0 1440,25 L1440,50 L0,50 Z" fill="white"/>
      </svg>
    </section>

    <!-- Main Content -->
    <div style="max-width: 1200px; margin: 0 auto; padding: 32px 24px 60px;">

      <!-- Meals Loading Skeleton -->
      @if (loadingMeals()) {
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;" class="cat-meals-grid">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div style="background: white; border-radius: 16px; border: 1px solid #f3f4f6; overflow: hidden; animation: catSlideIn 0.5s ease-out;" class="cat-skel-card">
              <div style="height: 180px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); position: relative; overflow: hidden;">
                <div style="position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); animation: shimmer 1.5s infinite;"></div>
              </div>
              <div style="padding: 16px; display: flex; flex-direction: column; gap: 10px;">
                <div style="width: 75%; height: 16px; background: #f3f4f6; border-radius: 6px;"></div>
                <div style="width: 50%; height: 14px; background: #f9fafb; border-radius: 5px;"></div>
                <div style="width: 35%; height: 20px; background: #ecfdf5; border-radius: 6px;"></div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Meals Grid -->
      @if (!loadingMeals() && meals().length > 0) {
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;" class="cat-meals-grid">
          @for (meal of meals(); track meal.id; let i = $index) {
            <div [style]="'animation: catCardIn 0.4s ease-out ' + (i * 0.06) + 's both;'">
              <app-meal-card [meal]="meal" (onAddToCart)="addToCart($event)" (onBuyNow)="buyNow($event)" />
            </div>
          }
        </div>

        <!-- Pagination -->
        @if (pagination()) {
          <div style="margin-top: 32px; animation: catSlideIn 0.5s ease-out 0.4s both;">
            <app-customer-pagination
              [meta]="pagination()!"
              (pageChange)="onPageChange($event)"
            />
          </div>
        }
      }

      <!-- Empty State -->
      @if (!loadingMeals() && !loadingCategory() && meals().length === 0 && category()) {
        <div style="text-align: center; padding: 60px 20px; animation: catSlideIn 0.5s ease-out 0.2s both;">
          <div style="animation: catPlateFloat 3s ease-in-out infinite; display: inline-block; margin-bottom: 16px;">
            <span class="material-icons" style="font-size: 64px; color: #d1fae5;">restaurant</span>
          </div>
          <h3 style="font-size: 1.3rem; font-weight: 700; color: #166534; margin: 0 0 8px 0;">No meals in this category</h3>
          <p style="color: #6b7280; font-size: 0.9rem; margin: 0 0 24px 0; max-width: 400px; margin-left: auto; margin-right: auto; line-height: 1.6;">We don't have any meals available in this category right now. Check back soon!</p>
          <a routerLink="/meals"
             style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; background: linear-gradient(135deg, #059669, #16a34a); color: white; font-weight: 700; border-radius: 12px; text-decoration: none; font-size: 0.9rem; box-shadow: 0 4px 16px rgba(5,150,105,0.3); transition: all 0.3s ease;"
             onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 24px rgba(5,150,105,0.4)';"
             onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 16px rgba(5,150,105,0.3)';">
            <span class="material-icons" style="font-size: 18px;">restaurant_menu</span>
            Browse All Meals
          </a>
        </div>
      }

      <!-- Category Not Found -->
      @if (!loadingCategory() && !category()) {
        <div style="text-align: center; padding: 80px 20px; animation: catSlideIn 0.5s ease-out 0.2s both;">
          <div style="animation: catPlateFloat 3s ease-in-out infinite; display: inline-block; margin-bottom: 16px;">
            <span style="font-size: 72px; display: block; opacity: 0.6;">&#127860;</span>
          </div>
          <h3 style="font-size: 1.3rem; font-weight: 700; color: #166534; margin: 0 0 8px 0;">Category not found</h3>
          <p style="color: #6b7280; font-size: 0.9rem; margin: 0 0 24px 0; max-width: 400px; margin-left: auto; margin-right: auto; line-height: 1.6;">The category you're looking for doesn't exist or has been removed.</p>
          <a routerLink="/meals"
             style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; background: linear-gradient(135deg, #059669, #16a34a); color: white; font-weight: 700; border-radius: 12px; text-decoration: none; font-size: 0.9rem; box-shadow: 0 4px 16px rgba(5,150,105,0.3); transition: all 0.3s ease;"
             onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 24px rgba(5,150,105,0.4)';"
             onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 16px rgba(5,150,105,0.3)';">
            <span class="material-icons" style="font-size: 18px;">restaurant_menu</span>
            Browse All Meals
          </a>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes catHeroFloat {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-16px) rotate(5deg); }
    }
    @keyframes catSteam {
      0% { opacity: 0; transform: translateY(0) scaleX(1); }
      50% { opacity: 0.2; transform: translateY(-20px) scaleX(1.3); }
      100% { opacity: 0; transform: translateY(-45px) scaleX(1.6); }
    }
    @keyframes catSlideIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes catCardIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes catPlateFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @media (max-width: 1023px) {
      .cat-meals-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
    @media (max-width: 639px) {
      .cat-meals-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `],
})
export class CategoryDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private browseApi = inject(CustomerBrowseApiService);
  private seo = inject(SeoService);
  private appState = inject(AppStateService);
  private cartState = inject(CartStateService);
  private destroy$ = new Subject<void>();

  category = signal<MealCategory | null>(null);
  meals = signal<Meal[]>([]);
  pagination = signal<PaginationMeta | null>(null);
  loadingCategory = signal(true);
  loadingMeals = signal(true);
  totalMeals = signal(0);
  currentPage = 1;
  private perPage = 12;

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      switchMap((params) => {
        const slug = params.get('slug') || '';
        this.loadingCategory.set(true);
        this.loadingMeals.set(true);
        this.currentPage = 1;
        return this.browseApi.getCategoryBySlug(slug).pipe(
          catchError((): Observable<ApiResponse<MealCategory> | null> => {
            this.loadingCategory.set(false);
            return of(null);
          })
        );
      })
    ).subscribe((res: ApiResponse<MealCategory> | null) => {
      this.loadingCategory.set(false);
      if (res && res.success && res.data) {
        this.category.set(res.data);
        this.seo.setPageTitle(`${res.data.name} - Meal Category`, res.data.description || `Browse our ${res.data.name} meals - fresh, healthy tiffin meals`);
        this.loadMeals(res.data.id);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMeals(categoryId: number): void {
    this.loadingMeals.set(true);
    this.browseApi.getMeals({ category_id: categoryId, page: this.currentPage, per_page: this.perPage }).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loadingMeals.set(false))
    ).subscribe({
      next: (res: PaginatedResponse<Meal>) => {
        if (res.success && res.data) {
          this.meals.set(res.data);
          if (res.meta) {
            this.pagination.set(res.meta);
            this.totalMeals.set(res.meta.total);
          }
        }
      },
      error: () => {},
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    const cat = this.category();
    if (cat) {
      this.loadMeals(cat.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  addToCart(meal: Meal): void {
    if (!this.appState.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/categories/${this.category()?.slug || ''}` } });
      return;
    }
    this.cartState.addItem(meal.id, 1, meal.name);
  }

  buyNow(meal: Meal): void {
    if (!this.appState.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/categories/${this.category()?.slug || ''}` } });
      return;
    }
    this.cartState.addItem(meal.id, 1, meal.name);
    this.router.navigate(['/cart']);
  }
}
