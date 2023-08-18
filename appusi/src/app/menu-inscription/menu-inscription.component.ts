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
  constructor(private seanceService: SeancesService, private ridersservice: RidersService, private router: Router) { }

  ngOnInit() {
    if (RidersService.IsLoggedIn === false) {
      this.router.navigate(['/login']);
      return;
    }
    this.Riders = RidersService.ListeRiders;
    //charger seance
    this.ridersservice.GetProf().then((elka) => {
      this.listeprof = elka;
    }).catch((elkerreur: HttpErrorResponse) => {
      let errorservice = ErrorService
      errorservice.instance.CreateError("récupérer les profs", elkerreur.statusText);
    })
    //charger inscription par rider

    // charger mes seances prof si y'a un prof
  }



  // Fonction pour ajouter une séance à un rider
  Add(rider: Rider, seance: Seance, present: boolean) {
    console.log(seance);
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
  onCardClick(rider) {

  }

}