import { inject } from "@angular/core";
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from "../services/auth.services";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Ne pas ajouter le token pour les routes sanctum
  if (req.url.includes('/sanctum/csrf-cookie') || req.url.includes('/login')) {
    return next(req); // Pas besoin de token
  }
  
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return next(authReq);
  }
  return next(req);
};