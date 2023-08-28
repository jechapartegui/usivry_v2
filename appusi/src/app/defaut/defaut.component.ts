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
  constructor(private coursser:CoursService, private seanceser:SeancesService, public router:Router){}
  ngOnInit(): void {
    this.coursser.GetCours().then((cours_res) =>{
      this.cours = cours_res;
    })
    this.seanceser.GetSeance().then((seance_res)=>{
      this.seances = seance_res;
    })
  }
  loggedin = RidersService.IsLoggedIn;

  Essayer(seance:Seance){
    if(this.loggedin){
      
    } else {
      
    this.router.navigate(['/gerer-riders'], { queryParams: { id: -2 } });
    }
  }
}
