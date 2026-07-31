import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ReportApiService } from '../../../../core/services/report-api.service';
import { ScheduledReport } from '../../../../core/models/report/report.model';

@Component({
  selector: 'app-scheduled-reports',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  template: `
    <div *ngIf="loading" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #e5e7eb; border-top-color: #059669; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
        <p style="font-size: 13px; color: #9ca3af;">Loading scheduled reports...</p>
      </div>
    </div>

    <div *ngIf="!loading" style="animation: fadeIn 0.3s ease-out; max-width: 1280px; margin: 0 auto; padding: 0 24px 60px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <a routerLink="/admin/dashboard" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Dashboard</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <a routerLink="/admin/reports" style="font-size: 12px; color: #9ca3af; text-decoration: none; transition: color 0.2s ease;"
          onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#9ca3af'">Reports</a>
        <span class="material-icons" style="font-size: 14px; color: #d1d5db;">chevron_right</span>
        <span style="font-size: 12px; color: #374151; font-weight: 600;">Scheduled Reports</span>
      </div>

      <div style="margin-bottom: 24px;">
        <h1 style="font-size: 24px; font-weight: 800; color: #166534; margin: 8px 0 4px 0;">Scheduled Reports</h1>
        <p style="font-size: 13px; color: #9ca3af; margin: 0;">Automated reports generated on a schedule</p>
      </div>

      <div *ngIf="reports.length === 0" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 24px;">
        <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
          <span class="material-icons" style="font-size: 32px; color: #059669;">schedule</span>
        </div>
        <h3 style="font-size: 16px; font-weight: 700; color: #166534; margin: 0 0 4px 0;">No scheduled reports</h3>
        <p style="font-size: 13px; color: #9ca3af; text-align: center; max-width: 280px; margin: 0;">Scheduled reports will appear here</p>
      </div>

      <div *ngIf="reports.length" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;">
        <div *ngFor="let report of reports; let i = index" style="background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 20px; display: flex; flex-direction: column; gap: 12px; transition: all 0.2s ease;"
          [style.background]="i % 2 === 0 ? 'white' : '#f9fafb'"
          onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;">
            <h3 style="font-size: 15px; font-weight: 700; color: #166534; margin: 0;">{{ report.report_name }}</h3>
            <button (click)="deleteReport(report.id)"
              style="background: transparent; border: none; cursor: pointer; padding: 4px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; transition: all 0.15s ease;"
              onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='transparent'">
              <span class="material-icons" style="font-size: 20px; color: #dc2626;">delete</span>
            </button>
          </div>

          <span style="display: inline-block; align-self: flex-start; padding: 2px 10px; font-size: 12px; font-weight: 600; border-radius: 8px; background: #faf5ff; color: #7c3aed;">
            {{ report.report_type }}
          </span>

          <div style="display: flex; align-items: center; gap: 16px; font-size: 13px; color: #4b5563;">
            <div style="display: flex; align-items: center; gap: 4px;">
              <span class="material-icons" style="font-size: 16px; color: #9ca3af;">repeat</span>
              <span>{{ report.frequency }}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; margin-left: auto;">
              <span style="font-size: 12px; font-weight: 600; color: #6b7280;">Active</span>
              <div style="width: 40px; height: 22px; border-radius: 999px; position: relative; transition: background 0.2s ease;"
                [style.background]="report.is_active ? '#059669' : '#e5e7eb'">
                <div style="position: absolute; top: 2px; width: 18px; height: 18px; border-radius: 50%; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.2); transition: left 0.2s ease;"
                  [style.left]="report.is_active ? '20px' : '2px'"></div>
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; color: #6b7280; margin-top: 4px;">
            <div>
              <span style="font-weight: 600; color: #374151;">Next run:</span>
              <br />
              {{ report.next_run_at | date: 'short' }}
            </div>
            <div>
              <span style="font-weight: 600; color: #374151;">Last run:</span>
              <br />
              {{ report.last_run_at ? (report.last_run_at | date: 'short') : 'Never' }}
            </div>
          </div>

          <div *ngIf="report.delivery_channels?.length" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
            <span *ngFor="let channel of report.delivery_channels" style="padding: 3px 10px; font-size: 12px; border-radius: 8px; background: #ecfdf5; color: #047857;">
              {{ channel }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <style>
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
  `,
})
export class ScheduledReportsComponent implements OnInit {
  private reportApi = inject(ReportApiService);

  loading = true;
  reports: ScheduledReport[] = [];

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loading = true;
    this.reportApi.getScheduledReports().subscribe({
      next: (res) => {
        this.reports = res.data ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  deleteReport(id: number): void {
    this.reportApi.deleteScheduledReport(id).subscribe({
      next: () => this.loadReports(),
    });
  }
}
