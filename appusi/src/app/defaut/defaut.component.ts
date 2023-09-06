import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cours } from 'src/class/cours';
import { Seance } from 'src/class/seance';
import { CoursService } from 'src/services/cours.service';
import { RidersService } from 'src/services/riders.service';
import { SeancesService } from 'src/services/seances.service';

@Component({
  selector: 'app-defaut',
  templateUrl: './defaut.component.html',
  styleUrls: ['./defaut.component.css']
})
export class DefautComponent implements OnInit {
  public cours:Cours[] = [];
  public seances:Seance[] = [];
  public lundi : boolean;
  public mercredi : boolean;
  public mardi : boolean;
  public jeudi : boolean;
  public vendredi : boolean;
  public samedi : boolean;
  public dimanche : boolean;
  constructor(private coursser:CoursService, private seanceser:SeancesService, public router:Router){}
  ngOnInit(): void {
    this.coursser.GetCours().then((cours_res) =>{
      this.cours = cours_res;
      this.lundi = this.cours.some(x => x.jour_semaine == 'lundi');
      this.mardi = this.cours.some(x => x.jour_semaine == 'mardi');
      this.mercredi = this.cours.some(x => x.jour_semaine == 'mercredi');
      this.jeudi = this.cours.some(x => x.jour_semaine == 'jeudi');
      this.vendredi = this.cours.some(x => x.jour_semaine == 'vendredi');
      this.samedi = this.cours.some(x => x.jour_semaine == 'samedi');
      this.dimanche = this.cours.some(x => x.jour_semaine == 'dimanche');
    })
    this.seanceser.GetSeance().then((seance_res)=>{
      this.seances = seance_res;
    })
  }
  

  Essayer(seance:Seance){
    const loggedin = RidersService.IsLoggedIn;
    if(loggedin){
      this.router.navigate(['/menu-inscription']);
    } else {
      
    this.router.navigate(['/gerer-riders'], { queryParams: { id: -2 } });
    }
  }
}
