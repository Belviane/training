import { Injectable } from '@angular/core';
import { LoginRequest, AuthResponse, RegisterRequest, User } from "../../shared/models/user.model";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LaravelApi } from '@app/core/api/laravel.api';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {
        // Initialiser avec l'utilisateur stocké s'il existe
        const user = this.getUserFromStorage();
        if (user) {
            this.currentUserSubject.next(user);
        }
    }

    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(LaravelApi.login, credentials, {
            withCredentials: true
        }).pipe(
            tap(response => {
                this.storeAuthData(response);
                this.currentUserSubject.next(response.user);
            })
        );
    }

    logout(): Observable<any> {
        return this.http.post(LaravelApi.logout, {}).pipe(
            tap(() => {
                this.clearAuthData();
                this.router.navigate(['/login']);
            })
        );
    }

    register(userData: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(LaravelApi.register, userData).pipe(
            tap(response => {
                this.storeAuthData(response);
                this.currentUserSubject.next(response.user);
            })
        );
    }

    isAdmin(): boolean {
        const user = this.currentUserSubject.value;
        return user ? user.role_id === 1 : false; // 1 = administrateur
    }

    get isLoggedIn(): boolean {
        return this.isAuthenticated();
    }

    get userRole(): string | null {
        return this.getUserRoleName();
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    getUserRoleName(): string | null {
        const user = this.currentUserSubject.value;
        if (!user) return null;

        // Utilisez une simple condition switch au lieu de la récursion
        switch (user.role_id) {
            case 1: return 'administrateur';
            case 2: return 'superviseur';
            case 3: return 'formateur';
            case 4: return 'apprenant';
            case 5: return 'parent';
            case 6: return 'caissier';
            case 7: return 'auditeur';
            default: return null;
        }
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    private storeAuthData(response: AuthResponse): void {
        this.setToken(response.token);
        this.setUser(response.user);
    }

    private setToken(token: string): void {
        localStorage.setItem('token', token);
    }

    private setUser(user: User): void {
        localStorage.setItem('user', JSON.stringify(user));
    }

    private getUserFromStorage(): User | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    private clearAuthData(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
    }
}