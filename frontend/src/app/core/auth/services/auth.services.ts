import { Injectable } from '@angular/core';
import { LoginRequest, AuthResponse, RegisterRequest, User } from "../../shared/models/user.model";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LaravelApi } from '@app/core/api/laravel.api';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Observable pour suivre l'utilisateur courant
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    // ===========================
    // Constructeur
    // ===========================
    constructor(private http: HttpClient, private router: Router) {
        // Initialise le service avec l'utilisateur stocké localement s'il existe
        const user = this.getUserFromStorage();
        if (user) {
            this.currentUserSubject.next(user);
        }
    }

    // ===========================
    // Méthodes Publiques
    // ===========================

    /**
     * Authentifie un utilisateur avec ses identifiants.
     * Stocke le token et l'utilisateur si succès.
     * Redirige vers la page de changement de mot de passe si nécessaire.
     */
    login(credentials: LoginRequest): Observable<AuthResponse> {
        console.log('Envoi des credentials:', credentials);
        return this.http.post<AuthResponse>(LaravelApi.login, credentials, {
            withCredentials: true
        }).pipe(
            tap(response => {
                // Prépare la réponse d'authentification
                const authResponse = {
                    token: response.access_token || response.token,
                    user: response.user
                };
                this.storeAuthData(authResponse);
                this.currentUserSubject.next(authResponse.user);

                // Redirige si le mot de passe doit être changé
                if (response.changer_password) {
                    this.router.navigate(['/change-password']);
                }
            }),
            catchError(error => {
                // Gestion spécifique des erreurs d'authentification
                if (error.status === 403 && error.error?.message?.includes('vérifier votre adresse email')) {
                    throw new Error('Veuillez vérifier votre email avant de vous connecter.');
                }
                throw error;
            })
        );
    }

    /**
     * Change le mot de passe de l'utilisateur connecté.
     * Nécessite un token valide.
     */
    changePassword(data: {
        login: string,
        password: string,
        password_confirmation: string
    }): Observable<any> {
        try {
            this.ensureTokenAvailable();
            const token = this.getToken();

            const headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            });

            const requestData = {
                login: data.login,
                password: data.password,
                password_confirmation: data.password_confirmation
            };

            return this.http.put(
                LaravelApi.changePassword,
                requestData,
                {
                    headers,
                    withCredentials: true
                }
            ).pipe(
                tap(() => {
                    // Met à jour le flag de changement de mot de passe
                    const user = this.currentUserSubject.value;
                    if (user) {
                        user.doit_changer_mot_de_passe = false;
                        this.currentUserSubject.next(user);
                    }
                }),
                catchError(error => {
                    console.error('Erreur détaillée:', error);
                    return throwError(() => error);
                })
            );
        } catch (e) {
            return throwError(() => e);
        }
    }

    /**
     * Déconnecte l'utilisateur et nettoie les données locales.
     */
    logout(): Observable<any> {
        return this.http.post(LaravelApi.logout, {}, {
            withCredentials: true
        }).pipe(
            tap(() => {
                this.clearAuthData();
                this.router.navigate(['/login']);
            })
        );
    }

    /**
     * Inscrit un nouvel utilisateur.
     * Stocke les données d'authentification si succès.
     */
    register(userData: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(LaravelApi.register, userData, {
            withCredentials: true
        }).pipe(
            tap(response => {
                this.storeAuthData(response);
                this.currentUserSubject.next(response.user);
            })
        );
    }

    /**
     * Vérifie si l'utilisateur courant est administrateur.
     */
    isAdmin(): boolean {
        const user = this.currentUserSubject.value;
        return user ? user.role_id === 1 : false; // 1 = administrateur
    }

    /**
     * Retourne l'utilisateur courant.
     */
    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    /**
     * Retourne le nom du rôle de l'utilisateur courant.
     */
    getUserRoleName(): string | null {
        const user = this.currentUserSubject.value;
        if (!user) return null;

        // Retourne le nom du rôle selon l'ID
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

    /**
     * Retourne le token d'authentification stocké localement.
     */
    getToken(): string | null {
        const currentUserJson = localStorage.getItem('currentUser');
        if (!currentUserJson) return null;

        try {
            const currentUser = JSON.parse(currentUserJson);
            // Cherche le token dans plusieurs propriétés possibles
            return currentUser?.token || currentUser?.access_token || null;
        } catch (e) {
            console.error('Erreur lors de la lecture du token:', e);
            return null;
        }
    }

    /**
     * Vérifie si l'utilisateur est authentifié (présence d'un token).
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    // ===========================
    // Getters
    // ===========================

    /**
     * Getter pour savoir si l'utilisateur est connecté.
     */
    get isLoggedIn(): boolean {
        return this.isAuthenticated();
    }

    /**
     * Getter pour le nom du rôle de l'utilisateur.
     */
    get userRole(): string | null {
        return this.getUserRoleName();
    }

    // ===========================
    // Méthodes Privées
    // ===========================

    /**
     * Stocke les données d'authentification (token + user) dans le localStorage.
     */
    private storeAuthData(response: AuthResponse): void {
        const authData = {
            token: response.access_token || response.token,
            user: response.user
        };

        try {
            localStorage.setItem('currentUser', JSON.stringify(authData));
            this.currentUserSubject.next(authData.user);
        } catch (e) {
            console.error('Erreur de stockage des données auth:', e);
        }
    }

    /**
     * Récupère l'utilisateur stocké dans le localStorage.
     */
    private getUserFromStorage(): User | null {
        const currentUserJson = localStorage.getItem('currentUser');
        if (!currentUserJson) return null;

        try {
            const currentUser = JSON.parse(currentUserJson);
            return currentUser?.user || null;
        } catch (e) {
            console.error('Erreur lors de la lecture de currentUser:', e);
            return null;
        }
    }

    /**
     * Supprime les données d'authentification du localStorage.
     */
    private clearAuthData(): void {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    /**
     * Vérifie la présence d'un token, sinon lève une erreur.
     */
    private ensureTokenAvailable(): void {
        if (!this.getToken()) {
            throw new Error('Token non disponible - Veuillez vous reconnecter');
        }
    }
}