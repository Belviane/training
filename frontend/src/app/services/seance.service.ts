import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Seance } from '../core/shared/models/seance.model';
import { LaravelApi } from '@app/core/api/laravel.api';

@Injectable({
  providedIn: 'root'
})
export class SeanceService {
  private apiUrl = `${LaravelApi}/seances`;

  constructor(private http: HttpClient) { }

  // CRUD de base
  createSeance(seance: Seance): Observable<Seance> {
    return this.http.post<Seance>(this.apiUrl, seance);
  }

  getSeances(): Observable<Seance[]> {
    return this.http.get<Seance[]>(this.apiUrl);
  }

  getSeance(id: number): Observable<Seance> {
    return this.http.get<Seance>(`${this.apiUrl}/${id}`);
  }

  updateSeance(id: number, seance: Seance): Observable<Seance> {
    return this.http.put<Seance>(`${this.apiUrl}/${id}`, seance);
  }

  deleteSeance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Fonctions spécifiques
  annulerSeance(id: number): Observable<Seance> {
    return this.http.post<Seance>(`${this.apiUrl}/${id}/annuler`, {});
  }

  demarrerSeance(id: number): Observable<Seance> {
    return this.http.post<Seance>(`${this.apiUrl}/${id}/demarrer`, {});
  }

  terminerSeance(id: number): Observable<Seance> {
    return this.http.post<Seance>(`${this.apiUrl}/${id}/terminer`, {});
  }

  notifierSeance(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/${id}/notifier`, {});
  }

  getFeuillePresence(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/feuille-presence`, { responseType: 'blob' });
  }

  getFormateurSeance(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/formateur`);
  }

  getClasseSeance(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/classe`);
  }

  // Fonction pour vérifier la disponibilité d'une classe pour une séance
  checkClassAvailabilityForSeance(classeId: number, seanceId?: number, date?: string, heureDebut?: string, heureFin?: string): Observable<any> {
    let params: any = {};
    if (date) params.date = date;
    if (heureDebut) params.heureDebut = heureDebut;
    if (heureFin) params.heureFin = heureFin;
    if (seanceId) params.exceptSeanceId = seanceId;

    return this.http.get(`${this.apiUrl}/classes/${classeId}/verifier-disponibilite`, { params });
  }
}