import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../interfaces/api-response.interface';
import {
  Wallet, WalletTransaction, PaymentTransaction, PaymentRefund,
  PaymentWebhookLog, PaymentDashboardStats, RevenueSummary
} from '../models/payment/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentApiService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/${environment.apiVersion}/admin/payments`;
  private walletBase = `${environment.apiUrl}/${environment.apiVersion}/admin/wallets`;

  private buildParams(params: Record<string, string>): HttpParams {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, value);
      }
    });
    return httpParams;
  }

  // Dashboard
  getDashboardStats(): Observable<ApiResponse<PaymentDashboardStats>> {
    return this.http.get<ApiResponse<PaymentDashboardStats>>(`${this.base}/dashboard-stats`, { withCredentials: true });
  }

  getRevenueSummary(params: Record<string, string> = {}): Observable<ApiResponse<RevenueSummary>> {
    return this.http.get<ApiResponse<RevenueSummary>>(`${this.base}/revenue-summary`, { params: this.buildParams(params), withCredentials: true });
  }

  // Payment Transactions
  getPayments(params: Record<string, string> = {}): Observable<ApiResponse<PaymentTransaction[]>> {
    return this.http.get<ApiResponse<PaymentTransaction[]>>(`${this.base}`, { params: this.buildParams(params), withCredentials: true });
  }

  getPayment(uuid: string): Observable<ApiResponse<PaymentTransaction>> {
    return this.http.get<ApiResponse<PaymentTransaction>>(`${this.base}/${uuid}`, { withCredentials: true });
  }

  // Refunds
  getRefunds(params: Record<string, string> = {}): Observable<ApiResponse<PaymentRefund[]>> {
    return this.http.get<ApiResponse<PaymentRefund[]>>(`${this.base}/refunds`, { params: this.buildParams(params), withCredentials: true });
  }

  processRefund(data: any): Observable<ApiResponse<PaymentRefund>> {
    return this.http.post<ApiResponse<PaymentRefund>>(`${this.base}/refunds`, data, { withCredentials: true });
  }

  // Webhook Logs
  getWebhookLogs(params: Record<string, string> = {}): Observable<ApiResponse<PaymentWebhookLog[]>> {
    return this.http.get<ApiResponse<PaymentWebhookLog[]>>(`${this.base}/webhook-logs`, { params: this.buildParams(params), withCredentials: true });
  }

  // Wallets
  getWallets(params: Record<string, string> = {}): Observable<ApiResponse<Wallet[]>> {
    return this.http.get<ApiResponse<Wallet[]>>(`${this.walletBase}`, { params: this.buildParams(params), withCredentials: true });
  }

  getWallet(uuid: string): Observable<ApiResponse<Wallet>> {
    return this.http.get<ApiResponse<Wallet>>(`${this.walletBase}/${uuid}`, { withCredentials: true });
  }

  getWalletTransactions(uuid: string, params: Record<string, string> = {}): Observable<ApiResponse<WalletTransaction[]>> {
    return this.http.get<ApiResponse<WalletTransaction[]>>(`${this.walletBase}/${uuid}/transactions`, { params: this.buildParams(params), withCredentials: true });
  }

  adjustWalletBalance(uuid: string, data: any): Observable<ApiResponse<Wallet>> {
    return this.http.patch<ApiResponse<Wallet>>(`${this.walletBase}/${uuid}/adjust`, data, { withCredentials: true });
  }
}
