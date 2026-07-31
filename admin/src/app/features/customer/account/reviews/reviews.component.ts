import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CustomerReviewApiService } from '../../../../core/services/customer-review-api.service';
import { SeoService } from '../../../../core/services/seo.service';
import { ReviewCardComponent } from '../../../../shared/components/review-card/review-card.component';
import { ReviewFormComponent } from '../../../../shared/components/review-form/review-form.component';
import { Review, ReviewListParams } from '../../../../core/models/review/review.model';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ReviewCardComponent, ReviewFormComponent,
  ],
  template: `
    <div style="max-width: 900px; margin: 0 auto; padding: 1.5rem 0;">
      <!-- Toast -->
      @if (toast) {
        <div style="position: fixed; top: 24px; right: 24px; z-index: 50; animation: slideIn 0.3s ease-out;">
          <div [style]="getToastStyle(toast.type)">
            <span class="material-icons" style="font-size: 20px;">{{ toast.type === 'success' ? 'check_circle' : 'error' }}</span>
            {{ toast.message }}
            <button (click)="toast = null" style="background: none; border: none; cursor: pointer; opacity: 0.6; padding: 2px;">
              <span class="material-icons" style="font-size: 16px;">close</span>
            </button>
          </div>
        </div>
      }

      <!-- Hero Header -->
      <div style="background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%); border-radius: 20px; padding: 28px 32px; margin-bottom: 24px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.08);"></div>
        <div style="position: absolute; bottom: -60px; left: 30%; width: 260px; height: 260px; border-radius: 50%; background: rgba(255,255,255,0.05);"></div>
        <div style="position: relative; z-index: 1; display: flex; align-items: center; gap: 12px;">
          <span class="material-icons" style="font-size: 32px; color: rgba(255,255,255,0.9);">rate_review</span>
          <div>
            <p style="color: rgba(255,255,255,0.75); font-size: 13px; font-weight: 500; letter-spacing: 0.5px; margin: 0 0 2px 0;">REVIEWS</p>
            <h1 style="color: #fff; font-size: 26px; font-weight: 700; margin: 0;">My Reviews</h1>
            @if (totalReviews() > 0) {
              <p style="color: rgba(255,255,255,0.85); font-size: 13px; margin: 2px 0 0;">{{ totalReviews() }} review{{ totalReviews() !== 1 ? 's' : '' }}</p>
            }
          </div>
        </div>
      </div>

      <!-- Filters -->
      @if (reviews().length > 0 || activeFilter() !== null) {
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
          <button (click)="setFilter(null)"
            [style]="activeFilter() === null
              ? 'padding: 6px 14px; border-radius: 8px; border: none; font-size: 12px; font-weight: 600; background: #fef3c7; color: #92400e; cursor: pointer; transition: all 0.15s;'
              : 'padding: 6px 14px; border-radius: 8px; border: 1px solid #e5e7eb; font-size: 12px; font-weight: 500; background: #fff; color: #6b7280; cursor: pointer; transition: all 0.15s;'"
            onmouseover="this.style.borderColor='#059669';this.style.color='#059669'"
            onmouseout="this.style.borderColor='#e5e7eb';this.style.color='#6b7280'">
            All
          </button>
          @for (star of [5,4,3,2,1]; track star) {
            <button (click)="setFilter(star)"
              [style]="activeFilter() === star
                ? 'padding: 6px 14px; border-radius: 8px; border: none; font-size: 12px; font-weight: 600; background: #fef3c7; color: #92400e; cursor: pointer; transition: all 0.15s;'
                : 'padding: 6px 14px; border-radius: 8px; border: 1px solid #e5e7eb; font-size: 12px; font-weight: 500; background: #fff; color: #6b7280; cursor: pointer; transition: all 0.15s;'"
              onmouseover="this.style.borderColor='#059669';this.style.color='#059669'"
              onmouseout="this.style.borderColor='#e5e7eb';this.style.color='#6b7280'">
              {{ star }} Star
            </button>
          }
          <button (click)="setFilter('photo')"
            [style]="activeFilter() === 'photo'
              ? 'padding: 6px 14px; border-radius: 8px; border: none; font-size: 12px; font-weight: 600; background: #fef3c7; color: #92400e; cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 4px;'
              : 'padding: 6px 14px; border-radius: 8px; border: 1px solid #e5e7eb; font-size: 12px; font-weight: 500; background: #fff; color: #6b7280; cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 4px;'"
            onmouseover="this.style.borderColor='#059669';this.style.color='#059669'"
            onmouseout="this.style.borderColor='#e5e7eb';this.style.color='#6b7280'">
            <span class="material-icons" style="font-size: 14px;">photo_camera</span>
            With Photos
          </button>
        </div>

        <!-- Sort Bar -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <span style="font-size: 13px; color: #6b7280;">{{ reviews().length }} of {{ totalReviews() }} reviews</span>
          <select [(ngModel)]="currentSort" (ngModelChange)="loadReviews()"
            style="font-size: 13px; border: 1px solid #d1d5db; border-radius: 8px; padding: 6px 12px; color: #374151; outline: none; transition: all 0.2s; background: #fff;" onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 2px rgba(5,150,105,0.15)'" onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      }

      <!-- Loading -->
      @if (loading()) {
        <div style="display: flex; flex-direction: column; gap: 16px;">
          @for (i of [1,2,3]; track i) {
            <div style="background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; padding: 20px;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: #e5e7eb;"></div>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <div style="height: 12px; background: #e5e7eb; border-radius: 4px; width: 120px;"></div>
                  <div style="height: 8px; background: #f3f4f6; border-radius: 4px; width: 80px;"></div>
                </div>
              </div>
              <div style="height: 11px; background: #f3f4f6; border-radius: 4px; width: 100%; margin-bottom: 4px;"></div>
              <div style="height: 11px; background: #f3f4f6; border-radius: 4px; width: 75%;"></div>
            </div>
          }
        </div>
      } @else {
        <!-- Review List -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          @for (review of reviews(); track review.uuid) {
            @if (editingReviewUuid() === review.uuid) {
              <app-review-form
                [existingReview]="review"
                [submitting]="submitting()"
                (submitReview)="onUpdateReview($event)"
                (cancelEdit)="cancelEdit()"
              />
            } @else {
              <app-review-card
                [review]="review"
                [showActions]="true"
                [showMeal]="true"
                [showStatus]="true"
                (edit)="startEdit($event)"
                (delete)="confirmDelete($event)"
                (photoClick)="openPhoto($event)"
              />
            }
          } @empty {
            <div style="background: #fff; border-radius: 20px; padding: 48px 24px; border: 1px solid #e5e7eb; text-align: center;">
              <div style="width: 72px; height: 72px; border-radius: 50%; margin: 0 auto 16px; background: #f0fdf4; display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="font-size: 32px; color: #059669;">rate_review</span>
              </div>
              <h2 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 8px 0;">No reviews yet</h2>
              <p style="font-size: 14px; color: #6b7280; margin: 0;">Rate your meals after ordering to help others!</p>
            </div>
          }
        </div>

        <!-- Pagination -->
        @if (totalPages() > 1) {
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 24px;">
            <button (click)="goToPage(currentPage() - 1)" [disabled]="currentPage() <= 1"
              [style]="'padding: 8px; border-radius: 8px; border: 1px solid #d1d5db; background: #fff; cursor: pointer; color: #6b7280; display: flex; align-items: center; transition: all 0.15s;' + (currentPage() <= 1 ? ' opacity: 0.4; cursor: not-allowed;' : '')"
              onmouseover="if(!this.disabled)this.style.background='#f9fafb'" onmouseout="this.style.background='#fff'" aria-label="Previous page">
              <span class="material-icons" style="font-size: 18px;">chevron_left</span>
            </button>
            <span style="font-size: 13px; color: #6b7280; padding: 0 12px;">Page {{ currentPage() }} of {{ totalPages() }}</span>
            <button (click)="goToPage(currentPage() + 1)" [disabled]="currentPage() >= totalPages()"
              [style]="'padding: 8px; border-radius: 8px; border: 1px solid #d1d5db; background: #fff; cursor: pointer; color: #6b7280; display: flex; align-items: center; transition: all 0.15s;' + (currentPage() >= totalPages() ? ' opacity: 0.4; cursor: not-allowed;' : '')"
              onmouseover="if(!this.disabled)this.style.background='#f9fafb'" onmouseout="this.style.background='#fff'" aria-label="Next page">
              <span class="material-icons" style="font-size: 18px;">chevron_right</span>
            </button>
          </div>
        }
      }
    </div>

    <!-- Delete Confirmation Modal -->
    @if (showDeleteModal()) {
      <div (click)="showDeleteModal.set(false)" style="position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 16px;">
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);"></div>
        <div (click)="$event.stopPropagation()" style="position: relative; background: #fff; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); max-width: 420px; width: 100%; padding: 24px; z-index: 10;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: #fef2f2; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="color: #dc2626;">delete</span>
            </div>
            <h3 style="font-size: 16px; font-weight: 600; color: #111827; margin: 0;">Delete Review</h3>
          </div>
          <p style="font-size: 14px; color: #6b7280; margin: 0 0 20px 0;">Are you sure you want to delete this review? This action cannot be undone.</p>
          <div style="display: flex; align-items: center; gap: 12px; justify-content: flex-end;">
            <button (click)="showDeleteModal.set(false)" style="padding: 8px 20px; font-size: 13px; font-weight: 500; color: #374151; border: 1px solid #d1d5db; border-radius: 10px; background: #fff; cursor: pointer; transition: all 0.15s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='#fff'">Cancel</button>
            <button (click)="deleteReview()" [disabled]="deleting()"
              [style]="'padding: 8px 20px; font-size: 13px; font-weight: 600; color: #fff; border-radius: 10px; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s; background: #dc2626;' + (deleting() ? ' opacity: 0.5; cursor: not-allowed;' : '')"
              onmouseover="this.style.background='#b91c1c'" onmouseout="this.style.background='#dc2626'">
              @if (deleting()) {
                <span class="material-icons" style="font-size: 14px; animation: spin 1s linear infinite;">refresh</span>
              }
              Delete
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Photo Lightbox -->
    @if (lightboxPhoto()) {
      <div (click)="closeLightbox()" style="position: fixed; inset: 0; z-index: 50; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; padding: 16px;" role="dialog" aria-label="Photo preview">
        <button (click)="closeLightbox()" style="position: absolute; top: 16px; right: 16px; width: 40px; height: 40px; background: rgba(255,255,255,0.2); color: #fff; border-radius: 50%; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; transition: all 0.15s;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'" aria-label="Close">
          <span class="material-icons">close</span>
        </button>
        <img [src]="lightboxPhoto()" (click)="$event.stopPropagation()" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 12px;" alt="Review photo" />
      </div>
    }
  `,
  styles: [`
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  `],
})
export class ReviewsComponent implements OnInit, OnDestroy {
  private reviewApi = inject(CustomerReviewApiService);
  private seo = inject(SeoService);
  private destroy$ = new Subject<void>();

