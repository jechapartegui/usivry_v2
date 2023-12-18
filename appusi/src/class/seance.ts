import { Subject } from "rxjs";
import { Groupe, Lien_Groupe } from "./groupe";
import { KeyValuePair } from "./keyvaluepair";

export class Seance {
    public seance_id:number =0;
    public cours: number = 0;
    public date_seance: Date = new Date();
    public heure_debut: string = "";
    public duree_seance: number = 0;
    public lieu_id: number= 0;
    public lieu: string;
    public libelle:string;
    public statut:StatutSeance=StatutSeance.prévue;
    public professeurs: KeyValuePair[]= [];
    public age_requis:number =0 ;
    public age_maximum:number =99 ;
    public groupes: Groupe[] = [];
    public place_maximum:number =-1;
    public essai_possible:boolean=false;
    public convocation_nominative:boolean=false;
    public notes:string="";
    public info_seance:string="";
  constructor() {
    
  }
  ToLienGroupe() : Lien_Groupe{
    let LG = new Lien_Groupe();
    LG.objet_id = this.seance_id;
    LG.objet_type = 'cours';
    LG.groupes = this.groupes.map( x => x.id);
    return LG;
  }
}
class GroupeData {
  constructor(public groupes: Groupe[], public flag: boolean) {}
}


export class Seance_VM{

  constructor(seance_:Seance){
    this.seance_id = seance_.seance_id;
    this.age_maximum = seance_.age_maximum;
    this.age_requis = seance_.age_requis;
    this.convocation_nominative = seance_.convocation_nominative;
    this.cours = seance_.cours;
    this.date_seance = seance_.date_seance;
    this.duree_seance = seance_.duree_seance;
    this.essai_possible = seance_.essai_possible;
    this.groupes = seance_.groupes;
    this.heure_debut = seance_.heure_debut;
    this.info_seance = seance_.info_seance;
    this.libelle = seance_.libelle;
    this.lieu_id = seance_.lieu_id;
    this.lieu = seance_.lieu;
    this.notes = seance_.notes;
    this.place_maximum =seance_.place_maximum;
    this.professeurs = seance_.professeurs;
    this.statut = seance_.statut;
    this.valid = new ValidationSeance(this);
    this.valid.controler();
  }

  ToSeance():Seance{
    let s:Seance = new Seance();
    s.seance_id = this.seance_id;
    s.age_maximum = this.age_maximum;
    s.age_requis = this.age_requis;
    s.convocation_nominative = this.convocation_nominative;
    s.cours = this.cours;
    s.date_seance = this.date_seance;
    s.duree_seance = this.duree_seance;
    s.essai_possible = this.essai_possible;
    s.groupes = this.groupes;
    s.heure_debut = this.heure_debut;
    s.info_seance = this.info_seance;
    s.libelle = this.info_seance;
    s.lieu_id = this.lieu_id;
    s.lieu = this.lieu;
    s.notes = this.notes;
    s.place_maximum =this.place_maximum;
    s.professeurs = this.professeurs;
    s.statut = this.statut;
    return s;
  }

  public editing: boolean = false;
  public valid: ValidationSeance;
  // Utilisez des sujets pour chaque propriété
  libelleSubject = new Subject<string>();
  heureSubject = new Subject<string>();
  dureeSubject = new Subject<number>();
  dateSubject = new Subject<Date>();
  groupeSubject = new Subject<GroupeData>();
  profSubject = new Subject<KeyValuePair[]>();
  lieuSubject = new Subject<number>();

  private _libelle: string;
  private _date_seance: Date;
  private _heure_debut: string;
  private _duree_cours: number ;
  private _lieu_id: number;
  private _lieu: string;
  private _groupes: Groupe[];
  private _professeurs: KeyValuePair[]
  private _convocation_nominative:boolean;
  // Propriété nom avec get et set
  get libelle(): string {
    return this._libelle;
  }
  set libelle(value: string) {
    this._libelle = value;
    this.libelleSubject.next(value);
  }
  get date_seance(): Date {
    return this._date_seance;
  }
  set date_seance(value: Date) {
    this._date_seance = value;
    this.dateSubject.next(value);
  }
  get heure_debut(): string {
    return this._heure_debut;
  }
  set heure_debut(value: string) {
    this._heure_debut = value;
    this.heureSubject.next(value);
  }
  get duree_seance(): number {
    return this._duree_cours;
  }
  set duree_seance(value: number) {
    this._duree_cours = value;
    this.dureeSubject.next(value);
  }

  get lieu_id(): number {
    return this._lieu_id;
  }
  set lieu_id(value: number) {
    this._lieu_id = value;
    this.lieuSubject.next(value);
  }
  get groupes(): Groupe[] {
    return this._groupes;
  }
  set groupes(value: Groupe[]) {
    this._groupes = value;
    this.groupeSubject.next(new GroupeData(value, this.convocation_nominative));
  }
  get convocation_nominative(): boolean {
    return this._convocation_nominative;
  }
  set convocation_nominative(value: boolean) {
    this._convocation_nominative = value;
    this.groupeSubject.next(new GroupeData(this.groupes,value));
  }
  get professeurs(): KeyValuePair[] {
    return this._professeurs;
  }
  set professeurs(value:  KeyValuePair[] ) {
    this._professeurs = value;
    this.profSubject.next(value);
  }

