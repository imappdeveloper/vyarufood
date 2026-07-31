import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { SubscriptionPlan } from '../models/subscription-plan/subscription-plan.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionPlanApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/subscription-plans`;

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

  getSubscriptionPlans(params?: Record<string, string>): Observable<PaginatedResponse<SubscriptionPlan>> {
    return this.http.get<PaginatedResponse<SubscriptionPlan>>(this.apiUrl, {
      params: this.buildParams(params), withCredentials: true,
    });
  }

  getSubscriptionPlanStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/stats`, { withCredentials: true });
  }

  getSubscriptionPlan(uuid: string): Observable<ApiResponse<SubscriptionPlan>> {
    return this.http.get<ApiResponse<SubscriptionPlan>>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  createSubscriptionPlan(data: any): Observable<ApiResponse<SubscriptionPlan>> {
    return this.http.post<ApiResponse<SubscriptionPlan>>(this.apiUrl, data, { withCredentials: true });
  }

  updateSubscriptionPlan(uuid: string, data: any): Observable<ApiResponse<SubscriptionPlan>> {
    return this.http.put<ApiResponse<SubscriptionPlan>>(`${this.apiUrl}/${uuid}`, data, { withCredentials: true });
  }

  deleteSubscriptionPlan(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  restoreSubscriptionPlan(uuid: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/${uuid}/restore`, {}, { withCredentials: true });
  }

  forceDeleteSubscriptionPlan(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${uuid}/force-delete`, { withCredentials: true });
  }

  setSubscriptionPlanStatus(uuid: string, status: string): Observable<ApiResponse<SubscriptionPlan>> {
    return this.http.patch<ApiResponse<SubscriptionPlan>>(`${this.apiUrl}/${uuid}/status`, { status }, { withCredentials: true });
  }

  togglePopular(uuid: string): Observable<ApiResponse<SubscriptionPlan>> {
    return this.http.patch<ApiResponse<SubscriptionPlan>>(`${this.apiUrl}/${uuid}/popular`, {}, { withCredentials: true });
  }

  toggleRecommended(uuid: string): Observable<ApiResponse<SubscriptionPlan>> {
    return this.http.patch<ApiResponse<SubscriptionPlan>>(`${this.apiUrl}/${uuid}/recommended`, {}, { withCredentials: true });
  }

  duplicateSubscriptionPlan(uuid: string): Observable<ApiResponse<SubscriptionPlan>> {
    return this.http.post<ApiResponse<SubscriptionPlan>>(`${this.apiUrl}/${uuid}/duplicate`, {}, { withCredentials: true });
  }

  importSubscriptionPlans(file: File): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse>(`${this.apiUrl}/import`, formData, { withCredentials: true });
  }

  exportSubscriptionPlans(filters?: Record<string, string>): Observable<Blob> {
    return this.http.get<Blob>(`${this.apiUrl}/export/download`, {
      params: this.buildParams(filters), withCredentials: true, responseType: 'blob' as any,
    });
  }
}
