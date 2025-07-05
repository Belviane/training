// examen.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LaravelApi } from '../core/api/laravel.api';
import { Examen, Tentative, StatistiquesExamen } from '../core/shared/models/examen.model';

@Injectable({
  providedIn: 'root'
})
export class ExamenService {
  constructor(private http: HttpClient) { }

  // === Opérations sur les examens ===

  // Créer un examen pour un module
  createExamen(moduleId: number, examenData: any): Observable<Examen> {
    return this.http.post<Examen>(LaravelApi.storeExamenForModule(moduleId), examenData);
  }

  // Lister les examens d'un module
  getExamensByModule(moduleId: number): Observable<Examen[]> {
    return this.http.get<Examen[]>(LaravelApi.getExamensForModule(moduleId));
  }

  // Obtenir les détails d'un examen
  getExamenDetails(examenId: number): Observable<Examen> {
    return this.http.get<Examen>(LaravelApi.showExamen(examenId));
  }

  // Mettre à jour un examen
  updateExamen(examenId: number, data: any): Observable<Examen> {
    return this.http.put<Examen>(LaravelApi.updateExamen(examenId), data);
  }

  // Archiver un examen
  archiveExamen(examenId: number): Observable<any> {
    return this.http.patch(LaravelApi.archiveExamen(examenId), {});
  }

  // === Gestion des tentatives ===

  // Démarrer une tentative d'examen
  startExamen(examenId: number): Observable<Tentative> {
    return this.http.post<Tentative>(LaravelApi.startExamen(examenId), {});
  }

  // Soumettre une tentative
  submitTentative(tentativeId: number, reponses: any): Observable<any> {
    return this.http.post(LaravelApi.submitTentative(tentativeId), { reponses });
  }

  // Obtenir les tentatives d'un examen
  getTentatives(examenId: number): Observable<Tentative[]> {
    return this.http.get<Tentative[]>(LaravelApi.getTentativesForExamen(examenId));
  }

  // Obtenir les statistiques d'un examen
  getExamenStats(examenId: number): Observable<StatistiquesExamen> {
    return this.http.get<StatistiquesExamen>(LaravelApi.getExamenStatistics(examenId));
  }

  // === Autres opérations ===

  // Vérifier les réponses d'un test
  checkTestAnswers(examenId: number, reponses: any): Observable<any> {
    return this.http.post(LaravelApi.checkTestAnswers(examenId), { reponses });
  }

  // Importer un examen
  importExamen(moduleId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(LaravelApi.importExamen(moduleId), formData);
  }
}