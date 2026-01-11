import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { InterceptorAuth } from './interceptors/add-bearer-header/auth-interceptor';
import { InterceptorHttpErrorHandler } from './interceptors/handle-http-errors/http-error-handler-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([InterceptorAuth, InterceptorHttpErrorHandler])),
  ],
};
