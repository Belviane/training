import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "../../private/layout/header/header.component";
import { FooterComponent } from '../../private/layout/footer/footer.component';
import { SidebarComponent } from "../layout/sidebar/sidebar.component";
import { ContentComponent } from '../content/content.component';
import { ResponsiveService } from 'src/app/services/responsive.service';
import { NavigationStart, Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@app/core/auth/services/auth.services';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, FooterComponent, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  
  sidebarCollapsed = signal(false);
  isMobile = signal(false);
  showSidebar = signal(false); // Pour contrôler l'affichage sur mobile

  private breakpointObserver = inject(BreakpointObserver);

  constructor(
    private router: Router, 
    private authService: AuthService,
    private responsiveService: ResponsiveService
  ) {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile.set(result.matches);
        if (!result.matches) {
          this.showSidebar.set(true); // Toujours afficher sur desktop
        }
      });
  }

  ngOnInit(): void {
    console.log('connecté ?', this.authService.isAuthenticated());
    console.log('utilisateur', this.authService.getCurrentUser());
  }

  toggleSidebar(): void {
    if (this.isMobile()) {
      this.showSidebar.update(show => !show);
    } else {
      this.sidebarCollapsed.update(collapsed => !collapsed);
    }
  }

  closeSidebarOnMobile(): void {
    if (this.isMobile()) {
      this.showSidebar.set(false);
    }
  }
}
