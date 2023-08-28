import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotifJechaComponent } from './custom-notification/custom-notification.component';
import { RidersService } from 'src/services/riders.service';
import { ErrorService } from 'src/services/error.service';
import { StaticClass } from './global';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  g:StaticClass;
  @ViewChild(NotifJechaComponent, { static: true }) child: NotifJechaComponent;
  title = 'US Ivry Roller';
  constructor(
    public ridersService:RidersService,
    private erroservice: ErrorService,
    private router: Router,
    public globals: StaticClass,
  ) {
    this.g = globals;
    erroservice.changeEmitted$.subscribe((data) => {
      this.DisplayError(data);
    })
  }
  ngOnInit(): void {
   
  }
  loggedin = RidersService.IsLoggedIn;


  GoToLogin(){
    this.router.navigate(['/login']);
  }
  Logout(){
    const errorService = ErrorService.instance;
    this.ridersService.Logout().then((boo) =>{
      if(boo){
        let o = errorService.OKMessage("Déconnexion");
        errorService.emitChange(o);
      } else {
        let o = errorService.CreateError("Déconnexion", "Erreur inconnue");
        errorService.emitChange(o);
      }
    }).catch((error:Error)=>{
      let o = errorService.CreateError("Déconnexion", error.message);
      errorService.emitChange(o);
    });
    this.router.navigate(['/defaut']);
  }
  GoToMI(){
    this.router.navigate(['/menu-inscription']);
  }
  
  DisplayError(val) {
    this.child.display_notification(val);
  }
}

