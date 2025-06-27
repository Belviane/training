import { inject } from "@angular/core";
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from "../services/auth.services";
// export class TokenInterceptor implements HttpInterceptor {

//   constructor(private authService: AuthService) { }

//   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//     const token = this.authService.getToken();
    
//     if (token) {
//       request = request.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         }
//       });
//     }

//     return next.handle(request);
//   }
// }

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Ne pas ajouter le token pour les routes sanctum
  if (req.url.includes('/sanctum/')) {
    return next(req);
  }
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true
    });
  }
  return next(req);
};