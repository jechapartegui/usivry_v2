import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cours } from 'src/class/cours';
import { KeyValuePair } from 'src/class/keyvaluepair';
import { Niveau } from 'src/class/riders';
import { CoursService } from 'src/services/cours.service';
import { ErrorService } from 'src/services/error.service';
import { RidersService } from 'src/services/riders.service';

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
  listeCours: Cours[] = []; // Initialisez la liste des cours (vous pouvez la charger à partir d'une API, par exemple)
  editMode = false;
  editCours: Cours | null = null;
  niveauxRequis: Niveau[] = Object.values(Niveau);

  ngOnInit(): void {
      this.coursservice.GetCours().then((list)=>{
        this.listeCours = list;
      }).catch((err:HttpErrorResponse)=>{
        let errorservice = ErrorService
        errorservice.instance.CreateError("récupérer les cours", err.status, err.statusText);
      })
      this.ridersservice.GetProf().then((elka) =>{
        this.listeprof = elka;
      }).catch((elkerreur:HttpErrorResponse)=>{
        let errorservice = ErrorService
        errorservice.instance.CreateError("récupérer les profs", elkerreur.status, elkerreur.statusText);
      })
      this.coursservice.GetLieuLight().then((laurie) =>{
        this.listelieu = laurie;
      }).catch((elkerreur:HttpErrorResponse)=>{
        let errorservice = ErrorService
        errorservice.instance.CreateError("récupérer les lieux", elkerreur.status, elkerreur.statusText);
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
          errorservice.instance.CreateError(act, "", "erreur lors de la suppression");
        }
      }).catch((elkerreur:HttpErrorResponse)=>{
          errorservice.instance.CreateError(act, elkerreur.status, elkerreur.statusText);
        })
      }
  }

  creerCours(): void {
    this.editCours = new Cours(0, '', '', '', 0, 0, 0, 0, Niveau.Débutant);
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
          errorservice.instance.CreateError(act, elkerreur.status, elkerreur.statusText);
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
          errorservice.instance.CreateError(act, "", "erreur lors de la mise à jour")
        }
      }).catch((elkerreur:HttpErrorResponse)=>{
        errorservice.instance.CreateError(act, elkerreur.status, elkerreur.statusText);
      })
    }
    this.editMode = false;}
  }

  annulerEdition(): void {
    this.editMode = false;
    this.editCours = null;
  }
}
