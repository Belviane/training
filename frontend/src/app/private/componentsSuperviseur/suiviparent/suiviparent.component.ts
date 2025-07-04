import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { ApprenantService } from 'src/app/services/apprenant.service';
import { ParentService } from 'src/app/services/parent.service';
import { LaravelApi } from '@app/core/api/laravel.api';

@Component({
  selector: 'app-suiviparent',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './suiviparent.component.html',
  styleUrl: './suiviparent.component.css'
})
export class SuiviparentComponent implements OnInit {
  form!: FormGroup;
  parents: any[] = [];
  apprenants: any[] = [];
  status: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  message = '';

  constructor(
    private http: HttpClient,
    private apprenantService: ApprenantService,
    private parentService: ParentService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      parent_id: new FormControl(null, Validators.required),
      apprenant_id: new FormControl(null, Validators.required),
    });

    this.loadParents();
    this.loadApprenants();
  }

  loadParents() {
    this.parentService.getParents().subscribe(data => {
      this.parents = data;
    });
  }

  loadApprenants() {
    this.apprenantService.getApprenants().subscribe(data => {
      this.apprenants = data;
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.status = 'loading';
    const payload = this.form.value;

    this.http.post(LaravelApi.inscriptionsParent, payload).subscribe({
      next: () => {
        this.status = 'success';
        this.message = 'Association réussie !';
        this.form.reset();
      },
      error: (err) => {
        console.error('Erreur association parent-apprenant', err);
        this.status = 'error';
        this.message = "Échec de l'association.";
      }
    });
  }
}
