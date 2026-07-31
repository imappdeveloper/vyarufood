import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-price-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inline-flex items-baseline gap-2">
      @if (originalPrice && originalPrice !== effectivePrice) {
        <span class="text-gray-400 line-through" [class.text-sm]="size === 'sm'" [class.text-base]="size === 'md'" [class.text-lg]="size === 'lg'">
          {{ symbol }}{{ originalPrice | number:'1.0-0' }}
        </span>
      }
      <span class="font-bold" [class]="textColorClass" [class.text-sm]="size === 'sm'" [class.text-lg]="size === 'md'" [class.text-2xl]="size === 'lg'" [class.text-3xl]="size === 'xl'">
        {{ symbol }}{{ effectivePrice | number:'1.0-0' }}
      </span>
      @if (suffix) {
        <span class="text-gray-400 text-sm">{{ suffix }}</span>
      }
      @if (discountPercent) {
        <span class="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
          {{ discountPercent }}% OFF
        </span>
      }
    </div>
  `,
})
export class PriceDisplayComponent {
  @Input() effectivePrice: number | string = 0;
  @Input() originalPrice?: number | string;
  @Input() symbol = '₹';
  @Input() suffix?: string;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() color: 'primary' | 'white' | 'green' = 'primary';

  get discountPercent(): number | null {
    if (this.originalPrice && this.effectivePrice && Number(this.originalPrice) > Number(this.effectivePrice)) {
      return Math.round(((Number(this.originalPrice) - Number(this.effectivePrice)) / Number(this.originalPrice)) * 100);
    }
    return null;
  }

  get textColorClass(): string {
    switch (this.color) {
      case 'white': return 'text-white';
      case 'green': return 'text-green-600';
      default: return 'text-indigo-600';
    }
  }
}
