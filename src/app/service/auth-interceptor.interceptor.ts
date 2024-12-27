import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  return next(req).pipe(
    tap({
      next: (res) => { console.log('next interceptor', res); },
      error: (err: HttpErrorResponse) => {
        console.log('error interceptor', err);
       if (err.status == 401 && err.url && err.url.includes('api/get-authenticated-user') && authService.isAuthenticated()){
          authService.login();
       }else if(err.url && ((req.method !== 'GET' && !err.url.endsWith('/api/songs')) || (err.url && !err.url.endsWith('api/get-authenticated-user')) && !authService.isAuthenticated())){
        authService.openOrCloseAuthPopup('OPEN');
       }
      }
    })
  );
};
