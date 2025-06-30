import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';

export interface Formation {
  id: number;
  nom_formation: string;
  libelle_formation: string;
  date_debutf: string;
  date_finf: string;
  nombre_seancef: number;
}


export interface User {
  id: number;
  nom: string;
  prenom: string;
  login: string;
  role_id: number;
  email: string;
  genre: Genre;
  date_naissance: Date | string;
}

export enum Genre {
  HOMME = 'homme',
  FEMME = 'femme',
  AUTRE = 'autre'
}

export enum UserRole {
  ADMINISTRATEUR = 'administrateur',
  SUPERVISEUR = 'superviseur',
  FORMATEUR = 'formateur',
  APPRENANT = 'apprenant',
  PARENT = 'parent',
  CAISSIER = 'caissier',
  AUDITEUR = 'auditeur'
}

@Component({
  selector: 'app-suiviapprenant',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    HttpClientModule
  ],
  templateUrl: './suiviapprenant.component.html',
  styleUrl: './suiviapprenant.component.css'
})
export class SuiviapprenantComponent implements OnInit {

  formations: Formation[] = [];
  apprenants: User[] = [];
  inscriptionForm = new FormGroup({
    formation_id: new FormControl('', Validators.required),
    apprenant_id: new FormControl('', Validators.required)
  });

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getFormations();
    this.getApprenants();
  }

  getFormations(): void {
    this.http.get<Formation[]>('http://localhost:8000/api/formations').subscribe((response: Formation[]) => {
      this.formations = response;
    });
  }

  getApprenants(): void {
    this.http.get<User[]>('http://localhost:8000/api/apprenants').subscribe(
      (response: User[]) => {
        console.log('Apprenants récupérés avec succès :', response);
        this.apprenants = response;
      },
      (error) => {
        console.error('Erreur lors de la récupération des apprenants :', error);
      }
    );

  }
  addInscription(): void {
    const formationId = this.inscriptionForm.get('formation_id');
    const apprenantId = this.inscriptionForm.get('apprenant_id');
    if (formationId && apprenantId) {
      const inscription = {
        apprenant_id: apprenantId.value,
      };
      this.http.post(`http://localhost:8000/formations/${formationId.value}/inscrire`, inscription).subscribe(response => {
        console.log(response);
      });
    }
  }
}
