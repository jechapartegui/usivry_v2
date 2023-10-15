// import-riders.component.ts

import { Component, Input, OnInit } from '@angular/core';
import * as XLSX from 'xlsx'; // Bibliothèque pour lire les fichiers Excel
import { Niveau, Rider } from '../../class/riders';
import { StaticClass } from '../global';
import { RidersService } from 'src/services/riders.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/services/error.service';
import { notification } from '../custom-notification/custom-notification.component';
import { KeyValuePair } from 'src/class/keyvaluepair';
import { CoursService } from 'src/services/cours.service';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'gerer-riders',
  templateUrl: './gerer-riders.html',
  styleUrls: ['./gerer-riders.css']
})
export class GererRidersComponent implements OnInit {
  id: number = 0;
  situation: "MY_UPDATE" | "UPDATE" | "CREATE" | "ADD" | "LIST";
  fileData: any[];
  g: StaticClass = new StaticClass();
  ridersList: Rider[] = [];
  editMode = false;
  editRider: Rider | null = null;
  est_prof: boolean = false;
  est_admin: boolean = false;
  mdp_actuel: string = "";
  new_mdp: string = "";
  seasons: KeyValuePair[];
  existing_account: boolean = false;
  inscription_saison_encours = false;
  libelle_mail: string = "Saisir le nouvel email";
  season_id: number;
  search_text: string;
  new_mdp_confirm = "";

  niveauxRequis: Niveau[] = Object.values(Niveau);
  constructor(private _riderser: RidersService, private coursser: CoursService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    const errorService = ErrorService.instance;
    let o: notification;
    if (this.editRider) {
      this.id = this.editRider.id;
    }
    this.est_prof = RidersService.Est_Prof;
    this.est_admin = RidersService.Est_Admin;
    this.route.queryParams.subscribe(params => {
      if ('id' in params) {
        this.id = params['id'];
        this.situation = "MY_UPDATE";
      }
    });
    if (RidersService.IsLoggedIn === false && this.id != -2) {
      this.router.navigate(['/login']);
      return;
    } else if (this.id == -2) {
      this.situation = "CREATE";
      this.editMode = true;
      this.editRider = new Rider();
      this.editRider.id = -2;
    } else if (this.id > 0) {
      //Afficher le rider :
      //si rider dans la liste => on l'affiche sinon erreur
      if (RidersService.Riders.find(x => x.id == this.id)) {
        this.editMode = true;
        this.editRider = RidersService.Riders.find(x => x.id == this.id);
      } else {
        this.router.navigate(['/menu-inscription']);
      }
    } else if (this.id == 0) {
      if (!this.est_admin) {
        this.router.navigate(['/menu-inscription']);
      } else {
        this.coursser.GetSaison().then((list) => {
          this.seasons = list;
        })
        this.editMode = false;
        this.situation = "LIST";
        this._riderser.GetAllThisSeason().then((list) => {
          this.ridersList = list;
        }).catch((err: HttpErrorResponse) => {
          errorService.CreateError("récupérer les riders", err.statusText);
          errorService.emitChange(o);
        })
      }
    } else if (this.id == -1) {
      this.libelle_mail = "Saisir l'email";
      this.existing_account = false;
      this.editMode = true;
      this.editRider = new Rider();
      this.editRider.id = -1;
      this.situation = "ADD";

    }

  }

  ModifMail() {
    const errorService = ErrorService.instance;
    let o: notification;
    this._riderser.UpdateMail(this.editRider.compte, this.editRider.email, this.mdp_actuel).then((boooo) => {
      if (boooo) {
        o = errorService.OKMessage("Modification de l'émail");
        errorService.emitChange(o);
      } else {
        o = errorService.CreateError("Modification de l'émail", "erreur inconnue");
        errorService.emitChange(o);
      }
    }).catch((err: HttpErrorResponse) => {
      o = errorService.CreateError("Modification de l'émail", err.statusText);
      errorService.emitChange(o);
    })
  }

  ModifMDP() {
    const errorService = ErrorService.instance;
    let o: notification;
    this._riderser.UpdateMDP(this.editRider.email, this.mdp_actuel, this.new_mdp).then((boooo) => {
      if (boooo) {
        o = errorService.OKMessage("Modification du mot de passe");
        errorService.emitChange(o);
      } else {
        o = errorService.CreateError("Modification du mot de passe", "erreur inconnue");
        errorService.emitChange(o);
      }
    }).catch((err: HttpErrorResponse) => {
      o = errorService.CreateError("Modification du mot de passe", err.statusText);
      errorService.emitChange(o);
    })
  }


