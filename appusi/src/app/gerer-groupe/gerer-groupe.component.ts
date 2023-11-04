import { Component, OnInit } from '@angular/core';
import { Groupe, Lien_Groupe } from 'src/class/groupe';
import { Rider } from 'src/class/riders';
import { ErrorService } from 'src/services/error.service';
import { GroupeService } from 'src/services/groupe.service';
import { RidersService } from 'src/services/riders.service';

@Component({
  selector: 'app-gerer-groupe',
  templateUrl: './gerer-groupe.component.html',
  styleUrls: ['./gerer-groupe.component.css']
})
export class GererGroupeComponent implements OnInit {
  view: "GROUPE" | "RIDER" = "GROUPE";
  Groupes: Groupe[] = [];
  Liste: Rider[] = [];
  thisgroupe:Groupe = new Groupe();
  constructor(private grse: GroupeService, private ridser: RidersService) { }
  ngOnInit(): void {
    let errorService = ErrorService.instance;
    this.grse.GetAll().then((result) => {
      this.Groupes = result;
      this.ridser.GetAllThisSeason().then((riders) => {
        this.Liste = riders;
      }).catch((error) => {
        let n = errorService.CreateError("Chargement", error);
        errorService.emitChange(n);
      });
    }).catch((error) => {
      let n = errorService.CreateError("Chargement", error);
      errorService.emitChange(n);
    });
  }

  public isGroupe(id_groupe: number, rider: Rider): boolean {
    let u = rider.groupes.filter(x => x.id == id_groupe);
    if (u) {
      if (u.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

  }

  AddOrRemove(groupe: Groupe, rider: Rider, add: boolean) {
    let texte = "Ajout dans le groupe " + groupe.nom + " de " + rider.prenom + " " + rider.nom;
    if (add) {
      rider.groupes.push(groupe);
    } else {
      rider.groupes = rider.groupes.filter(e => e.id !== groupe.id);
      texte = "Suppression du groupe " + groupe.nom + " de " + rider.prenom + " " + rider.nom;
    }
    let LG = new Lien_Groupe();
    LG.objet_id = rider.id;
    LG.objet_type = 'rider';
    LG.groupes = [];
    LG.groupes = rider.groupes.map(x => x.id);
    let errorService = ErrorService.instance;
    this.grse.UpdateLienGroupe(LG).then((retour) => {
      if (retour) {
        let o = errorService.OKMessage(texte);
        errorService.emitChange(o);

      } else {
        let o = errorService.CreateError(texte, "Erreur inconnue");
        errorService.emitChange(o);
        if (add) {
          rider.groupes = rider.groupes.filter(e => e.id !== groupe.id);
        } else {
          rider.groupes.push(groupe);
        }
      }
    }).catch((error) => {
      let n = errorService.CreateError(texte, error);
      errorService.emitChange(n);
      if (add) {
        rider.groupes = rider.groupes.filter(e => e.id !== groupe.id);
      } else {
        rider.groupes.push(groupe);
      }
    });
  }

  AddGroupe(){
    let errorService = ErrorService.instance;
    this.grse.Add(this.thisgroupe).then((id) =>{
      if(id>0){
        this.thisgroupe.id = id;
        let o = errorService.OKMessage("Ajout du groupe " + this.thisgroupe.nom + " avec l'identifiant " + id);
        errorService.emitChange(o);
        this.Groupes.push(this.thisgroupe);
        this.thisgroupe = new Groupe();
      
      } else {
        let n = errorService.CreateError("Ajout du groupe", "Erreur inconnue");
        errorService.emitChange(n);
      }
    }).catch((error) => {
      let n = errorService.CreateError("Ajout du groupe", error);
      errorService.emitChange(n);
    });
  }

  RemoveGroupe(groupe:Groupe){
    let conf = window.confirm("Êtes-vous sur de vouloir supprimer le groupe ?");
    if(conf){
      let errorService = ErrorService.instance;
      this.grse.Delete(groupe.id).then((retour) =>{
        if(retour){
          let o = errorService.OKMessage("Suppression du groupe " + groupe.nom);
          errorService.emitChange(o);
          this.Groupes = this.Groupes.filter(e => e.id !== groupe.id);
        
        } else {
          let n = errorService.CreateError("Ajout du groupe", "Erreur inconnue");
          errorService.emitChange(n);
        }
      }).catch((error) => {
        let n = errorService.CreateError("Ajout du groupe", error);
        errorService.emitChange(n);
      });
    }
   
  }

}
