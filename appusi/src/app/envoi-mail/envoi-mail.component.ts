import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MailData, MailData_VM } from 'src/class/mail';
import { ErrorService } from 'src/services/error.service';
import { MailService } from 'src/services/mail.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  public selected_mail:MailData_VM;
  public new_destinataire:string;
  action: string;

  constructor(
    private router: Router,
    private serviceMail: MailService,
    private errorservice: ErrorService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.action = $localize`récupérer les mails`;
    const errorService = ErrorService.instance;
    this.liste_mail = [];
    this.liste_mail_VM = [];
    this.mails.forEach((mail) => {
      this.serviceMail.Load(mail).then((mail_complet) => {
        this.liste_mail.push(mail_complet);
        this.liste_mail_VM.push(new MailData_VM(mail_complet));
        let o = errorService.OKMessage(this.action);
        errorService.emitChange(o);
      }).catch((err: HttpErrorResponse) => {
        let o = errorService.CreateError(this.action, err.statusText);
        errorService.emitChange(o);
        //  this.router.navigate(['/menu-inscription']);
      })
    })
  }


  // Ajoutez une méthode pour sécuriser le contenu HTML
  getSafeContent(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.selected_mail.content);
  }

  Send(amil: MailData_VM) {
    this.action = $localize`Envoyer l'email`;
    const errorService = ErrorService.instance;
    this.serviceMail.Send(amil.ToMailData()).then((retour) => {
      if (retour) {
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
  Save(amil: MailData_VM) {
    this.action = $localize`Sauvegarder l'email`;
    const errorService = ErrorService.instance;
    this.serviceMail.Save(amil.ToMailData()).then((mail) => {
      if (mail.id > 0) {
        const indexToUpdate = this.liste_mail.findIndex(m => m.subject === mail.subject && m.content === mail.content);
        if (indexToUpdate !== -1) {
          // Remplacer l'élément à l'index trouvé par la nouvelle valeur
          this.liste_mail[indexToUpdate] = mail;
        }
        const indexToUpdateVM = this.liste_mail_VM.findIndex(m => m.subject === mail.subject && m.content === mail.content);
        if (indexToUpdateVM !== -1) {
          // Remplacer l'élément à l'index trouvé par la nouvelle valeur
          this.liste_mail_VM[indexToUpdateVM] = new MailData_VM(mail);
        }
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

}
