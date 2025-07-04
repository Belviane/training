import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/auth/services/auth.services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AjouterComponent } from '@app/core/shared/modals/ajouter/ajouter.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LaravelApi } from '@app/core/api/laravel.api';
import { CompteComponent } from '../compte/compte.component';
import { Observable } from 'rxjs';

//Service pour les statistiques
import { ClasseService } from 'src/app/services/classe.service';
import { ApprenantService } from 'src/app/services/apprenant.service';
import { FormateurService } from 'src/app/services/formateur.service';

/**
 * ContentComponent
 * Tableau de bord principal affichant les statistiques, activités récentes, comptes, etc.
 */
@Component({
  selector: 'app-content',
  imports: [CommonModule, MatIconModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit {
  nbClasses = 0;
  nbApprenants = 0;
  nbFormateurs = 0;
  nbreussite = 0;


  // --- Statistiques utilisateurs par rôle ---
  userStats = [
    {
      label: 'Superviseurs',
      value: 0, // Valeur initiale, sera mise à jour dynamiquement
      icon: 'supervisor_account',
      route: 'superviseurs',
      queryParams: { role: 'superviseurs' }
    },
  ];

  // === Données Superviseur ===
  activeClasses: number = 0;
  trainersCount: number = 0;
  learnersCount: number = 0;
  validatedPayments: number = 0;
  trainersPerformance: any[] = [];
  paymentStats: any[] = [];


  // --- Authentification et rôle utilisateur ---
  userRole: string | null = null;
  isLoggedIn: boolean = false;
  currentDate: string | number | Date | undefined;

  // === Données Formateur ===
  trainerClasses: any[] = [];
  upcomingSessions: any[] = [];
  pendingEvaluations: any[] = [];

  // === Données Apprenant ===
  currentTraining: any = {};
  learnerSessions: any[] = [];
  learnerEvaluations: any[] = [];


  /**
   * Constructeur
   * @param authService Service d'authentification
   * @param router Service de navigation
   * @param dialog Service de gestion des modales
   * @param fb FormBuilder pour les formulaires réactifs
   * @param http Client HTTP pour les requêtes API
   */
  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient,

    private classeService: ClasseService,
    private apprenantService: ApprenantService,
    private formateurService: FormateurService,

  ) {
  }

  /**
   * Initialisation du composant
   */
  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn;
    this.userRole = this.authService.userRole;

    this.loadUserStats();

    this.loadDashboardStats();

  }

  navigateToUserList(roleType: string): void {
    // Solution 1: Utilisation des paramètres de chemin
    this.router.navigate(['/app/utilisateurs', roleType.toLowerCase()]);

    // OU Solution 2: Utilisation des queryParams (si vous préférez)
    //this.router.navigate(['/app/utilisateurs'], { queryParams: { role: roleType } });
  }

  loadDashboardStats(): void {
    this.classeService.getClasses().subscribe(classes => {
      this.nbClasses = classes.length;
    });

    this.apprenantService.getApprenants().subscribe(count => {
      this.nbApprenants = ApprenantService.length;
    });

    this.formateurService.getFormateurs().subscribe(count => {
      this.nbFormateurs = FormateurService.length;
    });
  }

  /**
   * Charge les statistiques utilisateurs par rôle depuis l'API
   */
  loadUserStats() {
    this.http.get<any[]>(LaravelApi.utilisateurs).subscribe({
      next: (response: any) => {
        const users = response.data;

        // Compteur pour chaque rôle
        const counts = {
          superviseur: 0,
          formateur: 0,
          apprenant: 0,
          parent: 0,
          caissier: 0,
          auditeur: 0,
          vendeur: 0
        };

        // Comptage des utilisateurs par rôle
        users.forEach((user: any) => {
          switch (user.role_id) {
            case 2: counts.superviseur++; break;
            case 3: counts.formateur++; break;
            case 4: counts.apprenant++; break;
            case 5: counts.parent++; break;
            case 6: counts.caissier++; break;
            case 7: counts.auditeur++; break;
            case 8: counts.vendeur++; break;
          }
        });

        // Mise à jour des statistiques pour l'affichage
        this.userStats = [
          { label: 'Superviseurs', value: counts.superviseur, icon: 'supervisor_account', route: 'superviseurs', queryParams: { role: 'superviseurs' } },
          { label: 'Formateurs', value: counts.formateur, icon: 'school', route: 'formateurs', queryParams: { role: 'formateurs' } },
          { label: 'Apprenants', value: counts.apprenant, icon: 'person', route: 'apprenants', queryParams: { role: 'apprenants' } },
          { label: 'Parents', value: counts.parent, icon: 'family_restroom', route: 'parents', queryParams: { role: 'parents' } },
          { label: 'Caissiers', value: counts.caissier, icon: 'payments', route: 'caissiers', queryParams: { role: 'caissiers' } },
          { label: 'Auditeurs', value: counts.auditeur, icon: 'hearing', route: 'auditeurs', queryParams: { role: 'auditeurs' } },
          { label: 'Vendeur', value: counts.vendeur, icon: 'storefront', route: 'vendeurs', queryParams: { role: 'vendeurs' } }
        ];
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs', err);
      }
    });
  }


  /**
   * Retourne le nom du rôle à partir de son identifiant
   * @param roleId Identifiant du rôle
   */
  getRoleName(roleId: number): string {
    switch (roleId) {
      case 1: return 'Administrateur';
      case 2: return 'Superviseur';
      case 3: return 'Formateur';
      case 4: return 'Apprenant';
      case 5: return 'Parent';
      case 6: return 'Caissier';
      case 7: return 'Auditeur';
      case 8: return 'Vendeur';
      default: return 'Unknown';
    }
  }

  /**
   * Ouvre la modale de gestion de compte
   */
  openCompteModal() {
    this.dialog.open(CompteComponent, {
      width: '80vw',
      maxWidth: '1200px',
      height: '90vh',
      panelClass: 'compte-modal',
      autoFocus: false,
      disableClose: true
    });
  }

  /**
   * Vérifie si l'utilisateur est administrateur
   */
  isAdmin(): boolean {
    return this.userRole === 'administrateur';
  }

  /**
   * Vérifie si l'utilisateur est formateur
   */
  isTrainer(): boolean {
    return this.userRole === 'formateur';
  }

  /**
   * Vérifie si l'utilisateur est superviseur
   */
  isSupervisor(): boolean {
    return this.userRole === 'superviseur';
  }

  /**
   * Vérifie si l'utilisateur est superviseur
   */
  isLearner(): boolean {
    return this.userRole === 'apprenant';
  }

  /**
   * Vérifie si l'utilisateur est superviseur
   */
  isParent(): boolean {
    return this.userRole === 'parent';
  }

  /**
   * Vérifie si l'utilisateur est superviseur
   */
  isCaissier(): boolean {
    return this.userRole === 'caissier';
  }

  /**
   * Vérifie si l'utilisateur est superviseur
   */
  isAuditeur(): boolean {
    return this.userRole === 'auditeur';
  }

  /**
   * Vérifie si l'utilisateur est superviseur
   */
  isVendeur(): boolean {
    return this.userRole === 'vendeur';
  }

  /**
   * Navigation vers une route d'administration
   * @param route Route cible
   */
  navigateTo(route: string) {
    this.router.navigate(['/admin', route]);
  }
}