import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MealCategory } from '../../../../core/models/meal/meal-category.model';
import { MealType } from '../../../../core/models/meal/meal-type.model';

export interface MealFilters {
  meal_type_id: number | null;
  min_price: number | null;
  max_price: number | null;
  featured: boolean | null;
  bestseller: boolean | null;
  recommended: boolean | null;
}

@Component({
  selector: 'app-meal-filter-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Desktop sidebar -->
    <aside style="display: none; width: 16rem; flex-shrink: 0;" class="meals-desktop-sidebar">
      <div style="position: sticky; top: 6rem; display: flex; flex-direction: column; gap: 1.5rem;">
        @for (section of sections; track section.title) {
          <div style="background: #fff; border-radius: 0.75rem; border: 1px solid #f1f5f9; padding: 1rem;">
            <h3 style="font-size: 0.8rem; font-weight: 700; color: #0f172a; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.375rem; text-transform: uppercase; letter-spacing: 0.03em;">
              @if (section.type === 'categories') {
                <span class="material-icons" style="font-size: 16px; color: #059669;">category</span>
              } @else if (section.type === 'meal_types') {
                <span class="material-icons" style="font-size: 16px; color: #059669;">schedule</span>
              } @else if (section.type === 'special') {
                <span class="material-icons" style="font-size: 16px; color: #059669;">star</span>
              } @else if (section.type === 'price') {
                <span class="material-icons" style="font-size: 16px; color: #059669;">payments</span>
              }
              {{ section.title }}
            </h3>
            @if (section.type === 'categories') {
              <div style="display: flex; flex-direction: column; gap: 0.125rem;">
                <button
                  (click)="selectCategory(null)"
                  style="width: 100%; text-align: left; padding: 0.5rem 0.625rem; font-size: 0.8rem; border-radius: 0.5rem; cursor: pointer; border: none; transition: all 0.2s; display: flex; align-items: center; justify-content: space-between;"
                  [style.background]="!selectedCategoryId ? '#ecfdf5' : 'transparent'"
                  [style.color]="!selectedCategoryId ? '#047857' : '#4b5563'"
                  [style.fontWeight]="!selectedCategoryId ? '600' : '400'">
                  <span>All Categories</span>
                  @if (!selectedCategoryId) {
                    <span class="material-icons" style="font-size: 16px; color: #059669;">check</span>
                  }
                </button>
                @for (cat of categories; track cat.id) {
                  <button
                    (click)="selectCategory(cat.id)"
                    style="width: 100%; text-align: left; padding: 0.5rem 0.625rem; font-size: 0.8rem; border-radius: 0.5rem; cursor: pointer; border: none; transition: all 0.2s; display: flex; align-items: center; justify-content: space-between;"
                    [style.background]="selectedCategoryId === cat.id ? '#ecfdf5' : 'transparent'"
                    [style.color]="selectedCategoryId === cat.id ? '#047857' : '#4b5563'"
                    [style.fontWeight]="selectedCategoryId === cat.id ? '600' : '400'"
                    onmouseover="if(!this.style.background.includes('ecfdf5')) this.style.background='#f9fafb'"
                    onmouseout="if(!this.style.background.includes('ecfdf5')) this.style.background='transparent'">
                    <span style="display: flex; align-items: center; gap: 0.5rem;">
                      @if (cat.icon) {
                        <span class="material-icons" style="font-size: 1rem;">{{ cat.icon }}</span>
                      }
                      {{ cat.name }}
                    </span>
                    @if (selectedCategoryId === cat.id) {
                      <span class="material-icons" style="font-size: 16px; color: #059669;">check</span>
                    }
                  </button>
                }
              </div>
            }
            @if (section.type === 'meal_types') {
              <div style="display: flex; flex-direction: column; gap: 0.125rem;">
                <button
                  (click)="selectMealType(null)"
                  style="width: 100%; text-align: left; padding: 0.5rem 0.625rem; font-size: 0.8rem; border-radius: 0.5rem; cursor: pointer; border: none; transition: all 0.2s; display: flex; align-items: center; justify-content: space-between;"
                  [style.background]="!filters.meal_type_id ? '#ecfdf5' : 'transparent'"
                  [style.color]="!filters.meal_type_id ? '#047857' : '#4b5563'"
                  [style.fontWeight]="!filters.meal_type_id ? '600' : '400'">
                  <span>All Types</span>
                  @if (!filters.meal_type_id) {
                    <span class="material-icons" style="font-size: 16px; color: #059669;">check</span>
                  }
                </button>
                @for (mt of mealTypes; track mt.id) {
                  <button
                    (click)="selectMealType(mt.id)"
                    style="width: 100%; text-align: left; padding: 0.5rem 0.625rem; font-size: 0.8rem; border-radius: 0.5rem; cursor: pointer; border: none; transition: all 0.2s; display: flex; align-items: center; justify-content: space-between;"
                    [style.background]="filters.meal_type_id === mt.id ? '#ecfdf5' : 'transparent'"
                    [style.color]="filters.meal_type_id === mt.id ? '#047857' : '#4b5563'"
                    [style.fontWeight]="filters.meal_type_id === mt.id ? '600' : '400'"
                    onmouseover="if(!this.style.background.includes('ecfdf5')) this.style.background='#f9fafb'"
                    onmouseout="if(!this.style.background.includes('ecfdf5')) this.style.background='transparent'">
                    <span>{{ mt.name }}</span>
                    @if (filters.meal_type_id === mt.id) {
                      <span class="material-icons" style="font-size: 16px; color: #059669;">check</span>
                    }
                  </button>
                }
              </div>
            }
            @if (section.type === 'special') {
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.8rem; color: #4b5563; transition: color 0.2s;"
                       onmouseover="this.style.color='#0f172a'" onmouseout="this.style.color='#4b5563'">
                  <input type="checkbox" [ngModel]="filters.featured" (ngModelChange)="updateFilter('featured', $event)" style="width: 1rem; height: 1rem; border-radius: 0.25rem; border-color: #d1d5db; accent-color: #059669; cursor: pointer;" />
                  Featured
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.8rem; color: #4b5563; transition: color 0.2s;"
                       onmouseover="this.style.color='#0f172a'" onmouseout="this.style.color='#4b5563'">
                  <input type="checkbox" [ngModel]="filters.bestseller" (ngModelChange)="updateFilter('bestseller', $event)" style="width: 1rem; height: 1rem; border-radius: 0.25rem; border-color: #d1d5db; accent-color: #059669; cursor: pointer;" />
                  Bestseller
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.8rem; color: #4b5563; transition: color 0.2s;"
                       onmouseover="this.style.color='#0f172a'" onmouseout="this.style.color='#4b5563'">
                  <input type="checkbox" [ngModel]="filters.recommended" (ngModelChange)="updateFilter('recommended', $event)" style="width: 1rem; height: 1rem; border-radius: 0.25rem; border-color: #d1d5db; accent-color: #059669; cursor: pointer;" />
                  Recommended
                </label>
              </div>
            }
            @if (section.type === 'price') {
              <div style="display: flex; gap: 0.5rem;">
                <input
                  type="number"
                  placeholder="Min"
                  [ngModel]="filters.min_price"
                  (ngModelChange)="updateFilter('min_price', $event)"
                  style="width: 50%; padding: 0.5rem 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; font-size: 0.8rem; outline: none; transition: all 0.2s; background: #fff;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'" />
                <input
                  type="number"
                  placeholder="Max"
                  [ngModel]="filters.max_price"
                  (ngModelChange)="updateFilter('max_price', $event)"
                  style="width: 50%; padding: 0.5rem 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; font-size: 0.8rem; outline: none; transition: all 0.2s; background: #fff;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'" />
              </div>
            }
          </div>
        }
        @if (hasActiveFilters()) {
          <button
            (click)="clearAll()"
            style="width: 100%; padding: 0.625rem; font-size: 0.8rem; color: #fff; font-weight: 600; background: linear-gradient(135deg, #059669, #16a34a); border: none; border-radius: 0.5rem; cursor: pointer; transition: all 0.25s; display: flex; align-items: center; justify-content: center; gap: 0.375rem;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(5,150,105,0.35)'"
            onmouseout="this.style.boxShadow='none'">
            <span class="material-icons" style="font-size: 16px;">restart_alt</span>
            Clear All Filters
          </button>
        }
      </div>
    </aside>

    <!-- Mobile drawer backdrop -->
    @if (mobileOpen()) {
      <div (click)="closeMobile()"
           style="position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 40; animation: filterFadeIn 0.2s ease-out;">
      </div>
    }

    <!-- Mobile drawer -->
    @if (mobileOpen()) {
      <div style="position: fixed; top: 0; left: 0; bottom: 0; width: 20rem; max-width: 85vw; background: #fff; z-index: 50; box-shadow: 4px 0 24px rgba(0,0,0,0.15); display: flex; flex-direction: column; animation: filterSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid #e2e8f0;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="material-icons" style="font-size: 20px; color: #059669;">tune</span>
            <h2 style="font-size: 1rem; font-weight: 700; color: #0f172a;">Filters</h2>
            @if (hasActiveFilters()) {
              <span style="padding: 0.125rem 0.5rem; background: #059669; color: #fff; font-size: 0.65rem; font-weight: 700; border-radius: 9999px;">
                {{ getActiveCount() }}
              </span>
            }
          </div>
          <button (click)="closeMobile()"
                  style="width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; border: none; background: #f1f5f9; border-radius: 0.5rem; cursor: pointer; transition: all 0.2s; color: #64748b;"
                  onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'">
            <span class="material-icons" style="font-size: 20px;">close</span>
          </button>
        </div>

        <!-- Scrollable content -->
        <div style="flex: 1; overflow-y: auto; padding: 1rem 1.25rem;">
          @for (section of sections; track section.title) {
            <div style="margin-bottom: 1.5rem;">
              <h3 style="font-size: 0.75rem; font-weight: 700; color: #0f172a; margin-bottom: 0.625rem; text-transform: uppercase; letter-spacing: 0.04em; display: flex; align-items: center; gap: 0.375rem;">
                @if (section.type === 'categories') {
                  <span class="material-icons" style="font-size: 14px; color: #059669;">category</span>
                } @else if (section.type === 'meal_types') {
                  <span class="material-icons" style="font-size: 14px; color: #059669;">schedule</span>
                } @else if (section.type === 'special') {
                  <span class="material-icons" style="font-size: 14px; color: #059669;">star</span>
                } @else if (section.type === 'price') {
                  <span class="material-icons" style="font-size: 14px; color: #059669;">payments</span>
                }
                {{ section.title }}
              </h3>
              @if (section.type === 'categories') {
                <div style="display: flex; flex-direction: column; gap: 0.125rem;">
                  <button (click)="selectCategory(null); closeMobile()"
                    style="width: 100%; text-align: left; padding: 0.625rem 0.75rem; font-size: 0.8rem; border-radius: 0.5rem; cursor: pointer; border: none; transition: all 0.2s; display: flex; align-items: center; justify-content: space-between;"
                    [style.background]="!selectedCategoryId ? '#ecfdf5' : 'transparent'"
                    [style.color]="!selectedCategoryId ? '#047857' : '#4b5563'"
                    [style.fontWeight]="!selectedCategoryId ? '600' : '400'">
                    <span>All Categories</span>
                    @if (!selectedCategoryId) {
                      <span class="material-icons" style="font-size: 16px; color: #059669;">check</span>
                    }
                  </button>
                  @for (cat of categories; track cat.id) {
                    <button (click)="selectCategory(cat.id); closeMobile()"
                      style="width: 100%; text-align: left; padding: 0.625rem 0.75rem; font-size: 0.8rem; border-radius: 0.5rem; cursor: pointer; border: none; transition: all 0.2s; display: flex; align-items: center; justify-content: space-between;"
                      [style.background]="selectedCategoryId === cat.id ? '#ecfdf5' : 'transparent'"
                      [style.color]="selectedCategoryId === cat.id ? '#047857' : '#4b5563'"
                      [style.fontWeight]="selectedCategoryId === cat.id ? '600' : '400'"
                      onmouseover="if(!this.style.background.includes('ecfdf5')) this.style.background='#f9fafb'"
                      onmouseout="if(!this.style.background.includes('ecfdf5')) this.style.background='transparent'">
                      <span style="display: flex; align-items: center; gap: 0.5rem;">
                        @if (cat.icon) {
                          <span class="material-icons" style="font-size: 1rem;">{{ cat.icon }}</span>
                        }
                        {{ cat.name }}
                      </span>
                      @if (selectedCategoryId === cat.id) {
                        <span class="material-icons" style="font-size: 16px; color: #059669;">check</span>
                      }
                    </button>
                  }
                </div>
              }
              @if (section.type === 'meal_types') {
                <div style="display: flex; flex-direction: column; gap: 0.125rem;">
                  <button (click)="selectMealType(null); closeMobile()"
                    style="width: 100%; text-align: left; padding: 0.625rem 0.75rem; font-size: 0.8rem; border-radius: 0.5rem; cursor: pointer; border: none; transition: all 0.2s; display: flex; align-items: center; justify-content: space-between;"
                    [style.background]="!filters.meal_type_id ? '#ecfdf5' : 'transparent'"
                    [style.color]="!filters.meal_type_id ? '#047857' : '#4b5563'"
                    [style.fontWeight]="!filters.meal_type_id ? '600' : '400'">
                    <span>All Types</span>
                    @if (!filters.meal_type_id) {
                      <span class="material-icons" style="font-size: 16px; color: #059669;">check</span>
                    }
                  </button>
                  @for (mt of mealTypes; track mt.id) {
                    <button (click)="selectMealType(mt.id); closeMobile()"
                      style="width: 100%; text-align: left; padding: 0.625rem 0.75rem; font-size: 0.8rem; border-radius: 0.5rem; cursor: pointer; border: none; transition: all 0.2s;"
                      [style.background]="filters.meal_type_id === mt.id ? '#ecfdf5' : 'transparent'"
                      [style.color]="filters.meal_type_id === mt.id ? '#047857' : '#4b5563'"
                      [style.fontWeight]="filters.meal_type_id === mt.id ? '600' : '400'"
                      onmouseover="if(!this.style.background.includes('ecfdf5')) this.style.background='#f9fafb'"
                      onmouseout="if(!this.style.background.includes('ecfdf5')) this.style.background='transparent'">
                      <span>{{ mt.name }}</span>
                    </button>
                  }
                </div>
              }
              @if (section.type === 'special') {
                <div style="display: flex; flex-direction: column; gap: 0.625rem;">
                  <label style="display: flex; align-items: center; gap: 0.625rem; cursor: pointer; font-size: 0.8rem; color: #4b5563; transition: color 0.2s;"
                         onmouseover="this.style.color='#0f172a'" onmouseout="this.style.color='#4b5563'">
                    <input type="checkbox" [ngModel]="filters.featured" (ngModelChange)="updateFilter('featured', $event)" style="width: 1.125rem; height: 1.125rem; border-radius: 0.25rem; border-color: #d1d5db; accent-color: #059669; cursor: pointer;" />
                    Featured
                  </label>
                  <label style="display: flex; align-items: center; gap: 0.625rem; cursor: pointer; font-size: 0.8rem; color: #4b5563; transition: color 0.2s;"
                         onmouseover="this.style.color='#0f172a'" onmouseout="this.style.color='#4b5563'">
                    <input type="checkbox" [ngModel]="filters.bestseller" (ngModelChange)="updateFilter('bestseller', $event)" style="width: 1.125rem; height: 1.125rem; border-radius: 0.25rem; border-color: #d1d5db; accent-color: #059669; cursor: pointer;" />
                    Bestseller
                  </label>
                  <label style="display: flex; align-items: center; gap: 0.625rem; cursor: pointer; font-size: 0.8rem; color: #4b5563; transition: color 0.2s;"
                         onmouseover="this.style.color='#0f172a'" onmouseout="this.style.color='#4b5563'">
                    <input type="checkbox" [ngModel]="filters.recommended" (ngModelChange)="updateFilter('recommended', $event)" style="width: 1.125rem; height: 1.125rem; border-radius: 0.25rem; border-color: #d1d5db; accent-color: #059669; cursor: pointer;" />
                    Recommended
                  </label>
                </div>
              }
              @if (section.type === 'price') {
                <div style="display: flex; gap: 0.5rem;">
                  <input type="number" placeholder="Min ₹" [ngModel]="filters.min_price" (ngModelChange)="updateFilter('min_price', $event)"
                    style="width: 50%; padding: 0.625rem 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; font-size: 0.8rem; outline: none; transition: all 0.2s; background: #fff;"
                    onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'"
                    onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'" />
                  <input type="number" placeholder="Max ₹" [ngModel]="filters.max_price" (ngModelChange)="updateFilter('max_price', $event)"
                    style="width: 50%; padding: 0.625rem 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; font-size: 0.8rem; outline: none; transition: all 0.2s; background: #fff;"
                    onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'"
                    onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'" />
                </div>
              }
            </div>
          }
        </div>

        <!-- Footer buttons -->
        <div style="padding: 1rem 1.25rem; border-top: 1px solid #e2e8f0; display: flex; gap: 0.75rem;">
          @if (hasActiveFilters()) {
            <button (click)="clearAll()"
                    style="flex: 1; padding: 0.75rem; font-size: 0.8rem; font-weight: 600; border-radius: 0.75rem; cursor: pointer; transition: all 0.25s; border: 1.5px solid #059669; color: #059669; background: transparent;"
                    onmouseover="this.style.background='#ecfdf5'" onmouseout="this.style.background='transparent'">
              Clear All
            </button>
          }
          <button (click)="applyAndClose()"
                  style="flex: 1; padding: 0.75rem; font-size: 0.8rem; font-weight: 600; border-radius: 0.75rem; cursor: pointer; transition: all 0.25s; border: none; color: #fff; background: linear-gradient(135deg, #059669, #16a34a); box-shadow: 0 2px 8px rgba(5,150,105,0.3);"
                  onmouseover="this.style.boxShadow='0 4px 14px rgba(5,150,105,0.4)'"
                  onmouseout="this.style.boxShadow='0 2px 8px rgba(5,150,105,0.3)'">
            Apply Filters
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes filterFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes filterSlideIn {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }
    @media (min-width: 1024px) {
      .meals-desktop-sidebar { display: block !important; }
    }
  `],
})
export class MealFilterSidebarComponent {
  @Input() categories: MealCategory[] = [];
  @Input() mealTypes: MealType[] = [];
  @Input() selectedCategoryId: number | null = null;
  @Input() filters: MealFilters = { meal_type_id: null, min_price: null, max_price: null, featured: null, bestseller: null, recommended: null };

  @Output() categoryChange = new EventEmitter<number | null>();
  @Output() filtersChange = new EventEmitter<MealFilters>();
  @Output() clearFilters = new EventEmitter<void>();

  mobileOpen = signal(false);

  sections = [
    { title: 'Categories', type: 'categories' as const },
    { title: 'Meal Type', type: 'meal_types' as const },
    { title: 'Special', type: 'special' as const },
    { title: 'Price Range', type: 'price' as const },
  ];

  openMobile(): void { this.mobileOpen.set(true); }
  closeMobile(): void { this.mobileOpen.set(false); }

  selectCategory(id: number | null): void { this.categoryChange.emit(id); }
  selectMealType(id: number | null): void { this.updateFilter('meal_type_id', id); }

  updateFilter(key: keyof MealFilters, value: any): void {
    this.filters = { ...this.filters, [key]: value };
    this.filtersChange.emit(this.filters);
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.meal_type_id || this.filters.min_price || this.filters.max_price
      || this.filters.featured || this.filters.bestseller || this.filters.recommended);
  }

  getActiveCount(): number {
    let count = 0;
    if (this.filters.meal_type_id) count++;
    if (this.filters.featured) count++;
    if (this.filters.bestseller) count++;
    if (this.filters.recommended) count++;
    if (this.filters.min_price || this.filters.max_price) count++;
    return count;
  }

  clearAll(): void {
    this.filters = { meal_type_id: null, min_price: null, max_price: null, featured: null, bestseller: null, recommended: null };
    this.filtersChange.emit(this.filters);
    this.clearFilters.emit();
  }

  applyAndClose(): void {
    this.filtersChange.emit(this.filters);
    this.closeMobile();
  }
}
