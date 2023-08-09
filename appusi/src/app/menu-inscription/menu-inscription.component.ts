import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  selectedSeanceId: number | null = null; // L'ID de la séance sélectionnée dans la liste déroulante
  MesSeancesProf:Seance[];
  listeprof:KeyValuePair[];
  constructor(private seanceService: SeancesService, private ridersservice:RidersService) {}

  ngOnInit() {
    this.Riders = RidersService.ListeRiders;
   //charger seance
   this.ridersservice.GetProf().then((elka) =>{
    this.listeprof = elka;
  }).catch((elkerreur:HttpErrorResponse)=>{
    let errorservice = ErrorService
    errorservice.instance.CreateError("récupérer les profs", elkerreur.status, elkerreur.statusText);
  })
   //charger inscription par rider

   // charger mes seances prof si y'a un prof
  }
    
     
  
    // Fonction pour ajouter une séance à un rider
    onAddSession(rider: Rider, seance:Seance) {
      if (seance !== null) {

          const inscription: Inscription = {
            rider_id: rider.id,
            seance_id: seance.id,
            id: 0,
            date_inscription: undefined,
            statut: StatutPresence.Présent
          };
          this.seanceService.inscrire(inscription);
        }
    }
    Absent(rider: Rider) {
      if (this.selectedSeanceId !== null) {
        const selectedSeance = this.Seances.find((seance : Seance) => seance.id === this.selectedSeanceId);
        if (selectedSeance) {
          const inscription: Inscription = {
            rider_id: rider.id,
            seance_id: selectedSeance.id,
            id: 0,
            date_inscription: undefined,
            statut: StatutPresence.Absent
          };
          this.seanceService.inscrire(inscription);
        }
      }
    }
  
    // Fonction pour retirer une séance d'un rider
    onRemoveSession(rider: Rider, inscr: InscriptionSeance) {
      const selectedSeance = rider.inscriptions.find((seance : InscriptionSeance) => seance.seance_id === inscr.seance_id);
      if (selectedSeance) {
        const inscription: Inscription = {
          rider_id: rider.id,
          seance_id: selectedSeance.id,
          id: 0,
          date_inscription: undefined,
          statut: StatutPresence.Absent
        };
        this.seanceService.desinscrire(inscription);
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
  onCardClick(rider){
    
  }

}