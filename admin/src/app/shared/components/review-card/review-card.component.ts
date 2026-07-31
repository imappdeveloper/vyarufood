import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RatingStarsComponent } from '../rating-stars/rating-stars.component';
import { Review } from '../../../core/models/review/review.model';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [CommonModule, RouterModule, RatingStarsComponent],
  template: `
    <div class="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 hover:shadow-md transition-shadow duration-200">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
               [style.background]="getAvatarColor()">
            {{ getInitial() }}
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">{{ getDisplayName() }}</p>
            <div class="flex items-center gap-2 flex-wrap">
              <app-rating-stars [rating]="review.rating" size="sm" />
              @if (review.is_verified_purchase) {
                <span class="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <span class="material-icons text-xs">verified</span>
                  Verified Purchase
                </span>
              }
            </div>
          </div>
        </div>
        @if (showActions) {
          <div class="flex items-center gap-1 shrink-0">
            <button
              (click)="edit.emit(review)"
              class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              aria-label="Edit review"
            >
              <span class="material-icons text-lg">edit</span>
            </button>
            <button
              (click)="delete.emit(review)"
              class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              aria-label="Delete review"
            >
              <span class="material-icons text-lg">delete</span>
            </button>
          </div>
        }
      </div>

      @if (review.title) {
        <p class="mt-3 text-sm font-semibold text-gray-900">{{ review.title }}</p>
      }
      @if (review.comment) {
        <p class="mt-1 text-sm text-gray-600 leading-relaxed whitespace-pre-line">{{ review.comment }}</p>
      }
      @if (review.photo) {
        <div class="mt-3">
          <img
            [src]="review.photo"
            [alt]="'Review photo by ' + getDisplayName()"
            class="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
            (click)="photoClick.emit(review.photo!)"
            loading="lazy"
          />
        </div>
      }

      <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <span class="text-xs text-gray-400">{{ formatDate(review.created_at) }}</span>
        @if (review.meal && showMeal) {
          <a [routerLink]="['/meals', review.meal.slug]" class="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors">
            {{ review.meal.name }}
          </a>
        }
      </div>

      @if (review.admin_response) {
        <div class="mt-4 bg-indigo-50 rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-icons text-indigo-600 text-base">storefront</span>
            <span class="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Business Response</span>
          </div>
          <p class="text-sm text-indigo-900 leading-relaxed">{{ review.admin_response }}</p>
        </div>
      }

      @if (review.status === 'rejected' && review.rejection_reason && showStatus) {
        <div class="mt-3 bg-red-50 rounded-xl p-3">
          <p class="text-xs text-red-700">
            <span class="material-icons text-xs align-middle">info</span>
            This review was not approved: {{ review.rejection_reason }}
          </p>
        </div>
      }
      @if (review.status === 'pending' && showStatus) {
        <div class="mt-3 bg-amber-50 rounded-xl p-3">
          <p class="text-xs text-amber-700">
            <span class="material-icons text-xs align-middle">schedule</span>
            This review is awaiting moderation.
          </p>
        </div>
      }
    </div>
  `,
})
export class ReviewCardComponent {
  @Input() review!: Review;
  @Input() showActions = false;
  @Input() showMeal = false;
  @Input() showStatus = false;

  @Output() edit = new EventEmitter<Review>();
  @Output() delete = new EventEmitter<Review>();
  @Output() photoClick = new EventEmitter<string>();

  private nameColors = ['#F97316', '#6366F1', '#10B981', '#EC4899', '#8B5CF6', '#06B6D4', '#EF4444', '#14B8A6'];

  getDisplayName(): string {
    return this.review.customer?.full_name || this.review.customer?.email?.split('@')[0] || 'Anonymous';
  }

  getInitial(): string {
    const name = this.getDisplayName();
    return name.charAt(0).toUpperCase();
  }

  getAvatarColor(): string {
    const name = this.getDisplayName();
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return this.nameColors[Math.abs(hash) % this.nameColors.length];
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay === 1) return 'Yesterday';
    if (diffDay < 30) return `${diffDay}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
