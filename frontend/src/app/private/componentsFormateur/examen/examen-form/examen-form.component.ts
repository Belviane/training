import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Examen } from '@app/core/shared/models/examen.model';
import { ExamenService } from 'src/app/services/examen.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-examen-form',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './examen-form.component.html',
  styleUrl: './examen-form.component.css'
})
export class ExamenFormComponent implements OnInit {
  @Input() moduleId: number;
  @Input() examen: Examen = null;
  @Output() submit = new EventEmitter<Examen>();
  
  examenForm: FormGroup;
  isSubmitting = false;
  error: string = null;

  constructor(
    private fb: FormBuilder,
    private examenService: ExamenService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.examenForm = this.fb.group({
      titre: [this.examen?.titre || '', Validators.required],
      description: [this.examen?.description || ''],
      duree: [this.examen?.duree || 60, [Validators.required, Validators.min(1)]],
      date_ouverture: [this.examen?.date_ouverture || '', Validators.required],
      date_fermeture: [this.examen?.date_fermeture || '', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.examenForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const examenData = this.examenForm.value;

    const operation = this.examen 
      ? this.examenService.updateExamen(this.examen.id, examenData)
      : this.examenService.createExamen(this.moduleId, examenData);

    operation.subscribe(
      examen => {
        this.submit.emit(examen);
        this.isSubmitting = false;
      },
      err => {
        this.error = err.error?.message || 'Une erreur est survenue';
        this.isSubmitting = false;
      }
    );
  }
}
