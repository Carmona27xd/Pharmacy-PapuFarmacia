import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core'; // Importa Router aquí
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const InterceptorHttpErrorHandler: HttpInterceptorFn = (req, next) => {
  const router = inject(Router); // Inyección correcta de Router

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Error HTTP:', error);

      if (error.status === 401) {
        window.alert('Sesión expirada. Inicia sesión nuevamente.');
        router.navigate(['/login']); // Navega a la ruta de login (ajusta según tu app)
      } else if (error.status === 500) {
        window.alert('Error del servidor. Intenta más tarde.');
      } else {
        window.alert('Error desconocido: ' + error.message);
      }

      // Re-lanza el error para que el componente lo maneje si es necesario
      return throwError(() => error);
    })
  );
};
