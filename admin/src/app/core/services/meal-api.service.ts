import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { Meal, CreateMeal, UpdateMeal, MealStats, MealImportResult } from '../models/meal/meal.model';

@Injectable({ providedIn: 'root' })
export class MealApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/meals`;

  getAll(params?: Record<string, string>): Observable<ApiResponse<Meal[]>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<ApiResponse<Meal[]>>(this.apiUrl, { params: httpParams, withCredentials: true });
  }

  getPaginated(params: Record<string, string>): Observable<PaginatedResponse<Meal>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this.http.get<PaginatedResponse<Meal>>(this.apiUrl, { params: httpParams, withCredentials: true });
  }

  getById(uuid: string): Observable<ApiResponse<Meal>> {
    return this.http.get<ApiResponse<Meal>>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  create(data: CreateMeal): Observable<ApiResponse<Meal>> {
    return this.http.post<ApiResponse<Meal>>(this.apiUrl, data, { withCredentials: true });
  }

  update(uuid: string, data: UpdateMeal): Observable<ApiResponse<Meal>> {
    return this.http.put<ApiResponse<Meal>>(`${this.apiUrl}/${uuid}`, data, { withCredentials: true });
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

  setStatus(uuid: string, status: string): Observable<ApiResponse<Meal>> {
    return this.http.patch<ApiResponse<Meal>>(`${this.apiUrl}/${uuid}/status`, { status }, { withCredentials: true });
  }

  setFeatured(uuid: string): Observable<ApiResponse<Meal>> {
    return this.http.patch<ApiResponse<Meal>>(`${this.apiUrl}/${uuid}/featured`, {}, { withCredentials: true });
  }

  setRecommended(uuid: string): Observable<ApiResponse<Meal>> {
    return this.http.patch<ApiResponse<Meal>>(`${this.apiUrl}/${uuid}/recommended`, {}, { withCredentials: true });
  }

  setBestseller(uuid: string): Observable<ApiResponse<Meal>> {
    return this.http.patch<ApiResponse<Meal>>(`${this.apiUrl}/${uuid}/bestseller`, {}, { withCredentials: true });
  }

  setNewFlag(uuid: string): Observable<ApiResponse<Meal>> {
    return this.http.patch<ApiResponse<Meal>>(`${this.apiUrl}/${uuid}/new`, {}, { withCredentials: true });
  }

  duplicate(uuid: string): Observable<ApiResponse<Meal>> {
    return this.http.post<ApiResponse<Meal>>(`${this.apiUrl}/${uuid}/duplicate`, {}, { withCredentials: true });
  }

  bulkDelete(ids: number[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/bulk-delete`, { ids }, { withCredentials: true });
  }

  bulkSetStatus(ids: number[], status: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/bulk-set-status`, { ids, status }, { withCredentials: true });
  }

  bulkUpdatePrice(ids: number[], data: { price: number; offer_price?: number }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/bulk-update-price`, { ids, ...data }, { withCredentials: true });
  }

  bulkUpdateCategory(ids: number[], categoryId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/bulk-update-category`, { ids, category_id: categoryId }, { withCredentials: true });
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

  import(file: File): Observable<ApiResponse<MealImportResult>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<MealImportResult>>(`${this.apiUrl}/import`, formData, { withCredentials: true });
  }

  downloadSampleTemplate(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/sample-template`, { withCredentials: true, responseType: 'blob' });
  }

  getStats(): Observable<ApiResponse<MealStats>> {
    return this.http.get<ApiResponse<MealStats>>(`${this.apiUrl}/stats`, { withCredentials: true });
  }

  search(query: string): Observable<ApiResponse<Meal[]>> {
    let httpParams = new HttpParams();
    if (query) httpParams = httpParams.set('q', query);
    return this.http.get<ApiResponse<Meal[]>>(`${this.apiUrl}/search`, { params: httpParams, withCredentials: true });
  }

  uploadImage(uuid: string, file: File): Observable<ApiResponse<Meal>> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<ApiResponse<Meal>>(`${this.apiUrl}/${uuid}/image`, formData, { withCredentials: true });
  }

  uploadGallery(uuid: string, files: File[]): Observable<ApiResponse<Meal>> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files[]', file));
    return this.http.post<ApiResponse<Meal>>(`${this.apiUrl}/${uuid}/gallery`, formData, { withCredentials: true });
  }

  deleteImage(uuid: string, path: string): Observable<ApiResponse<Meal>> {
    return this.http.request<ApiResponse<Meal>>('delete', `${this.apiUrl}/${uuid}/image`, {
      body: { path },
      withCredentials: true,
    });
  }
}
