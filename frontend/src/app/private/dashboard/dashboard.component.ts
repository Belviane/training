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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, FooterComponent, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
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

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    console.log('connecté ?', this.authService.isAuthenticated());
    console.log('utilisateur', this.authService.getCurrentUser());
  }

}
