import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { LaravelApi } from '@app/core/api/laravel.api';
import { AjouterComponent } from '@app/core/shared/modals/ajouter/ajouter.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-compte',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule
  ],
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.css']
})
export class CompteComponent implements OnInit {
  users: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  rolesList: { id: number; label: string }[] = [
    { id: 1, label: 'Administrateur' },
    { id: 2, label: 'Superviseur' },
    { id: 3, label: 'Formateur' },
    { id: 4, label: 'Apprenant' },
    { id: 5, label: 'Parent' },
    { id: 6, label: 'Caissier' },
    { id: 7, label: 'Auditeur' }
  ];

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.http.get<any>(LaravelApi.utilisateurs).subscribe({
      next: (response) => {
        console.log('Données reçues:', response);
        // Accéder au tableau des utilisateurs dans la propriété 'data' de la réponse
        this.users = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des utilisateurs';
        this.isLoading = false;
        console.error('Erreur:', err);

        // Afficher un message d'erreur plus détaillé si disponible
        if (err.error?.message) {
          this.errorMessage = err.error.message;
        }
      }
    });
  }

  getRoleName(roleId: number): string {
    const role = this.rolesList.find(r => r.id === roleId);
    return role ? role.label : 'Inconnu';
  }

  openAddModal(): void {
    const dialogRef = this.dialog.open(AjouterComponent, {
      width: '600px',
      disableClose: true,
      data: {}
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
      data: { user: user },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((updatedUserData: any) => {
      if (updatedUserData) {
        // Afficher un loader pendant la requête
        user.isLoading = true;

        this.http.put(LaravelApi.updateUtilisateur(user.id), updatedUserData).subscribe({
          next: () => {
            this.showSnackbar('Utilisateur mis à jour avec succès', 'success');
            this.loadUsers(); // Recharger la liste
          },
          error: (err) => {
            user.isLoading = false;
            console.error('Erreur lors de la mise à jour:', err);
            this.showSnackbar('Échec de la mise à jour', 'error');
          }
        });
      }
    });
  }

  toggleUserStatus(user: any): void {
    user.isLoading = true;

    // Utilisation des nouvelles méthodes de LaravelApi
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
      case 1: // Administrateur
        return user.administrateur?.matriculeAD || '';
      case 2: // Superviseur
        return user.superviseur?.matriculeSU || ''; // Notez que dans votre table c'est matriculeSU, pas matriculeSV
      case 3: // Formateur
        return user.formateur?.matriculeAD || '';
      case 4: // Apprenant
        return user.apprenant?.matriculeAP || '';
      case 5: // Parent
        return user.parents?.matriculePA || '';
      case 6: // Caissier
        return user.caissier?.matriculeCA || '';
      case 7: // Auditeur
        return user.auditeur?.matriculeAU || '';
      case 8: // vendeur
        return user.vendeur?.matriculeVE || '';

      default:
        return '';
    }
  }
}