import { KeyValuePair } from "./keyvaluepair";
import { Niveau, Rider } from "./riders";

export class Seance {
    public seance_id:number =0;
    public cours: number = 0;
    public date_seance: Date = new Date();
    public heure_debut: string = "";
    public duree_cours: number = 0;
    public lieu_id: number= 0;
    public lieu: string;
    public libelle:string;
    public statut:StatutSeance=StatutSeance.prévue;
    public professeurs: KeyValuePair[]= [];
    public age_requis:number =0 ;
    public age_maximum:number =99 ;
    public niveau_requis: Niveau[] = [];
    public place_maximum:number =null;
    public essai_possible:boolean=false;
    public notes:string="";
    public info_seance:string="";
  constructor() {
    
  }
}

export enum StatutSeance{
  prévue='prévue', réalisée= 'réalisée', annulée ='annulée'
}
