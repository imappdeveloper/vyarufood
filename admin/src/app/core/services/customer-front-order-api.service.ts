import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response.interface';
import { CustomerOrder, CustomerOrderListResponse, CancelOrderPayload } from '../models/order/order.model';

export interface CheckoutSummary {
  cart: any;
  has_unavailable_items: boolean;
  addresses: any[];
  wallet_balance: number;
}

export interface PlaceOrderPayload {
  address_id: number;
  delivery_date: string;
  delivery_slot?: string;
  delivery_instruction?: string;
  payment_method: string;
  notes?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

export interface OrderListParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  order_status?: string[];
  payment_status?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

@Injectable({ providedIn: 'root' })
export class CustomerFrontOrderApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/customer`;

  getCheckoutSummary(): Observable<ApiResponse<CheckoutSummary>> {
    return this.http.get<ApiResponse<CheckoutSummary>>(`${this.apiUrl}/checkout/summary`, { withCredentials: true });
  }

  placeOrder(data: PlaceOrderPayload): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/checkout/place-order`, data, { withCredentials: true });
  }

  getOrders(params?: OrderListParams): Observable<CustomerOrderListResponse> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => { httpParams = httpParams.append(`${key}[]`, v); });
          } else {
            httpParams = httpParams.set(key, String(value));
          }
        }
      });
    }
    return this.http.get<CustomerOrderListResponse>(`${this.apiUrl}/orders`, { params: httpParams, withCredentials: true });
  }

  getOrder(uuid: string): Observable<ApiResponse<CustomerOrder>> {
    return this.http.get<ApiResponse<CustomerOrder>>(`${this.apiUrl}/orders/${uuid}`, { withCredentials: true });
  }

  cancelOrder(uuid: string, data?: CancelOrderPayload): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/orders/${uuid}/cancel`, data || {}, { withCredentials: true });
  }

  reorder(uuid: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.post<ApiResponse<{ message: string }>>(`${this.apiUrl}/orders/${uuid}/reorder`, {}, { withCredentials: true });
  }

  downloadInvoice(uuid: string): void {
    window.open(`${this.apiUrl}/orders/${uuid}/invoice`, '_blank');
  }
}
