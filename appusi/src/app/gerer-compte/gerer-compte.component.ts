import { Component, OnInit } from '@angular/core';
import { compte } from 'src/class/compte';
import { Rider } from 'src/class/riders';
import { CompteService } from 'src/services/compte.service';
import { ErrorService } from 'src/services/error.service';

@Component({
  selector: 'app-gerer-compte',
  templateUrl: './gerer-compte.component.html',
  styleUrls: ['./gerer-compte.component.css']
})
export class GererCompteComponent implements OnInit {
  action: string;
  list: compte[];
  constructor(private cptserv: CompteService) {

  }
  ngOnInit(): void {
    this.action = $localize`Affichage des comptes`;
    const errorService = ErrorService.instance;
    this.cptserv.GetAll().then((liste) => {
      this.list = liste;
      let o = errorService.OKMessage(this.action);
      errorService.emitChange(o);
    }).catch((err) => {
      let o = errorService.CreateError(this.action, err.statusText);
      errorService.emitChange(o);
    });
  }

  UpdateMailRelance(compte_id: number) {
    this.action = $localize`Mise à jour de la valeur du mail de relance`;
    const errorService = ErrorService.instance;
    this.cptserv.UpdateMailRelance(compte_id).then((retour) => {
      if (retour) {
        if (this.list.find(x => x.id == compte_id).mail_active) {
          this.list.find(x => x.id == compte_id).mail_active = false;
        } else {
          this.list.find(x => x.id == compte_id).mail_active = true;
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
  Attacher(rider_id: number, compte_id: number, current_compte_id: number) {
    this.action = $localize`rattcher un adhérent à un compte`;
    const errorService = ErrorService.instance;
    this.cptserv.Attacher(compte_id, rider_id).then((retour) => {
      if (retour) {
        var rider: Rider = this.list.find(x => x.id == current_compte_id).riders.find(x => x.id == rider_id);
        this.list.find(x => x.id == current_compte_id).riders = this.list.find(x => x.id == current_compte_id).riders.filter(x => x.id !== rider_id);
        this.list.find(x => x.id == compte_id).riders.push(rider);
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
