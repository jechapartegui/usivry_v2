import { Rider } from "./riders";

export class Seance {
  constructor(
    public cours: number,
    public dateSeance: Date,
    public heureDebut: string,
    public dureeCours: number,
    public gymnase: string,
    public professeurs: Rider[]
  ) {}
}
