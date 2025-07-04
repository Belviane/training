import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LaravelApi } from '@app/core/api/laravel.api';

@Injectable({
  providedIn: 'root'
})
export class ParentService {
  private apiUrl = LaravelApi.parents;

  constructor(private http:HttpClient) { }

  getParents(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        if (response && Array.isArray(response.data)) {
          return response.data;
        } else if (Array.isArray(response)) {
          return response;
        } else {
          console.warn('Format inattendu des parents', response);
          return [];
        }
      }),
      catchError(err => {
        console.error('Erreur chargement parents', err);
        return of([]);
      })
    );
  }
}
