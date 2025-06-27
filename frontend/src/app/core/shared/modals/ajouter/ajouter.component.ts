import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LaravelApi } from '@app/core/api/laravel.api';
import { DatePipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Interface pour typer les données reçues dans la boîte de dialogue
interface UserDialogData {
  user?: any; // Utilisateur optionnel (pour modification)
}

@Component({
  selector: 'app-ajouter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './ajouter.component.html',
  styleUrls: ['./ajouter.component.css'],
  providers: [DatePipe]
})
export class AjouterComponent implements OnInit {
  // Formulaire utilisateur
  userForm: FormGroup;

  // Pour masquer/afficher le mot de passe
  hidePassword = true;

  // Indique si une requête HTTP est en cours
  isLoading = false;

  // Liste des rôles disponibles
  rolesList = [
    //{ id: 1, label: 'Administrateur' },
    { id: 2, label: 'Superviseur' },
    { id: 3, label: 'Formateur' },
    { id: 4, label: 'Apprenant' },
    { id: 5, label: 'Parent' },
    { id: 6, label: 'Caissier' },
    { id: 7, label: 'Auditeur' },
    { id: 8, label: 'Vendeur' }
  ];

  /**
   * Constructeur : injection des dépendances nécessaires
   */
  constructor(
    private fb: FormBuilder, // Pour construire le formulaire
    private http: HttpClient, // Pour les requêtes HTTP
    private snackBar: MatSnackBar, // Pour afficher des notifications
    private datePipe: DatePipe, // Pour formater les dates
    public dialogRef: MatDialogRef<AjouterComponent>, // Référence à la boîte de dialogue
    @Inject(MAT_DIALOG_DATA) public data: UserDialogData = {} // Données injectées (utilisateur à modifier)
  ) {
    // Initialisation du formulaire avec les champs et leurs validateurs
    this.userForm = this.fb.group({
      role_id: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      genre: ['M'],
      date_naissance: [''],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  /**
   * Initialisation du composant
   * Si un utilisateur est passé en paramètre, on pré-remplit le formulaire
   */
  ngOnInit(): void {
    if (this.data?.user) {
      this.patchFormValues();
    }
  }

  /**
   * Remplit le formulaire avec les valeurs de l'utilisateur à modifier
   */
  patchFormValues(): void {
    const user = this.data.user;
    this.userForm.patchValue({
      role_id: user.role_id,
      nom: user.nom,
      prenom: user.prenom,
      genre: user.genre,
      date_naissance: user.date_naissance,
      email: user.email,
      login: user.login
    });
    // Si modification, on retire la validation du mot de passe
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
  }

  /**
   * Soumission du formulaire
   * - Crée ou modifie un utilisateur selon le contexte
   * - Affiche une notification de succès ou d'erreur
   */
  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.isLoading = true;
    const formData = this.prepareFormData();

    // Choix de la requête selon création ou modification
    const apiCall = this.http.post(LaravelApi.register, formData);

    apiCall.subscribe({
      next: () => {
        this.snackBar.open(
          `Utilisateur ${this.data?.user ? 'modifié' : 'créé'} avec succès`,
          'Fermer',
          { duration: 3000 }
        );
        this.dialogRef.close('success');
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.snackBar.open(
          err.error?.message || 'Une erreur est survenue',
          'Fermer',
          { duration: 3000, panelClass: ['snackbar-error'] }
        );
        this.isLoading = false;
      }
    });
  }

  /**
   * Prépare les données du formulaire avant envoi à l'API
   * - Formate la date de naissance
   * - Ajoute le statut actif
   */
  prepareFormData(): any {
    const formValue = this.userForm.value;
    return {
      ...formValue,
      date_naissance: this.datePipe.transform(formValue.date_naissance, 'yyyy-MM-dd'),
      is_active: 1
    };
  }

  /**
   * Annule et ferme la boîte de dialogue
   */
  onCancel(): void {
    this.dialogRef.close();
  }
}
