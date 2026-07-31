import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-allergen-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (allergens && allergens.length > 0) {
      <div class="bg-red-50 rounded-xl border border-red-100 p-5">
        <div class="flex items-center gap-2 mb-3">
          <span class="material-icons text-red-500">warning</span>
          <h3 class="text-lg font-semibold text-gray-900">Allergen Information</h3>
        </div>
        <div class="flex flex-wrap gap-2 mb-3">
          @for (allergen of allergens; track allergen) {
            <span class="px-3 py-1.5 bg-white border border-red-200 text-red-700 text-sm font-medium rounded-full">
              {{ allergen }}
            </span>
          }
        </div>
        <p class="text-xs text-red-600/80">
          Please contact support before ordering if you have allergies.
        </p>
      </div>
    } @else {
      <div class="bg-gray-50 rounded-xl border border-gray-100 p-5">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-icons text-gray-400">info</span>
          <h3 class="text-lg font-semibold text-gray-900">Allergen Information</h3>
        </div>
        <p class="text-sm text-gray-500">
          Allergen information is not available. Please contact support before ordering.
        </p>
      </div>
    }
  `,
})
export class AllergenInfoComponent {
  @Input() allergens: string[] | null = null;
}
