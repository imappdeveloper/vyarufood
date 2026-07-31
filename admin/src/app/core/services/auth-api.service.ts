import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, AuthResponse } from '../interfaces/api-response.interface';
import { AdminUser } from '../models/auth/admin-user.model';
import { APP_CONSTANTS } from '../constants/app.constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/${environment.apiVersion}/admin`;

  private currentUserSubject = new BehaviorSubject<AdminUser | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  get currentUser(): AdminUser | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.getStoredUser();
  }

  login(email: string, password: string, remember_me = false): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, { email, password, remember_me }, { withCredentials: true }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setSession(response.data);
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this.clearSession())
    );
  }

  forgotPassword(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, email: string, password: string, password_confirmation: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/reset-password`, { token, email, password, password_confirmation });
  }

  changePassword(current_password: string, password: string, password_confirmation: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/change-password`, { current_password, password, password_confirmation }, { withCredentials: true });
  }

  getProfile(): Observable<ApiResponse<AdminUser>> {
    return this.http.get<ApiResponse<AdminUser>>(`${this.apiUrl}/profile`, { withCredentials: true }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setStoredUser(response.data);
          this.currentUserSubject.next(response.data);
        }
      })
    );
  }

  updateProfile(data: any): Observable<ApiResponse<AdminUser>> {
    return this.http.put<ApiResponse<AdminUser>>(`${this.apiUrl}/profile`, data, { withCredentials: true }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setStoredUser(response.data);
          this.currentUserSubject.next(response.data);
        }
      })
    );
  }

  updateProfilePhoto(file: File): Observable<ApiResponse<AdminUser>> {
    const formData = new FormData();
    formData.append('profile_photo', file);
    return this.http.post<ApiResponse<AdminUser>>(`${this.apiUrl}/profile/photo`, formData, { withCredentials: true });
  }

  logoutAllDevices(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout-all`, {}, { withCredentials: true }).pipe(
      tap(() => this.clearSession())
    );
  }

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.USER, JSON.stringify(authResult.admin));
    this.currentUserSubject.next(authResult.admin);
  }

  private setStoredUser(user: AdminUser): void {
    localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.USER, JSON.stringify(user));
  }

  private getStoredUser(): AdminUser | null {
    const data = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  }

  clearSession(): void {
    localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.USER);
    this.currentUserSubject.next(null);
  }
}
