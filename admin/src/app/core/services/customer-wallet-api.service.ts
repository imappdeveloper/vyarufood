import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import { Wallet, WalletTransaction, PaymentTransaction } from '../models/payment/payment.model';

@Injectable({ providedIn: 'root' })
export class CustomerWalletApiService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/${environment.apiVersion}/customer/wallet`;

  private buildParams(params: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return httpParams;
  }

  getWallet(): Observable<ApiResponse<Wallet>> {
    return this.http.get<ApiResponse<Wallet>>(this.base, { withCredentials: true });
  }

  recharge(amount: number, currency: string = 'INR'): Observable<ApiResponse<PaymentTransaction>> {
    return this.http.post<ApiResponse<PaymentTransaction>>(`${this.base}/recharge`, { amount, currency }, { withCredentials: true });
  }

  pay(amount: number, referenceType: string, referenceId?: number, remarks?: string): Observable<ApiResponse<WalletTransaction>> {
    const body: Record<string, any> = { amount, reference_type: referenceType };
    if (referenceId !== undefined) body['reference_id'] = referenceId;
    if (remarks !== undefined) body['remarks'] = remarks;
    return this.http.post<ApiResponse<WalletTransaction>>(`${this.base}/pay`, body, { withCredentials: true });
  }

  getHistory(params: {
    per_page?: number;
    transaction_type?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
  } = {}): Observable<PaginatedResponse<WalletTransaction>> {
    return this.http.get<PaginatedResponse<WalletTransaction>>(`${this.base}/history`, { params: this.buildParams(params), withCredentials: true });
  }

  getPaymentHistory(params: {
    per_page?: number;
    status?: string;
    payment_type?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
  } = {}): Observable<PaginatedResponse<PaymentTransaction>> {
    return this.http.get<PaginatedResponse<PaymentTransaction>>(`${this.base}/payment-history`, { params: this.buildParams(params), withCredentials: true });
  }
}
