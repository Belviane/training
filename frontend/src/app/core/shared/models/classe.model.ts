
export interface Classe {
  id?: number;
  nom: string;
  capacite: number;
  localisation: string;
  description: string;
  formation_id: number;
  // formation?: { 
  //   id: number;
  //   nom_formation: string;
  // };

  formation?: Formation;
}

export interface Formation {
  id: number;
  nom_formation: string; // Notez le nom exact de la propriété
}