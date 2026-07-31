import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { KitchenHoliday, CreateKitchenHoliday, UpdateKitchenHoliday } from '../models/kitchen/kitchen-holiday.model';

@Injectable({ providedIn: 'root' })
export class KitchenHolidayApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/kitchen-holidays`;

  getAll(params?: Record<string, string>): Observable<ApiResponse<KitchenHoliday[]>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<ApiResponse<KitchenHoliday[]>>(this.apiUrl, { params: httpParams, withCredentials: true });
  }

  getPaginated(params: Record<string, string>): Observable<PaginatedResponse<KitchenHoliday>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this.http.get<PaginatedResponse<KitchenHoliday>>(this.apiUrl, { params: httpParams, withCredentials: true });
  }

  getById(uuid: string): Observable<ApiResponse<KitchenHoliday>> {
    return this.http.get<ApiResponse<KitchenHoliday>>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  create(data: CreateKitchenHoliday): Observable<ApiResponse<KitchenHoliday>> {
    return this.http.post<ApiResponse<KitchenHoliday>>(this.apiUrl, data, { withCredentials: true });
  }

  update(uuid: string, data: UpdateKitchenHoliday): Observable<ApiResponse<KitchenHoliday>> {
    return this.http.put<ApiResponse<KitchenHoliday>>(`${this.apiUrl}/${uuid}`, data, { withCredentials: true });
  }

  delete(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  getCalendar(params: Record<string, string>): Observable<ApiResponse<KitchenHoliday[]>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      httpParams = httpParams.set(key, params[key]);
    });
    return this.http.get<ApiResponse<KitchenHoliday[]>>(`${this.apiUrl}/calendar`, { params: httpParams, withCredentials: true });
  }
}
