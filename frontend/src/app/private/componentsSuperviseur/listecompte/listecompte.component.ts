import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AjouterComponent } from '@app/core/shared/modals/ajouter/ajouter.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { LaravelApi } from '@app/core/api/laravel.api';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-listecompte',
  imports: [MatIconModule, MatDialogModule],
  templateUrl: './listecompte.component.html',
  styleUrl: './listecompte.component.css'
})
export class ListecompteComponent implements OnInit {
  users: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.http.get<any[]>(LaravelApi.utilisateurs).subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des utilisateurs';
        this.isLoading = false;
        console.error('Erreur:', err);
      }
    });
  }

  openAddModal(): void {
    const dialogRef = this.dialog.open(AjouterComponent, {
      width: '600px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result === 'success') {
        this.loadUsers();
      }
    });
  }
}
