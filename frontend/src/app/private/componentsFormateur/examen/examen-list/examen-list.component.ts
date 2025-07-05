import { Component, OnInit, Input } from '@angular/core';
import { Examen } from '@app/core/shared/models/examen.model';
import { ExamenService } from 'src/app/services/examen.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-examen-list',
  imports: [CommonModule,
    RouterModule
  ],
  templateUrl: './examen-list.component.html',
  styleUrl: './examen-list.component.css'
})
export class ExamenListComponent implements OnInit {
  @Input() moduleId: number;
  examens: Examen[] = [];
  isLoading = true;
  error: string = null;

  constructor(private examenService: ExamenService) {}

  ngOnInit(): void {
    this.loadExamens();
  }

  loadExamens(): void {
    this.isLoading = true;
    this.examenService.getExamensByModule(this.moduleId).subscribe(
      examens => {
        this.examens = examens;
        this.isLoading = false;
      },
      err => {
        this.error = 'Erreur lors du chargement des examens';
        this.isLoading = false;
      }
    );
  }

  onArchive(examenId: number): void {
    if (confirm('Voulez-vous vraiment archiver cet examen?')) {
      this.examenService.archiveExamen(examenId).subscribe(
        () => {
          this.loadExamens();
        },
        err => {
          this.error = 'Erreur lors de l\'archivage';
        }
      );
    }
  }

}
