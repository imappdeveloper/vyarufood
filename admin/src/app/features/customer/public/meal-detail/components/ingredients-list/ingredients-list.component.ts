import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ingredients-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (ingredients && ingredients.length > 0) {
      <div class="bg-white rounded-xl border border-gray-100 p-5">
        <div class="flex items-center gap-2 mb-4">
          <span class="material-icons text-amber-500">eco</span>
          <h3 class="text-lg font-semibold text-gray-900">Ingredients</h3>
        </div>
        <div class="flex flex-wrap gap-2">
          @for (ingredient of ingredients; track ingredient) {
            <span class="px-3 py-1.5 bg-amber-50 border border-amber-100 text-amber-800 text-sm rounded-full">
              {{ ingredient }}
            </span>
          }
        </div>
      </div>
    }
  `,
})
export class IngredientsListComponent {
  @Input() ingredients: string[] | null = null;
}
