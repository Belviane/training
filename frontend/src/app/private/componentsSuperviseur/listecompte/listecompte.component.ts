import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { HttpClient } from '@angular/common/http';
import { AuthService } from '@app/core/auth/services/auth.services';
import { LaravelApi } from '@app/core/api/laravel.api';
import { AjouterComponent } from '@app/core/shared/modals/ajouter/ajouter.component';
import { UserRole } from '@app/core/shared/models/user.model';

@Component({
  selector: 'app-listecompte',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatTabsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './listecompte.component.html',
  styleUrls: ['./listecompte.component.css']
})
export class ListecompteComponent implements OnInit {
  adminUsers: any[] = [];
  supervisorUsers: any[] = [];
  otherUsers: any[] = [];
  isLoading = false;
  errorMessage = '';
  currentUser: any;

  // Colonnes pour chaque tableau
  displayedColumns = ['matricule', 'nom', 'prenom', 'email', 'role', 'statut', 'actions'];

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log('Utilisateur courant:', this.currentUser); // Ajout pour débogage
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.http.get<any>(LaravelApi.utilisateurs).subscribe({
      next: (response) => {
        const allUsers = response.data;

        // Filtrage selon les besoins du superviseur
        this.adminUsers = allUsers.filter((user: any) => user.role_id === 1);
        this.supervisorUsers = allUsers.filter((user: any) => user.role_id === 2);
        this.otherUsers = allUsers.filter((user: any) => ![1, 2].includes(user.role_id));

        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des utilisateurs';
        this.isLoading = false;
        console.error('Erreur:', err);
        this.showSnackbar(this.errorMessage, 'error');
      }
    });
  }

  // Méthodes utilitaires reprises de l'admin
  getRoleName(roleId: number): string {
    const roles: { [key: number]: string } = {
      1: 'Administrateur',
      2: 'Superviseur',
      3: 'Formateur',
      4: 'Apprenant',
      5: 'Parent',
      6: 'Caissier',
      7: 'Auditeur',
      8: 'Vendeur'
    };
    return roles[roleId] || 'Inconnu';
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

  canAddUser(): boolean {
    if (!this.currentUser) {
      console.error('CurrentUser non défini');
      return false;
    }

    // Debug: Affichez toute la structure de currentUser
    console.log('Structure complète de currentUser:', JSON.stringify(this.currentUser, null, 2));

    // Vérification plus robuste du rôle
    const userRole = this.currentUser.role?.libelle?.toLowerCase() || '';
    const canAdd = ['administrateur', 'superviseur'].includes(userRole);

    console.log(`Peut ajouter des utilisateurs? ${canAdd} (Rôle: ${userRole})`);
    return canAdd;
  }

  openAddModal(): void {
    const dialogRef = this.dialog.open(AjouterComponent, {
      width: '600px',
      disableClose: true,
      data: {
        user: null // ou undefined si création
      }
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result === 'success') {
        this.loadUsers();
      }
    });
}

  editUser(user: any): void {
    const dialogRef = this.dialog.open(AjouterComponent, {
      width: '600px',
      data: { user },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.loadUsers();
      }
    });
  }

  toggleUserStatus(user: any): void {
    user.isLoading = true;

    const endpoint = user.is_active
      ? LaravelApi.desactiverUtilisateur(user.id)
      : LaravelApi.activerUtilisateur(user.id);

    this.http.patch(endpoint, {}).subscribe({
      next: () => {
        user.is_active = !user.is_active;
        this.showSnackbar(
          `Utilisateur ${user.is_active ? 'activé' : 'désactivé'} avec succès`,
          'success'
        );
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.showSnackbar(
          `Échec de ${user.is_active ? 'la désactivation' : "l'activation"}`,
          'error'
        );
      },
      complete: () => user.isLoading = false
    });
  }

  private showSnackbar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: [`snackbar-${type}`]
    });
  }

  // Ajoutez cette méthode pour déterminer quels rôles peuvent être créés
  getAllowedRoles(): { id: number; label: string }[] {
    if (!this.currentUser) return [];
    
    const userRole = this.currentUser.role?.libelle?.toLowerCase();
    
    if (userRole === 'administrateur') {
        return [
            { id: 2, label: 'Superviseur' },
            { id: 3, label: 'Formateur' },
            { id: 4, label: 'Apprenant' },
            { id: 5, label: 'Parent' },
            { id: 6, label: 'Caissier' },
            { id: 7, label: 'Auditeur' },
            { id: 8, label: 'Vendeur' }
        ];
    } else if (userRole === 'superviseur') {
        return [
            { id: 3, label: 'Formateur' },
            { id: 4, label: 'Apprenant' },
            { id: 5, label: 'Parent' },
            { id: 6, label: 'Caissier' },
            { id: 7, label: 'Auditeur' },
            { id: 8, label: 'Vendeur' }
        ];
    }
    return [];
}

}