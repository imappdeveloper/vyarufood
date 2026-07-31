import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response.interface';
import { Cart, CartItem } from '../models/customer/cart.model';

@Injectable({ providedIn: 'root' })
export class CartApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/customer/cart`;

  getCart(): Observable<ApiResponse<Cart>> {
    return this.http.get<ApiResponse<Cart>>(this.apiUrl, { withCredentials: true });
  }

  addItem(mealId: number, quantity: number, specialInstructions?: string): Observable<ApiResponse<Cart>> {
    return this.http.post<ApiResponse<Cart>>(`${this.apiUrl}/items`, {
      meal_id: mealId,
      quantity,
      special_instructions: specialInstructions,
    }, { withCredentials: true });
  }

  updateItem(itemId: number, quantity: number): Observable<ApiResponse<Cart>> {
    return this.http.put<ApiResponse<Cart>>(`${this.apiUrl}/items/${itemId}`, { quantity }, { withCredentials: true });
  }

  removeItem(itemId: number): Observable<ApiResponse<Cart>> {
    return this.http.delete<ApiResponse<Cart>>(`${this.apiUrl}/items/${itemId}`, { withCredentials: true });
  }

  clearCart(): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.apiUrl, { withCredentials: true });
  }

  getCartCount(): Observable<ApiResponse<{ count: number }>> {
    return this.http.get<ApiResponse<{ count: number }>>(`${this.apiUrl}/count`, { withCredentials: true });
  }

  applyCoupon(couponCode: string): Observable<ApiResponse<Cart>> {
    return this.http.post<ApiResponse<Cart>>(`${this.apiUrl}/coupon/apply`, { coupon_code: couponCode }, { withCredentials: true });
  }

  removeCoupon(): Observable<ApiResponse<Cart>> {
    return this.http.post<ApiResponse<Cart>>(`${this.apiUrl}/coupon/remove`, {}, { withCredentials: true });
  }

  applyWallet(amount?: number): Observable<ApiResponse<Cart>> {
    return this.http.post<ApiResponse<Cart>>(`${this.apiUrl}/wallet/apply`, { amount }, { withCredentials: true });
  }

  removeWallet(): Observable<ApiResponse<Cart>> {
    return this.http.post<ApiResponse<Cart>>(`${this.apiUrl}/wallet/remove`, {}, { withCredentials: true });
  }
}
