import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import {
  Notification, NotificationTemplate, NotificationLog,
  NotificationDashboardStats
} from '../models/notification/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationApiService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/${environment.apiVersion}/admin/notifications`;
  private templateBase = `${environment.apiUrl}/${environment.apiVersion}/admin/notification-templates`;

  private buildParams(params: Record<string, string>): HttpParams {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, value);
      }
    });
    return httpParams;
  }

  getNotifications(params: Record<string, string> = {}): Observable<ApiResponse<Notification[]>> {
    return this.http.get<ApiResponse<Notification[]>>(`${this.base}`, { params: this.buildParams(params), withCredentials: true });
  }

  getNotification(uuid: string): Observable<ApiResponse<Notification>> {
    return this.http.get<ApiResponse<Notification>>(`${this.base}/${uuid}`, { withCredentials: true });
  }

  sendNotification(data: any): Observable<ApiResponse<Notification>> {
    return this.http.post<ApiResponse<Notification>>(`${this.base}`, data, { withCredentials: true });
  }

  broadcastMessage(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.base}/broadcast`, data, { withCredentials: true });
  }

  cancelNotification(uuid: string): Observable<ApiResponse<Notification>> {
    return this.http.patch<ApiResponse<Notification>>(`${this.base}/${uuid}/cancel`, {}, { withCredentials: true });
  }

  bulkCancelNotifications(ids: number[]): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.base}/bulk-cancel`, { ids }, { withCredentials: true });
  }

  getDashboardStats(): Observable<ApiResponse<NotificationDashboardStats>> {
    return this.http.get<ApiResponse<NotificationDashboardStats>>(`${this.base}/dashboard-stats`, { withCredentials: true });
  }

  getDeliveryStats(params: Record<string, string> = {}): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.base}/delivery-stats`, { params: this.buildParams(params), withCredentials: true });
  }

  getQueueStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.base}/queue-stats`, { withCredentials: true });
  }

  getNotificationLogs(params: Record<string, string> = {}): Observable<ApiResponse<NotificationLog[]>> {
    return this.http.get<ApiResponse<NotificationLog[]>>(`${this.base}/logs`, { params: this.buildParams(params), withCredentials: true });
  }

  getTemplates(params: Record<string, string> = {}): Observable<ApiResponse<NotificationTemplate[]>> {
    return this.http.get<ApiResponse<NotificationTemplate[]>>(`${this.templateBase}`, { params: this.buildParams(params), withCredentials: true });
  }

  getTemplate(id: number): Observable<ApiResponse<NotificationTemplate>> {
    return this.http.get<ApiResponse<NotificationTemplate>>(`${this.templateBase}/${id}`, { withCredentials: true });
  }

  createTemplate(data: any): Observable<ApiResponse<NotificationTemplate>> {
    return this.http.post<ApiResponse<NotificationTemplate>>(`${this.templateBase}`, data, { withCredentials: true });
  }

  updateTemplate(id: number, data: any): Observable<ApiResponse<NotificationTemplate>> {
    return this.http.put<ApiResponse<NotificationTemplate>>(`${this.templateBase}/${id}`, data, { withCredentials: true });
  }

  deleteTemplate(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.templateBase}/${id}`, { withCredentials: true });
  }
}
