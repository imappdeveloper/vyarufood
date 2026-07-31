import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecipeApiService } from '../../../core/services/recipe-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Recipe, RecipeVersion } from '../../../core/models/recipe/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading recipe details...</p>
      </div>
    </div>

    <div *ngIf="!loading && recipe" style="animation: fadeIn 0.3s ease-out;">
      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
          <a routerLink="/admin/recipes" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 16px;">arrow_back</span>
            Back to Recipes
          </a>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0;">{{ recipe.recipe_name }}</h1>
              <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                [style.background]="getStatusBg(recipe.status)"
                [style.color]="getStatusText(recipe.status)">
                <span *ngIf="recipe.status === 'active'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                {{ recipe.status | titlecase }}
              </span>
            </div>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">
              {{ recipe.recipe_code }} &bull; {{ recipe.meal_name || 'No Meal' }} &bull; Version {{ recipe.version }}
            </p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 20px;">
            <button (click)="editRecipe()"
              style="padding: 8px 20px; background: white; color: #059669; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease;"
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
              onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
              <span class="material-icons" style="font-size: 18px;">edit</span> Edit
            </button>
            <button (click)="cloneRecipe()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">content_copy</span> Clone
            </button>
            <button *ngIf="recipe.deleted_at" (click)="restoreRecipe()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">restore</span> Restore
            </button>
            <button (click)="deleteRecipe()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(220,38,38,0.3)'; this.style.borderColor='rgba(220,38,38,0.4)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'; this.style.borderColor='rgba(255,255,255,0.2)'">
              <span class="material-icons" style="font-size: 18px;">delete</span> Delete
            </button>
          </div>
        </div>
        <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
        </svg>
      </section>

      <section style="max-width: 1200px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #059669;">restaurant</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Meal</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ recipe.meal_name || '-' }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #f3e8ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #7c3aed;">format_list_numbered</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Ingredients</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ recipe.items_count || (recipe.items?.length || 0) }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #047857;">scale</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Yield</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ recipe.yield_quantity }} {{ recipe.yield_unit }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #d97706;">attach_money</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Cost</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ recipe.recipe_cost | number:'1.2-2' }}</p>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 24px;">
          <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
              <span class="material-icons" style="font-size: 18px; color: #047857;">info</span>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Recipe Info</h2>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Recipe Code</p>
                <p style="font-size: 14px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ recipe.recipe_code }}</p>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Recipe Name</p>
                <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ recipe.recipe_name }}</p>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Meal</p>
                <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ recipe.meal_name || '-' }}</p>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Status</p>
                <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                  [style.background]="getStatusBg(recipe.status)"
                  [style.color]="getStatusText(recipe.status)">
                  <span *ngIf="recipe.status === 'active'" style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
                  {{ recipe.status | titlecase }}
                </span>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Version</p>
                <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ recipe.version }}</p>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Serving Size</p>
                <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ recipe.serving_size }}</p>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Yield</p>
                <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ recipe.yield_quantity }} {{ recipe.yield_unit }}</p>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Preparation Time</p>
                <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ recipe.preparation_time ? recipe.preparation_time + ' min' : '-' }}</p>
              </div>
              <div>
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Cooking Time</p>
                <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ recipe.cooking_time ? recipe.cooking_time + ' min' : '-' }}</p>
              </div>
              <div *ngIf="recipe.remarks" style="grid-column: 1 / -1;">
                <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Remarks</p>
                <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ recipe.remarks }}</p>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="recipe.items && recipe.items.length > 0" style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px; margin-bottom: 24px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
            <span class="material-icons" style="font-size: 18px; color: #7c3aed;">format_list_numbered</span>
            <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Ingredients</h2>
          </div>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Ingredient</th>
                  <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Quantity</th>
                  <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Unit</th>
                  <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Wastage</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Cost</th>
                  <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">#</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of recipe.items; let i = index" style="border-bottom: 1px solid #f3f4f6;"
                  [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'">
                  <td style="padding: 12px 12px;">
                    <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ item.inventory_item_name }}</span>
                  </td>
                  <td style="padding: 12px 12px; text-align: center;">
                    <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ item.required_quantity }}</span>
                  </td>
                  <td style="padding: 12px 12px; text-align: center;">
                    <span style="font-size: 13px; color: #374151;">{{ item.unit_name }}</span>
                  </td>
                  <td style="padding: 12px 12px; text-align: center;">
                    <span style="font-size: 12px; font-weight: 700;"
                      [style.color]="item.wastage_percentage > 0 ? '#d97706' : '#374151'">
                      {{ item.wastage_percentage }}%
                    </span>
                  </td>
                  <td style="padding: 12px 12px; text-align: right;">
                    <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ item.cost | number:'1.2-2' }}</span>
                  </td>
                  <td style="padding: 12px 12px; text-align: center;">
                    <span style="font-size: 12px; color: #9ca3af;">{{ item.display_order }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start;">
          <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
              <span class="material-icons" style="font-size: 18px; color: #d97706;">attach_money</span>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Cost Summary</h2>
            </div>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid #f3f4f6;">
                <span style="font-size: 13px; color: #9ca3af;">Total Recipe Cost</span>
                <span style="font-size: 18px; font-weight: 800; color: #1f2937;">{{ recipe.recipe_cost | number:'1.2-2' }}</span>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid #f3f4f6;">
                <span style="font-size: 13px; color: #9ca3af;">Food Cost %</span>
                <span style="font-size: 16px; font-weight: 800;"
                  [style.color]="recipe.food_cost_percentage > 35 ? '#dc2626' : recipe.food_cost_percentage > 25 ? '#d97706' : '#059669'">
                  {{ recipe.food_cost_percentage | number:'1.1-1' }}%
                </span>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid #f3f4f6;">
                <span style="font-size: 13px; color: #9ca3af;">Serving Size</span>
                <span style="font-size: 14px; font-weight: 700; color: #1f2937;">{{ recipe.serving_size }}</span>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 13px; color: #9ca3af;">Cost Per Serving</span>
                <span style="font-size: 14px; font-weight: 700; color: #1f2937;">
                  {{ recipe.serving_size > 0 ? (recipe.recipe_cost / recipe.serving_size | number:'1.2-2') : '0.00' }}
                </span>
              </div>
            </div>
          </div>

          <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
              <span class="material-icons" style="font-size: 18px; color: #047857;">history</span>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Version History</h2>
            </div>
            <div style="display: flex; gap: 8px; margin-bottom: 16px;">
              <button (click)="activeTab = 'versions'"
                style="padding: 6px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; border: none; transition: all 0.15s ease;"
                [style.background]="activeTab === 'versions' ? '#d1fae5' : '#f3f4f6'"
                [style.color]="activeTab === 'versions' ? '#047857' : '#6b7280'">
                <span class="material-icons" style="font-size: 14px; vertical-align: middle;">history</span> Versions
              </button>
              <button (click)="activeTab = 'audit'"
                style="padding: 6px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; border: none; transition: all 0.15s ease;"
                [style.background]="activeTab === 'audit' ? '#d1fae5' : '#f3f4f6'"
                [style.color]="activeTab === 'audit' ? '#047857' : '#6b7280'">
                <span class="material-icons" style="font-size: 14px; vertical-align: middle;">info</span> Audit
              </button>
            </div>
            <div *ngIf="activeTab === 'versions'">
              <div *ngIf="versions.length > 0" style="display: flex; flex-direction: column; gap: 8px;">
                <div *ngFor="let ver of versions" style="padding: 12px; border-radius: 10px; border: 1px solid #f3f4f6;"
                  [style.background]="ver.version === recipe.version ? '#f0fdf4' : '#f9fafb'"
                  [style.borderColor]="ver.version === recipe.version ? '#a7f3d0' : '#f3f4f6'">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                    <span style="font-size: 13px; font-weight: 700; color: #1f2937;">Version {{ ver.version }}</span>
                    <span style="font-size: 11px; color: #9ca3af;">{{ ver.created_at | date:'short' }}</span>
                  </div>
                  <p *ngIf="ver.approved_by_name" style="font-size: 11px; color: #6b7280; margin: 0 0 2px 0;">Approved by {{ ver.approved_by_name }}</p>
                  <p *ngIf="ver.approved_at" style="font-size: 11px; color: #9ca3af; margin: 0 0 2px 0;">{{ ver.approved_at | date:'medium' }}</p>
                  <p *ngIf="ver.change_notes" style="font-size: 11px; color: #6b7280; margin: 4px 0 0 0; font-style: italic;">{{ ver.change_notes }}</p>
                </div>
              </div>
              <div *ngIf="versions.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px;">
                <span class="material-icons" style="font-size: 32px; color: #d1d5db; margin-bottom: 8px;">history</span>
                <p style="font-size: 13px; color: #9ca3af; margin: 0;">No version history</p>
              </div>
            </div>
            <div *ngIf="activeTab === 'audit'">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Created At</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ recipe.created_at | date:'medium' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Updated At</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ recipe.updated_at | date:'medium' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Created By</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ recipe.created_by_name || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Updated By</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ recipe.updated_by_name || '-' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class RecipeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recipeApi = inject(RecipeApiService);
  private notification = inject(NotificationService);

  recipe: Recipe | null = null;
  loading = true;
  versions: RecipeVersion[] = [];
  ingredientColumns = ['inventory_item_name', 'required_quantity', 'unit_name', 'wastage_percentage', 'cost', 'display_order'];
  activeTab = 'versions';

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) { this.loadRecipe(uuid); }
  }

  loadRecipe(uuid: string): void {
    this.recipeApi.getRecipe(uuid).subscribe({
      next: (res) => {
        this.recipe = res.data ?? null;
        this.loading = false;
        if (this.recipe) { this.loadVersions(this.recipe.uuid); }
      },
      error: () => { this.notification.error('Failed to load recipe'); this.router.navigate(['/admin/recipes']); },
    });
  }

  loadVersions(uuid: string): void {
    this.recipeApi.getVersions(uuid).subscribe({
      next: (res) => { this.versions = res.data || []; },
      error: () => {},
    });
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

  editRecipe(): void {
    if (this.recipe) { this.router.navigate(['/admin/recipes', this.recipe.uuid, 'edit']); }
  }

  cloneRecipe(): void {
    if (!this.recipe) return;
    if (window.confirm('Clone this recipe?')) {
      this.recipeApi.cloneRecipe(this.recipe.uuid).subscribe({
        next: (res) => {
          this.notification.success(res.message || 'Recipe cloned');
          const uuid = res.data?.uuid;
          if (uuid) { this.router.navigate(['/admin/recipes', uuid]); }
        },
        error: (err) => this.notification.error(err.error?.message || 'Clone failed'),
      });
    }
  }

  deleteRecipe(): void {
    if (!this.recipe) return;
    if (window.confirm('Delete this recipe? This cannot be undone.')) {
      this.recipeApi.deleteRecipe(this.recipe.uuid).subscribe({
        next: () => { this.notification.success('Recipe deleted'); this.router.navigate(['/admin/recipes']); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  restoreRecipe(): void {
    if (!this.recipe) return;
    if (window.confirm('Restore this recipe?')) {
      this.recipeApi.restoreRecipe(this.recipe.uuid).subscribe({
        next: () => { this.notification.success('Recipe restored'); this.loadRecipe(this.recipe!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }
}
