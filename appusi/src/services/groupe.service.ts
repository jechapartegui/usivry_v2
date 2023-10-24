import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { GlobalService } from './global.services';
import { Groupe, Lien_Groupe } from 'src/class/groupe';

@Injectable({
  providedIn: 'root'
})
export class GroupeService {


  url = environment.usivry;
  constructor(public global: GlobalService) {
  }
  
  public Add(groupe: Groupe): Promise<number> {
    this.url = environment.usivry + 'usivry/groupe_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command: "add",
      groupe: groupe,
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
  public Update(groupe: Groupe): Promise<boolean> {
    this.url = environment.usivry + 'usivry/groupe_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command: "update",
      groupe: groupe,
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
  public Delete(id: number): Promise<boolean> {
    this.url = environment.usivry + 'usivry/groupe_manage.php';
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

  public Get(id: number): Promise<Groupe> {
    this.url = environment.usivry + "usivry/groupe_manage.php";
    const body = {
      command: "get",
      id:id
    };

    return this.global.POST(this.url, body)
      .then((response: Groupe) => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  public GetAll(): Promise<Groupe[]> {
    this.url = environment.usivry + "usivry/groupe_manage.php";
    const body = {
      command: "get_all"
    };

    return this.global.POST(this.url, body)
      .then((response: Groupe[]) => {
        return response;
      })
      .catch(error => {
        // Gestion de l'erreur
        return Promise.reject(error);
      });
  }
  public GetAllEver(saison_id = 0): Promise<Groupe[]> {
    this.url = environment.usivry + "usivry/groupe_manage.php";
    const body = {
      command: "get_all",
      saison_id: saison_id
    };

    return this.global.POST(this.url, body)
      .then((response: Groupe[]) => {
        return response;
      })
      .catch(error => {
        // Gestion de l'erreur
        return Promise.reject(error);
      });
  }
  
  public UpdateLienGroupe(LG :Lien_Groupe): Promise<boolean> {
    this.url = environment.usivry + 'usivry/groupe_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command: "update_lien_groupe",
      lien_groupe: LG,
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
  
  public GetAllLienGroupe(objet_id:number, objet_type:string): Promise<Groupe[]> {
    this.url = environment.usivry + "usivry/groupe_manage.php";
    const body = {
      command: "get_all_lien_groupe",
      objet_id:objet_id,
      objet_type:objet_type
    };

    return this.global.POST(this.url, body)
      .then((response: Groupe[]) => {
        return response;
      })
      .catch(error => {
        // Gestion de l'erreur
        return Promise.reject(error);
      });
  }
  public GetAllLienGroupeObjet(objet_type:string): Promise<Lien_Groupe[]> {
    this.url = environment.usivry + "usivry/groupe_manage.php";
    const body = {
      command: "get_all_lien_groupe_objet",
      objet_type:objet_type
    };

    return this.global.POST(this.url, body)
      .then((response: Lien_Groupe[]) => {
        return response;
      })
      .catch(error => {
        // Gestion de l'erreur
        return Promise.reject(error);
      });
  }


  
}
