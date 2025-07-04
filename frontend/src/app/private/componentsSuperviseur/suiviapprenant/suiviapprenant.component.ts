import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormationService } from 'src/app/services/formation.service';
import { ApprenantService } from 'src/app/services/apprenant.service';
import { LaravelApi } from '@app/core/api/laravel.api';

@Component({
  selector: 'app-suiviapprenant',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './suiviapprenant.component.html',
  styleUrl: './suiviapprenant.component.css'
})
export class SuiviapprenantComponent implements OnInit {
  form!: FormGroup;
  apprenants: any[] = [];
  formations: any[] = [];
  status: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  message = '';

  constructor(
    private http: HttpClient,
    private formationService: FormationService,
    private apprenantService: ApprenantService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      apprenant_id: new FormControl(null, Validators.required),
      formation_id: new FormControl(null, Validators.required),
    });

    this.loadApprenants();
    this.loadFormations();
  }

  loadApprenants(): void {
    this.apprenantService.getApprenants().subscribe({
      next: (data) => this.apprenants = data,
      error: (err) => console.error('Erreur chargement apprenants', err)
    });
  }

  loadFormations(): void {
    this.formationService.getFormations().subscribe(data => {
      this.formations = data;
    });
  }

  onSubmit(): void {
  if (this.form.invalid) return;

  this.status = 'loading';
  const payload = { apprenant_id: this.form.value.apprenant_id };
  const formationId = this.form.value.formation_id;

  this.http.post(LaravelApi.inscrireApprenant(formationId), payload).subscribe({
    next: () => {
      this.status = 'success';
      this.message = 'Inscription réussie !';
      this.form.reset();
    },
    error: (err) => {
      console.error('Erreur d’inscription', err);
      this.status = 'error';
      this.message = "Échec de l'inscription.";
    }
  });
}


}
