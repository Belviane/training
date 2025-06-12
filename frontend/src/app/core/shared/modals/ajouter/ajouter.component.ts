import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LaravelApi } from '@app/core/api/laravel.api';

// Import Angular Material modules nécessaires
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

interface Formation {
  id: number;
  nom_formation: string;
  libelle_formation: string;
  date_debutf: Date;
  date_finf: Date;
  nombre_seancef: number;
}

@Component({
  selector: 'app-ajouter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './ajouter.component.html',
  styleUrl: './ajouter.component.css'
})
export class AjouterComponent {
  inscriptionForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  formations: Formation[] = [];
  isLoadingFormations = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AjouterComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: { formationId: number }
  ) {
    this.inscriptionForm = this.fb.group({
      apprenant_id: ['', [Validators.required, Validators.min(1)]],
      formation_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadFormations();
  }

  loadFormations(): void {
    this.http.get<Formation[]>(LaravelApi.formations()).subscribe({
      next: (formations) => {
        this.formations = formations;
        this.isLoadingFormations = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des formations';
        this.isLoadingFormations = false;
      }
    });
  }

  submit() {
    if (this.inscriptionForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formationId = this.inscriptionForm.value.formation_id;
    const url = LaravelApi.inscrireApprenant(formationId);

    this.http.post(url, { utilisateur_id: this.inscriptionForm.value.apprenant_id }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Erreur lors de l\'inscription';
      }
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
