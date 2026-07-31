import { Component, Input, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, switchMap, of, catchError } from 'rxjs';
import { CustomerReviewApiService } from '../../../../../../core/services/customer-review-api.service';
import { AppStateService } from '../../../../../../core/services/app-state.service';
import { CustomerAuthService } from '../../../../../../core/services/customer-auth.service';
import { ReviewSummaryComponent } from '../../../../../../shared/components/review-summary/review-summary.component';
import { ReviewCardComponent } from '../../../../../../shared/components/review-card/review-card.component';
import { ReviewFormComponent } from '../../../../../../shared/components/review-form/review-form.component';
import { SkeletonLoaderComponent } from '../../../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { Review, ReviewSummary, ReviewListParams, ReviewEligibility } from '../../../../../../core/models/review/review.model';

@Component({
  selector: 'app-meal-reviews',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ReviewSummaryComponent, ReviewCardComponent, ReviewFormComponent,
    SkeletonLoaderComponent,
  ],
  template: `
    <div class="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
      <div class="flex items-center gap-2 mb-5">
        <span class="material-icons text-amber-500">reviews</span>
        <h3 class="text-lg font-semibold text-gray-900">Customer Reviews</h3>
      </div>

      @if (loading()) {
        <div class="space-y-4">
          <div class="animate-pulse">
            <div class="flex gap-6 mb-6">
              <div class="w-24 h-24 bg-gray-200 rounded"></div>
              <div class="flex-1 space-y-2">
                @for (i of [1,2,3,4,5]; track i) {
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-3 bg-gray-200 rounded"></div>
                    <div class="flex-1 h-3 bg-gray-100 rounded"></div>
                    <div class="w-8 h-3 bg-gray-200 rounded"></div>
                  </div>
                }
              </div>
            </div>
          </div>
          @for (i of [1,2,3]; track i) {
            <div class="animate-pulse border border-gray-100 rounded-xl p-4">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div class="space-y-1">
                  <div class="h-3 bg-gray-200 rounded w-24"></div>
                  <div class="h-2 bg-gray-100 rounded w-16"></div>
                </div>
              </div>
              <div class="h-3 bg-gray-100 rounded w-full"></div>
              <div class="h-3 bg-gray-100 rounded w-2/3 mt-1"></div>
            </div>
          }
        </div>
      } @else {
        @if (summary()) {
          <div class="mb-6">
            <app-review-summary
              [summary]="summary()!"
              (starFilter)="filterByStar($event)"
            />
          </div>
        }

        <!-- Write Review Section -->
        @if (isLoggedIn()) {
          @if (showForm()) {
            <div class="mb-6">
              <app-review-form
                [existingReview]="editingReview()"
                [submitting]="submitting()"
                (submitReview)="onSubmitReview($event)"
                (cancelEdit)="cancelForm()"
              />
            </div>
          } @else if (eligibility()?.can_review && !customerReview()) {
            <div class="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="material-icons text-amber-600">edit_note</span>
                <p class="text-sm text-amber-800">Have you tried this meal? Share your experience!</p>
              </div>
              <button
                (click)="showForm.set(true)"
                class="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors shrink-0"
              >
                Write Review
              </button>
            </div>
          } @else if (customerReview()) {
            <div class="mb-6">
              <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="material-icons text-indigo-600">check_circle</span>
                  <div>
                    <p class="text-sm text-indigo-800 font-medium">You reviewed this meal</p>
                    <p class="text-xs text-indigo-600">Status: {{ customerReview()!.status_label }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    (click)="startEdit()"
                    class="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          }
        } @else {
          <div class="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="material-icons text-gray-400">login</span>
              <p class="text-sm text-gray-600">Please login to review this meal.</p>
            </div>
            <button
              (click)="goToLogin()"
              class="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Login
            </button>
          </div>
        }

        <!-- Filters -->
        @if (reviews().length > 0 || activeFilter() !== null) {
          <div class="flex flex-wrap gap-2 mb-5">
            <button
              (click)="filterByStar(null)"
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              [class]="activeFilter() === null ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              All ({{ summary()?.total_reviews || 0 }})
            </button>
            @for (star of [5,4,3,2,1]; track star) {
              @if ((summary()?.distribution?.[star]?.count ?? 0) > 0) {
                <button
                  (click)="filterByStar(star)"
                  class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  [class]="activeFilter() === star ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                >
                  {{ star }} Star ({{ summary()!.distribution[star].count }})
                </button>
              }
            }
            <button
              (click)="filterByPhoto()"
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              [class]="activeFilter() === 'photo' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              <span class="material-icons text-xs align-middle mr-0.5">photo_camera</span>
              With Photos
            </button>
          </div>

          <!-- Sort -->
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm text-gray-500">{{ reviews().length }} of {{ summary()?.total_reviews || 0 }} reviews</span>
            <select
              [(ngModel)]="currentSort"
              (ngModelChange)="loadReviews()"
              class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        }

        <!-- Reviews List -->
        <div class="space-y-4">
          @for (review of reviews(); track review.uuid) {
            <app-review-card
              [review]="review"
              (photoClick)="openPhoto($event)"
            />
          } @empty {
            @if (activeFilter() !== null) {
              <div class="text-center py-10">
                <span class="material-icons text-4xl text-gray-200 mb-3">filter_list_off</span>
                <p class="text-gray-500 text-sm">No reviews match this filter.</p>
              </div>
            } @else {
              <div class="text-center py-10">
                <span class="material-icons text-5xl text-gray-200 mb-3">rate_review</span>
                <p class="text-gray-500 font-medium">No reviews yet.</p>
                <p class="text-gray-400 text-sm mt-1">Be the first customer to review this meal after ordering.</p>
              </div>
            }
          }
        </div>

        <!-- Pagination -->
        @if (totalPages() > 1) {
          <div class="flex items-center justify-center gap-2 mt-6">
            <button
              (click)="goToPage(currentPage() - 1)"
              [disabled]="currentPage() <= 1"
              class="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <span class="material-icons text-lg">chevron_left</span>
            </button>
            <span class="text-sm text-gray-600 px-3">
              Page {{ currentPage() }} of {{ totalPages() }}
            </span>
            <button
              (click)="goToPage(currentPage() + 1)"
              [disabled]="currentPage() >= totalPages()"
              class="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <span class="material-icons text-lg">chevron_right</span>
            </button>
          </div>
        }
      }
    </div>

    <!-- Photo Lightbox -->
    @if (lightboxPhoto()) {
      <div
        class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        (click)="closeLightbox()"
        role="dialog"
        aria-label="Photo preview"
      >
        <button
          (click)="closeLightbox()"
          class="absolute top-4 right-4 w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-10"
          aria-label="Close"
        >
          <span class="material-icons">close</span>
        </button>
        <img
          [src]="lightboxPhoto()"
          class="max-w-full max-h-full object-contain rounded-xl"
          (click)="$event.stopPropagation()"
          alt="Review photo preview"
        />
      </div>
    }
  `,
})
export class MealReviewsComponent implements OnInit, OnDestroy {
  @Input() mealId!: number;
  @Input() mealSlug = '';

