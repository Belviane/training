import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@app/core/auth/services/auth.services'; // Votre service d'authentification
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import localeFr from '@angular/common/locales/fr'; // Importez la locale française
import { UserProfile, getRoleDisplayName, User, getRoleFromId } from '@app/core/shared/models/user.model';
import { ProfileService } from 'src/app/services/profile.service';
import { ThemeService } from 'src/app/services/theme.service';
import { MatMenuModule } from '@angular/material/menu';

// Enregistrez la locale française une fois au niveau global de l'application
registerLocaleData(localeFr, 'fr');


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  avatarFile: File | null = null;
  avatarPreviewUrl: string | null = null;


  currentDate = new Date();
  dateInterval: any; // Pour stocker l'intervalle de la date

  notificationCount: number = 0; // Exemple de notifications
  showProfileDropdown: boolean = false;
  showProfileEditModal: boolean = false;

  currentUser: User | null = null; // Informations de l'utilisateur connecté
  editableUser: UserProfile = {
    // Objet pour les modifications du formulaire
    nom: '',
    prenom: '',
    email: '',
    login: '',
    password: '',
    id: 0, // Assurez-vous que l'ID est là pour la mise à jour
  };

  @Output() toggleSidebar = new EventEmitter<void>();

  showUserMenu = false;


  isLoadingProfileUpdate: boolean = false;

  // Rendre la fonction getRoleDisplayName accessible dans le template
  getRoleDisplayName = getRoleDisplayName;

  constructor(
    public themeService: ThemeService, // Service pour gérer le thème
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private profileService: ProfileService,
  ) { }

  ngOnInit() {
    // Actualiser la date toutes les minutes si besoin
    this.dateInterval = setInterval(() => this.currentDate = new Date(), 60000);

    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    // Nettoyer l'intervalle lorsque le composant est détruit pour éviter les fuites de mémoire
    if (this.dateInterval) {
      clearInterval(this.dateInterval);
    }
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.avatarFile = input.files[0];

      // Prévisualisation de l'image sélectionnée
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.avatarFile);
    }
  }


  loadUserProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (userFromApi: User) => { // Explicitly type the user coming from API as User
        this.currentUser = { ...userFromApi, role: getRoleFromId(userFromApi.role_id) }; // Ensure 'role' is set
        // Create a copy for the edit modal, picking only UserProfile properties
        this.editableUser = {
          id: userFromApi.id, // ID is now number
          nom: userFromApi.nom,
          prenom: userFromApi.prenom,
          email: userFromApi.email,
          login: userFromApi.login,
          password: userFromApi.password !== undefined ? userFromApi.password : ''
        };
      },
      error: (err) => {
        console.error('Erreur lors du chargement du profil:', err);
        this.toastr.error('Impossible de charger le profil utilisateur.', 'Erreur');
      },
    });
  }


  toggleNotifications() {
    // Rediriger vers la page des notifications ou afficher un dropdown de notifications
    this.toastr.info('Fonctionnalité de notifications à implémenter.', 'Information');
    // this.router.navigate(['/notifications']);
    // Ou si vous avez un dropdown de notifications:
    // this.showNotificationsDropdown = !this.showNotificationsDropdown;
  }

  toggleProfileDropdown(): void {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  openProfileModal(): void {
    // S'assurer que le dropdown du profil se ferme
    this.showProfileDropdown = false;
    // Si l'utilisateur actuel est chargé, faire une copie pour l'édition
    if (this.currentUser) {
      this.editableUser = {
        ...this.currentUser,
        password: this.currentUser?.password ?? ''
      };
    }
    this.showProfileEditModal = true;
  }

  closeProfileModal(): void {
    this.showProfileEditModal = false;
    // Réinitialiser editableUser au cas où l'utilisateur annule
    if (this.currentUser) {
      this.editableUser = {
        ...this.currentUser,
        password: this.currentUser?.password ?? ''
      };
    }
  }

  updateProfile(): void {
    this.isLoadingProfileUpdate = true;
    this.profileService.updateProfile(this.editableUser).subscribe({
      next: ({ message: string }) => { // Expect UserProfile back from update
        // We only got UserProfile back, so update relevant currentUser fields
        if (this.currentUser) {
          this.currentUser.nom = this.editableUser.nom;
          this.currentUser.prenom = this.editableUser.prenom;
          this.currentUser.email = this.editableUser.email;
          this.currentUser.login = this.editableUser.login;
          this.currentUser.password = this.editableUser.password;
          // If the API returns more, you'd update those here as well.
          // Or, better, re-fetch the full user profile after a successful update:
          // this.loadUserProfile();
        }

        this.toastr.success('Profil mis à jour avec succès !', 'Succès');
        this.closeProfileModal();
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du profil:', err);
        const errorMessage = err.error?.message || 'Erreur lors de la mise à jour du profil.';
        this.toastr.error(errorMessage, 'Erreur');
      },
      complete: () => {
        this.isLoadingProfileUpdate = false;
      },
    });
  }


  logout(): void {
    this.authService.logout(); // Appelez votre méthode de déconnexion du service d'authentification
    this.router.navigate(['/login']); // Rediriger vers la page de connexion
    this.toastr.info('Vous êtes déconnecté.', 'Déconnexion');
  }

}
