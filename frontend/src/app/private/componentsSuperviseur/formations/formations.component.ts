import { Component, OnInit, ViewChild, signal, computed, inject, TemplateRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';

// Angular Material imports
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Lucide icons
import { LucideAngularModule } from 'lucide-angular';

// API configuration
import { LaravelApi } from '@app/core/api/laravel.api';
import { lastValueFrom } from 'rxjs';

import { Formation, Module, Lecon, SubmitStatus, ApiFormationResponse } from '../../../core/shared/models/formation.model';

import { FormControl } from '@angular/forms';
import { Toast } from 'ngx-toastr';
import { ClasseComponent } from '../classe/classe.component';
import { SeanceComponent } from '../seance/seance.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-formations',
  standalone: true,
  imports: [
    RouterModule,
    // Angular modules
    CommonModule,
    ReactiveFormsModule,

    // Material modules
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatTooltipModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './formations.component.html',
  styleUrl: './formations.component.css'
})


export class FormationsComponent implements OnInit, AfterViewInit {
  @ViewChild('formationModal') formationModal!: TemplateRef<any>;

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar); 

  formations = new MatTableDataSource<Formation>();
  displayedColumns = ['nom', 'dates', 'seances', 'statut', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  

  // Signals
  isLoading = signal(false);
  submitStatus = signal<SubmitStatus>('idle');
  isEditMode = signal(false);
  currentFormationId = signal<number | null>(null);

  // Form
  formationForm = this.fb.group({
    nom_formation: ['', [Validators.required, Validators.maxLength(100)]],
    libelle_formation: ['', [Validators.required, Validators.maxLength(255)]],
    date_debutf: ['', [Validators.required]],
    date_finf: ['', [Validators.required]],
    nombre_seancef: ['', [Validators.required, Validators.min(1)]],
    volume_horaire: ['', [Validators.required, Validators.min(0.5)]],
    certifiante: [false],
    prix_certification: ['0'],
    prix: ['', [Validators.required, Validators.min(0)]],
    statut: ['brouillon', [Validators.required]],
    objectif: ['', [Validators.required]],
    modules: this.fb.array([])
  });

  get modules() {
    return this.formationForm.get('modules') as FormArray;
  }

  getFormControl(control: AbstractControl | null): FormControl {
    if (!(control instanceof FormControl)) {
      throw new Error('Control is not a FormControl');
    }
    return control;
  }

  constructor() {
    this.formationForm.addValidators(this.dateRangeValidator.bind(this));

    this.formationForm.get('certifiante')?.valueChanges.subscribe(certifiante => {
      const prixCertificationControl = this.formationForm.get('prix_certification');
      if (certifiante) {
        prixCertificationControl?.setValidators([Validators.required, Validators.min(0)]);
      } else {
        prixCertificationControl?.clearValidators();
        prixCertificationControl?.setValue('0');
      }
      prixCertificationControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.loadFormations();
  }

  ngAfterViewInit(): void {
    this.formations.paginator = this.paginator;
  }

  async loadFormations(): Promise<void> {
    this.isLoading.set(true);
    try {
      const response = await lastValueFrom(
        this.http.get<{ data: Formation[] }>(LaravelApi.formations)
      );
      this.formations.data = response.data; // Prenez les données depuis la propriété 'data'
    } catch (error) {
      this.showError('Erreur lors du chargement des formations');
    } finally {
      this.isLoading.set(false);
    }
  }

  async searchFormations(searchTerm: string): Promise<void> {
    if (searchTerm.length < 2) {
      this.loadFormations();
      return;
    }

    this.isLoading.set(true);
    try {
      const response = await lastValueFrom(
        this.http.get<ApiFormationResponse>(
          `${LaravelApi.searchFormations}?query=${searchTerm}`
        )
      );
      this.formations.data = response.data;
    } catch (error) {
      this.showError('Erreur lors de la recherche');
    } finally {
      this.isLoading.set(false);
    }
  }

  private async loadClasses(): Promise<void> {
    try {
      // Implémentez la logique de chargement des classes ici
      // Exemple:
      // const classes = await lastValueFrom(this.http.get<any[]>(LaravelApi.classes));
      // this.classes = classes;
    } catch (error) {
      this.showError('Erreur lors du chargement des classes');
    }
  }

  private async loadSeances(): Promise<void> {
    try {
      // Implémentez la logique de chargement des séances ici
      // Exemple:
      // const seances = await lastValueFrom(this.http.get<any[]>(LaravelApi.seances));
      // this.seances = seances;
    } catch (error) {
      this.showError('Erreur lors du chargement des séances');
    }
  }

  openAddModalFormation(): void {
    this.isEditMode.set(false);
    this.currentFormationId.set(null);
    this.formationForm.reset({
      certifiante: false,
      prix_certification: '0',
      statut: 'brouillon',
      nombre_seancef: '1',
      volume_horaire: '1',
      prix: '0',
      modules: []
    });
    this.openFormModal();
  }

  openEditModal(formation: Formation): void {
    this.isEditMode.set(true);
    this.currentFormationId.set(formation.id || null);

    // Patch main form values
    this.formationForm.patchValue({
      nom_formation: formation.nom_formation,
      libelle_formation: formation.libelle_formation,
      date_debutf: formation.date_debutf,
      date_finf: formation.date_finf,
      nombre_seancef: formation.nombre_seancef.toString(),
      volume_horaire: formation.volume_horaire.toString(),
      certifiante: formation.certifiante,
      prix_certification: formation.prix_certification.toString(),
      prix: formation.prix.toString(),
      statut: formation.statut,
      objectif: formation.objectif
    });

    // Clear existing modules
    this.modules.clear();

    // Add modules from the formation
    if (formation.modules && formation.modules.length > 0) {
      formation.modules.forEach(module => {
        this.addModule(module);
      });
    }

    this.openFormModal();
  }

  openAddModalClass(): void {
    const dialogRef = this.dialog.open(ClasseComponent, {
      width: '900px',
      maxHeight: '90vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Rafraîchir la liste des classes
        this.loadClasses();
      }
    });
  }

  openAddModalSeance(): void {
    const dialogRef = this.dialog.open(SeanceComponent, {
      width: '900px',
      maxHeight: '90vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Rafraîchir la liste des séances
        this.loadSeances();
      }
    });
  }

  openFormModal(): void {
    this.dialog.open(this.formationModal, {
      width: '900px',
      maxHeight: '90vh',
      disableClose: true
    });
  }

  async onSubmit(): Promise<void> {
    if (this.formationForm.invalid) {
      this.formationForm.markAllAsTouched();
      return;
    }

    this.submitStatus.set('loading');

    try {
      const formValue = this.formationForm.value;

      // Formattez correctement les dates
      const formatDate = (date: any) => {
        if (date instanceof Date) {
          return date.toISOString().split('T')[0];
        }
        return date; // Si c'est déjà une string au bon format
      };

      const formationData = {
        nom_formation: formValue.nom_formation,
        libelle_formation: formValue.libelle_formation,
        date_debutf: formatDate(formValue.date_debutf),
        date_finf: formatDate(formValue.date_finf),
        nombre_seancef: Number(formValue.nombre_seancef),
        volume_horaire: Number(formValue.volume_horaire),
        certifiante: Boolean(formValue.certifiante),
        prix_certification: Number(formValue.prix_certification),
        prix: Number(formValue.prix),
        statut: formValue.statut,
        objectif: formValue.objectif,
        modules: formValue.modules?.map((module: any) => ({
          nom: module.nom,
          description: module.description || '', // Valeur par défaut si undefined
          lecons: module.lecons?.map((lecon: any) => ({
            titre: lecon.titre,
            contenu: lecon.contenu,
            duree_estimee: Number(lecon.duree_estimee),
            ordre: Number(lecon.ordre)
          })) || [] // Tableau vide si pas de leçons
        })) || [] // Tableau vide si pas de modules
      };

      // Debug: Afficher les données avant envoi
      console.log('Données envoyées:', formationData);

      if (this.isEditMode() && this.currentFormationId()) {
        await lastValueFrom(
          this.http.put(
            LaravelApi.updateFormation(this.currentFormationId()!),
            formationData
          )
        );
        this.showSuccess('Formation mise à jour avec succès');
      } else {
        const response = await lastValueFrom(
          this.http.post(LaravelApi.formations, formationData)
        );
        console.log('Réponse API:', response); // Debug
        this.showSuccess('Formation créée avec succès');
      }

      this.submitStatus.set('success');
      this.closeModal();
      this.loadFormations();
    } catch (error: any) {
      console.error('Erreur détaillée:', error); // Debug
      this.submitStatus.set('error');

      let errorMessage = 'Erreur';
      if (error.error?.message) {
        errorMessage += `: ${error.error.message}`;
      } else if (error.statusText) {
        errorMessage += `: ${error.statusText}`;
      }

      this.showError(errorMessage);
    }
  }

  async deleteFormation(id: number): Promise<void> {
    const confirm = window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?');
    if (!confirm) return;

    try {
      await lastValueFrom(this.http.delete(LaravelApi.deleteFormation(id)));
      this.showSuccess('Formation supprimée avec succès');
      this.loadFormations();
    } catch (error) {
      this.showError('Erreur lors de la suppression de la formation');
    }
  }

  async exportToPdf(): Promise<void> {
    try {
      const blob = await lastValueFrom(
        this.http.get(LaravelApi.exportPdfFormations, { responseType: 'blob' })
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'formations.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      this.showSuccess('Export PDF généré avec succès');
    } catch (error) {
      this.showError('Erreur lors de la génération du PDF');
    }
  }

  // Module Management
  addModule(module?: Module): void {
    const moduleGroup = this.fb.group({
      nom: [module?.nom || '', Validators.required],
      description: [module?.description || ''],
      lecons: this.fb.array([])
    });

    if (module?.lecons) {
      module.lecons.forEach(lecon => {
        this.addLeconToModule(moduleGroup, lecon);
      });
    }

    this.modules.push(moduleGroup);
  }

  removeModule(index: number): void {
    this.modules.removeAt(index);
  }

  addLecon(moduleIndex: number, lecon?: Lecon): void {
    const module = this.modules.at(moduleIndex) as FormGroup;
    const lecons = module.get('lecons') as FormArray;

    lecons.push(this.fb.group({
      titre: [lecon?.titre || '', Validators.required],
      contenu: [lecon?.contenu || '', Validators.required],
      duree_estimee: [lecon?.duree_estimee || 30, [Validators.required, Validators.min(5)]],
      ordre: [lecon?.ordre || (lecons.length + 1), [Validators.required, Validators.min(1)]]
    }));
  }

  private addLeconToModule(moduleGroup: FormGroup, lecon: Lecon): void {
    const lecons = moduleGroup.get('lecons') as FormArray;
    lecons.push(this.fb.group({
      titre: [lecon.titre, Validators.required],
      contenu: [lecon.contenu, Validators.required],
      duree_estimee: [lecon.duree_estimee, [Validators.required, Validators.min(5)]],
      ordre: [lecon.ordre, [Validators.required, Validators.min(1)]]
    }));
  }

  removeLecon(moduleIndex: number, leconIndex: number): void {
    const module = this.modules.at(moduleIndex) as FormGroup;
    const lecons = module.get('lecons') as FormArray;
    lecons.removeAt(leconIndex);
  }

  getLecons(moduleIndex: number): FormArray {
    const module = this.modules.at(moduleIndex) as FormGroup;
    return module.get('lecons') as FormArray;
  }

  // Helpers
  closeModal(): void {
    this.dialog.closeAll();
    this.submitStatus.set('idle');
  }

  dateRangeValidator(control: import('@angular/forms').AbstractControl) {
    const form = control as FormGroup;
    const startDate = form.get('date_debutf')?.value;
    const endDate = form.get('date_finf')?.value;

    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      return { dateRange: true };
    }
    return null;
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

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}