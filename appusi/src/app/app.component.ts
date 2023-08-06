import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'US Ivry Roller';
  constructor(private router: Router){}
  
  selected: string | null = null;

  // Assurez-vous que la variable sectionElement est bien un élément HTML
  select(sectionElement: string) {

 //   sectionElement.scrollIntoView();
   // this.selected = sectionElement.id;
  }

  GoToLogin(){
    this.router.navigate(['/login']);
  }
}

