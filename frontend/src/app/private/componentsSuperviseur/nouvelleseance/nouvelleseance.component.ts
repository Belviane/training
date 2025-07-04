import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SeanceService } from 'src/app/services/seance.service';
import { FormateurService } from 'src/app/services/formateur.service';
import { FormationService } from 'src/app/services/formation.service';
import { ClasseService } from 'src/app/services/classe.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-nouvelleseance',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule,
    // Angular Material Modules
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatNativeDateModule

  ],
  templateUrl: './nouvelleseance.component.html',
  styleUrl: './nouvelleseance.component.css'
})

export class NouvelleseanceComponent implements OnInit {
  seanceForm: FormGroup;
  formateurs: any[] = [];
  formations: any[] = [];
  classes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private seanceService: SeanceService,
    private formateurService: FormateurService,
    private formationService: FormationService,
    private classeService: ClasseService,
    private dialogRef: MatDialogRef<NouvelleseanceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.seanceForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      date: ['', Validators.required],
      heure_debut: ['', Validators.required],
      heure_fin: ['', Validators.required],
      formateur_id: ['', Validators.required],
      formation_id: ['', Validators.required],
      classe_id: ['', Validators.required],
      type_seance: ['', Validators.required],
      statut: ['Planifiée']
    });
  }

  ngOnInit(): void {
    this.loadFormateurs();
    this.loadFormations();
    this.loadClasses();

     if (this.data) {
    this.seanceForm.patchValue({
      titre: this.data.titre,
      description: this.data.description,
      date: new Date(this.data.date),
      heure_debut: this.data.heure_debut,
      heure_fin: this.data.heure_fin,
      formateur_id: this.data.formateur_id,
      formation_id: this.data.formation_id,
      classe_id: this.data.classe_id,
      type_seance: this.data.type_seance,
      statut: this.data.statut
    });
  }
  }

  loadFormateurs(): void {
    this.formateurService.getFormateurs().subscribe({
      next: (formateurs) => {
        console.log('Formateurs transformés:', formateurs);
        this.formateurs = formateurs.sort((a, b) =>
          (a.prenom + a.nom).localeCompare(b.prenom + b.nom)
        );

        if (formateurs.length > 0) {
          console.log('Exemple formateur:', {
            id: formateurs[0].id,
            nomComplet: `${formateurs[0].prenom} ${formateurs[0].nom}`,
            specialite: formateurs[0].specialite
          });
        }
      },
      error: (err) => console.error('Erreur chargement formateurs', err)
    });
  }

  loadFormations(): void {
    this.formationService.getFormations().subscribe({
      next: (formations) => {
        this.formations = formations;
      },
      error: (err) => console.error('Erreur chargement formations', err)
    });
  }

  loadClasses(): void {
    this.classeService.getClasses().subscribe({
      next: (classes) => {
        console.log('Classes chargées:', classes); // Debug
        this.classes = classes;
      },
      error: (err) => console.error('Erreur chargement classes', err)
    });
  }

  onSubmit(): void {
    if (this.seanceForm.valid) {
      const payload = {
        ...this.seanceForm.value,
        date: this.formatDate(this.seanceForm.value.date),
        formateur_id: Number(this.seanceForm.value.formateur_id),
        formation_id: Number(this.seanceForm.value.formation_id),
        classe_id: Number(this.seanceForm.value.classe_id)
      };

      if (this.data && this.data.id) {
        // Cas édition : appeler update
        this.seanceService.updateSeance(this.data.id, payload).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => {
            console.error('Erreur mise à jour:', err);
          }
        });
      } else {
        // Cas création
        this.seanceService.createSeance(payload).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => {
            console.error('Erreur création:', err);
          }
        });
      }
    }
  }


  private formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Format YYYY-MM-DD
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}