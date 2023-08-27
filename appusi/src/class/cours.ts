import { Niveau } from "./riders";

export class Cours {
  constructor(
    public id:number,
    public nom: string,
    public jour_semaine: string,
    public heure: string,
    public duree: number,
    public prof_principal_id: number,
    public prof_principal_nom: string="",
    public lieu_id: number,
    public lieu_nom: string="",
    public age_requis: number,
    public niveau_requis: Niveau
  ) {}
}
