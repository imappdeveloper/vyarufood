import { Component, inject, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SettingsApiService } from '../../../../core/services/settings-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AppVersion, PLATFORMS, VERSION_STATUSES } from '../../../../core/models/setting/app-version.model';

@Component({
  selector: 'app-app-version-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
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
            <span style="color:white;font-weight:500;">App Versions</span>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div>
              <h1 style="font-size:28px;font-weight:800;color:white;margin:0 0 6px 0;">
                <span class="material-icons" style="font-size:24px;vertical-align:middle;margin-right:8px;">system_update</span>
                App Versions
              </h1>
              <p style="font-size:14px;color:rgba(255,255,255,0.85);margin:0;">Manage app releases for Android, iOS and Web platforms</p>
            </div>
            <a routerLink="/admin/settings/versions/create"
              style="display:inline-flex;align-items:center;gap:8px;padding:12px 24px;background:rgba(255,255,255,0.15);backdrop-filter:blur(8px);color:white;font-size:14px;font-weight:700;border-radius:12px;text-decoration:none;transition:all 0.3s ease;border:1px solid rgba(255,255,255,0.2);"
              onmouseenter="this.style.background='rgba(255,255,255,0.25)';this.style.transform='translateY(-1px)'"
              onmouseleave="this.style.background='rgba(255,255,255,0.15)';this.style.transform='translateY(0)'">
              <span class="material-icons" style="font-size:18px;line-height:1;">add</span> Add Version
            </a>
          </div>
        </div>
        <svg style="position:absolute;bottom:-2px;left:0;width:100%;height:40px;" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f8fafc"/>
        </svg>
      </div>

      <div style="padding:0 32px 32px;margin-top:-20px;">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px;margin-bottom:24px;">
          <div style="background:white;border-radius:12px;padding:18px 20px;box-shadow:0 1px 3px rgba(0,0,0,0.04);display:flex;align-items:center;gap:14px;transition:all 0.2s;cursor:default;"
            onmouseenter="this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)';this.style.transform='translateY(-2px)'"
            onmouseleave="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)';this.style.transform='translateY(0)'">
            <div style="width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#ecfdf5;">
              <span class="material-icons" style="font-size:20px;line-height:1;color:#059669;">apps</span>
            </div>
            <div><div style="font-size:11px;font-weight:500;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Total</div><div style="font-size:24px;font-weight:700;color:#0f172a;margin-top:1px;">{{ stats.total }}</div></div>
          </div>
          <div style="background:white;border-radius:12px;padding:18px 20px;box-shadow:0 1px 3px rgba(0,0,0,0.04);display:flex;align-items:center;gap:14px;transition:all 0.2s;cursor:default;"
            onmouseenter="this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)';this.style.transform='translateY(-2px)'"
            onmouseleave="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)';this.style.transform='translateY(0)'">
            <div style="width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#d1fae5;">
              <span class="material-icons" style="font-size:20px;line-height:1;color:#059669;">check_circle</span>
            </div>
            <div><div style="font-size:11px;font-weight:500;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Active</div><div style="font-size:24px;font-weight:700;color:#0f172a;margin-top:1px;">{{ stats.active }}</div></div>
          </div>
          <div style="background:white;border-radius:12px;padding:18px 20px;box-shadow:0 1px 3px rgba(0,0,0,0.04);display:flex;align-items:center;gap:14px;transition:all 0.2s;cursor:default;"
            onmouseenter="this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)';this.style.transform='translateY(-2px)'"
            onmouseleave="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)';this.style.transform='translateY(0)'">
            <div style="width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#fef3c7;">
              <span class="material-icons" style="font-size:20px;line-height:1;color:#f59e0b;">pause_circle</span>
            </div>
            <div><div style="font-size:11px;font-weight:500;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Inactive</div><div style="font-size:24px;font-weight:700;color:#0f172a;margin-top:1px;">{{ stats.inactive }}</div></div>
          </div>
          <div style="background:white;border-radius:12px;padding:18px 20px;box-shadow:0 1px 3px rgba(0,0,0,0.04);display:flex;align-items:center;gap:14px;transition:all 0.2s;cursor:default;"
            onmouseenter="this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)';this.style.transform='translateY(-2px)'"
            onmouseleave="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)';this.style.transform='translateY(0)'">
            <div style="width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#fef2f2;">
              <span class="material-icons" style="font-size:20px;line-height:1;color:#ef4444;">warning</span>
            </div>
            <div><div style="font-size:11px;font-weight:500;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Deprecated</div><div style="font-size:24px;font-weight:700;color:#0f172a;margin-top:1px;">{{ stats.deprecated }}</div></div>
          </div>
        </div>

        <div style="background:white;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.04);margin-bottom:16px;">
          <div style="display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:14px 18px;">
            <div style="position:relative;flex:1;min-width:180px;">
              <span class="material-icons" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:18px;line-height:1;color:#94a3b8;">search</span>
              <input [(ngModel)]="searchQuery" (input)="onSearchInput()" placeholder="Search versions..."
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
            <select [(ngModel)]="platformFilter" (change)="applyFilters()"
              style="padding:9px 32px 9px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;outline:none;cursor:pointer;min-width:150px;appearance:none;background:#f8fafc url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2394a3b8%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22/%3E%3C/svg%3E') no-repeat right 10px center;"
              onfocus="this.style.borderColor='#34d399'" onblur="this.style.borderColor='#e2e8f0'">
              <option value="">All Platforms</option>
              @for (p of platforms; track p) {
                <option [value]="p">{{ p | titlecase }}</option>
              }
            </select>
            <select [(ngModel)]="statusFilter" (change)="applyFilters()"
              style="padding:9px 32px 9px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;outline:none;cursor:pointer;min-width:150px;appearance:none;background:#f8fafc url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2394a3b8%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22/%3E%3C/svg%3E') no-repeat right 10px center;"
              onfocus="this.style.borderColor='#34d399'" onblur="this.style.borderColor='#e2e8f0'">
              <option value="">All Statuses</option>
              @for (s of statuses; track s) {
                <option [value]="s">{{ s | titlecase }}</option>
              }
            </select>
            @if (searchQuery || platformFilter || statusFilter) {
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
          } @else if (versions.length === 0) {
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 24px;">
              <div style="width:72px;height:72px;border-radius:16px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;background:linear-gradient(135deg,#ecfdf5,#d1fae5);">
                <span class="material-icons" style="font-size:32px;line-height:1;color:#059669;">system_update</span>
              </div>
              <div style="font-size:16px;font-weight:600;color:#0f172a;margin-bottom:4px;">No app versions found</div>
              <p style="font-size:13px;color:#64748b;text-align:center;max-width:300px;">
                @if (searchQuery || platformFilter || statusFilter) {
                  Try adjusting your search or filter criteria
                } @else {
                  No app versions have been added yet.
                }
              </p>
              @if (!searchQuery && !platformFilter && !statusFilter) {
                <a routerLink="/admin/settings/versions/create"
                  style="display:inline-flex;align-items:center;gap:6px;margin-top:16px;padding:10px 20px;background:linear-gradient(135deg,#059669,#16a34a);color:white;font-size:13px;font-weight:700;border-radius:8px;text-decoration:none;transition:all 0.3s ease;box-shadow:0 4px 12px rgba(5,150,105,0.2);"
                  onmouseenter="this.style.boxShadow='0 6px 20px rgba(5,150,105,0.3)';this.style.transform='translateY(-1px)'"
                  onmouseleave="this.style.boxShadow='0 4px 12px rgba(5,150,105,0.2)';this.style.transform='translateY(0)'">
                  <span class="material-icons" style="font-size:16px;line-height:1;">add</span> Add First Version
                </a>
              }
            </div>
          } @else {
            <div style="overflow-x:auto;">
              <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <thead>
                  <tr style="background:#f8fafc;border-bottom:1px solid #e2e8f0;">
                    <th style="text-align:left;padding:12px 16px;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;">Platform</th>
                    <th style="text-align:left;padding:12px 16px;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;">Version</th>
                    <th style="text-align:left;padding:12px 16px;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;">Code</th>
                    <th style="text-align:left;padding:12px 16px;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;">Min Supported</th>
                    <th style="text-align:center;padding:12px 16px;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;">Force</th>
                    <th style="text-align:center;padding:12px 16px;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;">Status</th>
                    <th style="text-align:center;padding:12px 16px;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;width:60px;"></th>
                  </tr>
                </thead>
                <tbody>
                  @for (row of versions; track row.uuid) {
                    <tr style="border-bottom:1px solid #f1f5f9;transition:background 0.15s;"
                      onmouseenter="this.style.background='#f8fafc'" onmouseleave="this.style.background='transparent'">
                      <td style="padding:14px 16px;">
                        <span style="display:inline-flex;align-items:center;gap:8px;">
                          <span class="material-icons" style="font-size:18px;line-height:1;" [style.color]="getPlatformColor(row.platform)">{{ getPlatformIcon(row.platform) }}</span>
                          <span style="font-size:13px;font-weight:600;color:#1e293b;">{{ row.platform | titlecase }}</span>
                        </span>
                      </td>
                      <td style="padding:14px 16px;">
                        <span style="font-weight:600;color:#0f172a;">{{ row.version_name }}</span>
                      </td>
                      <td style="padding:14px 16px;">
                        <code style="font-family:'JetBrains Mono','Fira Code',monospace;font-size:12px;color:#059669;background:#ecfdf5;padding:2px 8px;border-radius:4px;font-weight:600;">{{ row.version_code }}</code>
                      </td>
                      <td style="padding:14px 16px;">
                        <span style="color:#64748b;">{{ row.minimum_supported_version || '—' }}</span>
                      </td>
                      <td style="text-align:center;padding:14px 16px;">
                        @if (row.force_update) {
                          <span class="material-icons" style="font-size:18px;line-height:1;color:#ef4444;">warning</span>
                        } @else {
                          <span class="material-icons" style="font-size:18px;line-height:1;color:#cbd5e1;">check_circle</span>
                        }
                      </td>
                      <td style="text-align:center;padding:14px 16px;">
                        <span style="display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;padding:4px 12px;border-radius:20px;" [style]="getStatusStyle(row.status)">
                          <span style="width:6px;height:6px;border-radius:50%;" [style.background]="getStatusDotColor(row.status)"></span>
                          {{ row.status_label || row.status }}
                        </span>
                      </td>
                      <td style="text-align:center;padding:14px 16px;">
                        <div style="position:relative;" (click)="$event.stopPropagation()">
                          <button (click)="toggleMenu(row.uuid)"
                            style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border:none;border-radius:6px;cursor:pointer;background:transparent;color:#94a3b8;transition:all 0.15s;"
                            onmouseenter="this.style.background='#f1f5f9';this.style.color='#475569'" onmouseleave="this.style.background='transparent';this.style.color='#94a3b8'">
                            <span class="material-icons" style="font-size:18px;line-height:1;">more_vert</span>
                          </button>
                          @if (openMenuUuid === row.uuid) {
                            <div style="position:absolute;right:0;top:100%;margin-top:4px;background:white;border-radius:10px;box-shadow:0 10px 40px rgba(0,0,0,0.15);border:1px solid #e2e8f0;z-index:50;min-width:160px;overflow:hidden;padding:4px;">
                              <a [routerLink]="['/admin/settings/versions/edit', row.uuid]"
                                style="display:flex;align-items:center;gap:8px;width:100%;padding:8px 12px;border:none;background:transparent;cursor:pointer;font-size:13px;color:#334155;border-radius:6px;text-align:left;text-decoration:none;transition:background 0.1s;"
                                onmouseenter="this.style.background='#f1f5f9'" onmouseleave="this.style.background='transparent'"
                                (click)="openMenuUuid = null">
                                <span class="material-icons" style="font-size:16px;line-height:1;color:#059669;">edit</span> Edit
                              </a>
                              <div style="position:relative;">
                                <button (click)="showStatusSubmenu = !showStatusSubmenu"
                                  style="display:flex;align-items:center;gap:8px;width:100%;padding:8px 12px;border:none;background:transparent;cursor:pointer;font-size:13px;color:#334155;border-radius:6px;text-align:left;transition:background 0.1s;"
                                  onmouseenter="this.style.background='#f1f5f9'" onmouseleave="this.style.background='transparent'">
                                  <span class="material-icons" style="font-size:16px;line-height:1;color:#f59e0b;">toggle_on</span> Set Status
                                  <span class="material-icons" style="font-size:14px;line-height:1;margin-left:auto;color:#94a3b8;">chevron_right</span>
                                </button>
                                @if (showStatusSubmenu && openMenuUuid === row.uuid) {
                                  <div style="position:absolute;left:100%;top:0;margin-left:4px;background:white;border-radius:10px;box-shadow:0 10px 40px rgba(0,0,0,0.15);border:1px solid #e2e8f0;z-index:51;min-width:140px;overflow:hidden;padding:4px;">
                                    @for (s of statuses; track s) {
                                      <button (click)="setVersionStatus(row.uuid, s)"
                                        style="display:flex;align-items:center;gap:8px;width:100%;padding:8px 12px;border:none;background:transparent;cursor:pointer;font-size:13px;color:#334155;border-radius:6px;text-align:left;transition:background 0.1s;"
                                        onmouseenter="this.style.background='#f1f5f9'" onmouseleave="this.style.background='transparent'">
                                        <span style="width:8px;height:8px;border-radius:50%;" [style.background]="getStatusDotColor(s)"></span>
                                        {{ s | titlecase }}
                                      </button>
                                    }
                                  </div>
                                }
                              </div>
                              <button (click)="deleteVersion(row.uuid)"
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
export class AppVersionListComponent implements OnInit {
  private settingsApi = inject(SettingsApiService);

  Math = Math;

  versions: AppVersion[] = [];
  platforms = PLATFORMS;
  statuses = VERSION_STATUSES;

  loading = false;
  currentPage = 0;
  pageSize = 15;
  totalCount = 0;

  searchQuery = '';
  platformFilter = '';
  statusFilter = '';
  searchDebounceTimer: any = null;

  openMenuUuid: string | null = null;
  showStatusSubmenu = false;

  feedbackMessage = '';
  feedbackType: 'success' | 'error' = 'success';

  get stats() {
    const list = this.versions;
    return {
      total: this.totalCount,
      active: list.filter(v => v.status === 'active').length,
      inactive: list.filter(v => v.status === 'inactive').length,
      deprecated: list.filter(v => v.status === 'deprecated').length,
    };
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize) || 1;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openMenuUuid = null;
    this.showStatusSubmenu = false;
  }

  ngOnInit(): void {
    this.loadVersions();
  }

  loadVersions(): void {
    this.loading = true;
    const params: Record<string, string> = {
      page: (this.currentPage + 1).toString(),
      per_page: this.pageSize.toString(),
    };
    if (this.searchQuery) params['search'] = this.searchQuery;
    if (this.platformFilter) params['platform'] = this.platformFilter;
    if (this.statusFilter) params['status'] = this.statusFilter;

    this.settingsApi.getAppVersions(params).subscribe({
      next: (res) => {
        this.versions = res.data || [];
        this.totalCount = res.meta?.total || this.versions.length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showFeedback('Failed to load app versions', 'error');
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
    this.loadVersions();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.platformFilter = '';
    this.statusFilter = '';
    this.currentPage = 0;
    this.loadVersions();
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadVersions();
  }

  toggleMenu(uuid: string): void {
    this.openMenuUuid = this.openMenuUuid === uuid ? null : uuid;
    this.showStatusSubmenu = false;
  }

  getStatusStyle(status: string): string {
    switch (status) {
      case 'active': return 'background:#d1fae5;color:#065f46;';
      case 'inactive': return 'background:#f3f4f6;color:#6b7280;';
      case 'deprecated': return 'background:#fef2f2;color:#dc2626;';
      default: return 'background:#f3f4f6;color:#9ca3af;';
    }
  }

  getStatusDotColor(status: string): string {
    switch (status) {
      case 'active': return '#059669';
      case 'inactive': return '#9ca3af';
      case 'deprecated': return '#ef4444';
      default: return '#d1d5db';
    }
  }

  getPlatformIcon(platform: string): string {
    switch (platform) {
      case 'android': return 'android';
      case 'ios': return 'phone_iphone';
      case 'web': return 'language';
      default: return 'devices';
    }
  }

  getPlatformColor(platform: string): string {
    switch (platform) {
      case 'android': return '#059669';
      case 'ios': return '#3b82f6';
      case 'web': return '#8b5cf6';
      default: return '#6b7280';
    }
  }

  setVersionStatus(uuid: string, status: string): void {
    this.openMenuUuid = null;
    this.showStatusSubmenu = false;
    this.settingsApi.setAppVersionStatus(uuid, status).subscribe({
      next: () => {
        this.showFeedback(`Status updated to ${status}`, 'success');
        this.loadVersions();
      },
      error: (err) => this.showFeedback(err.error?.message || 'Failed to update status', 'error'),
    });
  }

  deleteVersion(uuid: string): void {
    this.openMenuUuid = null;
    if (window.confirm('Delete this app version? This cannot be undone.')) {
      this.settingsApi.deleteAppVersion(uuid).subscribe({
        next: () => {
          this.showFeedback('Version deleted successfully', 'success');
          this.loadVersions();
        },
        error: (err) => this.showFeedback(err.error?.message || 'Failed to delete version', 'error'),
      });
    }
  }

  showFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage = message;
    this.feedbackType = type;
    setTimeout(() => { this.feedbackMessage = ''; }, 3000);
  }
}
