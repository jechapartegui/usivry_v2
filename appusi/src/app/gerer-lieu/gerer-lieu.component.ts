import { Component, OnInit } from '@angular/core';
import { lieu, lieu_VM } from 'src/class/lieu';
import { ErrorService } from 'src/services/error.service';
import { LieuService } from 'src/services/lieu.service';

@Component({
  selector: 'app-gerer-lieu',
  templateUrl: './gerer-lieu.component.html',
  styleUrls: ['./gerer-lieu.component.css']
})
export class GererLieuComponent implements OnInit {
  public liste_lieu:lieu[];
  public liste_lieu_VM: lieu_VM[];
  action: string;
  constructor(private lieus: LieuService) {

  }
  ngOnInit(): void {
    this.action = $localize`Chargement des lieux`;
    const errorService = ErrorService.instance;
    this.lieus.GetAll().then((ll) => {
      this.liste_lieu = ll;
      var new_lieu = new lieu();
      this.liste_lieu.push(new_lieu);
      this.liste_lieu_VM = this.liste_lieu.map(x => new lieu_VM(x));
      let o = errorService.OKMessage(this.action);
      errorService.emitChange(o);
    }).catch((err) => {
      let o = errorService.CreateError(this.action, err.statusText);
      errorService.emitChange(o);
    });
  }

  Reinit(thisl: lieu_VM) {
    let confirmation = window.confirm($localize`Cette action annulera l'ensemble des modifications sur ce lieu ?`);
    if(confirmation){
      const lieu_avant: lieu = this.liste_lieu.find(x => x.id === thisl.id);
      const index_lieu_apres: number = this.liste_lieu_VM.findIndex(x => x.id === thisl.id);
    
      if (lieu_avant !== undefined && index_lieu_apres !== -1) {
        this.liste_lieu_VM[index_lieu_apres] = new lieu_VM(lieu_avant);
      }
    }
   
  }

  Delete(thisl: lieu_VM) {
    let confirmation = window.confirm($localize`Cette suppression peut avoir des conséquences sur l'affichage des séances / cours qui ont ce lieu, voulez-vous confirmer ?`);
    if(confirmation){    
      this.action = $localize`Suppression du lieu`;
      const errorService = ErrorService.instance;  
      this.lieus.Delete(thisl.id).then((retour)=>{
        if(retour){
          this.liste_lieu = this.liste_lieu.filter(x => x.id !== thisl.id);
          this.liste_lieu_VM = this.liste_lieu_VM.filter(x => x.id !== thisl.id); 
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

  Save(current_lieu: lieu_VM) {
    this.action = $localize`Edition du lieu`;
    const errorService = ErrorService.instance;
    var old_lieu:lieu = this.liste_lieu.find(x => x.id == current_lieu.id);
    var new_lieu:lieu = current_lieu.ToLieu();
    if (new_lieu.id == 0) {
      this.action = $localize`Ajouter un lieu`;
      this.lieus.Add(new_lieu).then((id) => {
        new_lieu.id = id;
        current_lieu.id = id;
        old_lieu = new_lieu;
        current_lieu.editing= false;
        var l2: lieu = new lieu();
        this.liste_lieu.push(l2);
        this.liste_lieu_VM.push(new lieu_VM(l2));
        let o = errorService.OKMessage(this.action);
        errorService.emitChange(o);
      }).catch((err) => {
        let o = errorService.CreateError(this.action, err.statusText);
        errorService.emitChange(o);
      });
    } else {
      this.action = $localize`Sauvegarder un lieu`;
      this.lieus.Update(new_lieu).then((retour) => {
        if (retour) {
          old_lieu = new_lieu;
          current_lieu.editing= false;
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
