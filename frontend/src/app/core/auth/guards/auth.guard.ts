import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserRole } from "../../shared/models/user.model";
import { AuthService } from "../services/auth.services";

@Injectable({
    providedIn: 'root'  
})
export class AuthGuard implements CanActivate {
    constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // 1. Vérifier si l'utilisateur est connecté
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    // 2. Vérifier les rôles requis
    const requiredRoles = next.data['roles'] as UserRole[];
    if (requiredRoles && !this.authService.hasAnyRole(requiredRoles)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
