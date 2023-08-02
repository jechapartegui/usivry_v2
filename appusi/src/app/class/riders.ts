export class Rider {
    constructor(
      public id:number,
      public nom: string,
      public prenom: string,
      public dateNaissance: Date,
      public sexe: string,
      public niveau: string,
      public motDePasse: string = 'ivry',
      public email: string,
      public essaiRestant: number = 0,
      public estProf: boolean,
      public estAdmin: boolean
    ) {}
  }
  