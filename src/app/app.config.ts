import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withXsrfConfiguration } from '@angular/common/http';
import { CustomHeadersInterceptor } from './custom-headers.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withXsrfConfiguration({cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN'}),
      ),
      {
        provide: HTTP_INTERCEPTORS,
        useClass: CustomHeadersInterceptor,
        multi: true,
      }

  ],
};
