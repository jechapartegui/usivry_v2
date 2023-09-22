import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cours } from 'src/class/cours';
import { KeyValuePair } from 'src/class/keyvaluepair';
import { Niveau } from 'src/class/riders';
import { CoursService } from 'src/services/cours.service';
import { ErrorService } from 'src/services/error.service';
import { RidersService } from 'src/services/riders.service';
import { notification } from '../custom-notification/custom-notification.component';

@Component({
  selector: 'app-gerer-cours',
  templateUrl: './gerer-cours.component.html',
  styleUrls: ['./gerer-cours.component.css']
})
export class GererCoursComponent implements OnInit {
  // cours.component.ts
  constructor(private coursservice:CoursService, private ridersservice:RidersService, private router:Router){}
listeprof:KeyValuePair[];
listelieu:KeyValuePair[];
est_prof:boolean =false;
est_admin:boolean = false;
season_id:number;
seasons:KeyValuePair[];
  listeCours: Cours[] = []; // Initialisez la liste des cours (vous pouvez la charger à partir d'une API, par exemple)
  editMode = false;
  editCours: Cours | null = null;
  niveauxRequis: Niveau[] = Object.values(Niveau);

  ngOnInit(): void {
    const errorService = ErrorService.instance;
    let o:notification;
    this.est_prof =RidersService.Est_Prof ;
    this.est_admin=RidersService.Est_Admin ;
    if(RidersService.IsLoggedIn === false ){
      this.router.navigate(['/login']);
    return;
    } 
    if(RidersService.Est_Prof === false && RidersService.Est_Admin === false ){
      this.router.navigate(['/menu-inscription']);
    return;
    } 
    // Chargez la liste des cours
    this.coursservice.GetCours().then((list)=>{
      this.listeCours = list;
    }).catch((err:HttpErrorResponse)=>{
     let o = errorService.CreateError("récupérer les cours",  err.statusText);
     errorService.emitChange(o);
    })
    this.ridersservice.GetProf().then((elka) =>{
      this.listeprof = elka;
    }).catch((err:HttpErrorResponse)=>{
      let o = errorService.CreateError("récupérer les profs",  err.statusText);
      errorService.emitChange(o);
     })
    this.coursservice.GetLieuLight().then((laurie) =>{
      this.listelieu = laurie;
    }).catch((err:HttpErrorResponse)=>{
      let o = errorService.CreateError("récupérer les lieux",  err.statusText);
      errorService.emitChange(o);
     })

    
    this.coursservice.GetSaison().then((list) =>{
      this.seasons = list;
    }).catch((err:HttpErrorResponse)=>{
      let o = errorService.CreateError("récupérer les saisons",  err.statusText);
      errorService.emitChange(o);
     })
  }

  // Méthode pour trouver un professeur à partir de son ID
  trouverProfesseur(profId: number): any {
    // Implémentez la logique pour trouver le professeur à partir de la liste des professeurs
    // que vous pouvez stocker dans une variable
    const indexToUpdate = this.listeprof.findIndex(prof => prof.key === profId);

    if (indexToUpdate !== -1) {
      // Remplacer l'élément à l'index trouvé par la nouvelle valeur
      return this.listeprof[indexToUpdate];
    } else {
      return "Professeur non trouvé";
    }
    
  }

  // Méthode pour trouver un gymnase à partir de son ID
  trouverGymnase(gymId: number): any {
    // Implémentez la logique pour trouver le gymnase à partir de la liste des gymnases
    // que vous pouvez stocker dans une variable
    const indexToUpdate = this.listelieu.findIndex(lieu => lieu.key === gymId);

    if (indexToUpdate !== -1) {
      // Remplacer l'élément à l'index trouvé par la nouvelle valeur
      return this.listelieu[indexToUpdate];
    } else {
      return "Lieu non trouvé";
    }
  }

  editerCours(cours: Cours): void {
    this.editCours = { ...cours };
    this.editMode = true;
  }

  supprimerCours(cours: Cours): void {
    let errorservice = ErrorService
    let act ="Ajouter un cours";
    if (cours) {
      this.coursservice.Delete(cours.id).then((result) => {
        if (result) {
          // Suppression réussie en base, supprimer l'élément correspondant de la liste
          this.listeCours = this.listeCours.filter(c => c.id !== cours.id);
      
          // Afficher un message de confirmation à l'utilisateur
          errorservice.instance.OKMessage(act);
        } else {
          errorservice.instance.CreateError(act,"erreur lors de la suppression");
        }
      }).catch((elkerreur:HttpErrorResponse)=>{
          errorservice.instance.CreateError(act,  elkerreur.statusText);
        })
      }
  }

  creerCours(): void {
    this.editCours = new Cours();
    this.editMode = true;
  }

  soumettreCours(): void {
    let errorservice = ErrorService
    let act ="Ajouter un cours";
    if (this.editCours) {
      if(this.editCours.id==0){
        this.coursservice.Add(this.editCours).then((loe) =>{
          this.editCours.id = loe;
          errorservice.instance.OKMessage(act);
          this.listeCours.push(this.editCours);
          this.annulerEdition();
        }).catch((elkerreur:HttpErrorResponse)=>{
          errorservice.instance.CreateError(act, elkerreur.statusText);
        })
      }
     else {
      this.coursservice.Update(this.editCours).then((loe) =>{
        
        act ="Mettre à jour un cours"; 
        if (loe) {
        errorservice.instance.OKMessage(act);
        const indexToUpdate = this.listeCours.findIndex(cours => cours.id === this.editCours.id);

        if (indexToUpdate !== -1) {
          // Remplacer l'élément à l'index trouvé par la nouvelle valeur
          this.listeCours[indexToUpdate] = this.editCours;
        }
        this.annulerEdition();} else {
          errorservice.instance.CreateError(act,  "erreur lors de la mise à jour")
        }
      }).catch((elkerreur:HttpErrorResponse)=>{
        errorservice.instance.CreateError(act,  elkerreur.statusText);
      })
    }
    this.editMode = false;}
  }

  annulerEdition(): void {
    this.editMode = false;
    this.editCours = null;
  }

  Filtrer(){
    let errorservice = ErrorService.instance;
    this.coursservice.GetCours().then((result) =>{
      this.listeCours = result;
      let o = errorservice.OKMessage("Recherche de séances");
      errorservice.emitChange(o);
    }).catch((elkerreur:HttpErrorResponse)=>{
      let o =  errorservice.CreateError("Recherche de séances",  elkerreur.statusText);
      errorservice.emitChange(o);
    })
  }
  FiltrerBack(){
    let errorservice = ErrorService.instance;
    this.coursservice.GetCours().then((result) =>{
      this.listeCours = result;
      let o = errorservice.OKMessage("Recherche de séances");
      errorservice.emitChange(o);
    }).catch((elkerreur:HttpErrorResponse)=>{
      let o =  errorservice.CreateError("Recherche de séances",  elkerreur.statusText);
      errorservice.emitChange(o);
    })
  }
}
