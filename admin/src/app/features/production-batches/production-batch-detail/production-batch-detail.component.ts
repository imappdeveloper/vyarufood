import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductionBatchApiService } from '../../../core/services/production-batch-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ProductionBatch } from '../../../core/models/production-batch/production-batch.model';

@Component({
  selector: 'app-production-batch-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading batch details...</p>
      </div>
    </div>

    <div *ngIf="!loading && batch" style="animation: fadeIn 0.3s ease-out;">
      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
          <a routerLink="/admin/production-batches" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 16px;">arrow_back</span>
            Back to Production Batches
          </a>
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;">
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0;">{{ batch.batch_number }}</h1>
                <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                  [style.background]="getStatusBg(batch.production_status)"
                  [style.color]="getStatusText(batch.production_status)">
                  {{ batch.production_status_label || batch.production_status }}
                </span>
              </div>
              <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">
                {{ batch.batch_name }} &bull; {{ batch.production_date | date:'mediumDate' }} &bull; {{ batch.kitchen_name || 'Unknown Kitchen' }}
              </p>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; flex-shrink: 0;">
              <div style="position: relative;">
                <button (click)="showActions = !showActions"
                  style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
                  onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
                  <span class="material-icons" style="font-size: 18px;">more_vert</span> Actions
                </button>
                <div *ngIf="showActions" style="position: absolute; right: 0; top: 100%; z-index: 50; background: white; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 10px 40px rgba(0,0,0,0.12); min-width: 200px; padding: 6px; margin-top: 4px; animation: fadeIn 0.1s ease-out;">
                  <button *ngIf="batch.production_status === 'draft' || batch.production_status === 'planned'" (click)="startBatch(); showActions = false"
                    style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                    onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                    <span class="material-icons" style="font-size: 18px; color: #3b82f6;">play_arrow</span> Start Production
                  </button>
                  <button *ngIf="batch.production_status === 'cooking'" (click)="pauseBatch(); showActions = false"
                    style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                    onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                    <span class="material-icons" style="font-size: 18px; color: #d97706;">pause</span> Pause
                  </button>
                  <button *ngIf="batch.production_status !== 'completed' && batch.production_status !== 'cancelled'" (click)="completeBatch(); showActions = false"
                    style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                    onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                    <span class="material-icons" style="font-size: 18px; color: #047857;">check_circle</span> Complete
                  </button>
                  <button *ngIf="batch.production_status !== 'completed' && batch.production_status !== 'cancelled'" (click)="cancelBatch(); showActions = false"
                    style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                    onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                    <span class="material-icons" style="font-size: 18px;">cancel</span> Cancel
                  </button>
                  <div style="height: 1px; background: #f3f4f6; margin: 4px 0;"></div>
                  <button (click)="deleteBatch(); showActions = false"
                    style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                    onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                    <span class="material-icons" style="font-size: 18px;">delete</span> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
        </svg>
      </section>

      <section style="max-width: 1200px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #059669;">restaurant</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Meals</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ batch.total_meals }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #047857;">receipt_long</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Total Orders</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ batch.total_orders }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #d1fae5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span class="material-icons" style="font-size: 22px; color: #047857;">inventory</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Batch Type</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ batch.batch_type | titlecase }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s ease;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow=''">
            <div style="width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"
              [style.background]="batch.actual_start_time ? '#d1fae5' : '#f3f4f6'">
              <span class="material-icons" style="font-size: 22px;" [style.color]="batch.actual_start_time ? '#059669' : '#9ca3af'">schedule</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Start Time</p>
              <p style="font-size: 22px; font-weight: 800; color: #166534; margin: 0;">{{ batch.planned_start_time || '-' }}</p>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: start;">
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #047857;">info</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Batch Info</h2>
              </div>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Batch Number</p>
                  <p style="font-size: 14px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ batch.batch_number }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Batch Name</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ batch.batch_name }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Production Date</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ batch.production_date | date:'mediumDate' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Kitchen</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ batch.kitchen_name || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Planned Start</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ batch.planned_start_time || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Planned End</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ batch.planned_end_time || '-' }}</p>
                </div>
                <div *ngIf="batch.actual_start_time">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Actual Start</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ batch.actual_start_time | date:'medium' }}</p>
                </div>
                <div *ngIf="batch.actual_end_time">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Actual End</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ batch.actual_end_time | date:'medium' }}</p>
                </div>
                <div *ngIf="batch.prepared_by_name">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Prepared By</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ batch.prepared_by_name }}</p>
                </div>
                <div *ngIf="batch.approved_by_name">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Approved By</p>
                  <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ batch.approved_by_name }}</p>
                </div>
                <div *ngIf="batch.remarks" style="grid-column: 1 / -1;">
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Remarks</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ batch.remarks }}</p>
                </div>
              </div>
            </div>

            <div *ngIf="batch.items && batch.items.length > 0" style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #7c3aed;">restaurant_menu</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Batch Items</h2>
              </div>
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                  <thead>
                    <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                      <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Meal</th>
                      <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Planned</th>
                      <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Prepared</th>
                      <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Packed</th>
                      <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Waste</th>
                      <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of batch.items; let i = index" style="border-bottom: 1px solid #f3f4f6;"
                      [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'">
                      <td style="padding: 12px 12px;">
                        <div>
                          <span style="font-size: 13px; font-weight: 600; color: #1f2937;">{{ item.meal_name }}</span>
                          <p *ngIf="item.meal_category_name" style="font-size: 11px; color: #9ca3af; margin: 2px 0 0 0;">{{ item.meal_category_name }}</p>
                        </div>
                      </td>
                      <td style="padding: 12px 12px; text-align: center;">
                        <span style="font-size: 13px; font-weight: 600; color: #1f2937;">{{ item.planned_quantity }}</span>
                      </td>
                      <td style="padding: 12px 12px; text-align: center;">
                        <span style="font-size: 13px; color: #6b7280;">{{ item.prepared_quantity }}</span>
                      </td>
                      <td style="padding: 12px 12px; text-align: center;">
                        <span style="font-size: 13px; color: #6b7280;">{{ item.packed_quantity }}</span>
                      </td>
                      <td style="padding: 12px 12px; text-align: center;">
                        <span style="font-size: 13px; font-weight: 600;" [style.color]="item.wastage_quantity > 0 ? '#dc2626' : '#6b7280'">{{ item.wastage_quantity }}</span>
                      </td>
                      <td style="padding: 12px 12px; text-align: center;">
                        <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                          [style.background]="getItemStatusBg(item.status)"
                          [style.color]="getItemStatusText(item.status)">
                          {{ item.status | titlecase }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden;">
              <div style="display: flex; border-bottom: 1px solid #e5e7eb;">
                <button (click)="activeTab = 'packing'"
                  style="flex: 1; padding: 12px 16px; border: none; background: none; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.15s ease;"
                  [style.color]="activeTab === 'packing' ? '#059669' : '#6b7280'"
                  [style.borderBottom]="activeTab === 'packing' ? '2px solid #059669' : '2px solid transparent'"
                  onmouseover="this.style.color='#059669'" onmouseout="this.style.color=activeTab === 'packing' ? '#059669' : '#6b7280'">Packing</button>
                <button (click)="activeTab = 'history'"
                  style="flex: 1; padding: 12px 16px; border: none; background: none; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.15s ease;"
                  [style.color]="activeTab === 'history' ? '#059669' : '#6b7280'"
                  [style.borderBottom]="activeTab === 'history' ? '2px solid #059669' : '2px solid transparent'"
                  onmouseover="this.style.color='#059669'" onmouseout="this.style.color=activeTab === 'history' ? '#059669' : '#6b7280'">Status History</button>
              </div>
              <div *ngIf="activeTab === 'packing'" style="padding: 16px;">
                <div *ngIf="batch.packing_lists && batch.packing_lists.length > 0" style="display: flex; flex-direction: column; gap: 12px;">
                  <div *ngFor="let pack of batch.packing_lists" style="padding: 12px; border-radius: 10px; border: 1px solid;"
                    [style.background]="pack.packing_status === 'packed' ? '#ecfdf5' : '#f9fafb'"
                    [style.borderColor]="pack.packing_status === 'packed' ? '#a7f3d0' : '#e5e7eb'">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                      <span style="font-size: 13px; font-weight: 600; color: #1f2937;">{{ pack.customer_name || 'Customer #' + pack.customer_id }}</span>
                      <span style="display: inline-flex; padding: 2px 10px; border-radius: 12px; font-size: 10px; font-weight: 700;"
                        [style.background]="pack.packing_status === 'packed' ? '#d1fae5' : '#fef3c7'"
                        [style.color]="pack.packing_status === 'packed' ? '#047857' : '#d97706'">
                        {{ pack.packing_status | titlecase }}
                      </span>
                    </div>
                    <p style="font-size: 12px; color: #6b7280; margin: 0;">{{ pack.meal_name }} x {{ pack.quantity }}</p>
                    <p style="font-size: 11px; color: #9ca3af; margin: 2px 0 0 0;">Order: {{ pack.order_number || '#' + pack.order_id }}</p>
                  </div>
                </div>
                <div *ngIf="!batch.packing_lists || batch.packing_lists.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px;">
                  <span class="material-icons" style="font-size: 32px; color: #d1d5db; margin-bottom: 8px;">inventory_2</span>
                  <p style="font-size: 13px; color: #9ca3af; margin: 0;">No packing items</p>
                </div>
              </div>
              <div *ngIf="activeTab === 'history'" style="padding: 16px;">
                <div *ngIf="batch.status_history && batch.status_history.length > 0" style="display: flex; flex-direction: column; gap: 12px;">
                  <div *ngFor="let history of batch.status_history" style="padding: 12px; border-radius: 10px; background: #f9fafb; border: 1px solid #e5e7eb;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="display: inline-flex; padding: 2px 10px; border-radius: 12px; font-size: 10px; font-weight: 700;"
                          [style.background]="getStatusBg(history.from_status || 'draft')"
                          [style.color]="getStatusText(history.from_status || 'draft')">
                          {{ (history.from_status || 'New') | titlecase }}
                        </span>
                        <span class="material-icons" style="font-size: 14px; color: #9ca3af;">arrow_forward</span>
                        <span style="display: inline-flex; padding: 2px 10px; border-radius: 12px; font-size: 10px; font-weight: 700;"
                          [style.background]="getStatusBg(history.to_status)"
                          [style.color]="getStatusText(history.to_status)">
                          {{ history.to_status | titlecase }}
                        </span>
                      </div>
                      <span style="font-size: 11px; color: #9ca3af;">{{ history.created_at | date:'short' }}</span>
                    </div>
                    <p *ngIf="history.changed_by_name" style="font-size: 11px; color: #6b7280; margin: 4px 0 0 0;">By: {{ history.changed_by_name }}</p>
                    <p *ngIf="history.reason" style="font-size: 11px; color: #6b7280; margin: 4px 0 0 0; font-style: italic;">{{ history.reason }}</p>
                  </div>
                </div>
                <div *ngIf="!batch.status_history || batch.status_history.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px;">
                  <span class="material-icons" style="font-size: 32px; color: #d1d5db; margin-bottom: 8px;">history</span>
                  <p style="font-size: 13px; color: #9ca3af; margin: 0;">No status history</p>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span class="material-icons" style="font-size: 18px; color: #9ca3af;">info</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Audit</h2>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Created At</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ batch.created_at | date:'medium' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Updated At</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ batch.updated_at | date:'medium' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Created By</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ batch.created_by_name || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Updated By</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ batch.updated_by_name || '-' }}</p>
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
export class ProductionBatchDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private batchApi = inject(ProductionBatchApiService);
  private notification = inject(NotificationService);

  batch: ProductionBatch | null = null;
  loading = true;
  itemColumns = ['meal_name', 'planned_quantity', 'prepared_quantity', 'packed_quantity', 'wastage_quantity', 'item_status'];
  activeTab: 'packing' | 'history' = 'packing';
  showActions = false;

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) { this.loadBatch(uuid); }
  }

  loadBatch(uuid: string): void {
    this.batchApi.getBatch(uuid).subscribe({
      next: (res) => { this.batch = res.data ?? null; this.loading = false; },
      error: () => { this.notification.error('Failed to load batch'); this.router.navigate(['/admin/production-batches']); },
    });
  }

  getStatusBg(status: string): string {
    switch (status) {
      case 'draft': return '#f3f4f6';
      case 'planned': return '#dbeafe';
      case 'cooking': return '#ffedd5';
      case 'prepared': return '#ede9fe';
      case 'packing': return '#e0e7ff';
      case 'packed': return '#cffafe';
      case 'completed': return '#d1fae5';
      case 'cancelled': return '#fef2f2';
      default: return '#f3f4f6';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'draft': return '#374151';
      case 'planned': return '#1d4ed8';
      case 'cooking': return '#c2410c';
      case 'prepared': return '#7c3aed';
      case 'packing': return '#4338ca';
      case 'packed': return '#0e7490';
      case 'completed': return '#047857';
      case 'cancelled': return '#dc2626';
      default: return '#374151';
    }
  }

  getItemStatusBg(status: string): string {
    switch (status) {
      case 'pending': return '#f3f4f6';
      case 'cooking': return '#ffedd5';
      case 'prepared': return '#ede9fe';
      case 'packing': return '#e0e7ff';
      case 'packed': return '#d1fae5';
      case 'cancelled': return '#fef2f2';
      default: return '#f3f4f6';
    }
  }

  getItemStatusText(status: string): string {
    switch (status) {
      case 'pending': return '#374151';
      case 'cooking': return '#c2410c';
      case 'prepared': return '#7c3aed';
      case 'packing': return '#4338ca';
      case 'packed': return '#047857';
      case 'cancelled': return '#dc2626';
      default: return '#374151';
    }
  }

  startBatch(): void {
    if (!this.batch) return;
    if (window.confirm('Start production?')) {
      this.batchApi.startBatch(this.batch.uuid).subscribe({
        next: () => { this.notification.success('Production started'); this.loadBatch(this.batch!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  pauseBatch(): void {
    if (!this.batch) return;
    if (window.confirm('Pause production?')) {
      this.batchApi.pauseBatch(this.batch.uuid).subscribe({
        next: () => { this.notification.success('Production paused'); this.loadBatch(this.batch!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  completeBatch(): void {
    if (!this.batch) return;
    if (window.confirm('Mark as completed?')) {
      this.batchApi.completeBatch(this.batch.uuid).subscribe({
        next: () => { this.notification.success('Production completed'); this.loadBatch(this.batch!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  cancelBatch(): void {
    if (!this.batch) return;
    const reason = prompt('Cancellation reason:');
    if (reason === null) return;
    this.batchApi.cancelBatch(this.batch.uuid, reason || 'Cancelled by admin').subscribe({
      next: () => { this.notification.success('Batch cancelled'); this.loadBatch(this.batch!.uuid); },
      error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
    });
  }

  deleteBatch(): void {
    if (!this.batch) return;
    if (window.confirm('Delete this batch? This cannot be undone.')) {
      this.batchApi.deleteBatch(this.batch.uuid).subscribe({
        next: () => { this.notification.success('Batch deleted'); this.router.navigate(['/admin/production-batches']); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }
}
