import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/services/auth.services';
import { User, UserRole } from '@app/core/shared/models/user.model';


@Component({
  selector: 'app-content',
  imports: [CommonModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit {
  currentUser: User | null = null;
  accounts: any[] = [];
  contents: any[] = [];
  stats: any = {};

  // Expose UserRole enum to template
  UserRole = UserRole;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;

    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      this.loadContentBasedOnRole();
    });
  }

  loadContentBasedOnRole() {
    if (!this.currentUser) return;

    switch (this.currentUser.role) {
      case UserRole.ADMIN:
        // Charger le contenu admin
        break;
      case UserRole.LEARNER:
        // Charger le contenu apprenant
        break;
      // etc.
    }
  }

  editAccount(account: any) {
    // Implémentez la logique d'édition
  }

  viewContent(content: any) {
    // Implémentez la logique de visualisation
  }

  editContent(content: any) {
    // Implémentez la logique d'édition
  }
}