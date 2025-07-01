// formation.model.ts
export interface Lecon {
  id?: number;
  titre: string;
  contenu: string;
  duree_estimee: number;
  ordre: number;
}

export interface Module {
  id?: number;
  nom: string;
  description?: string;
  lecons?: Lecon[];
}

export interface Formation {
  id?: number;
  nom_formation: string;
  libelle_formation: string;
  date_debutf: string;
  date_finf: string;
  nombre_seancef: number;
  volume_horaire: number;
  certifiante: boolean;
  prix_certification: string;
  prix: string;
  statut: string;
  objectif: string;
  created_at?: string;
  updated_at?: string;
  modules?: Module[];
}

export interface ApiFormationResponse {
  current_page: number;
  data: Formation[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';