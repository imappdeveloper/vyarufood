import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CustomerAuthService } from '../services/customer-auth.service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(CustomerAuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn) {
    return true;
  }

  router.navigate(['/customer/dashboard']);
  return false;
};
