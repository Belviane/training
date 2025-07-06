export interface Evaluation {
  id: string;
  title: string;
  description: string;
  formationId: string;
  moduleId?: string;
  formateurId: string;
  type: 'TEST' | 'EVALUATION_FINALE' | 'AUTO_EVALUATION';
  dateCreation: Date;
  dateDebut: Date;
  dateFin: Date;
  duree: number; // en minutes
  noteMax: number;
  questions: Question[];
  isActive: boolean;
  allowFileUpload: boolean;
  prerequisTest?: boolean;
}

export interface Question {
  id: string;
  evaluationId: string;
  type: 'QCM' | 'OUVERTE' | 'FICHIER';
  question: string;
  points: number;
  ordre: number;
  options?: QuestionOption[];
  reponseAttendue?: string;
}

export interface QuestionOption {
  id: string;
  questionId: string;
  texte: string;
  estCorrecte: boolean;
  ordre: number;
}

export interface ReponseApprenant {
  id: string;
  evaluationId: string;
  questionId: string;
  apprenantId: string;
  reponse: string;
  fichierUrl?: string;
  points?: number;
  commentaire?: string;
  dateReponse: Date;
}

export interface ResultatEvaluation {
  id: string;
  evaluationId: string;
  apprenantId: string;
  note: number;
  noteMax: number;
  pourcentage: number;
  dateDebut: Date;
  dateFin: Date;
  dureeReelle: number; // en minutes
  statut: 'EN_COURS' | 'TERMINEE' | 'CORRIGEE';
  commentaireFormateur?: string;
  reponses: ReponseApprenant[];
}