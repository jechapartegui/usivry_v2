import { Injectable } from '@angular/core';
import { Rider } from 'src/class/riders';
import { GlobalService } from './global.services';
import { environment } from 'src/environments/environment.prod';
import { Seance } from 'src/class/seance';
import { Inscription, InscriptionSeance } from 'src/class/inscription';
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

  public Update(seance: Seance): Promise<boolean> {
    this.url = environment.usivry + 'usivry/seance_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command: "update",
      seance: seance,
    };

    return this.global.POST(this.url, body)
      .then((response: boolean) => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
  public Delete(id: number): Promise<boolean> {
    this.url = environment.usivry + 'usivry/seance_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command: "delete",
      id: id,
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


  public Add(seance: Seance): Promise<number> {
    this.url = environment.usivry + 'usivry/seance_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command: "add",
      seance: seance,
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
  public NotifierAnnulation(id: number, message:string ): Promise<boolean> {
    this.url = environment.usivry + 'usivry/seance_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command: "notifier_annulation",
      seance_id: id,
      message: message
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
  public GetAllSeances(all: boolean = false): Promise<Seance[]> {
    this.url = environment.usivry + "usivry/seance_manage.php";

    const body = {
      command: "get_all",
      all: all,
    };


    return this.global.POST(this.url, body)
      .then((response: Seance[]) => {
        return response;
      })
      .catch(error => {
        // Gestion de l'erreur
        return Promise.reject(error);
      });
  }
  public GetSeance(): Promise<Seance[]> {
    this.url = environment.usivry + 'usivry/seance_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command: "get_seance_plagedate"
    };

    return this.global.POST(this.url, body)
      .then((response: Seance[]) => {
        SeancesService.Seances = response;
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
  public MailRelance(): Promise<string> {
    this.url = environment.usivry + 'usivry/seance_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command: "mail_relance"
    };

    return this.global.POST(this.url, body)
      .then((response: string) => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
  public MailTest(): Promise<string> {
    this.url = environment.usivry + 'usivry/seance_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command: "mail_test"
    };

    return this.global.POST(this.url, body)
      .then((response: string) => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
  public Get(id: number): Promise<Seance> {
    this.url = environment.usivry + 'usivry/seance_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command: "get",
      id: id
    };

    return this.global.POST(this.url, body)
      .then((response: Seance) => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public UpdatePresence(item: InscriptionSeance): Promise<boolean> {
    this.url = environment.usivry + 'usivry/seance_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command: "update_inscription_seance",
      inscription: item,
    };

    return this.global.POST(this.url, body)
      .then((response: boolean) => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
  public ChargerSeance(id: number): Promise<InscriptionSeance[]> {
    this.url = environment.usivry + 'usivry/seance_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command: "load_seance",
      id: id,
    };

    return this.global.POST(this.url, body)
      .then((response: InscriptionSeance[]) => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }



  public inscrire(inscription: Inscription): Promise<number> {
    this.url = environment.usivry + 'usivry/inscriptionseance_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      inscription: inscription,
      command: "add"
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

  public desinscrire(inscription: Inscription): Promise<boolean> {
    let act = "Se désinscrire de la séance";
    let errorservice = ErrorService;
    this.url = environment.usivry + 'usivry/inscriptionseance_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      inscription: inscription,
      command: "update"
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
  public Delete_inscription(id: number): Promise<boolean> {
    let act = "Supprimer l'inscription";
    let errorservice = ErrorService;
    this.url = environment.usivry + 'usivry/inscriptionseance_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      id: id,
      command: "delete"
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
