import { Injectable } from '@angular/core';
import { User, UserRole } from "../../shared/models/user.model";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError, throwError } from 'rxjs';
import { LaravelApi } from '@app/core/api/laravel.api';


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
        return this.currentUserValue?.role ? this.currentUserValue.role as UserRole : null;
    }

    isLoggedIn(): boolean {
        return !!this.currentUserValue;
    }

    hasAnyRole(requiredRoles: UserRole[]): boolean {
        if (!this.currentUserValue?.role) return false;
        return requiredRoles.includes(this.currentUserValue.role as UserRole);
    }

    login(login: string, mdp: string): Observable<any> {
        return this.http.post<any>(LaravelApi.login, { login, mdp }).pipe(
            tap(response => {
                if (response && response.token && response.user) {
                    // Si 'role' est un objet, on extrait la propriété libelle
                    let roleString = response.user.role;
                    if (typeof roleString === 'object' && roleString !== null && 'libelle' in roleString) {
                        roleString = roleString.libelle;
                    }

                    // Construire un nouvel objet user avec role en string
                    const user = {
                        ...response.user,
                        role: roleString
                    };

                    localStorage.setItem('token', response.token);
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
            })
        );
    }



    logout(): void {
        // Appel API avant de nettoyer le local storage
        this.http.post(LaravelApi.logout, {}).subscribe({
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
}