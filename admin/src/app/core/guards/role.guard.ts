import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const requiredRoles = route.data['roles'] as string[];
  const user = authService.currentUser;

  if (!user) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (requiredRoles && requiredRoles.includes(user.role)) {
    return true;
  }

  notificationService.error('You do not have permission to access this page.');
  router.navigate(['/admin/dashboard']);
  return false;
};
