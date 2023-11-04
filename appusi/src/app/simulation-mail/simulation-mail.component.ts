import { Component } from '@angular/core';

@Component({
  selector: 'app-simulation-mail',
  templateUrl: './simulation-mail.component.html',
  styleUrls: ['./simulation-mail.component.css']
})
export class SimulationMailComponent {
public mails:MailObjet[] = [];

}
export class MailObjet{
  public subject:string;
  public to:string;
  public content:string;
}
