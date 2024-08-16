import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../Services/login.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(private loginSvc: LoginService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const localToken = this.loginSvc.getTokenValue();
    request.clone({
      headers: request.headers.set('Authorization', 'bearer' + localToken),
    });
    return next.handle(request);
  }
}
