import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/auth/services/auth.services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AjouterComponent } from '@app/core/shared/modals/ajouter/ajouter.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ListeComponent } from '@app/core/shared/modals/liste/liste.component';
import { LaravelApi } from '@app/core/api/laravel.api';
import { CompteComponent } from '../compte/compte.component';

@Component({
  selector: 'app-content',
  imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit {

  userStats = [
    {
      label: 'Superviseurs',
      value: 0, // Remplacez par la valeur réelle
      icon: 'supervisor_account',
    },
  ];

  recentAccounts: any[] = [];
  participationRate: number = 0;
  participantsCount: number = 0;
  totalSeats: number = 0;
  averageTimeSpent: number = 0;
  timeTrend: 'up' | 'down' = 'up';
  timeTrendValue: number = 0;
  contentInteractions: number = 0;
  clickCount: number = 0;
  quizCount: number = 0;
  commentCount: number = 0;
  roi: number = 0;
  trainingCost: number = 0;
  trainingBenefit: number = 0;
  monthlyActiveUsers: number = 0;
  skillImprovement: number = 0;
  skillImprovementValue: number = 0;

  userRole: string | null = null;
  isLoggedIn: boolean = false;
  currentDate: string | number | Date | undefined;

  formationForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  upcomingSessions = [
    {
      time: '09:00 - 11:00',
      title: 'Angular Avancé',
      group: 'Promo 2025',
      location: 'Salle 3'
    },
    {
      time: '14:00 - 16:00',
      title: 'Tests Unitaires',
      group: 'Promo 2025',
      location: 'Salle 3'
    },
    {
      time: '16:30 - 18:30',
      title: 'Revue de Code',
      group: 'Promo 2025',
      location: 'Salle Virtuelle'
    }
  ];

  recentEvaluations = [
    {
      learner: 'Jean Dupont',
      test: 'Evaluation Angular',
      date: '10/06/2025',
      grade: 16,
      status: 'completed'
    },
    {
      learner: 'Marie Martin',
      test: 'Evaluation JavaScript',
      date: '09/06/2025',
      grade: 14,
      status: 'completed'
    },
    {
      learner: 'Pierre Lambert',
      test: 'Projet Final',
      date: 'En attente',
      status: 'pending'
    }
  ];

  recentActivities = [
    {
      type: 'evaluation',
      description: 'Vous avez noté le projet de Sophie',
      time: 'Il y a 2 heures'
    },
    {
      type: 'session',
      description: 'Session "React Fundamentals" complétée',
      time: 'Aujourd\'hui, 11:30'
    },
    {
      type: 'message',
      description: 'Nouveau message dans le groupe Promo 2025',
      time: 'Hier, 17:45'
    },
    {
      type: 'resource',
      description: 'Vous avez ajouté une nouvelle ressource',
      time: 'Hier, 16:20'
    }
  ];


  constructor(private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpClient) {
    this.formationForm = this.fb.group({
      nom_formation: ['', [Validators.required]],
      libelle_formation: ['', [Validators.required]],
      date_debutf: ['', [Validators.required]],
      date_finf: ['', [Validators.required]],
      nombre_seancef: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {

    this.isLoggedIn = this.authService.isLoggedIn();
    this.userRole = this.authService.getUserRole();
  }


  openAjouterModal() {
    this.dialog.open(AjouterComponent, {
      width: '5000px',
      height: '500px',
      panelClass: 'custom-modal', // Classe supplémentaire pour des styles globaux
      autoFocus: false,
      disableClose: true // Empêche la fermeture en cliquant à l'extérieur
    });
  }
  openCompteModal() {
    this.dialog.open(CompteComponent, {
      width: '5000px',
      panelClass: 'custom-modal', // Classe supplémentaire pour des styles globaux
      autoFocus: false,
      disableClose: true // Empêche la fermeture en cliquant à l'extérieur
    });
  }

  onSubmit() {
    if (this.formationForm.invalid) return;

    this.http.post(LaravelApi.formations(), this.formationForm.value)
      .subscribe({
        next: (response: any) => {
          this.successMessage = response.message;
          this.errorMessage = '';
          this.formationForm.reset();
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Erreur lors de la création.';
          this.successMessage = '';
        }
      });
  }

  isAdmin(): boolean {
    return this.userRole === 'administrateur';
  }

  isTrainer(): boolean {
    return this.userRole === 'formateur';
  }

  isSupervisor(): boolean {
    return this.userRole === 'superviseur';
  }

  navigateTo(route: string) {
    this.router.navigate(['/admin', route]);
  }

  openListeModal(): void {
    this.dialog.open(ListeComponent, {
      width: '800px',
      disableClose: false
    });
  }
}