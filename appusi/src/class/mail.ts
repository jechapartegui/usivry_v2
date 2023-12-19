import { StaticClass } from "src/app/global";
import { Groupe } from "./groupe";
import { Subject } from "rxjs";

export class MailData {
    public id:number;
    public subject: string;
    public liste_to:string[];
    public content: string;
    public envoye:boolean = false;
    public date_envoi:Date= null;
    public plusieurs_destinataire:boolean = false;
    public envoi_OK= false;
    public groupes:Groupe[] =[];
    public categorie : "INDIVIDUEL" | "GROUPE" | "ANNULATION" | "RELANCE" | "SEANCE";

}


export class MailData_VM  {
constructor(mail_:MailData){
    this.subject = mail_.subject;
    this.liste_to = mail_.liste_to;
    this.content = mail_.content;
    this.envoye = mail_.envoye;
    this.date_envoi = mail_.date_envoi;
    this.plusieurs_destinataire = mail_.plusieurs_destinataire;
    this.liste_to = mail_.liste_to;
    this.envoi_OK = mail_.envoi_OK;
    this.groupes = mail_.groupes;
    this.categorie = mail_.categorie;
 
    this.valid = new ValidationMail(this);
    this.valid.controler();
  }

  ToMailData():MailData{
    let m:MailData = new MailData();
    var g:StaticClass;
    m.subject = this.subject;
    m.liste_to = this.liste_to;
    m.content = this.content;
    m.envoye = this.envoye;
    m.date_envoi = this.date_envoi;
    m.plusieurs_destinataire = this.plusieurs_destinataire;
    m.envoi_OK = this.envoi_OK;
    m.categorie = this.categorie;
    m.groupes = this.groupes;
    
    return m;
  }

  public editing: boolean = false;
  public valid: ValidationMail;
  // Utilisez des sujets pour chaque propriété
  subjectSubject = new Subject<string>();
  listetoSubject = new Subject<string[]>();
  contentSubject = new Subject<string>();
  categorieSubject = new Subject<string>();

  public envoye: boolean;
  public date_envoi: Date;
  public plusieurs_destinataire: boolean;
  public envoi_OK: boolean;
  public groupes: Groupe[];
  private _subject: string;
  private _liste_to: string[]
  private _content:string;
  private _categorie: "INDIVIDUEL" | "GROUPE" | "ANNULATION" | "RELANCE" | "SEANCE";
  // Propriété nom avec get et set
  get subject(): string {
    return this._subject;
  }
  set subject(value: string) {
    this._subject = value;
    this.subjectSubject.next(value);
  }
  get liste_to(): string[] {
    return this._liste_to;
  }
  set liste_to(value: string[]) {
    this._liste_to = value;
    this.listetoSubject.next(value);
  }
  get categorie(): "INDIVIDUEL" | "GROUPE" | "ANNULATION" | "RELANCE" | "SEANCE" {
    return this._categorie;
  }
  set categorie(value: "INDIVIDUEL" | "GROUPE" | "ANNULATION" | "RELANCE" | "SEANCE") {
    this._categorie = value;
    this.categorieSubject.next(value);
  }
  get content(): string {
    return this._content;
  }
  set content(value: string) {
    this._content = value;
    this.contentSubject.next(value);
  }

}

export class ValidationMail {
  public control: boolean;
  public subject: boolean;
  public liste_to: boolean;
  public categorie: boolean;
  public content: boolean;

  constructor(private mail: MailData_VM) {

    this.mail.subjectSubject.subscribe((value) => this.ValidateSubject(value));
    this.mail.categorieSubject.subscribe((value) => this.ValidateCategorie(value));
    this.mail.listetoSubject.subscribe((value) => this.ValidateListeTo(value));
    this.mail.contentSubject.subscribe((value) => this.ValidateContent(value));
    
  }

  controler() {
    this.control = true;
    // Appeler les méthodes de validation pour tous les champs lors de la première validation
    this.ValidateSubject(this.mail.subject);
    this.ValidateListeTo(this.mail.liste_to);
    this.ValidateCategorie(this.mail.categorie);
    this.ValidateContent(this.mail.content);

    
  }

  private ValidateSubject(value: string) {
    // Code de validation du nom
    // Mettre à jour this.nom en conséquence
    if (value) {
      if (value.length < 10) {
        this.subject = false;
        this.control = false;
      } else {
        this.subject = true;
        this.checkcontrolvalue();
      }
    } else {
      this.subject = false;
      this.control = false;
    }
  }

  private ValidateCategorie(value: string) {
    // Code de validation de la date de naissance
    // Mettre à jour this.date_naissance en conséquence
    if (value) {
        this.categorie = true;
        this.checkcontrolvalue();

    } else {
      this.categorie = false;
      this.control = false;
    }
  }

  private ValidateListeTo(value: string[]) {
    // Code de validation du nom
    // Mettre à jour this.nom en conséquence
    if (value) {
      if (value.length < 1) {
        this.liste_to = false;
        this.control = false;
      } else {
        this.liste_to = true;
        this.checkcontrolvalue();
      }
    } else {
      this.liste_to = false;
      this.control = false;
    }
  }

  private ValidateContent(value: string) {
    // Code de validation du nom
    // Mettre à jour this.nom en conséquence
    if (value) {
        if (value.length < 10) {
          this.content = false;
          this.control = false;
        } else {
          this.content = true;
          this.checkcontrolvalue();
        }
      } else {
        this.content = false;
        this.control = false;
      }
  }


  
  checkcontrolvalue() {
      if (this.subject && this.categorie && this.content && this.liste_to) {
        this.control = true;
      }  
  }
}
  