import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationApiService } from '../../../../core/services/notification-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  NOTIFICATION_CHANNELS, NOTIFICATION_PRIORITIES
} from '../../../../core/models/notification/notification.model';

@Component({
  selector: 'app-broadcast-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 40px 32px 72px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 900px; margin: 0 auto; position: relative; z-index: 2;">
        <a routerLink="/admin/notifications" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.8); text-decoration: none; margin-bottom: 16px; transition: color 0.2s ease;"
          onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,0.8)'">
          <span class="material-icons" style="font-size: 16px;">arrow_back</span>
          Back to Notifications
        </a>
        <h1 style="font-size: 26px; font-weight: 800; color: white; margin: 0 0 4px 0;">Send Broadcast</h1>
        <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Send a message to multiple recipients</p>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 900px; margin: -40px auto 60px; padding: 0 24px; position: relative; z-index: 3;">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 28px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #d1fae5; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="font-size: 20px; color: #047857;">campaign</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0;">Broadcast Details</h2>
              <p style="font-size: 12px; color: #9ca3af; margin: 2px 0 0 0;">Compose and schedule your broadcast message</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Title <span style="color: #dc2626;">*</span></label>
              <input formControlName="title" placeholder="Broadcast title"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                [style.borderColor]="form.get('title')?.invalid && form.get('title')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <p *ngIf="form.get('title')?.invalid && form.get('title')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Title is required</p>
            </div>
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Message <span style="color: #dc2626;">*</span></label>
              <textarea formControlName="message" rows="5" placeholder="Broadcast message content..."
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; resize: vertical;"
                [style.borderColor]="form.get('message')?.invalid && form.get('message')?.touched ? '#dc2626' : '#e5e7eb'"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
              <p *ngIf="form.get('message')?.invalid && form.get('message')?.touched" style="font-size: 11px; color: #dc2626; margin: 4px 0 0 0;">Message is required</p>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Channel <span style="color: #dc2626;">*</span></label>
              <select formControlName="channel"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option *ngFor="let ch of channels" [value]="ch.value">{{ ch.label }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Priority <span style="color: #dc2626;">*</span></label>
              <select formControlName="priority"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option *ngFor="let p of priorities" [value]="p.value">{{ p.label }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Recipient Type <span style="color: #dc2626;">*</span></label>
              <select formControlName="recipient_type"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';">
                <option value="all">All Customers</option>
                <option value="active_subscribers">Active Subscribers</option>
                <option value="specific">Specific Recipients</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">Schedule (optional)</label>
              <input type="date" formControlName="scheduled_at"
                style="width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; cursor: pointer; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
          </div>

          <div *ngIf="form.get('recipient_type')?.value === 'specific'" style="margin-top: 20px; padding: 16px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; animation: fadeIn 0.2s ease-out;">
            <h3 style="font-size: 13px; font-weight: 700; color: #374151; margin: 0 0 12px 0;">Select Recipients</h3>
            <div style="position: relative; margin-bottom: 12px;">
              <span class="material-icons" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 18px; color: #9ca3af; pointer-events: none;">search</span>
              <input type="text" [value]="recipientSearch" (input)="recipientSearch = $event.target.value" placeholder="Search by name, email, or phone..."
                style="width: 100%; padding: 9px 14px 9px 38px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #374151; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669';this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)';this.style.background='white'" onblur="this.style.borderColor='#e5e7eb';this.style.boxShadow='';this.style.background='#f9fafb'" />
            </div>
            <div style="max-height: 240px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px;">
              <label *ngFor="let recipient of filteredRecipients" style="display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; cursor: pointer; transition: background 0.1s ease;"
                onmouseover="this.style.background='white'" onmouseout="this.style.background=''">
                <input type="checkbox" [checked]="selectedRecipients.has(recipient.id)" (change)="toggleRecipient(recipient.id)"
                  style="width: 16px; height: 16px; accent-color: #059669; cursor: pointer; margin: 0;" />
                <span style="font-size: 13px; color: #374151;">{{ recipient.name }}</span>
                <span style="font-size: 12px; color: #9ca3af;">{{ recipient.email || recipient.phone }}</span>
              </label>
              <p *ngIf="filteredRecipients.length === 0" style="font-size: 13px; color: #9ca3af; text-align: center; padding: 16px 0; margin: 0;">No recipients found</p>
            </div>
            <p style="font-size: 12px; color: #9ca3af; margin: 10px 0 0 0;">{{ selectedRecipients.size }} recipient(s) selected</p>
          </div>
        </div>

        <div style="position: sticky; bottom: 16px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">Fields marked with * are required</p>
          <div style="display: flex; align-items: center; gap: 10px;">
            <a routerLink="/admin/notifications"
              style="padding: 10px 20px; background: white; color: #374151; font-weight: 600; border-radius: 10px; font-size: 13px; cursor: pointer; text-decoration: none; border: 1.5px solid #e5e7eb; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;"
              onmouseover="this.style.borderColor='#059669'; this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#374151'">
              Cancel
            </a>
            <button type="submit" [disabled]="form.invalid || sending"
              style="padding: 10px 28px; background: #059669; color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(5,150,105,0.3);"
              [style.opacity]="form.invalid || sending ? '0.5' : '1'"
              [style.cursor]="form.invalid || sending ? 'not-allowed' : 'pointer'"
              onmouseover="if(!this.disabled){this.style.background='#047857';this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 16px rgba(5,150,105,0.4)'}"
              onmouseout="if(!this.disabled){this.style.background='#059669';this.style.transform='';this.style.boxShadow='0 4px 12px rgba(5,150,105,0.3)'}">
              <span *ngIf="sending" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block;"></span>
              Send Broadcast
            </button>
          </div>
        </div>
      </form>
    </section>

    <style>
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
    </style>
  `,
})
export class BroadcastFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private notificationApi = inject(NotificationApiService);
  private notification = inject(NotificationService);

  form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    message: ['', Validators.required],
    channel: ['push', Validators.required],
    priority: ['normal', Validators.required],
    recipient_type: ['all', Validators.required],
    scheduled_at: [null],
  });

  channels = NOTIFICATION_CHANNELS;
  priorities = NOTIFICATION_PRIORITIES;
  sending = false;
  recipientSearch = '';

  allRecipients: any[] = [];
  selectedRecipients = new Set<number>();

  get filteredRecipients(): any[] {
    if (!this.recipientSearch) return this.allRecipients;
    const search = this.recipientSearch.toLowerCase();
    return this.allRecipients.filter(r =>
      r.name?.toLowerCase().includes(search) ||
      r.email?.toLowerCase().includes(search) ||
      r.phone?.includes(search)
    );
  }

  ngOnInit(): void {}

  toggleRecipient(id: number): void {
    if (this.selectedRecipients.has(id)) {
      this.selectedRecipients.delete(id);
    } else {
      this.selectedRecipients.add(id);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.sending = true;

    const formValue = { ...this.form.value };
    if (formValue.scheduled_at) {
      formValue.scheduled_at = String(formValue.scheduled_at).split('T')[0];
    }
    if (formValue.recipient_type === 'specific') {
      formValue.recipient_ids = Array.from(this.selectedRecipients);
    }

    this.notificationApi.broadcastMessage(formValue).subscribe({
      next: () => {
        this.notification.success('Broadcast sent successfully');
        this.router.navigate(['/admin/notifications/list']);
      },
      error: () => {
        this.sending = false;
        this.notification.error('Failed to send broadcast');
      },
    });
  }
}
