import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductionScheduleApiService } from '../../../core/services/production-schedule-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ProductionSchedule } from '../../../core/models/kitchen/production-schedule.model';

@Component({
  selector: 'app-production-schedules',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
        <nav style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.7); margin-bottom: 16px;">
          <a routerLink="/admin/dashboard" style="color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">Home</a>
          <span class="material-icons" style="font-size: 14px; color: rgba(255,255,255,0.4);">chevron_right</span>
          <a routerLink="/admin/kitchens" style="color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.7)'">Kitchens</a>
          <span class="material-icons" style="font-size: 14px; color: rgba(255,255,255,0.4);">chevron_right</span>
          <span style="color: white; font-weight: 600;">Production Schedules</span>
        </nav>
        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;">
          <div>
            <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">Production Schedules</h1>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Plan and track kitchen production</p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button (click)="generatePlan()"
              style="padding: 10px 20px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; font-size: 13px; cursor: pointer; border: 1px solid rgba(255,255,255,0.2); display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease; white-space: nowrap; backdrop-filter: blur(4px);"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">auto_fix_high</span>
              Generate Plan
            </button>
            <a routerLink="create"
              style="padding: 10px 20px; background: white; color: #059669; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease; white-space: nowrap;"
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
              onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
              <span class="material-icons" style="font-size: 18px;">add</span>
              Add Schedule
            </a>
          </div>
        </div>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 1200px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px;">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 16px; transition: all 0.2s ease;"
          onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px -5px rgba(0,0,0,0.06)'"
          onmouseout="this.style.transform=''; this.style.boxShadow=''">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="font-size: 22px; color: #047857;">calendar_month</span>
          </div>
          <div>
            <p style="font-size: 12px; color: #9ca3af; font-weight: 500; margin: 0;">Total Schedules</p>
            <p style="font-size: 22px; font-weight: 800; color: #1f2937; margin: 2px 0 0 0;">{{ totalCount }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 16px; transition: all 0.2s ease;"
          onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px -5px rgba(0,0,0,0.06)'"
          onmouseout="this.style.transform=''; this.style.boxShadow=''">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="font-size: 22px; color: #d97706;">pending</span>
          </div>
          <div>
            <p style="font-size: 12px; color: #9ca3af; font-weight: 500; margin: 0;">In Progress</p>
            <p style="font-size: 22px; font-weight: 800; color: #1f2937; margin: 2px 0 0 0;">{{ inProgressCount }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 16px; transition: all 0.2s ease;"
          onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px -5px rgba(0,0,0,0.06)'"
          onmouseout="this.style.transform=''; this.style.boxShadow=''">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="font-size: 22px; color: #047857;">check_circle</span>
          </div>
          <div>
            <p style="font-size: 12px; color: #9ca3af; font-weight: 500; margin: 0;">Completed</p>
            <p style="font-size: 22px; font-weight: 800; color: #1f2937; margin: 2px 0 0 0;">{{ completedCount }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 16px; transition: all 0.2s ease;"
          onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px -5px rgba(0,0,0,0.06)'"
          onmouseout="this.style.transform=''; this.style.boxShadow=''">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: #fef2f2; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="font-size: 22px; color: #dc2626;">warning</span>
          </div>
          <div>
            <p style="font-size: 12px; color: #9ca3af; font-weight: 500; margin: 0;">Overdue</p>
            <p style="font-size: 22px; font-weight: 800; color: #1f2937; margin: 2px 0 0 0;">{{ overdueCount }}</p>
          </div>
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 20px; margin-bottom: 16px;">
        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 12px;">
          <div style="position: relative; flex: 1; min-width: 200px;">
            <span class="material-icons" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">search</span>
            <input [(ngModel)]="search" (keyup.enter)="loadSchedules()" (ngModelChange)="onSearchDebounce()" placeholder="Search schedules..."
              style="width: 100%; padding: 9px 14px 9px 40px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
              onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
              onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            <button *ngIf="search" (click)="clearSearch()"
              style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; display: flex; align-items: center;"
              onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
              <span class="material-icons" style="font-size: 16px; color: #9ca3af;">close</span>
            </button>
          </div>
          <select [(ngModel)]="statusFilter" (change)="onFilterChange()"
            style="width: 160px; padding: 9px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
            onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
            onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
            <option [ngValue]="null">All Statuses</option>
            <option value="planned">Planned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select [(ngModel)]="mealTypeFilter" (change)="onFilterChange()"
            style="width: 160px; padding: 9px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
            onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
            onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
            <option [ngValue]="null">All Meal Types</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="healthy_meal">Healthy Meal</option>
            <option value="snack">Snack</option>
          </select>
          <input type="date" [(ngModel)]="dateFrom" (ngModelChange)="onFilterChange()" placeholder="From"
            style="width: 150px; padding: 9px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
            onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
            onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
          <input type="date" [(ngModel)]="dateTo" (ngModelChange)="onFilterChange()" placeholder="To"
            style="width: 150px; padding: 9px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
            onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
            onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
        </div>
      </div>

      <div *ngIf="selectedSet.size > 0" style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; margin-bottom: 16px; padding: 12px 20px; display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 13px; font-weight: 700; color: #047857;">{{ selectedSet.size }} selected</span>
        <div style="width: 1px; height: 20px; background: #a7f3d0;"></div>
        <button (click)="bulkDelete()"
          style="padding: 6px 14px; background: white; color: #dc2626; font-weight: 600; border-radius: 8px; font-size: 12px; cursor: pointer; border: 1px solid #fca5a5; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 6px;"
          onmouseover="this.style.background='#fef2f2'; this.style.borderColor='#ef4444'" onmouseout="this.style.background='white'; this.style.borderColor='#fca5a5'">
          <span class="material-icons" style="font-size: 16px;">delete</span> Delete
        </button>
        <button (click)="clearSelection()"
          style="margin-left: auto; padding: 6px; background: none; border: none; cursor: pointer; border-radius: 6px; color: #9ca3af; display: flex; align-items: center;"
          onmouseover="this.style.background='#d1fae5'" onmouseout="this.style.background=''">
          <span class="material-icons" style="font-size: 18px;">close</span>
        </button>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
        <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; padding: 80px 0;">
          <div style="width: 40px; height: 40px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        </div>

        <div *ngIf="!loading && schedules.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 24px;">
          <div style="width: 80px; height: 80px; border-radius: 16px; background: #d1fae5; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span class="material-icons" style="font-size: 36px; color: #047857;">calendar_month</span>
          </div>
          <h3 style="font-size: 18px; font-weight: 700; color: #1f2937; margin: 0 0 4px 0;">No production schedules found</h3>
          <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 320px; margin: 0 0 24px 0;">
            <span *ngIf="hasActiveFilters">Try adjusting your search or filter criteria</span>
            <span *ngIf="!hasActiveFilters">Get started by adding a production schedule</span>
          </p>
          <a *ngIf="!hasActiveFilters" routerLink="create"
            style="padding: 10px 20px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span class="material-icons" style="font-size: 18px;">add</span> Add Schedule
          </a>
          <button *ngIf="hasActiveFilters" (click)="clearFilters()"
            style="padding: 10px 20px; background: white; color: #374151; font-weight: 600; border-radius: 10px; font-size: 13px; cursor: pointer; border: 1.5px solid #e5e7eb; transition: all 0.2s ease;"
            onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">Clear Filters</button>
        </div>

        <div *ngIf="!loading && schedules.length > 0">
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f9fafb;">
                  <th style="padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb; width: 40px;">
                    <input type="checkbox" [checked]="isAllSelected()" (change)="toggleAllRows($event)"
                      style="width: 16px; height: 16px; cursor: pointer; accent-color: #059669;" />
                  </th>
                  <th style="padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb; min-width: 150px;">Production Date</th>
                  <th style="padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Meal Type</th>
                  <th style="padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb; min-width: 180px;">Quantities</th>
                  <th style="padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb; min-width: 140px;">Completion</th>
                  <th style="padding: 12px 16px; text-align: center; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Status</th>
                  <th style="padding: 12px 16px; text-align: center; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb; width: 40px;"></th>
                  <th style="padding: 12px 16px; text-align: center; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb; width: 60px;"></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let s of schedules; let i = index"
                  style="transition: background 0.15s ease; cursor: pointer;"
                  [style.background]="i % 2 === 0 ? 'transparent' : '#fafbfc'"
                  onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=i%2===0?'transparent':'#fafbfc'"
                  (click)="editSchedule(s)">
                  <td style="padding: 14px 16px; border-bottom: 1px solid #f3f4f6;" (click)="$event.stopPropagation()">
                    <input type="checkbox" [checked]="selectedSet.has(s)" (change)="toggleRow(s)"
                      style="width: 16px; height: 16px; cursor: pointer; accent-color: #059669;" />
                  </td>
                  <td style="padding: 14px 16px; border-bottom: 1px solid #f3f4f6;">
                    <p style="font-size: 14px; font-weight: 700; color: #1f2937; margin: 0;">{{ s.production_date }}</p>
                    <p *ngIf="s.production_start" style="font-size: 11px; color: #9ca3af; margin: 2px 0 0 0;">Start: {{ s.production_start }}</p>
                  </td>
                  <td style="padding: 14px 16px; border-bottom: 1px solid #f3f4f6;">
                    <span style="display: inline-flex; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700;"
                      [style.background]="mealTypeBg(s.meal_type)"
                      [style.color]="mealTypeColor(s.meal_type)">{{ s.meal_type_label }}</span>
                  </td>
                  <td style="padding: 14px 16px; border-bottom: 1px solid #f3f4f6;">
                    <div style="font-size: 13px; color: #6b7280;">
                      <span>Planned: <strong style="color: #1f2937;">{{ s.planned_quantity }}</strong></span>
                      <span style="margin: 0 8px; color: #d1d5db;">|</span>
                      <span>Produced: <strong style="color: #1f2937;">{{ s.produced_quantity }}</strong></span>
                    </div>
                    <p style="font-size: 11px; color: #9ca3af; margin: 2px 0 0 0;">Remaining: {{ s.remaining_quantity }}</p>
                  </td>
                  <td style="padding: 14px 16px; border-bottom: 1px solid #f3f4f6;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="flex: 1; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden;">
                        <div style="height: 100%; border-radius: 3px; transition: width 0.3s ease;"
                          [style.width.%]="s.completion_percentage"
                          [style.background]="completionColor(s.completion_percentage)"></div>
                      </div>
                      <span style="font-size: 12px; font-weight: 700; color: #6b7280; white-space: nowrap;">{{ s.completion_percentage }}%</span>
                    </div>
                  </td>
                  <td style="padding: 14px 16px; border-bottom: 1px solid #f3f4f6; text-align: center;">
                    <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                      [style.background]="statusBg(s.status)"
                      [style.color]="statusColor(s.status)">{{ s.status_label }}</span>
                  </td>
                  <td style="padding: 14px 16px; border-bottom: 1px solid #f3f4f6; text-align: center;">
                    <span *ngIf="s.is_overdue" class="material-icons" style="font-size: 18px; color: #dc2626;"
                      [style.cursor]="'help'" title="This schedule is overdue">warning</span>
                  </td>
                  <td style="padding: 14px 16px; border-bottom: 1px solid #f3f4f6; text-align: center;">
                    <div style="position: relative;">
                      <button (click)="toggleActionMenu(s.uuid); $event.stopPropagation()"
                        style="padding: 6px; background: none; border: none; cursor: pointer; border-radius: 8px; color: #9ca3af; display: inline-flex; align-items: center; transition: all 0.15s ease;"
                        onmouseover="this.style.background='#f3f4f6'; this.style.color='#374151'" onmouseout="this.style.background=''; this.style.color='#9ca3af'">
                        <span class="material-icons" style="font-size: 20px;">more_vert</span>
                      </button>
                      <div *ngIf="activeActionUuid === s.uuid"
                        style="position: absolute; right: 0; top: 100%; margin-top: 4px; background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 6px; min-width: 180px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); z-index: 50; animation: fadeIn 0.1s ease-out;">
                        <button (click)="editSchedule(s); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; transition: background 0.1s ease; text-align: left; box-sizing: border-box;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">edit</span> Edit
                        </button>
                        <button *ngIf="s.status !== 'completed'" (click)="markCompleted(s); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; transition: background 0.1s ease; text-align: left; box-sizing: border-box;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #047857;">check_circle</span> Mark Completed
                        </button>
                        <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                        <button (click)="deleteSchedule(s); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 8px; transition: background 0.1s ease; text-align: left; box-sizing: border-box;"
                          onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px;">delete</span> Delete
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="border-top: 1px solid #f3f4f6; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
            <span style="font-size: 12px; color: #9ca3af;">Showing {{ getRangeLabel() }}</span>
            <div style="display: flex; align-items: center; gap: 6px;">
              <button (click)="prevPage()" [disabled]="currentPage <= 1"
                style="padding: 6px 12px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease;"
                [style.opacity]="currentPage <= 1 ? '0.4' : '1'"
                [style.cursor]="currentPage <= 1 ? 'not-allowed' : 'pointer'"
                onmouseover="if(!this.disabled){this.style.borderColor='#059669';this.style.color='#059669'}" onmouseout="if(!this.disabled){this.style.borderColor='#e5e7eb';this.style.color='#374151'}">
                <span class="material-icons" style="font-size: 14px;">chevron_left</span>
              </button>
              <span style="font-size: 12px; color: #6b7280; padding: 0 4px;">Page {{ currentPage }} of {{ totalPages }}</span>
              <button (click)="nextPage()" [disabled]="currentPage >= totalPages"
                style="padding: 6px 12px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 12px; color: #374151; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease;"
                [style.opacity]="currentPage >= totalPages ? '0.4' : '1'"
                [style.cursor]="currentPage >= totalPages ? 'not-allowed' : 'pointer'"
                onmouseover="if(!this.disabled){this.style.borderColor='#059669';this.style.color='#059669'}" onmouseout="if(!this.disabled){this.style.borderColor='#e5e7eb';this.style.color='#374151'}">
                <span class="material-icons" style="font-size: 14px;">chevron_right</span>
              </button>
              <select [ngModel]="perPage" (ngModelChange)="onPerPageChange($event)"
                style="margin-left: 8px; padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #374151; outline: none; background: white; cursor: pointer;"
                onfocus="this.style.borderColor='#059669'" onblur="this.style.borderColor='#e5e7eb'">
                <option [ngValue]="10">10 / page</option>
                <option [ngValue]="25">25 / page</option>
                <option [ngValue]="50">50 / page</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class ProductionSchedulesComponent implements OnInit, OnDestroy {
  private scheduleApi = inject(ProductionScheduleApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  schedules: ProductionSchedule[] = [];
  selectedSet = new Set<ProductionSchedule>();

  loading = false;
  currentPage = 1;
  perPage = 10;
  search = '';
  statusFilter: string | null = null;
  mealTypeFilter: string | null = null;
  dateFrom = '';
  dateTo = '';
  kitchenId = 1;

  totalCount = 0;
  inProgressCount = 0;
  completedCount = 0;
  overdueCount = 0;
  activeActionUuid = '';
  private searchTimeout: any;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.perPage));
  }

  get hasActiveFilters(): boolean {
    return !!(this.search || this.statusFilter || this.mealTypeFilter || this.dateFrom || this.dateTo);
  }

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    this.kitchenId = params['kitchen_id'] ? +params['kitchen_id'] : 1;
    this.loadSchedules();
    document.addEventListener('click', this.onDocClick);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.onDocClick);
  }

  onDocClick = (): void => {
    this.activeActionUuid = '';
  };

  loadSchedules(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: this.currentPage.toString(),
      per_page: this.perPage.toString(),
    };
    if (this.kitchenId) params['kitchen_id'] = this.kitchenId.toString();
    if (this.search) params['search'] = this.search;
    if (this.statusFilter) params['status'] = this.statusFilter;
    if (this.mealTypeFilter) params['meal_type'] = this.mealTypeFilter;
    if (this.dateFrom) params['date_from'] = this.dateFrom;
    if (this.dateTo) params['date_to'] = this.dateTo;

    this.scheduleApi.getPaginated(params).subscribe({
      next: (res) => {
        this.schedules = res.data || [];
        this.totalCount = res.meta?.total ?? this.schedules.length;
        this.inProgressCount = this.schedules.filter(s => s.status === 'in_progress').length;
        this.completedCount = this.schedules.filter(s => s.status === 'completed').length;
        this.overdueCount = this.schedules.filter(s => s.is_overdue).length;
        this.loading = false;
      },
      error: () => { this.loading = false; this.notification.error('Failed to load production schedules'); },
    });
  }

  onSearchDebounce(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => { this.currentPage = 1; this.loadSchedules(); }, 400);
  }

  clearSearch(): void { this.search = ''; this.currentPage = 1; this.loadSchedules(); }
  onFilterChange(): void { this.currentPage = 1; this.loadSchedules(); }
  clearFilters(): void {
    this.search = ''; this.statusFilter = null; this.mealTypeFilter = null;
    this.dateFrom = ''; this.dateTo = ''; this.currentPage = 1;
    this.loadSchedules();
  }

  onPerPageChange(val: number): void {
    this.perPage = val;
    this.currentPage = 1;
    this.loadSchedules();
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.loadSchedules(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.loadSchedules(); }
  }

  isAllSelected(): boolean {
    return this.schedules.length > 0 && this.selectedSet.size === this.schedules.length;
  }

  toggleAllRows(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) { this.schedules.forEach(s => this.selectedSet.add(s)); }
    else { this.selectedSet.clear(); }
  }

  toggleRow(s: ProductionSchedule): void {
    if (this.selectedSet.has(s)) { this.selectedSet.delete(s); }
    else { this.selectedSet.add(s); }
  }

  clearSelection(): void {
    this.selectedSet.clear();
  }

  toggleActionMenu(uuid: string): void {
    this.activeActionUuid = this.activeActionUuid === uuid ? '' : uuid;
  }

  getRangeLabel(): string {
    const t = this.totalCount;
    if (t === 0) return '0 of 0';
    const start = (this.currentPage - 1) * this.perPage + 1;
    const end = Math.min(this.currentPage * this.perPage, t);
    return `${start}\u2013${end} of ${t}`;
  }

  mealTypeBg(type: string): string {
    switch (type) {
      case 'breakfast': return '#fff7ed';
      case 'lunch': return '#eff6ff';
      case 'dinner': return '#f5f3ff';
      case 'healthy_meal': return '#ecfdf5';
      case 'snack': return '#fffbeb';
      default: return '#f3f4f6';
    }
  }

  mealTypeColor(type: string): string {
    switch (type) {
      case 'breakfast': return '#c2410c';
      case 'lunch': return '#1d4ed8';
      case 'dinner': return '#6d28d9';
      case 'healthy_meal': return '#047857';
      case 'snack': return '#b45309';
      default: return '#374151';
    }
  }

  statusBg(status: string): string {
    switch (status) {
      case 'planned': return '#eff6ff';
      case 'in_progress': return '#fef3c7';
      case 'completed': return '#d1fae5';
      case 'cancelled': return '#f3f4f6';
      default: return '#f3f4f6';
    }
  }

  statusColor(status: string): string {
    switch (status) {
      case 'planned': return '#1d4ed8';
      case 'in_progress': return '#d97706';
      case 'completed': return '#047857';
      case 'cancelled': return '#6b7280';
      default: return '#374151';
    }
  }

  completionColor(pct: number): string {
    if (pct >= 100) return '#10b981';
    if (pct >= 60) return '#f59e0b';
    if (pct >= 30) return '#f97316';
    return '#ef4444';
  }

  editSchedule(s: ProductionSchedule): void {
    this.router.navigate([s.uuid, 'edit'], { relativeTo: this.route });
  }

  markCompleted(s: ProductionSchedule): void {
    this.activeActionUuid = '';
    if (window.confirm(`Mark "${s.meal_type_label} - ${s.production_date}" as completed?`)) {
      this.scheduleApi.markCompleted(s.uuid).subscribe({
        next: () => { this.notification.success('Schedule marked as completed'); this.loadSchedules(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deleteSchedule(s: ProductionSchedule): void {
    this.activeActionUuid = '';
    if (window.confirm(`Delete "${s.meal_type_label} - ${s.production_date}"? This action cannot be undone.`)) {
      this.scheduleApi.delete(s.uuid).subscribe({
        next: () => { this.notification.success('Schedule deleted'); this.loadSchedules(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  bulkDelete(): void {
    const ids = Array.from(this.selectedSet);
    if (window.confirm(`Delete ${ids.length} selected schedules? This cannot be undone.`)) {
      let completed = 0;
      ids.forEach(s => {
        this.scheduleApi.delete(s.uuid).subscribe({
          next: () => {
            completed++;
            if (completed === ids.length) {
              this.notification.success('Schedules deleted');
              this.clearSelection();
              this.loadSchedules();
            }
          },
          error: (err) => { this.notification.error(err.error?.message || 'Delete failed'); },
        });
      });
    }
  }

  generatePlan(): void {
    const today = new Date().toISOString().split('T')[0];
    if (window.confirm(`Generate production plan for today (${today})?`)) {
      this.scheduleApi.generatePlan({
        kitchen_id: this.kitchenId,
        date: today,
        meal_types: ['breakfast', 'lunch', 'dinner'],
      }).subscribe({
        next: () => { this.notification.success('Production plan generated'); this.loadSchedules(); },
        error: (err) => this.notification.error(err.error?.message || 'Failed to generate plan'),
      });
    }
  }
}
