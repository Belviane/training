import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LaravelApi } from '@app/core/api/laravel.api';

@Injectable({
  providedIn: 'root'
})
export class FormateurService {
  private apiUrl = LaravelApi.formateurs;

  constructor(private http: HttpClient) { }

  // Liste complète des formateurs
  getFormateurs(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        // Si pagination, accédez à response.data
        const formateurs = response.data || response || [];
        return formateurs.map((formateur: any) => ({
          id: formateur.id,
          nom: formateur.utilisateur?.nom || 'Inconnu',
          prenom: formateur.utilisateur?.prenom || '',
          specialite: formateur.specialite,
          // Ajoutez d'autres champs si nécessaire
        }));
      }),
      catchError(err => {
        console.error('Erreur API formateurs:', err);
        return of([]);
      })
    );
  }

  // Obtenir un formateur par ID
  getFormateur(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Créer un formateur
  createFormateur(formateur: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, formateur);
  }

  // Modifier un formateur
  updateFormateur(id: number, formateur: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, formateur);
  }

  // Supprimer un formateur
  deleteFormateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Pour dashboard
  getFormateurCount(): Observable<number> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => {
        if (Array.isArray(data)) {
          return data.length;
        } else {
          console.error('Les données reçues ne sont pas un tableau');
          return 0;
        }
      }),
      catchError(err => {
        console.error('Erreur récupération formateur :', err);
        return of(0);
      })
    );
  }
}
