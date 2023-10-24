import { Component, OnInit } from '@angular/core';
import { Cours } from 'src/class/cours';
import { Seance, StatutSeance } from 'src/class/seance';
import { KeyValuePair } from 'src/class/keyvaluepair';
import { CoursService } from 'src/services/cours.service';
import { SeancesService } from 'src/services/seances.service';
import { ErrorService } from 'src/services/error.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RidersService } from 'src/services/riders.service';
import { Router } from '@angular/router';
import { notification } from '../custom-notification/custom-notification.component';
import { Groupe } from 'src/class/groupe';
import { GroupeService } from 'src/services/groupe.service';

@Component({
  selector: 'app-gerer-seance',
  templateUrl: './gerer-seance.component.html',
  styleUrls: ['./gerer-seance.component.css']
})
export class GererSeanceComponent implements OnInit {
  listeCours: Cours[] = []; // Initialisez la liste des cours (vous pouvez la charger à partir d'une API, par exemple)
  listelieu: KeyValuePair[] = []; // Initialisez la liste des lieux (vous pouvez la charger à partir d'une API, par exemple)
  listeprof: KeyValuePair[] = []; // Initialisez la liste des lieux (vous pouvez la charger à partir d'une API, par exemple)
  prof_dispo: KeyValuePair[] = []; // Initialisez la liste des lieux (vous pouvez la charger à partir d'une API, par exemple)
  listeSeances: Seance[] = []; // Initialisez la liste des séances (vous pouvez la charger à partir d'une API, par exemple)
  editMode = false;
  editSeance: Seance | null = null;
  est_prof: boolean = false;
  est_admin: boolean = false;
  season_id: number;
  jour_semaine: string = "";
  seasons: KeyValuePair[];
  current_prof:number;
  coursselectionne: boolean = false;  
  current_groupe_id:number;
  groupe_dispo:Groupe[]=[];
  liste_groupe: Groupe[] = []
  constructor(
    private router: Router,
    private coursservice: CoursService,
    private seancesservice: SeancesService,
    private ridersservice: RidersService,
    private grServ: GroupeService,
    private errorservice: ErrorService
  ) { }

  ngOnInit(): void {
    const errorService = ErrorService.instance;
    let o: notification;
    this.est_prof = RidersService.Est_Prof;
    this.est_admin = RidersService.Est_Admin;
    if (RidersService.IsLoggedIn === false) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.grServ.GetAll().then((list) => {
      this.liste_groupe = list;
    }).catch((err: HttpErrorResponse) => {
      errorService.CreateError("récupérer les groupes", err.statusText);
      errorService.emitChange(o);
    });
    if (RidersService.Est_Prof === false && RidersService.Est_Admin === false) {
      this.router.navigate(['/menu-inscription']);
      return;
    }
    // Chargez la liste des cours
    this.coursservice.GetCours().then((list) => {
      this.listeCours = list;
    }).catch((err: HttpErrorResponse) => {
      let o = errorService.CreateError("récupérer les cours", err.statusText);
      errorService.emitChange(o);
    })
    this.ridersservice.GetProf().then((elka) => {
      this.listeprof = elka;
    }).catch((err: HttpErrorResponse) => {
      let o = errorService.CreateError("récupérer les profs", err.statusText);
      errorService.emitChange(o);
    })
    this.coursservice.GetLieuLight().then((laurie) => {
      this.listelieu = laurie;
    }).catch((err: HttpErrorResponse) => {
      let o = errorService.CreateError("récupérer les lieux", err.statusText);
      errorService.emitChange(o);
    })

    // Chargez la liste des séances
    this.seancesservice.GetAllSeances().then((list) => {
      this.listeSeances = list;
    }).catch((err: HttpErrorResponse) => {
      let o = errorService.CreateError("récupérer les séances", err.statusText);
      errorService.emitChange(o);
    })
    this.coursservice.GetSaison().then((list) => {
      this.seasons = list;
    }).catch((err: HttpErrorResponse) => {
      let o = errorService.CreateError("récupérer les saisons", err.statusText);
      errorService.emitChange(o);
    })
  }

 

  AjouterProf() { 
    let kvp = this.prof_dispo.filter(e => e.key == this.current_prof)[0];
    console.log(kvp);
      this.editSeance.professeurs.push(kvp);
    this.current_prof = null;
    this.MAJListeProf();
  }
  RemoveProf(item){
    this.editSeance.professeurs = this.editSeance.professeurs.filter(e => e.key !== item.key);
    this.MAJListeProf();
  }
  MAJListeProf(){
    this.prof_dispo = this.listeprof; 
    this.editSeance.professeurs.forEach(element => {
      let element_to_remove = this.listeprof.find(e => e.key == element.key);
      if (element_to_remove) {
        this.prof_dispo = this.prof_dispo.filter(e => e.key !== element_to_remove.key);
      }
    });
  }
  AjouterGroupe() { 
    const indexToUpdate = this.liste_groupe.findIndex(cc => cc.id === this.current_groupe_id);
    const newValue = this.liste_groupe[indexToUpdate];
    this.editSeance.groupes.push(newValue);
    this.current_groupe_id = null;
    this.MAJListeGroupe();

  }
  RemoveGroupe(item){
    this.editSeance.groupes = this.editSeance.groupes.filter(e => e.id !== item.id);
    this.MAJListeGroupe();
  }
  MAJListeGroupe(){
    this.groupe_dispo = this.liste_groupe;

    this.editSeance.groupes.forEach((element:Groupe) => {
      let element_to_remove = this.liste_groupe.find(e => e.id == element.id);
      if (element_to_remove) {
        this.groupe_dispo = this.groupe_dispo.filter(e => e.id !== element_to_remove.id);
      }
    });
  }


