import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject, debounceTime } from 'rxjs';
import { RecipeApiService } from '../../core/services/recipe-api.service';
import { NotificationService } from '../../core/services/notification.service';
import { Recipe, RECIPE_STATUSES } from '../../core/models/recipe/recipe.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div *ngIf="loading && recipes.length === 0" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading recipes...</p>
      </div>
    </div>

    <div *ngIf="!loading || recipes.length > 0" style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Dashboard</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Recipes</span>
      </div>

      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Recipe Management</h1>
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">Manage recipes, ingredients and food costing</p>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button (click)="addRecipe()"
            style="padding: 8px 20px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; border: none; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span class="material-icons" style="font-size: 18px;">add</span> New Recipe
          </button>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #059669;">menu_book</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Recipes</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.total || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #047857;">check_circle</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Active</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.active || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #d97706;">format_list_numbered</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Ingredients</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.total_items || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 22px; color: #d97706;">attach_money</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Avg Cost</p>
            <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ stats?.avg_cost ? (stats.avg_cost | number:'1.2-2') : '0.00' }}</p>
          </div>
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <div style="position: relative; flex: 1; min-width: 200px;">
            <span class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">search</span>
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="onSearchChange()" placeholder="Search recipes..."
              style="width: 100%; padding: 9px 14px 9px 38px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
              onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
            <button *ngIf="searchQuery" (click)="searchQuery = ''; applyFilters()"
              style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; line-height: 0;"
              onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
              <span class="material-icons" style="font-size: 16px; color: #9ca3af;">close</span>
            </button>
          </div>
          <select [(ngModel)]="statusFilter" (change)="applyFilters()"
            style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 140px; transition: all 0.2s ease;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
            <option [ngValue]="''">All Statuses</option>
            <option *ngFor="let s of statuses; trackBy: trackByValue" [ngValue]="s.value">{{ s.label }}</option>
          </select>
          <select [(ngModel)]="mealFilter" (change)="applyFilters()"
            style="padding: 9px 32px 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; min-width: 140px; transition: all 0.2s ease;"
            onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow=''">
            <option [ngValue]="''">All Meals</option>
            <option *ngFor="let m of meals; trackBy: trackById" [ngValue]="m.id">{{ m.name }}</option>
          </select>
          <button *ngIf="searchQuery || statusFilter || mealFilter" (click)="clearFilters()"
            style="padding: 9px 16px; background: white; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; font-weight: 600; color: #374151; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
            onmouseover="this.style.borderColor='#9ca3af'" onmouseout="this.style.borderColor='#e5e7eb'">
            <span class="material-icons" style="font-size: 16px;">filter_alt_off</span> Clear
          </button>
        </div>
      </div>

      <div *ngIf="selectedCategories.size > 0" style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; margin-bottom: 16px; padding: 12px 20px; display: flex; align-items: center; gap: 12px; animation: slideDown 0.2s ease-out;">
        <span style="font-size: 13px; font-weight: 700; color: #047857;">{{ selectedCategories.size }} selected</span>
        <div style="width: 1px; height: 20px; background: #a7f3d0;"></div>
        <button (click)="clearSelection()"
          style="margin-left: auto; background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; line-height: 0; color: #9ca3af;"
          onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
          <span class="material-icons" style="font-size: 18px;">close</span>
        </button>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
        <div *ngIf="loading && recipes.length > 0" style="display: flex; align-items: center; justify-content: center; padding: 32px;">
          <div style="width: 24px; height: 24px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        </div>

        <div *ngIf="!loading && recipes.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
          <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span class="material-icons" style="font-size: 32px; color: #059669;">menu_book</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No recipes found</h3>
          <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0 0 24px 0;">
            <span *ngIf="searchQuery || statusFilter || mealFilter">Try adjusting your search or filter criteria</span>
            <span *ngIf="!searchQuery && !statusFilter && !mealFilter">No recipes have been created yet. Create your first recipe.</span>
          </p>
        </div>

        <div *ngIf="!loading && recipes.length > 0" style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                <th style="padding: 10px 8px 10px 16px; text-align: left; width: 44px;">
                  <input type="checkbox" (change)="toggleAllRows($event)"
                    [checked]="isAllSelected()"
                    style="width: 16px; height: 16px; accent-color: #059669; cursor: pointer; margin: 0;" />
                </th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Code</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Recipe Name</th>
                <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Meal</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Ingredients</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Yield</th>
                <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Cost</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Food Cost %</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                <th style="padding: 10px 16px 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; width: 60px;"></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of recipes; let i = index" (click)="viewRecipe(row.uuid)" style="cursor: pointer; border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=(parseInt(this.getAttribute('data-idx')) % 2 === 0) ? 'transparent' : '#f9fafb'">
                <td [attr.data-idx]="i" style="padding: 12px 8px 12px 16px;">
                  <input type="checkbox" (click)="$event.stopPropagation()" (change)="toggleRow(row)"
                    [checked]="selectedCategories.has(row)" style="width: 16px; height: 16px; accent-color: #059669; cursor: pointer; margin: 0;" />
                </td>
                <td style="padding: 12px 12px;">
                  <span style="font-size: 12px; font-family: monospace; font-weight: 700; color: #059669;">{{ row.recipe_code }}</span>
                </td>
                <td style="padding: 12px 12px;">
                  <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ row.recipe_name }}</span>
                </td>
                <td style="padding: 12px 12px;">
                  <span style="font-size: 13px; color: #374151;">{{ row.meal_name || '-' }}</span>
                </td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ row.items_count || 0 }}</span>
                </td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span style="font-size: 13px; color: #374151;">{{ row.yield_quantity }} {{ row.yield_unit }}</span>
                </td>
                <td style="padding: 12px 12px; text-align: right;">
                  <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ row.recipe_cost | number:'1.2-2' }}</span>
                </td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span style="font-size: 12px; font-weight: 700;"
                    [style.color]="row.food_cost_percentage > 35 ? '#dc2626' : row.food_cost_percentage > 25 ? '#d97706' : '#059669'">
                    {{ row.food_cost_percentage | number:'1.1-1' }}%
                  </span>
                </td>
                <td style="padding: 12px 12px; text-align: center;">
                  <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                    [style.background]="getStatusBg(row.status)"
                    [style.color]="getStatusText(row.status)">
                    {{ row.status | titlecase }}
                  </span>
                </td>
                <td style="padding: 12px 16px 12px 12px; text-align: center;">
                  <div style="display: flex; align-items: center; justify-content: center; gap: 2px;">
                    <button (click)="viewRecipe(row.uuid); $event.stopPropagation()"
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
                        <button (click)="viewRecipe(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">visibility</span> View Details
                        </button>
                        <button (click)="editRecipe(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">edit</span> Edit
                        </button>
                        <button (click)="cloneRecipe(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #7c3aed;">content_copy</span> Clone
                        </button>
                        <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                        <button *ngIf="row.deleted_at" (click)="restoreRecipe(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #047857; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #047857;">restore</span> Restore
                        </button>
                        <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                        <button (click)="deleteRecipe(row.uuid); toggleActionMenu(null); $event.stopPropagation()"
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
                onmouseover="if(!this.disabled){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">first_page</span>
              </button>
              <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage <= 1"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage <= 1 ? '0.4' : '1'"
                [style.cursor]="currentPage <= 1 ? 'not-allowed' : 'pointer'"
                onmouseover="if(!this.disabled){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">chevron_left</span>
              </button>
              <span style="font-size: 12px; color: #6b7280; font-weight: 600; padding: 0 4px;">Page {{ currentPage }} of {{ totalPages }}</span>
              <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage >= totalPages"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage >= totalPages ? '0.4' : '1'"
                [style.cursor]="currentPage >= totalPages ? 'not-allowed' : 'pointer'"
                onmouseover="if(!this.disabled){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">chevron_right</span>
              </button>
              <button (click)="goToPage(totalPages)" [disabled]="currentPage >= totalPages"
                style="padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 2px;"
                [style.opacity]="currentPage >= totalPages ? '0.4' : '1'"
                [style.cursor]="currentPage >= totalPages ? 'not-allowed' : 'pointer'"
                onmouseover="if(!this.disabled){this.style.borderColor='#059669'}" onmouseout="this.style.borderColor='#e5e7eb'">
                <span class="material-icons" style="font-size: 14px;">last_page</span>
              </button>
              <select (change)="onPerPageChange($event)" [style]="'padding: 6px 28px 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #374151; background: white; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; margin-left: 8px;'"
                onfocus="this.style.borderColor='#059669'" onblur="this.style.borderColor='#e5e7eb'">
                <option value="10">10 / page</option>
                <option value="15">15 / page</option>
                <option value="25">25 / page</option>
                <option value="50">50 / page</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <input #fileInput type="file" hidden accept=".csv,.xlsx,.xls" (change)="onFileSelected($event)" />
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
    </style>
  `,
})
export class RecipesComponent implements OnInit, OnDestroy {
  private recipeApi = inject(RecipeApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private http = inject(HttpClient);

  Math = Math;

  recipes: Recipe[] = [];
  selectedCategories = new Set<Recipe>();
  activeActionRow: Recipe | null = null;

  loading = false;
  currentPage = 1;
  pageSize = 15;
  totalCount = 0;
  searchQuery = '';
  statusFilter = '';
  mealFilter = '';

  stats: any = null;
  statuses = RECIPE_STATUSES;
  meals: any[] = [];

  private searchSubject = new Subject<string>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(400)).subscribe(() => {
      this.currentPage = 1;
      this.loadRecipes();
    });
    this.loadRecipes();
    this.loadStats();
    this.loadMeals();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  loadRecipes(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: this.currentPage.toString(),
      per_page: this.pageSize.toString(),
    };
    if (this.searchQuery) params['search'] = this.searchQuery;
    if (this.statusFilter) params['status'] = this.statusFilter;
    if (this.mealFilter) params['meal_id'] = this.mealFilter.toString();

    this.recipeApi.getRecipes(params).subscribe({
      next: (res) => {
        this.recipes = res.data || [];
        this.totalCount = res.meta?.total || this.recipes.length;
        this.loading = false;
      },
      error: () => { this.loading = false; this.notification.error('Failed to load recipes'); },
    });
  }

  loadStats(): void {
    this.recipeApi.getStats().subscribe({
      next: (res) => { this.stats = res.data ?? null; },
      error: () => {},
    });
  }

  loadMeals(): void {
    const url = `${environment.apiUrl}/${environment.apiVersion}/admin/meals`;
    this.http.get<any>(url, { params: { per_page: '200' }, withCredentials: true }).subscribe({
      next: (res) => { this.meals = res.data || []; },
      error: () => {},
    });
  }

  applyFilters(): void { this.currentPage = 1; this.loadRecipes(); }

  clearFilters(): void {
    this.searchQuery = '';
    this.statusFilter = '';
    this.mealFilter = '';
    this.currentPage = 1;
    this.loadRecipes();
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onPerPageChange(event: any): void {
    this.pageSize = parseInt(event.target.value, 10);
    this.currentPage = 1;
    this.loadRecipes();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadRecipes();
  }

  getRangeLabel(): string {
    if (this.totalCount === 0) return '0 of 0';
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalCount);
    return `${start}\u2013${end} of ${this.totalCount}`;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'inactive': return 'bg-amber-100 text-amber-700';
      case 'archived': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusBg(status: string): string {
    switch (status) {
      case 'draft': return '#f3f4f6';
      case 'active': return '#d1fae5';
      case 'inactive': return '#fef3c7';
      case 'archived': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'draft': return '#6b7280';
      case 'active': return '#047857';
      case 'inactive': return '#b45309';
      case 'archived': return '#dc2626';
      default: return '#6b7280';
    }
  }

  isAllSelected(): boolean { return this.recipes.length > 0 && this.selectedCategories.size === this.recipes.length; }

  toggleAllRows(event: any): void {
    if (event.target.checked) { this.recipes.forEach(c => this.selectedCategories.add(c)); } else { this.selectedCategories.clear(); }
    this.activeActionRow = null;
  }

  toggleRow(row: Recipe): void {
    if (this.selectedCategories.has(row)) { this.selectedCategories.delete(row); } else { this.selectedCategories.add(row); }
    this.activeActionRow = null;
  }

  clearSelection(): void { this.selectedCategories.clear(); }

  toggleActionMenu(row: Recipe | null): void {
    this.activeActionRow = this.activeActionRow?.uuid === row?.uuid ? null : row;
  }

  viewRecipe(uuid: string): void { this.activeActionRow = null; this.router.navigate(['/admin/recipes', uuid]); }
  addRecipe(): void { this.activeActionRow = null; this.router.navigate(['/admin/recipes', 'create']); }
  editRecipe(uuid: string): void { this.activeActionRow = null; this.router.navigate(['/admin/recipes', uuid, 'edit']); }

  cloneRecipe(uuid: string): void {
    if (window.confirm('Clone this recipe?')) {
      this.recipeApi.cloneRecipe(uuid).subscribe({
        next: (res) => { this.notification.success(res.message || 'Recipe cloned'); this.loadRecipes(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Clone failed'),
      });
    }
  }

  deleteRecipe(uuid: string): void {
    if (window.confirm('Delete this recipe? This cannot be undone.')) {
      this.recipeApi.deleteRecipe(uuid).subscribe({
        next: () => { this.notification.success('Recipe deleted'); this.loadRecipes(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  restoreRecipe(uuid: string): void {
    if (window.confirm('Restore this recipe?')) {
      this.recipeApi.restoreRecipe(uuid).subscribe({
        next: () => { this.notification.success('Recipe restored'); this.loadRecipes(); this.loadStats(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  trackByValue(index: number, item: any): any { return item.value; }
  trackById(index: number, item: any): any { return item.id; }

  openImportDialog(): void {}
  onFileSelected(event: Event): void {}
}
