import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerBrowseApiService } from '../../../../../core/services/customer-browse-api.service';
import { MealCategory } from '../../../../../core/models/meal/meal-category.model';

@Component({
  selector: 'app-category-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="bg-slate-100 py-14 sm:py-20" aria-label="Meal categories">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10 sm:mb-14">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 text-emerald-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
            <span class="material-icons text-sm">category</span> Categories
          </span>
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">Explore Meal Categories</h2>
          <p class="text-slate-600 max-w-lg mx-auto text-sm sm:text-base">Find the perfect meal for every occasion</p>
        </div>

        @if (loading()) {
          <div class="flex gap-4 overflow-hidden">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="min-w-[140px] sm:min-w-0 bg-white rounded-2xl p-5 sm:p-6 text-center border border-slate-200 animate-pulse flex-shrink-0 shadow-sm">
                <div class="w-14 h-14 sm:w-16 sm:h-16 bg-slate-200 rounded-2xl mx-auto mb-3"></div>
                <div class="h-4 bg-slate-200 rounded w-20 mx-auto"></div>
              </div>
            }
          </div>
        } @else if (categories().length === 0) {
          <div class="text-center py-12 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <span class="material-icons text-5xl text-slate-300 mb-3">category</span>
            <p class="text-slate-500 text-sm">No categories available yet.</p>
          </div>
        } @else {
          <div class="flex gap-4 overflow-x-auto pb-4 sm:pb-0 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:overflow-visible scrollbar-hide">
            @for (cat of categories(); track cat.id; let i = $index) {
              <a [routerLink]="'/categories/' + cat.slug"
                 class="group flex-shrink-0 min-w-[130px] sm:min-w-0 bg-white rounded-2xl p-5 sm:p-6 text-center border border-slate-200 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer hover:-translate-y-1 shadow-sm">
                <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl mx-auto mb-3 sm:mb-4 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                     [style.background]="cat.color_code ? 'linear-gradient(135deg, ' + cat.color_code + '20, ' + cat.color_code + '40)' : 'linear-gradient(135deg, #ecfdf5, #d1fae5)'">
                  @if (cat.icon) {
                    <span class="material-icons text-2xl sm:text-3xl" [style.color]="cat.color_code || '#059669'">{{ cat.icon }}</span>
                  } @else {
                    <span class="text-2xl sm:text-3xl">🍽️</span>
                  }
                </div>
                <h3 class="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">{{ cat.name }}</h3>
                @if (cat.description) {
                  <p class="text-xs text-slate-500 mt-1.5 line-clamp-1">{{ cat.description }}</p>
                }
              </a>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `],
})
export class CategorySectionComponent implements OnInit {
  private browseApi = inject(CustomerBrowseApiService);
  categories = signal<MealCategory[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.browseApi.getCategories().subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) this.categories.set(res.data);
      },
      error: () => this.loading.set(false),
    });
  }
}
