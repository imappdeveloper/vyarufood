import { Component, inject, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { SettingsApiService } from '../../../../core/services/settings-api.service';
import { SystemBackup, BackupStats, BACKUP_TYPES } from '../../../../core/models/setting/system-backup.model';

@Component({
  selector: 'app-backup-manager',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  styles: [`
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
  template: `
    <div style="background:#f8fafc;min-height:100vh;">
      <div style="position:relative;background:linear-gradient(135deg,#059669,#047857,#166534);padding:32px 40px 56px;overflow:hidden;">
        <div style="position:absolute;top:-30px;right:-30px;width:180px;height:180px;background:rgba(255,255,255,0.06);border-radius:50%;"></div>
        <div style="position:absolute;bottom:-40px;left:20%;width:140px;height:140px;background:rgba(255,255,255,0.04);border-radius:50%;"></div>
        <div style="max-width:1200px;margin:0 auto;position:relative;z-index:2;">
          <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:rgba(255,255,255,0.75);margin-bottom:16px;">
            <a routerLink="/admin/settings" style="color:rgba(255,255,255,0.75);text-decoration:none;transition:color 0.2s;"
              onmouseenter="this.style.color='#a7f3d0'" onmouseleave="this.style.color='rgba(255,255,255,0.75)'">Settings</a>
            <span class="material-icons" style="font-size:14px;line-height:1;color:rgba(255,255,255,0.4);">chevron_right</span>
            <span style="color:white;font-weight:500;">Backup Manager</span>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div>
              <h1 style="font-size:28px;font-weight:800;color:white;margin:0 0 6px 0;">
                <span class="material-icons" style="font-size:24px;vertical-align:middle;margin-right:8px;">backup</span>
                Backup Manager
              </h1>
              <p style="font-size:14px;color:rgba(255,255,255,0.85);margin:0;">Create, manage, and monitor system backups</p>
            </div>
          </div>
        </div>
        <svg style="position:absolute;bottom:-2px;left:0;width:100%;height:40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f8fafc"/>
        </svg>
      </div>

      <div style="padding:0 32px 32px;margin-top:-20px;">
        @if (!statsLoading) {
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px;margin-bottom:24px;">
            <div style="background:white;border-radius:12px;padding:18px 20px;box-shadow:0 1px 3px rgba(0,0,0,0.04);display:flex;align-items:center;gap:14px;transition:all 0.2s;cursor:default;"
              onmouseenter="this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)';this.style.transform='translateY(-2px)'"
              onmouseleave="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)';this.style.transform='translateY(0)'">
              <div style="width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#ecfdf5;">
                <span class="material-icons" style="font-size:20px;line-height:1;color:#059669;">storage</span>
              </div>
              <div><div style="font-size:11px;font-weight:500;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Total Size</div><div style="font-size:24px;font-weight:700;color:#0f172a;margin-top:1px;">{{ formatSize(stats?.total_size || 0) }}</div></div>
            </div>
            <div style="background:white;border-radius:12px;padding:18px 20px;box-shadow:0 1px 3px rgba(0,0,0,0.04);display:flex;align-items:center;gap:14px;transition:all 0.2s;cursor:default;"
              onmouseenter="this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)';this.style.transform='translateY(-2px)'"
              onmouseleave="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)';this.style.transform='translateY(0)'">
              <div style="width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#d1fae5;">
                <span class="material-icons" style="font-size:20px;line-height:1;color:#059669;">check_circle</span>
              </div>
              <div><div style="font-size:11px;font-weight:500;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Completed</div><div style="font-size:24px;font-weight:700;color:#0f172a;margin-top:1px;">{{ stats?.status_counts?.['completed'] || 0 }}</div></div>
            </div>
            <div style="background:white;border-radius:12px;padding:18px 20px;box-shadow:0 1px 3px rgba(0,0,0,0.04);display:flex;align-items:center;gap:14px;transition:all 0.2s;cursor:default;"
              onmouseenter="this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)';this.style.transform='translateY(-2px)'"
              onmouseleave="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)';this.style.transform='translateY(0)'">
              <div style="width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#fef3c7;">
                <span class="material-icons" style="font-size:20px;line-height:1;color:#f59e0b;">pending</span>
              </div>
              <div><div style="font-size:11px;font-weight:500;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Pending</div><div style="font-size:24px;font-weight:700;color:#0f172a;margin-top:1px;">{{ (stats?.status_counts?.['pending'] || 0) + (stats?.status_counts?.['in_progress'] || 0) }}</div></div>
            </div>
            <div style="background:white;border-radius:12px;padding:18px 20px;box-shadow:0 1px 3px rgba(0,0,0,0.04);display:flex;align-items:center;gap:14px;transition:all 0.2s;cursor:default;"
              onmouseenter="this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)';this.style.transform='translateY(-2px)'"
              onmouseleave="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)';this.style.transform='translateY(0)'">
              <div style="width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#fef2f2;">
                <span class="material-icons" style="font-size:20px;line-height:1;color:#ef4444;">error</span>
              </div>
              <div><div style="font-size:11px;font-weight:500;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Failed</div><div style="font-size:24px;font-weight:700;color:#0f172a;margin-top:1px;">{{ stats?.status_counts?.['failed'] || 0 }}</div></div>
            </div>
          </div>
        }

        <div style="background:white;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.04);padding:20px 24px;margin-bottom:24px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
            <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#ecfdf5;">
              <span class="material-icons" style="font-size:20px;line-height:1;color:#059669;">add_circle</span>
            </div>
            <div>
              <div style="font-size:15px;font-weight:600;color:#0f172a;">Create New Backup</div>
              <div style="font-size:12px;color:#64748b;">Start a new system backup</div>
            </div>
          </div>
          <form [formGroup]="backupForm" (ngSubmit)="createBackup()" style="display:flex;flex-wrap:wrap;align-items:flex-start;gap:12px;">
            <div style="flex:1;min-width:200px;">
              <input formControlName="backup_name" placeholder="e.g. pre-release-backup"
                style="width:100%;padding:10px 14px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;outline:none;transition:border-color 0.2s;background:#f8fafc;"
                [style.borderColor]="backupForm.get('backup_name')?.invalid && backupForm.get('backup_name')?.touched ? '#ef4444' : '#e2e8f0'"
                onfocus="this.style.borderColor='#34d399';this.style.background='white'"
                onblur="this.style.borderColor='#e2e8f0';this.style.background='#f8fafc'" />
            </div>
            <div style="min-width:140px;">
              <select formControlName="backup_type"
                style="width:100%;padding:10px 32px 10px 14px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;outline:none;cursor:pointer;appearance:none;background:#f8fafc url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2394a3b8%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22/%3E%3C/svg%3E') no-repeat right 10px center;"
                onfocus="this.style.borderColor='#34d599'" onblur="this.style.borderColor='#e2e8f0'">
                @for (t of backupTypes; track t) {
                  <option [value]="t">{{ t | titlecase }}</option>
                }
              </select>
            </div>
            <button type="submit" [disabled]="backupForm.invalid || isCreating"
              style="display:inline-flex;align-items:center;gap:8px;padding:10px 24px;background:linear-gradient(135deg,#059669,#16a34a);color:white;font-size:13px;font-weight:700;border:none;border-radius:8px;cursor:pointer;transition:all 0.3s ease;box-shadow:0 4px 12px rgba(5,150,105,0.2);white-space:nowrap;"
              [style.opacity]="backupForm.invalid || isCreating ? '0.6' : '1'"
              [style.cursor]="backupForm.invalid || isCreating ? 'not-allowed' : 'pointer'"
              onmouseenter="if(!this.disabled){this.style.boxShadow='0 6px 20px rgba(5,150,105,0.3)';this.style.transform='translateY(-1px)'}"
              onmouseleave="if(!this.disabled){this.style.boxShadow='0 4px 12px rgba(5,150,105,0.2)';this.style.transform='translateY(0)'}">
              @if (isCreating) {
                <div style="width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
              } @else {
                <span class="material-icons" style="font-size:16px;line-height:1;">backup</span>
              }
              Create Backup
            </button>
          </form>
        </div>

        <div style="background:white;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.04);overflow:hidden;">
          <div style="padding:14px 20px;border-bottom:1px solid #e2e8f0;">
            <span style="font-size:14px;font-weight:600;color:#0f172a;">Backup History</span>
          </div>
          @if (loading) {
            <div style="display:flex;justify-content:center;padding:64px 0;">
              <div style="width:36px;height:36px;border-radius:50%;border:3px solid #d1fae5;border-top-color:#059669;animation:spin 0.8s linear infinite;"></div>
            </div>
          } @else if (backups.length === 0) {
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 24px;">
              <div style="width:72px;height:72px;border-radius:16px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;background:linear-gradient(135deg,#ecfdf5,#d1fae5);">
                <span class="material-icons" style="font-size:32px;line-height:1;color:#059669;">backup</span>
              </div>
              <div style="font-size:16px;font-weight:600;color:#0f172a;margin-bottom:4px;">No backups found</div>
              <p style="font-size:13px;color:#64748b;text-align:center;max-width:300px;">Create your first backup using the form above.</p>
            </div>
          } @else {
            <div style="overflow-x:auto;">
              <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <thead>
                  <tr style="background:#f8fafc;border-bottom:1px solid #e2e8f0;">
                    <th style="text-align:left;padding:12px 16px;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;">Name</th>
                    <th style="text-align:left;padding:12px 16px;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;">Type</th>
                    <th style="text-align:left;padding:12px 16px;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;">Size</th>
                    <th style="text-align:center;padding:12px 16px;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;">Status</th>
                    <th style="text-align:left;padding:12px 16px;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;">Duration</th>
                    <th style="text-align:left;padding:12px 16px;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;">Created At</th>
                    <th style="text-align:center;padding:12px 16px;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;width:60px;"></th>
                  </tr>
                </thead>
                <tbody>
                  @for (row of backups; track row.uuid) {
                    <tr style="border-bottom:1px solid #f1f5f9;transition:background 0.15s;"
                      onmouseenter="this.style.background='#f8fafc'" onmouseleave="this.style.background='transparent'">
                      <td style="padding:14px 16px;">
                        <span style="display:flex;align-items:center;gap:8px;">
                          <span class="material-icons" style="font-size:16px;line-height:1;color:#059669;">backup</span>
                          <span style="font-weight:600;color:#0f172a;">{{ row.backup_name }}</span>
                        </span>
                      </td>
                      <td style="padding:14px 16px;">
                        <span style="display:inline-flex;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;" [style]="getTypeStyle(row.backup_type)">{{ row.backup_type_label || row.backup_type }}</span>
                      </td>
                      <td style="padding:14px 16px;">
                        <span style="color:#475569;">{{ row.file_size_formatted || formatSize(row.file_size) }}</span>
                      </td>
                      <td style="text-align:center;padding:14px 16px;">
                        <span style="display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;padding:4px 12px;border-radius:20px;" [style]="getStatusStyle(row.status)">
                          <span style="width:6px;height:6px;border-radius:50%;" [style.background]="getStatusDotColor(row.status)"></span>
                          {{ row.status_label || row.status }}
                        </span>
                      </td>
                      <td style="padding:14px 16px;">
                        <span style="color:#64748b;">{{ row.duration || '—' }}</span>
                      </td>
                      <td style="padding:14px 16px;">
                        <span style="color:#64748b;white-space:nowrap;">{{ row.created_at | date:'medium' }}</span>
                      </td>
                      <td style="text-align:center;padding:14px 16px;">
                        <div style="position:relative;" (click)="$event.stopPropagation()">
                          <button (click)="toggleMenu(row.uuid)"
                            style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border:none;border-radius:6px;cursor:pointer;background:transparent;color:#94a3b8;transition:all 0.15s;"
                            onmouseenter="this.style.background='#f1f5f9';this.style.color='#475569'" onmouseleave="this.style.background='transparent';this.style.color='#94a3b8'">
                            <span class="material-icons" style="font-size:18px;line-height:1;">more_vert</span>
                          </button>
                          @if (openMenuUuid === row.uuid) {
                            <div style="position:absolute;right:0;top:100%;margin-top:4px;background:white;border-radius:10px;box-shadow:0 10px 40px rgba(0,0,0,0.15);border:1px solid #e2e8f0;z-index:50;min-width:140px;overflow:hidden;padding:4px;">
                              <button (click)="deleteBackup(row.uuid)"
                                style="display:flex;align-items:center;gap:8px;width:100%;padding:8px 12px;border:none;background:transparent;cursor:pointer;font-size:13px;color:#ef4444;border-radius:6px;text-align:left;transition:background 0.1s;"
                                onmouseenter="this.style.background='#fef2f2'" onmouseleave="this.style.background='transparent'">
                                <span class="material-icons" style="font-size:16px;line-height:1;">delete</span> Delete
                              </button>
                            </div>
                          }
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-top:1px solid #e2e8f0;">
              <span style="font-size:12px;color:#64748b;">
                Showing {{ currentPage * pageSize + 1 }}–{{ Math.min((currentPage + 1) * pageSize, totalCount) }} of {{ totalCount }}
              </span>
              <div style="display:flex;align-items:center;gap:4px;">
                <button (click)="goToPage(0)" [disabled]="currentPage === 0"
                  style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border:1px solid #e2e8f0;border-radius:6px;background:white;cursor:pointer;color:#475569;transition:all 0.15s;font-size:16px;"
                  [style.opacity]="currentPage === 0 ? '0.4' : '1'"
                  onmouseenter="if(!this.disabled){this.style.background='#f1f5f9'}" onmouseleave="this.style.background='white'">
                  <span class="material-icons" style="font-size:16px;line-height:1;">first_page</span>
                </button>
                <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 0"
                  style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border:1px solid #e2e8f0;border-radius:6px;background:white;cursor:pointer;color:#475569;transition:all 0.15s;font-size:16px;"
                  [style.opacity]="currentPage === 0 ? '0.4' : '1'"
                  onmouseenter="if(!this.disabled){this.style.background='#f1f5f9'}" onmouseleave="this.style.background='white'">
                  <span class="material-icons" style="font-size:16px;line-height:1;">chevron_left</span>
                </button>
                <span style="font-size:12px;color:#475569;padding:0 8px;font-weight:500;">Page {{ currentPage + 1 }} of {{ totalPages }}</span>
                <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage >= totalPages - 1"
                  style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border:1px solid #e2e8f0;border-radius:6px;background:white;cursor:pointer;color:#475569;transition:all 0.15s;font-size:16px;"
                  [style.opacity]="currentPage >= totalPages - 1 ? '0.4' : '1'"
                  onmouseenter="if(!this.disabled){this.style.background='#f1f5f9'}" onmouseleave="this.style.background='white'">
                  <span class="material-icons" style="font-size:16px;line-height:1;">chevron_right</span>
                </button>
                <button (click)="goToPage(totalPages - 1)" [disabled]="currentPage >= totalPages - 1"
                  style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border:1px solid #e2e8f0;border-radius:6px;background:white;cursor:pointer;color:#475569;transition:all 0.15s;font-size:16px;"
                  [style.opacity]="currentPage >= totalPages - 1 ? '0.4' : '1'"
                  onmouseenter="if(!this.disabled){this.style.background='#f1f5f9'}" onmouseleave="this.style.background='white'">
                  <span class="material-icons" style="font-size:16px;line-height:1;">last_page</span>
                </button>
              </div>
            </div>
          }
        </div>
      </div>

      @if (feedbackMessage) {
        <div style="position:fixed;bottom:24px;right:24px;z-index:50;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:500;box-shadow:0 10px 40px rgba(0,0,0,0.15);transition:all 0.3s;display:flex;align-items:center;gap:8px;"
          [style.background]="feedbackType === 'success' ? '#059669' : '#ef4444'"
          [style.color]="'white'">
          <span class="material-icons" style="font-size:18px;line-height:1;">{{ feedbackType === 'success' ? 'check_circle' : 'error_outline' }}</span>
          {{ feedbackMessage }}
        </div>
      }
    </div>
  `,
})
export class BackupManagerComponent implements OnInit {
  private settingsApi = inject(SettingsApiService);

  Math = Math;

  backups: SystemBackup[] = [];
  stats: BackupStats | null = null;
  statsLoading = false;
  loading = false;
  isCreating = false;
  currentPage = 0;
  pageSize = 15;
  totalCount = 0;

  backupTypes = BACKUP_TYPES;

  backupForm = new FormGroup({
    backup_name: new FormControl('', Validators.required),
    backup_type: new FormControl('full', Validators.required),
  });

  openMenuUuid: string | null = null;

  feedbackMessage = '';
  feedbackType: 'success' | 'error' = 'success';

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize) || 1;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openMenuUuid = null;
  }

  ngOnInit(): void {
    this.loadBackups();
    this.loadStats();
  }

  loadBackups(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: (this.currentPage + 1).toString(),
      per_page: this.pageSize.toString(),
    };

    this.settingsApi.getBackups(params).subscribe({
      next: (res) => {
        this.backups = res.data || [];
        this.totalCount = res.meta?.total || this.backups.length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showFeedback('Failed to load backups', 'error');
      },
    });
  }

  loadStats(): void {
    this.statsLoading = true;
    this.settingsApi.getBackupStats().subscribe({
      next: (res) => { this.stats = res.data || null; this.statsLoading = false; },
      error: () => { this.statsLoading = false; },
    });
  }

  createBackup(): void {
    if (this.backupForm.invalid) return;
    this.isCreating = true;

    const formValue = this.backupForm.value;
    this.settingsApi.createBackup({
      backup_name: formValue.backup_name!,
      backup_type: formValue.backup_type!,
    }).subscribe({
      next: () => {
        this.isCreating = false;
        this.backupForm.reset({ backup_name: '', backup_type: 'full' });
        this.showFeedback('Backup creation started successfully', 'success');
        this.loadBackups();
        this.loadStats();
      },
      error: (err) => {
        this.isCreating = false;
        this.showFeedback(err.error?.message || 'Failed to create backup', 'error');
      },
    });
  }

  deleteBackup(uuid: string): void {
    this.openMenuUuid = null;
    if (window.confirm('Delete this backup? This cannot be undone.')) {
      this.settingsApi.deleteBackup(uuid).subscribe({
        next: () => {
          this.showFeedback('Backup deleted successfully', 'success');
          this.loadBackups();
          this.loadStats();
        },
        error: (err) => this.showFeedback(err.error?.message || 'Failed to delete backup', 'error'),
      });
    }
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadBackups();
  }

  toggleMenu(uuid: string): void {
    this.openMenuUuid = this.openMenuUuid === uuid ? null : uuid;
  }

  getStatusStyle(status: string): string {
    switch (status) {
      case 'completed': return 'background:#d1fae5;color:#065f46;';
      case 'pending': return 'background:#fef3c7;color:#92400e;';
      case 'in_progress': return 'background:#dbeafe;color:#1e40af;';
      case 'failed': return 'background:#fef2f2;color:#dc2626;';
      default: return 'background:#f3f4f6;color:#9ca3af;';
    }
  }

  getStatusDotColor(status: string): string {
    switch (status) {
      case 'completed': return '#059669';
      case 'pending': return '#f59e0b';
      case 'in_progress': return '#3b82f6';
      case 'failed': return '#ef4444';
      default: return '#d1d5db';
    }
  }

  getTypeStyle(type: string): string {
    switch (type) {
      case 'full': return 'background:#e0e7ff;color:#4338ca;';
      case 'database': return 'background:#d1fae5;color:#065f46;';
      case 'storage': return 'background:#fef3c7;color:#92400e;';
      default: return 'background:#f3f4f6;color:#6b7280;';
    }
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  showFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage = message;
    this.feedbackType = type;
    setTimeout(() => { this.feedbackMessage = ''; }, 3000);
  }
}
