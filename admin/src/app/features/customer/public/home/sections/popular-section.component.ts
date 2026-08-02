import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CustomerBrowseApiService } from '../../../../../core/services/customer-browse-api.service';
import { AppStateService } from '../../../../../core/services/app-state.service';
import { CartStateService } from '../../../../../core/services/cart-state.service';
import { Meal } from '../../../../../core/models/meal/meal.model';
import { MealCardComponent } from '../../../../../shared/components/meal-card/meal-card.component';
import { SkeletonLoaderComponent } from '../../../../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-popular-section',
  standalone: true,
  imports: [CommonModule, RouterModule, MealCardComponent, SkeletonLoaderComponent],
  template: `
    <section class="bg-slate-100 py-14 sm:py-20 relative" aria-label="Popular meals">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-10 sm:mb-12">
          <div>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/15 text-green-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
              <span class="material-icons text-sm">trending_up</span> Trending
            </span>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2">Popular Meals</h2>
            <p class="text-slate-600 text-sm sm:text-base">Most loved by our customers</p>
          </div>
          @if (meals().length > 0) {
            <a routerLink="/meals" [queryParams]="{ bestseller: 1 }"
               class="hidden sm:inline-flex items-center gap-1.5 text-emerald-600 font-semibold text-sm hover:text-emerald-700 hover:gap-2.5 transition-all duration-300">
              View All <span class="material-icons text-base">arrow_forward</span>
            </a>
          }
        </div>

        @if (loading()) {
          <div class="app-scroll-row">
            @for (i of [1,2,3,4]; track i) {
              <app-skeleton-loader type="card"></app-skeleton-loader>
            }
          </div>
        } @else if (meals().length === 0) {
          <div class="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <span class="material-icons text-5xl text-slate-300 mb-3">trending_up</span>
            <p class="text-slate-500 text-sm">Popular meals will appear here soon.</p>
          </div>
        } @else {
          <div class="app-scroll-row">
            @for (meal of meals(); track meal.id; let i = $index) {
              <app-meal-card [meal]="meal" (onAddToCart)="addToCart($event)" (onBuyNow)="buyNow($event)"></app-meal-card>
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class PopularSectionComponent implements OnInit {
  private browseApi = inject(CustomerBrowseApiService);
  private router = inject(Router);
  private appState = inject(AppStateService);
  private cartState = inject(CartStateService);
  meals = signal<Meal[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.browseApi.getMeals({ per_page: 8, sort: 'display_order', order: 'asc', bestseller: 1 }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) this.meals.set(res.data);
      },
      error: () => this.loading.set(false),
    });
  }

  addToCart(meal: Meal): void {
    if (!this.appState.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/' } });
      return;
    }
    this.cartState.addItem(meal.id, 1, meal.name);
  }

  buyNow(meal: Meal): void {
    if (!this.appState.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/' } });
      return;
    }
    this.cartState.addItem(meal.id, 1, meal.name);
    this.router.navigate(['/cart']);
  }
}
