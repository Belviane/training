import { Component, HostListener, EventEmitter, Output, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subject, fromEvent, debounceTime, takeUntil, filter } from 'rxjs';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('navbar', { static: true }) navbar!: ElementRef;
  @ViewChild('mainMenu', { static: true }) mainMenu!: ElementRef;
  @ViewChild('menuToggle', { static: true }) menuToggle!: ElementRef;

  @Output() sectionChange = new EventEmitter<string>();

  // États du composant
  menuOpen = false;
  isScrolled = false;
  activeLink: string = 'accueil';

  // Configuration
  private readonly scrollThreshold = 50;
  private readonly headerHeight = 80;
  private readonly mobileBreakpoint = 768;

  // Gestion des subscriptions
  private destroy$ = new Subject<void>();

  // Variables pour la gestion du scroll
  private lastScrollTop = 0;
  private ticking = false;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  // Ajoutez cette méthode pour fermer le menu lors du redimensionnement
  private handleResize(): void {
    if (window.innerWidth > 768 && this.menuOpen) {
      this.closeMenu();
    }
  }

  ngOnInit(): void {
    this.initializeComponent();
    this.setupRouterSubscription();

    if (isPlatformBrowser(this.platformId)) {
      fromEvent(window, 'resize')
        .pipe(
          debounceTime(200),
          takeUntil(this.destroy$)
        )
      .subscribe(() => this.handleResize());
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupScrollOptimization();
      this.setupKeyboardNavigation();
      this.setActivePageFromRoute();
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private initializeComponent(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Ajouter du padding-top au body pour compenser le header fixe
      this.renderer.setStyle(document.body, 'padding-top', `${this.headerHeight}px`);

      // Animation d'entrée du header
      this.animateHeaderEntrance();
    }
  }

  private setupRouterSubscription(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.setActivePageFromRoute();
        // Fermer le menu mobile lors de la navigation
        if (this.menuOpen) {
          this.closeMenu();
        }
      });
  }


  private setupKeyboardNavigation(): void {
    fromEvent(document, 'keydown')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: Event) => {
        this.handleKeyboardNavigation(event as KeyboardEvent);
      });
  }

  private setupScrollOptimization(): void {
    fromEvent(window, 'scroll', { passive: true })
      .pipe(
        debounceTime(10000), // Augmentez ce délai si nécessaire
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.handleScroll();
      });
  }
  private handleScroll(): void {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Mettre à jour l'état de scroll
        const wasScrolled = this.isScrolled;
        this.isScrolled = scrollTop > this.scrollThreshold;

        // Appliquer les classes CSS si l'état a changé
        if (wasScrolled !== this.isScrolled) {
          this.updateScrollStyles();
        }

        // Mettre à jour la section active basée sur le scroll
        // Seulement si le menu n'est pas ouvert (pour éviter des conflits sur mobile)
        if (!this.menuOpen) {
          this.updateActiveSectionOnScroll();
        }

        this.lastScrollTop = scrollTop;
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  private updateScrollStyles(): void {
    if (this.navbar?.nativeElement) {
      if (this.isScrolled) {
        this.renderer.addClass(this.navbar.nativeElement, 'scrolled');
      } else {
        this.renderer.removeClass(this.navbar.nativeElement, 'scrolled');
      }
    }
  }

  private updateActiveSectionOnScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Mettez à jour cette liste pour correspondre exactement à vos sections
    const sections = ['accueil', 'formations', 'a-propos', 'contact'];
    let currentSection = this.activeLink; // Conserve la valeur actuelle par défaut

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        // Vérifie si l'élément est visible dans la fenêtre (au moins 50% visible)
        const elementTop = rect.top;
        const elementBottom = rect.bottom;
        const elementHeight = rect.height;

        const isVisible = (
          (elementTop >= 0 && elementTop <= this.headerHeight + 100) ||
          (elementBottom >= this.headerHeight && elementBottom <= window.innerHeight) ||
          (elementTop <= 0 && elementBottom >= window.innerHeight)
        );

        if (isVisible) {
          currentSection = section;
          break;
        }
      }
    }

    // Ne met à jour que si la section a changé
    if (currentSection !== this.activeLink) {
      this.setActiveLink(currentSection);
      // Force la détection des changements si nécessaire
      this.sectionChange.emit(currentSection);
    }
  }

  private handleKeyboardNavigation(event: KeyboardEvent): void {
    if (!this.menuOpen) return;

    const focusableElements = this.mainMenu?.nativeElement?.querySelectorAll(
      'a[href], button:not([disabled])'
    );

    if (!focusableElements?.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.closeMenu();
        this.focusMenuToggle();
        break;

      case 'Tab':
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
        break;

      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        this.navigateWithArrows(focusableElements, event.key === 'ArrowDown');
        break;
    }
  }

  private navigateWithArrows(elements: NodeListOf<Element>, isDown: boolean): void {
    const currentIndex = Array.from(elements).findIndex(
      el => el === document.activeElement
    );

    let nextIndex: number;
    if (isDown) {
      nextIndex = currentIndex + 1 >= elements.length ? 0 : currentIndex + 1;
    } else {
      nextIndex = currentIndex - 1 < 0 ? elements.length - 1 : currentIndex - 1;
    }

    (elements[nextIndex] as HTMLElement).focus();
  }

  private animateHeaderEntrance(): void {
    if (this.navbar?.nativeElement) {
      this.renderer.setStyle(this.navbar.nativeElement, 'transform', 'translateY(-100%)');
      this.renderer.setStyle(this.navbar.nativeElement, 'opacity', '0');

      setTimeout(() => {
        this.renderer.setStyle(this.navbar.nativeElement, 'transition', 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)');
        this.renderer.setStyle(this.navbar.nativeElement, 'transform', 'translateY(0)');
        this.renderer.setStyle(this.navbar.nativeElement, 'opacity', '1');
      }, 100);
    }
  }

  // Méthodes publiques pour l'interaction

  onNavClick(section: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    this.setActiveLink(section);
    this.sectionChange.emit(section);

    // Fermer le menu mobile après clic
    if (this.menuOpen && this.isMobile()) {
      this.closeMenu();
    }

    // Scroll vers la section si elle existe
    this.scrollToSection(section);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      this.openMenu();
    } else {
      this.closeMenu();
    }
  }

  private openMenu(): void {
    this.menuOpen = true;

    if (isPlatformBrowser(this.platformId)) {
      // Empêcher le scroll du body
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
      this.renderer.addClass(document.body, 'menu-open');

      // Ajouter les classes CSS
      if (this.menuToggle?.nativeElement) {
        this.renderer.addClass(this.menuToggle.nativeElement, 'active');
      }

      if (this.mainMenu?.nativeElement) {
        this.renderer.addClass(this.mainMenu.nativeElement, 'open');
      }

      // Focus sur le premier lien pour l'accessibilité
      setTimeout(() => {
        const firstLink = this.mainMenu?.nativeElement?.querySelector('a');
        if (firstLink) {
          firstLink.focus();
        }
      }, 300);
    }
  }

  private closeMenu(): void {
    this.menuOpen = false;

    if (isPlatformBrowser(this.platformId)) {
      // Restaurer le scroll du body
      this.renderer.setStyle(document.body, 'overflow', '');
      this.renderer.removeClass(document.body, 'menu-open');

      // Retirer les classes CSS
      if (this.menuToggle?.nativeElement) {
        this.renderer.removeClass(this.menuToggle.nativeElement, 'active');
      }

      if (this.mainMenu?.nativeElement) {
        this.renderer.removeClass(this.mainMenu.nativeElement, 'open');
      }
    }
  }

  private focusMenuToggle(): void {
    if (this.menuToggle?.nativeElement) {
      this.menuToggle.nativeElement.focus();
    }
  }

  private setActiveLink(section: string): void {
    if (this.activeLink !== section) {
      this.activeLink = section;
    }
  }

  private setActivePageFromRoute(): void {
    const currentRoute = this.router.url;
    const routeToSection: { [key: string]: string } = {
      '/': 'accueil',
      '/accueil': 'accueil',
      '/formations': 'formations',
      '/about': 'about',
      '/contact': 'contact'
    };

    // Trouver la correspondance la plus précise
    const matchingRoute = Object.keys(routeToSection)
      .sort((a, b) => b.length - a.length) // Trie par longueur décroissante
      .find(route => currentRoute.startsWith(route));

    const section = matchingRoute ? routeToSection[matchingRoute] : 'accueil';
    this.setActiveLink(section);
  }

  // Méthodes utilitaires

  private isMobile(): boolean {
    return isPlatformBrowser(this.platformId) && window.innerWidth <= this.mobileBreakpoint;
  }

  scrollToSection(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.offsetTop - this.headerHeight - 20;

      window.scrollTo({
        top: Math.max(0, elementPosition),
        behavior: 'smooth'
      });
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]).then(() => {
      this.setActiveLinkFromRoute();
      if (this.menuOpen) {
        this.closeMenu();
      }
    });
  }
  private setActiveLinkFromRoute(): void {
    const currentRoute = this.router.url.split('?')[0];
    const routeMap: Record<string, string> = {
      '/': 'accueil',
      '/formations': 'formations',
      '/about': 'about',
      '/apropos': 'about',
      '/contact': 'contact'
    };

    const matchingRoute = Object.keys(routeMap)
      .find(key => currentRoute === key || currentRoute.startsWith(key + '/'));

    this.activeLink = matchingRoute ? routeMap[matchingRoute] : 'accueil';
  }

  // Gestionnaires d'événements optimisés

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event): void {
    // Debounce le resize pour éviter trop d'appels
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      if (this.menuOpen && !this.isMobile()) {
        this.closeMenu();
      }
    }, 150);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const navbar = this.navbar?.nativeElement;

    // Fermer le menu si on clique en dehors sur mobile
    if (this.menuOpen && navbar && !navbar.contains(target)) {
      this.closeMenu();
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any): void {
    this.isScrolled = window.scrollY > 0;
  }

  private resizeTimeout: any;

  private cleanup(): void {
    // Émettre le signal de destruction
    this.destroy$.next();
    this.destroy$.complete();

    if (isPlatformBrowser(this.platformId)) {
      // Nettoyer les styles ajoutés au body
      this.renderer.setStyle(document.body, 'padding-top', '');
      this.renderer.setStyle(document.body, 'overflow', '');
      this.renderer.removeClass(document.body, 'menu-open');

      // Nettoyer les timeouts
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
    }
  }

  // Méthodes publiques pour l'accès depuis le template

  isLinkActive(section: string): boolean {
    return this.activeLink === section;
  }

  getNavbarClasses(): string[] {
    const classes = [];
    if (this.isScrolled) {
      classes.push('scrolled');
    }
    return classes;
  }

  getMenuToggleClasses(): string[] {
    const classes = ['menu-toggle'];
    if (this.menuOpen) {
      classes.push('active');
    }
    return classes;
  }

  getMainMenuClasses(): string[] {
    const classes = ['main-menu'];
    if (this.menuOpen) {
      classes.push('open');
    }
    return classes;
  }

  // Méthode pour déboguer (à retirer en production)
  debugHeader(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('État du header:', {
        menuOpen: this.menuOpen,
        isScrolled: this.isScrolled,
        activeLink: this.activeLink,
        isMobile: this.isMobile(),
        scrollPosition: window.scrollY
      });
    }
  }
}