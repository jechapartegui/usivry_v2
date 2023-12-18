import { Injectable } from '@angular/core';
import { GlobalService } from './global.services';
import { environment } from 'src/environments/environment.prod';
import { lieu } from 'src/class/lieu';
import { KeyValuePair } from 'src/class/keyvaluepair';

@Injectable({
  providedIn: 'root'
})
export class LieuService {

    url = environment.usivry;
    constructor(public global: GlobalService) {
   }
   public GetAll(): Promise<lieu[]> {
    // si pas de compte rattacher, renvoyer 0 en compte avec mail : NO_ACCOUNT
    this.url = environment.usivry + 'usivry/lieu_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command:"get_all"
    };
  
    return this.global.POST(this.url, body)
      .then((response: lieu[]) => {
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
  
  public Add(lieu:lieu): Promise<number> {
    this.url = environment.usivry + 'usivry/lieu_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command:"add",
      lieu:lieu,
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
  public Update(lieu:lieu): Promise<boolean> {
    this.url = environment.usivry + 'usivry/lieu_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command:"update",
      lieu:lieu,
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
    this.url = environment.usivry + 'usivry/lieu_manage.php';
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