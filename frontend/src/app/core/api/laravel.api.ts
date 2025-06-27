
const BASE_URL = 'http://localhost:8000/api';

export const LaravelApi = {
  login: `${BASE_URL}/login`,
  logout: `${BASE_URL}/logout`,
  register: `${BASE_URL}/register`,
  utilisateurs: `${BASE_URL}/utilisateurs`,
  profil: `${BASE_URL}/profil`,
  formations: ` ${BASE_URL}/formations`,
  changePassword: `${BASE_URL}/modifier-identifiants`,
  emailverify: `${BASE_URL}/email/verify`,

  updateUtilisateur(id: number): string {
    return `${BASE_URL}/utilisateurs/${id}`;
  },

  activerUtilisateur(id: number): string {
    return `${BASE_URL}/utilisateurs/${id}/activer`;
  },

  desactiverUtilisateur(id: number): string {
    return `${BASE_URL}/utilisateurs/${id}/desactiver`;
  },

  // formations(): string {
  //   return `${BASE_URL}/formations`;
  // },

  inscrireApprenant(formationId: number): string {
    return `${BASE_URL}/formations/${formationId}/inscrire`;
  }
};
