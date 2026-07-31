import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response.interface';
import { CustomerAuthResponse } from '../interfaces/customer-auth-response.interface';
import { CustomerProfile } from '../models/customer/customer-profile.model';

@Injectable({ providedIn: 'root' })
export class CustomerAuthApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/customer`;

  private currentUserSubject = new BehaviorSubject<CustomerProfile | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  get currentUser(): CustomerProfile | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.getStoredUser();
  }

  get token(): string | null {
    return localStorage.getItem('tiffin_customer_token');
  }

  login(data: { email: string; password: string; remember_me?: boolean }): Observable<ApiResponse<CustomerAuthResponse>> {
    return this.http.post<ApiResponse<CustomerAuthResponse>>(`${this.apiUrl}/login`, data, { withCredentials: true }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setSession(response.data);
        }
      })
    );
  }

  register(data: Record<string, any>): Observable<ApiResponse<CustomerAuthResponse>> {
    return this.http.post<ApiResponse<CustomerAuthResponse>>(`${this.apiUrl}/register`, data, { withCredentials: true }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setSession(response.data);
        }
      })
    );
  }

  verifyOtp(otp: string): Observable<ApiResponse<CustomerAuthResponse>> {
    return this.http.post<ApiResponse<CustomerAuthResponse>>(`${this.apiUrl}/verify-otp`, { otp }, { withCredentials: true }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setSession(response.data);
        }
      })
    );
  }

  resendOtp(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/resend-otp`, {}, { withCredentials: true });
  }

  sendOtp(phone: string): Observable<ApiResponse<{ otp: string }>> {
    return this.http.post<ApiResponse<{ otp: string }>>(`${this.apiUrl}/send-otp`, { phone }, { withCredentials: true });
  }

  registerSendOtp(phone: string): Observable<ApiResponse<{ otp: string }>> {
    return this.http.post<ApiResponse<{ otp: string }>>(`${this.apiUrl}/register-send-otp`, { phone }, { withCredentials: true });
  }

  verifyOtpLogin(phone: string, otp: string): Observable<ApiResponse<CustomerAuthResponse>> {
    return this.http.post<ApiResponse<CustomerAuthResponse>>(`${this.apiUrl}/verify-login-otp`, { phone, otp }, { withCredentials: true }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setSession(response.data);
        }
      })
    );
  }

  registerVerifyOtp(data: { phone: string; otp: string; first_name?: string; last_name?: string; email?: string }): Observable<ApiResponse<CustomerAuthResponse>> {
    return this.http.post<ApiResponse<CustomerAuthResponse>>(`${this.apiUrl}/register-verify-otp`, data, { withCredentials: true }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setSession(response.data);
        }
      })
    );
  }

  forgotPassword(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(data: { token: string; email: string; password: string; password_confirmation: string }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/reset-password`, data);
  }

  getProfile(): Observable<ApiResponse<CustomerProfile>> {
    return this.http.get<ApiResponse<CustomerProfile>>(`${this.apiUrl}/profile`, { withCredentials: true }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setStoredUser(response.data);
          this.currentUserSubject.next(response.data);
        }
      })
    );
  }

  changePassword(data: { current_password: string; password: string; password_confirmation: string }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/change-password`, data, { withCredentials: true });
  }

  updateProfile(data: { first_name?: string; last_name?: string; email?: string; phone?: string; country_code?: string; gender?: string | null; date_of_birth?: string | null }): Observable<ApiResponse<CustomerProfile>> {
    return this.http.put<ApiResponse<CustomerProfile>>(`${this.apiUrl}/profile`, data, { withCredentials: true }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setStoredUser(response.data);
          this.currentUserSubject.next(response.data);
        }
      })
    );
  }

  uploadProfilePhoto(file: File): Observable<ApiResponse<CustomerProfile>> {
    const formData = new FormData();
    formData.append('profile_photo', file);
    return this.http.post<ApiResponse<CustomerProfile>>(`${this.apiUrl}/profile/photo`, formData, { withCredentials: true }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setStoredUser(response.data);
          this.currentUserSubject.next(response.data);
        }
      })
    );
  }

  deleteProfilePhoto(): Observable<ApiResponse<CustomerProfile>> {
    return this.http.delete<ApiResponse<CustomerProfile>>(`${this.apiUrl}/profile/photo`, { withCredentials: true }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setStoredUser(response.data);
          this.currentUserSubject.next(response.data);
        }
      })
    );
  }

  deleteAccount(data: { password: string; reason?: string }): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/account`, { withCredentials: true, body: data });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this.clearSession())
    );
  }

  clearSession(): void {
    localStorage.removeItem('tiffin_customer_user');
    localStorage.removeItem('tiffin_customer_token');
    this.currentUserSubject.next(null);
  }

  private setSession(authResult: CustomerAuthResponse): void {
    localStorage.setItem('tiffin_customer_user', JSON.stringify(authResult.customer));
    if (authResult.token) {
      localStorage.setItem('tiffin_customer_token', authResult.token);
    }
    this.currentUserSubject.next(authResult.customer);
  }

  private setStoredUser(user: CustomerProfile): void {
    localStorage.setItem('tiffin_customer_user', JSON.stringify(user));
  }

  private getStoredUser(): CustomerProfile | null {
    const data = localStorage.getItem('tiffin_customer_user');
    return data ? JSON.parse(data) : null;
  }
}
