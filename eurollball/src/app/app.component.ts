import { Component } from '@angular/core';
import { Team } from './class/team';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'Anywhere / Anytimes Series - Europe';
  public team = new Team();
  submitForm(){

  }
}