  editerRiders(rider: Rider): void {
    this.editRider = { ...rider };
    this.editMode = true;
    this.situation = "UPDATE";
  }

  ChangerExistingAccount() {
    if (this.existing_account) {
      this.libelle_mail = "Saisir le nouvel email";
    } else {
      this.libelle_mail = "Saisir le mail du compte";
    }
  }

  calculateAge(dateNaissance: Date): number {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  supprimerRiders(rider: Rider): void {
    const isConfirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ?');

    if (isConfirmed) {

      let errorservice = ErrorService
      let act = "Supprimer un rider";
      if (rider) {
        this._riderser.Delete(rider.id).then((result) => {
          if (result) {
            // Suppression réussie en base, supprimer l'élément correspondant de la liste
            this.ridersList = this.ridersList.filter(c => c.id !== rider.id);

            // Afficher un message de confirmation à l'utilisateur
            let o = errorservice.instance.OKMessage(act);

          } else {
            errorservice.instance.CreateError(act, "erreur lors de la suppression");
          }
        }).catch((elkerreur: HttpErrorResponse) => {
          errorservice.instance.CreateError(act, elkerreur.statusText);
        })
      }
    }
  }

  creerRiders(): void {
    this.editRider = new Rider();
    this.editRider.id = -1;
    this.editMode = true;
    this.situation = "ADD";
  }

  control(): boolean {
    let errorservice = ErrorService.instance;
    let retour = true;
    let champs = "Le(s) champ(s) suivant(s) sont obligatoire(s) : ";
    let taille = champs.length;
    if (!this.editRider.nom || this.editRider.nom == "") {
      if (champs.length == taille) {
        champs += "Nom";
      } else {
        champs += ", Nom";
      }
      retour = false;
    }
    if (!this.editRider.prenom || this.editRider.prenom == "") {
      if (champs.length == taille) {
        champs += "Prénom";
      } else {
        champs += ", Prénom";
      }
      retour = false;
    }
    const dt = new Date(this.editRider.date_naissance);
    if (!this.editRider.date_naissance || dt.getFullYear() == new Date().getFullYear()) {

      if (champs.length == taille) {
        champs += "Date de naissance";
      } else {
        champs += ", Date de naissance";
      }
      retour = false;
    }
    if (!this.editRider.adresse || this.editRider.adresse == "") {
      if (champs.length == taille) {
        champs += "Adresse";
      } else {
        champs += ", Adresse";
      }
      retour = false;
    }
    if (!this.editRider.telephone || this.editRider.telephone == "") {
      if (champs.length == taille) {
        champs += "Téléphone";
      } else {
        champs += ", Téléphone";
      }
      retour = false;
    }
    if (!this.editRider.personne_prevenir || this.editRider.personne_prevenir == "") {
      if (champs.length == taille) {
        champs += "Personne à prévenir";
      } else {
        champs += ", Personne à prévenir";
      }
      retour = false;
    }
    if (!this.editRider.telephone_personne_prevenir || this.editRider.telephone_personne_prevenir == "") {
      if (champs.length == taille) {
        champs += "Téléphone de la personne à prévenir";
      } else {
        champs += ", Téléphone de la personne à prévenir";
      }
      retour = false;
    }
    if (this.situation == "CREATE") {
      if (this.existing_account) {
        if (!this.editRider.email || this.editRider.email == "") {
          if (champs.length == taille) {
            champs += "Email";
          } else {
            champs += ", Email";
          }
          retour = false;
        }
        if (!this.mdp_actuel || this.mdp_actuel == "") {
          if (champs.length == taille) {
            champs += "Mot de passe";
          } else {
            champs += ", Mot de passe";
          }
          retour = false;
        }
      } else {
        if (!this.editRider.email || this.editRider.email == "") {
          if (champs.length == taille) {
            champs += "Email";
          } else {
            champs += ", Email";
          }
          retour = false;
        }
        if (!this.new_mdp || this.new_mdp == "") {
          if (champs.length == taille) {
            champs += "Mot de passe";
          } else {
            champs += ", Mot de passe";
          }
          retour = false;
        }
        if (!this.new_mdp_confirm || this.new_mdp_confirm == "") {
          if (champs.length == taille) {
            champs += "Confirmation du mot de passe";
          } else {
            champs += ", Confirmation du mot de passe";
          }
          retour = false;
        }
      }
    }

    if (!retour) {
      let o = errorservice.CreateError("Formulaire incomplet", champs);
      errorservice.emitChange(o);
    }
    return retour;
  }

  soumettreRiders(): void {
    if (!this.est_admin) {
      if (!this.control()) {
        return;
      }
    }
    let errorservice = ErrorService.instance;
    let act = "Ajouter un rider";
    if (this.editRider) {
      if (this.editRider.id < 0) {
        let body;
        if (this.inscription_saison_encours) {
          if (this.existing_account) {
            if (this.editRider.id == -2) {
              body = {
                command: "create",
                rider: this.editRider,
                inscription_saison_encours: true
              }
            }
            else {
              body = {
                command: "add",
                rider: this.editRider,
                inscription_saison_encours: true
              }
            }
          } else {
            if (this.editRider.id == -2) {
              body = {
                command: "create",
                with_psw: true,
                rider: this.editRider,
                inscription_saison_encours: true
              }
            }
            else {
              body = {
                command: "add",
                with_psw: true,
                rider: this.editRider,
                inscription_saison_encours: true
              }
            }
          }
        } else {
          if (this.existing_account) {
            if (this.editRider.id == -2) {
              body = {
                command: "create",
                rider: this.editRider,
              }
            }
            else {
              body = {
                rider: this.editRider,
                command: "add",
              }
            }
          } else {
            if (this.editRider.id == -2) {
              body = {
                command: "create",
                rider: this.editRider,
                with_psw: true,
              }
            }
            else {
              body = {
                command: "add",
                rider: this.editRider,
                with_psw: true,
              }
            }
          }
        }

        this._riderser.Add(body, this.editRider).then((loe) => {
          var id = this.editRider.id;
          this.editRider = loe;
          let o = errorservice.OKMessage(act);
          errorservice.emitChange(o);
          this.ridersList.push(this.editRider);
          if (this.situation = "CREATE") {
            this._riderser.Login(this.editRider.email, this.mdp_actuel, false);
            this.router.navigate(['/menu-inscription']);
          } else {
            this.situation = "UPDATE";
          }
        }).catch((elkerreur: HttpErrorResponse) => {
          let o = errorservice.CreateError(act, elkerreur.statusText);
          errorservice.emitChange(o);
        })
      }
      else if (this.editRider.id < 0 && !this.existing_account) {
        let command = "add";
        if (this.editRider.id == -2) {
          command = "create";
        }
        this._riderser.Add_NoPassword_NoInscription(this.editRider, command).then((loe) => {
          this.editRider = loe;
          let o = errorservice.OKMessage(act);
          errorservice.emitChange(o);
          this.ridersList.push(this.editRider);
          if (this.editRider.id == -2) {
            this.router.navigate(['/menu-inscription']);
          }
        }).catch((elkerreur: HttpErrorResponse) => {
          let o = errorservice.CreateError(act, elkerreur.statusText);
          errorservice.emitChange(o);
        })
      }
      else {
        this._riderser.Update(this.editRider).then((loe) => {

          act = "Mettre à jour un rider";
          if (loe) {
            let o = errorservice.OKMessage(act);
            errorservice.emitChange(o);
            const indexToUpdate = this.ridersList.findIndex(rider => rider.id === this.editRider.id);

            if (indexToUpdate !== -1) {
              // Remplacer l'élément à l'index trouvé par la nouvelle valeur
              this.ridersList[indexToUpdate] = this.editRider;
            }
            this.annulerEdition();
          } else {
            let o = errorservice.CreateError(act, "erreur lors de la mise à jour")
            errorservice.emitChange(o);
          }
        }).catch((elkerreur: HttpErrorResponse) => {
          let o = errorservice.CreateError(act, elkerreur.statusText);
          errorservice.emitChange(o);
        })
      }
    }
  }

  annulerEdition(): void {
    let confirmation = window.confirm("En quittant cet écran, vous perdez les données non sauvegardées. Confirmez vous l'opération ?");
    if (confirmation) {
      this.editMode = false;
      this.editRider = null;
      switch (this.situation) {
        case "ADD":
          this.router.navigate(['/menu-inscription']);
          break;
        case "CREATE":
          this.router.navigate(['/defaut']);
          break;
        case "LIST":
          break;
        case "MY_UPDATE":
          this.router.navigate(['/menu-inscription']);
          break;
        case "UPDATE":
          this.situation = "LIST";
          break
      }
    }

  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.SheetNames[0];
      this.fileData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], { header: 1 });
    };
    fileReader.readAsArrayBuffer(file);
  }

  Filtrer() {
    let errorservice = ErrorService.instance;
    if (!this.season_id || this.season_id == 0) {
      this._riderser.GetAllSearch(this.search_text).then((result) => {
        this.ridersList = result;
        let o = errorservice.OKMessage("Recherche de rider");
        errorservice.emitChange(o);
      }).catch((elkerreur: HttpErrorResponse) => {
        let o = errorservice.CreateError("Recherche de rider", elkerreur.statusText);
        errorservice.emitChange(o);
      })
    } else {
      this._riderser.GetAllSearchSeason(this.search_text, this.season_id).then((result) => {
        this.ridersList = result;
        let o = errorservice.OKMessage("Recherche de rider");
        errorservice.emitChange(o);
      }).catch((elkerreur: HttpErrorResponse) => {
        let o = errorservice.CreateError("Recherche de rider", elkerreur.statusText);
        errorservice.emitChange(o);
      })
    }

  }
  FiltrerBack() {
    let errorservice = ErrorService.instance;
    this._riderser.GetAllThisSeason().then((result) => {
      this.ridersList = result;
      let o = errorservice.OKMessage("Recherche de rider");
      errorservice.emitChange(o);
    }).catch((elkerreur: HttpErrorResponse) => {
      let o = errorservice.CreateError("Recherche de rider", elkerreur.statusText);
      errorservice.emitChange(o);
    })
  }

  InscrireRider() {
    let errorservice = ErrorService.instance;

    this._riderser.Inscrire(this.editRider.id).then((bool) => {
      if (bool) {
        let o = errorservice.OKMessage("Inscription du rider");
        errorservice.emitChange(o);
      } else {
        let o = errorservice.CreateError("Inscription du rider", "Erreur inconnue");
        errorservice.emitChange(o);
      }
    }).catch((elkerreur: HttpErrorResponse) => {
      let o = errorservice.CreateError("Inscription du rider", elkerreur.statusText);
      errorservice.emitChange(o);
    })
  }


  importData() {
    let errorservice = ErrorService.instance;

    //simuler :
    if (!this.fileData) return;
    var rid_list: Rider[] = [];
    let compte = 0;

    this.fileData.slice(1).forEach((row: any) => {
      compte++;

      // Convertissez la date depuis Excel en utilisant date-fns-tz
      const excelDate = row[21];
      const date_naissance = this.g.parseExcelDate(excelDate);

      const rider: Rider = {
        nom: row[2],
        prenom: row[3],
        date_naissance: date_naissance, // Utilisez la date convertie
        sexe: row[9].toLowerCase() === 'monsieur',
        niveau: Niveau.Débutant,
        adresse: `${row[22]} ${row[23]} ${row[24]} ${row[25]} ${row[27]} ${row[26]}`,
        mot_de_passe: 'ivry',
        telephone: `${row[34]} ${row[35]}`,
        personne_prevenir: `${row[38]} ${row[39]} - ${row[42]} ${row[43]}`,
        telephone_personne_prevenir: `${row[40]} - ${row[44]}`,
        email: row[29],
        compte: 0,
        est_prof: false,
        est_admin: false,
        est_inscrit: true,
        id: 0,
        inscriptions: [],
        seances: [],
        seances_prof: []
      };
      rid_list.push(rider);
    });
    console.log(rid_list);
    let confirmation = window.confirm("Il y'a " + compte.toString() + " lignes et " + rid_list.length.toString() + " comptes créés. Voulez vous importer ? ")
    if (confirmation) {
      this._riderser.AddRange(rid_list).then((bool: boolean) => {
        if (bool) {
          let o = errorservice.OKMessage("Création de compte en masse");
          errorservice.emitChange(o);
        } else {
          let o = errorservice.CreateError("Création de compte en masse", "Erreur inconnue");
          errorservice.emitChange(o);
        }
      }).catch((elkerreur: HttpErrorResponse) => {
        let o = errorservice.CreateError("Inscription du rider", elkerreur.statusText);
        errorservice.emitChange(o);
      })
    }


  }
}
