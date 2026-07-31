import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomerAuthApiService } from './customer-auth-api.service';
import { AppStateService } from './app-state.service';
import { CustomerProfile } from '../models/customer/customer-profile.model';
import { ApiResponse } from '../interfaces/api-response.interface';
import { CustomerAuthResponse } from '../interfaces/customer-auth-response.interface';

@Injectable({ providedIn: 'root' })
export class CustomerAuthService {
  private authApi = inject(CustomerAuthApiService);
  private appState = inject(AppStateService);

  get currentUser$(): Observable<CustomerProfile | null> {
    return this.authApi.currentUser$;
  }

  get currentUser(): CustomerProfile | null {
    return this.authApi.currentUser;
  }

  get isLoggedIn(): boolean {
    return this.authApi.isLoggedIn;
  }

  login(credentials: { email: string; password: string; remember_me?: boolean }): Observable<ApiResponse<CustomerAuthResponse>> {
    return this.authApi.login(credentials).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.appState.setCurrentUser(response.data.customer);
        }
      })
    );
  }

  register(data: Record<string, any>): Observable<ApiResponse<CustomerAuthResponse>> {
    return this.authApi.register(data).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.appState.setCurrentUser(response.data.customer);
        }
      })
    );
  }

  verifyOtp(otp: string): Observable<ApiResponse<CustomerAuthResponse>> {
    return this.authApi.verifyOtp(otp).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.appState.setCurrentUser(response.data.customer);
        }
      })
    );
  }

  resendOtp(): Observable<ApiResponse> {
    return this.authApi.resendOtp();
  }

  sendOtp(phone: string): Observable<ApiResponse<{ otp: string }>> {
    return this.authApi.sendOtp(phone);
  }

  registerSendOtp(phone: string): Observable<ApiResponse<{ otp: string }>> {
    return this.authApi.registerSendOtp(phone);
  }

  verifyOtpLogin(phone: string, otp: string): Observable<ApiResponse<CustomerAuthResponse>> {
    return this.authApi.verifyOtpLogin(phone, otp).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.appState.setCurrentUser(response.data.customer);
        }
      })
    );
  }

  registerVerifyOtp(data: { phone: string; otp: string; first_name?: string; last_name?: string; email?: string }): Observable<ApiResponse<CustomerAuthResponse>> {
    return this.authApi.registerVerifyOtp(data).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.appState.setCurrentUser(response.data.customer);
        }
      })
    );
  }

  forgotPassword(email: string): Observable<ApiResponse> {
    return this.authApi.forgotPassword(email);
  }

  resetPassword(data: { token: string; email: string; password: string; password_confirmation: string }): Observable<ApiResponse> {
    return this.authApi.resetPassword(data);
  }

  getProfile(): Observable<ApiResponse<CustomerProfile>> {
    return this.authApi.getProfile().pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.appState.setCurrentUser(response.data);
        }
      })
    );
  }

  changePassword(data: { current_password: string; password: string; password_confirmation: string }): Observable<ApiResponse> {
    return this.authApi.changePassword(data);
  }

  updateProfile(data: { first_name?: string; last_name?: string; email?: string; phone?: string; country_code?: string; gender?: string | null; date_of_birth?: string | null }): Observable<ApiResponse<CustomerProfile>> {
    return this.authApi.updateProfile(data);
  }

  uploadProfilePhoto(file: File): Observable<ApiResponse<CustomerProfile>> {
    return this.authApi.uploadProfilePhoto(file);
  }

  deleteProfilePhoto(): Observable<ApiResponse<CustomerProfile>> {
    return this.authApi.deleteProfilePhoto();
  }

  deleteAccount(data: { password: string; reason?: string }): Observable<ApiResponse> {
    return this.authApi.deleteAccount(data);
  }

  logout(): Observable<any> {
    return this.authApi.logout().pipe(
      tap(() => this.appState.clearState())
    );
  }

  clearSession(): void {
    this.authApi.clearSession();
    this.appState.clearState();
  }
}
