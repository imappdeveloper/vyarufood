import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { Pincode, CreatePincode, UpdatePincode, PincodeImportResult } from '../models/master/pincode.model';
import { PaginationParams } from '../interfaces/pagination.interface';

@Injectable({ providedIn: 'root' })
export class PincodeApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/pincodes`;

  getAll(params?: Record<string, string>): Observable<ApiResponse<Pincode[]>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<ApiResponse<Pincode[]>>(this.apiUrl, { params: httpParams, withCredentials: true });
  }

  getPaginated(params: PaginationParams): Observable<PaginatedResponse<Pincode>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('per_page', params.per_page.toString());
    if (params.sort) httpParams = httpParams.set('sort', params.sort);
    if (params.order) httpParams = httpParams.set('order', params.order);
    if (params.search) httpParams = httpParams.set('search', params.search);
    return this.http.get<PaginatedResponse<Pincode>>(this.apiUrl, { params: httpParams, withCredentials: true });
  }

  getById(uuid: string): Observable<ApiResponse<Pincode>> {
    return this.http.get<ApiResponse<Pincode>>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  create(data: CreatePincode): Observable<ApiResponse<Pincode>> {
    return this.http.post<ApiResponse<Pincode>>(this.apiUrl, data, { withCredentials: true });
  }

  update(uuid: string, data: UpdatePincode): Observable<ApiResponse<Pincode>> {
    return this.http.put<ApiResponse<Pincode>>(`${this.apiUrl}/${uuid}`, data, { withCredentials: true });
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

  setStatus(uuid: string, status: string): Observable<ApiResponse<Pincode>> {
    return this.http.patch<ApiResponse<Pincode>>(`${this.apiUrl}/${uuid}/status`, { status }, { withCredentials: true });
  }

  import(file: File): Observable<ApiResponse<PincodeImportResult>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<PincodeImportResult>>(`${this.apiUrl}/import`, formData, { withCredentials: true });
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
