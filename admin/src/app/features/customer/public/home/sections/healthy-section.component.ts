import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerBrowseApiService } from '../../../../../core/services/customer-browse-api.service';
import { Meal } from '../../../../../core/models/meal/meal.model';

@Component({
  selector: 'app-healthy-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="bg-white py-14 sm:py-20 relative overflow-hidden" aria-label="Healthy meals">
      <div class="absolute bottom-0 left-0 w-80 h-80 bg-green-100/50 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="flex items-end justify-between mb-10 sm:mb-12">
          <div>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/15 text-green-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
              <span class="material-icons text-sm">eco</span> Healthy
            </span>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2">Healthy Meals</h2>
            <p class="text-slate-600 text-sm sm:text-base">Nutritious options for a healthier lifestyle</p>
          </div>
          @if (meals().length > 0) {
            <a routerLink="/meals"
               class="hidden sm:inline-flex items-center gap-1.5 text-emerald-600 font-semibold text-sm hover:text-emerald-700 hover:gap-2.5 transition-all duration-300">
              View All <span class="material-icons text-base">arrow_forward</span>
            </a>
          }
        </div>

        @if (loading()) {
          <div class="app-scroll-row">
            @for (i of [1,2,3,4]; track i) {
              <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse shadow-sm">
                <div class="h-44 bg-slate-200"></div>
                <div class="p-4 space-y-2">
                  <div class="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div class="h-3 bg-slate-100 rounded w-full"></div>
                  <div class="h-5 bg-slate-200 rounded w-20"></div>
                </div>
              </div>
            }
          </div>
        } @else if (meals().length === 0) {
          <div class="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200 shadow-sm">
            <span class="material-icons text-5xl text-slate-300 mb-3">spa</span>
            <p class="text-slate-500 text-sm">Healthy meal options will appear here.</p>
          </div>
        } @else {
          <div class="app-scroll-row">
            @for (meal of meals(); track meal.id; let i = $index) {
              <a [routerLink]="['/meals', meal.slug]" class="group block bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-green-300 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1 shadow-sm">
                <div class="relative h-44 bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
                  @if (meal.meal_image) {
                    <img [src]="meal.meal_image" [alt]="meal.name" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  } @else {
                    <div class="w-full h-full flex items-center justify-center">
                      <span class="text-5xl group-hover:scale-110 transition-transform duration-300">🥗</span>
                    </div>
                  }
                  <span class="absolute top-3 left-3 px-2.5 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-sm flex items-center gap-1">
                    <span class="material-icons text-xs">eco</span> Healthy
                  </span>
                </div>
                <div class="p-4">
                  <h3 class="font-bold text-slate-900 group-hover:text-green-600 transition-colors line-clamp-1">{{ meal.name }}</h3>
                  <p class="text-sm text-slate-600 mt-1 line-clamp-1">{{ meal.short_description }}</p>
                  <div class="flex items-center gap-2 mt-3">
                    @if (meal.calories) {
                      <span class="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full font-medium">
                        <span class="material-icons text-xs">local_fire_department</span>
                        {{ meal.calories }} cal
                      </span>
                    }
                    @if (meal.protein) {
                      <span class="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-full font-medium">{{ meal.protein }}g protein</span>
                    }
                  </div>
                  <div class="mt-3 flex items-center justify-between pt-3 border-t border-slate-100">
                    <span class="text-lg font-extrabold text-slate-900">₹{{ meal.effective_price || meal.price }}</span>
                    <span class="text-xs text-slate-500 flex items-center gap-1">
                      <span class="material-icons text-xs">schedule</span> {{ meal.preparation_time || '-' }} min
                    </span>
                  </div>
                </div>
              </a>
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class HealthySectionComponent implements OnInit {
  private browseApi = inject(CustomerBrowseApiService);
  meals = signal<Meal[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.browseApi.getMeals({ per_page: 8, sort: 'calories', order: 'asc', recommended: 1 }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) this.meals.set(res.data);
      },
      error: () => this.loading.set(false),
    });
  }
}
