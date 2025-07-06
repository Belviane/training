import { Component, OnInit } from '@angular/core';
import { ClasseService } from 'src/app/services/classe.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NouvelleclasseComponent } from '../nouvelleclasse/nouvelleclasse.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { CheckclassedialogComponent } from './checkclassedialog/checkclassedialog.component';

@Component({
  selector: 'app-classe',
  imports: [
    MatTooltipModule,
    MatSnackBarModule,
    MatIconModule,
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
  templateUrl: './classe.component.html',
  styleUrl: './classe.component.css'
})
export class ClasseComponent implements OnInit {

  classes: any[] = [];

  formationsMap: { [id: number]: string } = {};

  constructor(private classeService: ClasseService,
     private dialog: MatDialog,
     private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadClasses();
  }

  loadFormationsEtClasses(): void {
    this.classeService.getFormations().subscribe({
      next: (formations) => {
        console.log('Formations reçues:', formations); // <-- Ajouté

        this.formationsMap = formations.reduce((acc, formation) => {
          console.log(`Formation - ID: ${formation.id}, Nom: ${formation.nom}`); // <-- Ajouté
          acc[formation.id] = formation.nom;
          return acc;
        }, {} as { [id: number]: string });

        console.log('FormationsMap:', this.formationsMap); // <-- Ajouté

        this.classeService.getClasses().subscribe({
          next: (classes) => {
            console.log('Classes brutes reçues:', classes); // <-- Ajouté

            this.classes = classes.map(classe => {
              console.log(`Classe - ID: ${classe.id}, FormationID: ${classe.formation_id}`); // <-- Ajouté
              return {
                ...classe,
                formation: {
                  nom: classe.formation_id && this.formationsMap[classe.formation_id]
                    ? this.formationsMap[classe.formation_id]
                    : 'Non spécifiée'
                }
              };
            });

            console.log('Classes finales:', this.classes); // <-- Ajouté
          },
          error: (err) => console.error('Erreur classes', err)
        });
      },
      error: (err) => console.error("Erreur formations", err)
    });
  }

  loadClasses(): void {
    this.classeService.getClasses().subscribe({
      next: (classes) => {
        this.classes = classes.map(classe => ({
          ...classe,
          formation: {
            nom: classe.formation?.nom_formation || 'Non spécifiée'
          }
        }));
      },
      error: (err) => console.error('Erreur', err)
    });
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(NouvelleclasseComponent, {
      width: '900px',
      maxHeight: '90vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Rafraîchir la liste des séances
        this.loadFormationsEtClasses();
      }
    });
  }

  // checkDisponibilite(classeId: number): void {
  //   const date = '2023-12-15'; // À remplacer par la date souhaitée
  //   const heureDebut = '09:00';
  //   const heureFin = '12:00';

  //   this.classeService.verifierDisponibiliteClasse(classeId, date, heureDebut, heureFin)
  //     .subscribe({
  //       next: (result) => {
  //         if (result.disponible) {
  //           alert('La classe est disponible');
  //         } else {
  //           alert(`Non disponible: ${result.message || ''}`);
  //         }
  //       },
  //       error: (err) => console.error('Erreur', err)
  //     });
  // }

  openDisponibiliteDialog(classeId: number): void {
    const dialogRef = this.dialog.open(CheckclassedialogComponent, {
      width: '500px',
      data: { type: 'disponibilite', classeId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.classeService.verifierDisponibiliteClasse(
          classeId,
          result.date,
          result.startTime,
          result.endTime
        ).subscribe({
          next: (res) => {
            const message = res.disponible
              ? `Disponible (${res.nombreApprenants} apprenants inscrits)`
              : `Non disponible: ${res.message || ''} (${res.nombreApprenants} apprenants)`;
            
            this.showToast(message, res.disponible ? 'success' : 'error');
          }
        });
      }
    });
  }

  // checkCapacite(classeId: number): void {
  //   this.classeService.getCapaciteRestante(classeId)
  //     .subscribe({
  //       next: (result) => {
  //         alert(`Capacité restante: ${result.capacite_restante} places`);
  //       },
  //       error: (err) => console.error('Erreur', err)
  //     });
  // }

  openCapaciteDialog(classeId: number): void {
    const dialogRef = this.dialog.open(CheckclassedialogComponent, {
      width: '400px',
      data: { type: 'capacite', classeId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.classeService.getCapaciteRestante(classeId, result.date)
          .subscribe({
            next: (res) => {
              const message = `Capacité: ${res.capacite_restante} places restantes (${res.nombre_apprenants} apprenants inscrits)`;
              this.showToast(message, 'success');
            }
          });
      }
    });
  }

  private showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: [`snackbar-${type}`],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
