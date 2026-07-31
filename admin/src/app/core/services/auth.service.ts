import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import { AdminUser } from '../models/auth/admin-user.model';
import { ApiResponse, AuthResponse } from '../interfaces/api-response.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authApi = inject(AuthApiService);

  get currentUser$(): Observable<AdminUser | null> {
    return this.authApi.currentUser$;
  }

  get currentUser(): AdminUser | null {
    return this.authApi.currentUser;
  }

  get isLoggedIn(): boolean {
    return this.authApi.isLoggedIn;
  }

  login(credentials: { email: string; password: string; remember_me?: boolean }): Observable<ApiResponse<AuthResponse>> {
    return this.authApi.login(credentials.email, credentials.password, credentials.remember_me ?? false);
  }

  logout(): Observable<any> {
    return this.authApi.logout();
  }

  clearSession(): void {
    this.authApi.clearSession();
  }
}
