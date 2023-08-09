import { Injectable } from '@angular/core';
import { Rider } from 'src/class/riders';
import { KeyValuePair } from 'src/class/keyvaluepair';
import { GlobalService } from './global.services';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class RidersService {
  static instance: RidersService;
  static get ListeRiders(): Rider[] {
    return RidersService.Riders;
  }
  
  static get GetName(): string {
    return RidersService.email;
  }
  
  static get IsLoggedIn(): boolean {
    return RidersService.isLoggedIn;
  }
  constructor(public global: GlobalService) {
    RidersService.instance = this;
  }

  url = environment.usivry;
  
  static email: string = ''; // The name to display for the logged in user...
  static Riders: Rider[];
  static isLoggedIn: boolean = false
  currentUserId: number = 0
  currentUserLogin: string = ''

  public Login(username: string, password: string, stayLoggedIn: boolean): Promise<boolean> {
    this.url = environment.usivry + 'usivry/login.php';
    //  this.url = this.url + "login.php";
    const body = {
      username: username,
      password: password,
      stayLoggedIn: stayLoggedIn
    };

    return this.global.POST(this.url, body)
      .then((response: Rider[]) => {
        RidersService.isLoggedIn = true;
        RidersService.email = username;
        RidersService.Riders = response;
        return true;
      })
      .catch(error => {
        // Gestion de l'erreur
        return Promise.reject('Une erreur s\'est produite lors de la connexion.');
      });
  }

  public AddRange(riders: Rider[]): Promise<boolean> {
    this.url = environment.usivry + "usivry/rider_manage.php";
    const body = {
      command: "add_range",
      riders: riders,
      password: environment.password
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

  public GetProf(): Promise<KeyValuePair[]> {
    this.url = environment.usivry + "usivry/rider_manage.php";
    const body = {
      command: "get_prof_light",
    };

    return this.global.POST(this.url, body)
      .then((response: KeyValuePair[]) => {
        return response;
      })
      .catch(error => {
        // Gestion de l'erreur
        return Promise.reject('Une erreur s\'est produite lors de la connexion.');
      });
  }
}
