import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { SettingsApiService } from '../../../../core/services/settings-api.service';
import { SystemSetting } from '../../../../core/models/setting/system-setting.model';

@Component({
  selector: 'app-notification-config',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 48px 32px 80px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
        <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.75); margin-bottom: 16px;">
          <a routerLink="/admin/settings" style="color: rgba(255,255,255,0.75); text-decoration: none;">Settings</a>
          <span style="font-size: 10px;">&#9654;</span>
          <span style="color: white; font-weight: 500;">Notification Config</span>
        </div>
        <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0 0 6px 0;">
          <span class="material-icons" style="font-size: 24px; vertical-align: middle; margin-right: 8px;">notifications</span>
          Notification Config
        </h1>
        <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Configure email, SMS, and push notification providers</p>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 1200px; margin: -40px auto 0; padding: 0 24px; position: relative; z-index: 3; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
      <div *ngFor="let stat of stats; let i = index" [style]="'background: white; border-radius: 16px; padding: 20px; border: 1px solid #e5e7eb; display: flex; align-items: center; gap: 14px; transition: all 0.3s ease; animation: fadeSlideUp 0.5s ease-out ' + (0.1 + i * 0.08) + 's both; box-shadow: 0 1px 3px rgba(0,0,0,0.04);'"
           onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(5,150,105,0.1)'; this.style.borderColor='#a7f3d0';"
           onmouseout="this.style.transform=''; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)'; this.style.borderColor='#e5e7eb';">
        <div [style]="'width: 44px; height: 44px; background: ' + stat.bg + '; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;'">
          <span class="material-icons" [style]="'font-size: 22px; color: ' + stat.color + ';'">{{ stat.icon }}</span>
        </div>
        <div>
          <div style="font-size: 20px; font-weight: 800; color: #166534; line-height: 1.2;">{{ stat.value }}</div>
          <div style="font-size: 12px; color: #9ca3af; font-weight: 500;">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <section style="max-width: 1200px; margin: 24px auto 60px; padding: 0 24px;">
      <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; padding: 80px 0;">
        <div style="width: 36px; height: 36px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
      </div>

      <div *ngIf="!loading" style="max-width: 900px;">

        <!-- Tab bar -->
        <div style="display: flex; gap: 4px; background: white; border-radius: 16px 16px 0 0; border: 1px solid #e5e7eb; border-bottom: none; padding: 6px 6px 0; overflow-x: auto;">
          <button *ngFor="let tab of tabs" type="button" (click)="activeTab = tab.id"
            [style.background]="activeTab === tab.id ? 'white' : 'transparent'" [style.color]="activeTab === tab.id ? '#059669' : '#6b7280'" [style.boxShadow]="activeTab === tab.id ? '0 -2px 8px rgba(5,150,105,0.08)' : 'none'"
            style="display: flex; align-items: center; gap: 8px; padding: 12px 20px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; border-radius: 12px 12px 0 0; transition: all 0.2s ease;">
            <span class="material-icons" style="font-size: 18px;">{{ tab.icon }}</span>
            {{ tab.label }}
          </button>
        </div>

        <!-- Email tab -->
        <div *ngIf="activeTab === 'email'" style="background: white; border-radius: 0 0 16px 16px; border: 1px solid #e5e7eb; padding: 28px;">
          <form [formGroup]="emailForm" (ngSubmit)="saveTab('email')">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
              <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #dbeafe, #bfdbfe); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="color: #2563eb; font-size: 20px;">mail</span>
              </div>
              <div>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 2px 0;">SMTP Configuration</h2>
                <p style="font-size: 13px; color: #9ca3af; margin: 0;">Outgoing mail server settings</p>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">SMTP Host</label>
                <input formControlName="smtp_host" placeholder="smtp.gmail.com"
                  style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              </div>
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">SMTP Port</label>
                <input formControlName="smtp_port" placeholder="587"
                  style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              </div>
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">SMTP Username</label>
                <input formControlName="smtp_username" placeholder="your@email.com"
                  style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              </div>
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">SMTP Password</label>
                <div style="position: relative;">
                  <input formControlName="smtp_password" placeholder="Enter SMTP password"
                    [type]="showSmtpPassword ? 'text' : 'password'"
                    style="width: 100%; padding: 12px 16px; padding-right: 44px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                    onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                    onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
                  <button type="button" (click)="showSmtpPassword = !showSmtpPassword"
                    style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center; color: #9ca3af; transition: color 0.2s ease;"
                    onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">
                    <span class="material-icons" style="font-size: 20px;">{{ showSmtpPassword ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
              </div>
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">From Address</label>
                <input formControlName="mail_from_address" placeholder="noreply@yourdomain.com"
                  style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              </div>
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">From Name</label>
                <input formControlName="mail_from_name" placeholder="Your App Name"
                  style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              </div>
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: 24px; padding-top: 20px; border-top: 1px solid #f3f4f6;">
              <button type="submit" [disabled]="savingTab === 'email'"
                style="padding: 10px 32px; background: linear-gradient(135deg, #059669, #16a34a); color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; box-shadow: 0 4px 12px rgba(5,150,105,0.25); transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 8px;"
                onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 20px rgba(5,150,105,0.35)';"
                onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(5,150,105,0.25)';">
                <span *ngIf="savingTab === 'email'" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block;"></span>
                <span *ngIf="savingTab !== 'email'" class="material-icons" style="font-size: 18px;">save</span>
                Save Email Settings
              </button>
            </div>
          </form>
        </div>

        <!-- SMS tab -->
        <div *ngIf="activeTab === 'sms'" style="background: white; border-radius: 0 0 16px 16px; border: 1px solid #e5e7eb; padding: 28px;">
          <form [formGroup]="smsForm" (ngSubmit)="saveTab('sms')">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
              <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="color: #059669; font-size: 20px;">sms</span>
              </div>
              <div>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 2px 0;">SMS Provider</h2>
                <p style="font-size: 13px; color: #9ca3af; margin: 0;">Configure your SMS gateway credentials</p>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">SMS Provider</label>
                <input formControlName="sms_provider" placeholder="twilio / msg91 / textlocal"
                  style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              </div>
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">API Key</label>
                <div style="position: relative;">
                  <input formControlName="sms_api_key" placeholder="Enter SMS API key"
                    [type]="showSmsApiKey ? 'text' : 'password'"
                    style="width: 100%; padding: 12px 16px; padding-right: 44px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                    onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                    onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
                  <button type="button" (click)="showSmsApiKey = !showSmsApiKey"
                    style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center; color: #9ca3af; transition: color 0.2s ease;"
                    onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">
                    <span class="material-icons" style="font-size: 20px;">{{ showSmsApiKey ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
              </div>
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">API Secret</label>
                <div style="position: relative;">
                  <input formControlName="sms_api_secret" placeholder="Enter API secret"
                    [type]="showSmsApiSecret ? 'text' : 'password'"
                    style="width: 100%; padding: 12px 16px; padding-right: 44px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                    onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                    onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
                  <button type="button" (click)="showSmsApiSecret = !showSmsApiSecret"
                    style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center; color: #9ca3af; transition: color 0.2s ease;"
                    onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">
                    <span class="material-icons" style="font-size: 20px;">{{ showSmsApiSecret ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
              </div>
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Sender ID</label>
                <input formControlName="sms_sender_id" placeholder="YourSenderID"
                  style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              </div>
              <div style="grid-column: 1 / -1;">
                <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">API URL Template</label>
                <input formControlName="sms_api_url" placeholder="https://api.provider.com/send"
                  style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
                <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">Use &#123;phone&#125; for phone number and &#123;message&#125; for message text</div>
              </div>
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: 24px; padding-top: 20px; border-top: 1px solid #f3f4f6;">
              <button type="submit" [disabled]="savingTab === 'sms'"
                style="padding: 10px 32px; background: linear-gradient(135deg, #059669, #16a34a); color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; box-shadow: 0 4px 12px rgba(5,150,105,0.25); transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 8px;"
                onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 20px rgba(5,150,105,0.35)';"
                onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(5,150,105,0.25)';">
                <span *ngIf="savingTab === 'sms'" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block;"></span>
                <span *ngIf="savingTab !== 'sms'" class="material-icons" style="font-size: 18px;">save</span>
                Save SMS Settings
              </button>
            </div>
          </form>
        </div>

        <!-- Firebase tab -->
        <div *ngIf="activeTab === 'firebase'" style="background: white; border-radius: 0 0 16px 16px; border: 1px solid #e5e7eb; padding: 28px;">
          <form [formGroup]="firebaseForm" (ngSubmit)="saveTab('firebase')">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
              <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="color: #f59e0b; font-size: 20px;">local_fire_department</span>
              </div>
              <div>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 2px 0;">Firebase Cloud Messaging</h2>
                <p style="font-size: 13px; color: #9ca3af; margin: 0;">Push notification configuration</p>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div style="grid-column: 1 / -1;">
                <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">FCM Server Key</label>
                <div style="position: relative;">
                  <input formControlName="fcm_server_key" placeholder="Enter FCM server key"
                    [type]="showFcmKey ? 'text' : 'password'"
                    style="width: 100%; padding: 12px 16px; padding-right: 44px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace;"
                    onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                    onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
                  <button type="button" (click)="showFcmKey = !showFcmKey"
                    style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center; color: #9ca3af; transition: color 0.2s ease;"
                    onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">
                    <span class="material-icons" style="font-size: 20px;">{{ showFcmKey ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
              </div>
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">FCM Sender ID</label>
                <input formControlName="fcm_sender_id" placeholder="123456789"
                  style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              </div>
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Project ID</label>
                <input formControlName="firebase_project_id" placeholder="your-project-id"
                  style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              </div>
              <div style="grid-column: 1 / -1;">
                <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Service Account JSON</label>
                <textarea formControlName="firebase_service_account" rows="6" [placeholder]="firebaseServiceAccountPlaceholder"
                  style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 13px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; resize: vertical; box-sizing: border-box; font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
                <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">Paste your Firebase service account JSON credentials</div>
              </div>
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: 24px; padding-top: 20px; border-top: 1px solid #f3f4f6;">
              <button type="submit" [disabled]="savingTab === 'firebase'"
                style="padding: 10px 32px; background: linear-gradient(135deg, #059669, #16a34a); color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; box-shadow: 0 4px 12px rgba(5,150,105,0.25); transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 8px;"
                onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 20px rgba(5,150,105,0.35)';"
                onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(5,150,105,0.25)';">
                <span *ngIf="savingTab === 'firebase'" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block;"></span>
                <span *ngIf="savingTab !== 'firebase'" class="material-icons" style="font-size: 18px;">save</span>
                Save Firebase Settings
              </button>
            </div>
          </form>
        </div>

        <!-- Feedback toast -->
        <div *ngIf="feedbackMessage" [style]="'position: fixed; bottom: 24px; right: 24px; z-index: 50; padding: 14px 24px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; color: white; background: ' + (feedbackType === 'success' ? '#059669' : '#ef4444') + '; animation: fadeSlideUp 0.3s ease-out;'">
          <span class="material-icons" style="font-size: 18px;">{{ feedbackType === 'success' ? 'check_circle' : 'error_outline' }}</span>
          {{ feedbackMessage }}
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class NotificationConfigComponent implements OnInit {
  private settingsApi = inject(SettingsApiService);

  loading = true;
  activeTab = 'email';
  savingTab: string | null = null;
  feedbackMessage = '';
  feedbackType: 'success' | 'error' = 'success';

  showSmtpPassword = false;
  showSmsApiKey = false;
  showSmsApiSecret = false;
  showFcmKey = false;
  firebaseServiceAccountPlaceholder = '{"type": "service_account", ...}';

  tabs = [
    { id: 'email', label: 'Email (SMTP)', icon: 'email', group: 'email', keys: ['smtp_host', 'smtp_port', 'smtp_username', 'smtp_password', 'mail_from_address', 'mail_from_name'] },
    { id: 'sms', label: 'SMS', icon: 'sms', group: 'sms', keys: ['sms_provider', 'sms_api_key', 'sms_api_secret', 'sms_sender_id', 'sms_api_url'] },
    { id: 'firebase', label: 'Firebase / FCM', icon: 'notifications_active', group: 'firebase', keys: ['fcm_server_key', 'fcm_sender_id', 'firebase_service_account', 'firebase_project_id'] },
  ];

  emailForm = new FormGroup({
    smtp_host: new FormControl(''),
    smtp_port: new FormControl(''),
    smtp_username: new FormControl(''),
    smtp_password: new FormControl(''),
    mail_from_address: new FormControl(''),
    mail_from_name: new FormControl(''),
  });

  smsForm = new FormGroup({
    sms_provider: new FormControl(''),
    sms_api_key: new FormControl(''),
    sms_api_secret: new FormControl(''),
    sms_sender_id: new FormControl(''),
    sms_api_url: new FormControl(''),
  });

  firebaseForm = new FormGroup({
    fcm_server_key: new FormControl(''),
    fcm_sender_id: new FormControl(''),
    firebase_service_account: new FormControl(''),
    firebase_project_id: new FormControl(''),
  });

  private emailKeys = ['smtp_host', 'smtp_port', 'smtp_username', 'smtp_password', 'mail_from_address', 'mail_from_name'];
  private smsKeys = ['sms_provider', 'sms_api_key', 'sms_api_secret', 'sms_sender_id', 'sms_api_url'];
  private firebaseKeys = ['fcm_server_key', 'fcm_sender_id', 'firebase_service_account', 'firebase_project_id'];

  get stats() {
    const allVals = { ...this.emailForm.value, ...this.smsForm.value, ...this.firebaseForm.value };
    const allKeys = [...this.emailKeys, ...this.smsKeys, ...this.firebaseKeys];
    const filled = allKeys.filter(k => (allVals as any)[k]).length;
    return [
      { icon: 'tune', value: String(allKeys.length), label: 'Total Settings', bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', color: '#059669' },
      { icon: 'check_circle', value: String(filled), label: 'Configured', bg: 'linear-gradient(135deg, #eff6ff, #dbeafe)', color: '#3b82f6' },
      { icon: 'notifications', value: '3', label: 'Channels', bg: 'linear-gradient(135deg, #fef3c7, #fde68a)', color: '#f59e0b' },
    ];
  }

  ngOnInit(): void {
    this.loadAllSettings();
  }

  loadAllSettings(): void {
    this.loading = true;
    let loaded = 0;
    const totalGroups = 3;
    const groups: { group: string; keys: string[]; form: FormGroup }[] = [
      { group: 'email', keys: this.emailKeys, form: this.emailForm },
      { group: 'sms', keys: this.smsKeys, form: this.smsForm },
      { group: 'firebase', keys: this.firebaseKeys, form: this.firebaseForm },
    ];

    for (const g of groups) {
      this.settingsApi.getSettingsByGroup(g.group).subscribe({
        next: (res) => {
          const data = res.data || [];
          const formValues: Record<string, string | null> = {};
          for (const key of g.keys) {
            const setting = data.find((s: SystemSetting) => s.setting_key === key);
            formValues[key] = setting ? String(setting.setting_value ?? '') : '';
          }
          g.form.patchValue(formValues);
          loaded++;
          if (loaded === totalGroups) this.loading = false;
        },
        error: () => {
          loaded++;
          if (loaded === totalGroups) this.loading = false;
        },
      });
    }
  }

  saveTab(tab: string): void {
    this.savingTab = tab;
    let form: FormGroup;
    let keys: string[];
    let group: string;

    switch (tab) {
      case 'email':
        form = this.emailForm;
        keys = this.emailKeys;
        group = 'email';
        break;
      case 'sms':
        form = this.smsForm;
        keys = this.smsKeys;
        group = 'sms';
        break;
      case 'firebase':
        form = this.firebaseForm;
        keys = this.firebaseKeys;
        group = 'firebase';
        break;
      default:
        return;
    }

    const formValue = form.value;
    const settings = keys.map(key => ({
      setting_key: key,
      setting_value: (formValue as Record<string, any>)[key] != null ? String((formValue as Record<string, any>)[key]) : null,
    }));

    this.settingsApi.bulkUpdateSettings(settings).subscribe({
      next: (res) => {
        this.savingTab = null;
        this.showFeedback(res.message || `${tab.charAt(0).toUpperCase() + tab.slice(1)} settings updated successfully`, 'success');
      },
      error: (err) => {
        this.savingTab = null;
        this.showFeedback(err.error?.message || `Failed to update ${tab} settings`, 'error');
      },
    });
  }

  showFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage = message;
    this.feedbackType = type;
    setTimeout(() => { this.feedbackMessage = ''; }, 4000);
  }
}
