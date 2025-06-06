import { Injectable } from '@angular/core';
import { User, UserRole } from "../../shared/models/user.model";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser$: Observable<User | null>;

    constructor(private http: HttpClient) {
        const storedUser = localStorage.getItem('currentUser');
        this.currentUserSubject = new BehaviorSubject<User | null>(
            storedUser ? JSON.parse(storedUser) : null
        );
        this.currentUser$ = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    getUserRole(): UserRole | null {
        return this.currentUserValue?.roles || null; // Note: 'roles' au lieu de 'role'
    }

    isLoggedIn(): boolean {
        return !!this.currentUserValue;
    }

    hasAnyRole(requiredRoles: UserRole[]): boolean { // Renommé requiredRole en requiredRoles
        if (!this.currentUserValue?.roles) return false;
        return requiredRoles.includes(this.currentUserValue.roles);
    }

    login(email: string, password: string): Observable<{user: User, token: string}> {
        return this.http.post<{user: User, token: string}>(
            'http://localhost:8000/api/login', 
            { email, password }
        ).pipe(
            tap(response => {
                if (response.user && response.token) {
                    localStorage.setItem('currentUser', JSON.stringify(response.user));
                    localStorage.setItem('token', response.token);
                    this.currentUserSubject.next(response.user);
                }
            })
        );
    }

    logout(): void {
        // Appel API avant de nettoyer le local storage
        this.http.post('http://localhost:8000/api/logout', {}).subscribe({
            complete: () => {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('token');
                this.currentUserSubject.next(null);
            },
            error: () => {
                // Nettoyer quand même en cas d'erreur
                localStorage.removeItem('currentUser');
                localStorage.removeItem('token');
                this.currentUserSubject.next(null);
            }
        });
    }

    getMe(): Observable<User> {
        return this.http.get<User>('http://localhost:8000/api/me').pipe(
            tap(user => {
                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
            })
        );
    }
}