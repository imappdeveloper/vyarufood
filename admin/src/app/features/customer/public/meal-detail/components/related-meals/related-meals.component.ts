import { Component, Input, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Meal } from '../../../../../../core/models/meal/meal.model';
import { CustomerBrowseApiService } from '../../../../../../core/services/customer-browse-api.service';
import { AppStateService } from '../../../../../../core/services/app-state.service';
import { CartStateService } from '../../../../../../core/services/cart-state.service';
import { MealCardComponent } from '../../../../../../shared/components/meal-card/meal-card.component';
import { SkeletonLoaderComponent } from '../../../../../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-related-meals',
  standalone: true,
  imports: [CommonModule, RouterModule, MealCardComponent, SkeletonLoaderComponent],
  template: `
    @if (loading()) {
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">You Might Also Like</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (i of [1, 2, 3, 4]; track i) {
            <app-skeleton-loader type="card" height="280px" />
          }
        </div>
      </div>
    } @else if (relatedMeals().length > 0) {
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">You Might Also Like</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (meal of relatedMeals(); track meal.id) {
            <app-meal-card [meal]="meal" (onAddToCart)="addToCart($event)" (onBuyNow)="buyNow($event)" />
          }
        </div>
      </div>
    }
  `,
})
export class RelatedMealsComponent implements OnInit {
  @Input() slug = '';

  private browseApi = inject(CustomerBrowseApiService);
  private router = inject(Router);
  private appState = inject(AppStateService);
  private cartState = inject(CartStateService);

  relatedMeals = signal<Meal[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    if (!this.slug) {
      this.loading.set(false);
      return;
    }

    this.browseApi.getRelatedMeals(this.slug).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.relatedMeals.set(res.data);
        }
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  addToCart(meal: Meal): void {
    if (!this.appState.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/meals/${meal.slug}` } });
      return;
    }
    this.cartState.addItem(meal.id, 1, meal.name);
  }

  buyNow(meal: Meal): void {
    if (!this.appState.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/meals/${meal.slug}` } });
      return;
    }
    this.cartState.addItem(meal.id, 1, meal.name);
    this.router.navigate(['/cart']);
  }
}
