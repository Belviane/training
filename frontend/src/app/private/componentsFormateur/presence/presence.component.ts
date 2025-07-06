import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeanceService } from 'src/app/services/seance.service';
import { PresenceService } from 'src/app/services/presence.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-presence',
  standalone:true,
  imports:[CommonModule],
  templateUrl: './presence.component.html',
  styleUrls: ['./presence.component.css']
})
export class PresenceComponent implements OnInit {
  seanceId!: number;
  apprenants: any[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private presenceService: PresenceService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.seanceId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPresences();
  }

  loadPresences(): void {
    this.presenceService.getPresenceBySeance(this.seanceId).subscribe({
      next: (data) => {
        this.apprenants = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open("Erreur lors du chargement de la présence", "Fermer", { duration: 3000 });
      }
    });
  }

  marquerPresence(apprenantId: number): void {
    this.presenceService.marquerPresence({ seance_id: this.seanceId, apprenant_id: apprenantId }).subscribe({
      next: () => {
        this.snackBar.open('Présence marquée avec succès', 'Fermer', { duration: 3000 });
        this.loadPresences(); // recharger
      },
      error: () => {
        this.snackBar.open("Erreur lors de la mise à jour de la présence", "Fermer", { duration: 3000 });
      }
    });
  }
}
