import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { DeliveryZone, CreateDeliveryZone, UpdateDeliveryZone, DeliveryZoneImportResult } from '../models/master/delivery-zone.model';
import { PaginationParams } from '../interfaces/pagination.interface';

@Injectable({ providedIn: 'root' })
export class DeliveryZoneApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/delivery-zones`;

  getAll(params?: Record<string, string>): Observable<ApiResponse<DeliveryZone[]>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<ApiResponse<DeliveryZone[]>>(this.apiUrl, { params: httpParams, withCredentials: true });
  }

  getPaginated(params: PaginationParams): Observable<PaginatedResponse<DeliveryZone>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('per_page', params.per_page.toString());
    if (params.sort) httpParams = httpParams.set('sort', params.sort);
    if (params.order) httpParams = httpParams.set('order', params.order);
    if (params.search) httpParams = httpParams.set('search', params.search);
    return this.http.get<PaginatedResponse<DeliveryZone>>(this.apiUrl, { params: httpParams, withCredentials: true });
  }

  getById(uuid: string): Observable<ApiResponse<DeliveryZone>> {
    return this.http.get<ApiResponse<DeliveryZone>>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  create(data: CreateDeliveryZone): Observable<ApiResponse<DeliveryZone>> {
    return this.http.post<ApiResponse<DeliveryZone>>(this.apiUrl, data, { withCredentials: true });
  }

  update(uuid: string, data: UpdateDeliveryZone): Observable<ApiResponse<DeliveryZone>> {
    return this.http.put<ApiResponse<DeliveryZone>>(`${this.apiUrl}/${uuid}`, data, { withCredentials: true });
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

  setStatus(uuid: string, status: string): Observable<ApiResponse<DeliveryZone>> {
    return this.http.patch<ApiResponse<DeliveryZone>>(`${this.apiUrl}/${uuid}/status`, { status }, { withCredentials: true });
  }

  setDefault(uuid: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/${uuid}/set-default`, {}, { withCredentials: true });
  }

  import(file: File): Observable<ApiResponse<DeliveryZoneImportResult>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<DeliveryZoneImportResult>>(`${this.apiUrl}/import`, formData, { withCredentials: true });
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

  checkServiceArea(latitude: number, longitude: number, cityId?: number): Observable<ApiResponse> {
    let httpParams = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString());
    if (cityId) httpParams = httpParams.set('city_id', cityId.toString());
    return this.http.get<ApiResponse>('/api/v1/check-service-area', { params: httpParams });
  }
}
