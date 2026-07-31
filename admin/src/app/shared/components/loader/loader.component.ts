import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (show) {
      <div class="flex items-center justify-center" [class.p-8]="fullPage" [class.p-4]="!fullPage">
        <div class="flex flex-col items-center gap-3">
          <div class="border-4 border-t-transparent rounded-full animate-spin"
               [ngClass]="{ 'w-8 h-8 border-primary-500': size === 'small', 'w-12 h-12 border-primary-500': size === 'medium', 'w-16 h-16 border-primary-500': size === 'large' }">
          </div>
          @if (message) { <span class="text-sm text-gray-500">{{ message }}</span> }
        </div>
      </div>
    }
  `,
})
export class LoaderComponent {
  @Input() show = true;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() message?: string;
  @Input() fullPage = false;
}
