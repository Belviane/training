import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { Formation } from '@app/core/shared/models/formation.model';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  private apiUrl = 'http://localhost:8080/api/formations';

  constructor(private http: HttpClient) { }

  getAllFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.apiUrl);
  }

  getFormation(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/${id}`);
  }

  createFormation(formation: Formation): Observable<Formation> {
    return this.http.post<Formation>(this.apiUrl, formation);
  }

  updateFormation(id: number, formation: Formation): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/${id}`, formation);
  }

  suspendFormation(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/suspendre`, {});
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