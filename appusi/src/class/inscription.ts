import { KeyValuePair } from "./keyvaluepair";
import { Niveau, Rider } from "./riders";

export class Inscription {

      public id: number = 0;
      public rider_id: number;
      public seance_id: number;
      public date_inscription: Date = new Date();
      public statut: StatutPresence = StatutPresence.Présent;


}
export enum StatutPresence {
      Présent = "présent",
      Absent = "absent",
      NonInscrit = "non inscrit",
  
}

export class InscriptionSeance {
      public id: number = 0;
      public rider_id: number;
      public seance_id: number;
      public date_inscription: Date = new Date();
      public statut: StatutPresence = StatutPresence.Présent;
      public date_seance: Date;
      public heure_debut: string;
      public duree_cours: number;
      public lieu: string;
      public libelle: string;
      public professeurs: KeyValuePair[] = [];
      public rider_libelle: string = "";
      public niveau: Niveau = Niveau.Débutant;
      public edit: boolean = false;
      public hors_liste:boolean=false;
      public contact_urgence: string = "";
      public statut_seance?: StatutPresence = null ;
}
