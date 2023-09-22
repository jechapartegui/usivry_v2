import { Niveau } from "./riders";

export class Cours {

  public id: number = 0;
  public nom: string = "";
  public jour_semaine: string = "dimanche";
  public heure: string = "";
  public duree: number = 0;
  public prof_principal_id: number = 0;
  public prof_principal_nom: string = "";
  public lieu_id: number = 0;
  public lieu_nom: string = "";
  public age_requis: number = 0;
  public age_maximum: number = 99;
  public niveau_requis: Niveau[] = [];
  public saison_id: number = 0;
  public place_maximum: number = null;
  constructor() { }
}
