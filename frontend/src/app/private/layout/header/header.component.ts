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
  user = {
    name: 'Jean Dupont',
    avatar: 'assets/avatars/jean.png' // ou null si pas d’avatar
  };
  unreadCount = 3;
  notifications = [
    { message: 'Nouvelle évaluation disponible', read: false },
    { message: 'Votre fiche d\'évaluation a été téléchargée', read: true },
    { message: 'Message du formateur', read: false }
  ];
  showNotifications = false;

  ngOnInit() {
    // Actualiser la date toutes les minutes si besoin
    setInterval(() => this.currentDate = new Date(), 60000);
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  openProfile() {
    // Rediriger vers la page profil
  }

}
