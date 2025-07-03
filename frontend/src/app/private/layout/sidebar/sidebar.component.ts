import { Component, computed, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Importation du Router pour la navigation
import { AuthService } from '../../../core/auth/services/auth.services' // Service d'authentification
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

interface MenuItem {
  label: string;
  icon: string; // nom d'icône (ex: Material Icons ou FontAwesome)
  route: string; // chemin de navigation
  roles: string[]; // rôles autorisés à voir ce menu
  exact: boolean;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

export class SidebarComponent implements OnInit {

  @Input() isOpen = false;
  @Output() sidebarClose = new EventEmitter<void>();

  isLoggedIn: boolean = false;
  userRole: string | null = null;
  route: string | undefined;

  expandedMenus: any[] = [];

  sidebarItems: MenuItem[] = [
    // Commun à tous
    { label: 'Dashboard', icon: 'dashboard', route: '/app', roles: ['apprenant', 'parent', 'formateur', 'superviseur', 'administrateur', 'caissier', 'auditeur', 'vendeur'], exact: true },

    // apprenant
    { label: 'Mon évolution', icon: 'trending_up', route: '/evolution', roles: ['apprenant'], exact: true },
    { label: 'Mes formations', icon: 'school', route: '/formations', roles: ['apprenant'], exact: true },
    { label: 'Fiche d\'évaluation', icon: 'assignment', route: '/fiche-evaluation', roles: ['apprenant'], exact: true },
    { label: 'Mes évaluations', icon: 'task', route: '/app/evaluation', roles: ['apprenant'], exact: true },

    // Parent
    { label: 'Évolution enfant', icon: 'child_care', route: '/enfant/evolution', roles: ['parent'], exact: true },

    // formateur
    { label: 'Suivi des apprenants', icon: 'people', route: '/app/apprenants', roles: ['formateur'], exact: true },
    { label: 'Évaluer apprenants', icon: 'rate_review', route: '/evaluation', roles: ['formateur'], exact: true },
    { label: 'Suivi des classes', icon: 'class', route: '/suivi-classes', roles: ['formateur'], exact: true },
    { label: 'Tests de connaissances', icon: 'quiz', route: '/tests', roles: ['formateur'], exact: true },

    // superviseur
    {
      label: 'Suivi global',
      icon: 'analytics',
      route: '',
      roles: ['superviseur'],
      exact: true,
      children: [
        {
          label: 'Utilisateurs',
          icon: 'people',
          route: '/app/listesuperviseur',
          roles: ['superviseur'],
          exact: true,
        },
        {
          label: 'Formations',
          icon: 'school',
          route: '/app/formations',
          roles: ['superviseur'],
          exact: true,
        },
        {
          label: 'Classes',
          icon: 'class',
          route: '/app/classe',
          roles: ['superviseur'],
          exact: true,
        },
        {
          label: 'Seances',
          icon: 'event',
          route: '/app/seance',
          roles: ['superviseur'],
          exact: true,
        },
        {
          label: 'Paiements',
          icon: 'payment',
          route: '/app/paiements',
          roles: ['superviseur'],
          exact: true
        }
      ]
    },
    { label: 'Évaluer formateurs', icon: 'star_rate', route: '/app/evaluer', roles: ['superviseur'], exact: true },

    // administrateur
    { label: 'Comptes', icon: 'account_circle', route: '/app/compte', roles: ['administrateur'], exact: true },
    { label: 'Contenus', icon: 'folder', route: '/administrateur/contenus', roles: ['administrateur'], exact: true },
    { label: 'Statistiques', icon: 'bar_chart', route: '/administrateur/statistiques', roles: ['administrateur'], exact: true }
  ];

  filteredSidebarItems: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient) {
    this.isLoggedIn = this.authService.isLoggedIn;
    this.userRole = this.authService.userRole;
    this.filterMenuItems();

  }

  ngOnInit(): void {
    if (this.userRole === 'superviseur') {
      this.expandedMenus.push('Suivi global');
    }
  }

  filterMenuItems() {
    if (this.userRole) {
      this.filteredSidebarItems = this.sidebarItems.filter(item => item.roles.includes(this.userRole!));
    } else {
      this.filteredSidebarItems = [];
    }
  }

  isExpanded(menu: any) {
    return this.expandedMenus.includes(menu.label);
  }

  toggleExpansion(menu: any) {
    if (this.expandedMenus.includes(menu.label)) {
      this.expandedMenus = this.expandedMenus.filter(label => label !== menu.label);
    } else {
      this.expandedMenus.push(menu.label);
    }

    // Fermer la sidebar après sélection sur mobile
    if (window.innerWidth <= 992) {
      this.closeSidebar();
    }
  }

  closeSidebar() {
    this.sidebarClose.emit();
  }

  // Ajoutez cette méthode pour fermer la sidebar après navigation
  navigateAndClose(route: string) {
    this.router.navigate([route]).then(() => {
      if (window.innerWidth <= 992) { // Seulement sur mobile
        this.closeSidebar();
      }
    });
  }

  // Ajoutez cette méthode pour vérifier les routes actives
  isRouteActive(route: string, exact: boolean): boolean {
    if (exact) {
      return this.router.isActive(route, { paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored' });
    } else {
      // Pour les routes non-exactes, vérifiez que l'URL commence par la route
      const currentUrl = this.router.url;
      return currentUrl.startsWith(route) ||
        this.router.isActive(route, { paths: 'subset', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored' });
    }
  } 

  //   isRouteActive(route: string, exact: boolean): boolean {
  //   if (exact) {
  //     return this.router.isActive(route, { paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored' });
  //   } else {
  //     const currentUrl = this.router.url;
  //     return currentUrl.startsWith(route);
  //   }
  // }

}
