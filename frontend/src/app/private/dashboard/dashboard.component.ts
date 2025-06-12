import { Component, computed, inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../../private/layout/header/header.component";
import { FooterComponent } from '../../private/layout/footer/footer.component';
import { SidebarComponent } from "../layout/sidebar/sidebar.component";
import { ContentComponent } from '../content/content.component';
import { ResponsiveService } from 'src/app/services/responsive.service';
import { NavigationStart, Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, SidebarComponent, ContentComponent, FooterComponent, RouterOutlet],
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

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (event.url !== '/app') {
          this.router.navigate(['/app'], { replaceUrl: true });
          // Rediriger à nouveau pour éviter les tentatives de revenir en arrière
          setTimeout(() => {
            if (this.router.url !== '/app') {
              this.router.navigate(['/app'], { replaceUrl: true });
            }
          }, 100);
        }
      }
    });
  }

}
