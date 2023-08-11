import { KeyValuePair } from "./keyvaluepair";
import { Niveau, Rider } from "./riders";

export class Seance {
  constructor(
    public id:number,
    public cours: number,
    public date_seance: Date,
    public heure_debut: string,
    public duree_cours: number,
    public lieu_id: number,
    public lieu: string,
    public libelle:string,
    public statut:StatutSeance=StatutSeance.prévue,
    public professeurs: KeyValuePair[],
    public age_requis:number,
    public niveau_requis:Niveau,
   
  ) {}
}

export enum StatutSeance{
  prévue='prévue', réalisée= 'réalisée', annulée ='annulée'
}
