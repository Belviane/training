import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HeaderComponent } from "../../private/layout/header/header.component";
import { FooterComponent } from '../../private/layout/footer/footer.component';
import { SidebarComponent } from "../layout/sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@app/core/auth/services/auth.services';
import { CommonModule } from '@angular/common';

/**
 * Composant Dashboard - Layout principal de l'application
 * 
 * Responsabilités :
 * - Gérer la structure globale de l'application (header, sidebar, contenu, footer)
 * - Adapter l'affichage en fonction de la taille de l'écran (responsive)
 * - Gérer l'état d'ouverture/fermeture de la sidebar
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, FooterComponent, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  // État d'ouverture de la sidebar (ouvert par défaut sur desktop)
  sidebarOpen = true;

  isDesktop = window.innerWidth >= 1024; // Détection desktop
  
  // Indicateur de mode desktop
  //isDesktop = false;
  
  // Événement émis lors de la fermeture de la sidebar
  @Output() sidebarClose = new EventEmitter<void>();

  constructor(
    private authService: AuthService
  ) {
    // Vérification initiale de la taille d'écran
    this.checkScreenSize();
    // Écoute des changements de taille d'écran
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  /**
   * Vérifie la taille de l'écran et ajuste l'état de la sidebar en conséquence
   * - Sur desktop (≥1024px) : sidebar ouverte par défaut
   * - Sur mobile/tablette : sidebar fermée par défaut
   */
  checkScreenSize() {
    this.isDesktop = window.innerWidth >= 1024;
    // Sur mobile, fermer la sidebar par défaut
    if (!this.isDesktop) this.sidebarOpen = false;
  }

  /**
   * Bascule l'état d'ouverture de la sidebar
   */
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  /**
   * Ferme la sidebar
   */
  closeSidebar() {
    this.sidebarOpen = false;
  }

  /**
   * Hook d'initialisation du composant
   * - Vérifie l'état d'authentification
   */
  ngOnInit(): void {
    console.log('Utilisateur connecté :', this.authService.isAuthenticated());
    console.log('Détails utilisateur :', this.authService.getCurrentUser());

    // Logs de debug
    console.log('État authentification:', this.authService.isAuthenticated());
  }
}