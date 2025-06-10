import { Component, HostListener, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router'; // N'oubliez pas d'importer Router

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  menuOpen = false;
  isScrolled = false;
  private scrollThreshold = 50;
  
  @Output() sectionChange = new EventEmitter<string>();

  activeLink: string = 'accueil';

  onNavClick(section: string) {
    this.activeLink = section;
    this.sectionChange.emit(section);
  }

  constructor(private router: Router) {} // Injection correcte du Router

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    document.body.style.overflow = this.menuOpen ? 'hidden' : '';
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > this.scrollThreshold;

    // Gestion à la fois du header et de la navbar
    const header = document.querySelector('header');
    const navbar = document.getElementById('navbar');
    
    if (header) {
      this.isScrolled
        ? header.classList.add('header-scrolled')
        : header.classList.remove('header-scrolled');
    }
    
    if (navbar) {
      this.isScrolled
        ? navbar.classList.add('scrolled')
        : navbar.classList.remove('scrolled');
    }
  }

  testNavigation() {
    console.log('Navigation attempt to /login');
    this.router.navigateByUrl('/login').then((success: boolean) => {
      console.log('Navigation success:', success);
    }).catch((err: any) => {
      console.error('Navigation failed:', err);
    });
  }
}