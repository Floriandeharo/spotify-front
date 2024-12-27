import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import {provideAnimations} from "@angular/platform-browser/animations";
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { CustomHeadersInterceptor } from './custom-headers.interceptor';
import { authInterceptorInterceptor } from './service/auth-interceptor.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([authInterceptorInterceptor]),
      withXsrfConfiguration({cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN'}),
      ),
      {
        provide: HTTP_INTERCEPTORS,
        useClass: CustomHeadersInterceptor,
        multi: true,
      }

  ],
};
