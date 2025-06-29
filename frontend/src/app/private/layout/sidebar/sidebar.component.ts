import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  [x: string]: any;

  isMobile = false;
  
  @Input() isCollapsed = false;
  @Input() isSidebarOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();

  onCloseSidebar() {
    this.closeSidebar.emit();
  }

  isLoggedIn: boolean = false;
  userRole: string | null = null;
  route: string | undefined;

  expandedMenus: any[] = [];

  isExpanded(menu: any) {
    return this.expandedMenus.includes(menu.label);
  }

  toggleExpansion(menu: any) {
    if (this.expandedMenus.includes(menu.label)) {
      this.expandedMenus = this.expandedMenus.filter(label => label !== menu.label);
    } else {
      this.expandedMenus.push(menu.label);
    }
  }


  // Ajoutez cette méthode
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  sidebarItems: MenuItem[] = [
    // Commun à tous
    { label: 'Dashboard', icon: 'dashboard', route: '/app', roles: ['apprenant', 'parent', 'formateur', 'superviseur', 'administrateur', 'caissier', 'auditeur', 'vendeur'], exact: true },

    // apprenant
    { label: 'Mon évolution', icon: 'trending_up', route: '/evolution', roles: ['apprenant'], exact: false },
    { label: 'Mes formations', icon: 'school', route: '/formations', roles: ['apprenant'], exact: false },
    { label: 'Fiche d\'évaluation', icon: 'assignment', route: '/fiche-evaluation', roles: ['apprenant'], exact: false },

    // Parent
    { label: 'Évolution enfant', icon: 'child_care', route: '/enfant/evolution', roles: ['parent'], exact: false },

    // formateur
    { label: 'Suivi des apprenants', icon: 'people', route: '/app/apprenants', roles: ['formateur'], exact: false },
    { label: 'Évaluer apprenants', icon: 'rate_review', route: '/evaluation', roles: ['formateur'], exact: false },
    { label: 'Suivi des classes', icon: 'class', route: '/suivi-classes', roles: ['formateur'], exact: false },
    { label: 'Tests de connaissances', icon: 'quiz', route: '/tests', roles: ['formateur'], exact: false },

    // superviseur
    {
      label: 'Suivi global',
      icon: 'analytics',
      route: '',
      roles: ['superviseur'],
      exact: false,
      children: [
        {
          label: 'Utilisateurs',
          icon: 'people',
          route: '/app/listesuperviseur',
          roles: ['superviseur'],
          exact: false,
        },
        {
          label: 'Formations',
          icon: 'school',
          route: '/app/formations',
          roles: ['superviseur'],
          exact: false
        },
        {
          label: 'Paiements',
          icon: 'payment',
          route: '/app/paiements',
          roles: ['superviseur'],
          exact: false
        }
      ]
    },
    { label: 'Évaluer formateurs', icon: 'star_rate', route: '/evaluation-formateurs', roles: ['superviseur'], exact: false },

    // administrateur
    { label: 'Comptes', icon: 'account_circle', route: '/app/compte', roles: ['administrateur'], exact: false },
    { label: 'Contenus', icon: 'folder', route: '/administrateur/contenus', roles: ['administrateur'], exact: false },
    { label: 'Statistiques', icon: 'bar_chart', route: '/administrateur/statistiques', roles: ['administrateur'], exact: false }
  ];

  filteredSidebarItems: MenuItem[] = [];

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn;
    this.userRole = this.authService.userRole;
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