  public seance_id:number;
    public cours: number;
    public statut:StatutSeance=StatutSeance.prévue;
    public age_requis:number;
    public age_maximum:number;
    public place_maximum:number;
    public essai_possible:boolean;
    public notes:string;
    public lieu:string;
    public info_seance:string;
}

export class ValidationSeance {
  public control: boolean;
  public libelle: boolean;
  public date: boolean;
  public heure: boolean;
  public duree: boolean;
  public lieu: boolean;
  public groupe: boolean;
  public prof: boolean;

  constructor(private seance: Seance_VM) {

    this.seance.libelleSubject.subscribe((value) => this.validateLibelle(value));
    this.seance.dateSubject.subscribe((value) => this.validateDate(value));
    this.seance.heureSubject.subscribe((value) => this.validateHeure(value));
    this.seance.dureeSubject.subscribe((value) => this.validateDuree(value));
    this.seance.lieuSubject.subscribe((value) => this.validateLieu(value));
    this.seance.groupeSubject.subscribe((data: GroupeData) => this.validateGroupe(data.groupes, data.flag));
    this.seance.profSubject.subscribe((value) => this.validateProf(value));
    
  }

  controler() {
    this.control = true;
    // Appeler les méthodes de validation pour tous les champs lors de la première validation
    this.validateLibelle(this.seance.libelle);
    this.validateDate(this.seance.date_seance);
    this.validateHeure(this.seance.heure_debut);
    this.validateDuree(this.seance.duree_seance);
    this.validateLieu(this.seance.lieu_id);
    this.validateGroupe(this.seance.groupes, this.seance.convocation_nominative);
    this.validateProf(this.seance.professeurs);
    
  }

  private validateLibelle(value: string) {
    // Code de validation du nom
    // Mettre à jour this.nom en conséquence
    if (value) {
      if (value.length < 6) {
        this.libelle = false;
        this.control = false;
      } else {
        this.libelle = true;
        this.checkcontrolvalue();
      }
    } else {
      this.libelle = false;
      this.control = false;
    }
  }

  private validateDate(value: Date) {
    // Code de validation de la date de naissance
    // Mettre à jour this.date_naissance en conséquence
    if (value) {
      if (value > new Date()) {
        this.date = false;
        this.control = false;
      } else {
        this.date = true;
        this.checkcontrolvalue();
      }
    } else {
      this.date = false;
      this.control = false;
    }
  }

  private validateHeure(value: string) {
    // Code de validation du nom
    // Mettre à jour this.nom en conséquence
    if (value) {
      if (value.length < 3 || value.length>10) {
        this.heure = false;
        this.control = false;
      } else {
        this.heure = true;
        this.checkcontrolvalue();
      }
    } else {
      this.heure = false;
      this.control = false;
    }
  }

  private validateDuree(value: number) {
    // Code de validation du nom
    // Mettre à jour this.nom en conséquence
    if (value) {
      if (value < 1 || value > 2880) {
        this.duree = false;
        this.control = false;
      } else {
        this.duree = true;
        this.checkcontrolvalue();
      }
    } else {
      this.duree = false;
      this.control = false;
    }
  }

  private validateLieu(value: number) {
    // Code de validation du nom
    // Mettre à jour this.nom en conséquence
    if (value) {
      if (value < 1) {
        this.lieu = false;
        this.control = false;
      } else {
        this.lieu = true;
        this.checkcontrolvalue();
      }
    } else {
      this.lieu = false;
      this.control = false;
    }
  }

  private validateGroupe(value: Groupe[], value2:boolean) {
    // Code de validation du nom
    // Mettre à jour this.nom en conséquence
    if(!value2){
      if (value) {
        if (value.length < 1) {
          this.groupe = false;
          this.control = false;
        } else {
          this.groupe = true;
          this.checkcontrolvalue();
        }
      } else {
        this.groupe = false;
        this.control = false;
      }
    }   
  }

  private validateProf(value: KeyValuePair[]) {
    // Code de validation du nom
    // Mettre à jour this.nom en conséquence
    if (value) {
      if (value.length < 1) {
        this.prof = false;
        this.control = false;
      } else {
        this.prof = true;
        this.checkcontrolvalue();
      }
    } else {
      this.prof = false;
      this.control = false;
    }
  }

  
  checkcontrolvalue() {
      if (this.libelle && this.date && this.heure && this.duree && this.lieu && this.groupe && this.prof) {
        this.control = true;
      }  
  }
}

export enum StatutSeance{
  prévue='prévue', réalisée= 'réalisée', annulée ='annulée'
}
