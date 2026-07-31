import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { SettingsApiService } from '../../../../core/services/settings-api.service';
import { SystemSetting } from '../../../../core/models/setting/system-setting.model';

@Component({
  selector: 'app-seo-manager',
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
          <span style="color: white; font-weight: 500;">SEO Manager</span>
        </div>
        <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0 0 6px 0;">
          <span class="material-icons" style="font-size: 24px; vertical-align: middle; margin-right: 8px;">travel_explore</span>
          SEO Manager
        </h1>
        <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Configure meta tags, analytics tracking, and search engine preferences</p>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 1200px; margin: -40px auto 0; padding: 0 24px; position: relative; z-index: 3; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
      <div style="background: white; border-radius: 16px; padding: 20px; border: 1px solid #e5e7eb; display: flex; align-items: center; gap: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <span class="material-icons" style="font-size: 22px; color: #059669;">label</span>
        </div>
        <div>
          <div style="font-size: 20px; font-weight: 800; color: #166534; line-height: 1.2;">{{ statMeta }}</div>
          <div style="font-size: 12px; color: #9ca3af; font-weight: 500;">Meta Tags</div>
        </div>
      </div>
      <div style="background: white; border-radius: 16px; padding: 20px; border: 1px solid #e5e7eb; display: flex; align-items: center; gap: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #eff6ff, #dbeafe); border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <span class="material-icons" style="font-size: 22px; color: #3b82f6;">analytics</span>
        </div>
        <div>
          <div style="font-size: 20px; font-weight: 800; color: #166534; line-height: 1.2;">{{ statTracking }}</div>
          <div style="font-size: 12px; color: #9ca3af; font-weight: 500;">Tracking Connected</div>
        </div>
      </div>
      <div style="background: white; border-radius: 16px; padding: 20px; border: 1px solid #e5e7eb; display: flex; align-items: center; gap: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <span class="material-icons" style="font-size: 22px; color: #f59e0b;">robot</span>
        </div>
        <div>
          <div style="font-size: 20px; font-weight: 800; color: #166534; line-height: 1.2;">{{ statRobots }}</div>
          <div style="font-size: 12px; color: #9ca3af; font-weight: 500;">Robots Meta</div>
        </div>
      </div>
    </section>

    <section style="max-width: 1200px; margin: 24px auto 60px; padding: 0 24px;">
      @if (loading) {
        <div style="display: flex; align-items: center; justify-content: center; padding: 80px 0;">
          <div style="width: 36px; height: 36px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        </div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="onSubmit()" style="max-width: 900px;">
          <div style="background: white; border-radius: 20px; border: 1px solid #e5e7eb; padding: 32px; margin-bottom: 24px; transition: all 0.3s ease;"
               onmouseover="this.style.borderColor='#a7f3d0'; this.style.boxShadow='0 4px 16px rgba(5,150,105,0.06)';"
               onmouseout="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none';">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
              <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="color: #059669; font-size: 20px;">label</span>
              </div>
              <div>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 2px 0;">Meta Tags</h2>
                <p style="font-size: 13px; color: #9ca3af; margin: 0;">Page title, description and keywords for search engines</p>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr; gap: 20px;">
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Meta Title</label>
                <input formControlName="meta_title" placeholder="Your Site Title - Best Food Delivery"
                  style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
                <div style="font-size: 11px; color: #9ca3af; margin-top: 4px; display: flex; justify-content: space-between;">
                  <span>Primary title tag for search engine results</span>
                  <span [style.color]="(form.get('meta_title')?.value || '').length > 60 ? '#ef4444' : '#9ca3af'">{{ (form.get('meta_title')?.value || '').length }}/60</span>
                </div>
              </div>
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Meta Description</label>
                <textarea formControlName="meta_description" rows="3" placeholder="Brief description of your website for search engine results"
                  style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; resize: vertical; box-sizing: border-box; font-family: inherit;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
                <div style="font-size: 11px; color: #9ca3af; margin-top: 4px; display: flex; justify-content: space-between;">
                  <span>Shown in search engine result snippets</span>
                  <span [style.color]="(form.get('meta_description')?.value || '').length > 160 ? '#ef4444' : '#9ca3af'">{{ (form.get('meta_description')?.value || '').length }}/160</span>
                </div>
              </div>
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Meta Keywords</label>
                <input formControlName="meta_keywords" placeholder="food delivery, tiffin service, healthy meals"
                  style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
                <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">Comma-separated keywords</div>
              </div>
            </div>
          </div>

          <div style="background: white; border-radius: 20px; border: 1px solid #e5e7eb; padding: 32px; margin-bottom: 24px; transition: all 0.3s ease;"
               onmouseover="this.style.borderColor='#a7f3d0'; this.style.boxShadow='0 4px 16px rgba(5,150,105,0.06)';"
               onmouseout="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none';">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
              <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #eff6ff, #dbeafe); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="color: #3b82f6; font-size: 20px;">analytics</span>
              </div>
              <div>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 2px 0;">Analytics & Tracking</h2>
                <p style="font-size: 13px; color: #9ca3af; margin: 0;">Google Analytics and Facebook Pixel integration</p>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Google Analytics ID</label>
                <input formControlName="google_analytics_id" placeholder="G-XXXXXXXXXX"
                  style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
                <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">Your Google Analytics 4 measurement ID</div>
              </div>
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Facebook Pixel ID</label>
                <input formControlName="facebook_pixel_id" placeholder="123456789012345"
                  style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
                <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">Your Facebook Pixel tracking ID</div>
              </div>
            </div>
          </div>

          <div style="background: white; border-radius: 20px; border: 1px solid #e5e7eb; padding: 32px; margin-bottom: 32px; transition: all 0.3s ease;"
               onmouseover="this.style.borderColor='#a7f3d0'; this.style.boxShadow='0 4px 16px rgba(5,150,105,0.06)';"
               onmouseout="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none';">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
              <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="color: #f59e0b; font-size: 20px;">robot</span>
              </div>
              <div>
                <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 2px 0;">Search Engine Access</h2>
                <p style="font-size: 13px; color: #9ca3af; margin: 0;">Control how crawlers interact with your site</p>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr; gap: 20px;">
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Robots Meta</label>
                <input formControlName="robots_meta" placeholder="index, follow"
                  style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                  onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                  onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
                <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">Comma-separated directives (e.g., index, follow, noarchive)</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; margin-top: 20px; padding: 16px; background: #f9fafb; border-radius: 12px;">
              <button type="button" (click)="toggleSitemap()"
                [style]="'width: 48px; height: 26px; border-radius: 13px; border: none; cursor: pointer; position: relative; transition: all 0.2s ease; flex-shrink: 0; ' + (form.get('enable_sitemap')?.value ? 'background: #059669;' : 'background: #d1d5db;')">
                <div [style]="'width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; top: 3px; transition: all 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.2); ' + (form.get('enable_sitemap')?.value ? 'left: 25px;' : 'left: 3px;')"></div>
              </button>
              <div>
                <div style="font-size: 13px; font-weight: 600; color: #374151;">Enable XML Sitemap Generation</div>
                <div style="font-size: 12px; color: #9ca3af;">Automatically generate and serve sitemap.xml for search engines</div>
              </div>
            </div>
          </div>

          <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; position: sticky; bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
            <div>
              @if (feedbackMessage) {
                <span [style]="'font-size: 13px; font-weight: 600; color: ' + (feedbackType === 'success' ? '#059669' : '#ef4444') + '; display: flex; align-items: center; gap: 6px;'">
                  <span class="material-icons" style="font-size: 16px;">{{ feedbackType === 'success' ? 'check_circle' : 'error_outline' }}</span>
                  {{ feedbackMessage }}
                </span>
              } @else {
                <span style="font-size: 13px; color: #9ca3af;">Changes will be saved in bulk</span>
              }
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <a routerLink="/admin/settings"
                 style="padding: 10px 24px; border: 1.5px solid #e5e7eb; border-radius: 10px; color: #374151; font-size: 13px; font-weight: 600; text-decoration: none; transition: all 0.2s ease; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;"
                 onmouseover="this.style.borderColor='#d1d5db'; this.style.background='#f9fafb';"
                 onmouseout="this.style.borderColor='#e5e7eb'; this.style.background='';">
                Cancel
              </a>
              <button type="submit" [disabled]="form.invalid || isSaving"
                style="padding: 10px 32px; background: linear-gradient(135deg, #059669, #16a34a); color: white; font-weight: 700; border-radius: 10px; border: none; font-size: 13px; cursor: pointer; box-shadow: 0 4px 12px rgba(5,150,105,0.25); transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 8px;"
                onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 20px rgba(5,150,105,0.35)';"
                onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(5,150,105,0.25)';">
                @if (isSaving) {
                  <span style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block;"></span>
                } @else {
                  <span class="material-icons" style="font-size: 18px;">save</span>
                }
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </div>
        </form>
      }
    </section>
  `,
  styles: [`
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
})
export class SeoManagerComponent implements OnInit {
  private settingsApi = inject(SettingsApiService);

