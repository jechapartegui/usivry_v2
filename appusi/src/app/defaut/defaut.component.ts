import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cours } from 'src/class/cours';
import { Rider } from 'src/class/riders';
import { Seance } from 'src/class/seance';
import { CoursService } from 'src/services/cours.service';
import { SeancesService } from 'src/services/seances.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorService } from 'src/services/error.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-defaut',
  templateUrl: './defaut.component.html',
  styleUrls: ['./defaut.component.css']
})
export class DefautComponent implements OnInit {
  public cours: Cours[] = [];
  public seances: Seance[] = [];
  public lundi: boolean;
  public mercredi: boolean;
  public mardi: boolean;
  public jeudi: boolean;
  public vendredi: boolean;
  public samedi: boolean;
  public dimanche: boolean;
  public essai: Essai;

  constructor(private coursser: CoursService, private seanceser: SeancesService, public router: Router, public dialog: MatDialog) {

  }
  ngOnInit(): void {
    this.coursser.GetCours().then((cours_res) => {
      this.cours = cours_res;
      this.lundi = this.cours.some(x => x.jour_semaine == 'lundi');
      this.mardi = this.cours.some(x => x.jour_semaine == 'mardi');
      this.mercredi = this.cours.some(x => x.jour_semaine == 'mercredi');
      this.jeudi = this.cours.some(x => x.jour_semaine == 'jeudi');
      this.vendredi = this.cours.some(x => x.jour_semaine == 'vendredi');
      this.samedi = this.cours.some(x => x.jour_semaine == 'samedi');
      this.dimanche = this.cours.some(x => x.jour_semaine == 'dimanche');
    })
    this.seanceser.GetSeance().then((seance_res) => {
      this.seances = seance_res;
    })
  }
  comparedate(dateString: string): boolean {
    const djr = new Date();
    const date = new Date(dateString);


    if (date > djr) {
      return true;
    } else {
      return false;
    }
  }


  Essayer(thiss: Seance) {
    this.essai = new Essai();
    this.essai.seance = thiss;
    this.essai.rider = new Rider();
    const dialogRef = this.dialog.open(PopInEssai, {
      width: '400px',
      data: { essai: this.essai }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.essai = result;
    });
  }

}

@Component({
  selector: 'popin-essai',
  templateUrl: 'popin-essai.html',
})
export class PopInEssai {

  constructor(
    public dialogRef: MatDialogRef<PopInEssai>,
    @Inject(MAT_DIALOG_DATA) public data: any, public seanceservice : SeancesService) {
     }

  onNoClick(): void {
    this.dialogRef.close();
  }
  saveRider() {
    let errorservice = ErrorService
    let act = "Faire un essai";
    this.seanceservice.Essayer(this.data.essai).then((result) =>{
      if (result) {
        // Suppression réussie en base, supprimer l'élément correspondant de la liste
       
    
        // Afficher un message de confirmation à l'utilisateur
        errorservice.instance.OKMessage(act);
      } else {
        errorservice.instance.CreateError(act,"erreur inconnue");
      }
    }).catch((elkerreur:HttpErrorResponse)=>{
        errorservice.instance.CreateError(act,  elkerreur.statusText);
      })
    }
  }

export class Essai {
  seance: Seance;
  rider: Rider;
  constructor() {
    this.seance = new Seance();
    this.rider = new Rider();
  }
}
