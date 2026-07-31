import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { CustomerNotification, NotificationPreference } from '../models/customer/notification-summary.model';

export interface NotificationListParams {
  page?: number;
  per_page?: number;
  search?: string;
  channel?: string;
  read?: string;
  date_from?: string;
  date_to?: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerNotificationApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/customer/notifications`;

  private buildParams(params: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return httpParams;
  }

  getNotifications(params: NotificationListParams = {}): Observable<PaginatedResponse<CustomerNotification>> {
    return this.http.get<PaginatedResponse<CustomerNotification>>(this.apiUrl, { params: this.buildParams(params), withCredentials: true });
  }

  getNotification(uuid: string): Observable<ApiResponse<CustomerNotification>> {
    return this.http.get<ApiResponse<CustomerNotification>>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  getUnreadCount(): Observable<ApiResponse<{ unread_count: number }>> {
    return this.http.get<ApiResponse<{ unread_count: number }>>(`${this.apiUrl}/unread-count`, { withCredentials: true });
  }

  markAsRead(uuid: string): Observable<ApiResponse<CustomerNotification>> {
    return this.http.patch<ApiResponse<CustomerNotification>>(`${this.apiUrl}/${uuid}/read`, {}, { withCredentials: true });
  }

  markAllAsRead(): Observable<ApiResponse<{ marked_count: number }>> {
    return this.http.post<ApiResponse<{ marked_count: number }>>(`${this.apiUrl}/mark-all-read`, {}, { withCredentials: true });
  }

  getPreferences(): Observable<ApiResponse<NotificationPreference>> {
    return this.http.get<ApiResponse<NotificationPreference>>(`${this.apiUrl}/preferences`, { withCredentials: true });
  }

  updatePreferences(data: Partial<NotificationPreference>): Observable<ApiResponse<NotificationPreference>> {
    return this.http.put<ApiResponse<NotificationPreference>>(`${this.apiUrl}/preferences`, data, { withCredentials: true });
  }
}
