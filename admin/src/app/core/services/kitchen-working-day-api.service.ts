import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { KitchenWorkingDay, CreateKitchenWorkingDay, UpdateKitchenWorkingDay, BulkUpdateWorkingDay } from '../models/kitchen/kitchen-working-day.model';

@Injectable({ providedIn: 'root' })
export class KitchenWorkingDayApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/kitchen-working-days`;

  getAll(params?: Record<string, string>): Observable<ApiResponse<KitchenWorkingDay[]>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<ApiResponse<KitchenWorkingDay[]>>(this.apiUrl, { params: httpParams, withCredentials: true });
  }

  getPaginated(params: Record<string, string>): Observable<PaginatedResponse<KitchenWorkingDay>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this.http.get<PaginatedResponse<KitchenWorkingDay>>(this.apiUrl, { params: httpParams, withCredentials: true });
  }

  getById(uuid: string): Observable<ApiResponse<KitchenWorkingDay>> {
    return this.http.get<ApiResponse<KitchenWorkingDay>>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  create(data: CreateKitchenWorkingDay): Observable<ApiResponse<KitchenWorkingDay>> {
    return this.http.post<ApiResponse<KitchenWorkingDay>>(this.apiUrl, data, { withCredentials: true });
  }

  update(uuid: string, data: UpdateKitchenWorkingDay): Observable<ApiResponse<KitchenWorkingDay>> {
    return this.http.put<ApiResponse<KitchenWorkingDay>>(`${this.apiUrl}/${uuid}`, data, { withCredentials: true });
  }

  delete(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  bulkUpdate(data: BulkUpdateWorkingDay): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/bulk-update`, data, { withCredentials: true });
  }

  getDefaultSchedule(): Observable<ApiResponse<KitchenWorkingDay[]>> {
    return this.http.get<ApiResponse<KitchenWorkingDay[]>>(`${this.apiUrl}/default-schedule`, { withCredentials: true });
  }
}
