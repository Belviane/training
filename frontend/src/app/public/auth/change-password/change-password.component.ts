import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/services/auth.services';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {

  changePasswordForm: FormGroup;
  isLoading: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.changePasswordForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('Password')?.value === form.get('Password_confirmation')?.value
      ? null
      : { mismatch: true };
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  // onSubmit(): void {
  //   if (this.changePasswordForm.invalid) {
  //     this.toastr.error('Veuillez corriger les erreurs dans le formulaire', 'Erreur');
  //     return;
  //   }

  //   this.isLoading = true;

  //   const formData = {
  //     login: this.changePasswordForm.value.login,
  //     password: this.changePasswordForm.value.Password, // Attention à la casse
  //     password_confirmation: this.changePasswordForm.value.Password_confirmation
  //   };

  //   console.log('Données envoyées:', formData); // Pour debug

  //   this.authService.changePassword(formData).subscribe({
  //     next: () => {
  //       this.toastr.success('Identifiants changés avec succès', 'Succès');
  //       this.authService.logout(); // Déconnexion après changement
  //       this.router.navigate(['/login']); // Redirection vers login
  //     },
  //     error: (err) => {
  //       this.isLoading = false;
  //       console.error('Erreur complète:', err); // Pour debug

  //       let errorMessage = 'Une erreur est survenue';
  //       if (err.error?.errors) {
  //         // Traitement des erreurs de validation Laravel
  //         errorMessage = Object.values(err.error.errors).flat().join('\n');
  //       } else if (err.error?.message) {
  //         errorMessage = err.error.message;
  //       }

  //       this.toastr.error(errorMessage, 'Erreur');
  //     },
  //   });
  // }

  onSubmit(): void {
    if (this.changePasswordForm.invalid) {
      this.toastr.error('Veuillez corriger les erreurs dans le formulaire', 'Erreur');
      return;
    }

    this.isLoading = true;

    const formData = {
      login: this.changePasswordForm.value.login,
      password: this.changePasswordForm.value.password,
      password_confirmation: this.changePasswordForm.value.password_confirmation
    };

    console.log('Données formatées:', formData);

    this.authService.changePassword(formData).subscribe({
      next: () => {
        this.toastr.success('Mot de passe changé avec succès', 'Succès');
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Détails de l\'erreur:', err);

        let errorMessage = 'Erreur lors du changement de mot de passe';
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.status === 500) {
          errorMessage = 'Erreur serveur - Veuillez contacter l\'administrateur';
        }

        this.toastr.error(errorMessage, 'Erreur');
      }
    });
  }


}
