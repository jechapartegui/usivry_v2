import { Component, OnInit } from '@angular/core';
import { lieu } from 'src/class/lieu';
import { ErrorService } from 'src/services/error.service';
import { LieuService } from 'src/services/lieu.service';

@Component({
  selector: 'app-gerer-lieu',
  templateUrl: './gerer-lieu.component.html',
  styleUrls: ['./gerer-lieu.component.css']
})
export class GererLieuComponent implements OnInit {
  public lieux: lieu[];
  action: string;
  constructor(private lieus: LieuService) {

  }
  ngOnInit(): void {
    this.action = $localize`Chargement des lieux`;
  const errorService = ErrorService.instance;
    this.lieus.GetAll().then((ll) => {
      this.lieux = ll;
      var l2 = new lieu();
      this.lieux.push(l2);   
      let o = errorService.OKMessage(this.action);
      errorService.emitChange(o);
    }).catch((err) => {
      let o = errorService.CreateError(this.action, err.statusText);
      errorService.emitChange(o);
    });
  }

  Save(lieu: lieu) {
    this.action = $localize`Edition du lieu`;
    const errorService = ErrorService.instance;
    if(lieu.nom.length<3){
      let o = errorService.CreateError(this.action, $localize`Nom du lieu trop court`);
    } else {
      if (lieu.id == 0) {
        this.action = $localize`Ajouter un lieu`;
        this.lieus.Add(lieu).then((id) => {
          this.lieux.find(x => x.id == 0).id = id;
          var l2: lieu;
          l2.id = 0;
         this.lieux.push(l2);   
          let o = errorService.OKMessage(this.action);
          errorService.emitChange(o);
        }).catch((err) => {
          let o = errorService.CreateError(this.action, err.statusText);
          errorService.emitChange(o);
        });
      } else {
        this.action = $localize`Sauvegarder un lieu`;
        this.lieus.Update(lieu).then((retour) => {
       if(retour){
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
}
