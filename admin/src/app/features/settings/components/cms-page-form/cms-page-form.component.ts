import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SettingsApiService } from '../../../../core/services/settings-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UpdateCmsPage } from '../../../../core/models/setting/cms-page.model';

@Component({
  selector: 'app-cms-page-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 48px 32px 80px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
        <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.75); margin-bottom: 16px;">
          <a routerLink="/admin/settings" style="color: rgba(255,255,255,0.75); text-decoration: none;">Settings</a>
          <span style="font-size: 10px;">&#9654;</span>
          <a routerLink="/admin/settings/cms" style="color: rgba(255,255,255,0.75); text-decoration: none;">CMS Pages</a>
          <span style="font-size: 10px;">&#9654;</span>
          <span style="color: white; font-weight: 500;">{{ pageTitle }}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <a routerLink="/admin/settings/cms"
             style="width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: background 0.2s; flex-shrink: 0;"
             onmouseover="this.style.background='rgba(255,255,255,0.2)';"
             onmouseout="this.style.background='rgba(255,255,255,0.1)';">
            <span class="material-icons" style="color: white; font-size: 20px;">arrow_back</span>
          </a>
          <div>
            <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0 0 6px 0;">
              <span class="material-icons" style="font-size: 24px; vertical-align: middle; margin-right: 8px;">edit</span>
              Edit Page Content
            </h1>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Update the content for <strong style="color: white;">{{ pageTitle }}</strong></p>
          </div>
        </div>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 1200px; margin: -40px auto 0; padding: 0 24px; position: relative; z-index: 3;">
      <div style="background: white; border-radius: 16px; padding: 16px 24px; border: 1px solid #e5e7eb; display: flex; align-items: center; gap: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <span class="material-icons" style="font-size: 22px; color: #059669;">{{ pageCodeIcon }}</span>
        </div>
        <div style="flex: 1;">
          <div style="font-size: 13px; color: #9ca3af; font-weight: 500; margin-bottom: 2px;">Page Code</div>
          <code style="font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 16px; font-weight: 700; color: #166534; background: #ecfdf5; padding: 4px 14px; border-radius: 8px;">{{ pageCode }}</code>
        </div>
        <span [style]="'display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; padding: 5px 14px; border-radius: 20px; ' + statusStyle">
          <span [style]="'width: 6px; height: 6px; border-radius: 50%; ' + statusDot"></span>
          {{ form.get('status')?.value }}
        </span>
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
              <span class="material-icons" style="color: #059669; font-size: 20px;">article</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 2px 0;">Page Content</h2>
              <p style="font-size: 13px; color: #9ca3af; margin: 0;">Edit the content that appears on the frontend page</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr; gap: 20px;">
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Content *</label>
              <textarea formControlName="content" rows="16" placeholder="Write or edit your page content here..."
                style="width: 100%; padding: 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; resize: vertical; box-sizing: border-box; font-family: 'SF Mono', Monaco, Consolas, monospace; line-height: 1.6;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
              <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">Supports HTML. Changes are reflected on the frontend immediately after saving.</div>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 20px; border: 1px solid #e5e7eb; padding: 32px; margin-bottom: 32px; transition: all 0.3s ease;"
             onmouseover="this.style.borderColor='#a7f3d0'; this.style.boxShadow='0 4px 16px rgba(5,150,105,0.06)';"
             onmouseout="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none';">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons" style="color: #059669; font-size: 20px;">search</span>
            </div>
            <div>
              <h2 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 2px 0;">SEO & Meta</h2>
              <p style="font-size: 13px; color: #9ca3af; margin: 0;">Search engine optimization settings</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr; gap: 20px;">
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Meta Title</label>
              <input formControlName="meta_title" placeholder="SEO title for search engines"
                style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Meta Description</label>
              <textarea formControlName="meta_description" rows="3" placeholder="Brief description for search results"
                style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; resize: vertical; box-sizing: border-box; font-family: inherit;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';"></textarea>
            </div>
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">Meta Keywords</label>
              <input formControlName="meta_keywords" placeholder="comma, separated, keywords"
                style="width: 100%; padding: 12px 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; color: #166534; outline: none; transition: all 0.2s ease; background: #f9fafb; box-sizing: border-box;"
                onfocus="this.style.borderColor='#059669'; this.style.boxShadow='0 0 0 3px rgba(5,150,105,0.1)'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow=''; this.style.background='#f9fafb';" />
              <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">Separate keywords with commas</div>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1px solid #e5e7eb; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; position: sticky; bottom: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          <div>
            <span *ngIf="feedbackMessage" [style]="'font-size: 13px; font-weight: 600; color: ' + (feedbackType === 'success' ? '#059669' : '#ef4444') + '; display: flex; align-items: center; gap: 6px;'">
              <span class="material-icons" style="font-size: 16px;">{{ feedbackType === 'success' ? 'check_circle' : 'error_outline' }}</span>
              {{ feedbackMessage }}
            </span>
            <span *ngIf="!feedbackMessage" style="font-size: 13px; color: #9ca3af;">Edit content and save changes — they will reflect on the frontend immediately</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <a routerLink="/admin/settings/cms"
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
  `],
})
export class CmsPageFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private settingsApi = inject(SettingsApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = false;
  isSaving = false;
  feedbackMessage = '';
  feedbackType: 'success' | 'error' = 'success';
  private pageUuid = '';
  pageCode = '';
  pageTitle = '';

  form = this.fb.group({
    page_title: [{ value: '', disabled: true }],
    content: [''],
    meta_title: [''],
    meta_description: [''],
    meta_keywords: [''],
    status: [{ value: 'draft', disabled: true }],
  });

  get pageCodeIcon(): string {
    switch (this.pageCode) {
      case 'about-us': return 'info';
      case 'contact-us': return 'mail';
      case 'privacy-policy': return 'lock';
      case 'terms-conditions': return 'description';
      case 'refund-policy': return 'currency_rupee';
      case 'cancellation-policy': return 'cancel';
      case 'help-center': return 'help';
      case 'faq': return 'quiz';
      case 'delivery-areas': return 'local_shipping';
      case 'report-an-issue': return 'flag';
      default: return 'article';
    }
  }

  get statusStyle(): string {
    const s = this.form.get('status')?.value;
    switch (s) {
      case 'published': return 'background: #d1fae5; color: #065f46;';
      case 'draft': return 'background: #fef3c7; color: #92400e;';
      default: return 'background: #f3f4f6; color: #6b7280;';
    }
  }

  get statusDot(): string {
    const s = this.form.get('status')?.value;
    switch (s) {
      case 'published': return 'background: #059669;';
      case 'draft': return 'background: #f59e0b;';
      default: return 'background: #9ca3af;';
    }
  }

  ngOnInit(): void {
    this.pageUuid = this.route.snapshot.paramMap.get('uuid') || '';
    if (!this.pageUuid) {
      this.notification.error('No page specified');
      this.router.navigate(['/admin/settings/cms']);
      return;
    }
    this.loadPage();
  }

  loadPage(): void {
    this.loading = true;
    this.settingsApi.getCmsPage(this.pageUuid).subscribe({
      next: (res) => {
        const page = res.data;
        if (page) {
          this.pageCode = page.page_code || '';
          this.pageTitle = page.page_title || '';
          this.form.patchValue({
            page_title: page.page_title,
            content: page.content || '',
            meta_title: page.meta_title || '',
            meta_description: page.meta_description || '',
            meta_keywords: page.meta_keywords || '',
            status: page.status || 'draft',
          });
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notification.error('Failed to load page');
        this.router.navigate(['/admin/settings/cms']);
      },
    });
  }

  onSubmit(): void {
    if (this.isSaving) return;
    this.isSaving = true;

    const formValue = this.form.value;
    const payload: UpdateCmsPage = {
      content: formValue.content || null,
      meta_title: formValue.meta_title || null,
      meta_description: formValue.meta_description || null,
      meta_keywords: formValue.meta_keywords || null,
    };

    this.settingsApi.updateCmsPage(this.pageUuid, payload).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.showFeedback(res.message || 'Page content updated successfully', 'success');
      },
      error: (err) => {
        this.isSaving = false;
        this.showFeedback(err.error?.message || 'Failed to update page content', 'error');
      },
    });
  }

  showFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage = message;
    this.feedbackType = type;
    setTimeout(() => { this.feedbackMessage = ''; }, 4000);
  }
}
