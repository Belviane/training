import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SeanceService } from 'src/app/services/seance.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { NouvelleseanceComponent } from '../nouvelleseance/nouvelleseance.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-seance',
  imports: [
    MatTooltipModule,
    MatIconModule,
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './seance.component.html',
  styleUrl: './seance.component.css'
})
export class SeanceComponent implements OnInit {

  seances: any[] = [];
  isLoading = true;

  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  constructor(private seanceService: SeanceService) {}

  ngOnInit(): void {
    this.loadSeances();
  }

  loadSeances(): void {
    this.isLoading = true;
    this.seanceService.getSeances().subscribe({
      next: (seances) => {
        this.seances = seances.map(seance => ({
          ...seance,
          date: new Date(seance.date) // Convertir en objet Date si nécessaire
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement séances', err);
        this.isLoading = false;
        this.snackBar.open('Erreur lors du chargement des séances', 'Fermer', {
          duration: 5000
        });
      }
    });
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(NouvelleseanceComponent, {
      width: '900px',
      maxHeight: '90vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadSeances();
    });
  }

  editSeance(id: number): void {
    // Implémentez l'édition si nécessaire
  }

  annulerSeance(id: number): void {
    this.seanceService.annulerSeance(id).subscribe({
      next: () => {
        this.snackBar.open('Séance annulée avec succès', 'Fermer', { duration: 3000 });
        this.loadSeances();
      },
      error: (err) => this.handleError(err, 'Erreur lors de l\'annulation')
    });
  }

  demarrerSeance(id: number): void {
    this.seanceService.demarrerSeance(id).subscribe({
      next: () => {
        this.snackBar.open('Séance démarrée avec succès', 'Fermer', { duration: 3000 });
        this.loadSeances();
      },
      error: (err) => this.handleError(err, 'Erreur lors du démarrage')
    });
  }

  terminerSeance(id: number): void {
    this.seanceService.terminerSeance(id).subscribe({
      next: () => {
        this.snackBar.open('Séance terminée avec succès', 'Fermer', { duration: 3000 });
        this.loadSeances();
      },
      error: (err) => this.handleError(err, 'Erreur lors de la finalisation')
    });
  }

  notifierSeance(id: number): void {
    this.seanceService.notifierSeance(id).subscribe({
      next: (res) => {
        this.snackBar.open(res.message || 'Notification envoyée', 'Fermer', { duration: 3000 });
      },
      error: (err) => this.handleError(err, 'Erreur d\'envoi de notification')
    });
  }

  downloadFeuillePresence(id: number): void {
    this.seanceService.getFeuillePresence(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `feuille-presence-${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => this.handleError(err, 'Erreur de téléchargement')
    });
  }

  private handleError(error: any, message: string): void {
    console.error(message, error);
    this.snackBar.open(message, 'Fermer', { duration: 5000 });
  }

}
