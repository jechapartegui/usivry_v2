// import-riders.component.ts

import { Component } from '@angular/core';
import * as XLSX from 'xlsx'; // Bibliothèque pour lire les fichiers Excel
import { Niveau, Rider } from '../../class/riders';
import { StaticClass } from '../global';
import { RidersService } from 'src/services/riders.service';
import { Router } from '@angular/router';


@Component({
  selector: 'gerer-riders',
  templateUrl: './gerer-riders.html',
  styleUrls: ['./gerer-riders.css']
})
export class GererRidersComponent {
  fileData: any[];
  g:StaticClass = new StaticClass();
  ridersList: Rider[] = [];
  constructor( private _riderser: RidersService) {}
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
        id: 0,
        inscriptions: [],
        seances: []
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
