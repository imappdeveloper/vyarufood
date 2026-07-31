import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meal } from '../../../../../../core/models/meal/meal.model';

interface NutritionItem {
  label: string;
  value: number;
  unit: string;
  percent?: number;
}

@Component({
  selector: 'app-nutrition-facts',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (nutritionItems().length > 0) {
      <div class="bg-white rounded-xl border border-gray-100 p-5">
        <div class="flex items-center gap-2 mb-4">
          <span class="material-icons text-green-600">local_fire_department</span>
          <h3 class="text-lg font-semibold text-gray-900">Nutrition Facts</h3>
        </div>
        @if (calories() > 0) {
          <div class="mb-3 pb-3 border-b border-gray-200">
            <div class="flex items-baseline justify-between">
              <span class="text-sm text-gray-500">Calories</span>
              <span class="text-2xl font-bold text-gray-900">{{ calories() }}</span>
            </div>
          </div>
        }
        <div class="space-y-2.5">
          @for (item of nutritionItems(); track item.label) {
            <div class="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full" [style.background]="getColor(item.label)"></span>
                <span class="text-sm text-gray-700">{{ item.label }}</span>
              </div>
              <span class="text-sm font-medium text-gray-900">{{ item.value }}{{ item.unit }}</span>
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class NutritionFactsComponent {
  @Input() meal!: Meal;

  calories = computed(() => this.meal?.calories || 0);

  nutritionItems = computed<NutritionItem[]>(() => {
    if (!this.meal) return [];
    const items: NutritionItem[] = [];
    if (this.meal.protein > 0) items.push({ label: 'Protein', value: this.meal.protein, unit: 'g' });
    if (this.meal.carbohydrates > 0) items.push({ label: 'Carbohydrates', value: this.meal.carbohydrates, unit: 'g' });
    if (this.meal.fat > 0) items.push({ label: 'Fat', value: this.meal.fat, unit: 'g' });
    if (this.meal.fiber > 0) items.push({ label: 'Fiber', value: this.meal.fiber, unit: 'g' });
    if (this.meal.sugar > 0) items.push({ label: 'Sugar', value: this.meal.sugar, unit: 'g' });
    if (this.meal.sodium > 0) items.push({ label: 'Sodium', value: this.meal.sodium, unit: 'mg' });
    return items;
  });

  getColor(label: string): string {
    const colors: Record<string, string> = {
      Protein: '#2563eb',
      Carbohydrates: '#f59e0b',
      Fat: '#ef4444',
      Fiber: '#10b981',
      Sugar: '#ec4899',
      Sodium: '#8b5cf6',
    };
    return colors[label] || '#6b7280';
  }
}
