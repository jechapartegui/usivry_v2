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
  isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  g:StaticClass;
  @ViewChild(NotifJechaComponent, { static: true }) child: NotifJechaComponent;
  title = 'US Ivry Roller';
  constructor(
    private ridersService:RidersService,
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
  //loggedin3 = this.US.currentUserLogin;
  selected: string | null = null;

  // Assurez-vous que la variable sectionElement est bien un élément HTML
  select(sectionElement: string) {
    console.log(RidersService.GetName);
    console.log(RidersService.IsLoggedIn);
    console.log(RidersService.isLoggedIn);
    console.log(RidersService.ListeRiders);
    console.log(RidersService.Riders);
    console.log(RidersService.email);
    console.log(RidersService.instance);
//console.log(this.loggedin3);
 //   sectionElement.scrollIntoView();
   // this.selected = sectionElement.id;
  }

  GoToLogin(){
    this.router.navigate(['/login']);
  }
  Logout(){
    this.router.navigate(['/']);
  }
  GoToMI(){
    this.router.navigate(['/menu-inscription']);
  }
  
  DisplayError(val) {
    this.child.display_notification(val);
  }
}