  loading = true;
  isSaving = false;
  feedbackMessage = '';
  feedbackType: 'success' | 'error' = 'success';

  form = new FormGroup({
    meta_title: new FormControl(''),
    meta_description: new FormControl(''),
    meta_keywords: new FormControl(''),
    google_analytics_id: new FormControl(''),
    facebook_pixel_id: new FormControl(''),
    robots_meta: new FormControl(''),
    enable_sitemap: new FormControl(false),
  });

  private settingKeys = [
    'meta_title', 'meta_description', 'meta_keywords',
    'google_analytics_id', 'facebook_pixel_id', 'robots_meta', 'enable_sitemap',
  ];

  get statMeta(): string {
    const vals = this.form.value;
    return [vals.meta_title, vals.meta_description, vals.meta_keywords].filter(Boolean).length + '/3';
  }

  get statTracking(): string {
    const vals = this.form.value;
    const count = [vals.google_analytics_id, vals.facebook_pixel_id].filter(Boolean).length;
    return count === 2 ? '2/2' : count + '/2';
  }

  get statRobots(): string {
    const v = this.form.get('robots_meta')?.value;
    return v ? v.split(',').length + ' rules' : 'Not set';
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.loading = true;
    this.settingsApi.getSettingsByGroup('seo').subscribe({
      next: (res) => {
        const data = res.data || [];
        const formValues: Record<string, any> = {};
        for (const key of this.settingKeys) {
          const setting = data.find((s: SystemSetting) => s.setting_key === key);
          if (setting) {
            if (key === 'enable_sitemap') {
              formValues[key] = setting.setting_value === true || setting.setting_value === 'true' || setting.setting_value === '1';
            } else {
              formValues[key] = String(setting.setting_value ?? '');
            }
          } else {
            formValues[key] = key === 'enable_sitemap' ? false : '';
          }
        }
        this.form.patchValue(formValues);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showFeedback('Failed to load SEO settings', 'error');
      },
    });
  }

  toggleSitemap(): void {
    this.form.get('enable_sitemap')?.setValue(!this.form.get('enable_sitemap')?.value);
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
        this.showFeedback(res.message || 'SEO settings updated successfully', 'success');
      },
      error: (err) => {
        this.isSaving = false;
        this.showFeedback(err.error?.message || 'Failed to update SEO settings', 'error');
      },
    });
  }

  showFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage = message;
    this.feedbackType = type;
    setTimeout(() => { this.feedbackMessage = ''; }, 4000);
  }
}
