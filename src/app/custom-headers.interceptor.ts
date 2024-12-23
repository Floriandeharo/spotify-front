import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CustomHeadersInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone la requête pour ajouter les headers nécessaires
    const clonedRequest = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:4200', // Permettre l'origine
        'Access-Control-Allow-Credentials': 'true', // Autoriser les credentials
      },
    });

    return next.handle(clonedRequest);
  }
}
