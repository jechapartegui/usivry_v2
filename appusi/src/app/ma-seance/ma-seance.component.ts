import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Inscription, InscriptionSeance, StatutPresence } from 'src/class/inscription';
import { KeyValuePair } from 'src/class/keyvaluepair';
import { Seance, StatutSeance } from 'src/class/seance';
import { ErrorService } from 'src/services/error.service';
import { RidersService } from 'src/services/riders.service';
import { SeancesService } from 'src/services/seances.service';

@Component({
  selector: 'app-ma-seance',
  templateUrl: './ma-seance.component.html',
  styleUrls: ['./ma-seance.component.css']
})
export class MaSeanceComponent implements OnInit {
  @Input() id: number = 0;
  Liste: InscriptionSeance[] = [];
  seance: Seance;
  selected_adherent: KeyValuePair = null;
  text_recherche: string = "";
  liste_adherent: KeyValuePair[];
  messageAnnulation: string = "";
  afficher_eleve:boolean=true;
  afficher_present:boolean=true;
  afficher_absent:boolean=true;
  showDropdown: boolean;
  constructor(private router: Router, private _seanceserv: SeancesService, private _riderserv: RidersService, private route: ActivatedRoute) { }
  
  NbListe() : string {
    return this.Liste.filter(x => !x.statut_seance).length.toString();
  }
  NbListePresent() : string {
    return "15"
  }
  NbListeAbsent() : string {
    return "15"
  }

  ngOnInit(): void {
    const errorService = ErrorService.instance;
    //virer tous les cas initules
    this.route.queryParams.subscribe(params => {
      if ('id' in params) {
        this.id = params['id'];
      }
    });
    if (RidersService.IsLoggedIn === false) {
      this.router.navigate(['/login']);
      console.log("redirigé non connecté");
      return;
    }
    if (RidersService.Est_Prof == false && RidersService.Est_Admin == false) {
      this.router.navigate(['/menu-inscription']);
      console.log("redirigé non professeur");
      return;
    }
    if (this.id < 1) {
      this.router.navigate(['/menu-inscription']);
      console.log("redirigé pas d'iD");
      return;
    }
    this._seanceserv.ChargerSeance(this.id).then((list: InscriptionSeance[]) => {
      this.Liste = list;
      function compareByStatut(a: InscriptionSeance, b: InscriptionSeance): number {
        const statutOrder = { présent: 1, absent: 2, null: 3 };

        const aStatut = a.statut || null;
        const bStatut = b.statut || null;

        return statutOrder[aStatut] - statutOrder[bStatut];
      }
      this.Liste.sort(compareByStatut);
      this._seanceserv.Get(this.id).then((ss: Seance) => {
        this.seance = ss;
        let o = errorService.OKMessage("Charger la séance");
        errorService.emitChange(o);
      }).catch((error: Error) => {
        let o = errorService.CreateError("Charger la séance", error.message);
        errorService.emitChange(o);
      });

    }).catch((error: Error) => {
      let o = errorService.CreateError("Charger la séance", error.message);
      errorService.emitChange(o);
    });
  }

  validerSeance(): void {
    // Afficher une boîte de dialogue de confirmation
    const confirmation = window.confirm("Voulez-vous vraiment valider la séance ?");

    // Si l'utilisateur a confirmé, effectuez l'action souhaitée
    if (confirmation) {
      this.seance.statut = StatutSeance.réalisée;
      let ret = this.UpdateSeance("Séance réalisée");
    }
  }
  AnnulerSeance(): void {
    const errorService = ErrorService.instance;
    // Afficher une boîte de dialogue de confirmation
    const confirmation = window.confirm("Voulez-vous vraiment annuler la séance ?");

    // Si l'utilisateur a confirmé, effectuez l'action souhaitée
    if (confirmation) {
      this.seance.statut = StatutSeance.annulée;
      let ret = this.UpdateSeance("Annuler la séance");
      let ut = this.NotifierAnnulation();

      if (ut && ret) {
        this.router.navigate(['/menu-inscription']);
      }

    }

  }

