export interface Seance {
  id?: number;
  titre: string;
  description?: string;
  date: string; // Format: YYYY-MM-DD
  heure_debut: string; // Format: HH:MM
  heure_fin: string; // Format: HH:MM
  formateur_id: number;
  formation_id: number;
  classe_id: number;
  type_seance: 'Théorie' | 'Pratique';
  statut: 'Planifiée' | 'Confirmée' | 'En cours' | 'Terminée' | 'Annulée';
  created_at?: string;
  updated_at?: string;
  
  // Relations optionnelles
  formateur?: {
    id: number;
    nom: string;
    prenom: string;
  };
  formation?: {
    id: number;
    nom: string;
  };
  classe?: {
    id: number;
    nom: string;
  };
}