import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isLoginPage = router.url.includes('/auth/login');

      switch (error.status) {
        case 0:
          if (!isLoginPage) {
            notificationService.error('Server is unreachable. Please try again later.');
          }
          break;
        case 401:
          if (!authService.isLoggedIn) {
            if (!isLoginPage) {
              notificationService.error('Invalid email or password.');
            }
          } else {
            authService.clearSession();
            router.navigate(['/admin/auth/login']);
          }
          break;
        case 403:
          notificationService.error('You do not have permission to perform this action.');
          break;
        case 404:
          notificationService.error('Resource not found.');
          break;
        case 422:
          const validationErrors = error.error?.errors;
          if (validationErrors) {
            const firstError = Object.values(validationErrors)[0];
            notificationService.error(
              Array.isArray(firstError) ? firstError[0] as string : 'Validation error.'
            );
          }
          break;
        case 429:
          notificationService.error('Too many requests. Please try again later.');
          break;
        case 500:
          notificationService.error(error.error?.message || 'Server error. Please try again later.');
          break;
        default:
          if (!isLoginPage) {
            notificationService.error(error.error?.message || 'An error occurred. Please try again.');
          }
      }
      return throwError(() => error);
    })
  );
};
