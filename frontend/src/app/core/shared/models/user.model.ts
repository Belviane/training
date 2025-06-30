  export enum UserRole {
    ADMINISTRATEUR = 'administrateur', // Correction de la faute de frappe (admininstrateur -> administrateur)
    SUPERVISEUR = 'superviseur',
    FORMATEUR = 'formateur',
    APPRENANT = 'apprenant',
    PARENT = 'parent',
    CAISSIER = 'caissier',
    AUDITEUR = 'auditeur',
    VENDEUR = 'vendeur' // Ajout du rôle vendeur
  }

  // Correspondance entre role_id et UserRole
  export const ROLE_ID_MAPPING: Record<number, UserRole> = {
    1: UserRole.ADMINISTRATEUR,
    2: UserRole.SUPERVISEUR,
    3: UserRole.FORMATEUR,
    4: UserRole.APPRENANT,
    5: UserRole.PARENT,
    6: UserRole.CAISSIER,
    7: UserRole.AUDITEUR,
    8: UserRole.VENDEUR
  };

  export interface User {
    id: number;
    nom: string;
    prenom: string;
    login: string;
    password?: string; // Rendre optionnel pour plus de sécurité
    role_id: number;
    email: string;
    genre: string;
    date_naissance: Date | string; // Permettre les deux types
    createdAt?: Date;
    updatedAt?: Date;
    doit_changer_mot_de_passe?: boolean;

    // Propriété calculée pour accéder plus facilement au rôle
    role: UserRole; // Déclaration de la propriété (l'implémentation sera dans la classe si nécessaire)
  }

  export interface UserProfile {
    id: number; // ID de l'utilisateur
    nom: string;
    prenom: string;
    email: string;  
    login: string,
    password: string,
  }

  export interface AuthResponse {
      token: string;
      access_token?: string; // Selon ce que renvoie votre backend
      user: User;
      changer_password?: boolean;
      message?: string;
  }

  export interface LoginRequest {
    login: string;
    password: string;
  }

  export interface RegisterRequest {
    nom: string;
    email: string;
    password: string;
    password_confirmation: string;
    // Ajouter d'autres champs nécessaires à l'inscription
    prenom?: string;
    genre?: string;
    date_naissance?: Date | string;
    role_id?: number;
  }

  // Libellés complets des rôles
  export const ROLE_LABELS: Record<UserRole, string> = {
    [UserRole.ADMINISTRATEUR]: 'Administrateur',
    [UserRole.SUPERVISEUR]: 'Superviseur',
    [UserRole.FORMATEUR]: 'Formateur',
    [UserRole.APPRENANT]: 'Apprenant',
    [UserRole.PARENT]: 'Parent',
    [UserRole.CAISSIER]: 'Caissier',
    [UserRole.AUDITEUR]: 'Auditeur',
    [UserRole.VENDEUR]: 'Vendeur' // Ajout du libellé pour le rôle vendeur
  };

  export function getUserRoleName(role: UserRole): string {
    return ROLE_LABELS[role] || role;
  }

  // Version alternative qui accepte soit UserRole soit string
  export function getRoleDisplayName(role: UserRole | string): string {
    return ROLE_LABELS[role as UserRole] || role;
  }

  export function getUserRoles(): { id: number; value: UserRole; label: string }[] {
    return Object.entries(ROLE_ID_MAPPING).map(([id, value]) => ({
      id: Number(id),
      value,
      label: getUserRoleName(value)
    }));
  }

  // Fonctions utilitaires améliorées
  export function hasRole(user: User, role: UserRole): boolean {
    return ROLE_ID_MAPPING[user.role_id] === role;
  }

  export function hasAnyRole(user: User, roles: UserRole[]): boolean {
    const userRole = ROLE_ID_MAPPING[user.role_id];
    return roles.includes(userRole);
  }

  // Fonction pour obtenir le UserRole à partir du role_id
  export function getRoleFromId(roleId: number): UserRole {
    return ROLE_ID_MAPPING[roleId] || UserRole.APPRENANT;
  }

  // Classe User si vous souhaitez implémenter des méthodes
  export class UserModel implements User {
    // Implémentation des propriétés de l'interface
    id: number = 0;
    nom: string = '';
    prenom: string = '';
    login: string = '';
    role_id: number = 0;
    email: string = '';
    genre: string = '';
    date_naissance: Date | string = new Date();
    
    get role(): UserRole {
      return getRoleFromId(this.role_id);
    }

    // Méthodes pratiques
    isAdministrateur(): boolean {
      return this.role_id === 1;
    }

    isFormateur(): boolean {
      return this.role_id === 3;
    }

    isSuperviseur(): boolean {
      return this.role_id === 2;
    }

    isParent(): boolean {
      return this.role_id === 5;
    }

    isApprenant(): boolean {
      return this.role_id === 4;
    }

    isCaissier(): boolean {
      return this.role_id === 6;
    }

    isAuditeur(): boolean {
      return this.role_id === 7;
    }

    isVendeur(): boolean {
      return this.role_id === 8;
    }

    // ... autres méthodes spécifiques aux rôles
  }