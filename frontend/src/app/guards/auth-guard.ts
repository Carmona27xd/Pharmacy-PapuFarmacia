import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ServiceAuth } from '../services/auth/auth';

export const GuardAuth: CanActivateFn = (route, state) => {
  const servAuth = inject(ServiceAuth);
  const router = inject(Router);

  if (servAuth.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
