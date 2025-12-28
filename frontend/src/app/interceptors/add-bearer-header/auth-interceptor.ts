import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ServiceAuth } from '../../services/auth/auth';

export const InterceptorAuth: HttpInterceptorFn = (req, next) => {
  const auth = inject(ServiceAuth);
  const token = auth.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
