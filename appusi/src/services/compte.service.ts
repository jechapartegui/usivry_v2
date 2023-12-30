import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { GlobalService } from './global.services';
import { compte } from 'src/class/compte';

@Injectable({
  providedIn: 'root'
})
export class CompteService {

  url = environment.usivry;
  constructor(public global: GlobalService) {
 }
 public GetAll(): Promise<compte[]> {
  // si pas de compte rattacher, renvoyer 0 en compte avec mail : NO_ACCOUNT
  this.url = environment.usivry + 'usivry/compte_manage.php';
  //  this.url = this.url + "login.php";
  const body = {
    command:"get_all"
  };

  return this.global.POST(this.url, body)
    .then((response: compte[]) => {
      return response;
    })
    .catch(error => {
      // Gestion de l'erreur
      return Promise.reject(error);
    });
}

public Exist(login:string): Promise<boolean> {
  this.url = environment.usivry + 'usivry/compte_manage.php';
  //  this.url = this.url + "login.php";
  const body = {
    command:"exist",
    login:login,
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

public Attacher(compte_id:number, rider_id:number): Promise<boolean> {
  this.url = environment.usivry + 'usivry/compte_manage.php';
  //  this.url = this.url + "login.php";
  const body = {
    command:"attacher",
    compte_id:compte_id,
    rider_id:rider_id,
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
public Detacher(rider_id:number): Promise<boolean> {
return this.Attacher(0, rider_id);
}
public UpdateMailRelance(compte_id:number): Promise<boolean> {
  this.url = environment.usivry + 'usivry/compte_manage.php';
  //  this.url = this.url + "login.php";
  const body = {
    command:"update_mail_relance",
    compte_id:compte_id,
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
}
