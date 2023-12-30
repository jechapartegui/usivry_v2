// import-riders.component.ts

import { Component, Input, OnInit, Output } from '@angular/core';
import * as XLSX from 'xlsx'; // Bibliothèque pour lire les fichiers Excel
import { Rider, Rider_VM, ValidationRider } from '../../class/riders';
import { StaticClass } from '../global';
import { RidersService } from 'src/services/riders.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/services/error.service';
import { notification } from '../custom-notification/custom-notification.component';
import { KeyValuePair } from 'src/class/keyvaluepair';
import { CoursService } from 'src/services/cours.service';
import { environment } from 'src/environments/environment.prod';
import { Groupe } from 'src/class/groupe';
import { GroupeService } from 'src/services/groupe.service';


@Component({
  selector: 'gerer-riders',
  templateUrl: './gerer-riders.html',
  styleUrls: ['./gerer-riders.css']
})
export class GererRidersComponent implements OnInit {
  @Output() existing_account:boolean;
  id: number = 0;
  situation: "MY_UPDATE" | "UPDATE" | "CREATE" | "ADD" | "LIST";
  selected_menu: "INFOPERSO" | "GROUPE" | "ADMIN" | "COMPTE" | "TOUS" = "INFOPERSO";
  fileData: any[];
  g: StaticClass = new StaticClass();
  action: string;
  list_rider_VM: Rider_VM[];

  filter_nom: string = "";
  filter_active_nom: boolean = false;
  sort_nom: "NO" | "ASC" | "DESC" = "NO";

  filter_prenom: string = "";
  filter_active_prenom: boolean = false;
  sort_prenom: "NO" | "ASC" | "DESC" = "NO";


  sort_date_naissance: "NO" | "ASC" | "DESC" = "NO";

  filter_sexe: boolean = null;
  filter_active_sexe: boolean = false;
  sort_sexe: "NO" | "ASC" | "DESC" = "NO";


  editRider: Rider_VM | null = null;
  est_prof: boolean = false;
  est_admin: boolean = false;
  afficher_menu_admin:boolean=false;
  list_saison: KeyValuePair[];
  inscription_saison_encours = false;
  season_id: number;
  search_text: string;
  current_groupe_id: number;
  groupe_dispo: Groupe[] = [];

