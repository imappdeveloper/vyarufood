import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SettingsApiService } from '../../../../core/services/settings-api.service';
import { NotificationService } from '../../../../core/services/notification.service';

interface PageEntry {
  page_code: string;
  page_title: string;
  slug: string;
  status: string;
  updated_at: string | null;
  uuid: string | null;
  loading?: boolean;
}

const PREDEFINED_PAGES = [
  { page_code: 'about-us', page_title: 'About Us', slug: 'about-us' },
  { page_code: 'contact-us', page_title: 'Contact Us', slug: 'contact-us' },
  { page_code: 'privacy-policy', page_title: 'Privacy Policy', slug: 'privacy-policy' },
  { page_code: 'terms-conditions', page_title: 'Terms & Conditions', slug: 'terms-and-conditions' },
  { page_code: 'refund-policy', page_title: 'Refund Policy', slug: 'refund-policy' },
  { page_code: 'cancellation-policy', page_title: 'Cancellation Policy', slug: 'cancellation-policy' },
  { page_code: 'help-center', page_title: 'Help Center', slug: 'help-center' },
  { page_code: 'faq', page_title: 'FAQs', slug: 'faq' },
  { page_code: 'delivery-areas', page_title: 'Delivery Areas', slug: 'delivery-areas' },
  { page_code: 'report-an-issue', page_title: 'Report an Issue', slug: 'report-an-issue' },
];

