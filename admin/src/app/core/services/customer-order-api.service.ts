import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../interfaces/api-response.interface';

@Injectable({ providedIn: 'root' })
export class CustomerOrderApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/customer/orders`;

  getOrders(params?: Record<string, string | number>): Observable<PaginatedResponse<any>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, String(params[key]));
      });
    }
    return this.http.get<PaginatedResponse<any>>(this.apiUrl, { params: httpParams });
  }

  getOrder(uuid: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${uuid}`);
  }

  cancelOrder(uuid: string, reason?: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/${uuid}/cancel`, { reason });
  }

  reorder(uuid: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/${uuid}/reorder`, {});
  }
}
