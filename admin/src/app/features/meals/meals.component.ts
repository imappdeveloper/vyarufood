import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MealApiService } from '../../core/services/meal-api.service';
import { MealCategoryApiService } from '../../core/services/meal-category-api.service';
import { MealTypeApiService } from '../../core/services/meal-type-api.service';
import { KitchenApiService } from '../../core/services/kitchen-api.service';
import { NotificationService } from '../../core/services/notification.service';
import { Meal, MealImportResult } from '../../core/models/meal/meal.model';
import { MealCategory } from '../../core/models/meal/meal-category.model';

@Component({
  selector: 'app-meals',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div *ngIf="loading && meals.length === 0" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading meals...</p>
      </div>
    </div>

    <div *ngIf="!loading || meals.length > 0" style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Dashboard</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Meals</span>
      </div>

      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Meals</h1>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Manage your food catalog and meal offerings</p>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button (click)="openImportDialog()"
            style="padding: 8px 14px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#059669';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='white'">
            <span class="material-icons" style="font-size: 18px; color: #6b7280;">upload_file</span> Import
          </button>
          <button (click)="exportMeals()"
            style="padding: 8px 14px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#059669';this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb';this.style.background='white'">
            <span class="material-icons" style="font-size: 18px; color: #6b7280;">download</span> Export
          </button>
          <a routerLink="/admin/meals/create"
            style="padding: 8px 20px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span class="material-icons" style="font-size: 18px;">add</span> Add Meal
          </a>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #059669;">restaurant_menu</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Meals</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ totalCount }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #047857;">check_circle</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Active</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ activeCount }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #d97706;">star</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Featured</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ featuredCount }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #f3e8ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #7c3aed;">local_fire_department</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Bestsellers</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ bestsellerCount }}</p>
          </div>
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <div style="position: relative; flex: 1; min-width: 200px;">
            <span class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">search</span>
            <input type="text" [(ngModel)]="search" (ngModelChange)="onSearchDebounce()" placeholder="Search meals..."
              style="width: 100%; padding: 9px 14px 9px 38px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
            <button *ngIf="search" (click)="clearSearch()"
              style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; line-height: 0;"
              onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
              <span class="material-icons" style="font-size: 16px; color: #9ca3af;">close</span>
            </button>
          </div>
          <select [(ngModel)]="statusFilter" (change)="onFilterChange()"
            style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 140px; transition: all 0.2s ease;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
            <option [ngValue]="null">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select [(ngModel)]="categoryFilter" (change)="onFilterChange()"
            style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 160px; transition: all 0.2s ease;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
            <option [ngValue]="null">All Categories</option>
            <option *ngFor="let cat of categories; trackBy: trackById" [ngValue]="cat.id">{{ cat.name }}</option>
          </select>
          <select [(ngModel)]="kitchenFilter" (change)="onFilterChange()"
            style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 140px; transition: all 0.2s ease;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
            <option [ngValue]="null">All Kitchens</option>
            <option *ngFor="let k of kitchens; trackBy: trackById" [ngValue]="k.id">{{ k.name }}</option>
          </select>
          <select [(ngModel)]="featuredFilter" (change)="onFilterChange()"
            style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 130px; transition: all 0.2s ease;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
            <option [ngValue]="null">All</option>
            <option value="true">Featured</option>
            <option value="false">Non-Featured</option>
          </select>
        </div>
      </div>

      <div *ngIf="selectedRows.size > 0" style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; margin-bottom: 16px; padding: 12px 20px; display: flex; align-items: center; gap: 12px; animation: slideDown 0.2s ease-out;">
        <span style="font-size: 13px; font-weight: 700; color: #047857;">{{ selectedRows.size }} selected</span>
        <div style="width: 1px; height: 20px; background: #a7f3d0;"></div>
        <button (click)="bulkSetActive()"
          style="padding: 6px 14px; background: white; border: 1px solid #059669; border-radius: 8px; font-size: 12px; font-weight: 600; color: #047857; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease;"
          onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='white'">
          <span class="material-icons" style="font-size: 16px;">check_circle</span> Activate
        </button>
        <button (click)="bulkSetInactive()"
          style="padding: 6px 14px; background: white; border: 1px solid #059669; border-radius: 8px; font-size: 12px; font-weight: 600; color: #047857; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease;"
          onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='white'">
          <span class="material-icons" style="font-size: 16px;">block</span> Deactivate
        </button>
        <button (click)="bulkUpdatePrice()"
          style="padding: 6px 14px; background: white; border: 1px solid #059669; border-radius: 8px; font-size: 12px; font-weight: 600; color: #047857; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease;"
          onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='white'">
          <span class="material-icons" style="font-size: 16px;">price_change</span> Update Price
        </button>
        <button (click)="bulkChangeCategory()"
          style="padding: 6px 14px; background: white; border: 1px solid #059669; border-radius: 8px; font-size: 12px; font-weight: 600; color: #047857; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease;"
          onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='white'">
          <span class="material-icons" style="font-size: 16px;">category</span> Change Category
        </button>
        <button (click)="bulkDelete()"
          style="padding: 6px 14px; background: white; border: 1px solid #fca5a5; border-radius: 8px; font-size: 12px; font-weight: 600; color: #dc2626; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease;"
          onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='white'">
          <span class="material-icons" style="font-size: 16px;">delete</span> Delete
        </button>
        <button (click)="clearSelection()"
          style="margin-left: auto; background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; line-height: 0; color: #9ca3af;"
          onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
          <span class="material-icons" style="font-size: 18px;">close</span>
        </button>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
        <div *ngIf="loading && meals.length > 0" style="display: flex; align-items: center; justify-content: center; padding: 32px;">
          <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        </div>

        <div *ngIf="!loading && meals.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
          <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span class="material-icons" style="font-size: 32px; color: #059669;">restaurant_menu</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No meals found</h3>
          <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0 0 24px 0;">
            <span *ngIf="search || statusFilter || categoryFilter || kitchenFilter || featuredFilter">Try adjusting your search or filter criteria</span>
            <span *ngIf="!search && !statusFilter && !categoryFilter && !kitchenFilter && !featuredFilter">Get started by adding your first meal</span>
          </p>
          <a *ngIf="!search && !statusFilter && !categoryFilter && !kitchenFilter && !featuredFilter" routerLink="/admin/meals/create"
            style="padding: 10px 24px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span class="material-icons" style="font-size: 18px;">add</span> Add Meal
          </a>
          <button *ngIf="search || statusFilter || categoryFilter || kitchenFilter || featuredFilter" (click)="clearFilters()"
            style="padding: 10px 24px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#9ca3af'" onmouseout="this.style.borderColor='#e5e7eb'">Clear Filters</button>
        </div>

        <div *ngIf="!loading && meals.length > 0" style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                <th style="padding: 10px 8px 10px 16px; text-align: left; width: 44px;">
                  <input type="checkbox" (change)="toggleAllRows($event)"
                    [checked]="isAllSelected()"
                    style="width: 16px; height: 16px; accent-color: #059669; cursor: pointer; margin: 0;" />
                </th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; min-width: 200px;">Meal</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; display: none;" [style.display]="'table-cell'" class="md-cell">Category</th>
                <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; display: none;" [style.display]="'table-cell'" class="md-cell">Price</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; display: none;" [style.display]="'table-cell'" class="lg-cell">Nutrition</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; display: none;" [style.display]="'table-cell'" class="xl-cell">Flags</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                <th style="padding: 10px 16px 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; width: 60px;"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of meals; let i = index" (click)="viewMeal(row)" style="cursor: pointer; border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=(this.getAttribute('data-idx') % 2 === 0) ? 'transparent' : '#f9fafb'">
                <td [attr.data-idx]="i" style="padding: 12px 8px 12px 16px;">
                  <input type="checkbox" (click)="$event.stopPropagation()" (change)="toggleRow(row)"
                    [checked]="selectedRows.has(row)" style="width: 16px; height: 16px; accent-color: #059669; cursor: pointer; margin: 0;" />
                </td>
                <td style="padding: 12px 12px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 40px; height: 40px; border-radius: 10px; overflow: hidden; background: #f3f4f6; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                      <span *ngIf="!row.thumbnail && !row.meal_image" class="material-icons" style="font-size: 18px; color: #d1d5db;">restaurant</span>
                      <img *ngIf="row.thumbnail || row.meal_image" [src]="row.thumbnail || row.meal_image" [alt]="row.name" style="width: 100%; height: 100%; object-fit: cover;" />
                    </div>
                    <div>
                      <div style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ row.name }}</div>
                      <p style="font-size: 11px; color: #9ca3af; margin: 2px 0 0 0;">{{ row.meal_code }}</p>
                    </div>
                  </div>
                </td>
                <td style="padding: 12px 12px; display: none;" [style.display]="'table-cell'" class="md-cell">
                  <span style="display: inline-flex; padding: 2px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; background: #d1fae5; color: #047857;">
                    {{ row.category?.name || '-' }}
                  </span>
                </td>
                <td style="padding: 12px 12px; text-align: right; display: none;" [style.display]="'table-cell'" class="md-cell">
                  <div>
                    <span style="font-size: 13px; font-weight: 700; color: #1f2937;">\u20B9{{ row.effective_price || row.offer_price || row.price }}</span>
                    <span *ngIf="row.offer_price && row.offer_price < row.price" style="font-size: 11px; color: #9ca3af; text-decoration: line-through; margin-left: 4px;">\u20B9{{ row.price }}</span>
                  </div>
                </td>
                <td style="padding: 12px 12px; display: none;" [style.display]="'table-cell'" class="lg-cell">
                  <span style="font-size: 12px; color: #6b7280;">{{ row.calories }} kcal</span>
                  <span style="color: #d1d5db; margin: 0 4px;">\u00B7</span>
                  <span style="font-size: 12px; color: #6b7280;">{{ row.protein }}g protein</span>
                </td>
                <td style="padding: 12px 12px; display: none;" [style.display]="'table-cell'" class="xl-cell">
                  <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    <span *ngIf="row.is_featured" style="padding: 1px 8px; border-radius: 4px; font-size: 10px; font-weight: 800; background: #fef3c7; color: #b45309; text-transform: uppercase; letter-spacing: 0.03em;">Featured</span>
                    <span *ngIf="row.is_recommended" style="padding: 1px 8px; border-radius: 4px; font-size: 10px; font-weight: 800; background: #dbeafe; color: #1d4ed8; text-transform: uppercase; letter-spacing: 0.03em;">Recommended</span>
                    <span *ngIf="row.is_new" style="padding: 1px 8px; border-radius: 4px; font-size: 10px; font-weight: 800; background: #d1fae5; color: #047857; text-transform: uppercase; letter-spacing: 0.03em;">New</span>
                    <span *ngIf="row.is_bestseller" style="padding: 1px 8px; border-radius: 4px; font-size: 10px; font-weight: 800; background: #f3e8ff; color: #7c3aed; text-transform: uppercase; letter-spacing: 0.03em;">Bestseller</span>
                  </div>
                </td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="row.status === 'active' ? '#d1fae5' : '#f3f4f6'"
                    [style.color]="row.status === 'active' ? '#047857' : '#6b7280'">
                    <span *ngIf="row.status === 'active'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor; margin-right: 4px;"></span>
                    {{ row.status_label }}
                  </span>
                </td>
                <td style="padding: 12px 16px 12px 12px; text-align: center;">
                  <div style="display: flex; align-items: center; justify-content: center; gap: 2px;">
                    <button (click)="viewMeal(row); $event.stopPropagation()"
                      style="width: 32px; height: 32px; border: none; background: none; cursor: pointer; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: #059669; transition: all 0.15s ease; line-height: 0;"
                      onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
                      <span class="material-icons" style="font-size: 18px;">visibility</span>
                    </button>
                    <div style="position: relative;">
                      <button (click)="toggleActionMenu(row); $event.stopPropagation()"
                        style="width: 32px; height: 32px; border: none; background: none; cursor: pointer; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: #9ca3af; transition: all 0.15s ease; line-height: 0;"
                        onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
                        <span class="material-icons" style="font-size: 18px;">more_vert</span>
                      </button>
                      <div *ngIf="activeActionRow?.uuid === row.uuid" style="position: absolute; right: 0; top: 100%; z-index: 50; background: white; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 10px 40px rgba(0,0,0,0.12); min-width: 180px; padding: 6px; margin-top: 4px; animation: fadeIn 0.1s ease-out;">
                        <button (click)="viewMeal(row); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">visibility</span> View Details
                        </button>
                        <button (click)="editMeal(row); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">edit</span> Edit
                        </button>
                        <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                        <button *ngIf="row.status !== 'active'" (click)="setStatus(row, 'active'); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #047857;">check_circle</span> Activate
                        </button>
                        <button *ngIf="row.status === 'active'" (click)="setStatus(row, 'inactive'); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #d97706;">pause</span> Deactivate
                        </button>
                        <button (click)="duplicateMeal(row); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #2563eb;">content_copy</span> Duplicate
                        </button>
                        <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                        <button (click)="deleteMeal(row); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px;">delete</span> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-top: 1px solid #f3f4f6; flex-wrap: wrap; gap: 8px;">
            <span style="font-size: 12px; color: #9ca3af;">Showing {{ getRangeLabel() }}</span>
            <div style="display: flex; align-items: center; gap: 6px;">
              <button (click)="goToPage(1)" [disabled]="currentPage <= 1"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage <= 1 ? '0.4' : '1'"
                [style.cursor]="currentPage <= 1 ? 'not-allowed' : 'pointer'"
                onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">first_page</span>
              </button>
              <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage <= 1"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage <= 1 ? '0.4' : '1'"
                [style.cursor]="currentPage <= 1 ? 'not-allowed' : 'pointer'"
                onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">chevron_left</span>
              </button>
              <span style="font-size: 12px; color: #6b7280; font-weight: 600; padding: 0 4px;">Page {{ currentPage }} of {{ totalPages }}</span>
              <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage >= totalPages"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage >= totalPages ? '0.4' : '1'"
                [style.cursor]="currentPage >= totalPages ? 'not-allowed' : 'pointer'"
                onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">chevron_right</span>
              </button>
              <button (click)="goToPage(totalPages)" [disabled]="currentPage >= totalPages"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage >= totalPages ? '0.4' : '1'"
                [style.cursor]="currentPage >= totalPages ? 'not-allowed' : 'pointer'"
                onmouseover="if(this.disabled===false){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">last_page</span>
              </button>
              <select (change)="onPerPageChange($event)" [style]="'padding: 6px 28px 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #374151; background: white; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; margin-left: 8px;'"
                onfocus="this.style.borderColor='#059669'" onblur="this.style.borderColor='#e5e7eb'">
                <option value="10">10 / page</option>
                <option value="25">25 / page</option>
                <option value="50">50 / page</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <input #fileInput type="file" hidden accept=".csv,.xlsx,.xls" (change)="onFileSelected($event)" />

      <div *ngIf="importing" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.15s ease-out;">
        <div style="background: white; border-radius: 16px; padding: 32px; text-align: center; max-width: 360px; width: 90vw; box-shadow: 0 20px 60px rgba(0,0,0,0.2);">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: #d1fae5; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
            <div style="width: 28px; height: 28px; border: 3px solid #a7f3d0; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          </div>
          <p style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">Importing meals...</p>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Please wait while we process your file</p>
        </div>
      </div>

      <div *ngIf="importResult" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.15s ease-out;" (click)="importResult = null">
        <div style="background: white; border-radius: 16px; padding: 24px; max-width: 420px; width: 90vw; box-shadow: 0 20px 60px rgba(0,0,0,0.2);" (click)="$event.stopPropagation()">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
            <div style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;"
              [style.background]="importResult.failures.length > 0 ? '#fef3c7' : '#d1fae5'">
              <span class="material-icons" style="font-size: 20px;"
                [style.color]="importResult.failures.length > 0 ? '#d97706' : '#047857'">
                {{ importResult.failures.length > 0 ? 'warning' : 'check_circle' }}
              </span>
            </div>
            <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Import Results</h3>
          </div>
          <div style="margin-bottom: 24px;">
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px 0;">
              <span class="material-icons" style="font-size: 18px; color: #047857;">check_circle</span>
              <span style="font-size: 13px; color: #374151;">{{ importResult.successes }} meals imported successfully</span>
            </div>
            <div *ngIf="importResult.failures.length > 0" style="display: flex; align-items: center; gap: 8px; padding: 8px 0;">
              <span class="material-icons" style="font-size: 18px; color: #dc2626;">error</span>
              <span style="font-size: 13px; color: #dc2626;">{{ importResult.failures.length }} errors occurred</span>
            </div>
          </div>
          <div style="display: flex; justify-content: flex-end;">
            <button (click)="importResult = null"
              style="padding: 10px 28px; background: #059669; color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(5,150,105,0.3);"
              onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">Close</button>
          </div>
        </div>
      </div>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      @media (min-width: 768px) { .md-cell { display: table-cell !important; } }
      @media (min-width: 1024px) { .lg-cell { display: table-cell !important; } }
      @media (min-width: 1280px) { .xl-cell { display: table-cell !important; } }
    </style>
  `,
})
export class MealsComponent implements OnInit {
  private mealApi = inject(MealApiService);
  private categoryApi = inject(MealCategoryApiService);
  private mealTypeApi = inject(MealTypeApiService);
  private kitchenApi = inject(KitchenApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  meals: Meal[] = [];
  selectedRows = new Set<Meal>();
  activeActionRow: Meal | null = null;

  loading = false;
  importing = false;
  importResult: MealImportResult | null = null;

  currentPage = 1;
  perPage = 10;
  totalCount = 0;
  totalPages = 1;

  sort = 'created_at';
  order: 'asc' | 'desc' = 'desc';
  search = '';
  statusFilter: string | null = null;
  categoryFilter: number | null = null;
  kitchenFilter: number | null = null;
  featuredFilter: string | null = null;

  activeCount = 0;
  inactiveCount = 0;
  featuredCount = 0;
  bestsellerCount = 0;

  categories: MealCategory[] = [];
  kitchens: any[] = [];

  private searchTimeout: any;
  Math = Math;

  ngOnInit(): void {
    this.loadDropdowns();
    this.loadMeals();
  }

  loadDropdowns(): void {
    this.categoryApi.getAll().subscribe({ next: (res) => { this.categories = res.data || []; } });
    this.kitchenApi.getAll().subscribe({ next: (res) => { this.kitchens = res.data || []; } });
  }

  loadMeals(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: this.currentPage.toString(),
      per_page: this.perPage.toString(),
      sort: this.sort,
      order: this.order,
    };
    if (this.search) params['search'] = this.search;
    if (this.statusFilter) params['status'] = this.statusFilter;
    if (this.categoryFilter) params['category_id'] = this.categoryFilter.toString();
    if (this.kitchenFilter) params['kitchen_id'] = this.kitchenFilter.toString();
    if (this.featuredFilter) params['is_featured'] = this.featuredFilter;

    this.mealApi.getPaginated(params).subscribe({
      next: (res) => {
        this.meals = res.data || [];
        this.totalCount = res.meta?.total ?? this.meals.length;
        this.totalPages = Math.max(1, Math.ceil(this.totalCount / this.perPage));
        this.activeCount = this.meals.filter(m => m.status === 'active').length;
        this.inactiveCount = this.meals.filter(m => m.status === 'inactive').length;
        this.featuredCount = this.meals.filter(m => m.is_featured).length;
        this.bestsellerCount = this.meals.filter(m => m.is_bestseller).length;
        this.loading = false;
      },
      error: () => { this.loading = false; this.notification.error('Failed to load meals'); },
    });
  }

  onSearchDebounce(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => { this.currentPage = 1; this.loadMeals(); }, 400);
  }

  clearSearch(): void { this.search = ''; this.currentPage = 1; this.loadMeals(); }
  onFilterChange(): void { this.currentPage = 1; this.loadMeals(); }
  clearFilters(): void {
    this.search = '';
    this.statusFilter = null;
    this.categoryFilter = null;
    this.kitchenFilter = null;
    this.featuredFilter = null;
    this.currentPage = 1;
    this.loadMeals();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadMeals();
  }

  onPerPageChange(event: any): void {
    this.perPage = parseInt(event.target.value, 10);
    this.currentPage = 1;
    this.loadMeals();
  }

  isAllSelected(): boolean { return this.meals.length > 0 && this.selectedRows.size === this.meals.length; }
  toggleAllRows(event: any): void {
    if (event.target.checked) { this.meals.forEach(m => this.selectedRows.add(m)); } else { this.selectedRows.clear(); }
    this.activeActionRow = null;
  }
  toggleRow(row: Meal): void {
    if (this.selectedRows.has(row)) { this.selectedRows.delete(row); } else { this.selectedRows.add(row); }
    this.activeActionRow = null;
  }
  clearSelection(): void { this.selectedRows.clear(); this.activeActionRow = null; }

  getRangeLabel(): string {
    if (this.totalCount === 0) return '0 of 0';
    const start = (this.currentPage - 1) * this.perPage + 1;
    const end = Math.min(this.currentPage * this.perPage, this.totalCount);
    return `${start}\u2013${end} of ${this.totalCount}`;
  }

  toggleActionMenu(row: Meal | null): void {
    this.activeActionRow = this.activeActionRow?.uuid === row?.uuid ? null : row;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'inactive': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  viewMeal(row: Meal): void { this.activeActionRow = null; this.router.navigate(['/admin/meals', row.uuid]); }
  editMeal(row: Meal): void { this.activeActionRow = null; this.router.navigate(['/admin/meals', row.uuid, 'edit']); }

  setStatus(row: Meal, status: string): void {
    const label = status === 'active' ? 'Activate' : 'Deactivate';
    if (window.confirm(`${label} "${row.name}"?`)) {
      this.mealApi.setStatus(row.uuid, status).subscribe({
        next: () => { this.notification.success(`Meal ${status === 'active' ? 'activated' : 'deactivated'}`); this.loadMeals(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  duplicateMeal(row: Meal): void {
    if (window.confirm(`Duplicate "${row.name}"?`)) {
      this.mealApi.duplicate(row.uuid).subscribe({
        next: () => { this.notification.success('Meal duplicated'); this.loadMeals(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deleteMeal(row: Meal): void {
    if (window.confirm(`Delete "${row.name}"? This action cannot be undone.`)) {
      this.mealApi.delete(row.uuid).subscribe({
        next: () => { this.notification.success('Meal deleted'); this.loadMeals(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  bulkSetActive(): void {
    const ids = [...this.selectedRows].map(r => r.id);
    if (window.confirm(`Activate ${ids.length} selected meals?`)) {
      this.mealApi.bulkSetStatus(ids, 'active').subscribe({
        next: () => { this.notification.success('Meals activated'); this.clearSelection(); this.loadMeals(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  bulkSetInactive(): void {
    const ids = [...this.selectedRows].map(r => r.id);
    if (window.confirm(`Deactivate ${ids.length} selected meals?`)) {
      this.mealApi.bulkSetStatus(ids, 'inactive').subscribe({
        next: () => { this.notification.success('Meals deactivated'); this.clearSelection(); this.loadMeals(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  bulkUpdatePrice(): void {
    const priceStr = window.prompt('Enter new price:');
    if (priceStr === null) return;
    const price = parseFloat(priceStr);
    if (isNaN(price) || price < 0) { this.notification.error('Invalid price'); return; }
    const offerPriceStr = window.prompt('Enter offer price (leave empty to skip):');
    const ids = [...this.selectedRows].map(r => r.id);
    const data: any = { price };
    if (offerPriceStr !== null && offerPriceStr !== '') {
      const offerPrice = parseFloat(offerPriceStr);
      if (!isNaN(offerPrice)) data.offer_price = offerPrice;
    }
    this.mealApi.bulkUpdatePrice(ids, data).subscribe({
      next: () => { this.notification.success('Prices updated'); this.clearSelection(); this.loadMeals(); },
      error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
    });
  }

  bulkChangeCategory(): void {
    const catStr = window.prompt('Enter category ID:');
    if (catStr === null) return;
    const categoryId = parseInt(catStr, 10);
    if (isNaN(categoryId)) { this.notification.error('Invalid category ID'); return; }
    const ids = [...this.selectedRows].map(r => r.id);
    this.mealApi.bulkUpdateCategory(ids, categoryId).subscribe({
      next: () => { this.notification.success('Categories updated'); this.clearSelection(); this.loadMeals(); },
      error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
    });
  }

  bulkDelete(): void {
    const ids = [...this.selectedRows].map(r => r.id);
    if (window.confirm(`Delete ${ids.length} selected meals? This cannot be undone.`)) {
      this.mealApi.bulkDelete(ids).subscribe({
        next: () => { this.notification.success('Meals deleted'); this.clearSelection(); this.loadMeals(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  openImportDialog(): void { this.fileInput.nativeElement.click(); }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.importing = true;
    this.mealApi.import(file).subscribe({
      next: (res) => { this.importing = false; this.importResult = res.data || null; this.loadMeals(); input.value = ''; },
      error: (err) => { this.importing = false; this.notification.error(err.error?.message || 'Import failed'); input.value = ''; },
    });
  }

  exportMeals(): void {
    const filters: Record<string, string> = {};
    if (this.search) filters['search'] = this.search;
    if (this.statusFilter) filters['status'] = this.statusFilter;
    if (this.categoryFilter) filters['category_id'] = this.categoryFilter.toString();
    if (this.kitchenFilter) filters['kitchen_id'] = this.kitchenFilter.toString();
    this.mealApi.export(filters).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'meals-export.csv'; a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => this.notification.error(err.error?.message || 'Export failed'),
    });
  }

  trackById(_index: number, item: any): any { return item.id; }
}
