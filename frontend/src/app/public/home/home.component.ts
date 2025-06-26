import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Program {
  title: string;
  description: string;
  features: string[];
  duration: string;
  level: string;
  icon: string;
  link: string;
}

interface Value {
  title: string;
  description: string;
  icon: string;
}

interface Statistic {
  value: number;
  displayValue: string;
  label: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  image: string;
}

interface Partner {
  name: string;
  logo: string;
}

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-home',
  imports: [
    CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  
  // Animation states
  isAnimated = false;
  cardsVisible: boolean[] = [];
  
  // Current testimonial for slider
  currentTestimonial = 0;
  testimonialInterval: any;
  
  // Programs data
  programs: Program[] = [
    {
      title: 'Formation Professionnelle',
      description: 'Développez vos compétences techniques pour exceller dans le monde professionnel',
      features: [
        'Développement web et mobile',
        'Bases de données et systèmes',
        'Cybersécurité',
        'Intelligence artificielle',
        'Gestion de projet IT'
      ],
      duration: '3-12 mois',
      level: 'Intermédiaire à Avancé',
      icon: 'fas fa-laptop-code',
      link: '/programs/professional'
    },
    {
      title: 'Formation Jeunes',
      description: 'Initiation au numérique pour les jeunes de 6 à 18 ans',
      features: [
        'Programmation Scratch et Python',
        'Robotique éducative',
        'Design graphique',
        'Création de sites web',
        'Bureautique avancée'
      ],
      duration: '1-6 mois',
      level: 'Débutant à Intermédiaire',
      icon: 'fas fa-child',
      link: '/programs/youth'
    },
    {
      title: 'Formation Seniors',
      description: 'Découverte et maîtrise des outils numériques pour les seniors',
      features: [
        'Utilisation smartphone et tablette',
        'Internet et réseaux sociaux',
        'Bureautique de base',
        'Téléconsultation et services en ligne',
        'Sécurité numérique'
      ],
      duration: '1-3 mois',
      level: 'Débutant',
      icon: 'fas fa-user-friends',
      link: '/programs/seniors'
    }
  ];

  // Company values
  values: Value[] = [
    {
      title: 'Excellence',
      description: 'Nous nous engageons à fournir une formation de qualité supérieure avec des instructeurs expérimentés',
      icon: 'fas fa-star'
    },
    {
      title: 'Accessibilité',
      description: 'Nos formations sont conçues pour être accessibles à tous, quel que soit l\'âge ou le niveau',
      icon: 'fas fa-universal-access'
    },
    {
      title: 'Innovation',
      description: 'Nous intégrons les dernières technologies et méthodes pédagogiques dans nos programmes',
      icon: 'fas fa-lightbulb'
    },
    {
      title: 'Accompagnement',
      description: 'Un suivi personnalisé tout au long de votre parcours de formation et au-delà',
      icon: 'fas fa-hands-helping'
    }
  ];

  // Bootcamp features
  bootcampFeatures: string[] = [
    'Formation intensive de 20h à 120h',
    'Groupes de 8 à 12 participants maximum',
    'Projets pratiques et concrets',
    'Certificat de participation',
    'Suivi post-formation'
  ];

  // Statistics
  statistics: Statistic[] = [
    {
      value: 50,
      displayValue: '50+',
      label: 'Étudiants formés'
    },
    {
      value: 10,
      displayValue: '10+',
      label: 'Programmes disponibles'
    },
    {
      value: 98,
      displayValue: '98%',
      label: 'Taux de satisfaction'
    },
    {
      value: 3,
      displayValue: '3+',
      label: 'Années d\'expérience'
    }
  ];

  // Testimonials
  testimonials: Testimonial[] = [
    {
      quote: 'Grâce à BE I.T AFRICA, j\'ai pu me reconvertir dans le développement web. L\'accompagnement était exceptionnel !',
      name: 'Marie Dubois',
      role: 'Développeuse Web',
      image: 'assets/temoin1.jpg'
    },
    {
      quote: 'Mon fils de 12 ans a découvert la programmation ici. Il est maintenant passionné par la création d\'applications !',
      name: 'Paul Nguema',
      role: 'Parent d\'élève',
      image: 'assets/temoin2.jpg'
    },
    {
      quote: 'À 65 ans, j\'ai appris à utiliser un smartphone et internet. Les formateurs sont très patients et pédagogues.',
      name: 'Thérèse Mbarga',
      role: 'Retraitée',
      image: 'assets/VM9.png'
    },
    {
      quote: 'La formation en cybersécurité m\'a permis d\'évoluer dans mon entreprise. Merci pour cette expertise !',
      name: 'Jean-Claude Messi',
      role: 'IT Manager',
      image: 'assets/VM10.png'
    }
  ];

  // Partners
  partners: Partner[] = [
    {
      name: 'Google',
      logo: 'assets/partner2.png'
    },
    {
      name: 'IBM',
      logo: 'assets/partner3.png'
    },
    {
      name: 'Oracle',
      logo: 'assets/partner1.png'
    }
  ];

  // FAQ
  faqs: FAQ[] = [
    {
      question: 'Quels sont les prérequis pour s\'inscrire ?',
      answer: 'Les prérequis varient selon le programme choisi. Pour la formation jeunes, aucun prérequis n\'est nécessaire. Pour la formation professionnelle, des bases en informatique sont recommandées. Pour les seniors, seule la motivation est requise !',
      isOpen: false
    },
    {
      question: 'Les formations sont-elles certifiantes ?',
      answer: 'Oui, toutes nos formations délivrent un certificat de participation. Certains programmes proposent également des certifications reconnues par nos partenaires technologiques.',
      isOpen: false
    },
    {
      question: 'Proposez-vous des formations à distance ?',
      answer: 'Nous proposons des formations en présentiel et à distance selon les programmes. Nos formations hybrides combinent le meilleur des deux approches.',
      isOpen: false
    },
    {
      question: 'Quels sont les tarifs des formations ?',
      answer: 'Nos tarifs varient selon la durée et le type de formation. Nous proposons des facilités de paiement et des bourses pour les étudiants méritants. Contactez-nous pour un devis personnalisé.',
      isOpen: false
    },
    {
      question: 'Y a-t-il un suivi après la formation ?',
      answer: 'Oui, nous assurons un suivi post-formation de 3 mois minimum. Nous aidons également nos anciens étudiants dans leur recherche d\'emploi ou de stage.',
      isOpen: false
    },
    {
      question: 'Où se déroulent les formations ?',
      answer: 'Nos formations se déroulent dans nos locaux modernes à Yaoundé, équipés des dernières technologies. Nous proposons également des formations en entreprise sur demande.',
      isOpen: false
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize animations
    setTimeout(() => {
      this.isAnimated = true;
    }, 300);

    // Initialize card visibility
    this.cardsVisible = new Array(this.programs.length).fill(false);
    this.animateCards();

    // Start testimonial slider
    this.startTestimonialSlider();

    // Animate statistics on scroll
    this.animateStatistics();
  }

  ngOnDestroy(): void {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    this.animateOnScroll();
  }

  // Animate cards on load
  private animateCards(): void {
    this.programs.forEach((_, index) => {
      setTimeout(() => {
        this.cardsVisible[index] = true;
      }, index * 200);
    });
  }

  // Handle card hover effects
  onCardHover(index: number): void {
    // Add any hover-specific logic here
    console.log(`Card ${index} hovered`);
  }

  onCardLeave(index: number): void {
    // Add any hover leave logic here
    console.log(`Card ${index} left`);
  }

  // Testimonial slider methods
  private startTestimonialSlider(): void {
    this.testimonialInterval = setInterval(() => {
      this.nextTestimonial();
    }, 5000);
  }

  nextTestimonial(): void {
    this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
  }

  setCurrentTestimonial(index: number): void {
    this.currentTestimonial = index;
    // Reset interval
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
      this.startTestimonialSlider();
    }
  }

  // FAQ methods
  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  // Scroll to section
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // Animate elements on scroll
  private animateOnScroll(): void {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const windowHeight = window.innerHeight;

    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('animated');
      }
    });
  }

  // Animate statistics counter
  private animateStatistics(): void {
    setTimeout(() => {
      this.statistics.forEach((stat, index) => {
        this.animateCounter(stat, index);
      });
    }, 1000);
  }

  private animateCounter(stat: Statistic, index: number): void {
    const element = document.querySelector(`[data-target="${stat.value}"]`);
    if (!element) return;

    const target = stat.value;
    const increment = target / 100;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      
      if (stat.label.includes('%')) {
        element.textContent = Math.floor(current) + '%';
      } else if (stat.label.includes('+')) {
        element.textContent = Math.floor(current) + '+';
      } else {
        element.textContent = Math.floor(current).toString();
      }
    }, 20);
  }

  // Navigation methods
  navigateToContact(): void {
    this.router.navigate(['/contact']);
  }

  navigateToPrograms(): void {
    this.router.navigate(['/programs']);
  }

  // Utility methods
  trackByIndex(index: number, item: any): number {
    return index;
  }
}