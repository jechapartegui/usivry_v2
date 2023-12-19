import { Component, OnInit } from '@angular/core';
import { saison, saison_VM } from 'src/class/saison';
import { ErrorService } from 'src/services/error.service';
import { SaisonService } from 'src/services/saison.service';

@Component({
  selector: 'app-gerer-saison',
  templateUrl: './gerer-saison.component.html',
  styleUrls: ['./gerer-saison.component.css']
})
export class GererSaisonComponent implements OnInit {
  public liste_saison:saison[];
  public liste_saison_VM: saison_VM[];
  action: string;
  constructor(private saisons: SaisonService) {

  }
  ngOnInit(): void {
    this.action = $localize`Chargement des saisonx`;
    const errorService = ErrorService.instance;
    this.saisons.GetAll().then((ll) => {
      this.liste_saison = ll;
      var new_saison = new saison();
      this.liste_saison.push(new_saison);
      this.liste_saison_VM = this.liste_saison.map(x => new saison_VM(x));
      let o = errorService.OKMessage(this.action);
      errorService.emitChange(o);
    }).catch((err) => {
      let o = errorService.CreateError(this.action, err.statusText);
      errorService.emitChange(o);
    });
  }

  Reinit(thisl: saison_VM) {
    let confirmation = window.confirm($localize`Cette action annulera l'ensemble des modifications sur cette saison ?`);
    if(confirmation){
      const saison_avant: saison = this.liste_saison.find(x => x.id === thisl.id);
      const index_saison_apres: number = this.liste_saison_VM.findIndex(x => x.id === thisl.id);
    
      if (saison_avant !== undefined && index_saison_apres !== -1) {
        this.liste_saison_VM[index_saison_apres] = new saison_VM(saison_avant);
      }
    }
   
  }

  Delete(thisl: saison_VM) {
    let confirmation = window.confirm($localize`Cette suppression peut avoir des conséquences sur l'affichage des adhérents / séances / cours qui ont cette saison, voulez-vous confirmer ?`);
    if(confirmation){    
      this.action = $localize`Suppression de la saison`;
      const errorService = ErrorService.instance;  
      this.saisons.Delete(thisl.id).then((retour)=>{
        if(retour){
          this.liste_saison = this.liste_saison.filter(x => x.id !== thisl.id);
          this.liste_saison_VM = this.liste_saison_VM.filter(x => x.id !== thisl.id); 
          let o = errorService.OKMessage(this.action);
          errorService.emitChange(o);
        } else {
          let o = errorService.CreateError(this.action, $localize`Erreur inconnue`);
          errorService.emitChange(o);
        }
        }).catch((err) => {
          let o = errorService.CreateError(this.action, err.statusText);
          errorService.emitChange(o);
        });
    }
  }

  Save(current_saison: saison_VM) {
    this.action = $localize`Edition d'une saison`;
    const errorService = ErrorService.instance;
    var old_saison:saison = this.liste_saison.find(x => x.id == current_saison.id);
    var new_saison:saison = current_saison.ToSaison();
    if (new_saison.id == 0) {
      this.action = $localize`Ajouter une saison`;
      this.saisons.Add(new_saison).then((id) => {
        new_saison.id = id;
        current_saison.id = id;
        old_saison = new_saison;
        current_saison.editing= false;
        var l2: saison = new saison();
        this.liste_saison.push(l2);
        this.liste_saison_VM.push(new saison_VM(l2));
        let o = errorService.OKMessage(this.action);
        errorService.emitChange(o);
      }).catch((err) => {
        let o = errorService.CreateError(this.action, err.statusText);
        errorService.emitChange(o);
      });
    } else {
      this.action = $localize`Sauvegarder une saison`;
      this.saisons.Update(new_saison).then((retour) => {
        if (retour) {
          old_saison = new_saison;
          current_saison.editing= false;
          let o = errorService.OKMessage(this.action);
          errorService.emitChange(o);

        } else {
          let o = errorService.CreateError(this.action, $localize`Erreur inconnue`);
          errorService.emitChange(o);
        }
      }).catch((err) => {
        let o = errorService.CreateError(this.action, err.statusText);
        errorService.emitChange(o);
      });
    }
  }
}

