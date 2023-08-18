import { Injectable } from '@angular/core';
import { Rider } from 'src/class/riders';
import { GlobalService } from './global.services';
import { environment } from 'src/environments/environment.prod';
import { Seance } from 'src/class/seance';
import { Inscription } from 'src/class/inscription';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class SeancesService {
  static instance: SeancesService;
  static get ListeSeance(): Seance[] {
    return SeancesService.Seances;
  }
  
  constructor(public global: GlobalService) {
    SeancesService.instance = this;
  }

  url = environment.usivry;
  
  static Seances: Seance[];

  public Update(seance:Seance): Promise<boolean> {
    this.url = environment.usivry + 'usivry/seance_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command:"update",
      seance:seance,
    };
  
    return this.global.POST(this.url, body)
      .then((response: boolean) => {
        return response;
      })
      .catch(error => {
        // Gestion de l'erreur
        return Promise.reject('Une erreur s\'est produite lors de la connexion.');
      });
  }
  public Delete(id:number): Promise<boolean> {
    this.url = environment.usivry + 'usivry/seance_manage.php';
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
        return Promise.reject('Une erreur s\'est produite lors de la connexion.');
      });
  }
  public Add(seance:Seance): Promise<number> {
    this.url = environment.usivry + 'usivry/seance_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command:"add",
      seance:seance,
    };
  
    return this.global.POST(this.url, body)
      .then((response: number) => {
        return response;
      })
      .catch(error => {
        // Gestion de l'erreur
        return Promise.reject('Une erreur s\'est produite lors de la connexion.');
      });
  }
  
    public GetAllSeances(): Promise<Seance[]> {
      this.url = environment.usivry + "usivry/seance_manage.php";
      const body = {
        command: "get_all",
        password: environment.password
      };
  
      return this.global.POST(this.url, body)
        .then((response: Seance[]) => {
          return response;
        })
        .catch(error => {
          // Gestion de l'erreur
          return Promise.reject('Une erreur s\'est produite lors de la connexion.');
        });
    }
  public GetSeance(): Promise<boolean> {
    this.url = environment.usivry + 'usivry/seance_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command:"get_seance_plagedate",
      password:environment.password,
    };

    return this.global.POST(this.url, body)
      .then((response: Seance[]) => {
        SeancesService.Seances = response;
        return true;
      })
      .catch(error => {
        // Gestion de l'erreur
        return Promise.reject('Une erreur s\'est produite lors de la connexion.');
      });
  }

  

  public inscrire(inscription:Inscription): Promise<number>{
    this.url = environment.usivry + 'usivry/inscriptionseance_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      inscription:inscription,
      command:"add"
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

  public desinscrire(inscription:Inscription): Promise<boolean>{
    let act = "Se désinscrire de la séance";
    let errorservice = ErrorService;
    this.url = environment.usivry + 'usivry/inscriptionseance_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      inscription:inscription,
      command:"update"
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
