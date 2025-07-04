import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { LaravelApi } from '@app/core/api/laravel.api';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assignformateursdialog',
  imports: [CommonModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDialogModule,
    MatListModule,
    FormsModule,
  ],
  templateUrl: './assignformateursdialog.component.html',
  styleUrl: './assignformateursdialog.component.css'
})
export class AssignformateursdialogComponent implements OnInit {
  formateurs: any[] = [];
  selectedFormateurs: number[] = [];
  formationId!: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AssignformateursdialogComponent>,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.formationId = data.formationId;
  }

  async ngOnInit() {
    try {
      // Charger tous les formateurs disponibles
      const response = await lastValueFrom(
        this.http.get<{ data: any[] }>(LaravelApi.formateurs)
      );
      this.formateurs = response.data;
      console.log('Formateurs chargés :', this.formateurs);

      // Charger les formateurs déjà assignés
      // const assignedResponse = await lastValueFrom(
      //   this.http.get<{ data: any[] }>(`${LaravelApi.assignFormateurs(this.formationId)}/assigned`)
      // );
      // this.selectedFormateurs = assignedResponse.data.map(f => f.id);
    } catch (error) {
      this.snackBar.open('Erreur de chargement des formateurs', 'Fermer', { duration: 3000 });
    }
  }

  async onAssign() {
  try {
    console.log('Formateurs sélectionnés :', this.selectedFormateurs);  // tu verras le bon tableau ici

    await lastValueFrom(
      this.http.post(LaravelApi.assignFormateurs(this.formationId), {
        formateur_ids: this.selectedFormateurs  // ✅ bien `formateur_ids`
      })
    );

    this.dialogRef.close(true);
  } catch (error: any) {
    console.error('Erreur complète :', error);
    if (error.status === 422) {
      console.error('Validation errors :', error.error.errors);
    }
    this.snackBar.open('Erreur lors de l\'assignation', 'Fermer', { duration: 3000 });
  }
}


  onCancel() {
    this.dialogRef.close(false);
  }

}
