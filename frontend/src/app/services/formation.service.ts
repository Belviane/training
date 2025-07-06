import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, lastValueFrom, map, of } from 'rxjs';
import { Formation } from '@app/core/shared/models/formation.model';
import { LaravelApi } from '@app/core/api/laravel.api';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  constructor(private http: HttpClient) { }

  getFormations(): Observable<any[]> {
  return this.http.get<any>(LaravelApi.formations).pipe(
    map(response => response.data || []),
    catchError(err => {
      console.error('Erreur chargement formations', err);
      return of([]);
    })
  );
}

  getAllFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(LaravelApi.formations);
  }

  getFormation(id: number): Observable<Formation> {
    return this.http.get<Formation>(LaravelApi.getFormation(id));
  }

  createFormation(formation: Formation): Observable<Formation> {
    return this.http.post<Formation>(LaravelApi.formations, formation);
  }

  updateFormation(id: number, formation: Formation): Observable<Formation> {
    return this.http.put<Formation>(LaravelApi.updateFormation(id), formation);
  }

  suspendFormation(id: number): Observable<void> {
    // Vous devrez peut-être créer une nouvelle route pour suspendre une formation
    // return this.http.put<void>(LaravelApi.suspendFormation(id), {});
    throw new Error('Méthode non implémentée');
  }

  // Méthodes pour convertir les Observables en Promises
  async getFormationAsync(id: number): Promise<Formation> {
    return lastValueFrom(this.getFormation(id));
  }

  async createFormationAsync(formation: Formation): Promise<Formation> {
    return lastValueFrom(this.createFormation(formation));
  }

  async updateFormationAsync(id: number, formation: Formation): Promise<Formation> {
    return lastValueFrom(this.updateFormation(id, formation));
  }
}