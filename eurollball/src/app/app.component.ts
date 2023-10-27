import { Component } from '@angular/core';
import { Team } from './class/team';
import { TeamService } from 'src/services/team.service';
import { ErrorService } from 'src/services/error.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private tse: TeamService) {
    console.log("test");
  }

  public title = 'Anywhere / Anytimes Series - Europe';
  public team = new Team();
  submitForm() {
    let errorservice = ErrorService.instance;
    this.tse.SubmitTeam(this.team).then((bool) => {
      if (bool) {
        let o = errorservice.OKMessage("Registration OK - you will receive a mail");
        errorservice.emitChange(o);
      } else {
        let o = errorservice.CreateError("Registration failed", "Unknown error");
        errorservice.emitChange(o);
      }
    }).catch((elkerreur: HttpErrorResponse) => {
      let o = errorservice.CreateError("Registration failed", elkerreur.statusText);
      errorservice.emitChange(o);
    })
  }


}
