import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Formation {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: string;
  price: string;
  image: string;
  category: string;
  highlights: string[];
}


@Component({
  selector: 'app-formations',
  imports: [CommonModule],
  templateUrl: './formations.component.html',
  styleUrl: './formations.component.css'
})
export class FormationsComponent {
  selectedCategory = 'Toutes';
  
  categories = ['Toutes', 'Bureautique', 'P.A.O.', 'Web', 'Informatique'];

  formations: Formation[] = [
    {
      id: 1,
      title: 'Formation WordPress - Création de sites',
      description: 'Apprenez à créer et gérer votre site web avec WordPress, le CMS le plus populaire au monde.',
      duration: '2 jours',
      level: 'Débutant',
      price: 'Sur devis',
      image: 'assets/formations/wordpress.jpg',
      category: 'Web',
      highlights: ['Site vitrine', 'Blog', 'E-commerce']
    },
    {
      id: 2,
      title: 'Formation Photoshop - Retouche d\'images',
      description: 'Maîtrisez les techniques de retouche photo et de création graphique avec Photoshop.',
      duration: '3 jours',
      level: 'Intermédiaire',
      price: 'Sur devis',
      image: 'assets/formations/photoshop.jpg',
      category: 'P.A.O.',
      highlights: ['Retouche photo', 'Montage', 'Création graphique']
    },
    {
      id: 3,
      title: 'Formation Excel - Analyse de données',
      description: 'Exploitez pleinement Excel pour l\'analyse de données et la création de tableaux de bord.',
      duration: '2 jours',
      level: 'Avancé',
      price: 'Sur devis',
      image: 'assets/formations/excel.jpg',
      category: 'Bureautique',
      highlights: ['Tableaux croisés', 'Graphiques', 'Macros']
    },
    {
      id: 4,
      title: 'Formation Illustrator - Design vectoriel',
      description: 'Créez des illustrations et designs vectoriels professionnels avec Adobe Illustrator.',
      duration: '3 jours',
      level: 'Intermédiaire',
      price: 'Sur devis',
      image: 'assets/formations/illustrator.jpg',
      category: 'P.A.O.',
      highlights: ['Logos', 'Illustrations', 'Print']
    },
    {
      id: 5,
      title: 'Initiation Windows 11',
      description: 'Découvrez les bases de l\'informatique et maîtrisez Windows 11.',
      duration: '1 jour',
      level: 'Débutant',
      price: 'Sur devis',
      image: 'assets/formations/windows.jpg',
      category: 'Informatique',
      highlights: ['Navigation', 'Fichiers', 'Internet']
    },
    {
      id: 6,
      title: 'Formation PowerPoint - Présentations pro',
      description: 'Créez des présentations professionnelles et impactantes avec PowerPoint.',
      duration: '1 jour',
      level: 'Débutant',
      price: 'Sur devis',
      image: 'assets/formations/powerpoint.jpg',
      category: 'Bureautique',
      highlights: ['Animations', 'Templates', 'Design']
    }
  ];

  filteredFormations = [...this.formations];

  filterByCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'Toutes') {
      this.filteredFormations = [...this.formations];
    } else {
      this.filteredFormations = this.formations.filter(f => f.category === category);
    }
  }
}
