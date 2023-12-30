import { Component, Input } from '@angular/core';
import { Rider_VM } from 'src/class/riders';
import { ErrorService } from 'src/services/error.service';
import { RidersService } from 'src/services/riders.service';
import { notification } from '../custom-notification/custom-notification.component';
import { HttpErrorResponse } from '@angular/common/http';
import { CompteService } from 'src/services/compte.service';

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
  action:string="";
  new_mdp: string = "";

  constructor(private _riderser:RidersService, private compteservice:CompteService){}

  ModifMail() {
    const errorService = ErrorService.instance;
    this.action = $localize`Modification de l'email`;
    this._riderser.UpdateMail(this.editRider.compte, this.editRider.email, this.mdp_actuel).then((boooo) => {
      if (boooo) {
        let o = errorService.OKMessage(this.action);
        errorService.emitChange(o);
      } else {
        let o = errorService.CreateError(this.action, $localize`Erreur inconnue`);
        errorService.emitChange(o);
      }
    }).catch((err: HttpErrorResponse) => {
      let o = errorService.CreateError(this.action, err.statusText);
      errorService.emitChange(o);
    })
  }

  ModifMDP() {
    const errorService = ErrorService.instance;
    this.action = $localize`Modification du mot de passe`;
    this._riderser.UpdateMDP(this.editRider.email, this.mdp_actuel, this.new_mdp).then((boooo) => {
      if (boooo) {
        let o = errorService.OKMessage(this.action);
        errorService.emitChange(o);
      } else {
        let o = errorService.CreateError(this.action, $localize`Erreur inconnue`);
        errorService.emitChange(o);
      }
    }).catch((err: HttpErrorResponse) => {
      let o = errorService.CreateError(this.action, err.statusText);
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

  CreerValidation(motdepasse:boolean){
    const errorService = ErrorService.instance;
    this.action = $localize`Créer un utilisateur avec validation ultérieure`;
    this.compteservice.Exist(this.editRider.email).then((boooo) => {
      if (boooo) {
        let o = errorService.OKMessage(this.action);
        errorService.emitChange(o);
      } else {
        let o = errorService.CreateError(this.action, $localize`Compte inconnu`);
        errorService.emitChange(o);
      }
    }).catch((err: HttpErrorResponse) => {
      let o = errorService.CreateError(this.action, err.statusText);
      errorService.emitChange(o);
    })
  }
}
