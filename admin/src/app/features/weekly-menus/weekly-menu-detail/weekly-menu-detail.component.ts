import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { WeeklyMenuApiService } from '../../../core/services/weekly-menu-api.service';
import { MealCategoryApiService } from '../../../core/services/meal-category-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { WeeklyMenu, WeeklyMenuItem, SelectionSummary } from '../../../core/models/weekly-menu/weekly-menu.model';
import { WeeklyMenuCalendarComponent } from '../weekly-menu-calendar/weekly-menu-calendar.component';
import { MealAssignmentDialogComponent, MealAssignmentDialogData } from '../meal-assignment-dialog/meal-assignment-dialog.component';

@Component({
  selector: 'app-weekly-menu-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, WeeklyMenuCalendarComponent, MealAssignmentDialogComponent],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading menu details...</p>
      </div>
    </div>

    <div *ngIf="!loading && menu" style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">
      <div style="background: linear-gradient(135deg, #059669 0%, #047857 50%, #166534 100%); border-radius: 16px; padding: 28px 32px; margin-bottom: 24px; position: relative; overflow: hidden;">
        <svg style="position: absolute; bottom: 0; left: 0; width: 100%; height: 30px; fill: #f9fafb;" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,20 C360,40 720,0 1440,20 L1440,40 L0,40 Z"/>
        </svg>
        <div style="position: relative; z-index: 1;">
          <a routerLink="/admin/weekly-menus" style="display: inline-flex; align-items: center; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 12px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 18px; margin-right: 4px;">arrow_back</span>
            Back to Weekly Menus
          </a>
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
            <div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <h1 style="font-size: 24px; font-weight: 800; color: white; margin: 0;">{{ menu.title }}</h1>
                <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                  [style.background]="menu.status === 'published' ? '#d1fae5' : menu.status === 'draft' ? '#fef3c7' : '#f3f4f6'"
                  [style.color]="menu.status === 'published' ? '#047857' : menu.status === 'draft' ? '#b45309' : '#6b7280'">
                  {{ menu.status | titlecase }}
                </span>
              </div>
              <p style="font-size: 13px; color: rgba(255,255,255,0.7); margin: 4px 0 0 0;">
                {{ menu.week_start_date | date:'MMM d' }} - {{ menu.week_end_date | date:'MMM d, yyyy' }}
                &bull; {{ menu.duration_days }} days
                <span *ngIf="menu.kitchen_name"> &bull; {{ menu.kitchen_name }}</span>
              </p>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
              <button *ngIf="menu.status !== 'published'" (click)="publishMenu()"
                style="padding: 7px 14px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; font-size: 12px; font-weight: 600; color: white; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease;"
                onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
                <span class="material-icons" style="font-size: 16px;">publish</span> Publish
              </button>
              <button *ngIf="menu.status === 'published'" (click)="unpublishMenu()"
                style="padding: 7px 14px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; font-size: 12px; font-weight: 600; color: white; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease;"
                onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
                <span class="material-icons" style="font-size: 16px;">unpublished</span> Unpublish
              </button>
              <button (click)="autoGenerate()"
                style="padding: 7px 14px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; font-size: 12px; font-weight: 600; color: white; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease;"
                onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
                <span class="material-icons" style="font-size: 16px;">auto_fix_high</span> Auto Generate
              </button>
              <button (click)="assignDefaults()"
                style="padding: 7px 14px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; font-size: 12px; font-weight: 600; color: white; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease;"
                onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
                <span class="material-icons" style="font-size: 16px;">assignment</span> Assign Defaults
              </button>
              <a [routerLink]="['/admin/weekly-menus', menu.uuid, 'edit']"
                style="padding: 7px 20px; background: white; color: #059669; font-weight: 700; border-radius: 8px; font-size: 12px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s ease;"
                onmouseover="this.style.background='#f0fdf4';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='white';this.style.transform=''">
                <span class="material-icons" style="font-size: 16px;">edit</span> Edit
              </a>
              <div style="position: relative;">
                <button (click)="toggleTopMenu()"
                  style="padding: 7px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; color: white; cursor: pointer; display: inline-flex; align-items: center; transition: all 0.15s ease; line-height: 0;"
                  onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
                  <span class="material-icons" style="font-size: 18px;">more_vert</span>
                </button>
                <div *ngIf="showTopMenu" style="position: absolute; right: 0; top: 100%; z-index: 50; background: white; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 10px 40px rgba(0,0,0,0.12); min-width: 180px; padding: 6px; margin-top: 4px; animation: fadeIn 0.1s ease-out;">
                  <button (click)="copyPreviousWeek(); showTopMenu = false"
                    style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                    onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                    <span class="material-icons" style="font-size: 18px; color: #6366f1;">content_copy</span> Copy Previous Week
                  </button>
                  <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                  <button (click)="deleteMenu(); showTopMenu = false"
                    style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                    onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                    <span class="material-icons" style="font-size: 18px;">delete</span> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 20px; color: #059669;">restaurant</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Items</p>
            <p style="font-size: 18px; font-weight: 800; color: #166534; margin: 0;">{{ menu.items?.length || 0 }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 20px; color: #047857;">event</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Duration</p>
            <p style="font-size: 18px; font-weight: 800; color: #166534; margin: 0;">{{ menu.duration_days }} days</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 40px; height: 40px; border-radius: 10px; background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 20px; color: #d97706;">schedule</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Cut Off</p>
            <p style="font-size: 18px; font-weight: 800; color: #166534; margin: 0;">{{ menu.cut_off_hours }}h</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="width: 40px; height: 40px; border-radius: 10px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-icons" style="font-size: 20px; color: #6b7280;">edit_note</span>
          </div>
          <div>
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Status</p>
            <p style="font-size: 18px; font-weight: 800; color: #166534; margin: 0;">{{ menu.status | titlecase }}</p>
          </div>
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden; margin-bottom: 24px;">
        <div style="display: flex; border-bottom: 1px solid #e5e7eb;">
          <button (click)="activeTab = 'calendar'"
            style="flex: 1; padding: 14px 20px; background: none; border: none; cursor: pointer; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.15s ease; border-bottom: 2px solid transparent;"
            [style.color]="activeTab === 'calendar' ? '#059669' : '#6b7280'"
            [style.borderBottomColor]="activeTab === 'calendar' ? '#059669' : 'transparent'"
            onmouseover="this.style.color='#059669'" onmouseout="this.style.color=this.getAttribute('data-active')==='true'?'#059669':'#6b7280'">
            <span class="material-icons" style="font-size: 18px;">calendar_view_week</span> Calendar View
          </button>
          <button (click)="activeTab = 'items'"
            style="flex: 1; padding: 14px 20px; background: none; border: none; cursor: pointer; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.15s ease; border-bottom: 2px solid transparent;"
            [style.color]="activeTab === 'items' ? '#059669' : '#6b7280'"
            [style.borderBottomColor]="activeTab === 'items' ? '#059669' : 'transparent'"
            onmouseover="this.style.color='#059669'" onmouseout="this.style.color=this.getAttribute('data-active')==='true'?'#059669':'#6b7280'">
            <span class="material-icons" style="font-size: 18px;">table_rows</span> Menu Items ({{ menu.items?.length || 0 }})
          </button>
          <button (click)="activeTab = 'summary'"
            style="flex: 1; padding: 14px 20px; background: none; border: none; cursor: pointer; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.15s ease; border-bottom: 2px solid transparent;"
            [style.color]="activeTab === 'summary' ? '#059669' : '#6b7280'"
            [style.borderBottomColor]="activeTab === 'summary' ? '#059669' : 'transparent'"
            onmouseover="this.style.color='#059669'" onmouseout="this.style.color=this.getAttribute('data-active')==='true'?'#059669':'#6b7280'">
            <span class="material-icons" style="font-size: 18px;">analytics</span> Selection Summary
          </button>
        </div>

        <div *ngIf="activeTab === 'calendar'" style="padding: 24px;">
          <app-weekly-menu-calendar
            [menu]="menu"
            [items]="menu.items || []"
            [readonly]="menu.status === 'published'"
            (addItem)="openAddItemDialog($event)"
            (editItem)="openEditItemDialog($event)"
            (deleteItem)="deleteItem($event)">
          </app-weekly-menu-calendar>
        </div>

        <div *ngIf="activeTab === 'items'" style="padding: 24px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">All Menu Items</h3>
            <button *ngIf="menu.status !== 'published'" (click)="openAddItemDialog({})"
              style="padding: 8px 16px; background: #059669; color: white; font-weight: 700; border-radius: 8px; font-size: 12px; cursor: pointer; border: none; display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s ease;"
              onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
              <span class="material-icons" style="font-size: 16px;">add</span> Add Item
            </button>
          </div>
          <div *ngIf="menu.items && menu.items.length > 0" style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Date</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Category</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Meal</th>
                  <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Order</th>
                  <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Limit</th>
                  <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Flags</th>
                  <th style="padding: 10px 16px 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; width: 80px;"></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of menu.items; let i = index" style="border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                  [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                  onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=(this.getAttribute('data-idx') % 2 === 0) ? 'transparent' : '#f9fafb'">
                  <td [attr.data-idx]="i" style="padding: 12px;">{{ row.menu_date | date:'EEE, MMM d' }}</td>
                  <td style="padding: 12px;">
                    <span style="display: inline-flex; padding: 2px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; background: #d1fae5; color: #047857;">{{ row.meal_category_name || '-' }}</span>
                  </td>
                  <td style="padding: 12px; font-weight: 600; color: #1f2937;">{{ row.meal_name || '-' }}</td>
                  <td style="padding: 12px; text-align: center;">{{ row.display_order }}</td>
                  <td style="padding: 12px; text-align: center;">{{ row.meal_limit }}</td>
                  <td style="padding: 12px;">
                    <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                      <span *ngIf="row.is_default" style="padding: 1px 8px; border-radius: 4px; font-size: 10px; font-weight: 800; background: #dbeafe; color: #1d4ed8; text-transform: uppercase;">Default</span>
                      <span *ngIf="row.is_optional" style="padding: 1px 8px; border-radius: 4px; font-size: 10px; font-weight: 800; background: #fef3c7; color: #b45309; text-transform: uppercase;">Optional</span>
                      <span *ngIf="row.is_recommended" style="padding: 1px 8px; border-radius: 4px; font-size: 10px; font-weight: 800; background: #d1fae5; color: #047857; text-transform: uppercase;">Recommended</span>
                    </div>
                  </td>
                  <td style="padding: 12px 16px 12px 12px; text-align: center;">
                    <div *ngIf="menu.status !== 'published'" style="display: flex; align-items: center; justify-content: center; gap: 2px;">
                      <button (click)="openEditItemDialog(row)"
                        style="width: 32px; height: 32px; border: none; background: none; cursor: pointer; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: #059669; transition: all 0.15s ease; line-height: 0;"
                        onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
                        <span class="material-icons" style="font-size: 18px;">edit</span>
                      </button>
                      <button (click)="deleteItem(row)"
                        style="width: 32px; height: 32px; border: none; background: none; cursor: pointer; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: #dc2626; transition: all 0.15s ease; line-height: 0;"
                        onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                        <span class="material-icons" style="font-size: 18px;">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div *ngIf="!menu.items || menu.items.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
            <div style="width: 64px; height: 64px; border-radius: 16px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
              <span class="material-icons" style="font-size: 28px; color: #d1d5db;">restaurant_menu</span>
            </div>
            <h4 style="font-size: 14px; font-weight: 700; color: #374151; margin: 0 0 4px 0;">No items yet</h4>
            <p style="font-size: 13px; color: #9ca3af; margin: 0 0 16px 0;">Add meals to this weekly menu</p>
            <button *ngIf="menu.status !== 'published'" (click)="openAddItemDialog({})"
              style="padding: 10px 20px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; border: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
              onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
              <span class="material-icons" style="font-size: 18px;">add</span> Add Item
            </button>
          </div>
        </div>

        <div *ngIf="activeTab === 'summary'" style="padding: 24px;">
          <div *ngIf="selectionSummary">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
              <div style="background: #f9fafb; border-radius: 12px; padding: 20px; text-align: center;">
                <p style="font-size: 12px; color: #9ca3af; font-weight: 600; margin: 0 0 4px 0;">Total Selections</p>
                <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ selectionSummary.total_selections }}</p>
              </div>
              <div style="background: #d1fae5; border-radius: 12px; padding: 20px; text-align: center;">
                <p style="font-size: 12px; color: #047857; font-weight: 600; margin: 0 0 4px 0;">Selected</p>
                <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ selectionSummary.selected_count }}</p>
              </div>
              <div style="background: #dbeafe; border-radius: 12px; padding: 20px; text-align: center;">
                <p style="font-size: 12px; color: #1d4ed8; font-weight: 600; margin: 0 0 4px 0;">Default</p>
                <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ selectionSummary.default_count }}</p>
              </div>
              <div style="background: #fef3c7; border-radius: 12px; padding: 20px; text-align: center;">
                <p style="font-size: 12px; color: #b45309; font-weight: 600; margin: 0 0 4px 0;">Skipped</p>
                <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ selectionSummary.skipped_count }}</p>
              </div>
            </div>
            <div *ngIf="selectionSummary.by_date && getKeys(selectionSummary.by_date).length > 0">
              <h4 style="font-size: 14px; font-weight: 700; color: #166534; margin: 0 0 12px 0;">By Date</h4>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px;">
                <div *ngFor="let key of getKeys(selectionSummary.by_date)" style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px;">
                  <p style="font-size: 13px; font-weight: 600; color: #374151; margin: 0 0 8px 0;">{{ key | date:'EEE, MMM d' }}</p>
                  <div style="display: flex; gap: 12px; font-size: 11px;">
                    <span style="color: #6b7280;">Total: {{ selectionSummary.by_date[key].total }}</span>
                    <span style="color: #047857;">Selected: {{ selectionSummary.by_date[key].selected }}</span>
                    <span style="color: #1d4ed8;">Default: {{ selectionSummary.by_date[key].default }}</span>
                    <span style="color: #b45309;">Skipped: {{ selectionSummary.by_date[key].skipped }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div *ngIf="selectionSummary.by_category && getKeys(selectionSummary.by_category).length > 0">
              <h4 style="font-size: 14px; font-weight: 700; color: #166534; margin: 0 0 12px 0;">By Category</h4>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                <div *ngFor="let key of getKeys(selectionSummary.by_category)" style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px;">
                  <p style="font-size: 13px; font-weight: 600; color: #374151; margin: 0 0 8px 0;">{{ key }}</p>
                  <div style="display: flex; gap: 12px; font-size: 11px;">
                    <span style="color: #6b7280;">Total: {{ selectionSummary.by_category[key].total }}</span>
                    <span style="color: #047857;">Selected: {{ selectionSummary.by_category[key].selected }}</span>
                    <span style="color: #1d4ed8;">Default: {{ selectionSummary.by_category[key].default }}</span>
                    <span style="color: #b45309;">Skipped: {{ selectionSummary.by_category[key].skipped }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div *ngIf="!selectionSummary && loadingSummary" style="display: flex; align-items: center; justify-content: center; padding: 48px;">
            <div style="width: 32px; height: 32px; border: 2px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          </div>
          <div *ngIf="!selectionSummary && !loadingSummary" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
            <div style="width: 64px; height: 64px; border-radius: 16px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
              <span class="material-icons" style="font-size: 28px; color: #d1d5db;">analytics</span>
            </div>
            <h4 style="font-size: 14px; font-weight: 700; color: #374151; margin: 0 0 4px 0;">No selection data</h4>
            <p style="font-size: 13px; color: #9ca3af; margin: 0;">Selections will appear here once customers start choosing meals</p>
          </div>
        </div>
      </div>
    </div>

    <app-meal-assignment-dialog *ngIf="showMealDialog" [data]="mealDialogData!" (close)="onMealDialogClose()" (confirm)="onMealDialogConfirm($event)"></app-meal-assignment-dialog>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class WeeklyMenuDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private weeklyMenuApi = inject(WeeklyMenuApiService);
  private mealCategoryApi = inject(MealCategoryApiService);
  private notification = inject(NotificationService);

  menu: WeeklyMenu | null = null;
  loading = true;
  loadingSummary = false;
  selectionSummary: SelectionSummary | null = null;

  activeTab: 'calendar' | 'items' | 'summary' = 'calendar';
  showTopMenu = false;
  showMealDialog = false;
  mealDialogData: MealAssignmentDialogData | null = null;
  private pendingDialogMode: 'create' | 'edit' = 'create';
  private pendingEditItem: WeeklyMenuItem | null = null;

  Object = Object;

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) { this.loadMenu(uuid); }
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

  loadMenu(uuid: string): void {
    this.weeklyMenuApi.getWeeklyMenu(uuid).subscribe({
      next: (res) => {
        this.menu = res.data ?? null;
        this.loading = false;
        this.loadSelectionSummary();
      },
      error: () => { this.notification.error('Failed to load menu'); this.router.navigate(['/admin/weekly-menus']); },
    });
  }

  loadSelectionSummary(): void {
    if (!this.menu) return;
    this.loadingSummary = true;
    this.weeklyMenuApi.getSelectionSummary({ menu_id: this.menu.id.toString() }).subscribe({
      next: (res) => { this.selectionSummary = res.data ?? null; this.loadingSummary = false; },
      error: () => { this.loadingSummary = false; },
    });
  }

  toggleTopMenu(): void { this.showTopMenu = !this.showTopMenu; }

  getStatusClass(status: string): string {
    switch (status) {
      case 'published': return 'bg-emerald-100 text-emerald-700';
      case 'draft': return 'bg-amber-100 text-amber-700';
      case 'archived': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  openAddItemDialog(event: { date?: string; categoryId?: number }): void {
    if (!this.menu) return;
    this.pendingDialogMode = 'create';
    this.pendingEditItem = null;
    this.mealDialogData = {
      weekly_menu_id: this.menu.id,
      menu_date: event.date || '',
      meal_category_id: event.categoryId || null,
      mode: 'create',
    };
    this.showMealDialog = true;
  }

  openEditItemDialog(item: WeeklyMenuItem): void {
    if (!this.menu) return;
    this.pendingDialogMode = 'edit';
    this.pendingEditItem = item;
    this.mealDialogData = {
      weekly_menu_id: this.menu.id,
      item,
      mode: 'edit',
    };
    this.showMealDialog = true;
  }

  onMealDialogClose(): void {
    this.showMealDialog = false;
    this.mealDialogData = null;
    this.pendingEditItem = null;
  }

  onMealDialogConfirm(result: any): void {
    this.showMealDialog = false;
    if (!result) { this.mealDialogData = null; this.pendingEditItem = null; return; }

    if (this.pendingDialogMode === 'create') {
      this.weeklyMenuApi.createWeeklyMenuItem(result).subscribe({
        next: () => { this.notification.success('Item added'); this.reloadMenu(); },
        error: (err) => this.notification.error(err.error?.message || 'Failed to add item'),
      });
    } else if (this.pendingDialogMode === 'edit' && this.pendingEditItem) {
      this.weeklyMenuApi.updateWeeklyMenuItem(this.pendingEditItem.uuid, result).subscribe({
        next: () => { this.notification.success('Item updated'); this.reloadMenu(); },
        error: (err) => this.notification.error(err.error?.message || 'Failed to update item'),
      });
    }
    this.mealDialogData = null;
    this.pendingEditItem = null;
  }

  deleteItem(item: WeeklyMenuItem): void {
    if (window.confirm(`Remove "${item.meal_name || 'this item'}" from the menu?`)) {
      this.weeklyMenuApi.deleteWeeklyMenuItem(item.uuid).subscribe({
        next: () => { this.notification.success('Item removed'); this.reloadMenu(); },
        error: (err) => this.notification.error(err.error?.message || 'Failed to remove item'),
      });
    }
  }

  reloadMenu(): void {
    if (this.menu) {
      this.weeklyMenuApi.getWeeklyMenu(this.menu.uuid).subscribe({
        next: (res) => { this.menu = res.data ?? null; },
        error: () => {},
      });
    }
  }

  publishMenu(): void {
    if (!this.menu) return;
    if (window.confirm(`Publish "${this.menu.title}"? Customers will be able to see this menu.`)) {
      this.weeklyMenuApi.publishWeeklyMenu(this.menu.uuid).subscribe({
        next: (res) => { this.menu = res.data ?? null; this.notification.success('Menu published'); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  unpublishMenu(): void {
    if (!this.menu) return;
    if (window.confirm(`Unpublish "${this.menu.title}"?`)) {
      this.weeklyMenuApi.unpublishWeeklyMenu(this.menu.uuid).subscribe({
        next: (res) => { this.menu = res.data ?? null; this.notification.success('Menu unpublished'); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  autoGenerate(): void {
    if (!this.menu) return;
    if (window.confirm('Auto-generate meals for this week based on defaults and patterns?')) {
      this.weeklyMenuApi.autoGenerate({
        week_start: this.menu.week_start_date,
        week_end: this.menu.week_end_date,
      }).subscribe({
        next: () => { this.notification.success('Meals auto-generated'); this.reloadMenu(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  assignDefaults(): void {
    if (!this.menu) return;
    if (window.confirm('Assign default meals to empty slots?')) {
      this.weeklyMenuApi.assignDefaults({ menu_id: this.menu.id, date: this.menu.week_start_date }).subscribe({
        next: () => { this.notification.success('Defaults assigned'); this.reloadMenu(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  copyPreviousWeek(): void {
    if (!this.menu) return;
    const currentDate = new Date(this.menu.week_start_date);
    currentDate.setDate(currentDate.getDate() - 7);
    const prevY = currentDate.getFullYear();
    const prevM = String(currentDate.getMonth() + 1).padStart(2, '0');
    const prevD = String(currentDate.getDate()).padStart(2, '0');
    const fromWeekStart = `${prevY}-${prevM}-${prevD}`;

    this.weeklyMenuApi.copyPreviousWeek({
      from_week_start: fromWeekStart,
      to_week_start: this.menu.week_start_date,
    }).subscribe({
      next: (res) => {
        this.notification.success('Previous week copied');
        if (res.data) { this.router.navigate(['/admin/weekly-menus', res.data.uuid]); }
      },
      error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
    });
  }

  deleteMenu(): void {
    if (!this.menu) return;
    if (window.confirm(`Delete "${this.menu.title}"? This action cannot be undone.`)) {
      this.weeklyMenuApi.deleteWeeklyMenu(this.menu.uuid).subscribe({
        next: () => { this.notification.success('Menu deleted'); this.router.navigate(['/admin/weekly-menus']); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }
}
