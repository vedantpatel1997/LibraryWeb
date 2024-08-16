import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { LoginService } from '../Services/login.service';
import { APIResponse } from '../DTO/APIResponse';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private loginSvc: LoginService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authRequest = req;
    authRequest = this.AddTokenHandler(req, this.loginSvc.getTokenValue());
    return next.handle(authRequest).pipe(
      catchError((errorData) => {
        if (errorData.status === 401) {
          return this.handleRefreshToken(req, next);
        }
        return throwError(errorData);
      })
    );
  }

  handleRefreshToken(request: HttpRequest<any>, next: HttpHandler) {
    return this.loginSvc.generateRefreshToken().pipe(
      switchMap((APIResponse: APIResponse) => {
        if (APIResponse.isSuccess) {
          // Token generation is successful
          this.loginSvc.setData(APIResponse);
          this.loginSvc.login();
          return next.handle(
            this.AddTokenHandler(request, APIResponse.data.token)
          );
        } else {
          // You might want to handle the error here or take appropriate action
          return throwError('Token generation failed');
        }
      }),
      catchError((errorData) => {
        console.log('Refreshtoken Generation error');
        alert('Authorization failed, please login again!');
        this.loginSvc.logout();

        return throwError(errorData);
      })
    );
  }

  AddTokenHandler(request: HttpRequest<any>, token: any) {
    return request.clone({
      headers: request.headers.set('Authorization', 'bearer ' + token),
    });
  }
}
