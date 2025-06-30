import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/services/auth.services';
import { LoginRequest } from '@app/core/shared/models/user.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [FormsModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  credentials: LoginRequest = {
    login: '',
    password: '',
  };
  isLoading: boolean = false;
  // New property to control password input type
  passwordFieldType: string = 'password';

  errorMessage: string | null = null;

  showForgotPasswordModal: boolean = false;
  forgotPasswordEmail: string = '';
  isSubmittingForgot: boolean = false;

  ngOnInit() { }

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  // login() {
  //   this.isLoading = true;
  //   this.errorMessage = null;

  //   this.authService.login(this.credentials).subscribe({
  //     next: () => {
  //       this.toastr.success('Connexion réussie', 'Bienvenue');
  //       this.router.navigate(['/app']);
  //     },
  //     error: (err) => {
  //       this.isLoading = false;
  //       const errorMessage =
  //         err.error?.message || 'Identifiants incorrects. Veuillez réessayer.';
  //       this.toastr.error(errorMessage, 'Erreur de connexion');
  //     },
  //     complete: () => {
  //       this.isLoading = false;
  //       // Optionnel: Faire disparaître le message d'erreur après un délai
  //       if (this.errorMessage) {
  //         setTimeout(() => {
  //           this.errorMessage = null;
  //         }, 5000); // Disparaît après 5 secondes
  //       }
  //     },
  //   });

  //   // this.authService.login(this.credentials).subscribe({
  //   //   next: () => {
  //   //     this.toastr.success('Connexion réussie', 'Bienvenue');
  //   //     this.router.navigate(['/app']);
  //   //   },
  //   //   error: (err) => {
  //   //     this.isLoading = false;
  //   //     const errorMessage =
  //   //       err.error?.message || 'Identifiants incorrects. Veuillez réessayer.';
  //   //     this.toastr.error(errorMessage, 'Erreur de connexion');
  //   //   },
  //   //   complete: () => {
  //   //     this.isLoading = false;
  //   //     // Optionnel: Faire disparaître le message d'erreur après un délai
  //   //     if (this.errorMessage) {
  //   //       setTimeout(() => {
  //   //         this.errorMessage = null;
  //   //       }, 5000); // Disparaît après 5 secondes
  //   //     }
  //   //   },
  //   // });
  // }

  login() {
    this.isLoading = true;
    this.errorMessage = null;

    this.authService.login(this.credentials).subscribe({
      next: (response: any) => {
        if (response.changer_password) {
          // Rediriger vers la page de changement de mot de passe
          this.router.navigate(['/change-password']);
          return;
        }
        this.toastr.success('Connexion réussie', 'Bienvenue');
        this.router.navigate(['/app']);
      },
      error: (err) => {
        this.isLoading = false;
        let errorMessage = 'Identifiants incorrects. Veuillez réessayer.';

        if (err.message.includes('vérifier votre email')) {
          errorMessage = err.message;
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }

        this.toastr.error(errorMessage, 'Erreur de connexion');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // New method to toggle password visibility 
  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  openForgotPasswordModal() {
    this.showForgotPasswordModal = true;
  }

  closeForgotPasswordModal() {
    this.showForgotPasswordModal = false;
    this.forgotPasswordEmail = '';
  }

  submitForgotPassword() {
    if (!this.forgotPasswordEmail) return;

    this.isSubmittingForgot = true;

    this.authService.forgotPassword(this.forgotPasswordEmail).subscribe({
      next: (res) => {
        this.toastr.success("Un code de vérification a été envoyé à votre adresse email.");
        this.closeForgotPasswordModal();

        // Préparer le reset
        this.resetPasswordData.email = this.forgotPasswordEmail;
        this.showResetPasswordModal = true; // Afficher le deuxième modal
      },
      error: (err) => {
        this.toastr.error(err.error?.message || "Erreur lors de l'envoi du mail.", "Erreur");
      },
      complete: () => {
        this.isSubmittingForgot = false;
      }
    });
  }


  // Pour gérer le second modal
  showResetPasswordModal: boolean = false;
  resetPasswordData = {
    email: '',
    verification_code: '',
    new_password: '',
    new_password_confirmation: ''
  };

  submitResetPassword() {
    const data = this.resetPasswordData;

    if (
      !data.verification_code || !data.new_password || !data.new_password_confirmation
    ) {
      this.toastr.error("Tous les champs sont requis.");
      return;
    }

    if (data.new_password !== data.new_password_confirmation) {
      this.toastr.error("Les mots de passe ne correspondent pas.");
      return;
    }

    this.authService.resetPassword(data).subscribe({
      next: () => {
        this.toastr.success("Mot de passe réinitialisé avec succès.");
        this.showResetPasswordModal = false;
      },
      error: (err) => {
        this.toastr.error(err.error?.message || "Échec de la réinitialisation.");
      },
    });
  }


}