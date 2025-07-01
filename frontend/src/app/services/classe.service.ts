import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Classe } from '../core/shared/models/classe.model';
import { LaravelApi } from '@app/core/api/laravel.api';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClasseService {
  private apiUrl = LaravelApi.classes;

  constructor(private http: HttpClient) { }

  // CRUD de base
  createClasse(classe: Classe): Observable<Classe> {
    return this.http.post<Classe>(this.apiUrl, classe);
  }

  getClasses(): Observable<Classe[]> {
    return this.http.get<Classe[]>(this.apiUrl);
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

  // Fonctions spécifiques
  verifierDisponibiliteClasse(id: number, date: string, heureDebut: string, heureFin: string): Observable<{ disponible: boolean, message?: string }> {
    return this.http.get<{ disponible: boolean, message?: string }>(
      `${this.apiUrl}/${id}/verifier-disponibilite`,
      { params: { date, heureDebut, heureFin } }
    );
  }

  getCapaciteRestante(id: number): Observable<{ capacite_restante: number }> {
    return this.http.get<{ capacite_restante: number }>(`${this.apiUrl}/${id}/capacite-restante`);
  }

  // Ajoutez cette méthode pour récupérer les formations
  getFormations(): Observable<any[]> {
  return this.http.get<{data: any[]}>(LaravelApi.formations).pipe(
    map(response => response.data), // Extrait le tableau data de la réponse
    catchError(err => {
      console.error('Erreur API formations:', err);
      return of([]); // Retourne un tableau vide en cas d'erreur
    })
  );
}
}