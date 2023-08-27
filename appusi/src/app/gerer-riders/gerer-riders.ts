// import-riders.component.ts

import { Component, Input, OnInit } from '@angular/core';
import * as XLSX from 'xlsx'; // Bibliothèque pour lire les fichiers Excel
import { Niveau, Rider } from '../../class/riders';
import { StaticClass } from '../global';
import { RidersService } from 'src/services/riders.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/services/error.service';
import { notification } from '../custom-notification/custom-notification.component';


@Component({
  selector: 'gerer-riders',
  templateUrl: './gerer-riders.html',
  styleUrls: ['./gerer-riders.css']
})
export class GererRidersComponent implements OnInit {
  id:number =0;
  situation: "MY_UPDATE" | "UPDATE" | "CREATE" | "ADD" | "LIST";
  fileData: any[];
  g:StaticClass = new StaticClass();
  ridersList: Rider[] = [];
  editMode = false;
  editRider: Rider | null = null;
  est_prof:boolean =false;
  est_admin:boolean = false;
  mdp_actuel:string="";
  new_mdp:string ="";
  new_mdp_confirm="";

  niveauxRequis: Niveau[] = Object.values(Niveau);
  constructor( private _riderser: RidersService, private router:Router,private route: ActivatedRoute) {}

  ngOnInit(): void { 
    const errorService = ErrorService.instance;
    let o:notification;
    this.est_prof =RidersService.Est_Prof ;
    this.est_admin=RidersService.Est_Admin ;
    this.route.queryParams.subscribe(params => {
      if ('id' in params) {
        this.id = params['id'];
        this.situation = "MY_UPDATE";
      }
    });
    if(RidersService.IsLoggedIn === false && this.id != -2 ){
      this.router.navigate(['/login']);
      return;
    } else if(this.id == -2){
      this.situation = "CREATE";
      this.editMode = true;
      this.editRider = new Rider(-2,"","",new Date(),false,Niveau.Débutant,"","ivry","","","","");
      this.editRider.essai_restant = 2;
    } else if(this.id>0){
    //Afficher le rider :
    //si rider dans la liste => on l'affiche sinon erreur
    if (RidersService.Riders.find(x => x.id==this.id)) {
      this.editMode = true;
      this.editRider = RidersService.Riders.find(x => x.id==this.id);
      if(this.situation== "MY_UPDATE"){
        this.situation = "UPDATE";
      }
    } else {
      this.router.navigate(['/menu-inscription']);
    }  
  } else if(this.id == 0){
    if(!this.est_admin){
      this.router.navigate(['/menu-inscription']);
    } else {
      this.editMode = false;
      this.situation = "LIST";
      this._riderser.GetAllThisSeason().then((list)=>{
        this.ridersList = list;
      }).catch((err:HttpErrorResponse)=>{
        errorService.CreateError("récupérer les riders",  err.statusText);
        errorService.emitChange(o);
      })
    }
  } else if (this.id == -1) {
  this.editMode = true;
  this.editRider = new Rider(-1,"","",new Date(),false,Niveau.Débutant,"","ivry","","","","");
  this.situation = "ADD";
     
    }
      
     
  }

  ModifMail(){
    const errorService = ErrorService.instance;
    let o:notification;
    this._riderser.UpdateMail(this.editRider.compte, this.editRider.email, this.mdp_actuel).then((boooo)=>{
    if(boooo){
     o=  errorService.OKMessage("Modification de l'émail");
     errorService.emitChange(o);
    } else {
      o= errorService.CreateError("Modification de l'émail",  "erreur inconnue");
      errorService.emitChange(o);
    }
    }).catch((err:HttpErrorResponse)=>{
      o=  errorService.CreateError("Modification de l'émail",  err.statusText);
      errorService.emitChange(o);
    })
  }

