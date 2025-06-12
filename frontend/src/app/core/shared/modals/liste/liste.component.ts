import { Component, OnInit } from '@angular/core';
import { FormationService } from 'src/app/services/formation.service';
import { Formation } from '../../models/formation.model';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-liste',
  imports: [CommonModule],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.css'
})
export class ListeComponent implements OnInit{
  formations: Formation[] = [];

   constructor(
    private formationService: FormationService,
    private dialogRef: MatDialogRef<ListeComponent>
  ) {}


  ngOnInit(): void {
    this.getFormations();
  }

  getFormations(): void {
    this.formationService.getAllFormations().subscribe({
      next: (data) => (this.formations = data),
      error: (err) => console.error('Erreur lors de la récupération :', err)
    });
  }

  suspendFormation(id: number): void {
    if (confirm('Voulez-vous vraiment suspendre cette formation ?')) {
      this.formationService.suspendFormation(id).subscribe({
        next: () => this.getFormations(),
        error: (err) => console.error('Erreur de suspension :', err)
      });
    }
  }

  modifierFormation(formation: Formation): void {
    // Logique pour ouvrir un autre modal ou formulaire de modification
    alert('Fonction Modifier en construction pour : ' + formation.nom_formation);
  }



  fermer(): void {
    this.dialogRef.close();
  }

}
