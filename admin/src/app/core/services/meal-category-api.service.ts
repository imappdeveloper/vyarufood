import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { MealCategory, CreateMealCategory, UpdateMealCategory, MealCategoryStats, MealCategoryImportResult } from '../models/meal/meal-category.model';

@Injectable({ providedIn: 'root' })
export class MealCategoryApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/meal-categories`;

  getAll(params?: Record<string, string>): Observable<ApiResponse<MealCategory[]>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<ApiResponse<MealCategory[]>>(this.apiUrl, { params: httpParams, withCredentials: true });
  }

  getPaginated(params: Record<string, string>): Observable<PaginatedResponse<MealCategory>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this.http.get<PaginatedResponse<MealCategory>>(this.apiUrl, { params: httpParams, withCredentials: true });
  }

  getById(uuid: string): Observable<ApiResponse<MealCategory>> {
    return this.http.get<ApiResponse<MealCategory>>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  create(data: CreateMealCategory): Observable<ApiResponse<MealCategory>> {
    return this.http.post<ApiResponse<MealCategory>>(this.apiUrl, data, { withCredentials: true });
  }

  update(uuid: string, data: UpdateMealCategory): Observable<ApiResponse<MealCategory>> {
    return this.http.put<ApiResponse<MealCategory>>(`${this.apiUrl}/${uuid}`, data, { withCredentials: true });
  }

  delete(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  restore(uuid: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/${uuid}/restore`, {}, { withCredentials: true });
  }

  forceDelete(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${uuid}/force-delete`, { withCredentials: true });
  }

  setDefault(uuid: string): Observable<ApiResponse<MealCategory>> {
    return this.http.patch<ApiResponse<MealCategory>>(`${this.apiUrl}/${uuid}/default`, {}, { withCredentials: true });
  }

  setStatus(uuid: string, status: string): Observable<ApiResponse<MealCategory>> {
    return this.http.patch<ApiResponse<MealCategory>>(`${this.apiUrl}/${uuid}/status`, { status }, { withCredentials: true });
  }

  getStats(): Observable<ApiResponse<MealCategoryStats>> {
    return this.http.get<ApiResponse<MealCategoryStats>>(`${this.apiUrl}/stats`, { withCredentials: true });
  }

  search(query: string): Observable<ApiResponse<MealCategory[]>> {
    let httpParams = new HttpParams();
    if (query) httpParams = httpParams.set('q', query);
    return this.http.get<ApiResponse<MealCategory[]>>(`${this.apiUrl}/search`, { params: httpParams, withCredentials: true });
  }

  import(file: File): Observable<ApiResponse<MealCategoryImportResult>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<MealCategoryImportResult>>(`${this.apiUrl}/import`, formData, { withCredentials: true });
  }

  export(filters?: Record<string, string>): Observable<Blob> {
    let httpParams = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          httpParams = httpParams.set(key, filters[key]);
        }
      });
    }
    return this.http.get(`${this.apiUrl}/export`, { params: httpParams, withCredentials: true, responseType: 'blob' });
  }

  downloadSampleTemplate(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/sample-template`, { withCredentials: true, responseType: 'blob' });
  }

  bulkDelete(ids: number[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/bulk-delete`, { ids }, { withCredentials: true });
  }

  bulkSetStatus(ids: number[], status: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/bulk-set-status`, { ids, status }, { withCredentials: true });
  }
}
