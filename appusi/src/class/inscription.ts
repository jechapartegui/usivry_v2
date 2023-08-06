import { Rider } from "./riders";

export class Inscription{
  
        public id:number = 0;
        public rider_id:number;
        public seance_id:number;
        public date_inscription:Date = new Date();
        public statut:StatutPresence = StatutPresence.Présent;
 

}
export enum StatutPresence {
    Présent = "présent",
    Absent = "absent",
    PrésentConfirmé = "présent confirmé",
    AbsentConfirmé = "absent confirmé",
    PrésentNonInscrit = "présent non inscrit",
  }

  export class InscriptionSeance{
        public id:number = 0;
        public rider_id:number;
        public seance_id:number;
        public date_inscription:Date = new Date();
        public statut:StatutPresence = StatutPresence.Présent;
        public date_seance: Date;
        public heure_debut: string;
        public duree_cours: number;
        public gymnase: string;
        public libelle:string;
        public professeurs: Rider[]=[];
  }
