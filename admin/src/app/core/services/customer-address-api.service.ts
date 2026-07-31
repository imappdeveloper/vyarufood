import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { CustomerAddress, CreateCustomerAddress, UpdateCustomerAddress, CustomerAddressStats, ServiceAvailability } from '../models/customer/customer-address.model';

@Injectable({ providedIn: 'root' })
export class CustomerAddressApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/customer-addresses`;

  getPaginated(params: Record<string, string>): Observable<PaginatedResponse<CustomerAddress>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this.http.get<PaginatedResponse<CustomerAddress>>(this.apiUrl, { params: httpParams, withCredentials: true });
  }

  getAll(params?: Record<string, string>): Observable<ApiResponse<CustomerAddress[]>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<ApiResponse<CustomerAddress[]>>(this.apiUrl, { params: httpParams, withCredentials: true });
  }

  getById(uuid: string): Observable<ApiResponse<CustomerAddress>> {
    return this.http.get<ApiResponse<CustomerAddress>>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  create(data: CreateCustomerAddress): Observable<ApiResponse<CustomerAddress>> {
    return this.http.post<ApiResponse<CustomerAddress>>(this.apiUrl, data, { withCredentials: true });
  }

  update(uuid: string, data: UpdateCustomerAddress): Observable<ApiResponse<CustomerAddress>> {
    return this.http.put<ApiResponse<CustomerAddress>>(`${this.apiUrl}/${uuid}`, data, { withCredentials: true });
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

  setDefault(uuid: string): Observable<ApiResponse<CustomerAddress>> {
    return this.http.patch<ApiResponse<CustomerAddress>>(`${this.apiUrl}/${uuid}/default`, {}, { withCredentials: true });
  }

  verify(uuid: string): Observable<ApiResponse<CustomerAddress>> {
    return this.http.patch<ApiResponse<CustomerAddress>>(`${this.apiUrl}/${uuid}/verify`, {}, { withCredentials: true });
  }

  setStatus(uuid: string, status: string): Observable<ApiResponse<CustomerAddress>> {
    return this.http.patch<ApiResponse<CustomerAddress>>(`${this.apiUrl}/${uuid}/status`, { status }, { withCredentials: true });
  }

  getStats(): Observable<ApiResponse<CustomerAddressStats>> {
    return this.http.get<ApiResponse<CustomerAddressStats>>(`${this.apiUrl}/stats`, { withCredentials: true });
  }

  search(query: string): Observable<ApiResponse<CustomerAddress[]>> {
    let httpParams = new HttpParams();
    if (query) httpParams = httpParams.set('q', query);
    return this.http.get<ApiResponse<CustomerAddress[]>>(`${this.apiUrl}/search`, { params: httpParams, withCredentials: true });
  }

  checkService(data: { pincode_id?: number; delivery_zone_id?: number; city_id?: number }): Observable<ApiResponse<ServiceAvailability>> {
    return this.http.post<ApiResponse<ServiceAvailability>>(`${this.apiUrl}/check-service`, data, { withCredentials: true });
  }

  import(file: File): Observable<ApiResponse<{ successes: number; failures: any[]; total: number }>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<{ successes: number; failures: any[]; total: number }>>(`${this.apiUrl}/import`, formData, { withCredentials: true });
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
