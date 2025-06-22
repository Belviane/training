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

interface UserDialogData {
  user?: any; // Le ? indique que la propriété est optionnelle
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
  userForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  rolesList = [
    { id: 1, label: 'Administrateur' },
    { id: 2, label: 'Superviseur' },
    { id: 3, label: 'Formateur' },
    { id: 4, label: 'Apprenant' },
    { id: 5, label: 'Parent' },
    { id: 6, label: 'Caissier' },
    { id: 7, label: 'Auditeur' }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<AjouterComponent>,
  @Inject(MAT_DIALOG_DATA) public data: UserDialogData = {}
  ) {
    this.userForm = this.fb.group({
      role_id: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      genre: ['M'],
      date_naissance: [''],
      email: ['', [Validators.required, Validators.email]],
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data?.user) {
      this.patchFormValues();
    }
  }

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
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.isLoading = true;
    const formData = this.prepareFormData();

    const apiCall = this.data?.user
      ? this.http.put(`${LaravelApi.utilisateurs}/${this.data.user.id}`, formData)
      : this.http.post(LaravelApi.utilisateurs, formData);

    apiCall.subscribe({
      next: () => {
        this.snackBar.open(`Utilisateur ${this.data?.user ? 'modifié' : 'créé'} avec succès`, 'Fermer', {
          duration: 3000
        });
        this.dialogRef.close('success');
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.snackBar.open('Une erreur est survenue', 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        this.isLoading = false;
      }
    });
  }

  prepareFormData(): any {
    const formValue = this.userForm.value;
    return {
      ...formValue,
      date_naissance: this.datePipe.transform(formValue.date_naissance, 'yyyy-MM-dd'),
      is_active: 1
    };
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}