import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClasseService } from 'src/app/services/classe.service';
import { MatDialogRef } from '@angular/material/dialog';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-nouvelleclasse',
  imports: [
    CommonModule,
     MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './nouvelleclasse.component.html',
  styleUrl: './nouvelleclasse.component.css'
})
export class NouvelleclasseComponent {

  classeForm: FormGroup;
  formations: any[] = []; // Pour stocker la liste des formations
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private classeService: ClasseService,
    private dialogRef: MatDialogRef<NouvelleclasseComponent>
  ) {
    this.classeForm = this.fb.group({
      nom: ['', Validators.required],
      capacite: ['', [Validators.required, Validators.min(1)]],
      localisation: ['', Validators.required],
      description: [''],
      formation_id: ['', Validators.required]
    });
  }

  ngOnInit(): void { 
    this.loadFormations();
  }

  loadFormations(): void {
    this.isLoading = true;
    this.classeService.getFormations().subscribe({
      next: (formations) => {
        this.formations = formations;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des formations', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.classeForm.valid) {
      this.classeService.createClasse(this.classeForm.value).subscribe({
        next: (response) => {
          this.dialogRef.close(true); // Ferme le modal et renvoie true pour indiquer un succès
        },
        error: (err) => {
          console.error('Erreur lors de la création de la classe', err);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
