import { Injectable } from '@angular/core';
import { MailData } from 'src/class/mail';
import { environment } from 'src/environments/environment.prod';
import { GlobalService } from './global.services';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  url = environment.usivry;
  constructor(public global: GlobalService) {

   }

   Send(mail:MailData) : Promise<boolean>{
    this.url = environment.usivry + 'usivry/mail_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command:"send",
      mail:mail,
    };
  
    return this.global.POST(this.url, body)
      .then((response: boolean) => {
        return response;
      })
      .catch(error => {
        // Gestion de l'erreur
        return Promise.reject(error);
      });
   }
   Load(mail:MailData) : Promise<MailData>{
    this.url = environment.usivry + 'usivry/mail_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command:"load",
      mail:mail,
    };
  
    return this.global.POST(this.url, body)
      .then((response: MailData) => {
        return response;
      })
      .catch(error => {
        // Gestion de l'erreur
        return Promise.reject(error);
      });
   }
   Save(mail:MailData) : Promise<MailData>{
    this.url = environment.usivry + 'usivry/mail_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command:"save",
      mail:mail,
    };
  
    return this.global.POST(this.url, body)
      .then((response: MailData) => {
        return response;
      })
      .catch(error => {
        // Gestion de l'erreur
        return Promise.reject(error);
      });
   }
   GetAll(saisonencours:boolean = true,datedebut:Date, datefin:Date, envoye:boolean,categorie:"INDIVIDUEL" | "GROUPE" | "ANNULATION" | "RELANCE" | "SEANCE" ): Promise<MailData[]>{
    this.url = environment.usivry + 'usivry/mail_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command:"get_all",
      saisonencours:saisonencours,
      datedebut:datedebut,
      datefin:datefin,
      envoye:envoye,
      categorie:categorie
    };
  
    return this.global.POST(this.url, body)
      .then((response: MailData[]) => {
        return response;
      })
      .catch(error => {
        // Gestion de l'erreur
        return Promise.reject(error);
      });
   }

}
