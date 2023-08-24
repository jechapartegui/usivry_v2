// import-riders.component.ts

import { Component, Input, OnInit } from '@angular/core';
import * as XLSX from 'xlsx'; // Bibliothèque pour lire les fichiers Excel
import { Niveau, Rider } from '../../class/riders';
import { StaticClass } from '../global';
import { RidersService } from 'src/services/riders.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/services/error.service';


@Component({
  selector: 'gerer-riders',
  templateUrl: './gerer-riders.html',
  styleUrls: ['./gerer-riders.css']
})
export class GererRidersComponent implements OnInit {
  @Input() id:number;
  fileData: any[];
  g:StaticClass = new StaticClass();
  ridersList: Rider[] = [];
  editMode = false;
  editRider: Rider | null = null;
  est_prof:boolean =false;
  est_admin:boolean = false;

  niveauxRequis: Niveau[] = Object.values(Niveau);
  constructor( private _riderser: RidersService, private router:Router) {}

  ngOnInit(): void {
    if(RidersService.IsLoggedIn === false ){
      this.router.navigate(['/login']);
    return;
    } 
    this.est_prof =RidersService.Est_Prof ;
    this.est_admin=RidersService.Est_Prof ;
    
      this._riderser.GetAllThisSeason().then((list)=>{
        this.ridersList = list;
      }).catch((err:HttpErrorResponse)=>{
        let errorservice = ErrorService
        errorservice.instance.CreateError("récupérer les riders",  err.statusText);
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
