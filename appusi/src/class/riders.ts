import { Groupe, Lien_Groupe } from "./groupe";
import { Inscription, InscriptionSeance } from "./inscription";
import { Seance } from "./seance";
import { Subject } from 'rxjs';

export class Rider {
  public ToLienGroupe(): Lien_Groupe {
    let LG = new Lien_Groupe();
    LG.objet_id = this.id;
    LG.objet_type = 'rider';
    LG.groupes = [];
    LG.groupes = this.groupes.map(x => x.id);
    return LG;
  }
  public id: number = 0;
  public prenom: string = "";
  public nom: string = "";
  public telephone: string = "";
  public email: string = "";
  public date_naissance: Date = new Date()
  public sexe: boolean = false;
  public groupes: Groupe[] = [];
  public adresse: string;
  public mot_de_passe: string = 'ivry';
  public personne_prevenir: string = "";
  public telephone_personne_prevenir: string = "";
  public compte: number = 0;
  public est_prof: boolean = false;
  public est_admin: boolean = false;
  public est_inscrit: boolean = true;
  public inscriptions: InscriptionSeance[] = [];
  public seances: Seance[] = [];
  public seances_prof: Seance[] = [];


}

export class Rider_VM {
  public id: number = 0;
  public editing: boolean = false;
  public valid: ValidationRider;
  // Utilisez des sujets pour chaque propriété
  nomSubject = new Subject<string>();
  prenomSubject = new Subject<string>();
  dateNaissanceSubject = new Subject<Date>();
  telephoneSubject = new Subject<string>();
  emailSubject = new Subject<string>();

  private _nom: string;
  private _prenom: string;
  private _date_naissance: Date;
  private _telephone: string;
  private _email: string;
  // Propriété nom avec get et set
  get nom(): string {
    return this._nom;
  }
  set nom(value: string) {
    this._nom = value;
    this.nomSubject.next(value);
  }

  // Propriété prenom avec get et set
  get prenom(): string {
    return this._prenom;
  }
  set prenom(value: string) {
    this._prenom = value;
    this.prenomSubject.next(value);
  }

  // Propriété date_naissance avec get et set
  get date_naissance(): Date {
    return this._date_naissance;
  }
  set date_naissance(value: Date) {
    this._date_naissance = value;
    this.dateNaissanceSubject.next(value);
  }

  // Propriété telephone avec get et set
  get telephone(): string {
    return this._telephone;
  }
  set telephone(value: string) {
    this._telephone = value;
    this.telephoneSubject.next(value);
  }

  // Propriété email avec get et set
  get email(): string {
    return this._email;
  }
  set email(value: string) {
    this._email = value;
    this.emailSubject.next(value);
  }

  public sexe: boolean;
  public groupes: Groupe[] = [];
  public adresse: string;
  public mot_de_passe: string = 'ivry';
  public personne_prevenir: string = "";
  public telephone_personne_prevenir: string = "";
  public compte: number = 0;
  public est_prof: boolean = false;
  public est_admin: boolean = false;
  public est_inscrit: boolean = true;
  public inscriptions: InscriptionSeance[] = [];
  public seances: Seance[] = [];
  public seances_prof: Seance[] = [];
  constructor(L: Rider) {
    this.id = L.id;
    if (this.id == 0) {
      this.editing = true;
    } else {
      this.editing = false;
    }
    this.adresse = L.adresse;
    this.nom = L.nom;
    this.prenom = L.prenom;
    this.compte = L.compte;
    this.email = L.email;
    this.sexe = L.sexe;
    this.telephone = L.telephone;
    this.date_naissance = L.date_naissance;
    this.personne_prevenir = L.personne_prevenir;
    this.telephone_personne_prevenir = L.telephone_personne_prevenir;
    this.groupes = L.groupes;
    this.est_prof = L.est_prof;
    this.est_admin = L.est_admin;
    this.inscriptions = L.inscriptions;
    this.est_inscrit = L.est_inscrit;
    this.seances_prof = L.seances_prof;
    this.seances = L.seances;
    this.valid = new ValidationRider(this, false);
    this.valid.controler();
  }

