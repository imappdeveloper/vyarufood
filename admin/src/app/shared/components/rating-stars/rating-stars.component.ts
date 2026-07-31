import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inline-flex items-center gap-1">
      @for (star of [1,2,3,4,5]; track star) {
        <span class="material-icons" [class]="star <= roundedRating ? 'text-amber-400' : 'text-gray-200'" [style.fontSize]="sizePx + 'px'">
          {{ star <= roundedRating ? 'star' : (star - 0.5 <= rating ? 'star_half' : 'star_border') }}
        </span>
      }
      @if (showValue) {
        <span class="ml-1 text-sm" [class]="valueClass">{{ rating | number:'1.1-1' }}</span>
      }
      @if (count !== undefined) {
        <span class="text-xs text-gray-400 ml-0.5">({{ count }})</span>
      }
    </div>
  `,
})
export class RatingStarsComponent {
  @Input() rating = 0;
  @Input() count?: number;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showValue = false;

  get roundedRating(): number {
    return Math.floor(this.rating);
  }

  get sizePx(): number {
    switch (this.size) {
      case 'sm': return 16;
      case 'lg': return 24;
      default: return 20;
    }
  }

  get valueClass(): string {
    return 'font-medium text-gray-700';
  }
}
