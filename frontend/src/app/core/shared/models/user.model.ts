export enum UserRole {
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  TRAINER = 'trainer',
  LEARNER = 'learner',
  PARENT = 'parent',
  CASHIER = 'cashier',
  AUDITOR = 'auditor'
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date; 
}

export function getUserRoleName(role: UserRole): string {
  const roleNames = {
    [UserRole.ADMIN]: 'Administrateur',
    [UserRole.SUPERVISOR]: 'Superviseur',
    [UserRole.TRAINER]: 'Formateur',
    [UserRole.LEARNER]: 'Apprenant',
    [UserRole.PARENT]: 'Parent',
    [UserRole.CASHIER]: 'Caissier',
    [UserRole.AUDITOR]: 'Auditeur'
  };
  return roleNames[role] || role;
}

export function getUserRoles(): { value: UserRole; label: string }[] {
  return Object.values(UserRole).map(role => ({
    value: role,
    label: getUserRoleName(role)
  }));
}

// Fonctions utilitaires pour vérifier les rôles
export function hasRole(user: User, role: UserRole): boolean {
  return user.role === role;
}

export function hasAnyRole(user: User, roles: UserRole[]): boolean {
  return roles.includes(user.role);
}