  ToRider() :Rider{
    let R = new Rider();
    R.id = this.id;   
    R.adresse = this.adresse;
    R.nom = this.nom;
    R.prenom = this.prenom;
    R.compte = this.compte;
    R.email = this.email;
    R.personne_prevenir = this.personne_prevenir;
    R.telephone_personne_prevenir = this.telephone_personne_prevenir;
    R.groupes = this.groupes;
    R.est_prof = this.est_prof;
    R.est_admin = this.est_admin;
    R.sexe = this.sexe;
    R.telephone = this.telephone;
    R.date_naissance = this.date_naissance;
    R.inscriptions = this.inscriptions;
    R.est_inscrit = this.est_inscrit;
    R.seances_prof = this.seances_prof;
    R.seances = this.seances;
    return R;
  }
}

export class ValidationRider {
  public control: boolean;
  public nom: boolean;
  public prenom: boolean;
  public date_naissance: boolean;
  public telephone: boolean;
  public email: boolean;
  public check_compte: boolean;

  constructor(private rider: Rider_VM, compte: boolean) {

    this.rider.nomSubject.subscribe((value) => this.validateNom(value));
    this.rider.prenomSubject.subscribe((value) => this.validatePrenom(value));
    this.rider.dateNaissanceSubject.subscribe((value) => this.validateDateNaissance(value));
    this.rider.telephoneSubject.subscribe((value) => this.validateTelephone(value));
    if (compte) {
      this.rider.emailSubject.subscribe((value) => this.validateEmail(value));
    }
  }

  controler() {
    this.control = true;
    // Appeler les méthodes de validation pour tous les champs lors de la première validation
    this.validateNom(this.rider.nom);
    this.validatePrenom(this.rider.prenom);
    this.validateDateNaissance(this.rider.date_naissance);
    this.validateTelephone(this.rider.telephone);
    if (this.check_compte) {
      this.validateEmail(this.rider.email);
    }
  }
  checkcontrolvalue() {
    if (this.check_compte) {
      if (this.nom && this.prenom && this.date_naissance && this.telephone && this.email) {
        this.control = true;
      }
    } else {
      if (this.nom && this.prenom && this.date_naissance && this.telephone) {
        this.control = true;
      }
    }
  }

  private validateNom(value: string) {
    // Code de validation du nom
    // Mettre à jour this.nom en conséquence
    if (value) {
      if (value.length < 2) {
        this.nom = false;
        this.control = false;
      } else {
        this.nom = true;
        this.checkcontrolvalue();
      }
    } else {
      this.nom = false;
      this.control = false;
    }
  }

  private validatePrenom(value: string) {
    // Code de validation du prénom
    // Mettre à jour this.prenom en conséquence
    if (value) {
      if (value.length < 2) {
        this.prenom = false;
        this.control = false;
      } else {
        this.prenom = true;
        this.checkcontrolvalue();
      }
    } else {
      this.prenom = false;
      this.control = false;
    }
  }

  private validateDateNaissance(value: Date) {
    // Code de validation de la date de naissance
    // Mettre à jour this.date_naissance en conséquence
    if (value) {
      if (value > new Date()) {
        this.date_naissance = false;
        this.control = false;
      } else {
        this.date_naissance = true;
        this.checkcontrolvalue();
      }
    } else {
      this.date_naissance = false;
      this.control = false;
    }
  }

  private validateTelephone(value: string) {
    // Code de validation du téléphone
    // Mettre à jour this.telephone en conséquence
    if (value) {
      if (value.length < 10) {
        this.telephone = false;
        this.control = false;
      } else {
        this.telephone = true;
        this.checkcontrolvalue();
      }
    } else {
      this.telephone = false;
      this.control = false;
    }
  }

  private validateEmail(value: string) {
    // Code de validation de l'e-mail
    // Mettre à jour this.email en conséquence
    if (value) {
      if (value.length < 3) {
        this.email = false;
        this.control = false;
      } else {
        this.email = true;
        this.checkcontrolvalue();
      }
    } else {
      this.email = false;
      this.control = false;
    }
  }
}

