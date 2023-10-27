import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Team } from 'src/app/class/team';
import { GlobalService } from './global.services';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  url = environment.usivry;
  constructor(public global: GlobalService) {
 }
  public SubmitTeam(team:Team): Promise<boolean> {
    this.url = environment.usivry + 'usivry/rollball_manage.php';
    //  this.url = this.url + "login.php";
    const body = {
      command:"suscribe",
      team:team
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
