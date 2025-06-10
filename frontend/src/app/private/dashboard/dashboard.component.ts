import { Component } from '@angular/core';
import { HeaderComponent } from "../../private/layout/header/header.component";
import { FooterComponent } from '../../private/layout/footer/footer.component';
import { SidebarComponent } from "../layout/sidebar/sidebar.component";
import { ContentComponent } from '../content/content.component';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, SidebarComponent, ContentComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
