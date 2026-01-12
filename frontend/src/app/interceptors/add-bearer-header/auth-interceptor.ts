import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ServiceAuth } from '../../services/auth/auth';
import { environment } from '../../../environments/environment.development';

export const InterceptorAuth: HttpInterceptorFn = (req, next) => {
  const auth = inject(ServiceAuth);
  const token = auth.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-Web-Client-Token': environment.web_client,
      },
    });
  }

  return next(req);
};
