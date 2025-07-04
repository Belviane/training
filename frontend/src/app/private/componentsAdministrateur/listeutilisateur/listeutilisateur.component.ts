import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { LaravelApi } from '@app/core/api/laravel.api';

@Component({
  selector: 'app-listeutilisateur',
  standalone: true,
  imports: [

    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule
  ],
  templateUrl: './listeutilisateur.component.html',
  styleUrl: './listeutilisateur.component.css'
})
export class ListeutilisateurComponent implements OnInit {

  users: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  roleType: string = '';
  roleLabel: string = 'Utilisateurs';

  rolesMap: { [key: string]: { id: number; label: string; endpoint: string } } = {
    'administrateurs': { id: 1, label: 'Administrateurs', endpoint: LaravelApi.administrateurs },
    'superviseurs': { id: 2, label: 'Superviseurs', endpoint: LaravelApi.superviseurs },
    'formateurs': { id: 3, label: 'Formateurs', endpoint: LaravelApi.formateurs },
    'apprenants': { id: 4, label: 'Apprenants', endpoint: LaravelApi.apprenants },
    'parents': { id: 5, label: 'Parents', endpoint: LaravelApi.parents },
    'caissiers': { id: 6, label: 'Caissiers', endpoint: LaravelApi.caissiers },
    'auditeurs': { id: 7, label: 'Auditeurs', endpoint: LaravelApi.auditeurs },
    'vendeurs': { id: 8, label: 'Vendeurs', endpoint: LaravelApi.vendeurs }
  };

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // Normalisez le roleType en minuscules
      this.roleType = params['roleType']?.toLowerCase() || '';
      this.loadUsers();
      // const roleInfo = this.rolesMap[this.roleType];

      // if (roleInfo) {
      //   this.roleLabel = roleInfo.label;
      //   this.loadUsersByRole(roleInfo.endpoint);
      // } else {
      //   this.roleLabel = 'Utilisateurs';
      //   this.loadAllUsers();
      // }
    });
  }

  private loadUsers(): void {
    const roleInfo = this.rolesMap[this.roleType];

    if (roleInfo) {
      this.roleLabel = roleInfo.label;
      this.loadUsersByRole(roleInfo.endpoint);
    } else {
      this.roleLabel = 'Utilisateurs';
      this.loadAllUsers();
    }
  }

  loadUsersByRole(endpoint: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<any>(endpoint).subscribe({
      next: (response) => {
        console.log('Réponse API:', response);
        this.users = this.transformApiResponse(response).map(user => ({
          ...user.utilisateur,
          superviseur: {
            id: user.id,
            matriculeSU: user.matriculeSU,
          },
          formateur: {
            id: user.id,
            matriculeAD: user.matriculeAD,
          },
          apprenant: {
            id: user.id,
            matriculeAP: user.matriculeAP,
          },
          parent: {
            id: user.id,
            matriculePA: user.matriculePA,
          },
          caissier: {
            id: user.id,
            matriculeCA: user.matriculeCA,
          },
          auditeur: {
            id: user.id,
            matriculeAU: user.matriculeAU,
          },
          vendeur: {
            id: user.id,
            matriculeVE: user.matriculeVE,
          },
          is_active: user.utilisateur?.is_active ?? true,
          isLoading: false
        }));

        // 🔎 Ajoute ce log :
        console.log('Utilisateurs après transformation:', this.users);

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = `Erreur lors du chargement des ${this.roleLabel}`;
        this.isLoading = false;
      }
    });
  }



  private transformApiResponse(response: any): any[] {
    if (!response) return [];

    if (Array.isArray(response)) return response;
    if (response.data && Array.isArray(response.data)) return response.data;
    if (response.users && Array.isArray(response.users)) return response.users;

    console.warn('Structure inattendue:', response);
    return [];
  }


  loadAllUsers(): void {
    this.isLoading = true;
    this.http.get<any>(LaravelApi.utilisateurs).subscribe({
      next: (response) => {
        this.users = this.extractUsersFromResponse(response);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des utilisateurs';
        this.isLoading = false;
      }
    });
  }

  private extractUsersFromResponse(response: any): any[] {
    // Adaptez cette méthode selon la structure de votre réponse API
    if (Array.isArray(response)) {
      return response;
    } else if (response && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }

  getRoleName(roleId: number): string {
    const role = Object.values(this.rolesMap).find(r => r.id === roleId);
    return role ? role.label : 'Inconnu';
  }

  getRoleClass(roleId: number): string {
    switch (roleId) {
      case 1: return 'administrateur';
      case 2: return 'superviseur';
      case 3: return 'formateur';
      case 4: return 'apprenant';
      case 5: return 'parent';
      case 6: return 'caissier';
      case 7: return 'auditeur';
      case 8: return 'vendeur';
      default: return '';
    }
  }

  getMatricule(user: any): string {
    switch (user.role_id) {
      case 1: return user.administrateur?.matriculeAD || '';
      case 2: return user.superviseur?.matriculeSU || '';
      case 3: return user.formateur?.matriculeAD || '';
      case 4: return user.apprenant?.matriculeAP || '';
      case 5: return user.parents?.matriculePA || '';
      case 6: return user.caissier?.matriculeCA || '';
      case 7: return user.auditeur?.matriculeAU || '';
      case 8: return user.vendeur?.matriculeVE || '';
      default: return '';
    }
  }

  toggleUserStatus(user: any): void {
    user.isLoading = true;

    const endpoint = user.is_active
      ? LaravelApi.desactiverUtilisateur(user.id)
      : LaravelApi.activerUtilisateur(user.id);

    this.http.patch(endpoint, {}).subscribe({
      next: () => {
        user.is_active = !user.is_active;
        user.isLoading = false;
        this.showSnackbar(
          `Compte ${user.is_active ? 'activé' : 'désactivé'} avec succès`,
          'success'
        );
      },
      error: (err) => {
        user.isLoading = false;
        console.error('Erreur:', err);
        this.showSnackbar(
          `Échec de ${user.is_active ? 'la désactivation' : "l'activation"}`,
          'error'
        );
      }
    });
  }

  private showSnackbar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: [`snackbar-${type}`]
    });
  }
}
