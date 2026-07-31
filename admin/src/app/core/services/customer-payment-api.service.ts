import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable({ providedIn: 'root' })
export class CustomerPaymentApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/customer/payment`;

  createPaymentOrder(orderId: number, amount: number, paymentMethod: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/create-order`, {
      order_id: orderId,
      amount,
      payment_method: paymentMethod,
    }, { withCredentials: true });
  }

  verifyPayment(transactionId: number, razorpayPaymentId: string, razorpayOrderId: string, razorpaySignature: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/verify`, {
      transaction_id: transactionId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_order_id: razorpayOrderId,
      razorpay_signature: razorpaySignature,
    }, { withCredentials: true });
  }

  payFromWallet(orderId: number, amount: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/wallet-pay`, {
      order_id: orderId,
      amount,
    }, { withCredentials: true });
  }

  getWalletBalance(): Observable<ApiResponse<{ wallet_balance: number }>> {
    return this.http.get<ApiResponse<{ wallet_balance: number }>>(`${this.apiUrl}/wallet-balance`, { withCredentials: true });
  }
}
