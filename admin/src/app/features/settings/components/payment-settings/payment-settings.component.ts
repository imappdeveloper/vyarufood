import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { SettingsApiService } from '../../../../core/services/settings-api.service';
import { SystemSetting } from '../../../../core/models/setting/system-setting.model';

@Component({
  selector: 'app-payment-settings',
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
          <span style="color: white; font-weight: 500;">Payment Gateway</span>
        </div>
        <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0 0 6px 0;">
          <span class="material-icons" style="font-size: 24px; vertical-align: middle; margin-right: 8px;">payments</span>
          Payment Gateway
        </h1>
        <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Configure Razorpay credentials and payment preferences</p>
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

      <form *ngIf="!loading" [formGroup]="form" (ngSubmit)="onSubmit()" style="max-width: 900px;">

        <div style="background: white; border-radius: 20px; border: 1px solid #e5e7eb; padding: 32px; margin-bottom: 24px; transition: all 0.3s ease;"
             onmouseover="this.style.borderColor='#a7f3d0'; this.style.boxShadow='0 4px 16px rgba(5,150,105,0.06)';"
             onmouseout="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none';">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="color: #059669; font-size: 20px;">payment</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 2px 0;">Razorpay Credentials</h2>
              <p style="font-size: 13px; color: #9ca3af; margin: 0;">API keys from your Razorpay dashboard</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="grid-column: 1 / -1;">
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Key ID</label>
              <input formControlName="razorpay_key_id" placeholder="rzp_live_xxxxxxxxxxxxx"
                style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">Your Razorpay API Key ID</div>
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Key Secret</label>
              <div style="position: relative;">
                <input formControlName="razorpay_key_secret" placeholder="Enter key secret"
                  [type]="showKeySecret ? 'text' : 'password'"
                  style="width: 100%; padding: 12px 16px; padding-right: 44px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
                <button type="button" (click)="showKeySecret = !showKeySecret"
                  style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center; color: #9ca3af; transition: color 0.2s ease;"
                  onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">
                  <span class="material-icons" style="font-size: 20px;">{{ showKeySecret ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
              <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">Keep this secret and never share it publicly</div>
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Webhook Secret</label>
              <div style="position: relative;">
                <input formControlName="razorpay_webhook_secret" placeholder="Enter webhook secret"
                  [type]="showWebhookSecret ? 'text' : 'password'"
                  style="width: 100%; padding: 12px 16px; padding-right: 44px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box; font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
                <button type="button" (click)="showWebhookSecret = !showWebhookSecret"
                  style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center; color: #9ca3af; transition: color 0.2s ease;"
                  onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">
                  <span class="material-icons" style="font-size: 20px;">{{ showWebhookSecret ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
              <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">Secret used to verify webhook signatures</div>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 20px; border: 1px solid #e5e7eb; padding: 32px; margin-bottom: 32px; transition: all 0.3s ease;"
             onmouseover="this.style.borderColor='#a7f3d0'; this.style.boxShadow='0 4px 16px rgba(5,150,105,0.06)';"
             onmouseout="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none';">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="color: #f59e0b; font-size: 20px;">science</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 2px 0;">Environment</h2>
              <p style="font-size: 13px; color: #9ca3af; margin: 0;">Toggle between live and sandbox mode</p>
            </div>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; background: #fafaf9; border-radius: 12px; border: 1px solid #e5e7eb;">
            <div>
              <div style="font-size: 14px; font-weight: 600; color: #166534;">{{ form.value.payment_sandbox_mode ? 'Sandbox Mode Active' : 'Live Mode Active' }}</div>
              <div style="font-size: 12px; color: #9ca3af; margin-top: 2px;">
                {{ form.value.payment_sandbox_mode ? 'Payments processed in Razorpay test environment' : 'Payments processed in production environment' }}
              </div>
            </div>
            <button type="button" (click)="toggleSandbox()"
              [style]="'position: relative; width: 52px; height: 28px; border-radius: 14px; border: none; cursor: pointer; transition: all 0.3s ease; background: ' + (form.value.payment_sandbox_mode ? '#059669' : '#d1d5db') + ';'">
              <span [style]="'position: absolute; top: 3px; width: 22px; height: 22px; border-radius: 50%; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.15); transition: all 0.3s ease; left: ' + (form.value.payment_sandbox_mode ? '27px' : '3px') + ';'"></span>
            </button>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; position: sticky; bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          <div>
            <span *ngIf="feedbackMessage" [style]="'font-size: 13px; font-weight: 600; color: ' + (feedbackType === 'success' ? '#059669' : '#ef4444') + '; display: flex; align-items: center; gap: 6px;'">
              <span class="material-icons" style="font-size: 16px;">{{ feedbackType === 'success' ? 'check_circle' : 'error_outline' }}</span>
              {{ feedbackMessage }}
            </span>
            <span *ngIf="!feedbackMessage" style="font-size: 13px; color: #9ca3af;">Changes will be saved in bulk</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <a routerLink="/admin/settings"
               style="padding: 10px 24px; border: 1.5px solid #e5e7eb; border-radius: 10px; color: #374151; font-size: 13px; font-weight: 600; text-decoration: none; transition: all 0.2s ease; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;"
               onmouseover="this.style.borderColor='#d1d5db'; this.style.background='#f9fafb';"
               onmouseout="this.style.borderColor='#e5e7eb'; this.style.background='';">
              Cancel
            </a>
            <button type="submit" [disabled]="isSaving"
              style="padding: 10px 32px; background: linear-gradient(135deg, #059669, #16a34a); color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; box-shadow: 0 4px 12px rgba(5,150,105,0.25); transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 8px;"
              onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 20px rgba(5,150,105,0.35)';"
              onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(5,150,105,0.25)';">
              <span *ngIf="isSaving" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block;"></span>
              <span *ngIf="!isSaving" class="material-icons" style="font-size: 18px;">save</span>
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </form>
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
export class PaymentSettingsComponent implements OnInit {
  private settingsApi = inject(SettingsApiService);

  loading = true;
  isSaving = false;
  showKeySecret = false;
  showWebhookSecret = false;
  feedbackMessage = '';
  feedbackType: 'success' | 'error' = 'success';

  form = new FormGroup({
    razorpay_key_id: new FormControl(''),
    razorpay_key_secret: new FormControl(''),
    razorpay_webhook_secret: new FormControl(''),
    payment_sandbox_mode: new FormControl(false),
  });

  private settingKeys = [
    'razorpay_key_id', 'razorpay_key_secret', 'razorpay_webhook_secret', 'payment_sandbox_mode',
  ];

  get stats() {
    const vals = this.form.value;
    const filled = this.settingKeys.filter(k => (vals as any)[k]).length;
    return [
      { icon: 'settings', label: 'Total Credentials', value: this.settingKeys.length, bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', color: '#059669' },
      { icon: 'check_circle', label: 'Configured', value: filled, bg: 'linear-gradient(135deg, #eff6ff, #dbeafe)', color: '#3b82f6' },
      { icon: 'lock', label: 'Secrets Hidden', value: '2', bg: 'linear-gradient(135deg, #fef3c7, #fde68a)', color: '#f59e0b' },
    ];
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.loading = true;
    this.settingsApi.getSettingsByGroup('payment_gateway').subscribe({
      next: (res) => {
        const data = res.data || [];
        const formValues: Record<string, any> = {};
        for (const key of this.settingKeys) {
          const setting = data.find((s: SystemSetting) => s.setting_key === key);
          if (setting) {
            if (key === 'payment_sandbox_mode') {
              formValues[key] = setting.setting_value === true || setting.setting_value === 'true' || setting.setting_value === '1';
            } else {
              formValues[key] = String(setting.setting_value ?? '');
            }
          } else {
            formValues[key] = key === 'payment_sandbox_mode' ? false : '';
          }
        }
        this.form.patchValue(formValues);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showFeedback('Failed to load payment settings', 'error');
      },
    });
  }

  toggleSandbox(): void {
    this.form.patchValue({ payment_sandbox_mode: !this.form.value.payment_sandbox_mode });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.isSaving = true;
    const formValue = this.form.value;

    const settings = this.settingKeys.map(key => ({
      setting_key: key,
      setting_value: (formValue as Record<string, any>)[key] != null ? String((formValue as Record<string, any>)[key]) : null,
    }));

    this.settingsApi.bulkUpdateSettings(settings).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.showFeedback(res.message || 'Payment settings updated successfully', 'success');
      },
      error: (err) => {
        this.isSaving = false;
        this.showFeedback(err.error?.message || 'Failed to update payment settings', 'error');
      },
    });
  }

  showFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage = message;
    this.feedbackType = type;
    setTimeout(() => { this.feedbackMessage = ''; }, 4000);
  }
}
