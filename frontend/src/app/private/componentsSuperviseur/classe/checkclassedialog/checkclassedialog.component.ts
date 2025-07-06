import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkclassedialog',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatNativeDateModule,
  ],
  templateUrl: './checkclassedialog.component.html',
  styleUrl: './checkclassedialog.component.css'
})
export class CheckclassedialogComponent {

  dateControl = new FormControl('', Validators.required);
  startTimeControl = new FormControl('09:00');
  endTimeControl = new FormControl('17:00');

  constructor(
    public dialogRef: MatDialogRef<CheckclassedialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      type: 'disponibilite' | 'capacite',
      classeId: number 
    }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.dateControl.invalid) return;

    const date = this.dateControl.value;
    const result = {
      date,
      ...(this.data.type === 'disponibilite' && {
        startTime: this.startTimeControl.value,
        endTime: this.endTimeControl.value
      })
    };

    this.dialogRef.close(result);
  }
}