  list_groupe: Groupe[] = [];
  constructor(private _riderser: RidersService, private grServ: GroupeService, private courserv: CoursService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const errorService = ErrorService.instance;
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
      this.Creer();
      this.situation = "CREATE";
    } else if (this.situation != "MY_UPDATE") {
      this.est_prof = RidersService.Est_Prof;
      this.est_admin = RidersService.Est_Admin;
      this.grServ.GetAll().then((groupes) => {
        this.list_groupe = groupes;
        this.courserv.GetSaison().then((saisons) => {
          this.list_saison = saisons;
          this._riderser.GetAllThisSeason().then((list) => {
            RidersService.Riders = list;
            this.list_rider_VM = RidersService.Riders.map(x => new Rider_VM(x));
            this.situation = "LIST";
          }).catch((err: HttpErrorResponse) => {
            let o =  errorService.CreateError("récupérer les riders", err.statusText);
            errorService.emitChange(o);
            this.router.navigate(['/menu-inscription']);
          })
        }).catch((err: HttpErrorResponse) => {
          let o = errorService.CreateError("récupérer les saisons", err.statusText);
          errorService.emitChange(o);
          this.router.navigate(['/menu-inscription']);
        })
      }).catch((err: HttpErrorResponse) => {
        let o = errorService.CreateError("récupérer les groupes", err.statusText);
        errorService.emitChange(o);
        this.router.navigate(['/menu-inscription']);
      });

    } else if (this.situation == "MY_UPDATE") {
      this.RiderToEdit();
      this.list_rider_VM = RidersService.Riders.map(x => new Rider_VM(x));
    }   
  }

  Edit(rider:Rider_VM){
    this.situation = "UPDATE";
    this.id = rider.id;
    this.RiderToEdit();
  }

  RiderToEdit() {
    var this_rider = RidersService.Riders.find(x => x.id == this.id);
    this.editRider = new Rider_VM(this_rider);
  
  }



  

  Creer() {
    this.editRider = new Rider_VM(new Rider());
    this.situation = "ADD";
    this.MAJListeGroupe();
  }

  Sort(sens: "NO" | "ASC" | "DESC", champ: string) {

    switch (champ) {
      case "nom":
        this.sort_nom = sens;
        if (this.sort_nom != "NO") {
          this.list_rider_VM.sort((a, b) => {
            const nomA = a.nom.toUpperCase(); // Ignore la casse lors du tri
            const nomB = b.nom.toUpperCase();

            let comparaison = 0;
            if (nomA > nomB) {
              comparaison = 1;
            } else if (nomA < nomB) {
              comparaison = -1;
            }

            return this.sort_nom === 'ASC' ? comparaison : -comparaison; // Inverse pour le tri descendant
          });

        }
        break;
      case "prenom":
        this.sort_prenom = sens;
        if (this.sort_prenom != "NO") {
          this.list_rider_VM.sort((a, b) => {
            const nomA = a.prenom.toUpperCase(); // Ignore la casse lors du tri
            const nomB = b.prenom.toUpperCase();

            let comparaison = 0;
            if (nomA > nomB) {
              comparaison = 1;
            } else if (nomA < nomB) {
              comparaison = -1;
            }

            return this.sort_prenom === 'ASC' ? comparaison : -comparaison; // Inverse pour le tri descendant
          });
        }
        break;
      case "date_naissance":
        this.sort_date_naissance = sens;
        if (this.sort_date_naissance != "NO") {
          this.list_rider_VM.sort((a, b) => {
            const nomA = a.date_naissance; // Ignore la casse lors du tri
            const nomB = b.date_naissance;

            let comparaison = 0;
            if (nomA > nomB) {
              comparaison = 1;
            } else if (nomA < nomB) {
              comparaison = -1;
            }

            return this.sort_date_naissance === 'ASC' ? comparaison : -comparaison; // Inverse pour le tri descendant
          });
        }
        break;
      case "sexe":
        this.sort_sexe = sens;
        if (this.sort_sexe != "NO") {
          this.list_rider_VM.sort((a, b) => {

            const actifA = a.sexe ? 1 : 0; // Convertit le booléen en 1 (true) ou 0 (false)
            const actifB = b.sexe ? 1 : 0;

            let comparaison = 0;
            if (actifA > actifB) {
              comparaison = 1;
            } else if (actifA < actifB) {
              comparaison = -1;
            }

            return this.sort_sexe === 'ASC' ? comparaison : -comparaison; // Inverse pour le tri descendant
          });
        }
        break;

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

  Reinit(thisl: Rider_VM) {
    let confirmation = window.confirm($localize`Cette action annulera l'ensemble des modifications sur cet adhérent ?`);
    if (confirmation) {
      const rider_avant: Rider = RidersService.Riders.find(x => x.id === thisl.id);
      const index_rider_apres: number = this.list_rider_VM.findIndex(x => x.id === thisl.id);

      if (rider_avant !== undefined && index_rider_apres !== -1) {
        this.list_rider_VM[index_rider_apres] = new Rider_VM(rider_avant);
      }
    }

  }

  Delete(rider: Rider_VM): void {
    const isConfirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ?');

    if (isConfirmed) {

      const errorService = ErrorService.instance;
      this.action = "Supprimer un rider";
      if (rider) {
        this._riderser.Delete(rider.id).then((retour) => {
          if (retour) {
            RidersService.Riders = RidersService.Riders.filter(x => x.id !== rider.id);
            this.list_rider_VM = this.list_rider_VM.filter(x => x.id !== rider.id);
            let o = errorService.OKMessage(this.action);
            errorService.emitChange(o);
          } else {
            let o = errorService.CreateError(this.action, $localize`Erreur inconnue`);
            errorService.emitChange(o);
          }
        }).catch((err) => {
          let o = errorService.CreateError(this.action, err.statusText);
          errorService.emitChange(o);
        });
      }
    }
  }




  Save(rider: Rider_VM) {
    const errorService = ErrorService.instance;
    this.action = "Ajouter un rider";
    if (rider) {
      if (rider.id == 0) {
        let body;
        if (this.inscription_saison_encours) {
          if (this.existing_account) {

            body = {
              command: this.situation.toLowerCase(),
              rider: rider,
              inscription_saison_encours: true
            }
          } else {
            body = {
              command: this.situation.toLowerCase(),
              rider: rider,
              with_psw: true,
              inscription_saison_encours: true
            }
          }
        } else {
          if (this.existing_account) {
            body = {
              command: this.situation.toLowerCase(),
              rider: rider,
            }
          } else {
            body = {
              command: this.situation.toLowerCase(),
              rider: rider,
              with_psw: true
            }
          }
        }
        console.log(body);
        console.log(rider);
        this._riderser.Add(body, rider.ToRider()).then((new_rider) => {
          console.log(new_rider);
          if (new_rider) {
            RidersService.Riders.push(new_rider);
            let rider_vm: Rider_VM = new Rider_VM(new_rider);
            this.list_rider_VM.push(rider_vm);
            if (this.situation = "CREATE") {
          //    this._riderser.Login(this.editRider.email, this.mdp_actuel, false);
              this.router.navigate(['/menu-inscription']);
            } else if (this.situation = "ADD") {
              this.situation = "UPDATE";
              this.editRider = rider_vm;
            }
            let o = errorService.OKMessage(this.action);
            errorService.emitChange(o);
          } else {
            let o = errorService.CreateError(this.action, $localize`Erreur inconnue`);
            errorService.emitChange(o);
          }

        }).catch((err) => {
          let o = errorService.CreateError(this.action, err.statusText);
          errorService.emitChange(o);
        });
      }
      else {
        this._riderser.Update(rider.ToRider()).then((ok) => {

          this.action = "Mettre à jour un rider";
          if (ok) {

            const indexToUpdate = RidersService.Riders.findIndex(rider => rider.id === rider.id);
            if (indexToUpdate !== -1) {
              // Remplacer l'élément à l'index trouvé par la nouvelle valeur
              RidersService.Riders[indexToUpdate] = rider.ToRider();
            }
              const indexToUpdateVM = this.list_rider_VM.findIndex(rider => rider.id === rider.id);
              if (indexToUpdateVM !== -1) {
                // Remplacer l'élément à l'index trouvé par la nouvelle valeur
                this.list_rider_VM[indexToUpdateVM] = rider;
              }
           
            if(this.situation == "LIST"){
              rider.editing = false;
            } else if(this.situation == "UPDATE"){
              this.situation = "LIST";
              this.editRider = null;
            }
            console.log("ici");
            let o = errorService.OKMessage(this.action);
            errorService.emitChange(o);
          } else {
            let o = errorService.CreateError(this.action, $localize`Erreur inconnue`);
            errorService.emitChange(o);
          }

        }).catch((err) => {
          let o = errorService.CreateError(this.action, err.statusText);
          errorService.emitChange(o);
        });
      }
    }
  }

  Retour(): void {
    let confirmation = window.confirm("En quittant cet écran, vous perdez les données non sauvegardées. Confirmez vous l'opération ?");
    if (confirmation) {
      this.editRider = null;
      switch (this.situation) {
        case "ADD":
        case "UPDATE":
          this.situation = "LIST";
          break;
        case "CREATE":
          this.router.navigate(['/defaut']);
          break;
        case "LIST":
          break;
        case "MY_UPDATE":
          this.router.navigate(['/menu-inscription']);
          break;

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
  AjouterGroupe() {
    const indexToUpdate = this.list_groupe.findIndex(cc => cc.id === this.current_groupe_id);
    const newValue = this.list_groupe[indexToUpdate];
    this.editRider.groupes.push(newValue);
    this.current_groupe_id = null;
    this.MAJListeGroupe();

  }
  RemoveGroupe(item) {
    this.editRider.groupes = this.editRider.groupes.filter(e => e.id !== item.id);
    this.MAJListeGroupe();
  }
  MAJListeGroupe() {
    this.groupe_dispo = this.list_groupe;
    if (!this.editRider.groupes) {
      this.editRider.groupes = [];
    }
    this.editRider.groupes.forEach((element: Groupe) => {
      let element_to_remove = this.list_groupe.find(e => e.id == element.id);
      if (element_to_remove) {
        this.groupe_dispo = this.groupe_dispo.filter(e => e.id !== element_to_remove.id);
      }
    });
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

      const rider = new Rider();
      rider.nom = row[2];
      rider.prenom = row[3];
      rider.date_naissance = date_naissance; // Utilisez la date convertie
      rider.sexe = row[9].toLowerCase() === 'monsieur';
      rider.groupes = [];
      rider.adresse = `${row[22]} ${row[23]} ${row[24]} ${row[25]} ${row[27]} ${row[26]}`;
      rider.mot_de_passe = 'ivry';
      rider.telephone = `${row[34]} ${row[35]}`;
      rider.personne_prevenir = `${row[38]} ${row[39]} - ${row[42]} ${row[43]}`;
      rider.telephone_personne_prevenir = `${row[40]} - ${row[44]}`;
      rider.email = row[29];
      rider.compte = 0;
      rider.est_prof = false;
      rider.est_admin = false;
      rider.est_inscrit = true;
      rider.id = 0;
      rider.inscriptions = [];
      rider.seances = [];
      rider.seances_prof = [];

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
