import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    @switch (type) {
      @case ('text') {
        <div class="animate-pulse space-y-2">
          <div class="h-4 bg-gray-200 rounded" [style.width]="width"></div>
        </div>
      }
      @case ('card') {
        <div class="animate-pulse bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div class="h-48 bg-gray-200"></div>
          <div class="p-5 space-y-3">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-100 rounded w-full"></div>
            <div class="h-3 bg-gray-100 rounded w-2/3"></div>
            <div class="flex justify-between items-center pt-2">
              <div class="h-6 bg-gray-200 rounded w-20"></div>
              <div class="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      }
      @case ('circle') {
        <div class="animate-pulse bg-gray-200 rounded-full" [style.width]="size" [style.height]="size"></div>
      }
      @case ('rectangle') {
        <div class="animate-pulse bg-gray-200 rounded-xl" [style.width]="width" [style.height]="height"></div>
      }
      @case ('table-row') {
        <div class="animate-pulse flex space-x-4 py-3">
          <div class="h-4 bg-gray-200 rounded flex-1"></div>
          <div class="h-4 bg-gray-100 rounded flex-1"></div>
          <div class="h-4 bg-gray-100 rounded w-24"></div>
        </div>
      }
      @default {
        <div class="animate-pulse space-y-3">
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-100 rounded w-4/5"></div>
          <div class="h-4 bg-gray-100 rounded w-3/5"></div>
        </div>
      }
    }
  `,
})
export class SkeletonLoaderComponent {
  @Input() type: 'text' | 'card' | 'circle' | 'rectangle' | 'table-row' | 'default' = 'default';
  @Input() width = '100%';
  @Input() height = '20px';
  @Input() size = '48px';
}
