import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth/services/auth.services';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  currentYear: any;
  login: string = '';
  mdp: string = '';
  errorMessage: string = '';

  ngOnInit(): void {
    
  }

  constructor(private router: Router, private authService: AuthService) {
    // Initialisation de l'année actuelle
    this.currentYear = new Date().getFullYear();
   }

  Login() {
    this.authService.login(this.login, this.mdp).subscribe(
      {
      next: () => 
        // Redirection vers la page d'accueil après une connexion réussie
        this.router.navigate(['/app']),
      error: () => {
        // Gestion des erreurs de connexion
        console.error('Erreur de connexion:');
        alert('Identifiants incorrects. Veuillez réessayer.')
      }
    }
  );
  }

}
