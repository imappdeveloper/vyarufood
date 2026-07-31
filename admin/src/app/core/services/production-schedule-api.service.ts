import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { ProductionSchedule, CreateProductionSchedule, UpdateProductionSchedule } from '../models/kitchen/production-schedule.model';

@Injectable({ providedIn: 'root' })
export class ProductionScheduleApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/production-schedules`;

  getAll(params?: Record<string, string>): Observable<ApiResponse<ProductionSchedule[]>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<ApiResponse<ProductionSchedule[]>>(this.apiUrl, { params: httpParams, withCredentials: true });
  }

  getPaginated(params: Record<string, string>): Observable<PaginatedResponse<ProductionSchedule>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this.http.get<PaginatedResponse<ProductionSchedule>>(this.apiUrl, { params: httpParams, withCredentials: true });
  }

  getById(uuid: string): Observable<ApiResponse<ProductionSchedule>> {
    return this.http.get<ApiResponse<ProductionSchedule>>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  create(data: CreateProductionSchedule): Observable<ApiResponse<ProductionSchedule>> {
    return this.http.post<ApiResponse<ProductionSchedule>>(this.apiUrl, data, { withCredentials: true });
  }

  update(uuid: string, data: UpdateProductionSchedule): Observable<ApiResponse<ProductionSchedule>> {
    return this.http.put<ApiResponse<ProductionSchedule>>(`${this.apiUrl}/${uuid}`, data, { withCredentials: true });
  }

  delete(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  markCompleted(uuid: string): Observable<ApiResponse<ProductionSchedule>> {
    return this.http.patch<ApiResponse<ProductionSchedule>>(`${this.apiUrl}/${uuid}/completed`, {}, { withCredentials: true });
  }

  generatePlan(data: { kitchen_id: number; date: string; meal_types: string[] }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/generate-plan`, data, { withCredentials: true });
  }

  getStats(kitchenId: number): Observable<ApiResponse<any>> {
    let httpParams = new HttpParams().set('kitchen_id', kitchenId.toString());
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/stats`, { params: httpParams, withCredentials: true });
  }
}
