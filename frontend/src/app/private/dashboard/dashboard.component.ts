import { Component, computed, inject, OnInit } from '@angular/core';
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
  
  isSidebarCollapsed = false;
  isSidebarOpen = false;
  isMobile = false;

  responsiveService = inject(ResponsiveService);

  themeSelectorMode = computed(() => {
    if (this.responsiveService.largeWidth()) {
      return 'side';
    }
    return 'over';
  });

  componentSelectorMode = computed(() => {
    if (this.responsiveService.smallWidth()) {
      return 'over';
    }
    return 'side';
  });

  constructor(
    private router: Router, 
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,) {
      this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(
        map(result => result.matches),
        shareReplay()
      ).subscribe(isMobile => {
        this.isMobile = isMobile;
        if (!isMobile) {
          this.isSidebarOpen = false;
        }
      });
     }

  ngOnInit(): void {
    console.log('connecté ?', this.authService.isAuthenticated());
    console.log('utilisateur', this.authService.getCurrentUser());
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    if (!this.isMobile) {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }

  closeSidebar() {
    if (this.isMobile) {
      this.isSidebarOpen = false;
    }
  }
}
