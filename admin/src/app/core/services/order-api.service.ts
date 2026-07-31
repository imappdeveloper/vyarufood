import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { Order } from '../models/order/order.model';

@Injectable({ providedIn: 'root' })
export class OrderApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin/orders`;

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

  getOrders(params?: Record<string, string>): Observable<PaginatedResponse<Order>> {
    return this.http.get<PaginatedResponse<Order>>(this.apiUrl, { params: this.buildParams(params), withCredentials: true });
  }

  getStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/stats`, { withCredentials: true });
  }

  getDashboardStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/dashboard-stats`, { withCredentials: true });
  }

  getTodaySummary(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/today-summary`, { withCredentials: true });
  }

  getOrder(uuid: string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  createOrder(data: any): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(this.apiUrl, data, { withCredentials: true });
  }

  updateOrder(uuid: string, data: any): Observable<ApiResponse<Order>> {
    return this.http.put<ApiResponse<Order>>(`${this.apiUrl}/${uuid}`, data, { withCredentials: true });
  }

  updatePaymentStatus(uuid: string, paymentStatus: string): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(`${this.apiUrl}/${uuid}/update-payment-status`, { payment_status: paymentStatus }, { withCredentials: true });
  }

  deleteOrder(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${uuid}`, { withCredentials: true });
  }

  restoreOrder(uuid: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/${uuid}/restore`, {}, { withCredentials: true });
  }

  forceDeleteOrder(uuid: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${uuid}/force-delete`, { withCredentials: true });
  }

  confirmOrder(uuid: string): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(`${this.apiUrl}/${uuid}/confirm`, {}, { withCredentials: true });
  }

  prepareOrder(uuid: string): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(`${this.apiUrl}/${uuid}/prepare`, {}, { withCredentials: true });
  }

  readyOrder(uuid: string): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(`${this.apiUrl}/${uuid}/ready`, {}, { withCredentials: true });
  }

  dispatchOrder(uuid: string): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(`${this.apiUrl}/${uuid}/dispatch`, {}, { withCredentials: true });
  }

  deliverOrder(uuid: string): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(`${this.apiUrl}/${uuid}/deliver`, {}, { withCredentials: true });
  }

  cancelOrder(uuid: string, data: any): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(`${this.apiUrl}/${uuid}/cancel`, data, { withCredentials: true });
  }

  refundOrder(uuid: string, data: any): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(`${this.apiUrl}/${uuid}/refund`, data, { withCredentials: true });
  }

  duplicateOrder(uuid: string): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(`${this.apiUrl}/${uuid}/duplicate`, {}, { withCredentials: true });
  }

  generateOrders(data?: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/generate-daily`, data || {}, { withCredentials: true });
  }

  bulkUpdateStatus(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/bulk-status`, data, { withCredentials: true });
  }

  getTimeline(uuid: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${uuid}/timeline`, { withCredentials: true });
  }
}
