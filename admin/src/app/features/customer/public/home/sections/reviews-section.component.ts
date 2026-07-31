import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerBrowseApiService } from '../../../../../core/services/customer-browse-api.service';

@Component({
  selector: 'app-reviews-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="bg-white py-14 sm:py-20 relative overflow-hidden" aria-label="Customer reviews">
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-orange-100/30 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-10 sm:mb-12">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/15 text-orange-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
            <span class="material-icons text-sm">rate_review</span> Testimonials
          </span>
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">What Our Customers Say</h2>
          <p class="text-slate-600 max-w-lg mx-auto text-sm sm:text-base">Real reviews from real customers who love our tiffin service</p>
        </div>

        @if (loading()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            @for (i of [1,2,3]; track i) {
              <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 animate-pulse">
                <div class="flex gap-1 mb-3">
                  @for (s of [1,2,3,4,5]; track s) {
                    <div class="w-5 h-5 bg-slate-200 rounded"></div>
                  }
                </div>
                <div class="space-y-2 mb-4">
                  <div class="h-3 bg-slate-200 rounded w-full"></div>
                  <div class="h-3 bg-slate-200 rounded w-4/5"></div>
                </div>
                <div class="flex items-center gap-3 pt-3 border-t border-slate-200">
                  <div class="w-10 h-10 bg-slate-200 rounded-full"></div>
                  <div class="space-y-1.5">
                    <div class="h-3 bg-slate-200 rounded w-24"></div>
                    <div class="h-2.5 bg-slate-100 rounded w-16"></div>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else if (reviews().length === 0) {
          <div class="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200 shadow-sm">
            <span class="material-icons text-5xl text-slate-300 mb-3">rate_review</span>
            <p class="text-slate-500 text-sm">No reviews yet. Be the first to share your experience!</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            @for (review of reviews(); track review.id; let i = $index) {
              <div class="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col hover:-translate-y-1">
                <div class="flex items-center gap-1 mb-3">
                  @for (star of [1,2,3,4,5]; track star) {
                    <span class="material-icons text-lg"
                          [class]="star <= review.rating ? 'text-amber-400' : 'text-slate-300'">
                      {{ star <= review.rating ? 'star' : 'star_border' }}
                    </span>
                  }
                  <span class="ml-1 text-xs text-slate-500 font-medium">{{ review.rating }}.0</span>
                </div>

                @if (review.title) {
                  <h4 class="font-bold text-slate-900 text-sm mb-1">{{ review.title }}</h4>
                }

                <p class="text-slate-700 text-sm leading-relaxed mb-4 flex-1 line-clamp-4">
                  @if (review.comment) {
                    "{{ review.comment }}"
                  } @else {
                    "Great experience! Highly recommended."
                  }
                </p>

                <div class="flex items-center gap-3 pt-3 border-t border-slate-200">
                  @if (review.customer?.avatar) {
                    <img [src]="review.customer.avatar" [alt]="review.customer?.full_name"
                         class="w-10 h-10 rounded-full object-cover ring-2 ring-orange-200" />
                  } @else {
                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ring-2 ring-orange-200"
                         [style.background]="getAvatarColor(review.customer?.full_name || 'U')">
                      {{ (review.customer?.full_name || 'U').charAt(0) }}
                    </div>
                  }
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold text-slate-900 truncate">{{ review.customer?.full_name || 'Customer' }}</p>
                    @if (review.is_verified_purchase) {
                      <p class="text-xs text-green-600 flex items-center gap-1 font-medium">
                        <span class="material-icons text-xs">verified</span> Verified Purchase
                      </p>
                    }
                  </div>
                  @if (review.meal) {
                    <span class="text-xs text-slate-500 truncate max-w-[100px] bg-orange-50 px-2 py-1 rounded-full border border-orange-100" [title]="review.meal.name">{{ review.meal.name }}</span>
                  }
                </div>
              </div>
            }
          </div>
        }

        @if (reviews().length > 0) {
          <div class="text-center mt-10">
            <a routerLink="/meals"
               class="inline-flex items-center gap-1.5 text-teal-600 font-semibold text-sm hover:text-teal-700 hover:gap-2.5 transition-all duration-300">
              Order Now & Share Your Experience <span class="material-icons text-base">arrow_forward</span>
            </a>
          </div>
        }
      </div>
    </section>
  `,
})
export class ReviewsSectionComponent implements OnInit {
  private browseApi = inject(CustomerBrowseApiService);
  reviews = signal<any[]>([]);
  loading = signal(true);

  private avatarColors = ['#F97316', '#6366F1', '#10B981', '#EC4899', '#8B5CF6', '#14B8A6', '#F59E0B', '#EF4444'];

  ngOnInit(): void {
    this.browseApi.getHomeReviews(6).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) this.reviews.set(res.data);
      },
      error: () => this.loading.set(false),
    });
  }

  getAvatarColor(name: string): string {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return this.avatarColors[hash % this.avatarColors.length];
  }
}