  editerSeance(seance: Seance): void {
    this.editSeance = seance;
    this.coursselectionne = true;
    this.editMode = true;
   this.MAJListeProf();
   this.MAJListeGroupe();
  }
  onCoursSelectionChange(cours_id: any): void {
    //  console.log('Nouvelle valeur sélectionnée :', newValue);
    if (!isNaN(cours_id)) {
      const indexToUpdate = this.listeCours.findIndex(cc => cc.id === cours_id);
      const newValue = this.listeCours[indexToUpdate];
      this.coursselectionne = true;
      this.editSeance.duree_cours = newValue.duree;
      this.editSeance.age_requis = newValue.age_requis;
      this.editSeance.age_maximum = 99;
      this.editSeance.libelle = newValue.nom;
      this.editSeance.heure_debut = newValue.heure;
      this.editSeance.groupes = [];
      newValue.groupes.forEach((el) =>{
        this.editSeance.groupes.push(el);
      })
      this.editSeance.lieu_id = newValue.lieu_id;
      this.jour_semaine = newValue.jour_semaine;
    } else {
      this.coursselectionne = false;
    }
    this.MAJListeGroupe();
    // Faites ce que vous voulez avec la nouvelle valeur sélectionnée ici
  }

  isProfInEditSeance(prof: KeyValuePair): boolean {
    return this.editSeance.professeurs.some(p => p.value === prof.value);
  }

  supprimerSeance(seance: Seance): void {
    let errorService = ErrorService.instance;
    let o = notification;
    let act = "Supprimer une séance";
    let confirmation = window.confirm("Cette action est définitive et peut avoir des répercutions sur les adhérents inscrits, êtes-vous sûr de vouloir confirmer la suppresion ?")
    if (confirmation && seance) {
      this.seancesservice.Delete(seance.seance_id).then((result) => {
        if (result) {
          // Suppression réussie en base, supprimer l'élément correspondant de la liste
          this.listeSeances = this.listeSeances.filter(c => c.seance_id !== seance.seance_id);

          // Afficher un message de confirmation à l'utilisateur
          let o = errorService.OKMessage(act);
          errorService.emitChange(o);
        } else {
          let o = errorService.CreateError(act, "erreur inconnue");
          errorService.emitChange(o);
        }
      }).catch((err: HttpErrorResponse) => {
        let o = errorService.CreateError(act, err.statusText);
        errorService.emitChange(o);
      })
    }

  }

  creerSeance(): void {
    this.editSeance = new Seance();
    this.coursselectionne = false;
    this.editMode = true;
    this.MAJListeProf();
    this.MAJListeGroupe();
  }

  VoirMaSeance() {
    let confirmation = window.confirm("Voulez-vous aller vers la vue du professeur ? les modifications non sauvegardées seront perdues");
    if (confirmation) {
      this.router.navigate(['/ma-seance'], { queryParams: { id: this.editSeance.seance_id } });

    }
  }

  soumettreSeance(): void {
    let errorService = ErrorService.instance;
    let o = notification;
    let act = "Ajouter un séance";
    if (this.editSeance) {
      if (this.editSeance.seance_id == 0) {
        this.seancesservice.Add(this.editSeance).then((loe) => {
          this.editSeance.seance_id = loe;
          let o = errorService.OKMessage(act);
          errorService.emitChange(o);
          this.listeSeances.push(this.editSeance);
          this.annulerEdition();
        }).catch((err: HttpErrorResponse) => {
          let o = errorService.CreateError(act, err.statusText);
          errorService.emitChange(o);
        })
      }
      else {
        this.seancesservice.Update(this.editSeance).then((loe) => {

          act = "Mettre à jour une séance";
          if (loe) {
            let o = errorService.OKMessage(act);
            errorService.emitChange(o);
            const indexToUpdate = this.listeSeances.findIndex(Seance => Seance.seance_id === this.editSeance.seance_id);

            if (indexToUpdate !== -1) {
              // Remplacer l'élément à l'index trouvé par la nouvelle valeur
              this.listeSeances[indexToUpdate] = this.editSeance;
            }
            this.annulerEdition();
          } else {
            let o = errorService.CreateError(act, "erreur lors de la mise à jour");
            errorService.emitChange(o);
          }
        }).catch((err: HttpErrorResponse) => {
          let o = errorService.CreateError(act, err.statusText);
          errorService.emitChange(o);
        })
      }
      this.editMode = false;
    }
  }

  annulerEdition(): void {
    this.editMode = false;
    this.editSeance = null;
  }

  Filtrer() {
    let errorservice = ErrorService.instance;
    this.seancesservice.GetAllSeances(true).then((result) => {
      this.listeSeances = result;
      let o = errorservice.OKMessage("Recherche de séances");
      errorservice.emitChange(o);
    }).catch((elkerreur: HttpErrorResponse) => {
      let o = errorservice.CreateError("Recherche de séances", elkerreur.statusText);
      errorservice.emitChange(o);
    })
  }
  FiltrerBack() {
    let errorservice = ErrorService.instance;
    this.seancesservice.GetSeance().then((result) => {
      this.listeSeances = result;
      let o = errorservice.OKMessage("Recherche de séances");
      errorservice.emitChange(o);
    }).catch((elkerreur: HttpErrorResponse) => {
      let o = errorservice.CreateError("Recherche de séances", elkerreur.statusText);
      errorservice.emitChange(o);
    })
  }
}
