import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '@app/core/auth/services/auth.services';
import { ProfileService } from 'src/app/services/profile.service';
import { ThemeService } from 'src/app/services/theme.service';

import { User, UserProfile, getRoleDisplayName, getRoleFromId } from '@app/core/shared/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  @Output() sidebarToggle = new EventEmitter<void>();

  currentUser: User | null = null;
  editableUser: UserProfile = {
    id: 0,
    nom: '',
    prenom: '',
    email: '',
    login: '',
    password: '',
  };

  avatarFile: File | null = null;
  avatarPreviewUrl: string | null = null;

  notificationCount: number = 0;
  showProfileDropdown: boolean = false;
  showProfileEditModal: boolean = false;
  isLoadingProfileUpdate: boolean = false;

  // Expose la méthode utilitaire dans le template
  getRoleDisplayName = getRoleDisplayName;

  constructor(
    public themeService: ThemeService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  // ========================
  // MÉTHODES DU TEMPLATE
  // ========================

  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  toggleNotifications(): void {
    this.toastr.info('Fonctionnalité de notifications à implémenter.', 'Information');
  }

  toggleProfileDropdown(): void {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  openProfileModal(): void {
    this.showProfileDropdown = false;

    if (this.currentUser) {
      this.editableUser = {
        ...this.currentUser,
        password: this.currentUser.password ?? '',
      };
    }

    this.showProfileEditModal = true;
  }

  closeProfileModal(): void {
    this.showProfileEditModal = false;

    if (this.currentUser) {
      this.editableUser = {
        ...this.currentUser,
        password: this.currentUser.password ?? '',
      };
    }
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      const file = input.files[0];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (file.size > maxSize) {
        this.toastr.error('Image trop grande. Maximum 2MB.', 'Erreur');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.toastr.error('Types autorisés : JPEG, PNG, GIF.', 'Erreur');
        return;
      }

      this.avatarFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfile(): void {
    this.isLoadingProfileUpdate = true;

    this.profileService.updateProfile(this.editableUser).subscribe({
      next: () => {
        if (this.currentUser) {
          Object.assign(this.currentUser, this.editableUser);
        }

        this.toastr.success('Profil mis à jour avec succès !', 'Succès');
        this.closeProfileModal();
      },
      error: (err) => {
        const msg = err.error?.message || 'Erreur lors de la mise à jour du profil.';
        this.toastr.error(msg, 'Erreur');
      },
      complete: () => {
        this.isLoadingProfileUpdate = false;
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.toastr.info('Vous êtes déconnecté.', 'Déconnexion');
  }

  // ========================
  // MÉTHODE UTILITAIRE
  // ========================

  private loadUserProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (user: User) => {
        this.currentUser = {
          ...user,
          role: getRoleFromId(user.role_id),
        };

        this.editableUser = {
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          login: user.login,
          password: user.password ?? '',
        };
      },
      error: (err) => {
        console.error('Erreur lors du chargement du profil:', err);
        this.toastr.error('Impossible de charger le profil utilisateur.', 'Erreur');
      },
    });
  }
}
