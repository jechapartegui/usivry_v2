import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ErrorService } from 'src/services/error.service';
import { SeancesService } from 'src/services/seances.service';

@Component({
  selector: 'app-gerer-inscriptions',
  templateUrl: './gerer-inscriptions.component.html',
  styleUrls: ['./gerer-inscriptions.component.css']
})
export class GererInscriptionsComponent {
  constructor(
    private seancesservice: SeancesService,
  ) { }
  message: string = "";

  MailRelance() {
    let errorService = ErrorService.instance;
    let confirmation = window.confirm("Voulez-vous envoyer le message de confirmation à tous les adhérents ? Cette action entrainera l'envoi de nombreux mail ?")
    if (confirmation) {
      this.seancesservice.MailRelance().then((retour) => {
        if (retour) {
          let o = errorService.OKMessage("Envoi mail");
          errorService.emitChange(o);
          this.message = retour;
        } else {

          let o = errorService.CreateError("Envoi mail", "Erreur inconnue");
          errorService.emitChange(o);
        }

      }).catch((err: HttpErrorResponse) => {
        let o = errorService.CreateError("Envoi mail", err.statusText);
        errorService.emitChange(o);
      })
    }
  }

  MailTest() {
    let errorService = ErrorService.instance;
    this.seancesservice.MailTest().then((retour) => {
      if (retour) {
        let o = errorService.OKMessage("Envoi mail");
        errorService.emitChange(o);
        this.message = retour;
      } else {

        let o = errorService.CreateError("Envoi mail", "Erreur inconnue");
        errorService.emitChange(o);
      }

    }).catch((err: HttpErrorResponse) => {
      let o = errorService.CreateError("Envoi mail", err.statusText);
      errorService.emitChange(o);
    })
  }
}

