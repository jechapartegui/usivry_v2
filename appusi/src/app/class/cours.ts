
export class Cours {
  constructor(
    public nom: string,
    public jourSemaine: string,
    public heure: string,
    public duree: number,
    public professeurPrincipal: number,
    public gymnaseReference: number,
    public ageRequis: number,
    public niveauRequis: string[]
  ) {}
}
