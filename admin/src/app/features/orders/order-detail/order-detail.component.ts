import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderApiService } from '../../../core/services/order-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Order } from '../../../core/models/order/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading order details...</p>
      </div>
    </div>

    <div *ngIf="!loading && order" style="animation: fadeIn 0.3s ease-out;">
      <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
        <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
          <a routerLink="/admin/orders" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
            onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
            <span class="material-icons" style="font-size: 16px;">arrow_back</span>
            Back to Orders
          </a>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0;">{{ order.order_number_display || order.order_number }}</h1>
              <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;"
                [style]="getStatusBadgeStyle(order.order_status)">
                {{ formatStatus(order.order_status) }}
              </span>
            </div>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">
              {{ order.customer_name || 'Unknown Customer' }}
              &bull; {{ order.order_type | titlecase }} Order
              &bull; {{ order.order_date | date:'mediumDate' }}
            </p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 20px;">
            <button (click)="duplicateOrder()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">content_copy</span> Duplicate
            </button>
            <button *ngIf="order.order_status === 'pending'" (click)="confirmOrder()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">check_circle</span> Confirm
            </button>
            <button *ngIf="order.order_status === 'confirmed'" (click)="prepareOrder()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">restaurant</span> Start Preparing
            </button>
            <button *ngIf="order.order_status === 'preparing'" (click)="readyOrder()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">check_circle_outline</span> Mark Ready
            </button>
            <button *ngIf="order.order_status === 'ready'" (click)="dispatchOrder()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">local_shipping</span> Dispatch
            </button>
            <button *ngIf="order.order_status === 'out_for_delivery'" (click)="deliverOrder()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">task_alt</span> Mark Delivered
            </button>
            <button *ngIf="order.order_status !== 'cancelled' && order.order_status !== 'delivered' && order.order_status !== 'completed' && order.order_status !== 'refunded'" (click)="cancelOrder()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(220,38,38,0.3)'; this.style.borderColor='rgba(220,38,38,0.4)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'; this.style.borderColor='rgba(255,255,255,0.2)'">
              <span class="material-icons" style="font-size: 18px;">cancel</span> Cancel
            </button>
            <button *ngIf="order.order_status === 'cancelled' || order.order_status === 'delivered' || order.order_status === 'completed'" (click)="refundOrder()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(234,88,12,0.3)'; this.style.borderColor='rgba(234,88,12,0.4)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'; this.style.borderColor='rgba(255,255,255,0.2)'">
              <span class="material-icons" style="font-size: 18px;">refund</span> Refund
            </button>
            <button (click)="restoreOrder()"
              style="padding: 8px 16px; background: rgba(255,255,255,0.15); color: white; font-weight: 600; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
              <span class="material-icons" style="font-size: 18px;">restore</span> Restore
            </button>
            <button (click)="deleteOrder()"
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
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; display: flex; align-items: center; gap: 12px;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow=''">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #dbeafe; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #2563eb;">receipt</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; margin: 0 0 2px 0;">Order Type</p>
              <p style="font-size: 16px; font-weight: 800; color: #166534; margin: 0;">{{ order.order_type | titlecase }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; display: flex; align-items: center; gap: 12px;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow=''">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #059669;">payments</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; margin: 0 0 2px 0;">Total Amount</p>
              <p style="font-size: 16px; font-weight: 800; color: #166534; margin: 0;">{{ order.total_amount | currency:'INR':'symbol':'1.2-2' }}</p>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; display: flex; align-items: center; gap: 12px;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow=''">
            <div style="width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center;"
              [style.background]="order.payment_status === 'paid' ? '#d1fae5' : '#fef2f2'">
              <span class="material-icons" style="font-size: 20px;"
                [style.color]="order.payment_status === 'paid' ? '#059669' : '#dc2626'">account_balance_wallet</span>
            </div>
            <div style="flex: 1;">
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; margin: 0 0 2px 0;">Payment</p>
              <p style="font-size: 16px; font-weight: 800; margin: 0;" [style.color]="getPaymentStatusTextClass(order.payment_status)">{{ order.payment_status | titlecase }}</p>
            </div>
            <div style="position: relative;">
              <button (click)="togglePaymentMenu()"
                style="width: 32px; height: 32px; border: none; background: none; cursor: pointer; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: #9ca3af; transition: all 0.15s ease; line-height: 0;"
                onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background=''">
                <span class="material-icons" style="font-size: 18px;">edit</span>
              </button>
              <div *ngIf="showPaymentMenu" style="position: absolute; right: 0; top: 100%; z-index: 50; background: white; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 10px 40px rgba(0,0,0,0.12); min-width: 160px; padding: 6px; margin-top: 4px; animation: fadeIn 0.1s ease-out;">
                <button (click)="updatePaymentStatus('paid'); togglePaymentMenu()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                  onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #059669;">check_circle</span> Paid
                </button>
                <button (click)="updatePaymentStatus('pending'); togglePaymentMenu()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                  onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #d97706;">pending</span> Pending
                </button>
                <button (click)="updatePaymentStatus('failed'); togglePaymentMenu()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                  onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #dc2626;">error</span> Failed
                </button>
                <button (click)="updatePaymentStatus('refunded'); togglePaymentMenu()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                  onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #3b82f6;">undo</span> Refunded
                </button>
                <button (click)="updatePaymentStatus('partial_refund'); togglePaymentMenu()"
                  style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border: none; background: none; cursor: pointer; font-size: 13px; color: #374151; border-radius: 8px; text-align: left; transition: background 0.1s ease;"
                  onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''">
                  <span class="material-icons" style="font-size: 18px; color: #f97316;">remove_circle</span> Partial Refund
                </button>
              </div>
            </div>
          </div>
          <div style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px; display: flex; align-items: center; gap: 12px;"
            onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)'" onmouseout="this.style.boxShadow=''">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #dbeafe; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #2563eb;">local_shipping</span>
            </div>
            <div>
              <p style="font-size: 11px; font-weight: 600; color: #9ca3af; margin: 0 0 2px 0;">Delivery Date</p>
              <p style="font-size: 16px; font-weight: 800; color: #166534; margin: 0;">{{ order.delivery_date | date:'mediumDate' }}</p>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;">
          <button (click)="activeTab = 'info'"
            style="padding: 8px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; border: 1.5px solid;"
            [style.background]="activeTab === 'info' ? '#059669' : 'white'"
            [style.color]="activeTab === 'info' ? 'white' : '#374151'"
            [style.borderColor]="activeTab === 'info' ? '#059669' : '#e5e7eb'"
            onmouseover="this.style.borderColor='#059669'" onmouseout="this.style.borderColor=this.getAttribute('data-bc')"
            [attr.data-bc]="activeTab === 'info' ? '#059669' : '#e5e7eb'">Order Info</button>
          <button (click)="activeTab = 'history'"
            style="padding: 8px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; border: 1.5px solid;"
            [style.background]="activeTab === 'history' ? '#059669' : 'white'"
            [style.color]="activeTab === 'history' ? 'white' : '#374151'"
            [style.borderColor]="activeTab === 'history' ? '#059669' : '#e5e7eb'"
            onmouseover="this.style.borderColor='#059669'" onmouseout="this.style.borderColor=this.getAttribute('data-bc')"
            [attr.data-bc]="activeTab === 'history' ? '#059669' : '#e5e7eb'">Status History</button>
          <button (click)="activeTab = 'cancellations'"
            style="padding: 8px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; border: 1.5px solid;"
            [style.background]="activeTab === 'cancellations' ? '#059669' : 'white'"
            [style.color]="activeTab === 'cancellations' ? 'white' : '#374151'"
            [style.borderColor]="activeTab === 'cancellations' ? '#059669' : '#e5e7eb'"
            onmouseover="this.style.borderColor='#059669'" onmouseout="this.style.borderColor=this.getAttribute('data-bc')"
            [attr.data-bc]="activeTab === 'cancellations' ? '#059669' : '#e5e7eb'">Cancellations</button>
          <button (click)="activeTab = 'refunds'"
            style="padding: 8px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; border: 1.5px solid;"
            [style.background]="activeTab === 'refunds' ? '#059669' : 'white'"
            [style.color]="activeTab === 'refunds' ? 'white' : '#374151'"
            [style.borderColor]="activeTab === 'refunds' ? '#059669' : '#e5e7eb'"
            onmouseover="this.style.borderColor='#059669'" onmouseout="this.style.borderColor=this.getAttribute('data-bc')"
            [attr.data-bc]="activeTab === 'refunds' ? '#059669' : '#e5e7eb'">Refunds</button>
        </div>

        <div *ngIf="activeTab === 'info'" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start;">
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #3b82f6;">person</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Customer Info</h2>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                  <p style="font-size: 11px; font-weight: 600; color: #9ca3af; margin: 0 0 4px 0;">Customer Name</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ order.customer_name || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; color: #9ca3af; margin: 0 0 4px 0;">Email</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ order.customer_email || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; color: #9ca3af; margin: 0 0 4px 0;">Phone</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ order.customer_phone || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; color: #9ca3af; margin: 0 0 4px 0;">Customer ID</p>
                  <p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">#{{ order.customer_id }}</p>
                </div>
              </div>
            </div>

            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #059669;">info</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Order Info</h2>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                  <p style="font-size: 11px; font-weight: 600; color: #9ca3af; margin: 0 0 4px 0;">Order Number</p>
                  <p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ order.order_number_display || order.order_number }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; color: #9ca3af; margin: 0 0 4px 0;">Order Type</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ order.order_type | titlecase }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; color: #9ca3af; margin: 0 0 4px 0;">Kitchen</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ order.kitchen_name || 'All Kitchens' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; color: #9ca3af; margin: 0 0 4px 0;">Delivery Slot</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ order.delivery_slot || '-' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; color: #9ca3af; margin: 0 0 4px 0;">Order Date</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ order.order_date | date:'medium' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; color: #9ca3af; margin: 0 0 4px 0;">Delivery Date</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ order.delivery_date | date:'medium' }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; color: #9ca3af; margin: 0 0 4px 0;">Payment Method</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ (order.payment_method || '-') | titlecase }}</p>
                </div>
                <div>
                  <p style="font-size: 11px; font-weight: 600; color: #9ca3af; margin: 0 0 4px 0;">Kitchen ID</p>
                  <p style="font-size: 13px; font-weight: 600; font-family: monospace; color: #1f2937; margin: 0;">{{ order.kitchen_id || '-' }}</p>
                </div>
              </div>
              <div *ngIf="order.subscription_number" style="margin-top: 12px;">
                <p style="font-size: 11px; font-weight: 600; color: #9ca3af; margin: 0 0 4px 0;">Subscription</p>
                <a [routerLink]="['/admin/customer-subscriptions', order.subscription_id]" style="font-size: 13px; font-weight: 600; color: #059669; text-decoration: none;"
                  onmouseover="this.style.color='#047857'" onmouseout="this.style.color='#059669'">{{ order.subscription_number }}</a>
              </div>
              <div *ngIf="order.delivery_instruction" style="margin-top: 12px;">
                <p style="font-size: 11px; font-weight: 600; color: #9ca3af; margin: 0 0 4px 0;">Delivery Instructions</p>
                <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ order.delivery_instruction }}</p>
              </div>
              <div *ngIf="order.notes" style="margin-top: 12px;">
                <p style="font-size: 11px; font-weight: 600; color: #9ca3af; margin: 0 0 4px 0;">Notes</p>
                <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ order.notes }}</p>
              </div>
            </div>

            <div *ngIf="order.order_items && order.order_items.length > 0" style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #8b5cf6;">restaurant_menu</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Order Items</h2>
              </div>
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                  <thead>
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                      <th style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Meal</th>
                      <th style="padding: 10px 12px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Qty</th>
                      <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Unit Price</th>
                      <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Tax</th>
                      <th style="padding: 10px 12px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of order.order_items; let i = index" style="border-bottom: 1px solid #f3f4f6;"
                      [style.background]="i % 2 === 0 ? 'transparent' : '#f9fafb'">
                      <td style="padding: 10px 12px;">
                        <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ item.meal_name }}</span>
                      </td>
                      <td style="padding: 10px 12px; text-align: center;">
                        <span style="font-size: 13px; color: #6b7280;">{{ item.quantity }}</span>
                      </td>
                      <td style="padding: 10px 12px; text-align: right;">
                        <span style="font-size: 13px; color: #6b7280;">{{ item.unit_price | currency:'INR':'symbol':'1.2-2' }}</span>
                      </td>
                      <td style="padding: 10px 12px; text-align: right;">
                        <span style="font-size: 13px; color: #6b7280;">{{ item.tax | currency:'INR':'symbol':'1.2-2' }}</span>
                      </td>
                      <td style="padding: 10px 12px; text-align: right;">
                        <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ item.total | currency:'INR':'symbol':'1.2-2' }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style="height: 1px; background: #f3f4f6; margin: 16px 0;"></div>
              <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 16px;">
                  <span style="font-size: 13px; color: #9ca3af;">Subtotal:</span>
                  <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ order.subtotal | currency:'INR':'symbol':'1.2-2' }}</span>
                </div>
                <div *ngIf="order.discount_amount && order.discount_amount !== '0.00'" style="display: flex; align-items: center; gap: 16px;">
                  <span style="font-size: 13px; color: #9ca3af;">Discount:</span>
                  <span style="font-size: 13px; font-weight: 700; color: #dc2626;">-{{ order.discount_amount | currency:'INR':'symbol':'1.2-2' }}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 16px;">
                  <span style="font-size: 13px; color: #9ca3af;">Tax:</span>
                  <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ order.tax_amount | currency:'INR':'symbol':'1.2-2' }}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 16px;">
                  <span style="font-size: 13px; color: #9ca3af;">Delivery:</span>
                  <span style="font-size: 13px; font-weight: 700; color: #1f2937;">{{ order.delivery_charge | currency:'INR':'symbol':'1.2-2' }}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 16px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                  <span style="font-size: 15px; font-weight: 800; color: #1f2937;">Total:</span>
                  <span style="font-size: 15px; font-weight: 800; color: #059669;">{{ order.total_amount | currency:'INR':'symbol':'1.2-2' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
                <span class="material-icons" style="font-size: 18px; color: #6b7280;">history</span>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Audit</h2>
              </div>
              <div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Created At</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ order.created_at | date:'medium' }}</p>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Updated At</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ order.updated_at | date:'medium' }}</p>
                </div>
                <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Created By</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ order.created_by_name || '-' }}</p>
                </div>
                <div style="padding: 10px 0;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0 0 2px 0;">Updated By</p>
                  <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ order.updated_by_name || '-' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="activeTab === 'history'">
          <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
            <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 16px 0;">Status History</h2>
            <div *ngIf="order.status_history && order.status_history.length > 0">
              <div *ngFor="let history of order.status_history" style="padding: 12px; border-radius: 8px; background: #f9fafb; border: 1px solid #f3f4f6; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="display: inline-flex; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700;"
                      [className]="getStatusClass(history.from_status)">{{ formatStatus(history.from_status) }}</span>
                    <span class="material-icons" style="font-size: 14px; color: #9ca3af;">arrow_forward</span>
                    <span style="display: inline-flex; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700;"
                      [className]="getStatusClass(history.to_status)">{{ formatStatus(history.to_status) }}</span>
                  </div>
                  <span style="font-size: 11px; color: #9ca3af;">{{ history.created_at | date:'short' }}</span>
                </div>
                <p *ngIf="history.changed_by_name" style="font-size: 11px; color: #9ca3af; margin: 0;">By: {{ history.changed_by_name }}</p>
                <p *ngIf="history.reason" style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0; font-style: italic;">{{ history.reason }}</p>
              </div>
            </div>
            <div *ngIf="!order.status_history || order.status_history.length === 0" style="display: flex; flex-direction: column; align-items: center; padding: 32px;">
              <span class="material-icons" style="font-size: 32px; color: #d1d5db; margin-bottom: 8px;">history</span>
              <p style="font-size: 13px; color: #9ca3af; margin: 0;">No status history</p>
            </div>
          </div>
        </div>

        <div *ngIf="activeTab === 'cancellations'">
          <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
            <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 16px 0;">Cancellations</h2>
            <div *ngIf="order.cancellations && order.cancellations.length > 0">
              <div *ngFor="let cancel of order.cancellations" style="padding: 12px; border-radius: 8px; background: #fef2f2; border: 1px solid #fecaca; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <span style="display: inline-flex; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; background: #fecaca; color: #b91c1c;">Cancelled</span>
                  <span style="font-size: 11px; color: #9ca3af;">{{ cancel.created_at | date:'short' }}</span>
                </div>
                <p style="font-size: 13px; font-weight: 600; color: #1f2937; margin: 0;">{{ cancel.cancellation_reason }}</p>
                <p *ngIf="cancel.cancelled_by_name" style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0;">By: {{ cancel.cancelled_by_name }}</p>
              </div>
            </div>
            <div *ngIf="!order.cancellations || order.cancellations.length === 0" style="display: flex; flex-direction: column; align-items: center; padding: 32px;">
              <span class="material-icons" style="font-size: 32px; color: #d1d5db; margin-bottom: 8px;">cancel</span>
              <p style="font-size: 13px; color: #9ca3af; margin: 0;">No cancellations</p>
            </div>
          </div>
        </div>

        <div *ngIf="activeTab === 'refunds'">
          <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px;">
            <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 16px 0;">Refunds</h2>
            <div *ngIf="order.refunds && order.refunds.length > 0">
              <div *ngFor="let refund of order.refunds" style="padding: 12px; border-radius: 8px; background: #eff6ff; border: 1px solid #bfdbfe; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <span style="display: inline-flex; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700;"
                    [style.background]="refund.refund_status === 'completed' ? '#d1fae5' : '#fef3c7'"
                    [style.color]="refund.refund_status === 'completed' ? '#047857' : '#b45309'">
                    {{ refund.refund_status | titlecase }}
                  </span>
                  <span style="font-size: 11px; color: #9ca3af;">{{ refund.created_at | date:'short' }}</span>
                </div>
                <p style="font-size: 13px; font-weight: 700; color: #1f2937; margin: 0;">{{ refund.refund_amount | currency:'INR':'symbol':'1.2-2' }}</p>
                <p style="font-size: 11px; color: #9ca3af; margin: 2px 0 0 0;">{{ refund.refund_method | titlecase }}</p>
                <p *ngIf="refund.refund_reason" style="font-size: 11px; color: #9ca3af; margin: 4px 0 0 0; font-style: italic;">{{ refund.refund_reason }}</p>
              </div>
            </div>
            <div *ngIf="!order.refunds || order.refunds.length === 0" style="display: flex; flex-direction: column; align-items: center; padding: 32px;">
              <span class="material-icons" style="font-size: 32px; color: #d1d5db; margin-bottom: 8px;">refund</span>
              <p style="font-size: 13px; color: #9ca3af; margin: 0;">No refunds</p>
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
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderApi = inject(OrderApiService);
  private notification = inject(NotificationService);

  order: Order | null = null;
  loading = true;
  activeTab = 'info';
  showPaymentMenu = false;

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) { this.loadOrder(uuid); }
  }

  loadOrder(uuid: string): void {
    this.orderApi.getOrder(uuid).subscribe({
      next: (res) => {
        this.order = res.data ?? null;
        this.loading = false;
      },
      error: () => { this.notification.error('Failed to load order'); this.router.navigate(['/admin/orders']); },
    });
  }

  togglePaymentMenu(): void {
    this.showPaymentMenu = !this.showPaymentMenu;
  }

  getStatusBadgeStyle(status: string): string {
    switch (status) {
      case 'pending': return 'background: #fef3c7; color: #b45309;';
      case 'confirmed': return 'background: #dbeafe; color: #1d4ed8;';
      case 'preparing': return 'background: #f3e8ff; color: #7c3aed;';
      case 'ready': return 'background: #e0e7ff; color: #4338ca;';
      case 'out_for_delivery': return 'background: #ffedd5; color: #c2410c;';
      case 'delivered': return 'background: #d1fae5; color: #047857;';
      case 'completed': return 'background: #dcfce7; color: #15803d;';
      case 'cancelled': return 'background: #fef2f2; color: #b91c1c;';
      case 'refunded': return 'background: #ffe4e6; color: #be123c;';
      default: return 'background: #f3f4f6; color: #6b7280;';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'preparing': return 'bg-purple-100 text-purple-700';
      case 'ready': return 'bg-indigo-100 text-indigo-700';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-700';
      case 'delivered': return 'bg-emerald-100 text-emerald-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'refunded': return 'bg-rose-100 text-rose-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getPaymentStatusTextClass(status: string): string {
    switch (status) {
      case 'paid': return '#059669';
      case 'pending': return '#d97706';
      case 'failed': return '#dc2626';
      case 'refunded': return '#2563eb';
      case 'partial_refund': return '#ea580c';
      default: return '#6b7280';
    }
  }

  updatePaymentStatus(status: string): void {
    if (!this.order) return;
    this.orderApi.updatePaymentStatus(this.order.uuid, status).subscribe({
      next: (res) => {
        this.order = res.data ?? this.order;
        this.notification.success('Payment status updated to ' + status);
      },
      error: () => this.notification.error('Failed to update payment status'),
    });
  }

  formatStatus(status: string): string {
    return (status || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  confirmOrder(): void {
    if (!this.order) return;
    if (window.confirm('Confirm this order?')) {
      this.orderApi.confirmOrder(this.order.uuid).subscribe({
        next: () => { this.notification.success('Order confirmed'); this.loadOrder(this.order!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  prepareOrder(): void {
    if (!this.order) return;
    if (window.confirm('Start preparing this order?')) {
      this.orderApi.prepareOrder(this.order.uuid).subscribe({
        next: () => { this.notification.success('Order preparing'); this.loadOrder(this.order!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  readyOrder(): void {
    if (!this.order) return;
    if (window.confirm('Mark this order as ready?')) {
      this.orderApi.readyOrder(this.order.uuid).subscribe({
        next: () => { this.notification.success('Order ready'); this.loadOrder(this.order!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  dispatchOrder(): void {
    if (!this.order) return;
    if (window.confirm('Dispatch this order?')) {
      this.orderApi.dispatchOrder(this.order.uuid).subscribe({
        next: () => { this.notification.success('Order dispatched'); this.loadOrder(this.order!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deliverOrder(): void {
    if (!this.order) return;
    if (window.confirm('Mark this order as delivered?')) {
      this.orderApi.deliverOrder(this.order.uuid).subscribe({
        next: () => { this.notification.success('Order delivered'); this.loadOrder(this.order!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  cancelOrder(): void {
    if (!this.order) return;
    const reason = prompt('Cancellation reason:');
    if (reason === null) return;
    this.orderApi.cancelOrder(this.order.uuid, { cancellation_reason: reason || 'Cancelled by admin' }).subscribe({
      next: () => { this.notification.success('Order cancelled'); this.loadOrder(this.order!.uuid); },
      error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
    });
  }

  refundOrder(): void {
    if (!this.order) return;
    const amount = prompt('Refund amount:');
    if (amount === null) return;
    this.orderApi.refundOrder(this.order.uuid, {
      refund_amount: amount,
      refund_method: 'wallet',
      refund_reason: 'Admin initiated refund',
    }).subscribe({
      next: () => { this.notification.success('Order refunded'); this.loadOrder(this.order!.uuid); },
      error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
    });
  }

  duplicateOrder(): void {
    if (!this.order) return;
    if (window.confirm('Duplicate this order?')) {
      this.orderApi.duplicateOrder(this.order.uuid).subscribe({
        next: () => { this.notification.success('Order duplicated'); this.router.navigate(['/admin/orders']); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  deleteOrder(): void {
    if (!this.order) return;
    if (window.confirm('Delete this order? This action cannot be undone.')) {
      this.orderApi.deleteOrder(this.order.uuid).subscribe({
        next: () => { this.notification.success('Order deleted'); this.router.navigate(['/admin/orders']); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }

  restoreOrder(): void {
    if (!this.order) return;
    if (window.confirm('Restore this order?')) {
      this.orderApi.restoreOrder(this.order.uuid).subscribe({
        next: () => { this.notification.success('Order restored'); this.loadOrder(this.order!.uuid); },
        error: (err) => this.notification.error(err.error?.message || 'Operation failed'),
      });
    }
  }
}
