import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InscriptionSeance, StatutPresence } from 'src/class/inscription';
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
  constructor(private router: Router, private _seanceserv: SeancesService, private route: ActivatedRoute) { }
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
    if (RidersService.Est_Prof == false) {
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
      let o = errorService.OKMessage("Charger la séance");
      errorService.emitChange(o);
    }).catch((error: Error) => {
      let o = errorService.CreateError("Charger la séance", error.message);
      errorService.emitChange(o);
    });
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
