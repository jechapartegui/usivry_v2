import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MailData } from 'src/class/mail';
import { ErrorService } from 'src/services/error.service';
import { SeancesService } from 'src/services/seances.service';

@Component({
  selector: 'app-simulation-mail',
  templateUrl: './simulation-mail.component.html',
  styleUrls: ['./simulation-mail.component.css']
})
export class SimulationMailComponent {
  public notif_envoi: string[];
  constructor(
    public dialogRef: MatDialogRef<SimulationMailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public seanceservice: SeancesService) {
  }


  SendAll() {
    let errorService = ErrorService.instance;
    let confirmation = window.confirm("Voulez-vous envoyer le message à tous les adhérents ? Cette action entrainera l'envoi de nombreux mails ?")
    if (confirmation) {
      this.seanceservice.EnvoyerMails(this.data.mails).then((retour) => {
        this.notif_envoi = retour;
      }).catch((err: HttpErrorResponse) => {
        let o = errorService.CreateError("Envoi mail", err.statusText);
        errorService.emitChange(o);
      })
    }
  }
  Send(mail:MailData) {
    let errorService = ErrorService.instance;
    let confirmation = window.confirm("Voulez-vous envoyer le message à tous les adhérents ? Cette action entrainera l'envoi de nombreux mails ?")
    if (confirmation) {
      this.seanceservice.EnvoyerMail(mail).then((retour) => {
        this.notif_envoi = retour;
      }).catch((err: HttpErrorResponse) => {
        let o = errorService.CreateError("Envoi mail", err.statusText);
        errorService.emitChange(o);
      })
    }
  }
  Quitter(): void {
    this.dialogRef.close();
  }
}

