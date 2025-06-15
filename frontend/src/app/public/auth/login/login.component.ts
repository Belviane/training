import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth/services/auth.services';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  currentYear: any;
  login: string = '';
  password: string = '';
  errorMessage: string = '';

  ngOnInit(): void {

  }

  constructor(
    private router: Router, 
    private authService: AuthService,
    private toastr: ToastrService) {
    // Initialisation de l'année actuelle
    this.currentYear = new Date().getFullYear();
  }

  Login() {
    this.authService.login(this.login, this.password).subscribe(
      {
        next: () => {
          // Redirection vers la page d'accueil après une connexion réussie
          this.router.navigate(['/app']);
        },
        error: () => {
          /// Affichage d'un toast pour les erreurs de connexion
        this.toastr.error('Identifiants incorrects. Veuillez réessayer.', 'Erreur de connexion');
        }
      }
    );
  }
}
