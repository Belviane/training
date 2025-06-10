import { Component } from '@angular/core';
type Section = 'accueil' | 'blog' | 'a propos' | 'contact';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  activeSection: Section = 'accueil';

  setActiveSection(section: Section) {
    this.activeSection = section;
  }

}
