import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Classe } from '../core/shared/models/classe.model';
import { LaravelApi } from '@app/core/api/laravel.api';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ClasseService {
  private apiUrl = LaravelApi.classes;

  constructor(private http: HttpClient,
    private snackBar: MatSnackBar,
  ) { }

  private showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: [`snackbar-${type}`],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  // CRUD de base
  createClasse(classe: Classe): Observable<Classe> {
    return this.http.post<Classe>(this.apiUrl, classe);
  }

  getClassess(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        console.log('Réponse classes:', response); // Debug
        // Adaptez selon la structure de votre API
        return response.data || response || [];
      }),
      catchError(err => {
        console.error('Erreur chargement classes', err);
        return of([]);
      })
    );
  }

  // classe.service.ts
  getClasses(): Observable<Classe[]> {
    return this.http.get<Classe[]>(this.apiUrl).pipe(
      map(classes => classes.map(classe => ({
        ...classe,
        formation: classe.formation
          ? {
            id: classe.formation.id,
            nom_formation: classe.formation.nom_formation
          }
          : undefined
      }))),
      catchError(err => {
        console.error('Erreur lors du chargement des classes', err);
        return of([]);
      })
    );
  }

  getClasse(id: number): Observable<Classe> {
    return this.http.get<Classe>(`${this.apiUrl}/${id}`);
  }

  updateClasse(id: number, classe: Classe): Observable<Classe> {
    return this.http.put<Classe>(`${this.apiUrl}/${id}`, classe);
  }

  deleteClasse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Ajoutez cette méthode pour récupérer les formations
  getFormations(): Observable<any[]> {
    return this.http.get<any[]>(LaravelApi.formations).pipe(
      catchError(err => {
        console.error('Erreur API formations:', err);
        return of([]);
      })
    );
  }

  /**
  * Vérifie la disponibilité d'une classe
  * @param id ID de la classe
  * @param date Date au format YYYY-MM-DD
  * @param heureDebut Heure de début (HH:MM)
  * @param heureFin Heure de fin (HH:MM)
  */
  verifierDisponibiliteClasse(
    id: number,
    date: string,
    heureDebut: string,
    heureFin: string
  ): Observable<{ disponible: boolean, message?: string, nombreApprenants?: number }> {
    return this.http.get<{
      disponible: boolean,
      message?: string,
      nombre_apprenants: number
    }>(
      LaravelApi.verifierDisponibiliteClasse(id),
      { params: { date, heureDebut, heureFin } }
    ).pipe(
      map(response => ({
        disponible: response.disponible,
        message: response.message,
        nombreApprenants: response.nombre_apprenants
      })),
      catchError(err => {
        this.showToast('Erreur lors de la vérification', 'error');
        return of({
          disponible: false,
          message: 'Erreur de vérification',
          nombreApprenants: 0
        });
      })
    );
  }

  /**
   * Récupère la capacité restante d'une classe
   * @param id ID de la classe
   */
  getCapaciteRestante(
    id: number,
    date: string
  ): Observable<{ capacite_restante: number, nombre_apprenants: number }> {
    return this.http.get<{
      capacite_restante: number,
      nombre_apprenants: number
    }>(
      LaravelApi.capaciteRestanteClasse(id),
      { params: { date } }
    ).pipe(
      catchError(err => {
        this.showToast('Erreur lors du chargement de la capacité', 'error');
        return of({ capacite_restante: 0, nombre_apprenants: 0 });
      })
    );
  }
}