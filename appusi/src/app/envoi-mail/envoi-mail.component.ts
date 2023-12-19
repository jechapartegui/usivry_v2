import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MailData, MailData_VM } from 'src/class/mail';
import { ErrorService } from 'src/services/error.service';
import { MailService } from 'src/services/mail.service';
import { notification } from '../custom-notification/custom-notification.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-envoi-mail',
  templateUrl: './envoi-mail.component.html',
  styleUrls: ['./envoi-mail.component.css']
})
export class EnvoiMailComponent implements OnInit {

  @Input() mails: MailData[];
  public afficher_mail: boolean = false;
  public liste_mail_VM: MailData_VM[];
  public liste_mail: MailData[];
  action: string;

  constructor(
    private router: Router,
    private serviceMail: MailService,
    private errorservice: ErrorService
  ) { }

  ngOnInit(): void {
    this.action = $localize`récupérer les mails`;
    let o: notification;
    const errorService = ErrorService.instance;
    this.liste_mail = [];
    this.liste_mail_VM = [];
    this.mails.forEach((mail) => {
      this.serviceMail.Load(mail).then((mail_complet) => {
        this.liste_mail.push(mail_complet);
        this.liste_mail_VM.push(new MailData_VM(mail_complet));
        errorService.OKMessage(this.action);
        errorService.emitChange(o);
      }).catch((err: HttpErrorResponse) => {
        errorService.CreateError(this.action, err.statusText);
        errorService.emitChange(o);
        this.router.navigate(['/menu-inscription']);
      })
    })
  }

  Send(amil: MailData_VM) {
    this.action = $localize`Envoyer l'email`;
    let o: notification;
    const errorService = ErrorService.instance;
    this.serviceMail.Send(amil.ToMailData()).then((retour) => {
      if (retour) {
        errorService.OKMessage(this.action);
        errorService.emitChange(o);
      } else {
        errorService.CreateError(this.action, $localize`Erreur inconnue`);
        errorService.emitChange(o);
      }
    }).catch((err: HttpErrorResponse) => {
      errorService.CreateError(this.action, err.statusText);
      errorService.emitChange(o);
    })
  }
  Save(amil: MailData_VM) {
    this.action = $localize`Sauvarger l'email`;
    let o: notification;
    const errorService = ErrorService.instance;
    this.serviceMail.Save(amil.ToMailData()).then((mail) => {
      if (mail.id>0) {
        const indexToUpdate = this.liste_mail.findIndex(m => m.subject === rider.id);
        if (indexToUpdate !== -1) {
          // Remplacer l'élément à l'index trouvé par la nouvelle valeur
          this.list_rider[indexToUpdate] = rider.ToRider();
        }
        const indexToUpdateVM = this.list_rider_VM.findIndex(rider => rider.id === rider.id);
        if (indexToUpdateVM !== -1) {
          // Remplacer l'élément à l'index trouvé par la nouvelle valeur
          this.list_rider_VM[indexToUpdateVM] = rider;
        }
        errorService.OKMessage(this.action);
        errorService.emitChange(o);
      } else {
        errorService.CreateError(this.action, $localize`Erreur inconnue`);
        errorService.emitChange(o);
      }
    }).catch((err: HttpErrorResponse) => {
      errorService.CreateError(this.action, err.statusText);
      errorService.emitChange(o);
    })
  }

}
