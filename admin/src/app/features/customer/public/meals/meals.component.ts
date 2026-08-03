import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged, catchError, of, finalize } from 'rxjs';
import { CustomerBrowseApiService } from '../../../../core/services/customer-browse-api.service';
import { AppStateService } from '../../../../core/services/app-state.service';
import { CartStateService } from '../../../../core/services/cart-state.service';
import { SeoService } from '../../../../core/services/seo.service';
import { Meal } from '../../../../core/models/meal/meal.model';
import { MealCategory } from '../../../../core/models/meal/meal-category.model';
import { MealType } from '../../../../core/models/meal/meal-type.model';
import { PaginationMeta } from '../../../../core/interfaces/api-response.interface';
import { MealCardComponent } from '../../../../shared/components/meal-card/meal-card.component';
import { CustomerPaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { MealFilterSidebarComponent, MealFilters } from './meal-filter-sidebar.component';

@Component({
  selector: 'app-meals-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MealCardComponent,
    CustomerPaginationComponent, MealFilterSidebarComponent,
  ],
  template: `
    <!-- Hero Banner with Floating Ingredients -->
    <section class="meals-hero" style="background: linear-gradient(135deg, #059669, #047857, #166534); padding: 3.5rem 1rem 3rem; position: relative; overflow: hidden;">
      <!-- Decorative blurs -->
      <div style="position: absolute; inset: 0; opacity: 0.06; pointer-events: none;">
        <div style="position: absolute; top: -3rem; right: -3rem; width: 12rem; height: 12rem; background: #fff; border-radius: 50%; filter: blur(50px);"></div>
        <div style="position: absolute; bottom: -3rem; left: -3rem; width: 10rem; height: 10rem; background: #fff; border-radius: 50%; filter: blur(50px);"></div>
      </div>
      <!-- Floating food emojis -->
      <div style="position: absolute; top: 10%; left: 8%; font-size: 1.5rem; animation: mealHeroFloat 5s ease-in-out infinite; opacity: 0.25;">&#127813;</div>
      <div style="position: absolute; top: 25%; right: 12%; font-size: 1.25rem; animation: mealHeroFloat 6s ease-in-out infinite 1s; opacity: 0.2;">&#129367;</div>
      <div style="position: absolute; bottom: 20%; left: 15%; font-size: 1.75rem; animation: mealHeroFloat 4.5s ease-in-out infinite 0.5s; opacity: 0.2;">&#127798;</div>
      <div style="position: absolute; bottom: 15%; right: 8%; font-size: 1.5rem; animation: mealHeroFloat 5.5s ease-in-out infinite 2s; opacity: 0.25;">&#129361;</div>
      <div style="position: absolute; top: 50%; left: 5%; font-size: 1rem; animation: mealHeroFloat 7s ease-in-out infinite 3s; opacity: 0.15;">&#127807;</div>
      <!-- Steam wisps -->
      <div style="position: absolute; top: 5%; left: 50%; transform: translateX(-50%); display: flex; gap: 1rem; opacity: 0.12;">
        <div style="width: 2px; height: 2.5rem; background: linear-gradient(to top, #fff, transparent); border-radius: 9999px; animation: mealSteam 2.5s ease-in-out infinite;"></div>
        <div style="width: 2px; height: 3rem; background: linear-gradient(to top, #fff, transparent); border-radius: 9999px; animation: mealSteam 3s ease-in-out infinite 0.4s;"></div>
        <div style="width: 2px; height: 2rem; background: linear-gradient(to top, #fff, transparent); border-radius: 9999px; animation: mealSteam 2s ease-in-out infinite 0.8s;"></div>
      </div>

      <div class="meals-hero-content" style="max-width: 80rem; margin: 0 auto; position: relative; z-index: 10;">
        <!-- Breadcrumb -->
        <nav class="meals-breadcrumb" style="margin-bottom: 1rem; animation: mealsSlideIn 0.5s ease-out;" aria-label="Breadcrumb">
          <ol style="display: flex; align-items: center; gap: 0.25rem; list-style: none; padding: 0; margin: 0;">
            <li><a routerLink="/" style="color: rgba(255,255,255,0.7); text-decoration: none; font-size: 0.8rem; transition: color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">Home</a></li>
            <li><span class="material-icons" style="font-size: 14px; color: rgba(255,255,255,0.4);">chevron_right</span></li>
            <li style="color: #fff; font-weight: 600; font-size: 0.8rem;">Meals</li>
            @if (activeCategory()) {
              <li><span class="material-icons" style="font-size: 14px; color: rgba(255,255,255,0.4);">chevron_right</span></li>
              <li style="color: #86efac; font-weight: 600; font-size: 0.8rem;">{{ activeCategory()!.name }}</li>
            }
          </ol>
        </nav>
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.375rem;">
          <span class="meals-hero-icon material-icons" style="font-size: 2rem; color: rgba(255,255,255,0.9); animation: mealsSlideIn 0.5s ease-out 0.05s both;">restaurant_menu</span>
          <h1 class="meals-hero-title" style="font-size: 1.75rem; font-weight: 800; color: #fff; animation: mealsSlideIn 0.5s ease-out 0.1s both;">
            Explore Our Meals
          </h1>
        </div>
        <p class="meals-hero-sub" style="color: rgba(255,255,255,0.8); font-size: 0.875rem; animation: mealsSlideIn 0.5s ease-out 0.2s both;">
          Freshly prepared homestyle meals made for your everyday needs
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <div style="max-width: 80rem; margin: 0 auto; padding: 1.5rem 1rem 3rem;">

      <!-- Search Bar -->
      <div class="meals-search" style="margin-bottom: 1.25rem; animation: mealsSlideIn 0.5s ease-out 0.3s both;">
        <div style="position: relative; max-width: 36rem;">
          <span class="material-icons" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 20px;">search</span>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Search meals, ingredients..."
            style="width: 100%; padding: 0.75rem 2.5rem 0.75rem 3rem; border-radius: 0.75rem; background: #fff; border: 1px solid #e2e8f0; color: #1e293b; font-size: 0.875rem; outline: none; transition: all 0.3s; box-shadow: 0 1px 3px rgba(0,0,0,0.04);"
            onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1), 0 1px 3px rgba(0,0,0,0.04)';"
            onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)';" />
          @if (searchQuery) {
            <button (click)="clearSearch()" style="position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 0.25rem; color: #94a3b8; transition: color 0.2s;"
                    onmouseover="this.style.color='#475569'" onmouseout="this.style.color='#94a3b8'">
              <span class="material-icons" style="font-size: 18px;">close</span>
            </button>
          }
        </div>
      </div>

      <!-- Category Pills -->
      @if (categories().length > 0) {
        <div class="meals-pills scrollbar-hide" style="margin-bottom: 1.25rem; overflow-x: auto; -ms-overflow-style: none; scrollbar-width: none; animation: mealsSlideIn 0.5s ease-out 0.35s both;">
          <div style="display: flex; gap: 0.5rem; min-width: max-content;">
            <button (click)="selectCategory(null)"
                    style="padding: 0.5rem 1rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; white-space: nowrap; cursor: pointer; border: none; transition: all 0.25s;"
                    [style.background]="!selectedCategoryId() ? 'linear-gradient(135deg, #059669, #16a34a)' : '#fff'"
                    [style.color]="!selectedCategoryId() ? '#fff' : '#475569'"
                    [style.boxShadow]="!selectedCategoryId() ? '0 2px 8px rgba(5,150,105,0.3)' : '0 1px 3px rgba(0,0,0,0.06)'"
                    [style.border]="selectedCategoryId() ? 'none' : '1px solid #e2e8f0'">
              All Meals
            </button>
            @for (cat of categories(); track cat.id) {
              <button (click)="selectCategory(cat.id)"
                      style="padding: 0.5rem 1rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; white-space: nowrap; cursor: pointer; transition: all 0.25s; display: flex; align-items: center; gap: 0.375rem;"
                      [style.background]="selectedCategoryId() === cat.id ? 'linear-gradient(135deg, #059669, #16a34a)' : '#fff'"
                      [style.color]="selectedCategoryId() === cat.id ? '#fff' : '#475569'"
                      [style.boxShadow]="selectedCategoryId() === cat.id ? '0 2px 8px rgba(5,150,105,0.3)' : '0 1px 3px rgba(0,0,0,0.06)'"
                      [style.border]="selectedCategoryId() === cat.id ? 'none' : '1px solid #e2e8f0'"
                      onmouseover="if(!this.style.background.includes('059669')) { this.style.borderColor='#a7f3d0'; }"
                      onmouseout="if(!this.style.background.includes('059669')) { this.style.borderColor='#e2e8f0'; }">
                @if (cat.icon) {
                  <span class="material-icons" style="font-size: 16px;">{{ cat.icon }}</span>
                }
                {{ cat.name }}
              </button>
            }
          </div>
        </div>
      }

      <!-- Toolbar -->
      <div class="meals-toolbar" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; gap: 1rem; animation: mealsSlideIn 0.5s ease-out 0.4s both;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <!-- Filter button (mobile only) -->
          <button (click)="filterSidebar?.openMobile()"
                  style="display: flex; align-items: center; gap: 0.375rem; padding: 0.5rem 1rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; font-size: 0.8rem; font-weight: 600; color: #334155; background: #fff; cursor: pointer; transition: all 0.25s;"
                  class="meals-mobile-only"
                  onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'"
                  onmouseout="this.style.borderColor='#e2e8f0'; this.style.color='#334155'">
            <span class="material-icons" style="font-size: 18px;">tune</span>
            Filters
            @if (activeFilterCount() > 0) {
              <span style="width: 1.25rem; height: 1.25rem; background: #059669; color: #fff; font-size: 0.65rem; border-radius: 50%; display: flex; align-items: center; justify-content: center;">{{ activeFilterCount() }}</span>
            }
          </button>
          <!-- View Toggle -->
          <div class="meals-view-toggle" style="display: flex; border: 1px solid #e2e8f0; border-radius: 0.5rem; overflow: hidden; background: #fff;">
            <button (click)="viewMode.set('grid')" style="padding: 0.375rem 0.5rem; border: none; cursor: pointer; transition: all 0.2s; display: flex; align-items: center;"
                    [style.background]="viewMode() === 'grid' ? '#ecfdf5' : 'transparent'"
                    [style.color]="viewMode() === 'grid' ? '#059669' : '#94a3b8'">
              <span class="material-icons" style="font-size: 18px;">grid_view</span>
            </button>
            <button (click)="viewMode.set('list')" style="padding: 0.375rem 0.5rem; border: none; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; border-left: 1px solid #e2e8f0;"
                    [style.background]="viewMode() === 'list' ? '#ecfdf5' : 'transparent'"
                    [style.color]="viewMode() === 'list' ? '#059669' : '#94a3b8'">
              <span class="material-icons" style="font-size: 18px;">view_list</span>
            </button>
          </div>
          <p class="meals-count" style="color: #64748b; font-size: 0.8rem;">
            @if (!loading()) {
              <span style="font-weight: 600; color: #0f172a;">{{ totalResults() }}</span> meal{{ totalResults() !== 1 ? 's' : '' }} found
            }
          </p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <label for="sort-select" style="color: #64748b; font-size: 0.8rem; display: none;" class="meals-sort-label">Sort by:</label>
          <select id="sort-select" [(ngModel)]="sortBy" (ngModelChange)="onSortChange($event)"
                  style="padding: 0.5rem 0.75rem; border: 1px solid #e2e8f0; border-radius: 0.75rem; font-size: 0.8rem; background: #fff; color: #334155; outline: none; cursor: pointer; transition: all 0.2s;"
                  onfocus="this.style.borderColor='#059669'" onblur="this.style.borderColor='#e2e8f0'">
            <option value="display_order">Recommended</option>
            <option value="created_at">Newest</option>
            <option value="price">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="calories">Lowest Calories</option>
          </select>
        </div>
      </div>

      <!-- Active Filter Chips -->
      @if (activeFilterCount() > 0) {
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem; animation: mealsSlideIn 0.3s ease-out;">
          @if (activeCategory()) {
            <span style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.75rem; background: #ecfdf5; color: #047857; font-size: 0.8rem; border-radius: 9999px; font-weight: 500;">
              {{ activeCategory()!.name }}
              <button (click)="selectCategory(null)" style="background: none; border: none; cursor: pointer; padding: 0; color: inherit; display: flex;">
                <span class="material-icons" style="font-size: 14px;">close</span>
              </button>
            </span>
          }
          @if (filters.meal_type_id) {
            <span style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.75rem; background: #ecfdf5; color: #047857; font-size: 0.8rem; border-radius: 9999px; font-weight: 500;">
              {{ getMealTypeName(filters.meal_type_id) }}
              <button (click)="updateFilter('meal_type_id', null)" style="background: none; border: none; cursor: pointer; padding: 0; color: inherit; display: flex;">
                <span class="material-icons" style="font-size: 14px;">close</span>
              </button>
            </span>
          }
          @if (filters.featured) {
            <span style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.75rem; background: #ecfdf5; color: #047857; font-size: 0.8rem; border-radius: 9999px; font-weight: 500;">
              Featured
              <button (click)="updateFilter('featured', null)" style="background: none; border: none; cursor: pointer; padding: 0; color: inherit; display: flex;">
                <span class="material-icons" style="font-size: 14px;">close</span>
              </button>
            </span>
          }
          @if (filters.bestseller) {
            <span style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.75rem; background: #ecfdf5; color: #059669; font-size: 0.8rem; border-radius: 9999px; font-weight: 500;">
              Bestseller
              <button (click)="updateFilter('bestseller', null)" style="background: none; border: none; cursor: pointer; padding: 0; color: inherit; display: flex;">
                <span class="material-icons" style="font-size: 14px;">close</span>
              </button>
            </span>
          }
          @if (filters.recommended) {
            <span style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.75rem; background: #ecfdf5; color: #047857; font-size: 0.8rem; border-radius: 9999px; font-weight: 500;">
              Recommended
              <button (click)="updateFilter('recommended', null)" style="background: none; border: none; cursor: pointer; padding: 0; color: inherit; display: flex;">
                <span class="material-icons" style="font-size: 14px;">close</span>
              </button>
            </span>
          }
          @if (filters.min_price || filters.max_price) {
            <span style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.75rem; background: #f1f5f9; color: #475569; font-size: 0.8rem; border-radius: 9999px; font-weight: 500;">
              &#8377;{{ filters.min_price || 0 }} – &#8377;{{ filters.max_price || '∞' }}
              <button (click)="updateFilter('min_price', null); updateFilter('max_price', null)" style="background: none; border: none; cursor: pointer; padding: 0; color: inherit; display: flex;">
                <span class="material-icons" style="font-size: 14px;">close</span>
              </button>
            </span>
          }
          @if (searchQuery) {
            <span style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.75rem; background: #f1f5f9; color: #475569; font-size: 0.8rem; border-radius: 9999px; font-weight: 500;">
              "{{ searchQuery }}"
              <button (click)="clearSearch()" style="background: none; border: none; cursor: pointer; padding: 0; color: inherit; display: flex;">
                <span class="material-icons" style="font-size: 14px;">close</span>
              </button>
            </span>
          }
          <button (click)="clearAllFilters()" style="background: none; border: none; cursor: pointer; padding: 0.25rem 0.75rem; font-size: 0.8rem; font-weight: 600; color: #059669; transition: color 0.2s;"
                  onmouseover="this.style.color='#047857'" onmouseout="this.style.color='#059669'">
            Clear All
          </button>
        </div>
      }

      <!-- Content: Sidebar + Grid -->
      <div style="display: flex; gap: 2rem;">
        <!-- Desktop filter sidebar -->
        <app-meal-filter-sidebar
          #filterSidebar
          [categories]="categories()"
          [mealTypes]="mealTypes()"
          [selectedCategoryId]="selectedCategoryId()"
          [filters]="filters"
          (categoryChange)="selectCategory($event)"
          (filtersChange)="onFiltersChange($event)"
          (clearFilters)="clearAllFilters()">
        </app-meal-filter-sidebar>

        <!-- Meal Grid -->
        <div style="flex: 1; min-width: 0;">
          @if (loading()) {
            <!-- Loading skeleton -->
            <div style="display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); gap: 1.25rem;" class="meals-grid">
              @for (i of [1,2,3,4,5,6]; track i) {
                <div style="background: #fff; border-radius: 1rem; overflow: hidden; border: 1px solid #f1f5f9; animation: skeletonPulse 1.5s ease-in-out infinite;" [style.animation-delay]="(i * 0.1) + 's'">
                  <div style="height: 12rem; background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite;"></div>
                  <div style="padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
                    <div style="display: flex; gap: 0.5rem;">
                      <div style="height: 1.25rem; width: 4rem; background: #f1f5f9; border-radius: 9999px;"></div>
                      <div style="height: 1.25rem; width: 3.5rem; background: #f1f5f9; border-radius: 9999px;"></div>
                    </div>
                    <div style="height: 1rem; width: 75%; background: #f1f5f9; border-radius: 0.25rem;"></div>
                    <div style="height: 0.75rem; width: 100%; background: #f1f5f9; border-radius: 0.25rem;"></div>
                    <div style="display: flex; justify-content: space-between; padding-top: 0.75rem; border-top: 1px solid #f8fafc;">
                      <div style="height: 1.25rem; width: 4rem; background: #f1f5f9; border-radius: 0.25rem;"></div>
                      <div style="height: 2rem; width: 6rem; background: #f1f5f9; border-radius: 0.5rem;"></div>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else if (error()) {
            <!-- Error state -->
            <div style="text-align: center; padding: 4rem 1rem;">
              <span class="material-icons" style="font-size: 3rem; color: #fca5a5; margin-bottom: 1rem;">error_outline</span>
              <h3 style="font-size: 1.125rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;">Unable to load meals</h3>
              <p style="color: #64748b; margin-bottom: 1.5rem; font-size: 0.875rem;">{{ error() }}</p>
              <button (click)="loadMeals()"
                      style="padding: 0.625rem 1.5rem; background: linear-gradient(135deg, #059669, #16a34a); color: #fff; font-weight: 600; font-size: 0.875rem; border-radius: 0.75rem; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(5,150,105,0.35); transition: all 0.3s;"
                      onmouseover="this.style.boxShadow='0 6px 20px rgba(5,150,105,0.45)'; this.style.transform='translateY(-1px)'"
                      onmouseout="this.style.boxShadow='0 4px 14px rgba(5,150,105,0.35)'; this.style.transform='none'">
                Try Again
              </button>
            </div>
          } @else if (meals().length === 0) {
            <!-- Empty state -->
            <div style="text-align: center; padding: 4rem 1rem; background: #fff; border-radius: 1rem; border: 1px solid #e5e7eb;">
              <span style="font-size: 3.5rem; display: block; margin-bottom: 0.75rem;">&#127869;</span>
              <h3 style="font-size: 1.125rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;">No meals found</h3>
              <p style="color: #64748b; margin-bottom: 1.5rem; font-size: 0.875rem;">Try changing your search or filters</p>
              <div style="display: flex; gap: 0.75rem; justify-content: center;">
                <button (click)="clearAllFilters()"
                        style="padding: 0.625rem 1.25rem; border: 1.5px solid #059669; color: #059669; font-weight: 600; font-size: 0.8rem; border-radius: 0.75rem; background: transparent; cursor: pointer; transition: all 0.3s;"
                        onmouseover="this.style.background='#ecfdf5'" onmouseout="this.style.background='transparent'">
                  Clear Filters
                </button>
                <a routerLink="/meals"
                   style="padding: 0.625rem 1.25rem; background: linear-gradient(135deg, #059669, #16a34a); color: #fff; font-weight: 600; font-size: 0.8rem; border-radius: 0.75rem; text-decoration: none; display: inline-block; transition: all 0.3s; box-shadow: 0 4px 14px rgba(5,150,105,0.35);"
                   onmouseover="this.style.boxShadow='0 6px 20px rgba(5,150,105,0.45)'; this.style.transform='translateY(-1px)'"
                   onmouseout="this.style.boxShadow='0 4px 14px rgba(5,150,105,0.35)'; this.style.transform='none'">
                  View All Meals
                </a>
              </div>
            </div>
          } @else {
            <!-- Grid View -->
            @if (viewMode() === 'grid') {
              <div style="display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); gap: 1.25rem;" class="meals-grid" #mealGrid>
                @for (meal of meals(); track meal.id; let i = $index) {
                  <div class="meals-card-anim" [style.animation-delay]="(i * 0.06) + 's'">
                    <app-meal-card
                      [meal]="meal"
                      (onAddToCart)="addToCart($event)"
                      (onBuyNow)="buyNow($event)">
                    </app-meal-card>
                  </div>
                }
              </div>
            }

            <!-- List View -->
            @if (viewMode() === 'list') {
              <div style="display: flex; flex-direction: column; gap: 0.75rem;" #mealGrid>
                @for (meal of meals(); track meal.id; let i = $index) {
                  <div class="meals-card-anim" [style.animation-delay]="(i * 0.06) + 's'">
                    <a [routerLink]="['/meals', meal.slug]"
                       style="display: flex; gap: 1rem; background: #fff; border-radius: 0.75rem; overflow: hidden; border: 1px solid #f1f5f9; text-decoration: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);"
                       onmouseover="this.style.boxShadow='0 8px 25px rgba(0,0,0,0.08)'; this.style.borderColor='#a7f3d0'; this.style.transform='translateY(-2px)'"
                       onmouseout="this.style.boxShadow='none'; this.style.borderColor='#f1f5f9'; this.style.transform='none'">
                      <!-- Image -->
                      <div style="width: 10rem; min-height: 7rem; flex-shrink: 0; overflow: hidden; position: relative;">
                        @if (meal.meal_image) {
                          <img [src]="meal.meal_image" [alt]="meal.name" loading="lazy"
                               style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s;"
                               onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1)'" />
                        } @else {
                          <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #ecfdf5, #d1fae5);">
                            <span style="font-size: 2rem;">&#127835;</span>
                          </div>
                        }
                        @if (meal.has_discount) {
                          <span style="position: absolute; top: 0.5rem; left: 0.5rem; padding: 0.125rem 0.5rem; background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff; font-size: 0.6rem; font-weight: 700; border-radius: 9999px;">{{ meal.discount_percentage }}% OFF</span>
                        }
                      </div>
                      <!-- Content -->
                      <div style="flex: 1; min-width: 0; padding: 0.75rem 0.75rem 0.75rem 0; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                          <div style="display: flex; align-items: center; gap: 0.375rem; margin-bottom: 0.25rem; flex-wrap: wrap;">
                            @if (meal.category) {
                              <span style="padding: 0.0625rem 0.375rem; background: #f1f5f9; color: #475569; font-size: 0.6rem; font-weight: 500; border-radius: 9999px;">{{ meal.category.name }}</span>
                            }
                            @if (meal.meal_type) {
                              <span style="padding: 0.0625rem 0.375rem; background: #ecfdf5; color: #059669; font-size: 0.6rem; font-weight: 500; border-radius: 9999px;">{{ meal.meal_type.name }}</span>
                            }
                            @if (meal.calories > 0) {
                              <span style="padding: 0.0625rem 0.375rem; background: #fefce8; color: #a16207; font-size: 0.6rem; font-weight: 500; border-radius: 9999px;">{{ meal.calories }} cal</span>
                            }
                          </div>
                          <h3 style="font-weight: 700; color: #0f172a; font-size: 0.9rem; line-height: 1.3; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ meal.name }}</h3>
                          <p style="color: #64748b; font-size: 0.75rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">{{ meal.short_description || meal.description || 'Freshly prepared homestyle meal' }}</p>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.5rem;">
                          <div style="display: flex; align-items: baseline; gap: 0.375rem;">
                            <span style="font-size: 1.1rem; font-weight: 800; color: #059669;">&#8377;{{ meal.effective_price || meal.price }}</span>
                            @if (meal.has_discount) {
                              <span style="font-size: 0.7rem; color: #94a3b8; text-decoration: line-through;">&#8377;{{ meal.price }}</span>
                            }
                          </div>
                          <div style="display: flex; gap: 0.375rem;" (click)="$event.preventDefault(); $event.stopPropagation()">
                            <button (click)="addToCart(meal)"
                                    style="padding: 0.375rem 0.75rem; background: linear-gradient(135deg, #059669, #16a34a); color: #fff; font-size: 0.65rem; font-weight: 600; border-radius: 0.5rem; border: none; cursor: pointer; transition: all 0.25s; display: flex; align-items: center; gap: 0.25rem; box-shadow: 0 2px 6px rgba(5,150,105,0.25); white-space: nowrap;"
                                    onmouseover="this.style.boxShadow='0 4px 12px rgba(5,150,105,0.4)'; this.style.transform='translateY(-1px)'"
                                    onmouseout="this.style.boxShadow='0 2px 6px rgba(5,150,105,0.25)'; this.style.transform='none'">
                              <span class="material-icons" style="font-size: 14px;">add_shopping_cart</span>
                              Add
                            </button>
                            <button (click)="buyNow(meal)"
                                    style="padding: 0.375rem 0.75rem; background: transparent; color: #059669; font-size: 0.65rem; font-weight: 600; border-radius: 0.5rem; border: 1.5px solid #059669; cursor: pointer; transition: all 0.25s; display: flex; align-items: center; gap: 0.25rem; white-space: nowrap;"
                                    onmouseover="this.style.background='#ecfdf5'" onmouseout="this.style.background='transparent'">
                              <span class="material-icons" style="font-size: 14px;">flash_on</span>
                              Buy
                            </button>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                }
              </div>
            }

            <!-- Pagination -->
            @if (pagination() && pagination()!.last_page > 1) {
              <div style="margin-top: 2rem;">
                <app-customer-pagination
                  [meta]="pagination()!"
                  (pageChange)="onPageChange($event)">
                </app-customer-pagination>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes mealsSlideIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes mealHeroFloat {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-10px) rotate(5deg); }
      50% { transform: translateY(-5px) rotate(-3deg); }
      75% { transform: translateY(-12px) rotate(2deg); }
    }
    @keyframes mealSteam {
      0% { opacity: 0; transform: translateY(0) scaleX(1); }
      50% { opacity: 0.6; transform: translateY(-1rem) scaleX(1.5); }
      100% { opacity: 0; transform: translateY(-2rem) scaleX(2); }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes skeletonPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    @keyframes cardFadeIn {
      from { opacity: 0; transform: translateY(20px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .meals-card-anim {
      animation: cardFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

    .meals-mobile-only { display: flex !important; }
    @media (min-width: 1024px) {
      .meals-mobile-only { display: none !important; }
      .meals-sort-label { display: inline !important; }
    }
    @media (max-width: 1023.98px) {
      /* Compact app-style hero: hidden on mobile */
      .meals-hero { display: none !important; }
      .meals-hero > *:not(.meals-hero-content) { display: none !important; }
      .meals-breadcrumb { display: none !important; }
      .meals-hero-icon { font-size: 1.5rem !important; }
      .meals-hero-title { font-size: 1.4rem !important; }
      .meals-hero-sub { font-size: 0.8rem !important; }

      /* Sticky filter bar (app-style) pinned under the fixed header */
      .meals-toolbar {
        position: sticky;
        top: 67px;
        z-index: 30;
        margin-left: -1rem;
        margin-right: -1rem;
        margin-bottom: 1rem !important;
        padding: 0.6rem 1rem;
        background: rgba(255, 255, 255, 0.96);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-bottom: 1px solid #eef2f7;
        box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
      }
      .meals-view-toggle { display: none !important; }
      .meals-count { font-size: 0.72rem !important; }
      .meals-toolbar select {
        max-width: 9.5rem;
        padding: 0.5rem 0.6rem !important;
        font-size: 0.75rem !important;
      }

      /* Tighter app list spacing; allow cells to shrink below card min-content */
      .meals-grid { gap: 0.75rem !important; grid-template-columns: minmax(0, 1fr) !important; }
    }
    @media (min-width: 640px) {
      .meals-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    }
    @media (min-width: 1280px) {
      .meals-grid { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
    }
  `],
})
export class MealsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private browseApi = inject(CustomerBrowseApiService);
  private appState = inject(AppStateService);
  private cartState = inject(CartStateService);
  private seo = inject(SeoService);

  meals = signal<Meal[]>([]);
  categories = signal<MealCategory[]>([]);
  mealTypes = signal<MealType[]>([]);
  loading = signal(true);
  error = signal('');
  pagination = signal<PaginationMeta | null>(null);
  totalResults = signal(0);
  selectedCategoryId = signal<number | null>(null);
  activeCategory = signal<MealCategory | null>(null);
  viewMode = signal<'grid' | 'list'>('grid');
  searchQuery = '';
  sortBy = 'display_order';
  filters: MealFilters = { meal_type_id: null, min_price: null, max_price: null, featured: null, bestseller: null, recommended: null };

  private searchSubject = new Subject<string>();
  private subscriptions: Subscription[] = [];

  activeFilterCount = computed(() => {
    let count = 0;
    if (this.filters.meal_type_id) count++;
    if (this.filters.featured) count++;
    if (this.filters.bestseller) count++;
    if (this.filters.recommended) count++;
    if (this.filters.min_price || this.filters.max_price) count++;
    return count;
  });

  ngOnInit(): void {
    this.seo.setPageTitle('Meals - VyaruFood & Tiffin Service', 'Browse our selection of freshly prepared meals');

    this.subscriptions.push(
      this.searchSubject.pipe(
        debounceTime(400),
        distinctUntilChanged(),
      ).subscribe(() => {
        this.updateUrlAndLoad();
      })
    );

    this.subscriptions.push(
      this.route.queryParams.subscribe(params => {
        this.restoreStateFromQuery(params);
        this.loadInitialData();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private loadInitialData(): void {
    if (this.categories().length === 0) {
      this.browseApi.getCategories().subscribe({
        next: (res) => { if (res.success && res.data) this.categories.set(res.data); },
        error: () => {},
      });
    }
    if (this.mealTypes().length === 0) {
      this.browseApi.getMealTypes().subscribe({
        next: (res) => { if (res.success && res.data) this.mealTypes.set(res.data); },
        error: () => {},
      });
    }
    this.loadMeals();
  }

  loadMeals(): void {
    this.loading.set(true);
    this.error.set('');

    const params: Record<string, any> = {
      per_page: 12,
      sort: this.sortBy === 'price' || this.sortBy === 'price_desc' || this.sortBy === 'calories' ? this.sortBy.replace('_desc', '') : this.sortBy,
      order: this.sortBy === 'price_desc' ? 'desc' : (this.sortBy === 'calories' ? 'asc' : 'asc'),
    };

    if (this.selectedCategoryId()) params['category_id'] = this.selectedCategoryId();
    if (this.searchQuery) params['search'] = this.searchQuery;
    if (this.filters.meal_type_id) params['meal_type_id'] = this.filters.meal_type_id;
    if (this.filters.featured) params['featured'] = 1;
    if (this.filters.bestseller) params['bestseller'] = 1;
    if (this.filters.recommended) params['recommended'] = 1;

    const page = this.route.snapshot.queryParams['page'];
    if (page) params['page'] = page;

    this.browseApi.getMeals(params as any).pipe(
      catchError((err) => {
        this.loading.set(false);
        this.error.set('Something went wrong. Please try again.');
        return of(null);
      }),
      finalize(() => this.loading.set(false)),
    ).subscribe(res => {
      if (res && res.success) {
        this.meals.set(res.data);
        this.pagination.set(res.meta);
        this.totalResults.set(res.meta?.total || 0);
      }
    });
  }

  private restoreStateFromQuery(params: Record<string, string>): void {
    this.searchQuery = params['search'] || '';
    this.sortBy = params['sort'] || 'display_order';
    this.filters = {
      meal_type_id: params['meal_type_id'] ? +params['meal_type_id'] : null,
      min_price: params['min_price'] ? +params['min_price'] : null,
      max_price: params['max_price'] ? +params['max_price'] : null,
      featured: params['featured'] === '1' || params['featured'] === 'true' ? true : null,
      bestseller: params['bestseller'] === '1' || params['bestseller'] === 'true' ? true : null,
      recommended: params['recommended'] === '1' || params['recommended'] === 'true' ? true : null,
    };

    const catId = params['category_id'] ? +params['category_id'] : null;
    this.selectedCategoryId.set(catId);
    this.activeCategory.set(this.categories().find(c => c.id === catId) || null);
  }

  private updateUrlAndLoad(): void {
    const queryParams: Record<string, string | null> = {
      search: this.searchQuery || null,
      category_id: this.selectedCategoryId() ? String(this.selectedCategoryId()) : null,
      sort: this.sortBy !== 'display_order' ? this.sortBy : null,
      page: null,
      meal_type_id: this.filters.meal_type_id ? String(this.filters.meal_type_id) : null,
      min_price: this.filters.min_price ? String(this.filters.min_price) : null,
      max_price: this.filters.max_price ? String(this.filters.max_price) : null,
      featured: this.filters.featured ? '1' : null,
      bestseller: this.filters.bestseller ? '1' : null,
      recommended: this.filters.recommended ? '1' : null,
    };
    this.router.navigate([], { relativeTo: this.route, queryParams, queryParamsHandling: 'merge' });
  }

  selectCategory(id: number | null): void {
    this.selectedCategoryId.set(id);
    this.activeCategory.set(id ? this.categories().find(c => c.id === id) || null : null);
    this.updateUrlAndLoad();
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchSubject.next('');
  }

  onSortChange(value: string): void {
    this.sortBy = value;
    this.updateUrlAndLoad();
  }

  onFiltersChange(newFilters: MealFilters): void {
    this.filters = { ...newFilters };
    this.updateUrlAndLoad();
  }

  updateFilter(key: keyof MealFilters, value: any): void {
    this.filters = { ...this.filters, [key]: value };
    this.updateUrlAndLoad();
  }

  clearAllFilters(): void {
    this.filters = { meal_type_id: null, min_price: null, max_price: null, featured: null, bestseller: null, recommended: null };
    this.selectedCategoryId.set(null);
    this.activeCategory.set(null);
    this.searchQuery = '';
    this.sortBy = 'display_order';
    this.updateUrlAndLoad();
  }

  onPageChange(page: number): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: { page }, queryParamsHandling: 'merge' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getMealTypeName(id: number): string {
    return this.mealTypes().find(mt => mt.id === id)?.name || 'Meal Type';
  }

  addToCart(meal: Meal): void {
    if (!this.appState.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/meals' } });
      return;
    }
    this.cartState.addItem(meal.id, 1, meal.name);
  }

  buyNow(meal: Meal): void {
    if (!this.appState.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/meals' } });
      return;
    }
    this.cartState.addItem(meal.id, 1, meal.name);
    this.router.navigate(['/cart']);
  }
}
