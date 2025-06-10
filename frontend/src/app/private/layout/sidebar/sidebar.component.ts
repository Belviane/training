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

  isLoggedIn: boolean = false;
  userRole: string | null = null;

  // Ajoutez cette propriété à votre classe
  isSidebarOpen: boolean = false;

  // Ajoutez cette méthode
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  sidebarItems: MenuItem[] = [
    // Commun à tous
    { label: 'Dashboard', icon: 'dashboard', route: '', roles: ['learner', 'parent', 'trainer', 'supervisor', 'admin'] },
    // learner
    { label: 'Mon évolution', icon: 'trending_up', route: '/evolution', roles: ['learner'] },
    { label: 'Mes formations', icon: 'school', route: '/formations', roles: ['learner'] },
    { label: 'Fiche d\'évaluation', icon: 'assignment', route: '/fiche-evaluation', roles: ['learner'] },
    // Parent
    { label: 'Évolution enfant', icon: 'child_care', route: '/enfant/evolution', roles: ['parent'] },
    // trainer
    { label: 'Suivi des learners', icon: 'people', route: '/suivi-learners', roles: ['trainer'] },
    { label: 'Évaluer learners', icon: 'rate_review', route: '/evaluation', roles: ['trainer'] },
    { label: 'Suivi des classes', icon: 'class', route: '/suivi-classes', roles: ['trainer'] },
    { label: 'Tests de connaissances', icon: 'quiz', route: '/tests', roles: ['trainer'] },
    // supervisor
    { label: 'Suivi global', icon: 'analytics', route: '/suivi-global', roles: ['supervisor'] },
    { label: 'Évaluer trainers', icon: 'star_rate', route: '/evaluation-trainers', roles: ['supervisor'] },
    // admin
    { label: 'Comptes', icon: 'account_circle', route: '/admin/comptes', roles: ['admin'] },
    { label: 'Contenus', icon: 'folder', route: '/admin/contenus', roles: ['admin'] },
    { label: 'Statistiques', icon: 'bar_chart', route: '/admin/statistiques', roles: ['admin'] }
  ];

  filteredSidebarItems: MenuItem[] = [];

  constructor(private authService: AuthService) { }

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
}
