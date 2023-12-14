import { Component, Input } from '@angular/core';
import { Rider_VM } from 'src/class/riders';
import { ErrorService } from 'src/services/error.service';
import { RidersService } from 'src/services/riders.service';
import { notification } from '../custom-notification/custom-notification.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-gerer-compte-individuel',
  templateUrl: './gerer-compte-individuel.component.html',
  styleUrls: ['./gerer-compte-individuel.component.css']
})
export class GererCompteIndividuelComponent {
  
  @Input() situation: "MY_UPDATE" | "UPDATE" | "CREATE" | "ADD" | "LIST";
  @Input() editRider:Rider_VM;
  
  existing_account: boolean = false;
  libelle_mail: string = "Saisir le nouvel email";
  new_mdp_confirm = "";
  mdp_actuel: string = "";
  new_mdp: string = "";

  constructor(private _riderser:RidersService){}

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
  ChangerExistingAccount() {
    if (this.existing_account) {
      this.libelle_mail = "Saisir le nouvel email";
    } else {
      this.libelle_mail = "Saisir le mail du compte";
    }
  }
}
