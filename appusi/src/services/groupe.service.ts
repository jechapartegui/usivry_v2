import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { GlobalService } from './global.services';

@Injectable({
  providedIn: 'root'
})
export class GroupeService {


    url = environment.usivry;
    constructor(public global: GlobalService) {
   }
  
  public Update(cours:Cours): Promise<boolean> {
    this.url = environment.usivry + 'usivry/groupe_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command:"update",
      cours:cours,
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
    this.url = environment.usivry + 'usivry/groupe_manage.php';
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
  public Add(groupe:Groupe): Promise<number> {
    this.url = environment.usivry + 'usivry/groupe_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command:"add",
      cours:cours,
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
  
    public GetCours(): Promise<Cours[]> {
      this.url = environment.usivry + "usivry/groupe_manage.php";
      const body = {
        command: "get_all_byseason"
      };
  
      return this.global.POST(this.url, body)
        .then((response: Cours[]) => {
          return response;
        })
        .catch(error => {
          // Gestion de l'erreur
        return Promise.reject(error);
        });
    }
    public GetCoursLight(): Promise<KeyValuePair[]> {
      this.url = environment.usivry + "usivry/groupe_manage.php";
      const body = {
        command: "get_all_light_byseason"
      };
  
      return this.global.POST(this.url, body)
        .then((response: KeyValuePair[]) => {
          return response;
        })
        .catch(error => {
          return Promise.reject(error);
        });
    }
  
    public GetSaison() : Promise<KeyValuePair[]>{
      this.url = environment.usivry + "usivry/groupe_manage.php";
      const body = {
        command: "get_seasons_light"
      };
  
      return this.global.POST(this.url, body)
        .then((response: KeyValuePair[]) => {
          return response;
        })
        .catch(error => {
          return Promise.reject(error);
        });
    }
  }
  