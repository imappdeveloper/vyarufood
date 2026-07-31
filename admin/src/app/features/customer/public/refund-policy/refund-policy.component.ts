import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsPageComponent } from '../cms-page/cms-page.component';
import { CmsApiService } from '../../../../core/services/cms-api.service';

@Component({
  selector: 'app-refund-policy',
  standalone: true,
  imports: [CommonModule, CmsPageComponent],
  template: `
    <div *ngIf="loading" style="display:flex;align-items:center;justify-content:center;padding:80px 0;">
      <div style="width:36px;height:36px;border:3px solid #e5e7eb;border-top-color:#059669;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
    </div>
    <app-cms-page *ngIf="!loading" [title]="'Refund Policy'" [content]="content" />
  `,
  styles: [`@keyframes spin{to{transform:rotate(360deg)}}`],
})
export class RefundPolicyComponent implements OnInit {
  private cmsApi = inject(CmsApiService);
  content = '';
  loading = true;
  ngOnInit(): void {
    this.cmsApi.getCmsPage('refund-policy').subscribe({
      next: (res) => { if (res.data?.content) this.content = res.data.content; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }
}
