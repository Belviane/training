import { Component, OnInit, ViewChild } from '@angular/core';
import { LaravelApi } from '@app/core/api/laravel.api';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TemplateRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-formations',
  imports: [CommonModule,
    MatDialogModule, MatPaginator, 
    MatPaginatorModule, 
    MatTableModule, MatIcon, 
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule, 
    MatNativeDateModule],
  templateUrl: './formations.component.html',
  styleUrl: './formations.component.css'
})
export class FormationsComponent implements OnInit {
  formations = new MatTableDataSource<any>();
  displayedColumns = ['nom', 'libelle', 'dateDebut', 'dateFin', 'nombreSeance'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('addFormationModal') addFormationModal!: TemplateRef<any>;

  constructor(private dialog: MatDialog, private http: HttpClient) { }

  ngOnInit(): void {
    this.getFormations();
  }

  formationForm = new FormGroup({
    nom: new FormControl('', Validators.required),
    libelle: new FormControl('', Validators.required),
    dateDebut: new FormControl('', Validators.required),
    dateFin: new FormControl('', Validators.required),
    nombreSeance: new FormControl('', Validators.required)
  });

  getFormations(): void {
    this.http.get(LaravelApi.formations).subscribe(response => {
      console.log('Données reçues :', response);
      this.formations.data = (response as any);
      this.formations.paginator = this.paginator;
    });
  }

  openAddModal(): void {
    const dialogRef = this.dialog.open(this.addFormationModal, {
      width: '600px',
      disableClose: true
    });
  }

  closeModal(): void {
    this.dialog.closeAll();
  }

  addFormation():void {
    
  }

}
