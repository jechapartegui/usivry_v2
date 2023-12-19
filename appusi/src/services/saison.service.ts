import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { GlobalService } from './global.services';
import { saison } from 'src/class/saison';
import { KeyValuePair } from 'src/class/keyvaluepair';

@Injectable({
  providedIn: 'root'
})
export class SaisonService {

  url = environment.usivry;
  constructor(public global: GlobalService) {
 }
 public GetAll(): Promise<saison[]> {
  // si pas de compte rattacher, renvoyer 0 en compte avec mail : NO_ACCOUNT
  this.url = environment.usivry + 'usivry/saison_manage.php';
  //  this.url = this.url + "login.php";
  const body = {
    command:"get_all"
  };

  return this.global.POST(this.url, body)
    .then((response: saison[]) => {
      return response;
    })
    .catch(error => {
      // Gestion de l'erreur
      return Promise.reject(error);
    });
}
public GetAllLight(): Promise<KeyValuePair[]> {
  // si pas de compte rattacher, renvoyer 0 en compte avec mail : NO_ACCOUNT
  this.url = environment.usivry + 'usivry/lieu_manage.php';
  //  this.url = this.url + "login.php";
  const body = {
    command:"get_all_light"
  };

  return this.global.POST(this.url, body)
    .then((response: KeyValuePair[]) => {
      return response;
    })
    .catch(error => {
      // Gestion de l'erreur
      return Promise.reject(error);
    });
}

public Add(saison:saison): Promise<number> {
  this.url = environment.usivry + 'usivry/saison_manage.php';
  //  this.url = this.url + "login.php";
  const body = {
    command:"add",
    saison:saison,
  };

  return this.global.POST(this.url, body)
    .then((response: number) => {
      return response;
    })
    .catch(error => {
      // Gestion de l'erreur
      return Promise.reject(error);
    });
}
public Update(saison:saison): Promise<boolean> {
  this.url = environment.usivry + 'usivry/saison_manage.php';
  //  this.url = this.url + "login.php";
  const body = {
    command:"update",
    saison:saison,
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
public Delete(id:number): Promise<boolean> {
  this.url = environment.usivry + 'usivry/saison_manage.php';
  //  this.url = this.url + "login.php";
  const body = {
    command:"delete",
    id:id,
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
