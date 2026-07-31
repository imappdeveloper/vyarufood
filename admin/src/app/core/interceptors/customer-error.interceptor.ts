import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { CustomerAuthService } from '../services/customer-auth.service';

export const customerErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(CustomerAuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isCustomerApi = req.url.includes('/api/v1/customer');
      const isAuthPage = router.url.startsWith('/login') || router.url.startsWith('/register')
        || router.url.startsWith('/verify-otp') || router.url.startsWith('/forgot-password')
        || router.url.startsWith('/reset-password');
      const isPublicApi = req.url.includes('/api/v1/customer/categories')
        || req.url.includes('/api/v1/customer/meals')
        || req.url.includes('/api/v1/customer/subscription-plans')
        || req.url.includes('/api/v1/customer/meal-types');

      if (isCustomerApi) {
        switch (error.status) {
          case 0:
            if (!isAuthPage) {
              console.error('Network error');
            }
            break;
          case 401:
            if (authService.isLoggedIn && !isPublicApi) {
              authService.clearSession();
              const returnUrl = router.url;
              router.navigate(['/login'], { queryParams: { returnUrl } });
            }
            break;
          case 403:
            router.navigate(['/forbidden']);
            break;
          case 422:
            break;
          case 429:
            break;
          case 500:
            break;
          case 503:
            if (error.error?.maintenance_mode) {
              location.reload();
            }
            break;
        }
      }
      return throwError(() => error);
    })
  );
};
