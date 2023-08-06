import { Rider } from "./riders";

export class Seance {
  constructor(
    public id:number,
    public cours: number,
    public date_seance: Date,
    public heure_debut: string,
    public duree_cours: number,
    public gymnase: string,
    public libelle:string,
    public professeurs: Rider[]
  ) {}
}
