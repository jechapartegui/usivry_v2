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

  public Logout():Promise<boolean>{
    this.url = environment.usivry + 'usivry/login.php';
    //  this.url = this.url + "login.php";
    const body = {
      logout:true,
    };

    return this.global.POST(this.url, body)
      .then((response: boolean) => {
        RidersService.isLoggedIn = false;
        RidersService.account = 0;
        RidersService.email = "";
        RidersService.Riders = [];
        RidersService.Est_Admin =false;
        RidersService.Est_Prof = false;
        this.updateLoggedInStatus(false);
        return true;
      })
      .catch(error => {
        // Gestion de l'erreur
        return Promise.reject(error);
      });
  }

  public RecupMDP(login:string):Promise<boolean>{
    this.url = environment.usivry + 'usivry/login.php';
    //  this.url = this.url + "login.php";
    const body = {
      login:login,
      renvoi_mdp:true
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
      riders: riders
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

  public Add_NoPassword_Inscription(rider: Rider, command:string): Promise<Rider> {
    const body = {
      command: command,
      rider: rider,    
      with_psw:true,    
      inscription_saison_encours : true,
    }
    return this.Add(body, rider);
  }
  
  public Add_Password_Inscription(rider: Rider, command:string): Promise<Rider> {
    const body = {
      command: command,
      rider: rider,
      inscription_saison_encours : true
    }
    return this.Add(body, rider);
  }
  public Add_NoPassword_NoInscription(rider: Rider, command:string): Promise<Rider> {
    const body = {
      command: command,
      with_psw:true,  
      rider: rider
    }
    return this.Add(body, rider);
  }
  
  public Add_Password_NoInscription(rider: Rider, command:string): Promise<Rider> {
    const body = {
      command: command,
      rider: rider,
    }
    return this.Add(body, rider);
  }


  public Add(body, rider): Promise<Rider> {
    this.url = environment.usivry + 'usivry/rider_manage.php';

    return this.global.POST(this.url, body)
      .then((response: number) => {
        rider.id =response
        return rider;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public GetAllEver():Promise<Rider[]>{
    const body = {
      command: "get_all",
      all: true
    }
    return this.GetAll(body);
  }
  public GetAllSearch(search:string):Promise<Rider[]>{
    const body = {
      command: "get_all",
      all: true,
      search: search
    }
    return this.GetAll(body);
  }
  public GetAllSearchSeason(search:string, season_id:number):Promise<Rider[]>{
    const body = {
      command: "get_all",
      season_id: season_id,
      search: search
    }
    return this.GetAll(body);
  }
  public GetAllSearchActive(search:string):Promise<Rider[]>{
    const body = {
      command: "get_all",
      search: search
    }
    return this.GetAll(body);
  }
  public GetAllThisSeason():Promise<Rider[]>{
    const body = {
      command: "get_all"
    }
    return this.GetAll(body);
  }
  public GetAllSeason(season_id :number):Promise<Rider[]>{
    const body = {
      command: "get_all",
      season_id: season_id
    }
    return this.GetAll(body);
  }
  public GetAll(body): Promise<Rider[]> {
    this.url = environment.usivry + 'usivry/rider_manage.php';

    return this.global.POST(this.url, body)
      .then((response: Rider[]) => {
        
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
  public Update(rider:Rider): Promise<boolean> {
    this.url = environment.usivry + "usivry/rider_manage.php";
    const body = {
      command: "update",
      rider:rider
    };

    return this.global.POST(this.url, body)
      .then((response: boolean) => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
  public Inscrire(id:number): Promise<boolean> {
    this.url = environment.usivry + "usivry/rider_manage.php";
    const body = {
      command: "register",
      id:id
    };

    return this.global.POST(this.url, body)
      .then((response: boolean) => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
  public UpdateMail(compte:number, mail:string, password:string): Promise<boolean> {
    this.url = environment.usivry + "usivry/rider_manage.php";
    const body = {
      command: "update_mail",
      compte:compte,
      mail:mail,
      password:password
    };

    return this.global.POST(this.url, body)
      .then((response: boolean) => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public UpdateMDP(email:string, mdp_actuel:string, new_mdp:string): Promise<boolean> {
    this.url = environment.usivry + "usivry/rider_manage.php";
    const body = {
      command: "update_password",
      email:email,
      mdp_actuel:mdp_actuel,
      new_mdp:new_mdp
    };

    return this.global.POST(this.url, body)
      .then((response: boolean) => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public Delete(id:number): Promise<boolean> {
    this.url = environment.usivry + "usivry/rider_manage.php";
    const body = {
      command: "delete",
      id:id
    };

    return this.global.POST(this.url, body)
      .then((response: boolean) => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
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
      return Promise.reject(error);
      });
  }
}
