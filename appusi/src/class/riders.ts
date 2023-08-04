export class Rider {
    constructor(
      public id:number=0,
      public nom: string,
      public prenom: string,
      public date_naissance: Date,
      public sexe: boolean,
      public niveau: Niveau = Niveau.Débutant,
      public adresse: string,
      public mot_de_passe: string = 'ivry',
      public telephone:string,
      public personne_prevenir:string ="",
      public telephone_personne_prevenir:string ="",
      public email: string,
      public compte:number = 0,
      public essai_restant: number = 0,
      public est_prof: boolean =false,
      public est_admin: boolean =false
    ) {}
  }

 export enum Niveau {
    Débutant = "débutant",
    Intermédiaire = "intermédiaire",
    Avancé = "avancé",
  }
  