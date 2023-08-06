import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotifJechaComponent } from './custom-notification/custom-notification.component';
import { RidersService } from 'src/services/riders.service';
import { SeancesService } from 'src/services/seances.service';
import { GlobalService } from 'src/services/global.services';
import { CoursService } from 'src/services/cours.service';
import { ErrorService } from 'src/services/error.service';
import { StaticClass } from './global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  g:StaticClass;
  @ViewChild(NotifJechaComponent, { static: true }) child: NotifJechaComponent;
  title = 'US Ivry Roller';
  constructor(
    private US: RidersService,
    private TS: SeancesService,
    private PS: GlobalService,
    private SS: CoursService,
    private erroservice: ErrorService,
    private router: Router,
    public globals: StaticClass,
  ) {
    this.g = globals;
    erroservice.changeEmitted$.subscribe((data) => {
      this.DisplayError(data);
    })
  }
  
  selected: string | null = null;

  // Assurez-vous que la variable sectionElement est bien un élément HTML
  select(sectionElement: string) {

 //   sectionElement.scrollIntoView();
   // this.selected = sectionElement.id;
  }

  GoToLogin(){
    this.router.navigate(['/login']);
  }
  
  DisplayError(val) {
    this.child.display_notification(val);
  }
}

