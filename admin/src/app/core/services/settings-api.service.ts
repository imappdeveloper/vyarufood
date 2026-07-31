import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { SystemSetting, CreateSystemSetting, UpdateSystemSetting, SettingGroupStats } from '../models/setting/system-setting.model';
import { CmsPage, CreateCmsPage, UpdateCmsPage, CmsPageStats } from '../models/setting/cms-page.model';
import { AppVersion, CreateAppVersion, UpdateAppVersion, OutdatedCheck } from '../models/setting/app-version.model';
import { SystemBackup, CreateBackup, BackupStats } from '../models/setting/system-backup.model';

@Injectable({ providedIn: 'root' })
export class SettingsApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}`;

  // ===== SYSTEM SETTINGS =====
  getSettings(params?: Record<string, string>): Observable<PaginatedResponse<SystemSetting>> {
    return this.http.get<PaginatedResponse<SystemSetting>>(`${this.apiUrl}/admin/settings`, {
      params: params as any,
      withCredentials: true,
    });
  }

  getSettingsByGroup(group: string): Observable<ApiResponse<SystemSetting[]>> {
    return this.http.get<ApiResponse<SystemSetting[]>>(`${this.apiUrl}/admin/settings/group/${group}`, {
      withCredentials: true,
    });
  }

  getSettingsGroups(): Observable<ApiResponse<SettingGroupStats>> {
    return this.http.get<ApiResponse<SettingGroupStats>>(`${this.apiUrl}/admin/settings/groups`, {
      withCredentials: true,
    });
  }

  getSetting(uuid: string): Observable<ApiResponse<SystemSetting>> {
    return this.http.get<ApiResponse<SystemSetting>>(`${this.apiUrl}/admin/settings/${uuid}`, {
      withCredentials: true,
    });
  }

  createSetting(data: CreateSystemSetting): Observable<ApiResponse<SystemSetting>> {
    return this.http.post<ApiResponse<SystemSetting>>(`${this.apiUrl}/admin/settings`, data, {
      withCredentials: true,
    });
  }

  updateSetting(uuid: string, data: UpdateSystemSetting): Observable<ApiResponse<SystemSetting>> {
    return this.http.put<ApiResponse<SystemSetting>>(`${this.apiUrl}/admin/settings/${uuid}`, data, {
      withCredentials: true,
    });
  }

  deleteSetting(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/admin/settings/${uuid}`, {
      withCredentials: true,
    });
  }

  bulkUpdateSettings(settings: { setting_key: string; setting_value: string | null }[]): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.apiUrl}/admin/settings/bulk-update`, { settings }, {
      withCredentials: true,
    });
  }

  // ===== CMS PAGES =====
  getCmsPages(params?: Record<string, string>): Observable<PaginatedResponse<CmsPage>> {
    return this.http.get<PaginatedResponse<CmsPage>>(`${this.apiUrl}/admin/cms-pages`, {
      params: params as any,
      withCredentials: true,
    });
  }

  getCmsPage(uuid: string): Observable<ApiResponse<CmsPage>> {
    return this.http.get<ApiResponse<CmsPage>>(`${this.apiUrl}/admin/cms-pages/${uuid}`, {
      withCredentials: true,
    });
  }

  getCmsPageBySlug(slug: string): Observable<ApiResponse<CmsPage>> {
    return this.http.get<ApiResponse<CmsPage>>(`${this.apiUrl}/admin/cms-pages/public/${slug}`, {
      withCredentials: true,
    });
  }

  getCmsPageStats(): Observable<ApiResponse<CmsPageStats>> {
    return this.http.get<ApiResponse<CmsPageStats>>(`${this.apiUrl}/admin/cms-pages/stats`, {
      withCredentials: true,
    });
  }

  createCmsPage(data: CreateCmsPage): Observable<ApiResponse<CmsPage>> {
    return this.http.post<ApiResponse<CmsPage>>(`${this.apiUrl}/admin/cms-pages`, data, {
      withCredentials: true,
    });
  }

  updateCmsPage(uuid: string, data: UpdateCmsPage): Observable<ApiResponse<CmsPage>> {
    return this.http.put<ApiResponse<CmsPage>>(`${this.apiUrl}/admin/cms-pages/${uuid}`, data, {
      withCredentials: true,
    });
  }

  deleteCmsPage(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/admin/cms-pages/${uuid}`, {
      withCredentials: true,
    });
  }

  publishCmsPage(uuid: string): Observable<ApiResponse<CmsPage>> {
    return this.http.patch<ApiResponse<CmsPage>>(`${this.apiUrl}/admin/cms-pages/${uuid}/publish`, {}, {
      withCredentials: true,
    });
  }

  archiveCmsPage(uuid: string): Observable<ApiResponse<CmsPage>> {
    return this.http.patch<ApiResponse<CmsPage>>(`${this.apiUrl}/admin/cms-pages/${uuid}/archive`, {}, {
      withCredentials: true,
    });
  }

  // ===== APP VERSIONS =====
  getAppVersions(params?: Record<string, string>): Observable<PaginatedResponse<AppVersion>> {
    return this.http.get<PaginatedResponse<AppVersion>>(`${this.apiUrl}/admin/app-versions`, {
      params: params as any,
      withCredentials: true,
    });
  }

  getAppVersion(uuid: string): Observable<ApiResponse<AppVersion>> {
    return this.http.get<ApiResponse<AppVersion>>(`${this.apiUrl}/admin/app-versions/${uuid}`, {
      withCredentials: true,
    });
  }

  getLatestVersion(platform: string): Observable<ApiResponse<AppVersion>> {
    return this.http.get<ApiResponse<AppVersion>>(`${this.apiUrl}/admin/app-versions/latest/${platform}`, {
      withCredentials: true,
    });
  }

  createAppVersion(data: CreateAppVersion): Observable<ApiResponse<AppVersion>> {
    return this.http.post<ApiResponse<AppVersion>>(`${this.apiUrl}/admin/app-versions`, data, {
      withCredentials: true,
    });
  }

  updateAppVersion(uuid: string, data: UpdateAppVersion): Observable<ApiResponse<AppVersion>> {
    return this.http.put<ApiResponse<AppVersion>>(`${this.apiUrl}/admin/app-versions/${uuid}`, data, {
      withCredentials: true,
    });
  }

  deleteAppVersion(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/admin/app-versions/${uuid}`, {
      withCredentials: true,
    });
  }

  setAppVersionStatus(uuid: string, status: string): Observable<ApiResponse<AppVersion>> {
    return this.http.patch<ApiResponse<AppVersion>>(`${this.apiUrl}/admin/app-versions/${uuid}/status`, { status }, {
      withCredentials: true,
    });
  }

  checkOutdated(platform: string, currentVersion: string): Observable<ApiResponse<OutdatedCheck>> {
    return this.http.post<ApiResponse<OutdatedCheck>>(`${this.apiUrl}/admin/app-versions/check-outdated`, {
      platform, current_version: currentVersion,
    }, { withCredentials: true });
  }

  // ===== BACKUPS =====
  getBackups(params?: Record<string, string>): Observable<PaginatedResponse<SystemBackup>> {
    return this.http.get<PaginatedResponse<SystemBackup>>(`${this.apiUrl}/admin/backups`, {
      params: params as any,
      withCredentials: true,
    });
  }

  getBackup(uuid: string): Observable<ApiResponse<SystemBackup>> {
    return this.http.get<ApiResponse<SystemBackup>>(`${this.apiUrl}/admin/backups/${uuid}`, {
      withCredentials: true,
    });
  }

  getBackupStats(): Observable<ApiResponse<BackupStats>> {
    return this.http.get<ApiResponse<BackupStats>>(`${this.apiUrl}/admin/backups/stats`, {
      withCredentials: true,
    });
  }

  createBackup(data: CreateBackup): Observable<ApiResponse<SystemBackup>> {
    return this.http.post<ApiResponse<SystemBackup>>(`${this.apiUrl}/admin/backups`, data, {
      withCredentials: true,
    });
  }

  deleteBackup(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/admin/backups/${uuid}`, {
      withCredentials: true,
    });
  }

  // ===== MAINTENANCE =====
  enableMaintenance(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/admin/maintenance/enable`, {}, {
      withCredentials: true,
    });
  }

  disableMaintenance(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/admin/maintenance/disable`, {}, {
      withCredentials: true,
    });
  }

  getMaintenanceStatus(): Observable<ApiResponse<{ is_enabled: boolean; enabled_at: string | null }>> {
    return this.http.get<ApiResponse<{ is_enabled: boolean; enabled_at: string | null }>>(`${this.apiUrl}/admin/maintenance/status`, {
      withCredentials: true,
    });
  }
}
