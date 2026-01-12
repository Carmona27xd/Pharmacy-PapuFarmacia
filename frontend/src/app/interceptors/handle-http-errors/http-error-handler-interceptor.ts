import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core'; // Importa Router aquí
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { InterfaceApiError } from '../../interfaces/http/HTTPError';

let isRedirectingToLogin = false;

export const InterceptorHttpErrorHandler: HttpInterceptorFn = (req, next) => {
  const router = inject(Router); // Inyección correcta de Router

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let apiError: InterfaceApiError = {
        status: error.status,
        message: 'Unexpected error occurred',
      };

      if (error.status === 0) {
        // 🌐 Error de red / CORS / servidor caído
        apiError.message = 'No se pudo conectar con el servidor';
      } else if (error.status === 401) {
        // 🔐 No autorizado
        apiError.message = 'Sesión expirada. Inicia sesión nuevamente.';

        if (!isRedirectingToLogin) {
          isRedirectingToLogin = true;
          router.navigate(['/login']).finally(() => {
            isRedirectingToLogin = false;
          });
        }
      } else if (error.status === 403) {
        // ⛔ Prohibido
        apiError.message = 'No tienes permisos para realizar esta acción';
      } else if (error.status >= 500) {
        // 💥 Error servidor
        apiError.message = 'Error interno del servidor. Intenta más tarde.';
      } else {
        // 📦 Error backend controlado
        apiError.message = error.error?.message || error.error?.detail || error.message;
      }

      apiError.originalError = error;
      console.error('HTTP Error:', apiError);
      return throwError(() => apiError);
    })
  );
};
