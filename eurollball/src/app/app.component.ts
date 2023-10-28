import { Component, ViewChild } from '@angular/core';
import { Team } from './class/team';
import { TeamService } from 'src/services/team.service';
import { ErrorService } from 'src/services/error.service';
import { HttpErrorResponse } from '@angular/common/http';
import { StaticClass } from 'src/global';
import { Router } from '@angular/router';
import { NotifJechaComponent } from './custom-notification/custom-notification.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private tse: TeamService,
    private erroservice: ErrorService,
    private router: Router,
    public globals: StaticClass,
  ) {
    this.g = globals;
    erroservice.changeEmitted$.subscribe((data) => {
      this.DisplayError(data);
    })
  }
  g:StaticClass;
  @ViewChild(NotifJechaComponent, { static: true }) child: NotifJechaComponent;
  public title = 'Anywhere / Anytimes Series - Europe';
  public team = new Team();
  DisplayError(val) {
    this.child.display_notification(val);
  }
  submitForm() {
    let errorservice = ErrorService.instance;
    this.tse.SubmitTeam(this.team).then((bool) => {
      if (bool) {
        let o = errorservice.OKMessage("Registration OK - you will receive a mail");
        errorservice.emitChange(o);
        this.team = new Team();
      } else {
        let o = errorservice.CreateError("Registration failed", "Unknown error");
        errorservice.emitChange(o);
      }
    }).catch((elkerreur: HttpErrorResponse) => {
      let o = errorservice.CreateError("Registration failed", elkerreur.statusText);
      errorservice.emitChange(o);
    })
  }

   /* Test(){
    let errorservice = ErrorService.instance;
    this.tse.Test().then((re)=> {
      if (re) {
        let o = errorservice.OKMessage("re");
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

  Test2(){
    let errorservice = ErrorService.instance;
    this.tse.Test2().then((re)=> {
      if (re) {
        let o = errorservice.OKMessage(re);
        errorservice.emitChange(o);
      } else {
        let o = errorservice.CreateError("Registration failed", "Unknown error");
        errorservice.emitChange(o);
      }
    }).catch((elkerreur: HttpErrorResponse) => {
      let o = errorservice.CreateError("Registration failed", elkerreur.statusText);
      errorservice.emitChange(o);
    })
  }  */


}
