import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SeanceService } from 'src/app/services/seance.service';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-seance',
  imports: [
     MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './seance.component.html',
  styleUrl: './seance.component.css'
})
export class SeanceComponent implements OnInit {
  seanceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private seanceService: SeanceService,
    private dialogRef: MatDialogRef<SeanceComponent>
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

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.seanceForm.valid) {
      this.seanceService.createSeance(this.seanceForm.value).subscribe({
        next: (response) => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Erreur lors de la création de la séance', err);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
