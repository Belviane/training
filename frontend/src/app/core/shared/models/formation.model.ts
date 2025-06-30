// export interface Formation {
//   id: number;
//   nom_formation: string;
//   libelle_formation: string;
//   date_debutf: string;
//   date_finf: string;
//   nombre_seancef: number;
// }


export interface Formation {
  nom_formation: string;
  libelle_formation: string;
  date_debutf: string;
  date_finf: string;
  nombre_seancef: number;
  volume_horaire: number;
  certifiante: boolean;
  prix_certification: number;
  prix: number;
  statut: 'brouillon' | 'active' | 'terminee' | 'suspendue';
  objectif: string;
}

export interface FormationFormData extends Omit<Formation, 'nombre_seancef' | 'volume_horaire' | 'prix_certification' | 'prix'> {
  nombre_seancef: string;
  volume_horaire: string;
  prix_certification: string;
  prix: string;
}

export interface FormErrors {
  nom_formation?: string;
  libelle_formation?: string;
  date_debutf?: string;
  date_finf?: string;
  nombre_seancef?: string;
  volume_horaire?: string;
  prix_certification?: string;
  prix?: string;
  objectif?: string;
}

export type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';