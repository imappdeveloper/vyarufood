import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { KitchenCapacityApiService } from '../../../core/services/kitchen-capacity-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { KitchenCapacity } from '../../../core/models/kitchen/kitchen-capacity.model';

@Component({
  selector: 'app-capacity',
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
          <span style="color: white; font-weight: 600;">Capacity</span>
        </nav>
        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;">
          <div>
            <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">Kitchen Capacity</h1>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Manage daily kitchen capacity and order limits</p>
          </div>
          <a routerLink="create"
            style="padding: 10px 20px; background: white; color: #059669; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease; white-space: nowrap;"
            onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
            onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
            <span class="material-icons" style="font-size: 18px;">add</span>
            Add Capacity
          </a>
        </div>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 1200px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 16px; transition: all 0.2s ease;"
          onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px -5px rgba(0,0,0,0.06)'"
          onmouseout="this.style.transform=''; this.style.boxShadow=''">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="font-size: 22px; color: #047857;">view_list</span>
          </div>
          <div>
            <p style="font-size: 12px; color: #9ca3af; font-weight: 500; margin: 0;">Total Records</p>
            <p style="font-size: 22px; font-weight: 800; color: #1f2937; margin: 2px 0 0 0;">{{ totalCount }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 16px; transition: all 0.2s ease;"
          onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px -5px rgba(0,0,0,0.06)'"
          onmouseout="this.style.transform=''; this.style.boxShadow=''">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="font-size: 22px; color: #047857;">check_circle</span>
          </div>
          <div>
            <p style="font-size: 12px; color: #9ca3af; font-weight: 500; margin: 0;">Active</p>
            <p style="font-size: 22px; font-weight: 800; color: #1f2937; margin: 2px 0 0 0;">{{ activeCount }}</p>
          </div>
        </div>
        <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 16px; transition: all 0.2s ease;"
          onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px -5px rgba(0,0,0,0.06)'"
          onmouseout="this.style.transform=''; this.style.boxShadow=''">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: #fef3c7; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="font-size: 22px; color: #d97706;">pie_chart</span>
          </div>
          <div>
            <p style="font-size: 12px; color: #9ca3af; font-weight: 500; margin: 0;">Avg Capacity %</p>
            <p style="font-size: 22px; font-weight: 800; color: #1f2937; margin: 2px 0 0 0;">{{ avgCapacityPercentage }}%</p>
          </div>
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 20px; margin-bottom: 16px;">
        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 12px;">
          <div style="position: relative; flex: 1; min-width: 160px;">
            <span class="material-icons" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">search</span>
            <input [(ngModel)]="search" (keyup.enter)="loadCapacities()" (ngModelChange)="onSearchDebounce()" placeholder="Search capacities..."
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
            style="width: 150px; padding: 9px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
            onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
            onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
            <option [ngValue]="null">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <input type="date" [(ngModel)]="dateFrom" (change)="onFilterChange()" placeholder="From date"
            style="width: 160px; padding: 9px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
            onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
            onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
          <input type="date" [(ngModel)]="dateTo" (change)="onFilterChange()" placeholder="To date"
            style="width: 160px; padding: 9px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
            onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
            onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
        </div>
      </div>

      <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden;">
        <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; padding: 80px 0;">
          <div style="width: 40px; height: 40px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        </div>

        <div *ngIf="!loading && capacities.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 24px;">
          <div style="width: 80px; height: 80px; border-radius: 16px; background: #d1fae5; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span class="material-icons" style="font-size: 36px; color: #047857;">view_list</span>
          </div>
          <h3 style="font-size: 18px; font-weight: 700; color: #1f2937; margin: 0 0 4px 0;">No capacity records found</h3>
          <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 320px; margin: 0 0 24px 0;">
            <span *ngIf="search || statusFilter || dateFrom || dateTo">Try adjusting your search or filter criteria</span>
            <span *ngIf="!search && !statusFilter && !dateFrom && !dateTo">Get started by adding your first capacity record</span>
          </p>
          <a *ngIf="!search && !statusFilter && !dateFrom && !dateTo" routerLink="create"
            style="padding: 10px 20px; background: #059669; color: white; font-weight: 700; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.2s ease;"
            onmouseover="this.style.background='#047857';this.style.transform='translateY(-1px)'" onmouseout="this.style.background='#059669';this.style.transform=''">
            <span class="material-icons" style="font-size: 18px;">add</span> Add Capacity
          </a>
          <button *ngIf="search || statusFilter || dateFrom || dateTo" (click)="clearFilters()"
            style="padding: 10px 20px; background: white; color: #374151; font-weight: 600; border-radius: 10px; font-size: 13px; cursor: pointer; border: 1.5px solid #e5e7eb; transition: all 0.2s ease;"
            onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">Clear Filters</button>
        </div>

        <div *ngIf="!loading && capacities.length > 0">
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f9fafb;">
                  <th style="padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb; min-width: 130px;">Date</th>
                  <th style="padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb; min-width: 200px;">Meal Capacities</th>
                  <th style="padding: 12px 16px; text-align: center; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Max Orders</th>
                  <th style="padding: 12px 16px; text-align: center; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Available</th>
                  <th style="padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb; min-width: 160px;">Capacity %</th>
                  <th style="padding: 12px 16px; text-align: center; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Status</th>
                  <th style="padding: 12px 16px; text-align: center; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb; width: 60px;"></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let c of capacities; let i = index"
                  style="transition: background 0.15s ease; cursor: pointer;"
                  [style.background]="i % 2 === 0 ? 'transparent' : '#fafbfc'"
                  onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=i%2===0?'transparent':'#fafbfc'"
                  (click)="editCapacity(c)">
                  <td style="padding: 14px 16px; border-bottom: 1px solid #f3f4f6;">
                    <p style="font-size: 14px; font-weight: 700; color: #1f2937; margin: 0;">{{ c.capacity_date | date:'mediumDate' }}</p>
                    <p style="font-size: 11px; color: #9ca3af; margin: 2px 0 0 0;">{{ c.capacity_date | date:'EEEE' }}</p>
                  </td>
                  <td style="padding: 14px 16px; border-bottom: 1px solid #f3f4f6;">
                    <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                      <span style="display: inline-flex; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; background: #fef3c7; color: #d97706;">B: {{ c.breakfast_capacity || 0 }}</span>
                      <span style="display: inline-flex; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; background: #d1fae5; color: #047857;">L: {{ c.lunch_capacity || 0 }}</span>
                      <span style="display: inline-flex; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; background: #ede9fe; color: #7c3aed;">D: {{ c.dinner_capacity || 0 }}</span>
                      <span *ngIf="c.healthy_meal_capacity" style="display: inline-flex; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; background: #ccfbf1; color: #0d9488;">H: {{ c.healthy_meal_capacity }}</span>
                      <span *ngIf="c.snack_capacity" style="display: inline-flex; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; background: #ffedd5; color: #ea580c;">S: {{ c.snack_capacity }}</span>
                    </div>
                  </td>
                  <td style="padding: 14px 16px; border-bottom: 1px solid #f3f4f6; text-align: center;">
                    <span style="font-size: 14px; font-weight: 700; color: #1f2937;">{{ c.maximum_orders || 0 }}</span>
                  </td>
                  <td style="padding: 14px 16px; border-bottom: 1px solid #f3f4f6; text-align: center;">
                    <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                      [style.background]="getAvailableBg(c.available_orders)"
                      [style.color]="getAvailableColor(c.available_orders)">{{ c.available_orders || 0 }}</span>
                  </td>
                  <td style="padding: 14px 16px; border-bottom: 1px solid #f3f4f6;">
                    <div>
                      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                        <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ c.capacity_percentage || 0 }}%</span>
                      </div>
                      <div style="height: 6px; border-radius: 3px; background: #e5e7eb; overflow: hidden;">
                        <div style="height: 100%; border-radius: 3px; transition: width 0.3s ease;"
                          [style.width.%]="c.capacity_percentage || 0"
                          [style.background]="getCapacityColor(c.capacity_percentage)"></div>
                      </div>
                    </div>
                  </td>
                  <td style="padding: 14px 16px; border-bottom: 1px solid #f3f4f6; text-align: center;">
                    <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                      [style.background]="c.status === 'active' ? '#d1fae5' : '#f3f4f6'"
                      [style.color]="c.status === 'active' ? '#047857' : '#6b7280'">{{ c.status_label || c.status }}</span>
                  </td>
                  <td style="padding: 14px 16px; border-bottom: 1px solid #f3f4f6; text-align: center;">
                    <div style="position: relative;">
                      <button (click)="toggleActionMenu(c.uuid); $event.stopPropagation()"
                        style="padding: 6px; background: none; border: none; cursor: pointer; border-radius: 8px; color: #9ca3af; display: inline-flex; align-items: center; transition: all 0.15s ease;"
                        onmouseover="this.style.background='#f3f4f6'; this.style.color='#374151'" onmouseout="this.style.background=''; this.style.color='#9ca3af'">
                        <span class="material-icons" style="font-size: 20px;">more_vert</span>
                      </button>
                      <div *ngIf="activeActionUuid === c.uuid"
                        style="position: absolute; right: 0; top: 100%; margin-top: 4px; background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 6px; min-width: 160px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); z-index: 50; animation: fadeIn 0.1s ease-out;">
                        <button (click)="editCapacity(c); $event.stopPropagation()"
                          style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; transition: background 0.1s ease; text-align: left; box-sizing: border-box;"
                          onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px; color: #059669;">edit</span> Edit
                        </button>
                        <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                        <button (click)="deleteCapacity(c); $event.stopPropagation()"
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
export class CapacityComponent implements OnInit, OnDestroy {
  private capacityApi = inject(KitchenCapacityApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  capacities: KitchenCapacity[] = [];

  loading = false;
  currentPage = 1;
  perPage = 10;
  sort = 'capacity_date';
  order: 'asc' | 'desc' = 'desc';
  search = '';
  statusFilter: string | null = null;
  dateFrom = '';
  dateTo = '';

  totalCount = 0;
  activeCount = 0;
  avgCapacityPercentage = 0;
  kitchenId = 1;
  activeActionUuid = '';
  private searchTimeout: any;

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    this.kitchenId = params['kitchen_id'] ? +params['kitchen_id'] : 1;
    this.loadCapacities();
    document.addEventListener('click', this.onDocClick);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.onDocClick);
  }

  onDocClick = (): void => {
    this.activeActionUuid = '';
  };

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.perPage));
  }

  toggleActionMenu(uuid: string): void {
    this.activeActionUuid = this.activeActionUuid === uuid ? '' : uuid;
  }

  loadCapacities(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: this.currentPage.toString(),
      per_page: this.perPage.toString(),
      sort: this.sort,
      order: this.order,
    };
    if (this.kitchenId) params['kitchen_id'] = this.kitchenId.toString();
    if (this.search) params['search'] = this.search;
    if (this.statusFilter) params['status'] = this.statusFilter;
    if (this.dateFrom) params['date_from'] = this.dateFrom;
    if (this.dateTo) params['date_to'] = this.dateTo;

    this.capacityApi.getPaginated(params).subscribe({
      next: (res) => {
        this.capacities = res.data || [];
        this.totalCount = res.meta?.total || this.capacities.length;
        this.activeCount = this.capacities.filter(c => c.status === 'active').length;
        this.avgCapacityPercentage = this.capacities.length > 0
          ? Math.round(this.capacities.reduce((sum, c) => sum + (c.capacity_percentage || 0), 0) / this.capacities.length)
          : 0;
        this.loading = false;
      },
      error: () => { this.loading = false; this.notification.error('Failed to load capacity records'); },
    });
  }

  onSearchDebounce(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => { this.currentPage = 1; this.loadCapacities(); }, 400);
  }

  clearSearch(): void { this.search = ''; this.currentPage = 1; this.loadCapacities(); }
  onFilterChange(): void { this.currentPage = 1; this.loadCapacities(); }
  clearFilters(): void {
    this.search = '';
    this.statusFilter = null;
    this.dateFrom = '';
    this.dateTo = '';
    this.currentPage = 1;
    this.loadCapacities();
  }

  onPerPageChange(val: number): void {
    this.perPage = val;
    this.currentPage = 1;
    this.loadCapacities();
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.loadCapacities(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.loadCapacities(); }
  }

  getRangeLabel(): string {
    const t = this.totalCount;
    if (t === 0) return '0 of 0';
    const start = (this.currentPage - 1) * this.perPage + 1;
    const end = Math.min(this.currentPage * this.perPage, t);
    return `${start}\u2013${end} of ${t}`;
  }

  getAvailableBg(available: number): string {
    if (available <= 0) return '#fee2e2';
    if (available <= 10) return '#fef3c7';
    return '#d1fae5';
  }

  getAvailableColor(available: number): string {
    if (available <= 0) return '#dc2626';
    if (available <= 10) return '#d97706';
    return '#047857';
  }

  getCapacityColor(percentage: number): string {
    if (percentage >= 90) return '#ef4444';
    if (percentage >= 70) return '#f59e0b';
    if (percentage >= 40) return '#6366f1';
    return '#10b981';
  }

  editCapacity(row: KitchenCapacity): void {
    this.router.navigate([row.uuid, 'edit'], { relativeTo: this.route });
  }

  deleteCapacity(row: KitchenCapacity): void {
    this.activeActionUuid = '';
    if (window.confirm(`Delete capacity for ${row.capacity_date}? This action cannot be undone.`)) {
      this.capacityApi.delete(row.uuid).subscribe({
        next: () => { this.notification.success('Capacity record deleted'); this.loadCapacities(); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }
}