  ModifMDP(){
    const errorService = ErrorService.instance;
    let o:notification;
    this._riderser.UpdateMDP(this.editRider.email, this.mdp_actuel, this.new_mdp).then((boooo)=>{
    if(boooo){
     o= errorService.OKMessage("Modification du mot de passe");
     errorService.emitChange(o);
    } else {
      o= errorService.CreateError("Modification du mot de passe",  "erreur inconnue");
      errorService.emitChange(o);
    }
    }).catch((err:HttpErrorResponse)=>{
      o= errorService.CreateError("Modification du mot de passe",  err.statusText);
      errorService.emitChange(o);
    })
  }
 

  editerRiders(rider: Rider): void {
    this.editRider = { ...rider };
    this.editMode = true;
  }
  
  calculateAge(dateNaissance: Date): number {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  supprimerRiders(rider: Rider): void {
    const isConfirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ?');

    if (isConfirmed) {

    let errorservice = ErrorService
    let act ="Supprimer un rider";
    if (rider) {
      this._riderser.Delete(rider.id).then((result) => {
        if (result) {
          // Suppression réussie en base, supprimer l'élément correspondant de la liste
          this.ridersList = this.ridersList.filter(c => c.id !== rider.id);
      
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
  }

  creerRiders(): void {
    this.editRider = new Rider(0,"","",new Date(),false, Niveau.Débutant, "", "ivry","","","","",0,0,false,false,false, null,null, null);
    this.editMode = true;
  }

  soumettreRiders(): void {
    let errorservice = ErrorService
    let act ="Ajouter un rider";
    if (this.editRider) {
      if(this.editRider.id==0){
        this._riderser.AddWithInscriptionWithPassword(this.editRider).then((loe) =>{
          this.editRider = loe;
          errorservice.instance.OKMessage(act);
          this.ridersList.push(this.editRider);
          this.annulerEdition();
        }).catch((elkerreur:HttpErrorResponse)=>{
          errorservice.instance.CreateError(act, elkerreur.statusText);
        })
      }
     else {
      this._riderser.Update(this.editRider).then((loe) =>{
        
        act ="Mettre à jour un rider"; 
        if (loe) {
        errorservice.instance.OKMessage(act);
        const indexToUpdate = this.ridersList.findIndex(rider => rider.id === this.editRider.id);

        if (indexToUpdate !== -1) {
          // Remplacer l'élément à l'index trouvé par la nouvelle valeur
          this.ridersList[indexToUpdate] = this.editRider;
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
    this.editRider = null;
    switch(this.situation){
      case "ADD" :
        this.router.navigate(['/menu-inscription']);
      break;
      case "CREATE":
        this.router.navigate(['/default']);
        break;
        case "LIST":
          break;
          case "MY_UPDATE" :
            this.router.navigate(['/menu-inscription']);
          break;
          case "UPDATE":
        this.situation = "LIST";
          break
    }
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.SheetNames[0];
      this.fileData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], { header: 1 });
    };
    fileReader.readAsArrayBuffer(file);
  }

  

  importData() {
    if (!this.fileData) return;

    this.fileData.slice(1).forEach((row: any) => {
      const rider: Rider = {
        nom: row[2],
        prenom: row[3],
        date_naissance: this.g.parseExcelDate(row[10]),
        sexe: row[9].toLowerCase() === 'monsieur',
        niveau: Niveau.Débutant,
        adresse: `${row[12]} ${row[13]} ${row[14]}`,
        mot_de_passe: 'ivry',
        telephone: row[20],
        personne_prevenir: `${row[25]} ${row[26]}`,
        telephone_personne_prevenir: `${row[27]} ${row[28]}`,
        email: row[1],
        compte: 0,
        essai_restant: 0,
        est_prof: false,
        est_admin: false,
        est_inscrit:true,
        id: 0,
        inscriptions: [],
        seances: [],
        seances_prof:[]
      };
      this.ridersList.push(rider);
      
    });
    this._riderser.AddRange(this.ridersList).then((t:boolean)=>{
      console.log("ca marche");
    }).catch((ee)=>{
      console.log(ee);
    })
    
  }
}
