const BASE_URL = 'http://localhost:8000/api';

export const LaravelApi = {
  // === Authentification ===
  login: `${BASE_URL}/login`,
  logout: `${BASE_URL}/logout`,
  register: `${BASE_URL}/register`,
  emailverify: `${BASE_URL}/email/verify`,
  forgotpassword: `${BASE_URL}/forgot-password`,
  resetpassword: `${BASE_URL}/reset-password`,
  changePassword: `${BASE_URL}/modifier-identifiants`,
  profil: `${BASE_URL}/profil`,

  // === Utilisateurs ===
  utilisateurs: `${BASE_URL}/utilisateurs`,
  utilisateursApprenants: `${BASE_URL}/utilisateurs/apprenants`,
  rechercherUtilisateurs: `${BASE_URL}/utilisateurs/rechercher`,
  exportExcelUtilisateurs: `${BASE_URL}/export/excel`,
  exportPDFUtilisateurs: `${BASE_URL}/export/pdf`,

  // === Rôles spécifiques ===
  administrateurs: `${BASE_URL}/administrateurs`,
  superviseurs: `${BASE_URL}/superviseurs`,
  formateurs: `${BASE_URL}/formateurs`,
  apprenants: `${BASE_URL}/apprenants`,
  parents: `${BASE_URL}/parents`,
  caissiers: `${BASE_URL}/caissierss`, // Note: Il y a une faute de frappe dans votre route (caissierss)
  auditeurs: `${BASE_URL}/auditeurs`,
  vendeurs: `${BASE_URL}/vendeurs`,

  // === Formations ===
  formations: `${BASE_URL}/formations`,
  inscriptions: `${BASE_URL}/formateur/inscriptions`,

  // === Classes ===
  classes: `${BASE_URL}/classes`,
  verifierDisponibiliteClasse: (id: number) => `${BASE_URL}/classes/${id}/verifier-disponibilite`,
  capaciteRestanteClasse: (id: number) => `${BASE_URL}/classes/${id}/capacite-restante`,

  // === Séances ===
  seances: `${BASE_URL}/seances`,
  annulerSeance: (id: number) => `${BASE_URL}/seances/${id}/annuler`,
  demarrerSeance: (id: number) => `${BASE_URL}/seances/${id}/demarrer`,
  terminerSeance: (id: number) => `${BASE_URL}/seances/${id}/terminer`,
  notifierSeance: (id: number) => `${BASE_URL}/seances/${id}/notifier`,
  feuillePresence: (id: number) => `${BASE_URL}/seances/${id}/feuille-presence`,
  formateurSeance: (id: number) => `${BASE_URL}/seances/${id}/formateur`,
  classeSeance: (id: number) => `${BASE_URL}/seances/${id}/classe`,

  // === Présences ===
  presencesSeance: (seance_id: number) => `${BASE_URL}/seance/${seance_id}`,
  presencesDate: `${BASE_URL}/presence/date`,
  presencesApprenant: (apprenant_id: number) => `${BASE_URL}/apprenant/${apprenant_id}`,
  marquerPresence: `${BASE_URL}/marquer`,
  justifierAbsence: `${BASE_URL}/justifier`,
  exporterPDFPresence: (seance_id: number) => `${BASE_URL}/pdf/${seance_id}`,
  exporterCSVPresence: (seance_id: number) => `${BASE_URL}/csv/${seance_id}`,

  // === Dashboard spécifiques ===
  ADMIN_STATS: `${BASE_URL}/admin/stats`,
  SUPERVISOR_STATS: `${BASE_URL}/superviseur/stats`,
  TRAINER_CLASSES: `${BASE_URL}/formateur/classes`,
  LEARNER_DATA: `${BASE_URL}/apprenant/dashboard`,
  PARENT_DATA: `${BASE_URL}/parent/dashboard`,
  CASHIER_DATA: `${BASE_URL}/caissier/dashboard`,
  AUDITOR_DATA: `${BASE_URL}/auditeur/dashboard`,
  SELLER_DATA: `${BASE_URL}/vendeur/dashboard`,

  // === Méthodes dynamiques ===
  updateUtilisateur(id: number): string {
    return `${BASE_URL}/utilisateurs/${id}`;
  },

  activerUtilisateur(id: number): string {
    return `${BASE_URL}/utilisateurs/${id}/activer`;
  },

  desactiverUtilisateur(id: number): string {
    return `${BASE_URL}/utilisateurs/${id}/desactiver`;
  },

  showUtilisateur(id: number): string {
    return `${BASE_URL}/utilisateurs/${id}`;
  },

  showFormation(id: number): string {
    return `${BASE_URL}/formations/${id}`;
  },

  updateFormation(id: number): string {
    return `${BASE_URL}/formations/${id}`;
  },

  deleteFormation(id: number): string {
    return `${BASE_URL}/formations/${id}`;
  },

  showClasse(id: number): string {
    return `${BASE_URL}/classes/${id}`;
  },

  updateClasse(id: number): string {
    return `${BASE_URL}/classes/${id}`;
  },

  showSeance(id: number): string {
    return `${BASE_URL}/seances/${id}`;
  },

  updateSeance(id: number): string {
    return `${BASE_URL}/seances/${id}`;
  },

  inscrireApprenant(formationId: number): string {
    return `${BASE_URL}/formations/${formationId}/inscrire`;
  },

  // Export methods
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
};