import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SettingsApiService } from '../../../../core/services/settings-api.service';
import { SystemSetting, SETTING_GROUPS } from '../../../../core/models/setting/system-setting.model';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div style="background:#f8fafc;min-height:100vh;">
      <div style="background:linear-gradient(135deg,#022c22,#064e3b,#065f46);padding:32px 40px 40px;">
        <div style="display:flex;align-items:center;gap:8px;font-size:13px;margin-bottom:12px;">
          <a routerLink="/admin/settings" style="color:rgba(167,243,208,0.7);text-decoration:none;transition:color 0.2s;"
            onmouseenter="this.style.color='#a7f3d0'" onmouseleave="this.style.color='rgba(167,243,208,0.7)'">Settings</a>
          <span class="material-icons" style="font-size:14px;color:rgba(167,243,208,0.4);line-height:1;">chevron_right</span>
          <span style="color:#a7f3d0;font-weight:500;">System Settings</span>
        </div>
        <h1 style="font-size:24px;font-weight:700;color:white;letter-spacing:-0.02em;">System Settings</h1>
        <p style="color:rgba(167,243,208,0.7);margin-top:4px;font-size:14px;">Manage all application configuration settings</p>
      </div>

      <div style="padding:0 32px 32px;margin-top:-20px;">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px;margin-bottom:24px;">
          <div style="background:white;border-radius:12px;padding:18px 20px;box-shadow:0 1px 3px rgba(0,0,0,0.04);display:flex;align-items:center;gap:14px;transition:all 0.2s;cursor:default;"
            onmouseenter="this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)';this.style.transform='translateY(-2px)'"
            onmouseleave="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)';this.style.transform='translateY(0)'">
            <div style="width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#ecfdf5;">
              <span class="material-icons" style="font-size:20px;line-height:1;color:#059669;">settings</span>
            </div>
            <div><div style="font-size:11px;font-weight:500;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Total</div><div style="font-size:24px;font-weight:700;color:#0f172a;margin-top:1px;">{{ totalCount }}</div></div>
          </div>
          <div style="background:white;border-radius:12px;padding:18px 20px;box-shadow:0 1px 3px rgba(0,0,0,0.04);display:flex;align-items:center;gap:14px;transition:all 0.2s;cursor:default;"
            onmouseenter="this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)';this.style.transform='translateY(-2px)'"
            onmouseleave="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)';this.style.transform='translateY(0)'">
            <div style="width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#f0f9ff;">
              <span class="material-icons" style="font-size:20px;line-height:1;color:#0284c7;">check_circle</span>
            </div>
            <div><div style="font-size:11px;font-weight:500;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Active</div><div style="font-size:24px;font-weight:700;color:#0f172a;margin-top:1px;">{{ activeCount }}</div></div>
          </div>
          <div style="background:white;border-radius:12px;padding:18px 20px;box-shadow:0 1px 3px rgba(0,0,0,0.04);display:flex;align-items:center;gap:14px;transition:all 0.2s;cursor:default;"
            onmouseenter="this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)';this.style.transform='translateY(-2px)'"
            onmouseleave="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)';this.style.transform='translateY(0)'">
            <div style="width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#fefce8;">
              <span class="material-icons" style="font-size:20px;line-height:1;color:#ca8a04;">pause_circle</span>
            </div>
            <div><div style="font-size:11px;font-weight:500;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Inactive</div><div style="font-size:24px;font-weight:700;color:#0f172a;margin-top:1px;">{{ inactiveCount }}</div></div>
          </div>
          <div style="background:white;border-radius:12px;padding:18px 20px;box-shadow:0 1px 3px rgba(0,0,0,0.04);display:flex;align-items:center;gap:14px;transition:all 0.2s;cursor:default;"
            onmouseenter="this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)';this.style.transform='translateY(-2px)'"
            onmouseleave="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)';this.style.transform='translateY(0)'">
            <div style="width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#fffbeb;">
              <span class="material-icons" style="font-size:20px;line-height:1;color:#d97706;">lock</span>
            </div>
            <div><div style="font-size:11px;font-weight:500;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Encrypted</div><div style="font-size:24px;font-weight:700;color:#0f172a;margin-top:1px;">{{ encryptedCount }}</div></div>
          </div>
        </div>

        <div style="background:white;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.04);margin-bottom:16px;">
          <div style="display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:14px 18px;">
            <div style="position:relative;flex:1;min-width:180px;">
              <span class="material-icons" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:18px;line-height:1;color:#94a3b8;">search</span>
              <input [(ngModel)]="searchQuery" (input)="onSearchInput()" placeholder="Search settings..."
                style="width:100%;padding:9px 12px 9px 38px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;outline:none;transition:border-color 0.2s;background:#f8fafc;"
                onfocus="this.style.borderColor='#34d399';this.style.background='white'"
                onblur="this.style.borderColor='#e2e8f0';this.style.background='#f8fafc'" />
              @if (searchQuery) {
                <button (click)="searchQuery = ''; applyFilters()"
                  style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;padding:4px;color:#94a3b8;">
                  <span class="material-icons" style="font-size:16px;line-height:1;">close</span>
                </button>
              }
            </div>
            <select [(ngModel)]="groupFilter" (change)="applyFilters()"
              style="padding:9px 32px 9px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;outline:none;cursor:pointer;min-width:150px;appearance:none;background:#f8fafc url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2394a3b8%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22/%3E%3C/svg%3E') no-repeat right 10px center;"
              onfocus="this.style.borderColor='#34d399'" onblur="this.style.borderColor='#e2e8f0'">
              <option value="">All Groups</option>
              @for (group of groups; track group) {
                <option [value]="group">{{ group | titlecase }}</option>
              }
            </select>
            <select [(ngModel)]="statusFilter" (change)="applyFilters()"
              style="padding:9px 32px 9px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;outline:none;cursor:pointer;min-width:130px;appearance:none;background:#f8fafc url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2394a3b8%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22/%3E%3C/svg%3E') no-repeat right 10px center;"
              onfocus="this.style.borderColor='#34d399'" onblur="this.style.borderColor='#e2e8f0'">
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            @if (searchQuery || groupFilter || statusFilter) {
              <button (click)="clearFilters()"
                style="display:flex;align-items:center;gap:4px;padding:9px 14px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;cursor:pointer;background:#f8fafc;color:#475569;transition:all 0.2s;white-space:nowrap;"
                onmouseenter="this.style.borderColor='#cbd5e1';this.style.background='#f1f5f9'"
                onmouseleave="this.style.borderColor='#e2e8f0';this.style.background='#f8fafc'">
                <span class="material-icons" style="font-size:16px;line-height:1;">filter_alt_off</span> Clear
              </button>
            }
          </div>
        </div>

        <div style="background:white;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.04);overflow:hidden;">
          @if (loading) {
            <div style="display:flex;justify-content:center;padding:64px 0;">
              <div style="width:36px;height:36px;border-radius:50%;border:3px solid #d1fae5;border-top-color:#059669;animation:spin 0.8s linear infinite;"></div>
            </div>
          } @else if (settings.length === 0) {
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 24px;">
              <div style="width:72px;height:72px;border-radius:16px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;background:linear-gradient(135deg,#ecfdf5,#d1fae5);">
                <span class="material-icons" style="font-size:32px;line-height:1;color:#059669;">tune</span>
              </div>
              <div style="font-size:16px;font-weight:600;color:#0f172a;margin-bottom:4px;">No settings found</div>
              <p style="font-size:13px;color:#64748b;text-align:center;max-width:300px;">
                @if (searchQuery || groupFilter || statusFilter) {
                  Try adjusting your search or filter criteria
                } @else {
                  No settings have been configured yet.
                }
              </p>
            </div>
          } @else {
            <div style="overflow-x:auto;">
              <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <thead>
                  <tr style="background:#f8fafc;border-bottom:1px solid #e2e8f0;">
                    <th style="text-align:left;padding:12px 16px;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;">Group</th>
                    <th style="text-align:left;padding:12px 16px;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;">Key</th>
                    <th style="text-align:left;padding:12px 16px;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;">Value</th>
                    <th style="text-align:left;padding:12px 16px;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;">Type</th>
                    <th style="text-align:center;padding:12px 16px;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;">Encrypted</th>
                    <th style="text-align:center;padding:12px 16px;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;">Status</th>
                    <th style="text-align:center;padding:12px 16px;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;width:60px;"></th>
                  </tr>
                </thead>
                <tbody>
                  @for (row of settings; track row.uuid) {
                    <tr style="border-bottom:1px solid #f1f5f9;transition:background 0.15s;"
                      onmouseenter="this.style.background='#f8fafc'" onmouseleave="this.style.background='transparent'">
                      <td style="padding:14px 16px;">
                        <span style="display:inline-flex;align-items:center;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:500;background:#f0fdf5;color:#047857;">{{ row.setting_group }}</span>
                      </td>
                      <td style="padding:14px 16px;">
                        <span style="font-family:'JetBrains Mono','Fira Code',monospace;font-size:12px;font-weight:600;color:#059669;">{{ row.setting_key }}</span>
                      </td>
                      <td style="padding:14px 16px;">
                        @if (editingUuid === row.uuid) {
                          <div style="display:flex;align-items:center;gap:6px;">
                            <input [(ngModel)]="editValue" (keyup.enter)="saveInlineEdit(row)" (keyup.escape)="cancelInlineEdit()"
                              style="flex:1;padding:6px 10px;border:1px solid #34d399;border-radius:6px;font-size:13px;outline:none;background:white;min-width:140px;"
                              onfocus="this.style.boxShadow='0 0 0 3px rgba(16,185,129,0.1)'" onblur="this.style.boxShadow='none'" />
                            <button (click)="saveInlineEdit(row)"
                              style="display:flex;align-items:center;justify-content:center;width:30px;height:30px;border:none;border-radius:6px;cursor:pointer;background:#ecfdf5;color:#059669;transition:all 0.15s;"
                              onmouseenter="this.style.background='#d1fae5'" onmouseleave="this.style.background='#ecfdf5'">
                              <span class="material-icons" style="font-size:16px;line-height:1;">check</span>
                            </button>
                            <button (click)="cancelInlineEdit()"
                              style="display:flex;align-items:center;justify-content:center;width:30px;height:30px;border:none;border-radius:6px;cursor:pointer;background:#fef2f2;color:#ef4444;transition:all 0.15s;"
                              onmouseenter="this.style.background='#fee2e2'" onmouseleave="this.style.background='#fef2f2'">
                              <span class="material-icons" style="font-size:16px;line-height:1;">close</span>
                            </button>
                          </div>
                        } @else {
                          <span (click)="startInlineEdit(row)" style="cursor:pointer;color:#334155;transition:color 0.15s;display:inline-flex;align-items:center;gap:4px;max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"
                            onmouseenter="this.style.color='#059669'" onmouseleave="this.style.color='#334155'">
                            {{ row.setting_value ?? '—' }}
                            <span class="material-icons" style="font-size:14px;line-height:1;opacity:0;transition:opacity 0.15s;" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0'">edit</span>
                          </span>
                        }
                      </td>
                      <td style="padding:14px 16px;">
                        <span style="display:inline-flex;align-items:center;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:500;background:#f1f5f9;color:#475569;">{{ row.data_type }}</span>
                      </td>
                      <td style="text-align:center;padding:14px 16px;">
                        @if (row.is_encrypted) {
                          <span class="material-icons" style="font-size:18px;line-height:1;color:#d97706;">lock</span>
                        } @else {
                          <span class="material-icons" style="font-size:18px;line-height:1;color:#cbd5e1;">lock_open</span>
                        }
                      </td>
                      <td style="text-align:center;padding:14px 16px;">
                        <button (click)="toggleStatus(row, row.status !== 'active')"
                          style="position:relative;width:40px;height:22px;border-radius:11px;border:none;cursor:pointer;transition:background 0.2s;padding:0;"
                          [style.background]="row.status === 'active' ? '#059669' : '#cbd5e1'">
                          <span style="position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:white;transition:transform 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.15);display:block;"
                            [style.transform]="row.status === 'active' ? 'translateX(18px)' : 'translateX(0)'"></span>
                        </button>
                      </td>
                      <td style="text-align:center;padding:14px 16px;">
                        <div style="position:relative;" (click)="$event.stopPropagation()">
                          <button (click)="openMenu(row.uuid)"
                            style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border:none;border-radius:6px;cursor:pointer;background:transparent;color:#94a3b8;transition:all 0.15s;"
                            onmouseenter="this.style.background='#f1f5f9';this.style.color='#475569'" onmouseleave="this.style.background='transparent';this.style.color='#94a3b8'">
                            <span class="material-icons" style="font-size:18px;line-height:1;">more_vert</span>
                          </button>
                          @if (openMenuUuid === row.uuid) {
                            <div style="position:absolute;right:0;top:100%;margin-top:4px;background:white;border-radius:10px;box-shadow:0 10px 40px rgba(0,0,0,0.15);border:1px solid #e2e8f0;z-index:50;min-width:160px;overflow:hidden;padding:4px;">
                              <button (click)="startInlineEdit(row); openMenuUuid = null"
                                style="display:flex;align-items:center;gap:8px;width:100%;padding:8px 12px;border:none;background:transparent;cursor:pointer;font-size:13px;color:#334155;border-radius:6px;text-align:left;transition:background 0.1s;"
                                onmouseenter="this.style.background='#f1f5f9'" onmouseleave="this.style.background='transparent'">
                                <span class="material-icons" style="font-size:16px;line-height:1;color:#059669;">edit</span> Edit Value
                              </button>
                              <button (click)="deleteSetting(row.uuid)"
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
  styles: [`
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
})
export class SystemSettingsComponent implements OnInit {
  private settingsApi = inject(SettingsApiService);

  Math = Math;

  settings: SystemSetting[] = [];
  displayedColumns = ['setting_group', 'setting_key', 'setting_value', 'data_type', 'is_encrypted', 'status', 'actions'];

  loading = false;
  currentPage = 0;
  pageSize = 15;
  totalCount = 0;
  activeCount = 0;
  inactiveCount = 0;
  encryptedCount = 0;

  searchQuery = '';
  groupFilter = '';
  statusFilter = '';
  groups = SETTING_GROUPS;

  editingUuid: string | null = null;
  editValue = '';
  openMenuUuid: string | null = null;
  searchDebounceTimer: any = null;

  feedbackMessage = '';
  feedbackType: 'success' | 'error' = 'success';

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize) || 1;
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: (this.currentPage + 1).toString(),
      per_page: this.pageSize.toString(),
    };
    if (this.searchQuery) params['search'] = this.searchQuery;
    if (this.groupFilter) params['setting_group'] = this.groupFilter;
    if (this.statusFilter) params['status'] = this.statusFilter;

    this.settingsApi.getSettings(params).subscribe({
      next: (res) => {
        this.settings = res.data || [];
        this.totalCount = res.meta?.total || this.settings.length;
        this.activeCount = this.settings.filter(s => s.status === 'active').length;
        this.inactiveCount = this.settings.filter(s => s.status === 'inactive').length;
        this.encryptedCount = this.settings.filter(s => s.is_encrypted).length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showFeedback('Failed to load settings', 'error');
      },
    });
  }

  onSearchInput(): void {
    clearTimeout(this.searchDebounceTimer);
    this.searchDebounceTimer = setTimeout(() => {
      this.applyFilters();
    }, 400);
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadSettings();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.groupFilter = '';
    this.statusFilter = '';
    this.currentPage = 0;
    this.loadSettings();
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadSettings();
  }

  startInlineEdit(setting: SystemSetting): void {
    this.editingUuid = setting.uuid;
    this.editValue = setting.setting_value != null ? String(setting.setting_value) : '';
    this.openMenuUuid = null;
  }

  cancelInlineEdit(): void {
    this.editingUuid = null;
    this.editValue = '';
  }

  saveInlineEdit(setting: SystemSetting): void {
    this.settingsApi.updateSetting(setting.uuid, { setting_value: this.editValue }).subscribe({
      next: () => {
        this.showFeedback('Setting updated successfully', 'success');
        this.cancelInlineEdit();
        this.loadSettings();
      },
      error: (err) => {
        this.showFeedback(err.error?.message || 'Failed to update setting', 'error');
      },
    });
  }

  toggleStatus(setting: SystemSetting, checked: boolean): void {
    const newStatus = checked ? 'active' : 'inactive';
    this.settingsApi.updateSetting(setting.uuid, { status: newStatus }).subscribe({
      next: () => {
        this.showFeedback(`Setting ${newStatus === 'active' ? 'activated' : 'deactivated'}`, 'success');
        this.loadSettings();
      },
      error: (err) => {
        this.showFeedback(err.error?.message || 'Failed to update status', 'error');
        this.loadSettings();
      },
    });
  }

  openMenu(uuid: string): void {
    this.openMenuUuid = this.openMenuUuid === uuid ? null : uuid;
  }

  deleteSetting(uuid: string): void {
    this.openMenuUuid = null;
    if (window.confirm('Delete this setting? This cannot be undone.')) {
      this.settingsApi.deleteSetting(uuid).subscribe({
        next: () => {
          this.showFeedback('Setting deleted successfully', 'success');
          this.loadSettings();
        },
        error: (err) => {
          this.showFeedback(err.error?.message || 'Failed to delete setting', 'error');
        },
      });
    }
  }

  showFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage = message;
    this.feedbackType = type;
    setTimeout(() => { this.feedbackMessage = ''; }, 3000);
  }
}
