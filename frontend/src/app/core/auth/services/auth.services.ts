import { Injectable } from '@angular/core';
import { User, UserRole } from "../../shared/models/user.model";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError, throwError } from 'rxjs';
import { LaravelApi } from '@app/core/api/laravel.api';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Supposons que les infos utilisateur sont stockées dans un objet user
    private user: { name: string;  /* autres champs */ } | null = null;
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
        return this.currentUserValue?.role ? this.currentUserValue.role as UserRole : null;
    }

    getUserName(): Observable<string> {
        return this.http.get<{ nom: string; prenom: string }>(LaravelApi.userinfo).pipe(
            map(user => `${user.prenom} ${user.nom}`)
        );
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    hasAnyRole(requiredRoles: UserRole[]): boolean {
        if (!this.currentUserValue?.role) return false;
        return requiredRoles.includes(this.currentUserValue.role as UserRole);
    }

    login(login: string, password: string): Observable<any> {
        return this.http.post<any>(LaravelApi.login, { login, password }).pipe(
            tap(response => {
                if (response && response.token) {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('currentUser', JSON.stringify(response.user));
                    this.currentUserSubject.next(response.user);
                }
            })
        );
    }

    logout(): void {
        this.http.post(LaravelApi.logout, {}).subscribe({
            complete: () => {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('token');
                this.currentUserSubject.next(null);
            },
            error: (error) => {
                console.error('Erreur lors de la déconnexion :', error);
                localStorage.removeItem('currentUser');
                localStorage.removeItem('token');
                this.currentUserSubject.next(null);
            }
        });
    }

    register(user: any): Observable<any> {
        return this.http.post(LaravelApi.register, user).pipe(
            tap(response => {
                console.log('Réponse de l\'API :', response);
            }),
            catchError(error => {
                console.error('Erreur d\'inscription :', error);
                return throwError(error);
            })
        );
    }

    getToken(): string | null {
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        return token;
    }

    validateToken(): Observable<boolean> {
        return this.http.get(LaravelApi.userinfo).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

}