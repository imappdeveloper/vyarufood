import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { KitchenCapacity, CreateKitchenCapacity, UpdateKitchenCapacity } from '../models/kitchen/kitchen-capacity.model';

@Injectable({ providedIn: 'root' })
export class KitchenCapacityApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/kitchen-capacity`;

  getAll(params?: Record<string, string>): Observable<ApiResponse<KitchenCapacity[]>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<ApiResponse<KitchenCapacity[]>>(this.apiUrl, { params: httpParams, withCredentials: true });
  }

  getPaginated(params: Record<string, string>): Observable<PaginatedResponse<KitchenCapacity>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this.http.get<PaginatedResponse<KitchenCapacity>>(this.apiUrl, { params: httpParams, withCredentials: true });
  }

  getById(uuid: string): Observable<ApiResponse<KitchenCapacity>> {
    return this.http.get<ApiResponse<KitchenCapacity>>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  create(data: CreateKitchenCapacity): Observable<ApiResponse<KitchenCapacity>> {
    return this.http.post<ApiResponse<KitchenCapacity>>(this.apiUrl, data, { withCredentials: true });
  }

  update(uuid: string, data: UpdateKitchenCapacity): Observable<ApiResponse<KitchenCapacity>> {
    return this.http.put<ApiResponse<KitchenCapacity>>(`${this.apiUrl}/${uuid}`, data, { withCredentials: true });
  }

  delete(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  bulkUpdate(data: { kitchen_id: number; capacities: any[] }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/bulk-update`, data, { withCredentials: true });
  }

  getStats(kitchenId: number): Observable<ApiResponse<any>> {
    let httpParams = new HttpParams().set('kitchen_id', kitchenId.toString());
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/stats`, { params: httpParams, withCredentials: true });
  }
}
