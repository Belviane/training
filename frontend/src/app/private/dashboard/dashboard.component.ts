import { Component, computed, inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../../private/layout/header/header.component";
import { FooterComponent } from '../../private/layout/footer/footer.component';
import { SidebarComponent } from "../layout/sidebar/sidebar.component";
import { ContentComponent } from '../content/content.component';
import { ResponsiveService } from 'src/app/services/responsive.service';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, SidebarComponent, ContentComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  responsiveService = inject(ResponsiveService);

  themeSelectorMode = computed(() => {
    if (this.responsiveService.largeWidth()){
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

  constructor() {}

  ngOnInit() {
  }

}
