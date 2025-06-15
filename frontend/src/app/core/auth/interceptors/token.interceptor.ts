import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from "../services/auth.services";
import { catchError } from 'rxjs/operators';
import { throwError, Observable  } from 'rxjs';
import { Router } from "@angular/router";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    let clonedRequest = request;

    if (token) {
      clonedRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token invalide ou expiré : logout + redirection login
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}