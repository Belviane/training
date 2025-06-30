import { Component, OnInit, ViewChild, signal, computed, inject } from '@angular/core';
import { LaravelApi } from '@app/core/api/laravel.api';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators,  FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TemplateRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { 
  Calendar, 
  Clock, 
  Award, 
  DollarSign, 
  Target, 
  BookOpen, 
  Save, 
  AlertCircle, 
  CheckCircle,
  LucideAngularModule
} from 'lucide-angular';
import { Formation, FormationFormData, FormErrors, SubmitStatus } from '../../../core/shared/models/formation.model';

@Component({
  selector: 'app-formations',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule,
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
    private fb = inject(FormBuilder);
    
    submitStatus = signal<SubmitStatus>('idle');
    
    formationForm: FormGroup;

  formations = new MatTableDataSource<any>();
  displayedColumns = ['nom', 'libelle', 'dateDebut', 'dateFin', 'nombreSeance'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('addFormationModal') addFormationModal!: TemplateRef<any>;

  constructor(private dialog: MatDialog, private http: HttpClient) { 
    this.formationForm = this.fb.group({
      nom_formation: ['', [Validators.required]],
      libelle_formation: ['', [Validators.required]],
      date_debutf: ['', [Validators.required]],
      date_finf: ['', [Validators.required]],
      nombre_seancef: ['', [Validators.required, Validators.min(1)]],
      volume_horaire: ['', [Validators.required, Validators.min(0.5)]],
      certifiante: [false],
      prix_certification: ['0'],
      prix: ['', [Validators.required, Validators.min(0)]],
      statut: ['brouillon'],
      objectif: ['', [Validators.required]]
    });

     // Add custom validator for date range
    this.formationForm.addValidators(this.dateRangeValidator.bind(this));

    // Add conditional validator for certification price
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

  isCertifiante = computed(() => this.formationForm.get('certifiante')?.value || false);

  dateRangeValidator(control: import('@angular/forms').AbstractControl) {
    const form = control as FormGroup;
    const startDate = form.get('date_debutf')?.value;
    const endDate = form.get('date_finf')?.value;
    
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      return { dateRange: true };
    }
    return null;
  }

  getFieldError(fieldName: string): string | null {
    const control = this.formationForm.get(fieldName);
    if (control?.invalid && (control?.dirty || control?.touched)) {
      if (control.errors?.['required']) {
        return this.getRequiredMessage(fieldName);
      }
      if (control.errors?.['min']) {
        return this.getMinMessage(fieldName, control.errors['min'].min);
      }
    }
     // Check for date range error
    if (fieldName === 'date_finf' && this.formationForm.errors?.['dateRange']) {
      return 'La date de fin doit être postérieure à la date de début';
    }

    return null;
  }

   private getRequiredMessage(fieldName: string): string {
    const messages: { [key: string]: string } = {
      nom_formation: 'Le nom de la formation est requis',
      libelle_formation: 'Le libellé de la formation est requis',
      date_debutf: 'La date de début est requise',
      date_finf: 'La date de fin est requise',
      nombre_seancef: 'Le nombre de séances est requis',
      volume_horaire: 'Le volume horaire est requis',
      prix: 'Le prix est requis',
      prix_certification: 'Le prix de certification est requis',
      objectif: 'L\'objectif de la formation est requis'
    };
    return messages[fieldName] || 'Ce champ est requis';
  }

  private getMinMessage(fieldName: string, min: number): string {
    const messages: { [key: string]: string } = {
      nombre_seancef: `Le nombre de séances doit être supérieur à ${min - 1}`,
      volume_horaire: `Le volume horaire doit être supérieur à ${min - 0.5}`,
      prix: 'Le prix doit être un nombre positif',
      prix_certification: 'Le prix de certification doit être un nombre positif'
    };
    return messages[fieldName] || `La valeur doit être supérieure à ${min}`;
  }

  getInputClass(fieldName: string): string {
    const baseClass = 'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200';
    const errorClass = 'border-red-300 focus:border-red-500 focus:ring-red-500';
    const normalClass = 'border-gray-300 focus:border-blue-500';
    
    return `${baseClass} ${this.getFieldError(fieldName) ? errorClass : normalClass}`;
  }

  getSubmitButtonClass(): string {
    const baseClass = 'flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 text-white';
    const loadingClass = 'bg-gray-400 cursor-not-allowed';
    const normalClass = 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
    
    return `${baseClass} ${this.submitStatus() === 'loading' ? loadingClass : normalClass}`;
  }

  async onSubmit() {
    if (this.formationForm.invalid) {
      this.formationForm.markAllAsTouched();
      return;
    }

    this.submitStatus.set('loading');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const formValue = this.formationForm.value;
      const formation: Formation = {
        ...formValue,
        nombre_seancef: parseInt(formValue.nombre_seancef),
        volume_horaire: parseFloat(formValue.volume_horaire),
        prix_certification: parseFloat(formValue.prix_certification),
        prix: parseFloat(formValue.prix)
      };

      console.log('Formation créée:', formation);
      this.submitStatus.set('success');

      // Reset form after success
      setTimeout(() => {
        this.submitStatus.set('idle');
        this.formationForm.reset({
          certifiante: false,
          prix_certification: '0',
          statut: 'brouillon'
        });
      }, 2000);

    } catch (error) {
      this.submitStatus.set('error');
      setTimeout(() => this.submitStatus.set('idle'), 3000);
    }
  }

  ngOnInit(): void {
    this.getFormations();
  }

  // formationForm = new FormGroup({
  //   nom: new FormControl('', Validators.required),
  //   libelle: new FormControl('', Validators.required),
  //   dateDebut: new FormControl('', Validators.required),
  //   dateFin: new FormControl('', Validators.required),
  //   nombreSeance: new FormControl('', Validators.required)
  // });

  getFormations(): void {
    this.http.get(LaravelApi.formations).subscribe(response => {
      console.log('Données reçues :', response);
      this.formations.data = (response as any);
      this.formations.paginator = this.paginator;
    });
  }

  openAddModal(): void {
    const dialogRef = this.dialog.open(this.addFormationModal, {
      width: '6000px',
      height:'6000px',
      disableClose: true
    });
  }

  closeModal(): void {
    this.dialog.closeAll();
  }

  addFormation():void {
    
  }

}
