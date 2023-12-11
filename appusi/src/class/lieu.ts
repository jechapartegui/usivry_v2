import { Subject } from "rxjs";

export class lieu {
    public id: number = 0;
    public nom: string = "";
    public adresse: string = "";
}

export class lieu_VM {
    public id: number = 0;
    public editing: boolean = false;
    public valid: ValidationLieu;
    // Utilisez des sujets pour chaque propriété
    nomSubject = new Subject<string>();
    adresseSubject = new Subject<string>();

    private _nom: string;
    private _adresse: string;

    constructor(L: lieu) {
        this.id = L.id;
        if (this.id == 0) {
            this.editing = true;
        } else {
            this.editing = false;
        }
        this.adresse = L.adresse;
        this.nom = L.nom;
        this.valid = new ValidationLieu(this);
        this.valid.controler();
    }

    ToLieu(): lieu{
        var l = new lieu();
        l.id = this.id;
        l.adresse = this.adresse;
        l.nom = this.nom;
        return l;
    }

    // Propriété nom avec get et set
    get nom(): string {
        return this._nom;
    }
    set nom(value: string) {
        this._nom = value;
        this.nomSubject.next(value);
    }

    // Propriété prenom avec get et set
    get adresse(): string {
        return this._adresse;
    }
    set adresse(value: string) {
        this._adresse = value;
        this.adresseSubject.next(value);
    }
}

export class ValidationLieu {
    public control: boolean;
    public nom: boolean;
    public adresse: boolean;

    constructor(private lieu: lieu_VM) {
        this.lieu.nomSubject.subscribe((value) => this.validateNom(value));
        this.lieu.adresseSubject.subscribe((value) => this.validateAdresse(value));

    }

    controler() {
        this.control = true;
        // Appeler les méthodes de validation pour tous les champs lors de la première validation
        this.validateNom(this.lieu.nom);
        this.validateAdresse(this.lieu.adresse);

    }
    checkcontrolvalue() {
        if (this.nom && this.adresse) {
            this.control = true;
        }

    }

    private validateNom(value: string) {
        // Code de validation du nom
        // Mettre à jour this.nom en conséquence
        if (value) {
            if (value.length < 3) {
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

    private validateAdresse(value: string) {
        // Code de validation du prénom
        // Mettre à jour this.prenom en conséquence
        if (value) {
            if (value.length < 10) {
                this.adresse = false;
                this.control = false;
            } else {
                this.adresse = true;
                this.checkcontrolvalue();
            }
        } else {
            this.adresse = false;
            this.control = false;
        }
    }


}