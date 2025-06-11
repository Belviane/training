import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/auth/services/auth.services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AjouterComponent } from '@app/core/shared/modals/ajouter/ajouter.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-content',
  imports: [CommonModule, MatIconModule, MatDialogModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit {

  trainerName: string = '';
  userRole: string | null = null;
  isLoggedIn: boolean = false;
  currentDate: string | number | Date | undefined;

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


  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userRole = this.authService.getUserRole();
    this.authService.getUserName().subscribe({
      next: (fullName) => this.trainerName = fullName,
      error: () => this.trainerName = 'Formateur '
    });

  }

  openAjouterModal() {
    this.dialog.open(AjouterComponent, {
      width: '500px',
      panelClass: 'custom-modal', // Classe supplémentaire pour des styles globaux
      autoFocus: false,
      disableClose: true // Empêche la fermeture en cliquant à l'extérieur
    });
  }

  isAdmin(): boolean {
    return this.userRole === 'administrateur';
  }

  isTrainer(): boolean {
    return this.userRole === 'formateur';
  }

  navigateTo(route: string) {
    this.router.navigate(['/admin', route]);
  }

}