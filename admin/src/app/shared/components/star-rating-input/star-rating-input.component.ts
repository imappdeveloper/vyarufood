import { Component, Input, Output, EventEmitter, signal, forwardRef, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RATING_LABELS } from '../../../core/models/review/review.model';

@Component({
  selector: 'app-star-rating-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRatingInputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="inline-flex flex-col gap-1" role="radiogroup" [attr.aria-label]="ariaLabel">
      <div class="flex items-center gap-1" (mouseleave)="onMouseLeave()">
        @for (star of [1,2,3,4,5]; track star) {
          <button
            type="button"
            role="radio"
            [attr.aria-checked]="star === currentValue()"
            [attr.aria-label]="star + ' star' + (star > 1 ? 's' : '')"
            (mouseenter)="onMouseEnter(star)"
            (click)="selectRating(star)"
            [disabled]="disabled"
            class="focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 rounded transition-transform duration-150"
            [class.cursor-pointer]="!disabled"
            [class.cursor-not-allowed]="disabled"
          >
            <span
              class="material-icons transition-colors duration-150"
              [style.fontSize]="sizePx + 'px'"
              [class]="getStarClass(star)"
            >
              {{ getStarIcon(star) }}
            </span>
          </button>
        }
      </div>
      @if (showLabel && currentValue() > 0) {
        <span class="text-sm font-medium text-amber-600" [class.text-xs]="size === 'sm'">
          {{ getLabel(currentValue()) }}
        </span>
      }
    </div>
  `,
})
export class StarRatingInputComponent implements ControlValueAccessor, OnDestroy {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() showLabel = true;
  @Input() ariaLabel = 'Rating';

  currentValue = signal(0);
  hoveredValue = signal(0);

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  get sizePx(): number {
    switch (this.size) {
      case 'sm': return 20;
      case 'lg': return 32;
      default: return 26;
    }
  }

  writeValue(value: number): void {
    this.currentValue.set(value || 0);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onMouseEnter(star: number): void {
    if (!this.disabled) {
      this.hoveredValue.set(star);
    }
  }

  onMouseLeave(): void {
    this.hoveredValue.set(0);
  }

  selectRating(star: number): void {
    if (this.disabled) return;
    this.currentValue.set(star);
    this.onChange(star);
    this.onTouched();
  }

  getStarClass(star: number): string {
    const displayValue = this.hoveredValue() || this.currentValue();
    if (star <= displayValue) {
      return 'text-amber-400';
    }
    return 'text-gray-300';
  }

  getStarIcon(star: number): string {
    const displayValue = this.hoveredValue() || this.currentValue();
    if (star <= displayValue) {
      return 'star';
    }
    return 'star_border';
  }

  getLabel(rating: number): string {
    return RATING_LABELS[rating] || '';
  }

  ngOnDestroy(): void {}
}