@Component({
  selector: 'app-cms-page-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section style="position: relative; background: linear-gradient(135deg, #059669, #047857, #166534); padding: 48px 32px 80px; overflow: hidden;">
      <div style="position: absolute; top: -30px; right: -30px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -40px; left: 20%; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;"></div>
      <div style="max-width: 1200px; margin: 0 auto; position: relative; z-index: 2;">
        <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.75); margin-bottom: 16px;">
          <a routerLink="/admin/settings" style="color: rgba(255,255,255,0.75); text-decoration: none;">Settings</a>
          <span style="font-size: 10px;">&#9654;</span>
          <span style="color: white; font-weight: 500;">CMS Pages</span>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 0 0 6px 0;">
              <span class="material-icons" style="font-size: 24px; vertical-align: middle; margin-right: 8px;">article</span>
              CMS Pages
            </h1>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0;">Manage content for your website pages</p>
          </div>
        </div>
      </div>
      <svg style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f3f4f6"/>
      </svg>
    </section>

    <section style="max-width: 1200px; margin: -40px auto 0; padding: 0 24px; position: relative; z-index: 3; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
      <div style="background: white; border-radius: 16px; padding: 20px; border: 1px solid #e5e7eb; display: flex; align-items: center; gap: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <span class="material-icons" style="font-size: 22px; color: #059669;">description</span>
        </div>
        <div>
          <div style="font-size: 20px; font-weight: 800; color: #166534; line-height: 1.2;">{{ totalCount }}</div>
          <div style="font-size: 12px; color: #9ca3af; font-weight: 500;">Total Pages</div>
        </div>
      </div>
      <div style="background: white; border-radius: 16px; padding: 20px; border: 1px solid #e5e7eb; display: flex; align-items: center; gap: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <span class="material-icons" style="font-size: 22px; color: #059669;">check_circle</span>
        </div>
        <div>
          <div style="font-size: 20px; font-weight: 800; color: #166534; line-height: 1.2;">{{ publishedCount }}</div>
          <div style="font-size: 12px; color: #9ca3af; font-weight: 500;">Published</div>
        </div>
      </div>
      <div style="background: white; border-radius: 16px; padding: 20px; border: 1px solid #e5e7eb; display: flex; align-items: center; gap: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <span class="material-icons" style="font-size: 22px; color: #f59e0b;">edit_note</span>
        </div>
        <div>
          <div style="font-size: 20px; font-weight: 800; color: #166534; line-height: 1.2;">{{ draftCount }}</div>
          <div style="font-size: 12px; color: #9ca3af; font-weight: 500;">Drafts</div>
        </div>
      </div>
    </section>

    <section style="max-width: 1200px; margin: 24px auto 60px; padding: 0 24px;">
      <div style="background: white; border-radius: 20px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <div style="padding: 16px 20px; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between;">
          <div style="font-size: 13px; color: #6b7280;">
            <strong style="color: #166534;">{{ totalCount }}</strong> predefined pages — click <strong>Edit</strong> to update content
          </div>
        </div>

        <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; padding: 60px 0;">
          <div style="width: 36px; height: 36px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        </div>

        <table *ngIf="!loading" style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f9fafb;">
              <th style="padding: 14px 20px; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; text-align: left; width: 40px;">#</th>
              <th style="padding: 14px 20px; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; text-align: left;">Page Code</th>
              <th style="padding: 14px 20px; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; text-align: left;">Page Title</th>
              <th style="padding: 14px 20px; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; text-align: left;">Status</th>
              <th style="padding: 14px 20px; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; text-align: left;">Last Updated</th>
              <th style="padding: 14px 20px; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; text-align: center; width: 100px;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let page of pages; let i = index"
                style="border-top: 1px solid #f3f4f6; transition: background 0.15s;"
                onmouseover="this.style.background='#fafafa';"
                onmouseout="this.style.background='';">
              <td style="padding: 16px 20px; font-size: 13px; color: #9ca3af;">{{ i + 1 }}</td>
              <td style="padding: 16px 20px;">
                <code style="font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 12px; color: #059669; background: #ecfdf5; padding: 3px 10px; border-radius: 6px; font-weight: 600;">{{ page.page_code }}</code>
              </td>
              <td style="padding: 16px 20px; font-size: 14px; font-weight: 600; color: #111827;">{{ page.page_title }}</td>
              <td style="padding: 16px 20px;">
                <span [style]="'display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; ' + getStatusStyle(page.status)">
                  <span [style]="'width: 6px; height: 6px; border-radius: 50%; ' + getStatusDot(page.status)"></span>
                  {{ page.status }}
                </span>
              </td>
              <td style="padding: 16px 20px; font-size: 13px; color: #6b7280;">{{ page.updated_at ? (page.updated_at | date:'medium') : 'Not yet saved' }}</td>
              <td style="padding: 16px 20px; text-align: center;">
                <a *ngIf="page.uuid" [routerLink]="['/admin/settings/cms', page.uuid, 'edit']"
                   style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: linear-gradient(135deg, #059669, #16a34a); color: white; font-size: 12px; font-weight: 700; border-radius: 8px; text-decoration: none; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(5,150,105,0.2);"
                   onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 20px rgba(5,150,105,0.3)';"
                   onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(5,150,105,0.2)';">
                  <span class="material-icons" style="font-size: 14px;">edit</span> Edit
                </a>
                <span *ngIf="!page.uuid" style="font-size: 12px; color: #9ca3af; font-style: italic;">Pending...</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [`
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
})
export class CmsPageListComponent implements OnInit {
  private settingsApi = inject(SettingsApiService);
  private notification = inject(NotificationService);

  pages: PageEntry[] = [];
  loading = false;

  get totalCount() { return this.pages.length; }
  get publishedCount() { return this.pages.filter(p => p.status === 'published').length; }
  get draftCount() { return this.pages.filter(p => p.status === 'draft').length; }

  ngOnInit(): void {
    this.loadPages();
  }

  loadPages(): void {
    this.loading = true;
    this.pages = PREDEFINED_PAGES.map(p => ({
      ...p,
      status: 'pending',
      updated_at: null,
      uuid: null,
    }));

    this.settingsApi.getCmsPages({ per_page: '50' }).subscribe({
      next: (res) => {
        const apiPages = res.data || [];
        const map = new Map(apiPages.map((p: any) => [p.page_code, p]));
        this.pages = PREDEFINED_PAGES.map(p => {
          const match = map.get(p.page_code);
          return {
            page_code: p.page_code,
            page_title: p.page_title,
            slug: p.slug,
            status: match?.status || 'pending',
            updated_at: match?.updated_at || null,
            uuid: match?.uuid || null,
          };
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notification.error('Failed to load CMS pages');
      },
    });
  }

  getStatusStyle(status: string): string {
    switch (status) {
      case 'published': return 'background: #d1fae5; color: #065f46;';
      case 'draft': return 'background: #fef3c7; color: #92400e;';
      case 'archived': return 'background: #f3f4f6; color: #6b7280;';
      default: return 'background: #f3f4f6; color: #9ca3af;';
    }
  }

  getStatusDot(status: string): string {
    switch (status) {
      case 'published': return 'background: #059669;';
      case 'draft': return 'background: #f59e0b;';
      case 'archived': return 'background: #9ca3af;';
      default: return 'background: #d1d5db;';
    }
  }
}
