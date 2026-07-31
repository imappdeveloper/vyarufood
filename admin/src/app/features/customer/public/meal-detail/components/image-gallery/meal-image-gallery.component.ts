import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meal-image-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <div class="relative rounded-2xl overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 aspect-square">
        @if (galleryImages.length > 0) {
          <img
            [src]="galleryImages[activeIdx]"
            [alt]="altText"
            loading="eager"
            class="w-full h-full object-cover transition-opacity duration-300"
            (error)="onImageError($event)"
          />
        } @else {
          <div class="w-full h-full flex items-center justify-center">
            <span class="text-8xl">🍛</span>
          </div>
        }

        @if (galleryImages.length > 1) {
          <button
            (click)="prev()"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            aria-label="Previous image">
            <span class="material-icons text-gray-700">chevron_left</span>
          </button>
          <button
            (click)="next()"
            class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            aria-label="Next image">
            <span class="material-icons text-gray-700">chevron_right</span>
          </button>
        }

        @if (galleryImages.length > 1) {
          <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            @for (img of galleryImages; track $index) {
              <button
                (click)="activeIdx = $index"
                [class]="activeIdx === $index
                  ? 'w-2 h-2 rounded-full bg-orange-500'
                  : 'w-2 h-2 rounded-full bg-white/60 hover:bg-white/80'"
                [attr.aria-label]="'Go to image ' + ($index + 1)">
              </button>
            }
          </div>
        }
      </div>

      @if (galleryImages.length > 1) {
        <div class="flex gap-2 mt-3 overflow-x-auto pb-1">
          @for (img of galleryImages; track $index) {
            <button
              (click)="activeIdx = $index"
              [class]="activeIdx === $index
                ? 'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden ring-2 ring-orange-500 ring-offset-1'
                : 'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden opacity-60 hover:opacity-100 transition-opacity'">
              <img
                [src]="img"
                [alt]="altText + ' thumbnail ' + ($index + 1)"
                loading="lazy"
                class="w-full h-full object-cover"
                (error)="onThumbnailError($event)"
              />
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class MealImageGalleryComponent {
  @Input() galleryImages: string[] = [];
  @Input() altText = 'Meal image';

  activeIdx = 0;

  prev(): void {
    const total = this.galleryImages.length;
    this.activeIdx = this.activeIdx === 0 ? total - 1 : this.activeIdx - 1;
  }

  next(): void {
    const total = this.galleryImages.length;
    this.activeIdx = this.activeIdx === total - 1 ? 0 : this.activeIdx + 1;
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  onThumbnailError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
