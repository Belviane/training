import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.services'; // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  currentYear: any;
  email: string = '';
  password: string = '';

  constructor(private router: Router) {
    // Initialisation directe dans le constructeur
    this.currentYear = new Date().getFullYear();
  }
  
  login(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/app']),
      error: (err) => console.error('Erreur de connexion', err)
    });
  }

}
