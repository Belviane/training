import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormationService } from '../../../services/formation.service';
import { CommonModule } from '@angular/common';


// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatNativeDateModule } from '@angular/material/core';

// Modèles
import { Formation, Module, Lecon } from '@app/core/shared/models/formation.model';

@Component({
  selector: 'app-nouvelleformation',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule,
    // Angular Material Modules
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatNativeDateModule

  ],
  templateUrl: './nouvelleformation.component.html',
  styleUrls: ['./nouvelleformation.component.css']
})
export class NouvelleformationComponent implements OnInit {
  formationForm: FormGroup;
  isEditMode = false;
  submitStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  formationId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private formationService: FormationService
  ) {
    this.formationForm = this.createForm();
  }

  getFieldError(fieldName: string, moduleIndex?: number, leconIndex?: number): string | null {
    let control: any;

    if (moduleIndex !== undefined && leconIndex !== undefined) {
      // Leçon error
      const leconGroup = this.getLecons(moduleIndex).at(leconIndex) as FormGroup;
      control = leconGroup.get(fieldName);
    } else if (moduleIndex !== undefined) {
      // Module error
      const moduleGroup = this.modules.at(moduleIndex) as FormGroup;
      control = moduleGroup.get(fieldName);
    } else {
      // Main form error
      control = this.formationForm.get(fieldName);
    }

    if (control?.invalid && (control?.dirty || control?.touched)) {
      if (control.errors?.['required']) {
        return 'Ce champ est requis';
      }
      if (control.errors?.['min']) {
        return `La valeur minimale est ${control.errors['min'].min}`;
      }
    }
    if (fieldName === 'date_finf' && this.formationForm.errors?.['dateRange']) {
      return 'La date de fin doit être postérieure à la date de début';
    }
    return null;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID de la formation :', id);
    this.formationId = id ? +id : null; // Convertit en number
    this.isEditMode = !!this.formationId;

    if (this.isEditMode) {
      this.loadFormationData();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      nom_formation: ['', Validators.required],
      libelle_formation: ['', Validators.required],
      date_debutf: ['', Validators.required],
      date_finf: ['', Validators.required],
      nombre_seancef: ['1', [Validators.required, Validators.min(1)]],
      volume_horaire: ['1', [Validators.required, Validators.min(0.5)]],
      statut: ['brouillon', Validators.required],
      prix: ['0', [Validators.required, Validators.min(0)]],
      certifiante: [false],
      prix_certification: ['0'],
      objectif: ['', Validators.required],
      modules: this.fb.array([])
    });
  }

  async loadFormationData(): Promise<void> {
    if (!this.formationId) return;

    this.submitStatus = 'loading';
    try {
      const formation = await this.formationService.getFormationAsync(this.formationId);
      this.formationForm.patchValue(formation);

      // Charger les modules si nécessaire
      if (formation.modules && formation.modules.length) {
        formation.modules.forEach((module: Module) => this.addModuleWithData(module));
      }

      this.submitStatus = 'idle';
    } catch (error) {
      this.submitStatus = 'error';
      this.snackBar.open('Erreur lors du chargement de la formation', 'Fermer', { duration: 3000 });
    }
  }

  get modules(): FormArray {
    return this.formationForm.get('modules') as FormArray;
  }

  addModule(): void {
    this.modules.push(this.createModuleGroup());
  }

  addModuleWithData(moduleData: any): void {
    this.modules.push(this.createModuleGroup(moduleData));
  }

  createModuleGroup(moduleData?: any): FormGroup {
    const group = this.fb.group({
      nom: [moduleData?.nom || '', Validators.required],
      description: [moduleData?.description || ''],
      lecons: this.fb.array([])
    });

    if (moduleData?.lecons) {
      moduleData.lecons.forEach((lecon: any) => {
        (group.get('lecons') as FormArray).push(this.createLeconGroup(lecon));
      });
    }

    return group;
  }

  createLeconGroup(leconData?: any): FormGroup {
    return this.fb.group({
      titre: [leconData?.titre || '', Validators.required],
      duree_estimee: [leconData?.duree_estimee || '', [Validators.required, Validators.min(1)]],
      ordre: [leconData?.ordre || '', Validators.required],
      contenu: [leconData?.contenu || '', Validators.required]
    });
  }

  removeModule(index: number): void {
    this.modules.removeAt(index);
  }

  getLecons(moduleIndex: number): FormArray {
    return this.modules.at(moduleIndex).get('lecons') as FormArray;
  }

  addLecon(moduleIndex: number): void {
    this.getLecons(moduleIndex).push(this.createLeconGroup());
  }

  removeLecon(moduleIndex: number, leconIndex: number): void {
    this.getLecons(moduleIndex).removeAt(leconIndex);
  }

  async onSubmit(): Promise<void> {
    if (this.formationForm.invalid) return;

    this.submitStatus = 'loading';
    try {
      const formationData = this.formationForm.value;

      if (this.isEditMode && this.formationId) {
        await this.formationService.updateFormationAsync(this.formationId, formationData);
        this.snackBar.open('Formation mise à jour avec succès', 'Fermer', { duration: 3000 });
      } else {
        await this.formationService.createFormationAsync(formationData);
        this.snackBar.open('Formation créée avec succès', 'Fermer', { duration: 3000 });
      }

      this.submitStatus = 'success';
      this.router.navigate(['/app/formations']);
    } catch (error) {
      this.submitStatus = 'error';
      this.snackBar.open('Erreur lors de la sauvegarde', 'Fermer', { duration: 3000 });
    }
  }

  cancel(): void {
    this.router.navigate(['/app/formations']);
  }
}