import { Inscription, InscriptionSeance } from "./inscription";
import { Seance } from "./seance";

export class Rider {
  constructor() {
    
  }
   
      public id:number=0;
      public nom: string;
      public prenom: string;
      public date_naissance: Date;
      public sexe: boolean;
      public niveau: Niveau = Niveau.Débutant;
      public adresse: string;
      public mot_de_passe: string = 'ivry';
      public telephone:string;
      public personne_prevenir:string ="";
      public telephone_personne_prevenir:string ="";
      public email: string;
      public compte:number = 0;
      public est_prof: boolean =false;
      public est_admin: boolean =false;
      public est_inscrit:boolean=true;
      public inscriptions: InscriptionSeance[]=[];
      public seances: Seance[]=[];
      public seances_prof: Seance[]=[];

  }

 export enum Niveau {
    Débutant = "débutant",
    Intermédiaire = "intermédiaire",
    Avancé = "avancé",
  }
  