  SauvegarderText() {
    this.UpdateSeance("Sauvegarder les notes");
  }
  NotifierAnnulation(): boolean {
    const errorService = ErrorService.instance;
    this._seanceserv.NotifierAnnulation(this.seance.seance_id, this.messageAnnulation).then((res) => {
      if (res) {
        let o = errorService.OKMessage("Envoi mail annulation");
        errorService.emitChange(o);
        return true;
      } else {
        let o = errorService.CreateError("Envoi mail annulation", "Erreur inconnue");
        errorService.emitChange(o);
        return false;
      }
    }).catch((error: Error) => {
      let o = errorService.CreateError("Envoi mail annulation", error.message);
      errorService.emitChange(o);
      return false;
    });
    return false;
  }

  UpdateSeance(motif: string): boolean {
    const errorService = ErrorService.instance;
    this._seanceserv.Update(this.seance).then((res: boolean) => {
      if (res) {
        let o = errorService.OKMessage(motif);
        errorService.emitChange(o);
        return true;
      } else {
        let o = errorService.CreateError(motif, "Erreur inconnue");
        errorService.emitChange(o);
        return false;
      }
    }).catch((error: Error) => {
      let o = errorService.CreateError(motif, error.message);
      errorService.emitChange(o);
      return false;
    });
    return false;
  }

  RechercherAdherent() {
    if(this.text_recherche.length>2){
      const errorService = ErrorService.instance;
      this._riderserv.GetAllSearchActiveLight(this.text_recherche).then((res) => {
        if (res.length > 0) {
          this.liste_adherent = res;
          this.showDropdown = this.liste_adherent.length > 0;
        } else {
          this.liste_adherent = null;
          let o = errorService.CreateError("Rechercher adhérent", "Pas de résultat");
          errorService.emitChange(o);
        }
      }).catch((error: Error) => {
        let o = errorService.CreateError("Rechercher adhérent", error.message);
        errorService.emitChange(o);
      });
    }
  
  }
  selectAdherent(adh: KeyValuePair) {
    this.selected_adherent = adh;
    this.showDropdown = false;
    console.log(adh);
    this.selected_adherent = adh;
}

  InscrireAdherent() {
    const inscription = new Inscription();
    const errorService = ErrorService.instance;
    inscription.date_inscription = new Date();
    inscription.rider_id = this.selected_adherent.key;
    inscription.seance_id = this.seance.seance_id;
    inscription.statut = StatutPresence.Présent;
    this._seanceserv.inscrire(inscription).then((id) => {
      this._seanceserv.ChargerSeance(this.id).then((list: InscriptionSeance[]) => {
        this.Liste = list;
        function compareByStatut(a: InscriptionSeance, b: InscriptionSeance): number {
          const statutOrder = { présent: 1, absent: 2, null: 3 };

          const aStatut = a.statut || null;
          const bStatut = b.statut || null;

          return statutOrder[aStatut] - statutOrder[bStatut];
        }
        this.Liste.sort(compareByStatut);
        this._seanceserv.Get(this.id).then((ss: Seance) => {
          this.seance = ss;
          let o = errorService.OKMessage("Inscription du rider et chargement de la liste");
          errorService.emitChange(o);
        }).catch((error: Error) => {
          let o = errorService.CreateError("Inscription du rider et chargement de la liste", error.message);
          errorService.emitChange(o);
        });

      }).catch((error: Error) => {
        let o = errorService.CreateError("Inscription du rider", error.message);
        errorService.emitChange(o);
      });
    })
  }


  trackByRiderId(index: number, item: InscriptionSeance): number {
    return item.rider_id;
  }




  UpdateStatut(item: InscriptionSeance) {
    const errorService = ErrorService.instance;
    item.seance_id = this.id;
    this._seanceserv.UpdatePresence(item).then((retour: boolean) => {
      // Si la liste de riders est retournée (authentification réussie), rediriger vers la page "menu_inscription"
      if (retour) {
        let o = errorService.OKMessage("Mise à jour de la présence");
        errorService.emitChange(o);
      } else {
        let o = errorService.CreateError("Mise à jour de la présence", "Erreur inconnue");
        errorService.emitChange(o);
      }
    }).catch((error: Error) => {
      let o = errorService.CreateError("Mise à jour de la présence", error.message);
      errorService.emitChange(o);
    });
  }
}
