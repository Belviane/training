import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Importation du Router pour la navigation
import { AuthService } from '../../../core/auth/services/auth.services' // Service d'authentification
import { MatIconModule } from '@angular/material/icon'; // Importation de MatIconModule pour les icônes
import { Observable } from 'rxjs/internal/Observable';
import { LaravelApi } from '@app/core/api/laravel.api';
import { HttpClient } from '@angular/common/http';
import { CompteComponent } from '../../compte/compte.component';

interface MenuItem {
  label: string;
  icon: string; // nom d'icône (ex: Material Icons ou FontAwesome)
  route: string; // chemin de navigation
  roles: string[]; // rôles autorisés à voir ce menu
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  [x: string]: any;

  isLoggedIn: boolean = false;
  userRole: string | null = null;
  route: string | undefined;



  // Ajoutez cette propriété à votre classe
  isSidebarOpen: boolean = false;

  // Ajoutez cette méthode
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  sidebarItems: MenuItem[] = [
    // Commun à tous
    { label: 'Dashboard', icon: 'dashboard', route: '', roles: ['apprenant', 'parent', 'formateur', 'superviseur', 'administrateur'] },
    // apprenant
    { label: 'Mon évolution', icon: 'trending_up', route: '/evolution', roles: ['apprenant'] },
    { label: 'Mes formations', icon: 'school', route: '/formations', roles: ['apprenant'] },
    { label: 'Fiche d\'évaluation', icon: 'assignment', route: '/fiche-evaluation', roles: ['apprenant'] },
    // Parent
    { label: 'Évolution enfant', icon: 'child_care', route: '/enfant/evolution', roles: ['parent'] },
    // formateur
    { label: 'Suivi des apprenants', icon: 'people', route: '/suivi-apprenants', roles: ['formateur'] },
    { label: 'Évaluer apprenants', icon: 'rate_review', route: '/evaluation', roles: ['formateur'] },
    { label: 'Suivi des classes', icon: 'class', route: '/suivi-classes', roles: ['formateur'] },
    { label: 'Tests de connaissances', icon: 'quiz', route: '/tests', roles: ['formateur'] },
    // superviseur
    { label: 'Suivi global', icon: 'analytics', route: '/suivi-global', roles: ['superviseur'] },
    { label: 'Évaluer formateurs', icon: 'star_rate', route: '/evaluation-formateurs', roles: ['superviseur'] },
    
    // administrateur
    { label: 'Comptes', icon: 'account_circle', route: '/compte', roles: ['administrateur'] }, // Cette route doit être liée à CompteComponent dans votre routing module
    { label: 'Contenus', icon: 'folder', route: '/administrateur/contenus', roles: ['administrateur'] },
    { label: 'Statistiques', icon: 'bar_chart', route: '/administrateur/statistiques', roles: ['administrateur'] }
  ];

  filteredSidebarItems: MenuItem[] = [];

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userRole = this.authService.getUserRole();
    this.filterMenuItems();

  }

  filterMenuItems() {
    if (this.userRole) {
      this.filteredSidebarItems = this.sidebarItems.filter(item => item.roles.includes(this.userRole!));
    } else {
      this.filteredSidebarItems = [];
    }
  }

  logout() {
    this.router.navigate(['/login']); // Redirigez vers la page de connexion
}
}
