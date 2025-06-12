import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-compte',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './compte.component.html',
  styleUrl: './compte.component.css'
})
export class CompteComponent implements OnInit {
  utilisateurs: any[] = [];
  nouveauUtilisateur = {
    name: '',
    email: '',
    password: '',
    role: ''
  };

  constructor(private http: HttpClient, private dialogRef: MatDialogRef<CompteComponent>) {}

  ngOnInit() {
    this.chargerUtilisateurs();
  }

  chargerUtilisateurs() {
    this.http.get<any[]>('http://localhost:8000/api/utilisateurs')
      .subscribe((data: any[]) => this.utilisateurs = data);
  }

  ajouterUtilisateur() {
    this.http.post('http://localhost:8000/api/utilisateurs', this.nouveauUtilisateur)
      .subscribe(() => {
        this.chargerUtilisateurs();
        this.nouveauUtilisateur = { name: '', email: '', password: '', role: '' };
      });
  }

  fermerModal() {
  this.dialogRef.close();
}

}

