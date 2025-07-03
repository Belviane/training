import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LaravelApi } from '@app/core/api/laravel.api';

@Injectable({
  providedIn: 'root'
})
export class ApprenantService {
  private apiUrl = LaravelApi.apprenants;

  constructor(private http: HttpClient) { }

  // Liste complète des apprenants
  getApprenants(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        if (response && Array.isArray(response.data)) {
          return response.data;
        } else if (Array.isArray(response)) {
          return response;
        } else {
          console.warn('Format de réponse inattendu pour les apprenants', response);
          return [];
        }
      }),
      catchError(err => {
        console.error('Erreur API apprenants:', err);
        return of([]);
      })
    );
  }

  // Obtenir un apprenant par ID
  getApprenant(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Créer un nouvel apprenant
  createApprenant(apprenant: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, apprenant);
  }

  // Modifier un apprenant
  updateApprenant(id: number, apprenant: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, apprenant);
  }

  // Supprimer un apprenant
  deleteApprenant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Pour dashboard
  getApprenantCount(): Observable<number> {
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
        console.error('Erreur récupération apprenants :', err);
        return of(0);
      })
    );
  }
}
