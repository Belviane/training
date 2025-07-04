/**
 * Fichier : laravel.api.ts
 * Description : Centralise toutes les routes de l'API Laravel utilisées dans l'application.
 * Usage : Importer LaravelApi pour accéder facilement aux endpoints backend.
 */

const BASE_URL = 'http://localhost:8000/api';

/**
 * Objet regroupant toutes les routes de l'API Laravel.
 * Chaque propriété correspond à une ressource ou une action spécifique.
 */
export const LaravelApi = {
  // === Authentification ===
  login: `${BASE_URL}/login`, // Connexion utilisateur
  logout: `${BASE_URL}/logout`, // Déconnexion utilisateur
  register: `${BASE_URL}/register`, // Inscription utilisateur (protégée)
  emailverify: `${BASE_URL}/email/verify`, // Vérification email
  forgotpassword: `${BASE_URL}/forgot-password`, // Mot de passe oublié
  resetpassword: `${BASE_URL}/reset-password`, // Réinitialisation du mot de passe
  changePassword: `${BASE_URL}/modifier-identifiants`, // Changement d'identifiants
  profil: `${BASE_URL}/profil`, // Récupération du profil utilisateur

  // === Utilisateurs ===
  utilisateurs: `${BASE_URL}/utilisateurs`, // Liste des utilisateurs
  utilisateursApprenants: `${BASE_URL}/utilisateurs/apprenants`, // Liste des apprenants
  rechercherUtilisateurs: `${BASE_URL}/utilisateurs/rechercher`, // Recherche d'utilisateurs
  exportExcelUtilisateurs: `${BASE_URL}/export/excel`, // Export utilisateurs Excel
  exportPDFUtilisateurs: `${BASE_URL}/export/pdf`, // Export utilisateurs PDF

  // === Rôles spécifiques ===
  administrateurs: `${BASE_URL}/administrateurs`, // Liste des administrateurs
  superviseurs: `${BASE_URL}/superviseurs`, // Liste des superviseurs
  formateurs: `${BASE_URL}/formateurs`, // Liste des formateurs
  apprenants: `${BASE_URL}/apprenants`, // Liste des apprenants
  parents: `${BASE_URL}/parents`, // Liste des parents
  caissiers: `${BASE_URL}/caissierss`, // Liste des caissiers (attention à la faute de frappe)
  auditeurs: `${BASE_URL}/auditeurs`, // Liste des auditeurs
  vendeurs: `${BASE_URL}/vendeurs`, // Liste des vendeurs

  // === Formations ===
  getFormation: (id: number) => `${BASE_URL}/formations/${id}`,
  formations: `${BASE_URL}/formations`, // Liste des formations
  mesFormations: `${BASE_URL}/mes-formations`, // Formations de l'utilisateur connecté
  assignFormateurs: (id: number) => `${BASE_URL}/formations/${id}/assign-formateurs`, // Assigner des formateurs à une formation
  exportPdfFormations: `${BASE_URL}/formations/pdf`, // Export PDF des formations
  searchFormations: `${BASE_URL}/formations/search`, // Recherche de formations
  inscriptions: `${BASE_URL}/formateur/inscriptions`, // Inscriptions d'un formateur

  // === Classes ===
  classes: `${BASE_URL}/classes`, // Liste des classes
  verifierDisponibiliteClasse: (id: number) => `${BASE_URL}/classes/${id}/verifier-disponibilite`, // Vérifier disponibilité d'une classe
  capaciteRestanteClasse: (id: number) => `${BASE_URL}/classes/${id}/capacite-restante`, // Capacité restante d'une classe

  // === Séances ===
  seances: `${BASE_URL}/seances`, // Liste des séances
  annulerSeance: (id: number) => `${BASE_URL}/seances/${id}/annuler`, // Annuler une séance
  demarrerSeance: (id: number) => `${BASE_URL}/seances/${id}/demarrer`, // Démarrer une séance
  terminerSeance: (id: number) => `${BASE_URL}/seances/${id}/terminer`, // Terminer une séance
  notifierSeance: (id: number) => `${BASE_URL}/seances/${id}/notifier`, // Notifier une séance
  feuillePresence: (id: number) => `${BASE_URL}/seances/${id}/feuille-presence`, // Feuille de présence d'une séance
  formateurSeance: (id: number) => `${BASE_URL}/seances/${id}/formateur`, // Formateur d'une séance
  classeSeance: (id: number) => `${BASE_URL}/seances/${id}/classe`, // Classe d'une séance

  // === Présences ===
  listePresenceParSeance: (seance_id: number) => `${BASE_URL}/seance/${seance_id}`, // Liste de présence par séance
  presencesParDate: `${BASE_URL}/presence/date`, // Présences par date
  listePresenceParApprenant: (apprenant_id: number) => `${BASE_URL}/apprenant/${apprenant_id}`, // Présence par apprenant
  marquerPresence: `${BASE_URL}/marquer`, // Marquer une présence
  justifierAbsence: `${BASE_URL}/justifier`, // Justifier une absence
  exporterPDFPresence: (seance_id: number) => `${BASE_URL}/pdf/${seance_id}`, // Exporter présence PDF
  exporterCSVPresence: (seance_id: number) => `${BASE_URL}/csv/${seance_id}`, // Exporter présence CSV

  // === Examens ===
  storeExamenForModule: (moduleId: number) => `${BASE_URL}/modules/${moduleId}/examens`, // Ajouter un examen à un module
  getExamensForModule: (moduleId: number) => `${BASE_URL}/modules/${moduleId}/examens`, // Lister les examens d'un module
  showExamen: (examenId: number) => `${BASE_URL}/examens/${examenId}`, // Afficher un examen
  updateExamen: (examenId: number) => `${BASE_URL}/examens/${examenId}`, // Mettre à jour un examen
  archiveExamen: (examenId: number) => `${BASE_URL}/examens/${examenId}/archive`, // Archiver un examen

  // === Tentatives ===
  startExamen: (examenId: number) => `${BASE_URL}/examens/${examenId}/start`, // Démarrer un examen
  submitTentative: (tentativeId: number) => `${BASE_URL}/tentatives/${tentativeId}/submit`, // Soumettre une tentative
  getTentativesForExamen: (examenId: number) => `${BASE_URL}/evaluations/${examenId}/tentatives`, // Lister les tentatives d'un examen
  getExamenStatistics: (examenId: number) => `${BASE_URL}/evaluations/${examenId}/statistiques`, // Statistiques d'un examen

  // === Tests ===
  checkTestAnswers: (examenId: number) => `${BASE_URL}/tests/${examenId}/check`, // Vérifier les réponses d'un test

  // === Import ===
  importExamen: (moduleId: number) => `${BASE_URL}/modules/${moduleId}/import-examen`, // Importer un examen

  // === Paiements ===
  initPaiement: `${BASE_URL}/paiements/init`, // Initialiser un paiement

  // === Dashboard spécifiques ===
  ADMIN_STATS: `${BASE_URL}/admin/stats`, // Statistiques administrateur
  SUPERVISOR_STATS: `${BASE_URL}/superviseur/stats`, // Statistiques superviseur
  TRAINER_CLASSES: `${BASE_URL}/formateur/classes`, // Classes du formateur
  LEARNER_DATA: `${BASE_URL}/apprenant/dashboard`, // Données apprenant
  PARENT_DATA: `${BASE_URL}/parent/dashboard`, // Données parent
  CASHIER_DATA: `${BASE_URL}/caissier/dashboard`, // Données caissier
  AUDITOR_DATA: `${BASE_URL}/auditeur/dashboard`, // Données auditeur
  SELLER_DATA: `${BASE_URL}/vendeur/dashboard`, // Données vendeur

  // === Méthodes dynamiques pour les ressources ===
  updateUtilisateur(id: number): string {
    return `${BASE_URL}/utilisateurs/${id}`; // Modifier un utilisateur
  },
  activerUtilisateur(id: number): string {
    return `${BASE_URL}/utilisateurs/${id}/activer`; // Activer un utilisateur
  },
  desactiverUtilisateur(id: number): string {
    return `${BASE_URL}/utilisateurs/${id}/desactiver`; // Désactiver un utilisateur
  },
  showUtilisateur(id: number): string {
    return `${BASE_URL}/utilisateurs/${id}`; // Afficher un utilisateur
  },
  showFormation(id: number): string {
    return `${BASE_URL}/formations/${id}`; // Afficher une formation
  },
  updateFormation(id: number): string {
    return `${BASE_URL}/formations/${id}`; // Modifier une formation
  },
  deleteFormation(id: number): string {
    return `${BASE_URL}/formations/${id}`; // Supprimer une formation
  },
  showClasse(id: number): string {
    return `${BASE_URL}/classes/${id}`; // Afficher une classe
  },
  updateClasse(id: number): string {
    return `${BASE_URL}/classes/${id}`; // Modifier une classe
  },
  showSeance(id: number): string {
    return `${BASE_URL}/seances/${id}`; // Afficher une séance
  },
  updateSeance(id: number): string {
    return `${BASE_URL}/seances/${id}`; // Modifier une séance
  },

  // === Inscriptions ===
  rechercheInscriptions: `${BASE_URL}/inscriptions/recherche`, // Recherche d'inscriptions
  mesInscriptions: `${BASE_URL}/mes-inscriptions`, // Inscriptions de l'utilisateur
  inscriptionsParent: `${BASE_URL}/mes-enfants/inscriptions`, // Inscriptions des enfants (parent)
  inscriptionsApprenant: `${BASE_URL}/mes-formations`, // Inscriptions de l'apprenant
  inscrireApprenant: (formationId: number) => `${BASE_URL}/formations/${formationId}/inscrire`,

  // === Exportations par rôle ===
  exportExcelAdministrateurs: `${BASE_URL}/administrateurs/export/excel`,
  exportPDFAdministrateurs: `${BASE_URL}/administrateurs/export/pdf`,
  exportExcelSuperviseurs: `${BASE_URL}/superviseurs/export/excel`,
  exportPDFSuperviseurs: `${BASE_URL}/superviseurs/export/pdf`,
  exportExcelFormateurs: `${BASE_URL}/formateurs/export/excel`,
  exportPDFFormateurs: `${BASE_URL}/formateurs/export/pdf`,
  exportExcelApprenants: `${BASE_URL}/apprenants/export/excel`,
  exportPDFApprenants: `${BASE_URL}/apprenants/export/pdf`,
  exportExcelParents: `${BASE_URL}/parents/export/excel`,
  exportPDFParents: `${BASE_URL}/parents/export/pdf`,
  exportExcelCaissiers: `${BASE_URL}/caissierss/export/excel`,
  exportPDFCaissiers: `${BASE_URL}/caissierss/export/pdf`,
  exportExcelAuditeurs: `${BASE_URL}/auditeurs/export/excel`,
  exportPDFAuditeurs: `${BASE_URL}/auditeurs/export/pdf`,
  exportExcelVendeurs: `${BASE_URL}/vendeurs/export/excel`,
  exportPDFVendeurs: `${BASE_URL}/vendeurs/export/pdf`,

  // === Profil utilisateur ===
  afficherProfil: `${BASE_URL}/profil`, // Afficher le profil
  modifierProfil: `${BASE_URL}/profil`, // Modifier le profil

  // === Mot de passe ===
  changerMotDePasse: `${BASE_URL}/utilisateurs/changer`, // Changer le mot de passe

  // === Administrateurs ===
  showAdministrateur(id: number): string {
    return `${BASE_URL}/administrateurs/${id}`; // Afficher un administrateur
  },
  updateAdministrateur(id: number): string {
    return `${BASE_URL}/administrateurs/${id}`; // Modifier un administrateur
  },

  // === Superviseurs ===
  showSuperviseur(id: number): string {
    return `${BASE_URL}/superviseurs/${id}`; // Afficher un superviseur
  },
  updateSuperviseur(id: number): string {
    return `${BASE_URL}/superviseurs/${id}`; // Modifier un superviseur
  },

  // === Formateurs ===
  showFormateur(id: number): string {
    return `${BASE_URL}/formateurs/${id}`; // Afficher un formateur
  },
  updateFormateur(id: number): string {
    return `${BASE_URL}/formateurs/${id}`; // Modifier un formateur
  },

  // === Apprenants ===
  showApprenant(id: number): string {
    return `${BASE_URL}/apprenants/${id}`; // Afficher un apprenant
  },
  updateApprenant(id: number): string {
    return `${BASE_URL}/apprenants/${id}`; // Modifier un apprenant
  },

  // === Parents ===
  showParent(id: number): string {
    return `${BASE_URL}/parents/${id}`; // Afficher un parent
  },
  updateParent(id: number): string {
    return `${BASE_URL}/parents/${id}`; // Modifier un parent
  },

  // === Caissiers ===
  showCaissier(id: number): string {
    return `${BASE_URL}/caissierss/${id}`; // Afficher un caissier
  },
  updateCaissier(id: number): string {
    return `${BASE_URL}/caissierss/${id}`; // Modifier un caissier
  },

  // === Auditeurs ===
  showAuditeur(id: number): string {
    return `${BASE_URL}/auditeurs/${id}`; // Afficher un auditeur
  },
  updateAuditeur(id: number): string {
    return `${BASE_URL}/auditeurs/${id}`; // Modifier un auditeur
  },

  // === Vendeurs ===
  showVendeur(id: number): string {
    return `${BASE_URL}/vendeurs/${id}`; // Afficher un vendeur
  },
  updateVendeur(id: number): string {
    return `${BASE_URL}/vendeurs/${id}`; // Modifier un vendeur
  },
};