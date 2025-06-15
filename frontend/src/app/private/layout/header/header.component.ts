import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  

  constructor() { }

  currentDate = new Date();
  

  ngOnInit() {
    // Actualiser la date toutes les minutes si besoin
    setInterval(() => this.currentDate = new Date(), 60000);
  }

  toggleNotifications() {
    // Rediriger vers la page des notifications
  }

  openProfile() {
    // Rediriger vers la page profil
  }

}