  private reviewApi = inject(CustomerReviewApiService);
  private appState = inject(AppStateService);
  private authService = inject(CustomerAuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  reviews = signal<Review[]>([]);
  summary = signal<ReviewSummary | null>(null);
  customerReview = signal<Review | null>(null);
  eligibility = signal<ReviewEligibility | null>(null);
  loading = signal(true);
  submitting = signal(false);
  showForm = signal(false);
  editingReview = signal<Review | null>(null);
  activeFilter = signal<number | string | null>(null);
  currentPage = signal(1);
  totalPages = signal(1);
  lightboxPhoto = signal<string | null>(null);
  currentSort: ReviewListParams['sort'] = 'newest';

  isLoggedIn = computed(() => this.appState.isLoggedIn());

  ngOnInit(): void {
    this.loadReviews();
    if (this.isLoggedIn()) {
      this.checkEligibility();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReviews(): void {
    this.loading.set(true);
    const params: ReviewListParams = {
      page: this.currentPage(),
      per_page: 10,
      sort: this.currentSort,
    };

    const filter = this.activeFilter();
    if (typeof filter === 'number') {
      params.rating = filter;
    } else if (filter === 'photo') {
      params.with_photo = true;
    }

    this.reviewApi.getMealReviews(this.mealSlug, params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          if (res.success) {
            this.reviews.set(res.data || []);
            this.summary.set(res.summary || null);
            this.customerReview.set(res.customer_review || null);
            this.currentPage.set(res.meta?.current_page || 1);
            this.totalPages.set(res.meta?.last_page || 1);
          }
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  checkEligibility(): void {
    this.reviewApi.getEligibilityByMeal(this.mealSlug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.eligibility.set(res.data);
            if (res.data.existing_review) {
              this.customerReview.set(res.data.existing_review);
            }
          }
        },
      });
  }

  filterByStar(star: number | null): void {
    this.activeFilter.set(star);
    this.currentPage.set(1);
    this.loadReviews();
  }

  filterByPhoto(): void {
    this.activeFilter.set(this.activeFilter() === 'photo' ? null : 'photo');
    this.currentPage.set(1);
    this.loadReviews();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadReviews();
  }

  startEdit(): void {
    this.editingReview.set(this.customerReview());
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingReview.set(null);
  }

  onSubmitReview(event: { formData: FormData }): void {
    this.submitting.set(true);

    const editing = this.editingReview();
    if (editing) {
      event.formData.append('_method', 'PUT');
      this.reviewApi.updateReview(editing.uuid, event.formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.submitting.set(false);
            this.showForm.set(false);
            this.editingReview.set(null);
            this.loadReviews();
            this.checkEligibility();
          },
          error: (err) => {
            this.submitting.set(false);
            if (err.status === 422) {
              const errors = err.error?.errors;
              if (errors) {
                const first = Object.values(errors)[0];
                if (Array.isArray(first)) {
                  alert(first[0]);
                }
              }
            } else {
              alert(err.error?.message || 'Failed to update review.');
            }
          },
        });
    } else {
      const mealId = this.mealId;
      event.formData.append('meal_id', String(mealId));
      this.reviewApi.createReview(event.formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.submitting.set(false);
            this.showForm.set(false);
            this.loadReviews();
            this.checkEligibility();
          },
          error: (err) => {
            this.submitting.set(false);
            if (err.status === 409) {
              alert('You have already reviewed this meal.');
              this.checkEligibility();
            } else if (err.status === 422) {
              const errors = err.error?.errors;
              if (errors) {
                const first = Object.values(errors)[0];
                if (Array.isArray(first)) {
                  alert(first[0]);
                }
              }
            } else if (err.status === 429) {
              alert('Too many requests. Please try again later.');
            } else {
              alert(err.error?.message || 'Failed to submit review.');
            }
          },
        });
    }
  }

  openPhoto(url: string): void {
    this.lightboxPhoto.set(url);
  }

  closeLightbox(): void {
    this.lightboxPhoto.set(null);
  }

  goToLogin(): void {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: `/meals/${this.mealSlug}` },
    });
  }
}
