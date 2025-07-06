import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamenService } from 'src/app/services/examen.service';
import { Examen } from '@app/core/shared/models/examen.model';
import { Router } from '@angular/router';
//import { Timer } from 'timer.js';


@Component({
  selector: 'app-tentative-examen',
  imports: [],
  templateUrl: './tentative-examen.component.html',
  styleUrl: './tentative-examen.component.css'
})
export class TentativeExamenComponent {

  examenId: number;
  examen: Examen;
  tentative: Tentative;
  tempsRestant: string;
  reponses: { [questionId: number]: any } = {};
  isSubmitting = false;
  error: string = null;
  private timer: Timer;

  constructor(
    private route: ActivatedRoute,
    private examenService: ExamenService
  ) {}

  ngOnInit(): void {
    this.examenId = +this.route.snapshot.params['id'];
    this.loadExamen();
    this.startTentative();
  }

  loadExamen(): void {
    this.examenService.getExamenDetails(this.examenId).subscribe(
      examen => {
        this.examen = examen;
        // Initialiser les réponses vides
        examen.questions.forEach(q => {
          this.reponses[q.id] = q.type === 'choix_multiple' ? [] : '';
        });
      },
      err => {
        this.error = 'Impossible de charger l\'examen';
      }
    );
  }

  startTentative(): void {
    this.examenService.startExamen(this.examenId).subscribe(
      tentative => {
        this.tentative = tentative;
        this.startTimer();
      },
      err => {
        this.error = 'Impossible de démarrer l\'examen';
      }
    );
  }

  startTimer(): void {
    const endTime = new Date(this.tentative.date_debut);
    endTime.setMinutes(endTime.getMinutes() + this.examen.duree);

    this.timer = new Timer({
      tick: 1,
      ontick: (ms) => {
        const diff = endTime.getTime() - Date.now();
        if (diff <= 0) {
          this.submitTentative();
          return;
        }
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        this.tempsRestant = `${minutes}m ${seconds}s`;
      }
    });
    this.timer.start();
  }

  onReponseChange(questionId: number, value: any): void {
    this.reponses[questionId] = value;
  }

  submitTentative(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.timer.stop();
    
    this.examenService.submitTentative(this.tentative.id, this.reponses).subscribe(
      () => {
        // Rediriger vers les résultats
      },
      err => {
        this.error = 'Erreur lors de la soumission';
        this.isSubmitting = false;
      }
    );
  }

}
