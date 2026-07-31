import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CustomerAuthService } from '../services/customer-auth.service';
import { map, catchError, of } from 'rxjs';

export const customerAuthGuard: CanActivateFn = (_route, state) => {
  const authService = inject(CustomerAuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  return authService.getProfile().pipe(
    map((response) => {
      if (response.success && response.data) {
        const status = response.data.status;
        if (status === 'blocked') {
          authService.clearSession();
          router.navigate(['/login']);
          return false;
        }
        if (status !== 'active') {
          authService.clearSession();
          router.navigate(['/login']);
          return false;
        }
        return true;
      }
      authService.clearSession();
      router.navigate(['/login']);
      return false;
    }),
    catchError(() => {
      authService.clearSession();
      router.navigate(['/login']);
      return of(false);
    })
  );
};
