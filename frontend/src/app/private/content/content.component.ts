import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/auth/services/auth.services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AjouterComponent } from '@app/core/shared/modals/ajouter/ajouter.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LaravelApi } from '@app/core/api/laravel.api';
import { CompteComponent } from '../compte/compte.component';

@Component({
  selector: 'app-content',
  imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit {

  ongoingTrainings: number = 0;
  registeredUsers: number = 0;
  completionRate: number = 0;
  participationRate: number = 0;
  skillImprovement: number = 0;
  learnerSatisfaction: number = 0;
  feedbackCount: number = 0;
  participantsCount: number = 0;
  totalSeats: number = 0;
  skillImprovementValue: number = 0;

  ongoingTrainingsList = [
    { name: 'Formation 1', startDate: new Date('2023-01-01'), endDate: new Date('2023-01-31'), registeredUsers: 10, completionRate: 80 },
    { name: 'Formation 2', startDate: new Date('2023-02-01'), endDate: new Date('2023-02-28'), registeredUsers: 15, completionRate: 90 },
    // ...
  ];

  userStats = [
    {
      label: 'Superviseurs',
      value: 0, // Remplacez par la valeur réelle
      icon: 'supervisor_account',
    },
  ];

  recentAccounts: any[] = [];
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

    this.isLoggedIn = this.authService.isLoggedIn;
    this.userRole = this.authService.userRole;

    this.loadUserStats();

    this.loadRecentAccounts();

    // Initialisation des données
    this.ongoingTrainings = 5;
    this.registeredUsers = 100;
    this.completionRate = 85;
    this.participationRate = 90;
    this.skillImprovement = 20;
    this.learnerSatisfaction = 95;
    this.feedbackCount = 50;
    this.participantsCount = 80;
    this.totalSeats = 100;
    this.skillImprovementValue = 10;
  }

  loadUserStats() {
    this.http.get<any[]>(LaravelApi.utilisateurs).subscribe({
      next: (users: any[]) => {
        const counts = {
          administrateur: 0,
          superviseur: 0,
          formateur: 0,
          apprenant: 0,
          parent: 0,
          caissier: 0,
          auditeur: 0
        };

        users.forEach(user => {
          switch (user.role_id) {
            case 1: counts.administrateur++; break;
            case 2: counts.superviseur++; break;
            case 3: counts.formateur++; break;
            case 4: counts.apprenant++; break;
            case 5: counts.parent++; break;
            case 6: counts.caissier++; break;
            case 7: counts.auditeur++; break;
          }
        });

        this.userStats = [
          { label: 'Administrateurs', value: counts.administrateur, icon: 'admin_panel_settings' },
          { label: 'Superviseurs', value: counts.superviseur, icon: 'supervisor_account' },
          { label: 'Formateurs', value: counts.formateur, icon: 'school' },
          { label: 'Apprenants', value: counts.apprenant, icon: 'person' },
          { label: 'Parents', value: counts.parent, icon: 'family_restroom' },
          { label: 'Caissiers', value: counts.caissier, icon: 'payments' },
          { label: 'Auditeurs', value: counts.auditeur, icon: 'hearing' }
        ];
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs', err);
      }
    });
  }

  loadRecentAccounts() {
    this.http.get<any[]>(LaravelApi.utilisateurs).subscribe({
      next: (accounts: any[]) => {
        // Tri par date de création décroissante
        const sortedAccounts = [...accounts].sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        // Prendre les 8 premiers
        this.recentAccounts = sortedAccounts.slice(0, 8).map(account => ({
          name: `${account.prenom} ${account.nom}`,
          email: account.email,
          role: this.getRoleName(account.role_id),
          createdAt: account.created_at,
          status: account.is_active ? 'active' : 'inactive'
        }));
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs', err);
      }
    });
  }

  getRoleName(roleId: number): string {
    switch (roleId) {
      case 1: return 'Administrateur';
      case 2: return 'Superviseur';
      case 3: return 'Formateur';
      case 4: return 'Apprenant';
      case 5: return 'Parent';
      case 6: return 'Caissier';
      case 7: return 'Auditeur';
      default: return 'Unknown';
    }
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
      width: '80vw', // Utilisez des unités relatives
      maxWidth: '1200px', // Largeur maximale
      height: '90vh',
      panelClass: 'compte-modal', // Classe spécifique pour cette modal
      autoFocus: false,
      disableClose: true // Empêche la fermeture accidentelle
    });
  }

  onSubmit() {
    if (this.formationForm.invalid) return;

    this.http.post(LaravelApi.formations, this.formationForm.value)
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

}