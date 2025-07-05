export interface Examen {
  id: number;
  module_id: number;
  titre: string;
  description: string;
  duree: number; // en minutes
  date_ouverture: string;
  date_fermeture: string;
  est_archive: boolean;
  questions: Question[];
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: number;
  examen_id: number;
  enonce: string;
  type: 'choix_multiple' | 'texte_libre' | 'vrai_faux';
  points: number;
  options?: string[]; // Pour les questions à choix multiple
  reponse_correcte?: string | string[]; // Selon le type de question
}

export interface Tentative {
  id: number;
  examen_id: number;
  utilisateur_id: number;
  date_debut: string;
  date_fin?: string;
  score?: number;
  statut: 'en_cours' | 'termine' | 'corrige';
  reponses: Reponse[];
}

export interface Reponse {
  question_id: number;
  reponse: string | string[];
  est_correcte?: boolean;
  points_obtenus?: number;
}

export interface StatistiquesExamen {
  moyenne: number;
  mediane: number;
  meilleur_score: number;
  pire_score: number;
  taux_reussite: number;
  nombre_tentatives: number;
  repartition_scores: { score: number; count: number }[];
}