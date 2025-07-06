import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LaravelApi } from '@app/core/api/laravel.api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  constructor(private http: HttpClient) {}

  getPresenceBySeance(seanceId: number): Observable<any[]> {
    return this.http.get<any[]>(LaravelApi.listePresenceParSeance(seanceId));
  }

  marquerPresence(data: { seance_id: number, apprenant_id: number }): Observable<any> {
    return this.http.post<any>(LaravelApi.marquerPresence, data);
  }
}