  reviews = signal<Review[]>([]);
  loading = signal(true);
  submitting = signal(false);
  deleting = signal(false);
  showDeleteModal = signal(false);
  editingReviewUuid = signal<string | null>(null);
  deletingReview = signal<Review | null>(null);
  activeFilter = signal<number | string | null>(null);
  currentPage = signal(1);
  totalPages = signal(1);
  totalReviews = signal(0);
  lightboxPhoto = signal<string | null>(null);
  toast: { message: string; type: 'success' | 'error' } | null = null;
  currentSort: ReviewListParams['sort'] = 'newest';

  ngOnInit(): void {
    this.seo.setPageTitle('My Reviews');
    this.seo.setNoIndex();
    this.loadReviews();
  }

  ngOnDestroy(): void {
    this.seo.clearNoIndex();
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

    this.reviewApi.getMyReviews(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          if (res.success) {
            this.reviews.set(res.data || []);
            this.currentPage.set(res.meta?.current_page || 1);
            this.totalPages.set(res.meta?.last_page || 1);
            this.totalReviews.set(res.meta?.total || 0);
          }
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  setFilter(filter: number | string | null): void {
    this.activeFilter.set(filter);
    this.currentPage.set(1);
    this.loadReviews();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadReviews();
  }

  startEdit(review: Review): void {
    this.editingReviewUuid.set(review.uuid);
  }

  cancelEdit(): void {
    this.editingReviewUuid.set(null);
  }

  onUpdateReview(event: { formData: FormData }): void {
    const uuid = this.editingReviewUuid();
    if (!uuid) return;

    this.submitting.set(true);
    this.reviewApi.updateReview(uuid, event.formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.editingReviewUuid.set(null);
          this.showToast('Review updated successfully.', 'success');
          this.loadReviews();
        },
        error: (err) => {
          this.submitting.set(false);
          if (err.status === 422) {
            const errors = err.error?.errors;
            if (errors) {
              const first = Object.values(errors)[0];
              if (Array.isArray(first)) {
                this.showToast(first[0], 'error');
              }
            }
          } else {
            this.showToast(err.error?.message || 'Failed to update review.', 'error');
          }
        },
      });
  }

  confirmDelete(review: Review): void {
    this.deletingReview.set(review);
    this.showDeleteModal.set(true);
  }

  deleteReview(): void {
    const review = this.deletingReview();
    if (!review) return;

    this.deleting.set(true);
    this.reviewApi.deleteReview(review.uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.deleting.set(false);
          this.showDeleteModal.set(false);
          this.deletingReview.set(null);
          this.showToast('Review deleted successfully.', 'success');
          this.loadReviews();
        },
        error: (err) => {
          this.deleting.set(false);
          this.showDeleteModal.set(false);
          this.showToast(err.error?.message || 'Failed to delete review.', 'error');
        },
      });
  }

  openPhoto(url: string): void {
    this.lightboxPhoto.set(url);
  }

  closeLightbox(): void {
    this.lightboxPhoto.set(null);
  }

  getToastStyle(type: string): string {
    const base = 'display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.12); font-size: 13px; font-weight: 500;';
    if (type === 'success') {
      return base + ' background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;';
    }
    return base + ' background: #fef2f2; color: #991b1b; border: 1px solid #fecaca;';
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toast = { message, type };
    setTimeout(() => { this.toast = null; }, 3000);
  }
}
