import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit{

  currentYear: number = new Date().getFullYear();
  recentPosts = [
    {
      id: 1,
      title: 'Aidez-nous à rendre le droit accessible à tous',
      image: 'assets/images/post-1.jpg',
      date: new Date('2023-06-23'),
      comments: 3
    },
    {
      id: 2,
      title: 'Documents juridiques essentiels pour propriétaires',
      image: 'assets/images/post-2.jpg',
      date: new Date('2023-06-20'),
      comments: 3
    }
  ];

  ngOnInit() {
    this.currentYear = new Date().getFullYear();
  }

}
