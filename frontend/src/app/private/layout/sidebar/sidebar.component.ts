import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Importation du Router pour la navigation
import { AuthService } from '../../../core/auth/services/auth.services' // Service d'authentification
import { MatIconModule } from '@angular/material/icon'; // Importation de MatIconModule pour les icônes

interface MenuItem {
  label: string;
  icon: string; // nom d'icône (ex: Material Icons ou FontAwesome)
  route: string;
  roles: string[]; // rôles autorisés à voir ce menu
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  sidebarItems: MenuItem[] = [
    // Commun à tous
    { label: 'Dashboard', icon: 'dashboard', route: '', roles: ['apprenant', 'parent', 'formateur', 'superviseur', 'administrateur'] },
    // Apprenant
    { label: 'Mon évolution', icon: 'trending_up', route: '/evolution', roles: ['apprenant'] },
    { label: 'Mes formations', icon: 'school', route: '/formations', roles: ['apprenant'] },
    { label: 'Fiche d\'évaluation', icon: 'assignment', route: '/fiche-evaluation', roles: ['apprenant'] },
    // Parent
    { label: 'Évolution enfant', icon: 'child_care', route: '/enfant/evolution', roles: ['parent'] },
    // Formateur
    { label: 'Suivi des apprenants', icon: 'people', route: '/suivi-apprenants', roles: ['formateur'] },
    { label: 'Évaluer apprenants', icon: 'rate_review', route: '/evaluation', roles: ['formateur'] },
    { label: 'Suivi des classes', icon: 'class', route: '/suivi-classes', roles: ['formateur'] },
    { label: 'Tests de connaissances', icon: 'quiz', route: '/tests', roles: ['formateur'] },
    // Superviseur
    { label: 'Suivi global', icon: 'analytics', route: '/suivi-global', roles: ['superviseur'] },
    { label: 'Évaluer formateurs', icon: 'star_rate', route: '/evaluation-formateurs', roles: ['superviseur'] },
    // Administrateur
    { label: 'Comptes', icon: 'account_circle', route: '/admin/comptes', roles: ['administrateur'] },
    { label: 'Contenus', icon: 'folder', route: '/admin/contenus', roles: ['administrateur'] },
    { label: 'Statistiques', icon: 'bar_chart', route: '/admin/statistiques', roles: ['administrateur'] }
  ];

  filteredSidebarItems: MenuItem[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit() {
    const userRole = this.authService.getUserRole();

    this.filteredSidebarItems = this.sidebarItems.filter(item => userRole && item.roles.includes(userRole));
  }
  
}
