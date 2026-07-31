import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NotificationApiService } from '../../../../core/services/notification-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  Notification, DELIVERY_STATUSES, NOTIFICATION_PRIORITIES
} from '../../../../core/models/notification/notification.model';

@Component({
  selector: 'app-notification-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading notification details...</p>
      </div>
    </div>

    <div *ngIf="!loading && notificationData" style="animation: fadeIn 0.3s ease-out;">
      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
          <a routerLink="/admin/notifications/list" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 16px;">arrow_back</span>
            Back to Notifications
          </a>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0;">Notification Detail</h1>
              <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                [style.background]="getStatusBadgeStyle(notificationData.delivery_status).background" [style.color]="getStatusBadgeStyle(notificationData.delivery_status).color">
                {{ getStatusLabel(notificationData.delivery_status) }}
              </span>
            </div>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">{{ notificationData.notification_number }}</p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 20px;">
            <button *ngIf="notificationData.delivery_status === 'pending' || notificationData.delivery_status === 'queued'" (click)="cancelNotification()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(220,38,38,0.3)'; this.style.borderColor='rgba(220,38,38,0.4)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'; this.style.borderColor='rgba(255,255,255,0.2)'">
              <span class="material-icons" style="font-size: 18px;">cancel</span> Cancel
            </button>
          </div>
        </div>
        <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
        </svg>
      </section>

      <section style="max-width: 1200px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px;">
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 20px;">
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px 0;">Channel</p>
            <p style="font-size: 16px; font-weight: 700; color: #166534; margin: 0; text-transform: capitalize;">{{ notificationData.channel }}</p>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 20px;">
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px 0;">Priority</p>
            <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
              [style.background]="getPriorityBadgeStyle(notificationData.priority).background" [style.color]="getPriorityBadgeStyle(notificationData.priority).color">
              {{ notificationData.priority | titlecase }}
            </span>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 20px;">
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px 0;">Recipient</p>
            <p style="font-size: 16px; font-weight: 700; color: #166534; margin: 0; text-transform: capitalize;">{{ notificationData.recipient_type }}{{ notificationData.recipient_id ? ' #' + notificationData.recipient_id : '' }}</p>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 20px;">
            <p style="font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px 0;">Scheduled At</p>
            <p style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">{{ notificationData.scheduled_at ? (notificationData.scheduled_at | date:'dd MMM yyyy, hh:mm a') : '—' }}</p>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
          <button (click)="setActiveTab('overview')"
            style="padding: 9px 20px; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 6px;"
            [style.background]="activeTab === 'overview' ? '#059669' : 'white'"
            [style.color]="activeTab === 'overview' ? 'white' : '#6b7280'"
            [style.boxShadow]="activeTab === 'overview' ? '0 4px 12px rgba(5,150,105,0.3)' : '0 1px 2px rgba(0,0,0,0.05)'"
            [style.border]="activeTab === 'overview' ? 'none' : '1px solid #e5e7eb'"
            onmouseover="this.style.background='#047857';this.style.color='white';this.style.boxShadow='0 4px 12px rgba(5,150,105,0.3)'"
            onmouseout="this.style.background=(this.getAttribute('data-active') === 'overview') ? '#059669' : 'white';this.style.color=(this.getAttribute('data-active') === 'overview') ? 'white' : '#6b7280';this.style.boxShadow=(this.getAttribute('data-active') === 'overview') ? '0 4px 12px rgba(5,150,105,0.3)' : '0 1px 2px rgba(0,0,0,0.05)'">
            <span class="material-icons" style="font-size: 18px;">info</span> Overview
          </button>
          <button (click)="setActiveTab('logs')"
            style="padding: 9px 20px; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 6px;"
            [style.background]="activeTab === 'logs' ? '#059669' : 'white'"
            [style.color]="activeTab === 'logs' ? 'white' : '#6b7280'"
            [style.boxShadow]="activeTab === 'logs' ? '0 4px 12px rgba(5,150,105,0.3)' : '0 1px 2px rgba(0,0,0,0.05)'"
            [style.border]="activeTab === 'logs' ? 'none' : '1px solid #e5e7eb'"
            onmouseover="this.style.background='#047857';this.style.color='white';this.style.boxShadow='0 4px 12px rgba(5,150,105,0.3)'"
            onmouseout="this.style.background=(this.getAttribute('data-active') === 'logs') ? '#059669' : 'white';this.style.color=(this.getAttribute('data-active') === 'logs') ? 'white' : '#6b7280';this.style.boxShadow=(this.getAttribute('data-active') === 'logs') ? '0 4px 12px rgba(5,150,105,0.3)' : '0 1px 2px rgba(0,0,0,0.05)'">
            <span class="material-icons" style="font-size: 18px;">receipt_long</span> Delivery Logs
            <span *ngIf="notificationData.logs && notificationData.logs.length > 0" style="padding: 1px 8px; border-radius: 999px; font-size: 10px; font-weight: 800;"
              [style.background]="activeTab === 'logs' ? 'rgba(255,255,255,0.2)' : '#d1fae5'"
              [style.color]="activeTab === 'logs' ? 'white' : '#047857'">{{ notificationData.logs.length }}</span>
          </button>
        </div>

        <div *ngIf="activeTab === 'overview'">
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: start;">
            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                  <span class="material-icons" style="font-size: 18px; color: #047857;">notifications</span>
                  <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Notification Information</h2>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Notification Number</p>
                    <p style="font-size: 14px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ notificationData.notification_number }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Status</p>
                    <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                      [style.background]="getStatusBadgeStyle(notificationData.delivery_status).background" [style.color]="getStatusBadgeStyle(notificationData.delivery_status).color">
                      {{ getStatusLabel(notificationData.delivery_status) }}
                    </span>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Channel</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0; text-transform: capitalize;">{{ notificationData.channel }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Priority</p>
                    <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                      [style.background]="getPriorityBadgeStyle(notificationData.priority).background" [style.color]="getPriorityBadgeStyle(notificationData.priority).color">
                      {{ notificationData.priority | titlecase }}
                    </span>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Recipient Type</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0; text-transform: capitalize;">{{ notificationData.recipient_type }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Recipient ID</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ notificationData.recipient_id ? '#' + notificationData.recipient_id : '—' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Event Name</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ notificationData.event_name || '—' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Template</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ notificationData.template?.template_name || '—' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Scheduled At</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ notificationData.scheduled_at ? (notificationData.scheduled_at | date:'dd MMM yyyy, hh:mm a') : '—' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Sent At</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ notificationData.sent_at ? (notificationData.sent_at | date:'dd MMM yyyy, hh:mm a') : '—' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Read At</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ notificationData.read_at ? (notificationData.read_at | date:'dd MMM yyyy, hh:mm a') : '—' }}</p>
                  </div>
                  <div>
                    <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin: 0 0 4px 0;">Created At</p>
                    <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">{{ notificationData.created_at | date:'dd MMM yyyy, hh:mm a' }}</p>
                  </div>
                </div>
                <div *ngIf="notificationData.failure_reason" style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; font-weight: 700; color: #dc2626; margin: 0 0 4px 0;">Failure Reason</p>
                  <p style="font-size: 13px; color: #b91c1c; margin: 0;">{{ notificationData.failure_reason }}</p>
                </div>
              </div>

              <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                  <span class="material-icons" style="font-size: 18px; color: #047857;">schedule</span>
                  <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Status Timeline</h2>
                </div>
                <div style="border-left: 2px solid #e5e7eb; margin-left: 6px; padding-left: 20px;">
                  <div style="position: relative; padding-bottom: 16px;">
                    <div style="position: absolute; left: -27px; top: 2px; width: 12px; height: 12px; border-radius: 50%; background: #059669; border: 2px solid white; box-shadow: 0 0 0 2px #a7f3d0;"></div>
                    <p style="font-size: 13px; font-weight: 700; color: #1f2937; margin: 0;">Created</p>
                    <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">{{ notificationData.created_at | date:'dd MMM yyyy, hh:mm a' }}</p>
                  </div>
                  <div *ngIf="notificationData.scheduled_at" style="position: relative; padding-bottom: 16px;">
                    <div style="position: absolute; left: -27px; top: 2px; width: 12px; height: 12px; border-radius: 50%; background: #3b82f6; border: 2px solid white; box-shadow: 0 0 0 2px #bfdbfe;"></div>
                    <p style="font-size: 13px; font-weight: 700; color: #1f2937; margin: 0;">Scheduled</p>
                    <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">{{ notificationData.scheduled_at | date:'dd MMM yyyy, hh:mm a' }}</p>
                  </div>
                  <div *ngIf="notificationData.sent_at" style="position: relative; padding-bottom: 16px;">
                    <div style="position: absolute; left: -27px; top: 2px; width: 12px; height: 12px; border-radius: 50%; background: #059669; border: 2px solid white; box-shadow: 0 0 0 2px #a7f3d0;"></div>
                    <p style="font-size: 13px; font-weight: 700; color: #1f2937; margin: 0;">Sent</p>
                    <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">{{ notificationData.sent_at | date:'dd MMM yyyy, hh:mm a' }}</p>
                  </div>
                  <div *ngIf="notificationData.read_at" style="position: relative; padding-bottom: 16px;">
                    <div style="position: absolute; left: -27px; top: 2px; width: 12px; height: 12px; border-radius: 50%; background: #7c3aed; border: 2px solid white; box-shadow: 0 0 0 2px #ddd6fe;"></div>
                    <p style="font-size: 13px; font-weight: 700; color: #1f2937; margin: 0;">Read</p>
                    <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">{{ notificationData.read_at | date:'dd MMM yyyy, hh:mm a' }}</p>
                  </div>
                  <div *ngIf="notificationData.failure_reason" style="position: relative;">
                    <div style="position: absolute; left: -27px; top: 2px; width: 12px; height: 12px; border-radius: 50%; background: #dc2626; border: 2px solid white; box-shadow: 0 0 0 2px #fecaca;"></div>
                    <p style="font-size: 13px; font-weight: 700; color: #dc2626; margin: 0;">Failed</p>
                    <p style="font-size: 12px; color: #b91c1c; margin: 2px 0 0 0;">{{ notificationData.failure_reason }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                  <span class="material-icons" style="font-size: 18px; color: #047857;">mail</span>
                  <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Message Content</h2>
                </div>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  <div style="padding: 14px; border-radius: 12px; background: #f0fdf4; border: 1px solid #bbf7d0;">
                    <p style="font-size: 11px; font-weight: 600; color: #047857; margin: 0 0 4px 0;">Title</p>
                    <p style="font-size: 14px; font-weight: 700; color: #166534; margin: 0;">{{ notificationData.title }}</p>
                  </div>
                  <div style="padding: 14px; border-radius: 12px; background: #f9fafb; border: 1px solid #f3f4f6;">
                    <p style="font-size: 11px; font-weight: 600; color: #6b7280; margin: 0 0 4px 0;">Message</p>
                    <p style="font-size: 13px; color: #374151; margin: 0; white-space: pre-wrap;">{{ notificationData.message }}</p>
                  </div>
                  <div *ngIf="notificationData.payload" style="padding: 14px; border-radius: 12px; background: #f9fafb; border: 1px solid #f3f4f6;">
                    <p style="font-size: 11px; font-weight: 600; color: #6b7280; margin: 0 0 4px 0;">Payload</p>
                    <pre style="font-size: 11px; color: #6b7280; margin: 0; overflow: auto; max-height: 200px; font-family: monospace; white-space: pre-wrap;">{{ notificationData.payload | json }}</pre>
                  </div>
                </div>
              </div>

              <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                  <span class="material-icons" style="font-size: 18px; color: #047857;">bolt</span>
                  <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Quick Actions</h2>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <button (click)="setActiveTab('logs')"
                    style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                    onmouseover="this.style.borderColor='#a7f3d0'; this.style.background='#f0fdf4'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.background=''">
                    <span class="material-icons" style="font-size: 18px; color: #047857;">receipt_long</span> View Delivery Logs
                  </button>
                  <button *ngIf="notificationData.delivery_status === 'pending' || notificationData.delivery_status === 'queued'" (click)="cancelNotification()"
                    style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: 1px solid #fecaca; background: none; cursor: pointer; font-size: 13px; color: #dc2626; border-radius: 10px; transition: all 0.15s ease; text-align: left; box-sizing: border-box;"
                    onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''">
                    <span class="material-icons" style="font-size: 18px;">cancel</span> Cancel Notification
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="activeTab === 'logs'">
          <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden;">
            <div style="padding: 16px 20px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="font-size: 15px; font-weight: 700; color: #166534; margin: 0;">Delivery Logs</h2>
            </div>
            <div *ngIf="!notificationData.logs || notificationData.logs.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px;">
              <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 32px; color: #059669;">receipt_long</span>
              </div>
              <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No delivery logs</h3>
            </div>
            <div *ngIf="notificationData.logs && notificationData.logs.length > 0" style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead>
                  <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
                    <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Provider</th>
                    <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Provider Msg ID</th>
                    <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Status</th>
                    <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Sent At</th>
                    <th style="padding: 10px 16px 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; width: 100px;">Payloads</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of notificationData.logs; let i = index" style="border-bottom: 1px solid #f3f4f6; transition: background 0.1s ease;"
                    [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'"
                    onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=(this.getAttribute('data-idx') % 2 === 0) ? 'transparent' : '#f9fafb'">
                    <td [attr.data-idx]="i" style="padding: 12px 12px;"><span style="font-size: 13px; color: #374151;">{{ row.provider }}</span></td>
                    <td style="padding: 12px 12px;"><span style="font-size: 12px; color: #6b7280; font-family: monospace;">{{ row.provider_message_id || '—' }}</span></td>
                    <td style="padding: 12px 12px;">
                      <span style="display: inline-flex; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                        [style.background]="getStatusBadgeStyle(row.status).background" [style.color]="getStatusBadgeStyle(row.status).color">
                        {{ getStatusLabel(row.status) }}
                      </span>
                    </td>
                    <td style="padding: 12px 12px;"><span style="font-size: 12px; color: #9ca3af;">{{ row.sent_at ? (row.sent_at | date:'dd MMM yyyy, hh:mm a') : '—' }}</span></td>
                    <td style="padding: 12px 16px 12px 12px; text-align: center;">
                      <div style="display: flex; align-items: center; justify-content: center; gap: 2px;">
                        <button (click)="viewPayload(row.request_payload, 'Request')"
                          style="width: 32px; height: 32px; border: none; background: none; cursor: pointer; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: #059669; transition: all 0.15s ease; line-height: 0;"
                          onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px;">upload</span>
                        </button>
                        <button (click)="viewPayload(row.response_payload, 'Response')"
                          style="width: 32px; height: 32px; border: none; background: none; cursor: pointer; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: #6b7280; transition: all 0.15s ease; line-height: 0;"
                          onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
                          <span class="material-icons" style="font-size: 18px;">download</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
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
export class NotificationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private notificationApi = inject(NotificationApiService);
  private notification = inject(NotificationService);

  notificationData: Notification | null = null;
  loading = false;
  activeTab = 'overview';

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.loadNotification(uuid);
    }
  }

  loadNotification(uuid: string): void {
    this.loading = true;
    this.notificationApi.getNotification(uuid).subscribe({
      next: (res) => {
        this.notificationData = res.data!;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notification.error('Failed to load notification');
      },
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  cancelNotification(): void {
    if (!this.notificationData) return;
    if (!confirm('Are you sure you want to cancel this notification?')) return;
    this.notificationApi.cancelNotification(this.notificationData.uuid).subscribe({
      next: (res) => {
        this.notificationData = res.data!;
        this.notification.success('Notification cancelled');
      },
      error: () => { this.notification.error('Failed to cancel notification'); },
    });
  }

  viewPayload(payload: any, title: string): void {
    alert(`${title}:\n\n${JSON.stringify(payload, null, 2)}`);
  }

  getStatusLabel(status: string): string {
    const found = DELIVERY_STATUSES.find(s => s.value === status);
    return found ? found.label : status;
  }

  getStatusBadgeStyle(status: string): any {
    const styles: Record<string, any> = {
      pending: { background: '#f3f4f6', color: '#6b7280' },
      queued: { background: '#dbeafe', color: '#1d4ed8' },
      sent: { background: '#e0e7ff', color: '#4338ca' },
      delivered: { background: '#d1fae5', color: '#047857' },
      read: { background: '#ede9fe', color: '#6d28d9' },
      failed: { background: '#fee2e2', color: '#b91c1c' },
      cancelled: { background: '#f3f4f6', color: '#6b7280' },
    };
    return styles[status] || { background: '#f3f4f6', color: '#6b7280' };
  }

  getPriorityBadgeStyle(priority: string): any {
    const styles: Record<string, any> = {
      low: { background: '#f3f4f6', color: '#6b7280' },
      normal: { background: '#dbeafe', color: '#1d4ed8' },
      high: { background: '#fef3c7', color: '#b45309' },
      critical: { background: '#fee2e2', color: '#b91c1c' },
    };
    return styles[priority] || { background: '#f3f4f6', color: '#6b7280' };
  }
}
