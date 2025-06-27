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
}