
export interface Classe {
  id?: number;
  nom: string;
  capacite: number;
  localisation: string;
  description: string;
  formation_id: number;
  formation?: { // Optionnel pour afficher les détails
    id: number;
    nom_formation: string;
  };
}