import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingStarsComponent } from '../rating-stars/rating-stars.component';
import { ReviewSummary } from '../../../core/models/review/review.model';

@Component({
  selector: 'app-review-summary',
  standalone: true,
  imports: [CommonModule, RatingStarsComponent],
  template: `
    @if (summary) {
      <div class="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
        <div class="flex flex-col sm:flex-row gap-6 sm:gap-8">
          <div class="flex flex-col items-center sm:items-start shrink-0">
            <span class="text-5xl font-bold text-gray-900">{{ summary.average_rating | number:'1.1-1' }}</span>
            <div class="mt-1">
              <app-rating-stars [rating]="summary.average_rating" size="md" />
            </div>
            <span class="text-sm text-gray-500 mt-1">{{ summary.total_reviews }} {{ summary.total_reviews === 1 ? 'review' : 'reviews' }}</span>
          </div>
          <div class="flex-1 space-y-2">
            @for (stars of [5,4,3,2,1]; track stars) {
              <button
                (click)="starFilter.emit(stars)"
                class="flex items-center gap-3 w-full group"
                [attr.aria-label]="'Filter by ' + stars + ' star reviews'"
              >
                <span class="text-sm text-gray-600 w-8 text-right shrink-0">{{ stars }} <span class="material-icons text-xs align-middle">star</span></span>
                <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    [class]="getBarColor(stars)"
                    [style.width.%]="summary.distribution[stars]?.percentage || 0"
                  ></div>
                </div>
                <span class="text-sm text-gray-500 w-12 text-left shrink-0">
                  {{ summary.distribution[stars]?.count || 0 }}
                </span>
              </button>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class ReviewSummaryComponent {
  @Input() summary: ReviewSummary | null = null;
  @Output() readonly starFilter = new EventEmitter<number>();

  getBarColor(stars: number): string {
    switch (stars) {
      case 5: return 'bg-amber-400';
      case 4: return 'bg-amber-300';
      case 3: return 'bg-amber-200';
      case 2: return 'bg-orange-300';
      case 1: return 'bg-red-300';
      default: return 'bg-gray-200';
    }
  }
}
