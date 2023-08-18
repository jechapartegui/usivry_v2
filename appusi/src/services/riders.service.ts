import { Injectable } from '@angular/core';
import { Rider } from 'src/class/riders';
import { KeyValuePair } from 'src/class/keyvaluepair';
import { GlobalService } from './global.services';
import { environment } from 'src/environments/environment.prod';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RidersService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  updateLoggedInStatus(isLoggedIn: boolean): void {
    this.isLoggedInSubject.next(isLoggedIn);
  }
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
  static Est_Admin:boolean = false;
  static Est_Prof:boolean =false;
  constructor(public global: GlobalService) {
    RidersService.instance = this;
  }

  url = environment.usivry;
  
  static email: string = ''; // The name to display for the logged in user...
  static Riders: Rider[];
  static account:number;
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
        this.updateLoggedInStatus(true);
        RidersService.account = response[0].compte;
        RidersService.email = username;
        RidersService.Riders = response;
        response.forEach(rider => {
          if(rider.est_admin){
            RidersService.Est_Admin = true;
          } 
          if(rider.est_prof){
            RidersService.Est_Prof = true;
          } 
        });
        return true;
      })
      .catch(error => {
        // Gestion de l'erreur
        this.updateLoggedInStatus(false);
        return Promise.reject(error);
      });
  }

  public GetRiders(): Promise<boolean> {
    this.url = environment.usivry + 'usivry/rider_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command: "get",
      id: RidersService.account
    };

    return this.global.POST(this.url, body)
      .then((response: Rider[]) => {
        RidersService.isLoggedIn = true;
        RidersService.account = response[0].compte;
        RidersService.Riders = response;
        response.forEach(rider => {
          if(rider.est_admin){
            RidersService.Est_Admin = true;
          } 
          if(rider.est_prof){
            RidersService.Est_Prof = true;
          } 
        });
        return true;
      })
      .catch(error => {
        return Promise.reject(error);
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
