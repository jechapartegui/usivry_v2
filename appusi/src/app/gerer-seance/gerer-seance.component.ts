import { Component, OnInit } from '@angular/core';
import { Cours } from 'src/class/cours';
import { Seance, StatutSeance } from 'src/class/seance';
import { KeyValuePair } from 'src/class/keyvaluepair';
import { Niveau } from 'src/class/riders';
import { CoursService } from 'src/services/cours.service';
import { SeancesService } from 'src/services/seances.service';
import { ErrorService } from 'src/services/error.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RidersService } from 'src/services/riders.service';

@Component({
  selector: 'app-gerer-seance',
  templateUrl: './gerer-seance.component.html',
  styleUrls: ['./gerer-seance.component.css']
})
export class GererSeanceComponent implements OnInit {
  listeCours: KeyValuePair[] = []; // Initialisez la liste des cours (vous pouvez la charger à partir d'une API, par exemple)
  listelieu: KeyValuePair[] = []; // Initialisez la liste des lieux (vous pouvez la charger à partir d'une API, par exemple)
  listeprof: KeyValuePair[] = []; // Initialisez la liste des lieux (vous pouvez la charger à partir d'une API, par exemple)
  listeSeances: Seance[] = []; // Initialisez la liste des séances (vous pouvez la charger à partir d'une API, par exemple)
  editMode = false;
  editSeance: Seance | null = null;
  niveauxRequis: Niveau[] = Object.values(Niveau);

  constructor(
    private coursservice: CoursService,
    private seancesservice: SeancesService,
    private ridersservice:RidersService,
    private errorservice: ErrorService
  ) {}

  ngOnInit(): void {
    // Chargez la liste des cours
    this.coursservice.GetCoursLight().then((list)=>{
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

    // Chargez la liste des séances
    this.seancesservice.GetAllSeances().then((list) => {
      this.listeSeances = list;
    }).catch((err) => {
      ErrorService.instance.CreateError("récupérer les séances", err.status, err.statusText);
    });
  }

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
  trouverCours(coursId: number): any {
    // Implémentez la logique pour trouver le gymnase à partir de la liste des gymnases
    // que vous pouvez stocker dans une variable
    const indexToUpdate = this.listeCours.findIndex(cc => cc.key === coursId);

    if (indexToUpdate !== -1) {
      // Remplacer l'élément à l'index trouvé par la nouvelle valeur
      return this.listeCours[indexToUpdate];
    } else {
      return "Cours non trouvé";
    }
  }

  editerSeance(seance: Seance): void {
    this.editSeance = { ...seance };
    this.editMode = true;
  }

  supprimerSeance(seance: Seance): void {
    let errorservice = ErrorService
    let act ="Ajouter un cours";
    if (seance) {
      this.seancesservice.Delete(seance.id).then((result) => {
        if (result) {
          // Suppression réussie en base, supprimer l'élément correspondant de la liste
          this.listeSeances = this.listeSeances.filter(c => c.id !== seance.id);
      
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

  creerSeance(): void {
    this.editSeance = new Seance(0,0,new Date(),"",0,0,"","",StatutSeance.prévue,[], 0,Niveau.Débutant);
    this.editMode = true;
  }

  soumettreSeance(): void {
    let errorservice = ErrorService
    let act ="Ajouter un séance";
    if (this.editSeance) {
      if(this.editSeance.id==0){
        this.seancesservice.Add(this.editSeance).then((loe) =>{
          this.editSeance.id = loe;
          errorservice.instance.OKMessage(act);
          this.listeSeances.push(this.editSeance);
          this.annulerEdition();
        }).catch((elkerreur:HttpErrorResponse)=>{
          errorservice.instance.CreateError(act, elkerreur.status, elkerreur.statusText);
        })
      }
     else {
      this.seancesservice.Update(this.editSeance).then((loe) =>{
        
        act ="Mettre à jour une séance"; 
        if (loe) {
        errorservice.instance.OKMessage(act);
        const indexToUpdate = this.listeSeances.findIndex(Seance => Seance.id === this.editSeance.id);

        if (indexToUpdate !== -1) {
          // Remplacer l'élément à l'index trouvé par la nouvelle valeur
          this.listeSeances[indexToUpdate] = this.editSeance;
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
    this.editSeance = null;
  }
}
