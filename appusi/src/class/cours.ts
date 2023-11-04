import { Groupe, Lien_Groupe } from "./groupe";

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
  public saison_id: number = 0;
  public place_maximum: number = -1;
  public groupes: Groupe[] = [];
  public convocation_nominative :boolean=false;
  constructor() { }
  ToLienGroupe() : Lien_Groupe{
    let LG = new Lien_Groupe();
    LG.objet_id = this.id;
    LG.objet_type = 'cours';
    LG.groupes = this.groupes.map( x => x.id);
    return LG;
  }

}
