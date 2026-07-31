import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import {
  MonthlyMenu, MonthlyMenuItem, MonthlyMenuStats, MonthlyMenuForecast,
  CreateMonthlyMenu, UpdateMonthlyMenu,
} from '../models/monthly-menu/monthly-menu.model';

@Injectable({ providedIn: 'root' })
export class MonthlyMenuApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/monthly-menus`;

  private buildParams(params?: Record<string, string>): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return httpParams;
  }

  getMonthlyMenus(params?: Record<string, string>): Observable<ApiResponse<MonthlyMenu[]>> {
    return this.http.get<ApiResponse<MonthlyMenu[]>>(this.apiUrl, {
      params: this.buildParams(params), withCredentials: true,
    });
  }

  getMonthlyMenuPaginated(params: Record<string, string>): Observable<PaginatedResponse<MonthlyMenu>> {
    return this.http.get<PaginatedResponse<MonthlyMenu>>(this.apiUrl, {
      params: this.buildParams(params), withCredentials: true,
    });
  }

  getMonthlyMenu(uuid: string): Observable<ApiResponse<MonthlyMenu>> {
    return this.http.get<ApiResponse<MonthlyMenu>>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  createMonthlyMenu(data: CreateMonthlyMenu): Observable<ApiResponse<MonthlyMenu>> {
    return this.http.post<ApiResponse<MonthlyMenu>>(this.apiUrl, data, { withCredentials: true });
  }

  updateMonthlyMenu(uuid: string, data: UpdateMonthlyMenu): Observable<ApiResponse<MonthlyMenu>> {
    return this.http.put<ApiResponse<MonthlyMenu>>(`${this.apiUrl}/${uuid}`, data, { withCredentials: true });
  }

  deleteMonthlyMenu(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  restoreMonthlyMenu(uuid: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/${uuid}/restore`, {}, { withCredentials: true });
  }

  publishMonthlyMenu(uuid: string): Observable<ApiResponse<MonthlyMenu>> {
    return this.http.post<ApiResponse<MonthlyMenu>>(`${this.apiUrl}/${uuid}/publish`, {}, { withCredentials: true });
  }

  unpublishMonthlyMenu(uuid: string): Observable<ApiResponse<MonthlyMenu>> {
    return this.http.post<ApiResponse<MonthlyMenu>>(`${this.apiUrl}/${uuid}/unpublish`, {}, { withCredentials: true });
  }

  approveMonthlyMenu(uuid: string): Observable<ApiResponse<MonthlyMenu>> {
    return this.http.post<ApiResponse<MonthlyMenu>>(`${this.apiUrl}/${uuid}/approve`, {}, { withCredentials: true });
  }

  duplicateMonthlyMenu(uuid: string, data: { target_month: number; target_year: number }): Observable<ApiResponse<MonthlyMenu>> {
    return this.http.post<ApiResponse<MonthlyMenu>>(`${this.apiUrl}/${uuid}/duplicate`, data, { withCredentials: true });
  }

  copyPreviousMonth(data: {
    source_month: number; source_year: number;
    target_month: number; target_year: number; kitchen_id?: number;
  }): Observable<ApiResponse<MonthlyMenu>> {
    return this.http.post<ApiResponse<MonthlyMenu>>(`${this.apiUrl}/copy-previous`, data, { withCredentials: true });
  }

  generateWeeklyMenus(uuid: string): Observable<ApiResponse<MonthlyMenu>> {
    return this.http.post<ApiResponse<MonthlyMenu>>(`${this.apiUrl}/${uuid}/generate-weekly`, {}, { withCredentials: true });
  }

  getMonthlyMenuStats(params?: Record<string, string>): Observable<ApiResponse<MonthlyMenuStats>> {
    return this.http.get<ApiResponse<MonthlyMenuStats>>(`${this.apiUrl}/stats`, {
      params: this.buildParams(params), withCredentials: true,
    });
  }

  getForecast(uuid: string): Observable<ApiResponse<MonthlyMenuForecast>> {
    return this.http.get<ApiResponse<MonthlyMenuForecast>>(`${this.apiUrl}/${uuid}/forecast`, { withCredentials: true });
  }
}
