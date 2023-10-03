import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Inscription, InscriptionSeance, StatutPresence } from 'src/class/inscription';
import { KeyValuePair } from 'src/class/keyvaluepair';
import { Rider } from 'src/class/riders';
import { Seance } from 'src/class/seance';
import { ErrorService } from 'src/services/error.service';
import { RidersService } from 'src/services/riders.service';
import { SeancesService } from 'src/services/seances.service';

@Component({
  selector: 'app-menu-inscription',
  templateUrl: './menu-inscription.component.html',
  styleUrls: ['./menu-inscription.component.css']
})
export class MenuInscriptionComponent implements OnInit {
  Riders: Rider[] = []; // Initialisez la variable riders avec les données de vos riders
  Seances: Seance[] = []; // La liste des séances
  listeprof: KeyValuePair[];
  CurrentMail: string = "";
  StatutMailActive: boolean = false;
  constructor(private seanceService: SeancesService, private ridersservice: RidersService, private router: Router) { }

  ngOnInit() {
    let errorService = ErrorService.instance;
    if (RidersService.IsLoggedIn === false) {
      this.router.navigate(['/login']);
      return;
    }
    this.Riders = RidersService.ListeRiders;
    //charger seance
    if (this.Riders.length > 0) {
      this.ridersservice.getAccount(this.Riders[0].compte).then((val) => {
        this.CurrentMail = val.login;
        if (val.mail_active == 1) {
          this.StatutMailActive = true;
        } else {
          this.StatutMailActive = false;
        }
      })
    } else {
      this.router.navigate(['/login']);
      let u = errorService.CreateError("Chargement", "Pas de compte attaché");
      errorService.emitChange(u);
    }
  }

  UpdateMailActive() {
    let errorService = ErrorService.instance;
    let ret = 0;
    if (this.StatutMailActive) {
      ret = 1;
    }
    this.ridersservice.UpdateMail_Active(this.Riders[0].compte, ret).then((ret) => {
      let o = errorService.OKMessage("Mise à jour de la relance par mail");
      errorService.emitChange(o);
    }).catch((error) => {
      let n = errorService.CreateError("Mise à jour de la relance par mail", error);
      errorService.emitChange(n);
    });

  }

  // Fonction pour ajouter une séance à un rider
  Add(rider: Rider, seance: Seance, present: boolean, essai: boolean = false) {

    let action = "Se déclarer absent";
    let pre = StatutPresence.Absent;
    if (present) {
      action = "S'inscrire à une séance";
      pre = StatutPresence.Présent;
    }
    let errorService = ErrorService.instance;

    const inscription: Inscription = {
      rider_id: rider.id,
      seance_id: seance.seance_id,
      id: 0,
      date_inscription: undefined,
      statut: pre
    };
    this.seanceService.inscrire(inscription).then((id) => {
      if (id > 0) {
        this.ridersservice.GetRiders().then(() => {
          this.Riders = RidersService.ListeRiders;
        })
        let o = errorService.OKMessage(action);
        errorService.emitChange(o);
      } else {
        let u = errorService.CreateError(action, "Ajout KO");
        errorService.emitChange(u);
      }
    }).catch((error) => {
      let n = errorService.CreateError(action, error);
      errorService.emitChange(n);
    });


  }

  VoirSession(seance: Seance) {
    this.router.navigate(['/ma-seance'], { queryParams: { id: seance.seance_id } });
  }




  // Fonction pour retirer une séance d'un rider
  Update(rider: Rider, inscr: InscriptionSeance, present: boolean) {
    let errorService = ErrorService.instance;
    let action = "Modifier la présence : se déclarer absent";
    let pre = StatutPresence.Absent;
    if (present) {
      action = "Modifier la présence : se déclarer présent";
      pre = StatutPresence.Présent;
    }
    const selectedSeance = rider.inscriptions.find((seance: InscriptionSeance) => seance.id === inscr.id);
    if (selectedSeance) {
      const inscription: Inscription = {
        rider_id: rider.id,
        seance_id: selectedSeance.seance_id,
        id: selectedSeance.id,
        date_inscription: undefined,
        statut: pre
      };
      this.seanceService.desinscrire(inscription).then((ret) => {
        if (ret) {
          this.ridersservice.GetRiders().then(() => {
            this.Riders = RidersService.ListeRiders;
          })
          let o = errorService.OKMessage(action);
          errorService.emitChange(o);
        } else {

          let u = errorService.CreateError(action, "Mise à jour KO");
          errorService.emitChange(u);
        }
      }).catch((error) => {
        let n = errorService.CreateError(action, error);
        errorService.emitChange(n);
      });
    }
  }


  // Fonction pour calculer l'âge en fonction de la date de naissance
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
  EditCompte(rider) {
    this.router.navigate(['/gerer-riders'], { queryParams: { id: rider.id } });
  }

}