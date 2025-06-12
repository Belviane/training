
const BASE_URL = 'http://localhost:8000/api';

export const LaravelApi = {
  login: `${BASE_URL}/login`,
  logout: `${BASE_URL}/logout`,
  register: `${BASE_URL}/register`,
  userinfo: `${BASE_URL}/user-info`,

  formations(): string {
    return `${BASE_URL}/formations`;
  },

  inscrireApprenant(formationId: number): string {
    return `${BASE_URL}/formations/${formationId}/inscrire`;
  }
};
